import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/ui/Button";

export default function Register() {
  const { register, authLoading, authError } = useAppContext();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [numeroTelephone, setNumeroTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [mismatchError, setMismatchError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMismatchError(null);
    if (motDePasse !== confirmMotDePasse) {
      setMismatchError("Les mots de passe ne correspondent pas.");
      return;
    }
    const ok = await register({
      nom,
      prenom,
      email,
      motDePasse,
      numero_telephone: numeroTelephone,
    });
    if (ok) navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-sm">
            TT
          </div>
          <span className="font-black text-slate-900 text-lg">Team Task</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-7">
          <h1 className="text-xl font-black text-slate-900 mb-1">Créer un compte</h1>
          <p className="text-sm text-slate-500 mb-6">Rejoignez votre équipe sur Team Task</p>

          {(authError || mismatchError) && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-2.5 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {mismatchError ?? authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Prénom</label>
                <input
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Bruno"
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Nom</label>
                <input
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Martin"
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
              </div>
            </div>
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
              <label className="text-xs text-slate-500 mb-1 block">Téléphone</label>
              <input
                required
                value={numeroTelephone}
                onChange={(e) => setNumeroTelephone(e.target.value)}
                placeholder="+225 07 00 00 00 00"
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
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={confirmMotDePasse}
                onChange={(e) => setConfirmMotDePasse(e.target.value)}
                placeholder="********"
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={authLoading}>
              {authLoading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-orange-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}