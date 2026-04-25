import type {
  BodyMetric,
  DailyLog,
  Exercise,
  FoodItem,
  Meal,
  UserProfile,
  Workout,
  WorkoutTemplate
} from '../types';

export const mockUser: UserProfile = {
  id: 'user_demo',
  email: 'demo@performancelogbook.app',
  displayName: 'Athlete',
  weightUnit: 'kg'
};

export const exerciseLibrary: Exercise[] = [
  { id: 'ex_bench_press', key: 'bench_press', nameEn: 'Bench Press', nameZh: '杠铃卧推', category: 'push', primaryMuscleGroup: '胸' },
  { id: 'ex_incline_db_press', key: 'incline_dumbbell_press', nameEn: 'Incline Dumbbell Press', nameZh: '上斜哑铃卧推', category: 'push', primaryMuscleGroup: '上胸' },
  { id: 'ex_smith_shoulder_press', key: 'smith_shoulder_press', nameEn: 'Smith Shoulder Press', nameZh: '史密斯肩推', category: 'push', primaryMuscleGroup: '肩' },
  { id: 'ex_pull_up', key: 'pull_up', nameEn: 'Pull-up', nameZh: '引体向上', category: 'pull', primaryMuscleGroup: '背阔肌' },
  { id: 'ex_assisted_pull_up', key: 'assisted_pull_up', nameEn: 'Assisted Pull-up', nameZh: '辅助引体向上', category: 'pull', primaryMuscleGroup: '背阔肌' },
  { id: 'ex_lat_pulldown', key: 'lat_pulldown', nameEn: 'Lat Pulldown', nameZh: '高位下拉', category: 'pull', primaryMuscleGroup: '背阔肌' },
  { id: 'ex_barbell_row', key: 'barbell_row', nameEn: 'Barbell Row', nameZh: '杠铃划船', category: 'pull', primaryMuscleGroup: '中背' },
  { id: 'ex_dumbbell_row', key: 'dumbbell_row', nameEn: 'Dumbbell Row', nameZh: '哑铃划船', category: 'pull', primaryMuscleGroup: '背' },
  { id: 'ex_face_pull', key: 'face_pull', nameEn: 'Face Pull', nameZh: '面拉', category: 'pull', primaryMuscleGroup: '后束' },
  { id: 'ex_straight_arm_pulldown', key: 'straight_arm_pulldown', nameEn: 'Straight-arm Pulldown', nameZh: '直臂下压', category: 'pull', primaryMuscleGroup: '背阔肌' },
  { id: 'ex_lateral_raise', key: 'lateral_raise', nameEn: 'Lateral Raise', nameZh: '侧平举', category: 'push', primaryMuscleGroup: '中束' },
  { id: 'ex_rear_delt_fly', key: 'rear_delt_fly', nameEn: 'Rear Delt Fly', nameZh: '反向飞鸟', category: 'pull', primaryMuscleGroup: '后束' },
  { id: 'ex_rope_crunch', key: 'rope_crunch', nameEn: 'Rope Crunch', nameZh: '绳索卷腹', category: 'core', primaryMuscleGroup: '核心' },
  { id: 'ex_squat', key: 'squat', nameEn: 'Squat', nameZh: '深蹲', category: 'legs', primaryMuscleGroup: '腿部' },
  { id: 'ex_deadlift', key: 'deadlift', nameEn: 'Deadlift', nameZh: '硬拉', category: 'legs', primaryMuscleGroup: '后链' },
  { id: 'ex_leg_curl', key: 'leg_curl', nameEn: 'Leg Curl', nameZh: '腿弯举', category: 'legs', primaryMuscleGroup: '腘绳肌' },
  { id: 'ex_leg_extension', key: 'leg_extension', nameEn: 'Leg Extension', nameZh: '腿屈伸', category: 'legs', primaryMuscleGroup: '股四头' },
  { id: 'ex_hip_thrust', key: 'hip_thrust', nameEn: 'Hip Thrust', nameZh: '臀推', category: 'legs', primaryMuscleGroup: '臀部' },
  { id: 'ex_plank', key: 'plank', nameEn: 'Plank', nameZh: '平板支撑', category: 'core', primaryMuscleGroup: '核心' },
  { id: 'ex_hollow_hold', key: 'hollow_hold', nameEn: 'Hollow Hold', nameZh: '空心支撑', category: 'core', primaryMuscleGroup: '核心' },
  { id: 'ex_dips', key: 'dips', nameEn: 'Dips', nameZh: '双杠臂屈伸', category: 'push', primaryMuscleGroup: '胸 / 肱三头' },
  { id: 'ex_shoulder_external_rotation', key: 'shoulder_external_rotation', nameEn: 'Shoulder External Rotation', nameZh: '肩外旋', category: 'mobility', primaryMuscleGroup: '肩袖' },
  { id: 'ex_light_shoulder_press', key: 'light_shoulder_press', nameEn: 'Light Shoulder Press', nameZh: '轻重量肩推', category: 'push', primaryMuscleGroup: '肩' },
  { id: 'ex_dead_bug', key: 'dead_bug', nameEn: 'Dead Bug', nameZh: '死虫', category: 'core', primaryMuscleGroup: '核心' },
  { id: 'ex_side_plank', key: 'side_plank', nameEn: 'Side Plank', nameZh: '侧桥', category: 'core', primaryMuscleGroup: '核心' },
  { id: 'ex_pallof_press', key: 'pallof_press', nameEn: 'Pallof Press', nameZh: '帕洛夫抗旋转推', category: 'core', primaryMuscleGroup: '核心' },
  { id: 'ex_basic_groove', key: 'basic_groove', nameEn: 'Basic Groove', nameZh: '基础律动', category: 'dance', primaryMuscleGroup: '舞蹈' },
  { id: 'ex_isolation', key: 'isolation', nameEn: 'Isolation', nameZh: '身体分离控制', category: 'dance', primaryMuscleGroup: '舞蹈' },
  { id: 'ex_footwork', key: 'footwork', nameEn: 'Footwork', nameZh: '步伐训练', category: 'dance', primaryMuscleGroup: '舞蹈' },
  { id: 'ex_choreography', key: 'choreography', nameEn: 'Choreography', nameZh: '成品舞编舞', category: 'dance', primaryMuscleGroup: '舞蹈' },
  { id: 'ex_stretching', key: 'stretching', nameEn: 'Stretching', nameZh: '拉伸', category: 'mobility', primaryMuscleGroup: '恢复' }
];

export const foodLibrary: FoodItem[] = [
  { id: 'food_oats', name: '燕麦', defaultUnit: 'g', caloriesPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66.3, fatPer100g: 6.9 },
  { id: 'food_eggs', name: '鸡蛋', defaultUnit: 'piece' },
  { id: 'food_milk', name: '牛奶', defaultUnit: 'ml', caloriesPer100g: 60, proteinPer100g: 3.4, carbsPer100g: 4.8, fatPer100g: 3.2 },
  { id: 'food_yogurt', name: '无糖酸奶', defaultUnit: 'g', caloriesPer100g: 66, proteinPer100g: 4.8, carbsPer100g: 5.2, fatPer100g: 3.0 },
  { id: 'food_whey', name: '蛋白粉', defaultUnit: 'serving' },
  { id: 'food_rice', name: '米饭', defaultUnit: 'g', caloriesPer100g: 116, proteinPer100g: 2.6, carbsPer100g: 25.9, fatPer100g: 0.3 },
  { id: 'food_millet', name: '小米', defaultUnit: 'g', caloriesPer100g: 378, proteinPer100g: 11, carbsPer100g: 73, fatPer100g: 4.2 },
  { id: 'food_potato', name: '土豆', defaultUnit: 'g', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1 },
  { id: 'food_beef', name: '牛肉', defaultUnit: 'g', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15 },
  { id: 'food_chicken_leg', name: '鸡腿', defaultUnit: 'g', caloriesPer100g: 215, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 15 },
  { id: 'food_basa', name: '巴沙鱼', defaultUnit: 'g', caloriesPer100g: 92, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 2.5 },
  { id: 'food_shrimp', name: '虾', defaultUnit: 'g', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { id: 'food_broccoli', name: '西兰花', defaultUnit: 'g', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 6.6, fatPer100g: 0.4 },
  { id: 'food_green_beans', name: '四季豆', defaultUnit: 'g', caloriesPer100g: 31, proteinPer100g: 1.8, carbsPer100g: 7, fatPer100g: 0.1 },
  { id: 'food_strawberry', name: '草莓', defaultUnit: 'g', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3 },
  { id: 'food_banana', name: '香蕉', defaultUnit: 'g', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { id: 'food_pretzels', name: 'Pretzels', defaultUnit: 'g', caloriesPer100g: 380, proteinPer100g: 10, carbsPer100g: 80, fatPer100g: 2.5 }
];

export const mockDailyLogs: DailyLog[] = [
  {
    id: 'log_2026_04_25',
    userId: mockUser.id,
    date: '2026-04-25',
    trainingStatus: 'trained',
    sleepHours: 7.4,
    bedtime: '00:10',
    wakeTime: '07:35',
    sleepQuality: 4,
    mood: 4,
    fatigue: 2,
    stress: 3,
    hunger: 3,
    appetite: '稳定',
    digestion: '正常',
    sorenessAreas: ['背部', '核心'],
    painAreas: [],
    painLevel: 1,
    bodyWeight: 56.8,
    note: '上半身状态不错，热身后肩稳定性更好。'
  },
  {
    id: 'log_2026_04_24',
    userId: mockUser.id,
    date: '2026-04-24',
    trainingStatus: 'dance',
    sleepHours: 6.6,
    bedtime: '00:45',
    wakeTime: '07:20',
    sleepQuality: 3,
    mood: 4,
    fatigue: 4,
    stress: 2,
    hunger: 4,
    appetite: '偏高',
    digestion: '正常',
    sorenessAreas: ['腿后侧'],
    painAreas: ['右肩前束'],
    painLevel: 3,
    bodyWeight: 56.6,
    note: '舞蹈排练时间长，后半段体能下降。'
  }
];

export const mockWorkouts: Workout[] = [
  {
    id: 'workout_1',
    userId: mockUser.id,
    date: '2026-04-25',
    type: 'back_core',
    focus: 'strength',
    durationMinutes: 78,
    rpe: 8,
    energyLevel: 4,
    hasPain: false,
    painAreas: [],
    note: '引体和划船状态都在线。',
    exerciseEntries: [
      {
        id: 'entry_pullup',
        exerciseId: 'ex_pull_up',
        sets: [
          { id: 'set1', exerciseId: 'ex_pull_up', setNumber: 1, weight: 0, reps: 6, rpe: 8, isPr: true },
          { id: 'set2', exerciseId: 'ex_pull_up', setNumber: 2, weight: 0, reps: 5, rpe: 8, isPr: false }
        ]
      },
      {
        id: 'entry_row',
        exerciseId: 'ex_barbell_row',
        sets: [
          { id: 'set3', exerciseId: 'ex_barbell_row', setNumber: 1, weight: 42.5, reps: 8, rpe: 8, isPr: false },
          { id: 'set4', exerciseId: 'ex_barbell_row', setNumber: 2, weight: 42.5, reps: 8, rpe: 8, isPr: false },
          { id: 'set5', exerciseId: 'ex_barbell_row', setNumber: 3, weight: 45, reps: 6, rpe: 9, isPr: true }
        ]
      },
      {
        id: 'entry_core',
        exerciseId: 'ex_rope_crunch',
        sets: [
          { id: 'set6', exerciseId: 'ex_rope_crunch', setNumber: 1, weight: 22.5, reps: 15, rpe: 7, isPr: false }
        ]
      }
    ]
  },
  {
    id: 'workout_2',
    userId: mockUser.id,
    date: '2026-04-22',
    type: 'chest_shoulders_core',
    focus: 'volume',
    durationMinutes: 74,
    rpe: 7,
    energyLevel: 4,
    hasPain: false,
    painAreas: [],
    note: '卧推维持，肩推容量增加。',
    exerciseEntries: [
      {
        id: 'entry_bench',
        exerciseId: 'ex_bench_press',
        sets: [
          { id: 'set7', exerciseId: 'ex_bench_press', setNumber: 1, weight: 35, reps: 8, rpe: 7, isPr: false },
          { id: 'set8', exerciseId: 'ex_bench_press', setNumber: 2, weight: 37.5, reps: 6, rpe: 8, isPr: false }
        ]
      },
      {
        id: 'entry_press',
        exerciseId: 'ex_smith_shoulder_press',
        sets: [
          { id: 'set9', exerciseId: 'ex_smith_shoulder_press', setNumber: 1, weight: 25, reps: 10, rpe: 8, isPr: false },
          { id: 'set10', exerciseId: 'ex_smith_shoulder_press', setNumber: 2, weight: 27.5, reps: 8, rpe: 8, isPr: true }
        ]
      }
    ]
  },
  {
    id: 'workout_3',
    userId: mockUser.id,
    date: '2026-04-24',
    type: 'dance',
    focus: 'skill',
    durationMinutes: 90,
    rpe: 7,
    energyLevel: 3,
    hasPain: true,
    painAreas: ['右肩前束'],
    note: '基础 + 编舞排练。',
    danceDetails: {
      style: 'Urban Choreo',
      practicedBasics: true,
      practicedChoreography: true
    },
    exerciseEntries: [
      {
        id: 'entry_dance_1',
        exerciseId: 'ex_basic_groove',
        sets: [
          { id: 'set11', exerciseId: 'ex_basic_groove', setNumber: 1, weight: 0, reps: 1, rpe: 6, tempo: '25 min', isPr: false }
        ]
      },
      {
        id: 'entry_dance_2',
        exerciseId: 'ex_choreography',
        sets: [
          { id: 'set12', exerciseId: 'ex_choreography', setNumber: 1, weight: 0, reps: 1, rpe: 8, tempo: '40 min', isPr: false }
        ]
      }
    ]
  }
];

export const mockMeals: Meal[] = [
  {
    id: 'meal_1',
    userId: mockUser.id,
    date: '2026-04-25',
    mealType: 'breakfast',
    entries: [
      { id: 'meal_1_e1', foodName: '燕麦', amountText: '40g', grams: 40 },
      { id: 'meal_1_e2', foodName: '牛奶', amountText: '150g', grams: 150 },
      { id: 'meal_1_e3', foodName: '鸡蛋', amountText: '2个' },
      { id: 'meal_1_e4', foodName: '草莓', amountText: '120g', grams: 120 }
    ],
    calories: 452,
    protein: 28,
    carbs: 45,
    fat: 16,
    note: '训练前 3 小时。'
  },
  {
    id: 'meal_2',
    userId: mockUser.id,
    date: '2026-04-25',
    mealType: 'post_workout',
    entries: [
      { id: 'meal_2_e1', foodName: '蛋白粉', amountText: '1 勺' },
      { id: 'meal_2_e2', foodName: '香蕉', amountText: '100g', grams: 100 },
      { id: 'meal_2_e3', foodName: 'Pretzels', amountText: '35g', grams: 35 }
    ],
    calories: 318,
    protein: 27,
    carbs: 41,
    fat: 3,
    note: '恢复碳水。'
  },
  {
    id: 'meal_3',
    userId: mockUser.id,
    date: '2026-04-24',
    mealType: 'dinner',
    entries: [
      { id: 'meal_3_e1', foodName: '米饭', amountText: '180g', grams: 180 },
      { id: 'meal_3_e2', foodName: '巴沙鱼', amountText: '180g', grams: 180 },
      { id: 'meal_3_e3', foodName: '西兰花', amountText: '160g', grams: 160 }
    ],
    calories: 508,
    protein: 42,
    carbs: 54,
    fat: 11
  }
];

export const mockBodyMetrics: BodyMetric[] = [
  {
    id: 'metric_1',
    userId: mockUser.id,
    date: '2026-04-25',
    weight: 56.8,
    waist: 65.2,
    hips: 91,
    chest: 84.5,
    shoulders: 39.2,
    physiqueNote: '上半身线条更清晰。'
  },
  {
    id: 'metric_2',
    userId: mockUser.id,
    date: '2026-04-10',
    weight: 57.3,
    waist: 66,
    hips: 91.5,
    chest: 84,
    shoulders: 38.8,
    physiqueNote: '训练恢复期。'
  }
];

export const mockTemplates: WorkoutTemplate[] = [
  {
    id: 'tpl_chest_strength',
    userId: mockUser.id,
    name: '胸肩重量日',
    type: 'chest_shoulders_core',
    focus: 'strength',
    description: '推类主项 + 肩部力量 + 核心',
    exerciseIds: ['ex_bench_press', 'ex_smith_shoulder_press', 'ex_incline_db_press', 'ex_dips', 'ex_lateral_raise', 'ex_rope_crunch']
  },
  {
    id: 'tpl_back_strength',
    userId: mockUser.id,
    name: '背部重量日',
    type: 'back_core',
    focus: 'strength',
    description: '拉类主项 + 宽度厚度 + 核心',
    exerciseIds: ['ex_pull_up', 'ex_lat_pulldown', 'ex_barbell_row', 'ex_dumbbell_row', 'ex_face_pull', 'ex_straight_arm_pulldown', 'ex_rope_crunch']
  },
  {
    id: 'tpl_shoulder_volume',
    userId: mockUser.id,
    name: '肩部容量日',
    type: 'chest_shoulders_core',
    focus: 'volume',
    description: '后束 / 中束容量堆叠',
    exerciseIds: ['ex_rear_delt_fly', 'ex_lateral_raise', 'ex_face_pull', 'ex_shoulder_external_rotation', 'ex_light_shoulder_press']
  },
  {
    id: 'tpl_core_day',
    userId: mockUser.id,
    name: '核心强化日',
    type: 'recovery',
    focus: 'conditioning',
    description: '核心抗伸展 + 抗旋转',
    exerciseIds: ['ex_dead_bug', 'ex_hollow_hold', 'ex_plank', 'ex_side_plank', 'ex_rope_crunch', 'ex_pallof_press']
  },
  {
    id: 'tpl_dance_day',
    userId: mockUser.id,
    name: '舞蹈训练日',
    type: 'dance',
    focus: 'skill',
    description: '舞蹈基础 + 编舞 + 拉伸',
    exerciseIds: ['ex_basic_groove', 'ex_isolation', 'ex_footwork', 'ex_choreography', 'ex_stretching']
  }
];
