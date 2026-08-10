import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Fournisseurs() {
  const navigate = useNavigate();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
  try {
    const res = await api.get("/fournisseurs.php");
    console.log("Données reçues de l'API :", res.data); // Inspecte ceci dans la console F12
    
    if (res.data && res.data.success) {
      setFournisseurs(res.data.data);
    } else {
      console.warn("API renvoyée sans succès :", res.data);
    }
  } catch (err) {
    console.error("Erreur complète :", err);
  } finally {
    setLoading(false);
  }
};

  const supprimerFournisseur = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await api.delete(`/fournisseurs.php?id=${id}`);
        setFournisseurs(fournisseurs.filter((f) => f.id_fournisseur !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Logique pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fournisseurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(fournisseurs.length / itemsPerPage);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Fournisseurs</h3>
            <button className="btn btn-primary" onClick={() => navigate("/ajouter-fournisseur")}>
              + Ajouter un fournisseur
            </button>
          </div>

          <div className="card border-0 shadow-sm p-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="text-muted">
                  <th>#</th>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((f, index) => (
                  <tr key={f.id_fournisseur}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="fw-semibold">{f.nom}</td>
                    <td>{f.telephone || "N/A"}</td>
                    <td>{f.email || "N/A"}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/modifier-fournisseur/${f.id_fournisseur}`)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-link text-danger" onClick={() => supprimerFournisseur(f.id_fournisseur)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                </li>
              </ul>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Fournisseurs;