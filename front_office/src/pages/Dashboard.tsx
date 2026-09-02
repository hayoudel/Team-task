import { Link } from "react-router-dom";
import { AlertTriangle, FolderKanban, CheckSquare, CheckCircle2, Clock } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import ProjectStatusBadge from "../components/ui/ProjectStatusBadge";
import TaskStatusBadge, { TaskStatus } from "../components/ui/TaskStatusBadge";

const chefProjects = [
  { id: "1", name: "Refonte site web", role: "Chef de projet", progress: 75, status: "active" as const },
  { id: "2", name: "App mobile iOS", role: "Chef de projet", progress: 45, status: "active" as const },
  { id: "3", name: "Dashboard analytics", role: "Chef de projet", progress: 60, status: "on_hold" as const },
];

const userProjects = [
  { id: "1", name: "Refonte site web", role: "Développeur", progress: 75 },
  { id: "2", name: "App mobile iOS", role: "Développeur", progress: 45 },
];

const chefTasks: { name: string; project: string; status: TaskStatus; due: string; late: boolean }[] = [
  { name: "Intégration HTML", project: "Refonte site web", status: "in_progress", due: "15/04/2024", late: true },
  { name: "Tests cross-browser", project: "Refonte site web", status: "todo", due: "01/05/2024", late: false },
  { name: "Rédaction contenu", project: "Refonte site web", status: "in_progress", due: "01/04/2024", late: true },
  { name: "Référencement SEO", project: "Refonte site web", status: "todo", due: "01/07/2024", late: false },
  { name: "Maquettes homepage", project: "Refonte site web", status: "done", due: "01/03/2024", late: false },
];

const userTasks: { name: string; project: string; status: TaskStatus; due: string; late: boolean }[] = [
  { name: "Intégration HTML", project: "Refonte site web", status: "in_progress", due: "15/04/2024", late: true },
  { name: "Déploiement prod", project: "Refonte site web", status: "todo", due: "30/06/2024", late: false },
  { name: "API authentification", project: "App mobile iOS", status: "in_progress", due: "01/05/2024", late: false },
  { name: "Tests unitaires", project: "App mobile iOS", status: "todo", due: "15/05/2024", late: false },
  { name: "Setup CI/CD", project: "Refonte site web", status: "done", due: "01/02/2024", late: false },
];

export default function Dashboard() {
  const { user } = useAppContext();
  const isChef = user?.role === "admin";
  const firstName = user?.prenom ?? "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white p-7">
        <h1 className="text-2xl font-black">Bonjour, {firstName}</h1>
        <p className="text-orange-50 text-sm mt-1">
          {isChef ? "Voici l'état de vos projets aujourd'hui" : "Voici vos tâches du jour"}
        </p>
      </div>

      {isChef && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium">2 tâches en retard dans vos projets</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Mes projets" value={isChef ? 3 : 2} icon={<FolderKanban className="w-4 h-4" />} />
        <StatCard label="Mes tâches" value={isChef ? 12 : 6} icon={<CheckSquare className="w-4 h-4" />} />
        <StatCard label="Terminées" value={isChef ? 4 : 2} icon={<CheckCircle2 className="w-4 h-4" />} tone="success" />
        <StatCard label="En retard" value={isChef ? 2 : 1} icon={<Clock className="w-4 h-4" />} tone="danger" />
      </div>

      <div>
        <h2 className="text-base font-black text-slate-900 mb-3">Mes projets</h2>
        <div className={`grid gap-4 ${isChef ? "grid-cols-3" : "grid-cols-2"}`}>
          {(isChef ? chefProjects : userProjects).map((p) => (
            <Card key={p.id} hover className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-600 px-2.5 py-1 text-xs font-medium">
                  {p.role}
                </span>
                {isChef && "status" in p && <ProjectStatusBadge status={p.status} />}
              </div>
              <p className="font-semibold text-slate-900 mb-3">{p.name}</p>
              <ProgressBar value={p.progress} showLabel />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900">
            {isChef ? "Tâches récentes" : "Mes tâches récentes"}
          </h2>
          <Link to="/tasks" className="text-xs font-medium text-orange-600 hover:text-orange-700">
            Voir tout
          </Link>
        </div>
        <Card className="divide-y divide-slate-100">
          {(isChef ? chefTasks : userTasks).map((t) => (
            <div key={t.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400">{t.project}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <TaskStatusBadge status={t.status} />
                <span className={`text-xs w-20 text-right ${t.late ? "text-red-500 font-medium" : "text-slate-400"}`}>
                  {t.due}
                  {t.late && " ⚠"}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}