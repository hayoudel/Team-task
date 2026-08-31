import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  UserMinus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, ProgressBar, ProjectStatusBadge, TaskStatusBadge } from "../components/ui/Basics";
import { Input, Select, SearchInput, FilterSelect, Textarea } from "../components/ui/Form";
import { ConfirmModal, Modal } from "../components/ui/Modal";
import { Table, Tabs } from "../components/ui/Table";
import { formatDate, isOverdue, projectProgress, projectStatusLabel, taskStatusLabel } from "../utils/helpers";
import type { Task, TaskStatus, ProjectStatus } from "../types";

const tabs = [
  { id: "overview", label: "Vue générale" },
  { id: "members", label: "Membres" },
  { id: "tasks", label: "Tâches" },
  { id: "kanban", label: "Suivi" },
];

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, users, tasks, roles, updateProject, deleteProject, addMember, updateMemberRole, removeMember, addTask, updateTask, deleteTask } = useApp();
  const [tab, setTab] = useState("overview");

  const project = projects.find((p) => p.id === id);

  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ userId: "", projectRole: "" });
  const [removeMemberTarget, setRemoveMemberTarget] = useState<string | null>(null);

  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    status: "todo" as TaskStatus,
    startDate: "",
    dueDate: "",
    assigneeId: "",
  });

  const projectTasks = useMemo(() => tasks.filter((t) => t.projectId === id), [tasks, id]);
  const members = project?.members ?? [];
  const memberUsers = members.map((m) => ({ ...m, user: users.find((u) => u.id === m.userId) })).filter((m) => m.user);
  const nonMembers = users.filter((u) => !members.some((m) => m.userId === u.id));

  const filteredTasks = projectTasks.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(taskSearch.toLowerCase());
    const matchStatus = !taskStatusFilter || t.status === taskStatusFilter;
    return matchSearch && matchStatus;
  });

  const [editProjectForm, setEditProjectForm] = useState({
    name: project?.name ?? "",
    description: project?.description ?? "",
    status: (project?.status ?? "active") as ProjectStatus,
    startDate: project?.startDate ?? "",
    endDate: project?.endDate ?? "",
  });

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Projet introuvable.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/projects")}>
          Retour aux projets
        </Button>
      </div>
    );
  }

  const openTaskCreate = () => {
    setEditTask(null);
    setTaskForm({ name: "", description: "", status: "todo", startDate: "", dueDate: "", assigneeId: "" });
    setShowTaskForm(true);
  };
  const openTaskEdit = (t: Task) => {
    setEditTask(t);
    setTaskForm({ name: t.name, description: t.description, status: t.status, startDate: t.startDate, dueDate: t.dueDate, assigneeId: t.assigneeId });
    setShowTaskForm(true);
  };
  const submitTask = () => {
    if (!taskForm.name || !taskForm.assigneeId) return;
    if (editTask) updateTask(editTask.id, taskForm);
    else addTask({ ...taskForm, projectId: project.id });
    setShowTaskForm(false);
  };

  const doneCount = projectTasks.filter((t) => t.status === "done").length;
  const progress = projectProgress(tasks, project.id);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/admin/projects")} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux projets
      </button>

      <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {formatDate(project.startDate)} → {formatDate(project.endDate)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil className="w-3.5 h-3.5" />}
              onClick={() => {
                setEditProjectForm({
                  name: project.name,
                  description: project.description,
                  status: project.status,
                  startDate: project.startDate,
                  endDate: project.endDate,
                });
                setShowEditProject(true);
              }}
            >
              Modifier
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setShowDeleteProject(true)}>
              Supprimer
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
          <div>
            <p className="text-2xl font-black">{members.length}</p>
            <p className="text-xs text-slate-400">Membres</p>
          </div>
          <div>
            <p className="text-2xl font-black">{projectTasks.length}</p>
            <p className="text-xs text-slate-400">Tâches</p>
          </div>
          <div>
            <p className="text-2xl font-black">{progress}%</p>
            <p className="text-xs text-slate-400">Progression</p>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoStat label="Statut" value={projectStatusLabel(project.status)} />
            <InfoStat label="Début" value={formatDate(project.startDate)} />
            <InfoStat label="Fin" value={formatDate(project.endDate)} />
            <InfoStat label="Membres" value={String(members.length)} />
            <InfoStat label="Tâches totales" value={String(projectTasks.length)} />
            <InfoStat label="Tâches terminées" value={String(doneCount)} />
          </div>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Progression globale</h3>
            <ProgressBar value={progress} showLabel />
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Équipe du projet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {memberUsers.map((m) => (
                <div key={m.userId} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5">
                  <Avatar id={m.user!.id} firstName={m.user!.firstName} lastName={m.user!.lastName} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {m.user!.firstName} {m.user!.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{m.projectRole}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "members" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Membres du projet</h3>
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => { setMemberForm({ userId: "", projectRole: "" }); setShowAddMember(true); }}>
              Ajouter un membre
            </Button>
          </div>
          <Table headers={["Membre", "Email", "Rôle projet", ""]} isEmpty={memberUsers.length === 0}>
            {memberUsers.map((m) => (
              <tr key={m.userId} className="group hover:bg-slate-50/60 transition-colors duration-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar id={m.user!.id} firstName={m.user!.firstName} lastName={m.user!.lastName} size="sm" />
                    <span className="text-sm font-medium text-slate-900">
                      {m.user!.firstName} {m.user!.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{m.user!.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={m.projectRole}
                    onChange={(e) => updateMemberRole(project.id, m.userId, e.target.value)}
                    className="text-xs font-medium rounded-full px-2.5 py-1 bg-orange-50 text-orange-700 border-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setRemoveMemberTarget(m.userId)}
                    className="opacity-50 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="Retirer"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === "tasks" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-1">
              <SearchInput value={taskSearch} onChange={setTaskSearch} placeholder="Rechercher une tâche..." />
              <FilterSelect
                value={taskStatusFilter}
                onChange={setTaskStatusFilter}
                placeholder="Tous les statuts"
                options={(["todo", "in_progress", "done"] as TaskStatus[]).map((s) => ({ value: s, label: taskStatusLabel(s) }))}
              />
            </div>
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={openTaskCreate}>
              Créer une tâche
            </Button>
          </div>
          <Table headers={["Tâche", "Assigné", "Statut", "Échéance", "Retard", ""]} isEmpty={filteredTasks.length === 0}>
            {filteredTasks.map((t) => {
              const assignee = users.find((u) => u.id === t.assigneeId);
              const late = isOverdue(t);
              return (
                <tr key={t.id} className={`group hover:bg-slate-50/60 transition-colors duration-200 ${late ? "bg-red-50/30" : ""}`}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{t.name}</td>
                  <td className="px-4 py-3">
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <Avatar id={assignee.id} firstName={assignee.firstName} lastName={assignee.lastName} size="xs" />
                        <span className="text-sm text-slate-600">
                          {assignee.firstName} {assignee.lastName}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <TaskStatusBadge status={t.status} />
                  </td>
                  <td className={`px-4 py-3 text-sm ${late ? "text-red-600 font-medium" : "text-slate-500"}`}>{formatDate(t.dueDate)}</td>
                  <td className="px-4 py-3">{late && <AlertTriangle className="w-4 h-4 text-red-500" />}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openTaskEdit(t)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTaskTarget(t)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}

      {tab === "kanban" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KanbanColumn title="À faire" colorClass="bg-slate-400" status="todo" tasks={projectTasks} users={users} onAdd={openTaskCreate} />
            <KanbanColumn title="En cours" colorClass="bg-amber-500" status="in_progress" tasks={projectTasks} users={users} onAdd={openTaskCreate} />
            <KanbanColumn title="Terminé" colorClass="bg-emerald-500" status="done" tasks={projectTasks} users={users} onAdd={openTaskCreate} />
          </div>
          <Card className="p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-black text-slate-900">{projectTasks.filter((t) => t.status === "todo").length}</p>
                <p className="text-xs text-slate-500">À faire</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{projectTasks.filter((t) => t.status === "in_progress").length}</p>
                <p className="text-xs text-slate-500">En cours</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{doneCount}</p>
                <p className="text-xs text-slate-500">Terminées</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit project modal */}
      <Modal
        open={showEditProject}
        onClose={() => setShowEditProject(false)}
        title="Modifier le projet"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditProject(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                updateProject(project.id, editProjectForm);
                setShowEditProject(false);
              }}
            >
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nom du projet" value={editProjectForm.name} onChange={(e) => setEditProjectForm({ ...editProjectForm, name: e.target.value })} />
          <Textarea label="Description" value={editProjectForm.description} onChange={(e) => setEditProjectForm({ ...editProjectForm, description: e.target.value })} />
          <Select
            label="Statut"
            value={editProjectForm.status}
            onChange={(e) => setEditProjectForm({ ...editProjectForm, status: e.target.value as ProjectStatus })}
            options={(["active", "on_hold", "completed", "cancelled"] as ProjectStatus[]).map((s) => ({ value: s, label: projectStatusLabel(s) }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date de début" type="date" value={editProjectForm.startDate} onChange={(e) => setEditProjectForm({ ...editProjectForm, startDate: e.target.value })} />
            <Input label="Date de fin" type="date" value={editProjectForm.endDate} onChange={(e) => setEditProjectForm({ ...editProjectForm, endDate: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        onConfirm={() => {
          deleteProject(project.id);
          navigate("/admin/projects");
        }}
        title="Supprimer ce projet ?"
        description="Cette action supprimera également toutes les tâches associées à ce projet. Cette action est irréversible."
      />

      {/* Add member modal */}
      <Modal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Ajouter un membre"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (!memberForm.userId || !memberForm.projectRole) return;
                addMember(project.id, memberForm);
                setShowAddMember(false);
              }}
            >
              Ajouter
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Utilisateur"
            placeholder="Sélectionner un utilisateur"
            value={memberForm.userId}
            onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })}
            options={nonMembers.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))}
          />
          <Select
            label="Rôle dans le projet"
            placeholder="Sélectionner un rôle"
            value={memberForm.projectRole}
            onChange={(e) => setMemberForm({ ...memberForm, projectRole: e.target.value })}
            options={roles.map((r) => ({ value: r.name, label: r.name }))}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!removeMemberTarget}
        onClose={() => setRemoveMemberTarget(null)}
        onConfirm={() => removeMemberTarget && removeMember(project.id, removeMemberTarget)}
        title="Retirer ce membre ?"
        description="Ce membre n'aura plus accès au projet. Ses tâches assignées resteront inchangées."
        confirmLabel="Retirer"
      />

      {/* Task modal */}
      <Modal
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        title={editTask ? "Modifier la tâche" : "Créer une tâche"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowTaskForm(false)}>
              Annuler
            </Button>
            <Button onClick={submitTask}>{editTask ? "Enregistrer" : "Créer"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nom de la tâche" value={taskForm.name} onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })} />
          <Textarea label="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
          <Select
            label="Statut"
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as TaskStatus })}
            options={(["todo", "in_progress", "done"] as TaskStatus[]).map((s) => ({ value: s, label: taskStatusLabel(s) }))}
          />
          <Select
            label="Assigné à"
            placeholder="Sélectionner un membre"
            value={taskForm.assigneeId}
            onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
            options={memberUsers.map((m) => ({ value: m.userId, label: `${m.user!.firstName} ${m.user!.lastName}` }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date de début" type="date" value={taskForm.startDate} onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })} />
            <Input label="Échéance" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTaskTarget}
        onClose={() => setDeleteTaskTarget(null)}
        onConfirm={() => deleteTaskTarget && deleteTask(deleteTaskTarget.id)}
        title="Supprimer cette tâche ?"
        description={`La tâche "${deleteTaskTarget?.name}" sera définitivement supprimée.`}
      />
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </Card>
  );
}

function KanbanColumn({
  title,
  colorClass,
  status,
  tasks,
  users,
  onAdd,
}: {
  title: string;
  colorClass: string;
  status: TaskStatus;
  tasks: Task[];
  users: { id: string; firstName: string; lastName: string }[];
  onAdd: () => void;
}) {
  const columnTasks = tasks.filter((t) => t.status === status);
  return (
    <div className="bg-slate-100/60 rounded-xl p-3">
      <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
        <span className={`w-2 h-2 rounded-full ${colorClass}`} />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{title}</span>
        <span className="text-xs text-slate-400 ml-auto">{columnTasks.length}</span>
      </div>
      <div className="space-y-2">
        {columnTasks.map((t) => {
          const assignee = users.find((u) => u.id === t.assigneeId);
          const late = isOverdue(t);
          return (
            <div key={t.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
              <p className="text-sm font-medium text-slate-900 mb-2">{t.name}</p>
              <div className="flex items-center justify-between">
                {assignee && <Avatar id={assignee.id} firstName={assignee.firstName} lastName={assignee.lastName} size="xs" />}
                <div className={`flex items-center gap-1 text-xs ${late ? "text-red-500 font-medium" : "text-slate-400"}`}>
                  {late && <AlertTriangle className="w-3 h-3" />}
                  {formatDate(t.dueDate)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onAdd} className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-orange-500 py-2 rounded-lg hover:bg-white transition-all duration-200">
        <Plus className="w-3.5 h-3.5" /> Ajouter
      </button>
    </div>
  );
}
