import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth.php?action=request_password_reset", { 
        email, 
        newPassword 
      });
      if (res.data.success) {
        alert("Demande envoyée à l'administrateur.");
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3>Réinitialisation</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Nouveau mot de passe" onChange={(e) => setNewPassword(e.target.value)} required />
        <button className="btn btn-primary w-100">Envoyer la demande</button>
      </form>
    </div>
  );
}

export default ResetPassword;