import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart
} from 'recharts';
import { Card } from '../ui/Card';

interface ProgressChartsProps {
  weightTrend: Array<{ date: string; weight: number }>;
  trainingVolumeTrend: Array<{ date: string; volume: number }>;
  sleepVsRpe: Array<{ date: string; sleepHours: number; rpe: number }>;
  carbsVsPerformance: Array<{ date: string; carbs: number; topSet: number }>;
}

export function ProgressCharts({
  weightTrend,
  trainingVolumeTrend,
  sleepVsRpe,
  carbsVsPerformance
}: ProgressChartsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="体重变化">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightTrend}>
              <CartesianGrid stroke="#2d3038" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8f96a3" />
              <YAxis stroke="#8f96a3" />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#c7ff6b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="每周训练总量">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trainingVolumeTrend}>
              <CartesianGrid stroke="#2d3038" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8f96a3" />
              <YAxis stroke="#8f96a3" />
              <Tooltip />
              <Bar dataKey="volume" fill="#c7ff6b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="睡眠与训练表现">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sleepVsRpe}>
              <CartesianGrid stroke="#2d3038" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8f96a3" />
              <YAxis stroke="#8f96a3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sleepHours" stroke="#91baff" strokeWidth={3} />
              <Line type="monotone" dataKey="rpe" stroke="#ff8a65" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="碳水与训练表现">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={carbsVsPerformance}>
              <CartesianGrid stroke="#2d3038" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8f96a3" />
              <YAxis stroke="#8f96a3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="carbs" stroke="#c7ff6b" strokeWidth={3} />
              <Line type="monotone" dataKey="topSet" stroke="#ffffff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
