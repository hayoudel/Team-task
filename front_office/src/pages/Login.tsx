import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/ui/Button";

export default function Login() {
  const { login, authLoading, authError } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login({ email, motDePasse });
    if (ok) navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-sm">
            TT
          </div>
          <span className="font-black text-slate-900 text-lg">Team Task</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-7">
          <h1 className="text-xl font-black text-slate-900 mb-1">Connexion</h1>
          <p className="text-sm text-slate-500 mb-6">Accédez à vos projets et tâches</p>

          {authError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-2.5 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@teamtask.fr"
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Mot de passe</label>
              <input
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="********"
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={authLoading}>
              {authLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-orange-600 font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}