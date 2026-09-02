import { useOutletContext, Link } from "react-router-dom";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Role } from "../types/project";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TaskStatusBadge, { TaskStatus } from "../components/ui/TaskStatusBadge";
import Pagination from "../components/ui/Pagination";

interface TaskRow {
  id: string;
  name: string;
  project: string;
  assignee?: string;
  status: TaskStatus;
  due: string;
  late: boolean;
  createdBy: string;
}

const chefTasks: TaskRow[] = [
  { id: "1", name: "Maquettes homepage", project: "Refonte site web", assignee: "Emma Leroy", status: "done", due: "2024-03-01", late: false, createdBy: "Bruno Martin" },
  { id: "2", name: "Intégration HTML", project: "Refonte site web", assignee: "David Rousseau", status: "in_progress", due: "2024-04-15", late: true, createdBy: "Bruno Martin" },
  { id: "3", name: "Tests cross-browser", project: "Refonte site web", assignee: "Grace Dupont", status: "todo", due: "2024-05-01", late: false, createdBy: "Bruno Martin" },
  { id: "4", name: "Déploiement prod", project: "Refonte site web", assignee: "David Rousseau", status: "todo", due: "2024-06-30", late: false, createdBy: "David Rousseau" },
  { id: "5", name: "Rédaction contenu", project: "Refonte site web", assignee: "Emma Leroy", status: "in_progress", due: "2024-04-01", late: true, createdBy: "Bruno Martin" },
  { id: "6", name: "Référencement SEO", project: "Refonte site web", assignee: "Bruno Martin", status: "todo", due: "2024-07-01", late: false, createdBy: "Bruno Martin" },
  { id: "7", name: "API authentification", project: "App mobile iOS", assignee: "David Rousseau", status: "in_progress", due: "2024-05-01", late: false, createdBy: "Bruno Martin" },
  { id: "8", name: "Tests unitaires", project: "App mobile iOS", assignee: "David Rousseau", status: "todo", due: "2024-05-15", late: false, createdBy: "Bruno Martin" },
  { id: "9", name: "Documentation API", project: "App mobile iOS", assignee: "Emma Leroy", status: "todo", due: "2024-06-01", late: false, createdBy: "Bruno Martin" },
  { id: "10", name: "Setup CI/CD", project: "App mobile iOS", assignee: "David Rousseau", status: "done", due: "2024-02-01", late: false, createdBy: "Bruno Martin" },
  { id: "11", name: "Design KPIs", project: "Dashboard analytics", assignee: "Grace Dupont", status: "in_progress", due: "2024-03-20", late: false, createdBy: "Bruno Martin" },
  { id: "12", name: "Connexion base de données", project: "Dashboard analytics", assignee: "Bruno Martin", status: "todo", due: "2024-04-10", late: false, createdBy: "Bruno Martin" },
];

const userTasks: TaskRow[] = [
  { id: "2", name: "Intégration HTML", project: "Refonte site web", status: "in_progress", due: "2024-04-15", late: true, createdBy: "David Rousseau" },
  { id: "4", name: "Déploiement prod", project: "Refonte site web", status: "todo", due: "2024-06-30", late: false, createdBy: "David Rousseau" },
  { id: "7", name: "API authentification", project: "App mobile iOS", status: "in_progress", due: "2024-05-01", late: false, createdBy: "Bruno Martin" },
  { id: "8", name: "Tests unitaires", project: "App mobile iOS", status: "todo", due: "2024-05-15", late: false, createdBy: "Bruno Martin" },
  { id: "9", name: "Documentation API", project: "App mobile iOS", status: "todo", due: "2024-06-01", late: false, createdBy: "Bruno Martin" },
  { id: "10", name: "Setup CI/CD", project: "Refonte site web", status: "done", due: "2024-02-01", late: false, createdBy: "David Rousseau" },
];

export default function Tasks() {
  const { role } = useOutletContext<{ role: Role }>();
  const isChef = role === "chef";
  const currentUser = isChef ? "Bruno Martin" : "David Rousseau";
  const rows = isChef ? chefTasks : userTasks;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes tâches"
        subtitle={isChef ? "12 tâches dans mes projets" : "6 tâches assignées"}
        action={
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>
            Créer une tâche
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">À faire</p>
          <p className="text-2xl font-black text-slate-900">{isChef ? 5 : 3}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">En cours</p>
          <p className="text-2xl font-black text-slate-900">{isChef ? 5 : 2}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Terminées</p>
          <p className="text-2xl font-black text-slate-900">{isChef ? 2 : 1}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-red-500 mb-1">En retard</p>
          <p className="text-2xl font-black text-red-500">{isChef ? 2 : 1}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            disabled
            placeholder="Rechercher une tâche..."
            className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white w-64"
          />
        </div>
        <select disabled className="text-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">
          <option>Tous les projets</option>
        </select>
        <select disabled className="text-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">
          <option>Tous les statuts</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left font-medium text-slate-500 px-5 py-3">Tâche</th>
              <th className="text-left font-medium text-slate-500 px-5 py-3">Projet</th>
              {isChef && <th className="text-left font-medium text-slate-500 px-5 py-3">Assigné</th>}
              <th className="text-left font-medium text-slate-500 px-5 py-3">Statut</th>
              <th className="text-left font-medium text-slate-500 px-5 py-3">Échéance</th>
              <th className="text-right font-medium text-slate-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((t) => {
              const canEdit = t.createdBy === currentUser;
              return (
                <tr key={t.id} className={`group ${t.late ? "bg-red-50/60" : ""}`}>
                  <td className="px-5 py-3.5">
                    <Link to={`/tasks/${t.id}`} className="font-medium text-slate-900 hover:text-orange-600">
                      {t.name}
                    </Link>
                    {!canEdit && <p className="text-xs text-slate-400">Créée par l'admin</p>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{t.project}</td>
                  {isChef && <td className="px-5 py-3.5 text-slate-600">{t.assignee}</td>}
                  <td className="px-5 py-3.5"><TaskStatusBadge status={t.status} /></td>
                  <td className={`px-5 py-3.5 ${t.late ? "text-red-500 font-medium" : "text-slate-500"}`}>{t.due}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-all duration-200">
                      {canEdit ? (
                        <>
                          <button className="text-slate-400 hover:text-orange-500"><Pencil className="w-4 h-4" /></button>
                          <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <button className="text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination page={1} totalPages={2} />
      </div>
    </div>
  );
}
