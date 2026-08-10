import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import indispensable
import api from "../services/api";
import "../assets/scss/Login.scss";

const LOGO_URL = "/LOGO.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth.php?action=login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // --- NOUVEAU : Récupération du rôle ---
        const user = response.data.user;

        toast.success("Bienvenue sur E-Stock Pharma !");

        // Redirection conditionnelle
        if (user.role === "caissier") {
          navigate("/ventes");
        } else {
          navigate("/dashboard");
        }
      }
      {
        // Affiche l'erreur via Toast au lieu d'une div rouge
        toast.error(response.data.message || "Identifiants invalides");
      }
    } catch (err) {
      toast.error("Erreur technique : impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="login-card d-flex shadow">
        <div className="left-panel d-flex flex-column justify-content-between p-5 text-center text-white">
          <div className="logo-section">
            <img
              src={LOGO_URL}
              alt="Logo"
              className="img-fluid Logo_image mb-2"
            />
            <p className="slogan">Gestion de stock pharmacie</p>
          </div>
        </div>

        <div className="right-panel d-flex align-items-center justify-content-center p-5 bg-white">
          <form onSubmit={handleLogin} className="login-form w-100">
            <h2 className="fw-bold mb-4">Connexion</h2>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                style={{ right: "15px", top: "12px", cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="mt-3 text-center">
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={() => navigate("/reset-password")}
              >
                Mot de passe oublié ?
              </button>
              <p className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
                Pas encore de compte ? <a href="/register">Demander un accès</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
