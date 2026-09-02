import { Link } from "react-router-dom";
import { RefreshCw, AlertTriangle, CalendarDays } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
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

export default function Projects() {
  const {user, projects, projectsLoading, projectsError, fetchProjects } = useAppContext();

  const statusCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.statut] = (acc[p.statut] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes projets"
        subtitle={
          projectsLoading
            ? "Chargement..."
            : `${projects.length} projet${projects.length > 1 ? "s" : ""} assigné${projects.length > 1 ? "s" : ""}`
        }
        action={
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
           onClick={() => {
  if (user) {
    fetchProjects(user.id);
  }
}}
            disabled={projectsLoading}
          >
            Actualiser
          </Button>
        }
      />

      {/* Erreur */}
      {projectsError && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">{projectsError}</p>
          </div>
          <Button variant="outline" size="sm"  onClick={() => {
    if (user) {
      fetchProjects(user.id);
    }
  }}>
            Réessayer
          </Button>
        </div>
      )}

      {/* Compteurs par statut, calculés à partir des vraies données */}
      {!projectsLoading && projects.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(statusCounts).map(([statut, count]) => (
            <span
              key={statut}
              className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 ${statusStyle(
                statut
              )}`}
            >
              {count} {statut}
            </span>
          ))}
        </div>
      )}

      {/* Skeleton pendant le chargement */}
      {projectsLoading && (
        <div className="grid grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-5 w-20 bg-slate-100 rounded-full mb-4" />
              <div className="h-5 w-2/3 bg-slate-100 rounded mb-3" />
              <div className="h-4 w-full bg-slate-100 rounded mb-2" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
            </Card>
          ))}
        </div>
      )}

      {/* Liste vide */}
      {!projectsLoading && !projectsError && projects.length === 0 && (
        <Card className="py-4">
          <EmptyState
            title="Aucun projet pour le moment"
            description="Les projets créés par l'administrateur apparaîtront ici."
          />
        </Card>
      )}

      {/* Liste des projets */}
      {!projectsLoading && projects.length > 0 && (
        <div className="grid grid-cols-2 gap-5">
          {projects.map((p) => (
            <Card key={p.id} hover className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                    p.statut
                  )}`}
                >
                  {p.statut}
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-1.5">{p.nom}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                <CalendarDays className="w-3.5 h-3.5" />
                {formatDate(p.date_debut)} → {formatDate(p.date_fin)}
              </div>
              <div className="flex justify-end">
                <Link to={`/projects/${p.id}`}>
                  <Button variant="outline" size="sm">
                    Voir
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}