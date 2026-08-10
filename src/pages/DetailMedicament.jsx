import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DetailMedicament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [med, setMed] = useState(null);

  useEffect(() => {
    api.get(`/medicaments.php?id=${id}`)
      .then((res) => setMed(res.data.data))
      .catch((err) => console.error("Erreur:", err));
  }, [id]);

  if (!med) return <div className="p-4">Chargement des détails...</div>;

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Retour</button>
          <div className="card border-0 shadow-sm p-4 col-md-8">
            <h2 className="text-primary">{med.nom}</h2>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <p><strong>Catégorie:</strong> {med.categorie}</p>
                <p><strong>Stock actuel:</strong> {med.quantite}</p>
                <p><strong>Seuil d'alerte:</strong> {med.seuil_alerte}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Prix achat:</strong> {med.prix_achat} Ar</p>
                <p><strong>Prix vente:</strong> {med.prix_vente} Ar</p>
                <p><strong>Date expiration:</strong> {med.date_expiration || "N/A"}</p>
              </div>
            </div>
            <p><strong>Description:</strong><br /> {med.description || "Aucune description."}</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DetailMedicament;