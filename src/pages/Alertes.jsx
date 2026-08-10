import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Alertes() {
  const [stockAlerte, setStockAlerte] = useState([]);
  const [peremptions, setPeremptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Remplace ton useEffect actuel par celui-ci
  const loadData = async () => {
    try {
      setLoading(true);
      const [resStock, resPerim] = await Promise.all([
        api.get("/alertes.php?action=get_list"),
        api.get("/alertes.php?action=get_alertes"),
      ]);
      setStockAlerte(resStock.data?.data || []);
      setPeremptions(resPerim.data?.data || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  // intervention sur les alertes
  const [showModal, setShowModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [nouvelleQuantite, setNouvelleQuantite] = useState("");

  const handleIntervenir = (item, type) => {
    if (type === "peremption") {
      if (
        window.confirm(`Confirmer la suppression de ${item.nom} (PÉRIMÉ) ?`)
      ) {
        supprimerMedicament(item.id_medicament);
      }
    } else {
      setSelectedMed(item);
      setShowModal(true); // Ouvre la modale pour le stock
    }
  };

  const supprimerMedicament = async (id) => {
    try {
      await api.delete(`/medicaments.php?id=${id}`); // Adapte ton endpoint de suppression
      loadData(); // Recharge la liste
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const submitReappro = async () => {
    try {
      // Assure-toi que c'est bien la route 'alertes.php' et pas 'medicaments.php'
      await api.post("/alertes.php?action=update_stock", {
        id: selectedMed.id_medicament,
        quantite: nouvelleQuantite,
      });
      setShowModal(false);
      loadData();
    } catch (err) {
      alert("Erreur de mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Chargement des alertes...</h4>
      </div>
    );
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <h3 className="fw-bold mb-4">Alertes Stock & Péremptions</h3>

          <div className="card border-0 shadow-sm">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Médicament</th>
                  <th>Détails</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockAlerte.map((item) => (
                  <tr key={`stock-${item.id_medicament}`}>
                    <td>{item.nom}</td>
                    <td>
                      Qté: {item.quantite} (Seuil: {item.seuil_alerte})
                    </td>
                    <td>
                      <span className="badge bg-warning">Stock faible</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleIntervenir(item, "stock")}
                      >
                        Réapprovisionner
                      </button>
                    </td>
                  </tr>
                ))}
                {peremptions.map((item) => (
                  <tr
                    key={`perim-${item.id_medicament}`}
                    className="table-danger"
                  >
                    <td>{item.nom}</td>
                    <td>Expire le: {item.date_expiration}</td>
                    <td>
                      <span className="badge bg-danger">
                        {item.statut_alerte === "PERIME"
                          ? "PÉRIMÉ"
                          : "À VÉRIFIER"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleIntervenir(item, "peremption")}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        {showModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Réapprovisionner {selectedMed?.nom}
                  </h5>
                </div>
                <div className="modal-body">
                  <input
                    autoFocus
                    type="number"
                    className="form-control"
                    placeholder="Nouvelle quantité"
                    value={nouvelleQuantite}
                    onChange={(e) => setNouvelleQuantite(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-primary" onClick={submitReappro}>
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Alertes;
