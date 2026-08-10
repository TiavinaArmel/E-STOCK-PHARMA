import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DetailFournisseur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fourn, setFourn] = useState(null);

  useEffect(() => {
    api.get(`/fournisseurs.php?id=${id}`)
      .then((res) => setFourn(res.data.data))
      .catch((err) => console.error("Erreur:", err));
  }, [id]);

  if (!fourn) return <div className="p-4">Chargement...</div>;

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Retour</button>
          <div className="card border-0 shadow-sm p-4 col-md-6">
            <h2 className="text-primary">{fourn.nom}</h2>
            <hr />
            <p><strong>Téléphone :</strong> {fourn.telephone || "Non renseigné"}</p>
            <p><strong>Email :</strong> {fourn.email || "Non renseigné"}</p>
            <p><strong>Adresse :</strong><br/> {fourn.adresse || "Aucune adresse"}</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DetailFournisseur;