
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";
import type { Task, UpdateTaskPayload } from "../types/task";

import type { ProjectMember } from "../types/projectMember";

interface EditTaskModalProps {
  task: Task;
  members: ProjectMember[];
  canAssignOthers: boolean;
  currentUserId: number;
  onClose: () => void;
  onUpdate: (
    taskId: number,
    data: UpdateTaskPayload
  ) => Promise<void>;
}

export default function EditTaskModal({
  task,
  members,
  canAssignOthers,
  currentUserId,
  onClose,
  onUpdate,
}: EditTaskModalProps) {
  const [nom, setNom] = useState(task.nom);
  const [description, setDescription] = useState(task.description || "");
  const [statut, setStatut] = useState(task.statut);
  const [dateDebut, setDateDebut] = useState(
    task.date_debut ? task.date_debut.substring(0, 10) : ""
  );
  const [dateFin, setDateFin] = useState(
    task.date_fin ? task.date_fin.substring(0, 10) : ""
  );

  const [responsableId, setResponsableId] = useState(
    task.responsable_id ? String(task.responsable_id) : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Si l'utilisateur n'est pas chef/admin,
  // il ne peut pas modifier le responsable.
  useEffect(() => {
    if (!canAssignOthers) {
      setResponsableId(String(currentUserId));
    }
  }, [canAssignOthers, currentUserId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!nom.trim()) {
      setError("Le nom de la tâche est obligatoire.");
      return;
    }

    if (!dateDebut || !dateFin) {
      setError("Les dates sont obligatoires.");
      return;
    }

    if (new Date(dateFin) < new Date(dateDebut)) {
      setError("La date de fin doit être supérieure ou égale à la date de début.");
      return;
    }

    try {
      setLoading(true);

      const data: UpdateTaskPayload = {
        nom: nom.trim(),
        description: description.trim(),
        statut,
        date_debut: dateDebut,
        date_fin: dateFin,
      };

      if (responsableId) {
        data.responsable_id = Number(responsableId);
      }

      await onUpdate(task.id, data);

      onClose();
    } catch (err: any) {
      setError(
        err?.message || "Une erreur est survenue lors de la modification."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Modifier la tâche
            </h2>

            <p className="text-sm text-slate-400">
              Modifiez les informations de la tâche
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>

          <div className="space-y-4 p-6">

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nom de la tâche
              </label>

              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                placeholder="Nom de la tâche"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                placeholder="Description de la tâche"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Statut
              </label>

              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
              >
                <option value="A faire">A faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Date de début
                </label>

                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Date de fin
                </label>

                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </div>

            </div>

            {/* Responsable */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Responsable
              </label>

              {canAssignOthers ? (
                <select
                  value={responsableId}
                  onChange={(e) => setResponsableId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                >
                  <option value="">Aucun responsable</option>

                  {members.map((member) => (
                    <option key={member.id} value={member.userId}>
                      {member.prenom} {member.nom}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {task.responsable
                    ? `${task.responsable.prenom} ${task.responsable.nom}`
                    : "Vous"}
                </div>
              )}

              {!canAssignOthers && (
                <p className="mt-1 text-xs text-slate-400">
                  Seul l'administrateur ou le chef de projet peut modifier le responsable.
                </p>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t px-6 py-4">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Modification..." : "Enregistrer"}
            </Button>

          </div>

        </form>
      </div>
    </div>
  );
}

