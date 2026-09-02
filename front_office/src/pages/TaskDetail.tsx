import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Timeline from "../components/ui/Timeline";

export default function TaskDetail() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white p-7">
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-2xl font-black">Intégration HTML</h1>
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">
            En cours
          </span>
        </div>
        <Link to="/projects/1" className="text-orange-50 text-sm hover:underline">
          Refonte site web
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-6">Progression</p>
            <Timeline steps={["Créée", "À faire", "En cours", "Terminée"]} activeIndex={2} />
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">Dates</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Date de création</p>
                <p className="text-sm font-medium text-slate-900">2024-03-01</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Date de début</p>
                <p className="text-sm font-medium text-slate-900">2024-03-15</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Échéance</p>
                <p className="text-sm font-medium text-red-500">2024-04-15</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-2">Description</p>
            <p className="text-sm text-slate-600">
              Intégrer les maquettes validées en HTML/CSS sémantique, en respectant le design system et les
              règles d'accessibilité définies pour le projet.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs text-slate-400 mb-2">Projet</p>
            <Link to="/projects/1" className="text-sm font-semibold text-orange-600 hover:underline">
              Refonte site web
            </Link>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-400 mb-3">Assigné</p>
            <div className="flex items-center gap-3">
              <Avatar name="David Rousseau" size="sm" />
              <p className="text-sm font-medium text-slate-900">David Rousseau</p>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-400 mb-3">Créé par</p>
            <div className="flex items-center gap-3">
              <Avatar name="Bruno Martin" size="sm" />
              <p className="text-sm font-medium text-slate-900">Bruno Martin</p>
            </div>
          </Card>
          <Button variant="outline" className="w-full justify-center">
            Changer le statut
          </Button>
        </div>
      </div>
    </div>
  );
}
