import { Eye, Pencil, Plus, ShieldCheck, Trash2, UserCog, Users as UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, PageHeader, RoleBadge, StatCard } from "../components/ui/Basics";
import { Input, Select, SearchInput } from "../components/ui/Form";
import { Modal, ConfirmModal } from "../components/ui/Modal";
import { Pagination, Table } from "../components/ui/Table";
import { formatDate, roleLabel } from "../utils/helpers";
import type { User, UserRole } from "../types";

const PAGE_SIZE = 8;

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "user" as UserRole
};
export function Users() {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q));
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    admin: users.filter((u) => u.role === "admin").length,
    chef_projet: users.filter((u) => u.role === "chef_projet").length,
    user: users.filter((u) => u.role === "user").length,
  };

  const openCreate = () => {
    setEditUser(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, role: u.role });
    setShowForm(true);
  };

  const submitForm = () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    if (editUser) updateUser(editUser.id, form);
    else addUser(form);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes et rôles des membres de votre organisation"
        action={
          <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Ajouter un utilisateur
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<ShieldCheck className="w-5 h-5" />} value={counts.admin} label="Administrateurs" color="red" />
        <StatCard icon={<UserCog className="w-5 h-5" />} value={counts.chef_projet} label="Chefs de projet" color="orange" />
        <StatCard icon={<UsersIcon className="w-5 h-5" />} value={counts.user} label="Utilisateurs" color="blue" />
      </div>

      <Card className="p-5">
        <div className="mb-4">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher par nom ou email..." />
        </div>

        <Table headers={["Utilisateur", "Email", "Téléphone", "Rôle", "Inscription", ""]} isEmpty={paged.length === 0}>
          {paged.map((u) => (
            <tr key={u.id} className="group hover:bg-slate-50/60 transition-colors duration-200">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar id={u.id} firstName={u.firstName} lastName={u.lastName} size="sm" />
                  <span className="text-sm font-medium text-slate-900">
                    {u.firstName} {u.lastName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{u.phone}</td>
              <td className="px-4 py-3">
                <RoleBadge role={u.role} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  <IconBtn onClick={() => setViewUser(u)} title="Voir">
                    <Eye className="w-4 h-4" />
                  </IconBtn>
                  <IconBtn onClick={() => openEdit(u)} title="Modifier">
                    <Pencil className="w-4 h-4" />
                  </IconBtn>
                  <IconBtn onClick={() => setDeleteTarget(u)} title="Supprimer" danger>
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

      {/* View modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="Détail utilisateur">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <Avatar id={viewUser.id} firstName={viewUser.firstName} lastName={viewUser.lastName} size="lg" />
              <p className="mt-3 text-base font-semibold text-slate-900">
                {viewUser.firstName} {viewUser.lastName}
              </p>
              <div className="mt-1.5">
                <RoleBadge role={viewUser.role} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-50 rounded-lg px-4 py-3">
                <p className="text-xs text-slate-400 mb-0.5">Email</p>
                <p className="text-sm text-slate-800">{viewUser.email}</p>
              </div>
          
              <div className="bg-slate-50 rounded-lg px-4 py-3">
                <p className="text-xs text-slate-400 mb-0.5">Téléphone</p>
                <p className="text-sm text-slate-800">{viewUser.phone}</p>
              </div>

            </div>
          </div>
        )}
      </Modal>

      {/* Create/edit modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={submitForm}>{editUser ? "Enregistrer" : "Créer"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Mot de passe " type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select
            label="Rôle système"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            options={[
              { value: "admin", label: roleLabel("admin") },
              { value: "user", label: roleLabel("user") },
            ]}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteUser(deleteTarget.id)}
        title="Supprimer cet utilisateur ?"
        description={`${deleteTarget?.firstName} ${deleteTarget?.lastName} sera définitivement supprimé ainsi que ses affectations aux projets.`}
      />
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
        danger ? "text-slate-400 hover:bg-red-50 hover:text-red-500" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}
