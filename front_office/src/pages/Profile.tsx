import { Check, X, Mail, Phone, CalendarDays } from "lucide-react";
import { useAppContext } from "../context/AppContext";
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

const chefDenied = [
  "Créer des projets",
  "Ajouter des membres",
  "Modifier tâches admin",
];

const userAllowed = [
  "Voir mes projets",
  "Créer des tâches",
  "Modifier ses tâches",
  "Modifier les statuts",
];

const userDenied = [
  "Créer des projets",
  "Ajouter des membres",
  "Attribuer des tâches",
  "Modifier tâches admin",
];

export default function Profile() {
  const {
    user,
    projects,
    projectsLoading,
    projectTasks,
  } = useAppContext();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">
          Impossible de charger votre profil.
        </p>
      </div>
    );
  }

  /*
   * Dans ton système actuel :
   * - admin = chef de projet
   * - user = utilisateur
   */
  const isChef = user.role === "admin";

  const fullName = `${user.prenom} ${user.nom}`;

  const initials = `${user.prenom?.charAt(0) ?? ""}${user.nom?.charAt(0) ?? ""}`.toUpperCase();

  const totalProjects = projects.length;

  const totalTasks = projectTasks.length;

  const completedTasks = projectTasks.filter(
    (task) => task.statut === "Terminée"
  ).length;

  const inProgressTasks = projectTasks.filter(
    (task) => task.statut === "En_cours"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mon profil"
        subtitle="Gérez vos informations personnelles"
      />

      <div className="grid grid-cols-3 gap-6">
        {/* COLONNE GAUCHE */}
        <div className="space-y-6">

          {/* Informations principales */}
          <Card className="p-6 text-center">
            <Avatar
              name={fullName}
              size="lg"
              className="mx-auto mb-3"
            />

            <p className="font-black text-slate-900">
              {fullName}
            </p>

            <span
              className={`inline-flex mt-2 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                isChef
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isChef ? "Chef de projet" : "Utilisateur"}
            </span>

            <div className="mt-5 space-y-2 text-left">

              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>

              {user.numero_telephone && (
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" />
                  {user.numero_telephone}
                </p>
              )}

            </div>
          </Card>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-3">

            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-slate-900">
                {projectsLoading ? "..." : totalProjects}
              </p>
              <p className="text-xs text-slate-500">
                Projets
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-slate-900">
                {totalTasks}
              </p>
              <p className="text-xs text-slate-500">
                Tâches
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-slate-900">
                {completedTasks}
              </p>
              <p className="text-xs text-slate-500">
                Terminées
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-slate-900">
                {inProgressTasks}
              </p>
              <p className="text-xs text-slate-500">
                En cours
              </p>
            </div>

          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="col-span-2 space-y-6">

          {/* Informations personnelles */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700">
                Informations personnelles
              </p>

              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Prénom
                </label>

                <input
                  disabled
                  value={user.prenom}
                  readOnly
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Nom
                </label>

                <input
                  disabled
                  value={user.nom}
                  readOnly
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Email
                </label>

                <input
                  disabled
                  value={user.email}
                  readOnly
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Téléphone
                </label>

                <input
                  disabled
                  value={user.numero_telephone || ""}
                  readOnly
                  placeholder="Non renseigné"
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

            </div>
          </Card>

          {/* Sécurité */}
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">
              Sécurité
            </p>

            <div className="space-y-3">

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Mot de passe actuel
                </label>

                <input
                  disabled
                  type="password"
                  value="********"
                  readOnly
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Nouveau mot de passe
                </label>

                <input
                  disabled
                  type="password"
                  placeholder="********"
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Confirmer le mot de passe
                </label>

                <input
                  disabled
                  type="password"
                  placeholder="********"
                  className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </div>

            </div>
          </Card>

          {/* Permissions */}
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">
              Permissions
            </p>

            <div className="grid grid-cols-2 gap-6">

              <div className="space-y-2">
                {(isChef ? chefAllowed : userAllowed).map((permission) => (
                  <p
                    key={permission}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {permission}
                  </p>
                ))}
              </div>

              <div className="space-y-2">
                {(isChef ? chefDenied : userDenied).map((permission) => (
                  <p
                    key={permission}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    {permission}
                  </p>
                ))}
              </div>

            </div>
          </Card>

          {/* Mes projets */}
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">
              Mes projets
            </p>

            {projectsLoading ? (
              <p className="text-sm text-slate-400">
                Chargement des projets...
              </p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-slate-400">
                Aucun projet.
              </p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {project.nom}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {project.description}
                      </p>
                    </div>

                    <span
                      className={`text-xs rounded-full px-2.5 py-1 ${
                        project.statut === "Terminé"
                          ? "bg-emerald-50 text-emerald-600"
                          : project.statut === "En cours"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {project.statut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}