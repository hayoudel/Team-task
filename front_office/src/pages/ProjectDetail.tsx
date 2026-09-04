import { useState, useEffect } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Info, AlertTriangle, RefreshCw,MessageCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { CHEF_DE_PROJET_ROLE_ID } from "../types/projectMember";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Tabs from "../components/ui/Tabs";
import EmptyState from "../components/ui/EmptyState";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ViewTaskModal from "../components/ViewTaskModal";
import type {Task,TaskCreated} from "../types/task";

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

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    user,
    currentProject,
    projectLoading,
    projectError,
    fetchProject,
    projectMembers,
    membersLoading,
    membersError,
    fetchProjectMembers,
    projectTasks,
    tasksLoading,
    updateTask,
    updateTaskStatus,
    tasksError,
    fetchProjectTasks,
    deleteTask,
  } = useAppContext();

  const [tab, setTab] = useState("Vue générale");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!projectId) return;
    fetchProject(projectId);
    fetchProjectMembers(projectId);
    fetchProjectTasks(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const isAdmin = user?.role === "admin";
  const myMembership = projectMembers.find((m) => m.userId === String(user?.id));
  const isChefOnProject = myMembership?.roleId === CHEF_DE_PROJET_ROLE_ID;
  const canCreateAndAssign = isAdmin || isChefOnProject;

 function canEditTask(createdBy: number) {
  return isAdmin || createdBy === user?.id;
}
const myTasks = projectTasks.filter(
  (task) => task.responsable_id === user?.id
);
async function handleTaskStatusChange(taskId: number, statut: string) {
  await updateTaskStatus(taskId, statut);
}

  async function handleDelete(taskId: number) {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    await deleteTask(taskId);
  }


  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-100 animate-pulse h-40" />
        <div className="h-8 w-64 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium">{projectError}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => projectId && fetchProject(projectId)}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-slate-700 text-white p-7">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-black">{currentProject.nom}</h1>
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">
            {currentProject.statut}
          </span>
        </div>
        <p className="text-orange-50 text-sm mb-5">
          Début : {formatDate(currentProject.date_debut)} · Fin : {formatDate(currentProject.date_fin)}
        </p>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-2xl font-black">{projectMembers.length}</p>
            <p className="text-xs text-orange-50">Membres</p>
          </div>
          <div>
            <p className="text-2xl font-black">{projectTasks.length}</p>
            <p className="text-xs text-orange-50">Tâches</p>
          </div>
        </div>
      </div>

      <Tabs tabs={["Vue générale", "Membres", "Tâches", "Suivi"]} active={tab} onChange={setTab} />

      {tab === "Vue générale" && (
        <Card className="p-6 space-y-5">
          <div>
            <p className="text-sm text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-700">{currentProject.description}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-3">Équipe</p>
            {membersLoading && <p className="text-sm text-slate-400">Chargement des membres...</p>}
            {membersError && <p className="text-sm text-red-500">{membersError}</p>}
            {!membersLoading && !membersError && projectMembers.length === 0 && (
              <p className="text-sm text-slate-400">Aucun membre pour l'instant.</p>
            )}
            {!membersLoading && projectMembers.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {projectMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                    <Avatar name={`${m.prenom} ${m.nom}`} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {m.prenom} {m.nom}
                      </p>
                      <p className="text-xs text-slate-400">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
             <button
        onClick={() => navigate(`/projects/${projectId}/messages`)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
        title="Messages du projet"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
          </div>
        </Card>
      )}

      {tab === "Membres" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 rounded-xl px-4 py-3 text-sm">
            <Info className="w-4 h-4 shrink-0" />
            La gestion des membres est réservée à l'administrateur.
          </div>

          {membersLoading && <p className="text-sm text-slate-400">Chargement...</p>}
          {membersError && (
            <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3">
              <p className="text-sm font-medium">{membersError}</p>
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => projectId && fetchProjectMembers(projectId)}
              >
                Réessayer
              </Button>
            </div>
          )}

          {!membersLoading && !membersError && (
            <Card className="divide-y divide-slate-100">
              {projectMembers.length === 0 ? (
                <div className="py-6">
                  <EmptyState title="Aucun membre" description="Ce projet n'a pas encore de membre assigné." />
                </div>
              ) : (
                projectMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                    <Avatar name={`${m.prenom} ${m.nom}`} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {m.prenom} {m.nom}
                      </p>
                      <p className="text-xs text-slate-400">{m.role}</p>
                    </div>
                  </div>
                ))
              )}
            </Card>
          )}
           <button
        onClick={() => navigate(`/projects/${projectId}/messages`)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
        title="Messages du projet"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
        </div>
      )}

      {tab === "Tâches" && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateModalOpen(true)}>
              Créer une tâche
            </Button>
          </div>

          {tasksLoading && <p className="text-sm text-slate-400">Chargement des tâches...</p>}
          {tasksError && (
            <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3">
              <p className="text-sm font-medium">{tasksError}</p>
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => projectId && fetchProjectTasks(projectId)}
              >
                Réessayer
              </Button>
            </div>
          )}

          {!tasksLoading && !tasksError && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {projectTasks.length === 0 ? (
                <div className="py-8">
                  <EmptyState title="Aucune tâche" description="Créez la première tâche de ce projet." />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <th className="text-left font-medium text-slate-500 px-5 py-3">Tâche</th>
                      <th className="text-left font-medium text-slate-500 px-5 py-3">Assigné</th>
                      <th className="text-left font-medium text-slate-500 px-5 py-3">Statut</th>
                       <th className="text-left font-medium text-slate-500 px-5 py-3">Début</th>
                      <th className="text-left font-medium text-slate-500 px-5 py-3">Échéance</th>
                      <th className="text-right font-medium text-slate-500 px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projectTasks.map((t) => {
                      const canEdit = canEditTask(t.created_by);
                      return (
                        <tr key={t.id} className="group">
                          <td className="px-5 py-3.5">
                            <Link to={`/tasks/${t.id}`} className="font-medium text-slate-900 hover:text-orange-600">
                              {t.nom}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            {t.responsable ? `${t.responsable.prenom} ${t.responsable.nom}` : "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                                t.statut
                              )}`}
                            >
                              {t.statut}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">{formatDate(t.date_debut)}</td>
                          <td className="px-5 py-3.5 text-slate-500">{formatDate(t.date_fin)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-all duration-200">
                              {canEdit ? (
                                <>
                                 <button
      onClick={() => setEditTask(t)}
      className="text-slate-400 hover:text-orange-500"
    >
      <Pencil className="w-4 h-4" />
    </button>
                                  <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                               <button
  onClick={() => setSelectedTask(t)}
  className="text-slate-400 hover:text-slate-600"
>
  <Eye className="w-4 h-4" />
</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {selectedTask && (
  <ViewTaskModal
    task={selectedTask}
    onClose={() => setSelectedTask(null)}
  />
)}
 <button
        onClick={() => navigate(`/projects/${projectId}/messages`)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
        title="Messages du projet"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
        </div>
        
      )}

 {tab === "Suivi" && (
  <div className="space-y-4">

    {/* Message si aucune tâche n'est attribuée à l'utilisateur */}
    {!tasksLoading && myTasks.length === 0 && (
      <Card className="py-8">
        <EmptyState
          title="Aucune tâche attribuée"
          description="Les tâches qui vous sont attribuées apparaîtront ici."
        />
      </Card>
    )}

    {!tasksLoading && myTasks.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ================= À FAIRE ================= */}
        <div className="bg-slate-100/70 rounded-2xl p-3 space-y-3">

          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                À faire
              </p>
              <p className="text-xs text-slate-400">
                Tâches à commencer
              </p>
            </div>

            <span className="text-xs bg-white rounded-full px-2 py-1 text-slate-500">
              {myTasks.filter((t) => t.statut === "A faire"|| t.statut === "todo"  ).length}
            </span>
          </div>

          {myTasks
            .filter((t) => t.statut === "A faire"||t.statut === "todo")
            .map((task) => (
              <Card
                key={task.id}
                className="p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {task.nom}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {task.description}
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    Échéance : {formatDate(task.date_fin)}
                  </span>

                  <Button
                    size="sm"
                    onClick={() =>
                      handleTaskStatusChange(task.id, "En cours")
                    }
                  >
                    Commencer
                  </Button>

                </div>
              </Card>
            ))}

        </div>


        {/* ================= EN COURS ================= */}
        <div className="bg-blue-50/70 rounded-2xl p-3 space-y-3">

          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                En cours
              </p>
              <p className="text-xs text-blue-400">
                Tâches actuellement en cours
              </p>
            </div>

            <span className="text-xs bg-white rounded-full px-2 py-1 text-blue-500">
              {myTasks.filter((t) => t.statut === "En cours").length}
            </span>
          </div>

          {myTasks
            .filter((t) => t.statut === "En cours")
            .map((task) => (
              <Card
                key={task.id}
                className="p-4 space-y-3"
              >

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {task.nom}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    Échéance : {formatDate(task.date_fin)}
                  </span>

                  {/* CASE À COCHER */}
                  <label className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() =>
                        handleTaskStatusChange(task.id, "Terminé")
                      }
                      className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />

                    <span className="text-xs font-medium text-slate-600">
                      Terminer
                    </span>

                  </label>

                </div>

              </Card>
            ))}

        </div>


        {/* ================= TERMINÉES ================= */}
        <div className="bg-emerald-50/70 rounded-2xl p-3 space-y-3">

          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Terminées
              </p>
              <p className="text-xs text-emerald-500">
                Tâches terminées
              </p>
            </div>

            <span className="text-xs bg-white rounded-full px-2 py-1 text-emerald-600">
              {myTasks.filter((t) => t.statut === "Terminé").length}
            </span>
          </div>

          {myTasks
            .filter((t) => t.statut === "Terminé")
            .map((task) => (
              <Card
                key={task.id}
                className="p-4 space-y-3"
              >

                <div className="flex items-start gap-3">

                  {/* CASE COCHÉE */}
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() =>
                      handleTaskStatusChange(task.id, "En cours")
                    }
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900 line-through">
                      {task.nom}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {task.description}
                    </p>
                  </div>

                </div>

                <div className="flex justify-end">

                  <span className="text-xs font-medium text-emerald-600">
                    ✓ Terminée
                  </span>

                </div>

              </Card>
            ))}

        </div>

      </div>
    )}
      <button
        onClick={() => navigate(`/projects/${projectId}/messages`)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
        title="Messages du projet"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
  </div>
  
)}

      {createModalOpen && currentProject && user && (
        <CreateTaskModal
          projectId={currentProject.id}
          members={projectMembers}
          canAssignOthers={canCreateAndAssign}
          currentUserId={user.id}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
      {editTask && user && (
  <EditTaskModal
    task={editTask}
    members={projectMembers}
    canAssignOthers={canCreateAndAssign}
    currentUserId={user.id}
    onClose={() => setEditTask(null)}
    onUpdate={async (taskId, data) => {
      await updateTask(taskId, data);

      if (projectId) {
        await fetchProjectTasks(projectId);
      }
    }}
  />
)}
    </div>
  );
}