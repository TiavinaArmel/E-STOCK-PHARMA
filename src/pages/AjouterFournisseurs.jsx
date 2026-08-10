import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AjouterFournisseur() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    adresse: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fournisseurs.php", formData);
      alert("Fournisseur ajouté avec succès !");
      navigate("/fournisseurs"); // Assure-toi que cette route existe
    } catch (error) {
      console.error("Erreur ajout:", error);
      alert("Erreur lors de l'ajout du fournisseur.");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Ajouter un fournisseur</h3>
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4 col-md-6">
            <div className="mb-3">
              <label className="form-label">Nom du fournisseur</label>
              <input name="nom" className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input name="telephone" className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Adresse</label>
              <textarea name="adresse" className="form-control" onChange={handleChange} rows="3"></textarea>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-light" onClick={() => navigate(-1)}>Annuler</button>
              <button type="submit" className="btn btn-primary">Enregistrer</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AjouterFournisseur;