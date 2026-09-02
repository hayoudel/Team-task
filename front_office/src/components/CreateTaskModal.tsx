import { useState, FormEvent } from "react";
import { X, AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { ProjectMember } from "../types/projectMember";
import Button from "./ui/Button";

interface CreateTaskModalProps {
  projectId: number;
  members: ProjectMember[];
  canAssignOthers: boolean;
  currentUserId: number;
  onClose: () => void;
}

export default function CreateTaskModal({
  projectId,
  members,
  canAssignOthers,
  currentUserId,
  onClose,
}: CreateTaskModalProps) {
  const { createTask, taskActionError } = useAppContext();
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [responsableId, setResponsableId] = useState<string>(
    canAssignOthers ? "" : String(currentUserId)
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!responsableId) return;
    setSubmitting(true);
    const ok = await createTask({
      nom,
      description,
      date_debut: dateDebut,
      date_fin: dateFin,
      project_id: projectId,
      responsable_id: Number(responsableId),
    });
    setSubmitting(false);
    if (ok) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">Créer une tâche</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all duration-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {taskActionError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-3 py-2 text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {taskActionError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Nom de la tâche</label>
            <input
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Date de début</label>
              <input
                type="date"
                required
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Échéance</label>
              <input
                type="date"
                required
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Assignée à</label>
            {canAssignOthers ? (
              <select
                required
                value={responsableId}
                onChange={(e) => setResponsableId(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              >
                <option value="">Sélectionner un membre</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.prenom} {m.nom}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
                Vous-même (les tâches que vous créez vous sont automatiquement assignées)
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1 justify-center" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1 justify-center" disabled={submitting}>
              {submitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}