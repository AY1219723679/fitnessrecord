import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/appStore';

export function TemplatesPage() {
  const { templates, exercises, applyTemplate } = useAppStore();

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} title={template.name} subtitle={template.description}>
          <div className="mb-4 flex flex-wrap gap-2">
            {template.exerciseIds.map((exerciseId) => (
              <span key={exerciseId} className="rounded-full border border-line bg-panel px-3 py-1 text-xs text-slate-900">
                {exercises.find((exercise) => exercise.id === exerciseId)?.nameZh}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{template.focus}</span>
            <Button variant="secondary" onClick={() => applyTemplate(template.id)}>
              快速创建
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
