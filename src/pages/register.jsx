import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  // 1. Initialisation avec un rôle par défaut
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "pharmacien", // Rôle par défaut
  });
  
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 2. Liste des rôles autorisés à l'inscription
  const roles = ["pharmacien", "caissier"];

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth.php?action=register", formData);
      if (res.data.success) {
        alert("Demande envoyée ! Veuillez attendre la validation de l'administrateur.");
        navigate("/");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Erreur lors de la demande d'inscription.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h3>Demander un accès</h3>
        {message && <div className="alert alert-warning">{message}</div>}
        <form onSubmit={handleRegister}>
          <input
            className="form-control mb-3"
            placeholder="Nom"
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Mot de passe"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <label className="form-label">Rôle demandé</label>
          <select
            className="form-select mb-3"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <button className="btn btn-success w-100">Soumettre la demande</button>
        </form>
      </div>
    </div>
  );
}

export default Register;