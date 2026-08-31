import { CheckCircle2, ClipboardList, FolderKanban, ListTodo, Users } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar, Button, Card, PageHeader, RoleBadge } from "../components/ui/Basics";
import { Input } from "../components/ui/Form";
import { formatDate, roleLabel } from "../utils/helpers";

const permissions = [
  "Gérer les utilisateurs",
  "Gérer les projets",
  "Gérer les tâches",
  "Gérer les affectations",
  "Gérer les rôles",
  "Accéder aux statistiques",
];

export function Profile() {
  const { currentUser, users, projects, tasks, updateUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: currentUser?.firstName ?? "", lastName: currentUser?.lastName ?? "", phone: currentUser?.phone ?? "" });
  const [toast, setToast] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  if (!currentUser) return null;

  const projectsCreated = projects.filter((p) => p.createdBy === currentUser.id).length;
  const tasksCreated = tasks.filter((t) => t.creatorId === currentUser.id).length;
  const tasksInProgress = tasks.filter((t) => t.assigneeId === currentUser.id && t.status === "in_progress").length;

  const save = () => {
    updateUser(currentUser.id, form);
    setEditing(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" subtitle="Gérez vos informations personnelles et vos préférences" />

      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profil mis à jour avec succès
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 text-center">
            <Avatar id={currentUser.id} firstName={currentUser.firstName} lastName={currentUser.lastName} size="lg" />
            <p className="mt-3 font-semibold text-slate-900">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <div className="mt-1.5 flex justify-center">
              <RoleBadge role={currentUser.role} />
            </div>
            <div className="mt-5 space-y-2 text-left">
              <div className="bg-slate-50 rounded-lg px-4 py-2.5">
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm text-slate-800">{currentUser.email}</p>
              </div>
              <div className="bg-slate-50 rounded-lg px-4 py-2.5">
                <p className="text-xs text-slate-400">Téléphone</p>
                <p className="text-sm text-slate-800">{currentUser.phone}</p>
              </div>
              <div className="bg-slate-50 rounded-lg px-4 py-2.5">
                <p className="text-xs text-slate-400">Inscrit le</p>
                <p className="text-sm text-slate-800">{formatDate(currentUser.createdAt)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <ActivityStat icon={<Users className="w-4 h-4" />} value={users.length} label="Utilisateurs gérés" />
              <ActivityStat icon={<FolderKanban className="w-4 h-4" />} value={projectsCreated} label="Projets créés" />
              <ActivityStat icon={<ListTodo className="w-4 h-4" />} value={tasksCreated} label="Tâches créées" />
              <ActivityStat icon={<ClipboardList className="w-4 h-4" />} value={tasksInProgress} label="Tâches en cours" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Informations personnelles</h3>
              {!editing ? (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  Modifier
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(false);
                      setForm({ firstName: currentUser.firstName, lastName: currentUser.lastName, phone: currentUser.phone });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button size="sm" onClick={save}>
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" value={form.firstName} disabled={!editing} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <Input label="Nom" value={form.lastName} disabled={!editing} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              <Input label="Email" value={currentUser.email} disabled />
              <Input label="Téléphone" value={form.phone} disabled={!editing} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-5">Sécurité</h3>
            <div className="space-y-4 max-w-sm">
              <Input label="Mot de passe actuel" type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
              <Input label="Nouveau mot de passe" type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
              <Input label="Confirmer le mot de passe" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
              <Button variant="secondary">Mettre à jour le mot de passe</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-5">Permissions ({roleLabel(currentUser.role)})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {permissions.map((p) => (
                <div key={p} className="flex items-center gap-3 bg-emerald-50 rounded-lg px-4 py-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700">{p}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActivityStat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}
