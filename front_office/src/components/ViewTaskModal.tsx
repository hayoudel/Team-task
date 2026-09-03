import { X } from "lucide-react";
import Button from "./ui/Button";
import type { Task } from "../types/task";

interface ViewTaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function ViewTaskModal({
  task,
  onClose,
}: ViewTaskModalProps) {
  function formatDate(date: string) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Détails de la tâche
            </h2>

            <p className="text-sm text-slate-400">
              Consultez les informations de cette tâche
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

        {/* Contenu */}
        <div className="space-y-5 p-6">

          {/* Nom */}
          <div>
            <p className="mb-1 text-xs font-medium uppercase text-slate-400">
              Nom de la tâche
            </p>

            <p className="text-sm font-semibold text-slate-800">
              {task.nom}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="mb-1 text-xs font-medium uppercase text-slate-400">
              Description
            </p>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {task.description || "Aucune description"}
              </p>
            </div>
          </div>

          {/* Statut */}
          <div>
            <p className="mb-1 text-xs font-medium uppercase text-slate-400">
              Statut
            </p>

            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              {task.statut || "—"}
            </span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                Date de début
              </p>

              <p className="text-sm text-slate-700">
                {formatDate(task.date_debut)}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                Date de fin
              </p>

              <p className="text-sm text-slate-700">
                {formatDate(task.date_fin)}
              </p>
            </div>

          </div>

          {/* Créateur */}
          <div>
            <p className="mb-1 text-xs font-medium uppercase text-slate-400">
              Créateur
            </p>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              {task.creator ? (
                <>
                  <p className="text-sm font-medium text-slate-800">
                    {task.creator.prenom} {task.creator.nom}
                  </p>

                  <p className="text-xs text-slate-500">
                    {task.creator.email}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  Inconnu
                </p>
              )}
            </div>
          </div>

          {/* Responsable */}
          <div>
            <p className="mb-1 text-xs font-medium uppercase text-slate-400">
              Responsable
            </p>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              {task.responsable ? (
                <>
                  <p className="text-sm font-medium text-slate-800">
                    {task.responsable.prenom} {task.responsable.nom}
                  </p>

                  <p className="text-xs text-slate-500">
                    {task.responsable.email}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  Aucun responsable
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>

      </div>
    </div>
  );
}