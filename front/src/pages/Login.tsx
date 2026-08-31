import { CheckCircle2} from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/Basics";
import { Input } from "../components/ui/Form";

const features = [
  "Suivi en temps réel de tous vos projets",
  "Affectation simplifiée des équipes",
  "Tableaux de bord et indicateurs clairs",
  "Gestion fine des rôles et permissions",
];

export function Login() {
  const { currentUser, login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentUser) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = (loginEmail: string) => {
    const ok = login(loginEmail);
    if (ok) navigate("/admin/dashboard");
    else setError("Aucun compte ne correspond à cet email.");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20">
              TT
            </div>
            <span className="text-white font-semibold text-lg">Team Task</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Pilotez vos projets
            <br />
            en toute clarté
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-sm">
            Une plateforme unique pour organiser vos équipes, suivre l'avancement des tâches et livrer vos projets à
            temps.
          </p>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle2 className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-sm">
              TT
            </div>
            <span className="font-semibold text-slate-900">Team Task</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Connexion</h2>
          <p className="text-sm text-slate-500 mb-8">Accédez à votre espace d'administration</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
          >
            <Input
              label="Adresse email"
              type="email"
              placeholder="prenom.nom@teamtask.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" className="w-full" size="lg">
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
