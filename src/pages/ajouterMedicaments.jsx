import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AjouterMedicament() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    prix_achat: "", // Ajouté
    prix_vente: "",
    quantite: "",
    date_expiration : "",
    seuil_alerte: "", // Vide par défaut pour forcer la saisie ou mettre 10
    id_fournisseur: "", // Ajouté
    description: "",
  });
  useEffect(() => {
    // Récupérer les catégories depuis l'API
    api
      .get("/medicaments.php?action=get-categories")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Erreur catégories", err));
    api
      .get("/medicaments.php?action=get-fournisseurs")
      .then((res) => setFournisseurs(res.data.data))
      .catch((err) => console.error("Erreur fournisseurs:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/medicaments.php", formData);
      alert("Médicament ajouté avec succès !");
      navigate("/medicaments"); // Retour à la liste
    } catch (error) {
      alert(
        "Erreur lors de l'ajout : " +
          (error.response?.data?.message || "Erreur serveur"),
      );
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Ajouter un médicament</h3>
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
            <div className="row g-3">
              {/* Nom et Catégorie */}
              <div className="col-md-6">
                <label className="form-label">Nom du médicament</label>
                <input
                  name="nom"
                  placeholder="Ex: Paracétamol 500mg"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Catégorie</label>
                <select
                  name="categorie"
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix et Stock */}
              <div className="col-md-6">
                <label className="form-label">Prix d'achat (Ar)</label>
                <input
                  type="number"
                  name="prix_achat"
                  placeholder="Ex: 500"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prix unitaire (Ar)</label>
                <input
                  type="number"
                  name="prix_vente"
                  placeholder="Ex: 1000"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Stock initial</label>
                <input
                  type="number"
                  name="quantite"
                  placeholder="Ex: 50"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date d'expiration</label>
                <input
                  type="date"
                  name="date_expiration"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              {/* Seuil et Fournisseur */}
              <div className="col-md-6">
                <label className="form-label">Seuil d'alerte</label>
                <input
                  type="number"
                  name="seuil_alerte"
                  placeholder="Ex: 10"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Champ Fournisseur */}
              <div className="col-md-6">
                <label className="form-label">Fournisseur</label>
                <select
                  name="id_fournisseur"
                  className="form-select"
                  onChange={handleChange}
                  required
                  value={formData.id_fournisseur}
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((fourn) => (
                    <option
                      key={fourn.id_fournisseur}
                      value={fourn.id_fournisseur}
                    >
                      {fourn.nom}
                    </option>
                  ))}
                </select>
              </div>
              {/* Description */}
              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  placeholder="Description du médicament..."
                  className="form-control"
                  rows="3"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="mt-4 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light px-4"
                onClick={() => navigate(-1)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Enregistrer
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AjouterMedicament;
