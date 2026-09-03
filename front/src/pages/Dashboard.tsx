import { AlertTriangle, CheckCircle2, ClipboardList, FolderKanban, ListTodo, Users } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, PageHeader, ProjectStatusBadge, StatCard } from "../components/ui/Basics";
import { DonutChart, ProjectProgressChart } from "../components/ui/Charts";
import { isOverdue, projectProgress } from "../utils/helpers";

export function Dashboard() {
  const { users, projects, tasks } = useApp();
  const navigate = useNavigate();

  const overdueTasks = useMemo(() => tasks.filter(isOverdue), [tasks]);
  const todoCount = tasks.filter((t) => t.status === "A_faire").length;
  const inProgressCount = tasks.filter((t) => t.status === "En_cours").length;
  const doneCount = tasks.filter((t) => t.status === "Terminée").length;
  const activeProjects = projects.filter((p) => p.status === "active");

  const completionRate = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const activeProjectsRate = projects.length ? Math.round((activeProjects.length / projects.length) * 100) : 0;
  const inProgressRate = tasks.length ? Math.round((inProgressCount / tasks.length) * 100) : 0;
  const overdueRate = tasks.length ? Math.round((overdueTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de l'activité de vos projets et de vos équipes"
        action={
          <>
            <Button variant="outline" onClick={() => navigate("/admin/users")}>
              Utilisateurs
            </Button>
            <Button onClick={() => navigate("/admin/projects")}>+ Nouveau projet</Button>
          </>
        }
      />

      {overdueTasks.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">
              {overdueTasks.length} tâche{overdueTasks.length > 1 ? "s" : ""} en retard nécessite
              {overdueTasks.length > 1 ? "nt" : ""} votre attention
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={() => navigate("/admin/tasks")}>
            Voir les tâches
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} value={users.length} label="Utilisateurs" color="orange" />
        <StatCard icon={<FolderKanban className="w-5 h-5" />} value={projects.length} label="Projets" color="blue" />
        <StatCard icon={<ListTodo className="w-5 h-5" />} value={tasks.length} label="Tâches totales" color="slate" />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          value={overdueTasks.length}
          label="En retard"
          sub={overdueTasks.length > 0 ? "Action requise" : "Tout est à jour"}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5 bg-gradient-to-br from-slate-500 to-slate-600 text-white">
          <p className="text-4xl font-black">{todoCount}</p>
          <p className="text-sm text-slate-200 mt-1">À faire</p>
        </div>
        <div className="rounded-xl p-5 bg-gradient-to-br from-orange-400 to-orange-500 text-white">
          <p className="text-4xl font-black">{inProgressCount}</p>
          <p className="text-sm text-orange-100 mt-1">En cours</p>
        </div>
        <div className="rounded-xl p-5 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white">
          <p className="text-4xl font-black">{doneCount}</p>
          <p className="text-sm text-emerald-100 mt-1">Terminées</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-5">Répartition des tâches</h3>
          <DonutChart
            segments={[
              { label: "Terminées", value: doneCount, colorClass: "bg-emerald-500", hex: "#10b981" },
              { label: "En cours", value: inProgressCount, colorClass: "bg-amber-500", hex: "#f59e0b" },
              { label: "À faire", value: todoCount, colorClass: "bg-slate-400", hex: "#94a3b8" },
            ]}
          />
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-5">Progression par projet</h3>
          <ProjectProgressChart
            data={projects.map((p) => ({
              name: p.name,
              value: projectProgress(tasks, p.id),
              colorClass:
                p.status === "completed" ? "bg-emerald-500" : p.status === "cancelled" ? "bg-red-400" : "bg-orange-500",
            }))}
          />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Projets actifs</h3>
        <div className="space-y-1">
          {activeProjects.map((p) => (
            <div
              key={p.id}
              className="group flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-slate-50/60 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <FolderKanban className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <div className="mt-1.5 max-w-xs">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${projectProgress(tasks, p.id)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex -space-x-2 shrink-0">
                {p.members.slice(0, 4).map((m) => {
                  const user = users.find((u) => u.id === m.userId);
                  if (!user) return null;
                  return <Avatar key={m.userId} id={user.id} firstName={user.firstName} lastName={user.lastName} size="xs" ring />;
                })}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => navigate(`/admin/project/${p.id}`)}
              >
                Voir
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiGauge icon={<CheckCircle2 className="w-4 h-4" />} label="Taux de complétion" value={completionRate} colorClass="bg-emerald-500" />
        <KpiGauge icon={<FolderKanban className="w-4 h-4" />} label="Projets actifs" value={activeProjectsRate} colorClass="bg-blue-500" />
        <KpiGauge icon={<ClipboardList className="w-4 h-4" />} label="Tâches en cours" value={inProgressRate} colorClass="bg-amber-500" />
        <KpiGauge icon={<AlertTriangle className="w-4 h-4" />} label="Charge de retard" value={overdueRate} colorClass="bg-red-500" />
      </div>
    </div>
  );
}

function KpiGauge({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: number; colorClass: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-slate-500 mb-3">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-black text-slate-900 mb-2">{value}%</p>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </Card>
  );
}
