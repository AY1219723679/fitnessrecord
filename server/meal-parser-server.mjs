import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const app = express();
const port = Number(process.env.MEAL_PARSER_PORT || 8787);

app.use(express.json({ limit: '15mb' }));

const MealAnalysisSchema = z.object({
  summary: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  assumptions: z.array(z.string()),
  items: z.array(
    z.object({
      name: z.string(),
      amountText: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number()
    })
  ),
  totals: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  })
});

const WorkoutAnalysisSchema = z.object({
  workoutType: z.enum([
    'chest_shoulders_core',
    'back_core',
    'legs_circuit',
    'dance',
    'cardio',
    'rest',
    'recovery'
  ]),
  focus: z.enum(['strength', 'volume', 'conditioning', 'skill']),
  durationMinutes: z.number(),
  rpe: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(5),
  painAreas: z.array(z.string()),
  note: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  assumptions: z.array(z.string()),
  exercises: z.array(
    z.object({
      exerciseName: z.string(),
      note: z.string().nullable(),
      sets: z.array(
        z.object({
          weight: z.number(),
          reps: z.number(),
          rpe: z.number().min(1).max(10),
          isPr: z.boolean()
        })
      )
    })
  )
});

const createClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY. Add it to your environment before starting the meal parser server.');
  }

  return new OpenAI({ apiKey });
};

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/meal-analyze', async (request, response) => {
  try {
    const { prompt, imageDataUrl, mealType } = request.body ?? {};

    if ((!prompt || !String(prompt).trim()) && !imageDataUrl) {
      response.status(400).json({ error: 'Missing meal prompt or image.' });
      return;
    }

    const openai = createClient();
    const content = [
      {
        type: 'input_text',
        text: [
          `Meal type: ${mealType ?? 'unknown'}`,
          'Task: Estimate calories, protein, carbs, and fat for this meal.',
          'All user-facing strings in the result must be written in Simplified Chinese.',
          'This includes summary, item names, and assumptions.',
          'The user may provide vague text, incomplete quantities, or a meal photo.',
          'Use best-effort estimation, prefer user-stated quantities, and keep assumptions short and explicit.',
          'If the image is unclear, lower confidence and say so in assumptions.',
          `User description: ${String(prompt ?? '').trim() || 'No extra text provided.'}`
        ].join('\n')
      }
    ];

    if (imageDataUrl) {
      content.push({
        type: 'input_image',
        image_url: imageDataUrl
      });
    }

    const parsed = await openai.responses.parse({
      model: process.env.OPENAI_MEAL_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are a careful sports nutrition assistant. Estimate meal macros conservatively and return structured data only. All user-visible text fields must be in Simplified Chinese.'
        },
        {
          role: 'user',
          content
        }
      ],
      text: {
        format: zodTextFormat(MealAnalysisSchema, 'meal_analysis')
      }
    });

    if (!parsed.output_parsed) {
      response.status(502).json({ error: 'OpenAI returned no parsed meal analysis.' });
      return;
    }

    response.json(parsed.output_parsed);
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Meal analysis failed.'
    });
  }
});

app.post('/api/workout-analyze', async (request, response) => {
  try {
    const { prompt, imageDataUrl, exercises } = request.body ?? {};

    if ((!prompt || !String(prompt).trim()) && !imageDataUrl) {
      response.status(400).json({ error: 'Missing workout prompt or image.' });
      return;
    }

    const openai = createClient();
    const exerciseList = Array.isArray(exercises)
      ? exercises
          .map((exercise) => `${exercise.nameZh} / ${exercise.nameEn} / ${exercise.key}`)
          .join('\n')
      : '';

    const content = [
      {
        type: 'input_text',
        text: [
          'Task: Parse the workout into structured fitness log data.',
          'All user-facing strings in the result must be written in Simplified Chinese.',
          'This includes note, assumptions, and exerciseName.',
          'Use the closest matching exercise names from the supported library when possible.',
          'If an exercise is unclear, keep the best guess and lower confidence.',
          'Prefer explicit set details from the user. If some values are missing, make short assumptions.',
          exerciseList ? `Supported exercise library:\n${exerciseList}` : '',
          `User workout description: ${String(prompt ?? '').trim() || 'No extra text provided.'}`
        ]
          .filter(Boolean)
          .join('\n\n')
      }
    ];

    if (imageDataUrl) {
      content.push({
        type: 'input_image',
        image_url: imageDataUrl
      });
    }

    const parsed = await openai.responses.parse({
      model: process.env.OPENAI_WORKOUT_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are a careful strength training assistant. Convert messy workout notes into structured workout logs. All user-visible text fields must be in Simplified Chinese.'
        },
        {
          role: 'user',
          content
        }
      ],
      text: {
        format: zodTextFormat(WorkoutAnalysisSchema, 'workout_analysis')
      }
    });

    if (!parsed.output_parsed) {
      response.status(502).json({ error: 'OpenAI returned no parsed workout analysis.' });
      return;
    }

    response.json(parsed.output_parsed);
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Workout analysis failed.'
    });
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Meal parser server listening on http://127.0.0.1:${port}`);
});
