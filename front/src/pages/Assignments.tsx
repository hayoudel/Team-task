import { FolderKanban, Pencil, Plus, Shuffle, UserMinus, Users as UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, PageHeader, StatCard } from "../components/ui/Basics";
import { FilterSelect, Select, SearchInput } from "../components/ui/Form";
import { ConfirmModal, Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";

interface Row {
  projectId: string;
  userId: string;
  projectRole: string;
}

export function Assignments() {
  const { projects, users, roles, addMember, updateMemberRole, removeMember } = useApp();
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ projectId: "", userId: "", projectRole: "" });

  const [editTarget, setEditTarget] = useState<Row | null>(null);
  const [editRole, setEditRole] = useState("");

  const [removeTarget, setRemoveTarget] = useState<Row | null>(null);

  const rows: Row[] = useMemo(
    () => projects.flatMap((p) => p.members.map((m) => ({ projectId: p.id, userId: m.userId, projectRole: m.projectRole }))),
    [projects]
  );

  const filtered = rows.filter((r) => {
    const user = users.find((u) => u.id === r.userId);
    const matchSearch = `${user?.firstName} ${user?.lastName} ${user?.email}`.toLowerCase().includes(search.toLowerCase());
    const matchProject = !projectFilter || r.projectId === projectFilter;
    return matchSearch && matchProject;
  });

  const assignedUsersCount = new Set(rows.map((r) => r.userId)).size;
  const projectsWithMembers = new Set(rows.map((r) => r.projectId)).size;

  const nonMembersFor = (projectId: string) => {
    const p = projects.find((pr) => pr.id === projectId);
    if (!p) return users;
    return users.filter((u) => !p.members.some((m) => m.userId === u.id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affectations"
        subtitle="Gérez l'affectation des utilisateurs aux projets"
        action={
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setAddForm({ projectId: "", userId: "", projectRole: "" });
              setShowAdd(true);
            }}
          >
            Affecter un utilisateur
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Shuffle className="w-5 h-5" />} value={rows.length} label="Affectations totales" color="orange" />
        <StatCard icon={<UsersIcon className="w-5 h-5" />} value={assignedUsersCount} label="Utilisateurs assignés" color="blue" />
        <StatCard icon={<FolderKanban className="w-5 h-5" />} value={projectsWithMembers} label="Projets avec membres" color="emerald" />
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un utilisateur..." />
          <FilterSelect value={projectFilter} onChange={setProjectFilter} placeholder="Tous les projets" options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        </div>

        <Table headers={["Utilisateur", "Projet", "Rôle", ""]} isEmpty={filtered.length === 0}>
          {filtered.map((r) => {
            const user = users.find((u) => u.id === r.userId);
            const project = projects.find((p) => p.id === r.projectId);
            if (!user || !project) return null;
            return (
              <tr key={`${r.projectId}-${r.userId}`} className="group hover:bg-slate-50/60 transition-colors duration-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar id={user.id} firstName={user.firstName} lastName={user.lastName} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    {project.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">{r.projectRole}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditTarget(r);
                        setEditRole(r.projectRole);
                      }}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setRemoveTarget(r)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Affecter un utilisateur"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (!addForm.projectId || !addForm.userId || !addForm.projectRole) return;
                addMember(addForm.projectId, { userId: addForm.userId, projectRole: addForm.projectRole });
                setShowAdd(false);
              }}
            >
              Affecter
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Projet"
            placeholder="Sélectionner un projet"
            value={addForm.projectId}
            onChange={(e) => setAddForm({ ...addForm, projectId: e.target.value, userId: "" })}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />
          <Select
            label="Utilisateur"
            placeholder={addForm.projectId ? "Sélectionner un utilisateur" : "Sélectionnez d'abord un projet"}
            value={addForm.userId}
            onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
            options={nonMembersFor(addForm.projectId).map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))}
          />
          <Select
            label="Rôle dans le projet"
            placeholder="Sélectionner un rôle"
            value={addForm.projectRole}
            onChange={(e) => setAddForm({ ...addForm, projectRole: e.target.value })}
            options={roles.map((r) => ({ value: r.name, label: r.name }))}
          />
        </div>
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Modifier le rôle"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (editTarget) updateMemberRole(editTarget.projectId, editTarget.userId, editRole);
                setEditTarget(null);
              }}
            >
              Enregistrer
            </Button>
          </>
        }
      >
        {editTarget &&
          (() => {
            const user = users.find((u) => u.id === editTarget.userId);
            const project = projects.find((p) => p.id === editTarget.projectId);
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                  {user && <Avatar id={user.id} firstName={user.firstName} lastName={user.lastName} size="sm" />}
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{project?.name}</p>
                  </div>
                </div>
                <Select label="Nouveau rôle" value={editRole} onChange={(e) => setEditRole(e.target.value)} options={roles.map((r) => ({ value: r.name, label: r.name }))} />
              </div>
            );
          })()}
      </Modal>

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => removeTarget && removeMember(removeTarget.projectId, removeTarget.userId)}
        title="Retirer cette affectation ?"
        description="L'utilisateur n'aura plus accès à ce projet."
        confirmLabel="Retirer"
      />
    </div>
  );
}
