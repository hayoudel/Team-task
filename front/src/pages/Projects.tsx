import { CheckCircle2, FolderKanban, LayoutGrid, List, Pause, Plus, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, PageHeader, ProgressBar, ProjectStatusBadge } from "../components/ui/Basics";
import { Input, Select, Textarea } from "../components/ui/Form";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { formatDate, projectProgress, projectStatusLabel } from "../utils/helpers";
import type { ProjectStatus } from "../types";

const emptyForm = { name: "", description: "", status: "active" as ProjectStatus, startDate: "", endDate: "" };

export function Projects() {
  const { projects, users, tasks,addProject } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
 

  const counts = {
    active: projects.filter((p) => p.status === "active").length,
    on_hold: projects.filter((p) => p.status === "on_hold").length,
    completed: projects.filter((p) => p.status === "completed").length,
    cancelled: projects.filter((p) => p.status === "cancelled").length,
  };

const submit = async () => {
  if (!form.name) return;

  try {
    const id = await addProject(form);

    setShowForm(false);
    setForm(emptyForm);

    navigate(`/admin/project/${id}`);
  } catch (error) {
    console.error("Erreur création projet :", error);
  }
};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projets"
        subtitle="Suivez l'ensemble des projets de votre organisation"
        action={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Nouveau projet
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryStat icon={<FolderKanban className="w-4 h-4" />} label="Actifs" value={counts.active} colorClass="text-blue-600 bg-blue-50" />
        <SummaryStat icon={<Pause className="w-4 h-4" />} label="En pause" value={counts.on_hold} colorClass="text-amber-600 bg-amber-50" />
        <SummaryStat icon={<CheckCircle2 className="w-4 h-4" />} label="Terminés" value={counts.completed} colorClass="text-emerald-600 bg-emerald-50" />
        <SummaryStat icon={<XCircle className="w-4 h-4" />} label="Annulés" value={counts.cancelled} colorClass="text-red-600 bg-red-50" />
      </div>

      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => setView("cards")}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${view === "cards" ? "bg-orange-500 text-white" : "bg-white text-slate-400 border border-slate-200 hover:text-slate-600"}`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${view === "list" ? "bg-orange-500 text-white" : "bg-white text-slate-400 border border-slate-200 hover:text-slate-600"}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="p-5" onClick={() => navigate(`/admin/project/${p.id}`)}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <ProjectStatusBadge status={p.status} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{p.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{p.description}</p>
              <ProgressBar value={projectProgress(tasks, p.id)} showLabel size="sm" />
              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                  {p.members.slice(0, 4).map((m) => {
                    const user = users.find((u) => u.id === m.userId);
                    if (!user) return null;
                    return <Avatar key={m.userId} id={user.id} firstName={user.firstName} lastName={user.lastName} size="xs" ring />;
                  })}
                </div>
                <span className="text-xs text-slate-400">Fin : {formatDate(p.endDate)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-2">
          <Table headers={["Nom", "Statut", "Membres", "Progression", "Dates", ""]}>
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/admin/project/${p.id}`)}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                <td className="px-4 py-3">
                  <ProjectStatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex -space-x-2">
                    {p.members.slice(0, 4).map((m) => {
                      const user = users.find((u) => u.id === m.userId);
                      if (!user) return null;
                      return <Avatar key={m.userId} id={user.id} firstName={user.firstName} lastName={user.lastName} size="xs" ring />;
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 w-40">
                  <ProgressBar value={projectProgress(tasks, p.id)} showLabel size="sm" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatDate(p.startDate)} → {formatDate(p.endDate)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost">
                    Voir
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Nouveau projet"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={submit}>Créer le projet</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nom du projet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select
            label="Statut"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
            options={(["active", "on_hold", "completed", "cancelled"] as ProjectStatus[]).map((s) => ({ value: s, label: projectStatusLabel(s) }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date de début" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="Date de fin" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SummaryStat({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: number; colorClass: string }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </Card>
  );
}
