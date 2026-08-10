import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function ModifierMedicament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    prix_achat: "",
    prix_vente: "",
    quantite: "",
    seuil_alerte: "",
    id_fournisseur: "",
    description: "",
    date_expiration: "",
  });

  useEffect(() => {
    // 1. Charger les listes de sélection
    api
      .get("/medicaments.php?action=get-categories")
      .then((res) => setCategories(res.data.data));
    api
      .get("/medicaments.php?action=get-fournisseurs")
      .then((res) => setFournisseurs(res.data.data));
    setLoading(true); // On commence le chargement
    // 2. Charger les données du médicament à modifier
    api
      .get(`/medicaments.php?id=${id}`)
      .then((res) => {
        setFormData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/medicaments.php?id=${id}`, formData);
      alert("Modification réussie !");
      window.dispatchEvent(new Event("statsUpdated"));
      navigate("/medicaments");
    } catch (error) {
      alert("Erreur lors de la modification");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Modifier le médicament</h3>
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom du médicament</label>
                <input
                  name="nom"
                  value={formData.nom || ""}
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
                  value={formData.categorie || ""}
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

              {/* Ajoute le value={formData.champ || ""} à chaque input restant */}
              <div className="col-md-6">
                <label className="form-label">Prix d'achat (Ar)</label>
                <input
                  type="number"
                  name="prix_achat"
                  value={formData.prix_achat || ""}
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
                  value={formData.prix_vente || ""}
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
                  value={formData.quantite || ""}
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
                  value={formData.date_expiration || ""}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Seuil d'alerte</label>
                <input
                  type="number"
                  name="seuil_alerte"
                  value={formData.seuil_alerte || ""}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fournisseur</label>
                <select
                  name="id_fournisseur"
                  className="form-select"
                  value={formData.id_fournisseur || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((f) => (
                    <option key={f.id_fournisseur} value={f.id_fournisseur}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
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
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ModifierMedicament;
