import { Check, Pencil, Shuffle, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Button, Card, PageHeader, StatCard } from "../components/ui/Basics";
import { Input } from "../components/ui/Form";
import { ConfirmModal } from "../components/ui/Modal";

const badgeColors = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
];

export function Roles() {
  const { roles, projects, addRole, updateRole, deleteRole } = useApp();
  const [newRole, setNewRole] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const usageCount = (roleName: string) => projects.reduce((sum, p) => sum + p.members.filter((m) => m.projectRole === roleName).length, 0);
  const totalAssignments = projects.reduce((sum, p) => sum + p.members.length, 0);

  const submitNewRole = () => {
    if (!newRole.trim()) return;
    addRole(newRole.trim());
    setNewRole("");
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) updateRole(editingId, editValue.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Rôles" subtitle="Définissez les rôles utilisés au sein des équipes projet" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Créer un rôle</h3>
            <div className="space-y-3">
              <Input
                placeholder="Nom du rôle"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitNewRole()}
              />
              <Button className="w-full" onClick={submitNewRole}>
                Créer le rôle
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <StatCard icon={<Tags className="w-5 h-5" />} value={roles.length} label="Rôles définis" color="orange" />
            <StatCard icon={<Shuffle className="w-5 h-5" />} value={totalAssignments} label="Affectations actives" color="blue" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Liste des rôles</h3>
            <div className="space-y-1">
              {roles.map((r, i) => (
                <div key={r.id} className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50/60 transition-colors duration-200">
                  {editingId === r.id ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 mr-3 rounded-lg border border-orange-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeColors[i % badgeColors.length]}`}>{r.name}</span>
                      <span className="text-xs text-slate-400">{usageCount(r.name)} affectation{usageCount(r.name) !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    {editingId === r.id ? (
                      <button onClick={commitEdit} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-emerald-500 hover:bg-emerald-50">
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => startEdit(r.id, r.name)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteRole(deleteTarget.id)}
        title="Supprimer ce rôle ?"
        description={`Le rôle "${deleteTarget?.name}" sera supprimé. Les affectations existantes conserveront ce libellé jusqu'à modification.`}
      />
    </div>
  );
}
