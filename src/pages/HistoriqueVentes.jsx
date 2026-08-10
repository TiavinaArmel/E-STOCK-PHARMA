import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
const HistoriqueVentes = () => {
  const [ventes, setVentes] = useState([]);
  // On sépare les états pour une gestion plus simple du select
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [modePaiement, setModePaiement] = useState("Tous");
  //   lier avec la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // chargement de l'id facture
  const [loadingId, setLoadingId] = useState(null);
  // vente selection a voir description
  const [selectedVente, setSelectedVente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = "http://localhost/E_STOCK_PHARMA/backend/api";

  // Utilisation de ma fonction voir detail vente :
  const handleViewDetails = (v) => {
    setSelectedVente(v);
    setShowModal(true);
  };

  const chargerVentes = async () => {
    setCurrentPage(1);
    try {
      const res = await api.get("/ventes.php?action=get_historique", {
        params: {
          dateDebut,
          dateFin,
          mode: modePaiement,
        },
      });

      if (res.data.success) {
        setVentes(res.data.data);
      } else {
        toast.error(res.data.message || "Erreur de chargement.");
      }
    } catch (err) {
      toast.error("Erreur technique lors du chargement.");
    }
  };

  // fonction genererpdf
  const handleGenererPDF = (id) => {
    setLoadingId(id);
    // On utilise l'ID passé en argument, pas une variable globale "vente"
    window.open(
      `${API_BASE_URL}/facture.php?action=generer&id=${id}`,
      "_blank",
    );
    setTimeout(() => setLoadingId(null), 1000);
  };
  // Chargement initial au montage du composant
  useEffect(() => {
    chargerVentes();
  }, []);
  //   logique pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ventes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ventes.length / itemsPerPage);

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="container mt-4">
          <h2 className="mb-4">Historique des ventes</h2>

          {/* Zone des filtres */}
          <div className="row mb-4 bg-white p-3 shadow-sm rounded">
            <div className="col-md-3">
              <label className="form-label">Date début</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date fin</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Mode de paiement</label>
              <select
                className="form-select bg-light border-0"
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value)}
              >
                <option value="Tous">Tous</option>
                <option value="ESPECES">Espèces</option>
                <option value="MVOLA">Mvola</option>
                <option value="ORANGE_MONEY">Orange Money</option>
                <option value="AIRTEL_MONEY">Airtel Money</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={chargerVentes}>
                <i className="bi bi-funnel"></i> Filtrer
              </button>
            </div>
          </div>

          {/* Tableau */}
          <div className="bg-white shadow-sm rounded p-3">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Médicaments</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Mode paiement</th>
                  <th>Montant total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((v, index) => (
                  // Utilise v.id_vente au lieu de v.id si v.id est undefined
                  <tr key={v.id_vente || index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{v.date_vente}</td>
                    <td>{v.client || "CAISSE"}</td>
                    <td>{v.mode_paiement}</td>
                    <td>{parseFloat(v.total).toLocaleString()} Ar</td>

                    {/* Action : Détails */}
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewDetails(v)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>

                    {/* Action : PDF */}
                    <td>
                      <button
                        onClick={() => handleGenererPDF(v.id_vente)}
                        className="btn btn-sm btn-info"
                        disabled={loadingId === v.id_vente}
                      >
                        <i className="bi bi-file-earmark-pdf"></i> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            {ventes.length === 0 && (
              <p className="text-center text-muted">Aucune vente trouvée.</p>
            )}
          </div>
        </div>
      </div>
      {showModal && selectedVente && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de la vente</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Date :</strong> {selectedVente.date_vente}
                </p>
                <p>
                  <strong>Médicaments :</strong>{" "}
                  {selectedVente.liste_medicaments || "Aucun"}
                </p>
                <p>
                  <strong>Total :</strong>{" "}
                  {parseFloat(selectedVente.total).toLocaleString()} Ar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriqueVentes;
