import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: ReactNode;
  open?: boolean;
}

/**
 * Purement visuel — non fonctionnel (aucun état d'ouverture/fermeture réel).
 * Sert de référence pour le composant Modal du design system.
 */
export default function Modal({ title, children, open = true }: ModalProps) {
  if (!open) return null;
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-slate-900/40 rounded-2xl" />
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">{title}</h3>
          <button className="text-slate-400 hover:text-slate-600 transition-all duration-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-slate-600">{children}</div>
      </div>
    </div>
  );
}
