import { AlertTriangle, CheckCircle2, Clock, ListTodo, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, PageHeader, StatCard, TaskStatusBadge } from "../components/ui/Basics";
import { FilterSelect, Input, Select, SearchInput, Textarea } from "../components/ui/Form";
import { ConfirmModal, Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { formatDate, isOverdue, taskStatusLabel } from "../utils/helpers";
import type { Task, TaskStatus } from "../types";

const emptyForm = {
  name: "",
  description: "",
  projectId: "",
  status: "todo" as TaskStatus,
  startDate: "",
  dueDate: "",
  assigneeId: "",
};

export function Tasks() {
  const { tasks, projects, users, addTask, updateTask, deleteTask } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchProject = !projectFilter || t.projectId === projectFilter;
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchAssignee = !assigneeFilter || t.assigneeId === assigneeFilter;
      return matchSearch && matchProject && matchStatus && matchAssignee;
    });
  }, [tasks, search, projectFilter, statusFilter, assigneeFilter]);

  const overdueCount = tasks.filter(isOverdue).length;
  const counts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const projectMembers = (projectId: string) => {
    const p = projects.find((pr) => pr.id === projectId);
    if (!p) return [];
    return p.members.map((m) => users.find((u) => u.id === m.userId)).filter(Boolean) as typeof users;
  };

  const openCreate = () => {
    setEditTask(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (t: Task) => {
    setEditTask(t);
    setForm({ name: t.name, description: t.description, projectId: t.projectId, status: t.status, startDate: t.startDate, dueDate: t.dueDate, assigneeId: t.assigneeId });
    setShowForm(true);
  };
  const submit = () => {
    if (!form.name || !form.projectId || !form.assigneeId) return;
    if (editTask) updateTask(editTask.id, form);
    else addTask(form);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tâches"
        subtitle="Toutes les tâches de vos projets, tous statuts confondus"
        action={
          <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Créer une tâche
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<ListTodo className="w-5 h-5" />} value={counts.todo} label="À faire" color="slate" />
        <StatCard icon={<Clock className="w-5 h-5" />} value={counts.in_progress} label="En cours" color="amber" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} value={counts.done} label="Terminées" color="emerald" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} value={overdueCount} label="En retard" color={overdueCount > 0 ? "red" : "slate"} />
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une tâche..." />
          <FilterSelect value={projectFilter} onChange={setProjectFilter} placeholder="Tous les projets" options={projects.map((p) => ({ value: p.id, label: p.name }))} />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Tous les statuts"
            options={(["todo", "in_progress", "done"] as TaskStatus[]).map((s) => ({ value: s, label: taskStatusLabel(s) }))}
          />
          <FilterSelect value={assigneeFilter} onChange={setAssigneeFilter} placeholder="Tous les assignés" options={users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))} />
        </div>

        <Table headers={["Tâche", "Projet", "Assigné", "Statut", "Échéance", ""]} isEmpty={filtered.length === 0}>
          {filtered.map((t) => {
            const project = projects.find((p) => p.id === t.projectId);
            const assignee = users.find((u) => u.id === t.assigneeId);
            const creator = users.find((u) => u.id === t.creatorId);
            const late = isOverdue(t);
            return (
              <tr key={t.id} className={`group hover:bg-slate-50/60 transition-colors duration-200 ${late ? "bg-red-50/30" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {late && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.name}</p>
                      {creator && <p className="text-xs text-slate-400">par {creator.firstName} {creator.lastName}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <button className="hover:text-orange-600 transition-colors" onClick={() => project && navigate(`/admin/project/${project.id}`)}>
                    {project?.name}
                  </button>
                </td>
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
                <td className="px-4 py-3">
                  <div className={`flex items-center gap-1.5 text-sm ${late ? "text-red-600 font-medium" : "text-slate-500"}`}>
                    {late && <Clock className="w-3.5 h-3.5" />}
                    {formatDate(t.dueDate)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(t)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editTask ? "Modifier la tâche" : "Créer une tâche"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={submit}>{editTask ? "Enregistrer" : "Créer"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nom de la tâche" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select
            label="Projet"
            placeholder="Sélectionner un projet"
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value, assigneeId: "" })}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />
          <Select
            label="Statut"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
            options={(["todo", "in_progress", "done"] as TaskStatus[]).map((s) => ({ value: s, label: taskStatusLabel(s) }))}
          />
          <Select
            label="Assigné à"
            placeholder={form.projectId ? "Sélectionner un membre" : "Sélectionnez d'abord un projet"}
            value={form.assigneeId}
            onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
            options={projectMembers(form.projectId).map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date de début" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="Échéance" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteTask(deleteTarget.id)}
        title="Supprimer cette tâche ?"
        description={`La tâche "${deleteTarget?.name}" sera définitivement supprimée.`}
      />
    </div>
  );
}
