import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, FolderKanban, CheckSquare, CheckCircle2, Clock } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { apiFetch } from "../api/clients";
import { Task, GetTasksByProjectResponse } from "../types/task";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

function statusStyle(statut: string) {
  const s = statut.toLowerCase();
  if (s.includes("pause")) return "bg-amber-100 text-amber-700";
  if (s.includes("termin")) return "bg-emerald-100 text-emerald-700";
  if (s.includes("actif") || s.includes("cours")) return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

function isLate(dateFin: string, statut: string) {
  const done = statut.toLowerCase().includes("termin");
  return !done && new Date(dateFin) < new Date();
}

function isDone(statut: string) {
  return statut.toLowerCase().includes("termin");
}

export default function Dashboard() {
  const { user, projects, projectsLoading } = useAppContext();
  const isChef = user?.role === "admin";
  const firstName = user?.prenom ?? "";

  // Pas de route "mes tâches" globale côté back pour l'instant :
  // on agrège les tâches de chaque projet chargé, en local à cette page.
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  useEffect(() => {
    if (projectsLoading || projects.length === 0) return;

    let cancelled = false;
    (async () => {
      setTasksLoading(true);
      setTasksError(null);
      try {
        const results = await Promise.all(
          projects.map((p) =>
            apiFetch<GetTasksByProjectResponse>(`/task/project/${p.id}`).catch(() => ({
              message: "",
              tasks: [] as Task[],
            }))
          )
        );
        if (!cancelled) {
          setTasks(results.flatMap((r) => r.tasks));
        }
      } catch {
        if (!cancelled) setTasksError("Impossible de charger les tâches.");
      } finally {
        if (!cancelled) setTasksLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projects, projectsLoading]);

  const myTasks = user ? tasks.filter((t) => t.responsable_id === user.id) : [];
  const myTasksDone = myTasks.filter((t) => isDone(t.statut));
  const myTasksLate = myTasks.filter((t) => isLate(t.date_fin, t.statut));
  const recentTasks = [...myTasks]
    .sort((a, b) => new Date(a.date_fin).getTime() - new Date(b.date_fin).getTime())
    .slice(0, 5);

  function projectName(projectId: number) {
    return projects.find((p) => p.id === projectId)?.nom ?? "Projet inconnu";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white p-7">
        <h1 className="text-2xl font-black">Bonjour, {firstName}</h1>
        <p className="text-orange-50 text-sm mt-1">
          {isChef ? "Voici l'état de vos projets aujourd'hui" : "Voici vos tâches du jour"}
        </p>
      </div>

      {myTasksLate.length > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium">
            {myTasksLate.length} tâche{myTasksLate.length > 1 ? "s" : ""} en retard
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Projets"
          value={projectsLoading ? "…" : projects.length}
          icon={<FolderKanban className="w-4 h-4" />}
        />
        <StatCard
          label="Mes tâches"
          value={tasksLoading ? "…" : myTasks.length}
          icon={<CheckSquare className="w-4 h-4" />}
        />
        <StatCard
          label="Terminées"
          value={tasksLoading ? "…" : myTasksDone.length}
          icon={<CheckCircle2 className="w-4 h-4" />}
          tone="success"
        />
        <StatCard
          label="En retard"
          value={tasksLoading ? "…" : myTasksLate.length}
          icon={<Clock className="w-4 h-4" />}
          tone="danger"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900">Projets</h2>
          <Link to="/projects" className="text-xs font-medium text-orange-600 hover:text-orange-700">
            Voir tout
          </Link>
        </div>
        {projectsLoading && <p className="text-sm text-slate-400">Chargement...</p>}
        {!projectsLoading && projects.length === 0 && (
          <Card className="py-6">
            <EmptyState title="Aucun projet" description="Vous n'êtes assigné à aucun projet pour le moment." />
          </Card>
        )}
        {!projectsLoading && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {projects.slice(0, 3).map((p) => (
              <Card key={p.id} hover className="p-5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium mb-3 ${statusStyle(
                    p.statut
                  )}`}
                >
                  {p.statut}
                </span>
                <p className="font-semibold text-slate-900 mb-1">{p.nom}</p>
                <p className="text-xs text-slate-400">Échéance : {formatDate(p.date_fin)}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900">Mes tâches récentes</h2>
        </div>
        {tasksLoading && <p className="text-sm text-slate-400">Chargement...</p>}
        {tasksError && <p className="text-sm text-red-500">{tasksError}</p>}
        {!tasksLoading && !tasksError && recentTasks.length === 0 && (
          <Card className="py-6">
            <EmptyState title="Aucune tâche" description="Vous n'avez aucune tâche assignée pour le moment." />
          </Card>
        )}
        {!tasksLoading && recentTasks.length > 0 && (
          <Card className="divide-y divide-slate-100">
            {recentTasks.map((t) => {
              const late = isLate(t.date_fin, t.statut);
              return (
                <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{t.nom}</p>
                    <p className="text-xs text-slate-400">{projectName(t.project_id)}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                        t.statut
                      )}`}
                    >
                      {t.statut}
                    </span>
                    <span className={`text-xs w-20 text-right ${late ? "text-red-500 font-medium" : "text-slate-400"}`}>
                      {formatDate(t.date_fin)}
                      {late && " ⚠"}
                    </span>
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}