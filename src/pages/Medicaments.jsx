import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Medicaments() {
  const navigate = useNavigate();
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  //   calcule de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medicaments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicaments.length / itemsPerPage);

  useEffect(() => {
    chargerMedicaments();
  }, []);

  const chargerMedicaments = async () => {
    try {
      const response = await api.get("/medicaments.php");
      if (response.data && response.data.success) {
        setMedicaments(response.data.data);
      }
    } catch (error) {
      console.error("Erreur chargement :", error);
    } finally {
      setLoading(false);
    }
  };
  const supprimerMedicament = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) {
      try {
        // Envoi de la requête DELETE vers l'API
        await api.delete(`/medicaments.php?id=${id}`);

        alert("Médicament supprimé avec succès !");

        // Mise à jour de l'UI : on filtre la liste pour retirer le médicament supprimé
        // Cela évite de recharger toute la page
        setMedicaments(medicaments.filter((m) => m.id_medicament !== id));
      } catch (error) {
        alert(
          "Erreur lors de la suppression : " +
            (error.response?.data?.message || "Erreur serveur"),
        );
      }
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Médicaments</h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/ajouter-medicament")}
            >
              + Ajouter un médicament
            </button>
          </div>

          <div className="card border-0 shadow-sm p-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="text-muted">
                  <th>#</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix unitaire</th>
                  <th>Stock</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((med, index) => (
                  <tr key={med.id_medicament}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>  
                    <td className="fw-semibold">{med.nom}</td>
                    <td>{med.categorie || "N/A"}</td>
                    <td>{Number(med.prix_vente).toLocaleString()} Ar</td>
                    <td>{med.quantite}</td>
                    <td>
                      <span
                        className={`badge ${med.quantite <= med.seuil_alerte ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"}`}
                      >
                        {med.quantite <= 0
                          ? "Rupture"
                          : med.quantite <= med.seuil_alerte
                            ? "Stock faible"
                            : "En stock"}
                      </span>
                    </td>
                    <td >
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() =>
                          navigate(`/medicament/${med.id_medicament}`)
                        }
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() =>
                          navigate(`/modifier/${med.id_medicament}`)
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      
                      <button
                        onClick={() => supprimerMedicament(med.id_medicament)}
                        className="btn btn-sm btn-link text-danger"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* les pagination  */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Précédent
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Medicaments;
