import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CheckInPage } from './pages/CheckInPage';
import { DashboardPage } from './pages/DashboardPage';
import { MealPage } from './pages/MealPage';
import { ProgressPage } from './pages/ProgressPage';
import { RecordsPage } from './pages/RecordsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { WorkoutPage } from './pages/WorkoutPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/workouts" element={<WorkoutPage />} />
        <Route path="/meals" element={<MealPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}
