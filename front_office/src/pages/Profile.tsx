import { useOutletContext } from "react-router-dom";
import { Check, X, Mail, Phone, CalendarDays } from "lucide-react";
import { Role } from "../types/project";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import PageHeader from "../components/ui/PageHeader";

const chefAllowed = [
  "Voir mes projets",
  "Créer des tâches",
  "Modifier ses tâches",
  "Attribuer des tâches",
  "Modifier les statuts",
  "Suivi de projets",
];
const chefDenied = ["Créer des projets", "Ajouter des membres", "Modifier tâches admin"];

const userAllowed = ["Voir mes projets", "Créer des tâches", "Modifier ses tâches", "Modifier les statuts"];
const userDenied = ["Créer des projets", "Ajouter des membres", "Attribuer des tâches", "Modifier tâches admin"];

const chefProjects = [
  { name: "Refonte site web", role: "Chef de projet" },
  { name: "App mobile iOS", role: "Chef de projet" },
  { name: "Dashboard analytics", role: "Chef de projet" },
];

const userProjects = [
  { name: "Refonte site web", role: "Développeur" },
  { name: "App mobile iOS", role: "Développeur" },
];

export default function Profile() {
  const { role } = useOutletContext<{ role: Role }>();
  const isChef = role === "chef";
  const name = isChef ? "Bruno Martin" : "David Rousseau";
  const initials = isChef ? "BM" : "DR";
  const email = isChef ? "bruno@teamtask.fr" : "david@teamtask.fr";
  const [first, last] = name.split(" ");

  return (
    <div className="space-y-6">
      <PageHeader title="Mon profil" subtitle="Gérez vos informations personnelles" />

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <Avatar name={initials === "BM" ? "Bruno Martin" : "David Rousseau"} size="lg" className="mx-auto mb-3" />
            <p className="font-black text-slate-900">{name}</p>
            <span
              className={`inline-flex mt-2 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                isChef ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {isChef ? "Chef de projet" : "Utilisateur"}
            </span>
            <div className="mt-5 space-y-2 text-left">
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5" /> {email}
              </p>
              {isChef && (
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> +33 6 23 45 67 89
                </p>
              )}
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays className="w-3.5 h-3.5" /> Membre depuis janvier 2024
              </p>
            </div>
          </Card>

          <div className={`grid gap-3 ${isChef ? "grid-cols-2" : "grid-cols-2"}`}>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{isChef ? 3 : 2}</p>
              <p className="text-xs text-slate-500">Projets</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{isChef ? 12 : 6}</p>
              <p className="text-xs text-slate-500">Tâches</p>
            </div>
            {isChef && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                  <p className="text-2xl font-black text-slate-900">4</p>
                  <p className="text-xs text-slate-500">Terminées</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                  <p className="text-2xl font-black text-slate-900">5</p>
                  <p className="text-xs text-slate-500">En cours</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700">Informations personnelles</p>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Prénom</label>
                <input disabled defaultValue={first} className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nom</label>
                <input disabled defaultValue={last} className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Email</label>
                <input disabled defaultValue={email} className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
              </div>
              {isChef && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Téléphone</label>
                  <input disabled defaultValue="+33 6 23 45 67 89" className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">Sécurité</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Mot de passe actuel</label>
                <input disabled type="password" defaultValue="********" className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nouveau mot de passe</label>
                <input disabled type="password" placeholder="********" className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Confirmer le mot de passe</label>
                <input disabled type="password" placeholder="********" className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">Permissions</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                {(isChef ? chefAllowed : userAllowed).map((p) => (
                  <p key={p} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {p}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                {(isChef ? chefDenied : userDenied).map((p) => (
                  <p key={p} className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-red-400 shrink-0" /> {p}
                  </p>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">Mes projets</p>
            <div className="space-y-2">
              {(isChef ? chefProjects : userProjects).map((p) => (
                <div key={p.name} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{p.name}</p>
                  <span className="text-xs text-slate-500">{p.role}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
