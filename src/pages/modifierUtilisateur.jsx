import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

const ModifierUtilisateur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    role: ""
  });
  
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // 1. Charger la liste des rôles dynamiquement
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles.php");
        setRoles(res.data);
      } catch (err) { console.error("Erreur chargement rôles:", err); }
    };

    // 2. Charger les données de l'utilisateur à modifier
    const fetchUser = async () => {
      try {
        const res = await api.get(`/utilisateurs.php?id=${id}`);
        setFormData({
            nom: res.data.nom,
            email: res.data.email,
            role: res.data.role
        });
      } catch (err) { console.error("Erreur chargement utilisateur:", err); }
    };

    fetchRoles();
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoi de la requête PUT au backend
      await api.put(`/utilisateurs.php?id=${id}`, formData);
      alert("Utilisateur modifié avec succès !");
      navigate("/utilisateurs");
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Modifier l'utilisateur</h3>
          <div className="card border-0 shadow-sm p-4" style={{ maxWidth: "600px" }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" value={formData.nom} required 
                  onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={formData.email} required 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select className="form-select" value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-warning w-100 text-white">Mettre à jour</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModifierUtilisateur;