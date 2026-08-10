import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function ModifierFournisseur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    adresse: "",
    email: "",
  });

  useEffect(() => {
    api.get(`/fournisseurs.php?id=${id}`)
      .then((res) => setFormData(res.data.data))
      .catch((err) => console.error("Erreur chargement:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/fournisseurs.php?id=${id}`, formData);
      alert("Fournisseur mis à jour !");
      navigate("/fournisseurs");
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Modifier le fournisseur</h3>
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4 col-md-6">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input name="nom" value={formData.nom || ""} className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input name="telephone" value={formData.telephone || ""} className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" value={formData.email || ""} className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Adresse</label>
              <textarea name="adresse" value={formData.adresse || ""} className="form-control" onChange={handleChange} rows="3"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ModifierFournisseur;