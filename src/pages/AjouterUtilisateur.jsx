import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

const AjouterUtilisateur = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "user",
  });
  // Dans AjouterUtilisateur.jsx
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles.php");
        // On vérifie que res.data est bien un tableau avant de mettre à jour l'état
        if (Array.isArray(res.data)) {
          setRoles(res.data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des rôles :", err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/utilisateurs.php", formData);
      navigate("/utilisateurs"); // Retour à la liste après ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de la création de l'utilisateur");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Ajouter un utilisateur</h3>
          <div
            className="card border-0 shadow-sm p-4"
            style={{ maxWidth: "600px" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="">Choisir un rôle</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Enregistrer
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AjouterUtilisateur;
