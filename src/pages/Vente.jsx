import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Vente() {
  const [derniereVenteId, setDerniereVenteId] = useState(null);
  const [medicaments, setMedicaments] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);
  const [panier, setPanier] = useState([]);
  const [modePaiement, setModePaiement] = useState("ESPECES");
  const [afficherSuggestions, setAfficherSuggestions] = useState(false);
  useEffect(() => {
    const chargerMedicaments = async () => {
      try {
        const response = await api.get("/medicaments.php");
        console.log("Données brutes reçues :", response.data); // 👈 AJOUTE CECI

        // Vérifie si ton API renvoie bien { success: true, data: [...] }
        if (response.data && response.data.success) {
          setMedicaments(response.data.data);
        } else {
          chargerDonneesTest();
        }
      } catch (error) {
        console.error("Erreur complète :", error);
        chargerDonneesTest();
      } finally {
        setLoading(false);
      }
    };

    // Petite fonction interne pour éviter de répéter le code
    const chargerDonneesTest = () => {
      setMedicaments([
        {
          id_medicament: 1,
          nom: "Paracétamol 500mg",
          prix_vente: 1000,
          quantite: 120,
        },
        {
          id_medicament: 2,
          nom: "Ibuprofène 400mg",
          prix_vente: 1500,
          quantite: 45,
        },
        {
          id_medicament: 3,
          nom: "Dolibrane 1000mg",
          prix_vente: 2000,
          quantite: 12,
        },
        {
          id_medicament: 4,
          nom: "Vitamine C 1000mg",
          prix_vente: 1200,
          quantite: 8,
        },
      ]);
    };

    chargerMedicaments();
  }, []);

  // Filtrage pour le tableau principal (limitée à 8)
  const medicamentsFiltres = medicaments
    .filter((med) =>
      (med.nom || "").toLowerCase().includes(recherche.toLowerCase()),
    )
    .slice(0, 8);

  // Suggestions pour l'autocomplétion
  const suggestions = medicaments.filter(
    (med) =>
      recherche !== "" &&
      med.nom.toLowerCase().includes(recherche.toLowerCase()) &&
      med.nom.toLowerCase() !== recherche.toLowerCase(),
  );

  const ajouterAuPanier = (med) => {
    // Utilisation de Number() pour garantir un numérique
    const stock = Number(med.quantite);
    const existe = panier.find(
      (item) => item.id_medicament === med.id_medicament,
    );

    if (existe) {
      if (existe.quantite < stock) {
        setPanier(
          panier.map((item) =>
            item.id_medicament === med.id_medicament
              ? { ...item, quantite: item.quantite + 1 }
              : item,
          ),
        );
      } else {
        alert("Stock maximal atteint pour ce produit !");
      }
    } else {
      setPanier([
        ...panier,
        {
          id_medicament: med.id_medicament,
          nom: med.nom,
          prix: Number(med.prix_vente) || 0,
          quantite: 1,
        },
      ]);
    }
  };

  const retirerDuPanier = (id) => {
    setPanier(panier.filter((item) => item.id_medicament !== id));
  };

  const totalGeneral = panier.reduce(
    (sum, item) => sum + item.prix * item.quantite,
    0,
  );

  const validerVente = async () => {
    setLoading(true);
    try {
      // 1. Enregistrement de la vente via ton API existante
      const response = await api.post("/ventes.php?action=create_sale", {
        idUser: 1, // Ou ton user connecté
        modePaiement: modePaiement,
        produits: panier,
      });

      if (response.data.success) {
        const idVente = response.data.id_vente;
        setDerniereVenteId(response.data.id_vente);
        // 2. Boîte de dialogue de confirmation
        const voirFacture = window.confirm(
          "Vente validée avec succès ! Voulez-vous voir la facture ?",
        );

        if (voirFacture) {
          // 3. Ouverture du PDF dans une nouvelle fenêtre
          // Le navigateur gérera automatiquement l'ouverture ou le téléchargement
          window.open(
            `http://localhost/E_STOCK_PHARMA/backend/api/facture.php?action=generer&id=${idVente}`,
            "_blank",
          );
        }

        // Réinitialiser le panier
        setPanier([]);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ overflowX: "hidden" }}
      >
        <Navbar />

        <main className="p-4 flex-grow-1">
          <h3 className="fw-bold text-dark mb-4">Nouvelle vente</h3>

          <div className="row g-4">
            {/* COLONNE GAUCHE : RECHERCHE & PRÉDICTEUR */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm p-4 rounded-3 h-100">
                <h6 className="fw-bold text-dark mb-3">
                  Rechercher un médicament
                </h6>

                <div className="position-relative mb-4">
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2 px-3"
                    placeholder="Tapez le nom du médicament..."
                    value={recherche}
                    onChange={(e) => {
                      setRecherche(e.target.value);
                      setAfficherSuggestions(true);
                    }}
                    onFocus={() => setAfficherSuggestions(true)}
                    disabled={loading} // Empêche la saisie pendant le chargement
                  />

                  {afficherSuggestions && suggestions.length > 0 && (
                    <ul
                      className="position-absolute w-100 list-group shadow-sm mt-1 style-suggestions"
                      style={{
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {suggestions.map((med, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action border-0 py-2 px-3 fs-6 custom-li"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setRecherche(med.nom);
                            setAfficherSuggestions(false);
                          }}
                        >
                          🔍{" "}
                          <strong className="text-primary">
                            {med.nom.substring(0, recherche.length)}
                          </strong>
                          {med.nom.substring(recherche.length)}
                          <span className="badge bg-light text-muted float-end small">
                            {med.quantite} dispo
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div
                  className="table-responsive"
                  onClick={() => setAfficherSuggestions(false)}
                >
                  <table className="table table-hover align-middle">
                    <thead className="table-light text-muted small">
                      <tr>
                        <th>Médicament</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicamentsFiltres.map((med, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{med.nom}</td>
                          <td>
                            {Number(med.prix_vente || 0).toLocaleString()} Ar
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                med.quantite > 10
                                  ? "bg-success-subtle text-success"
                                  : "bg-warning-subtle text-warning"
                              }`}
                            >
                              {med.quantite}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => ajouterAuPanier(med)}
                              className="btn btn-primary btn-sm rounded-2 px-2"
                              disabled={loading || med.quantite === 0}
                            >
                              +
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : LE PANIER */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm p-4 rounded-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-4">Panier</h6>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light text-muted small">
                        <tr>
                          <th>Médicament</th>
                          <th>Prix</th>
                          <th>Qté</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {panier.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4 text-muted small"
                            >
                              Le panier est vide
                            </td>
                          </tr>
                        ) : (
                          panier.map((item, index) => (
                            <tr key={index}>
                              <td className="small fw-medium">{item.nom}</td>
                              <td className="small">
                                {Number(item.prix).toLocaleString()} Ar
                              </td>
                              <td className="fw-bold small">{item.quantite}</td>
                              <td className="small fw-semibold">
                                {(item.prix * item.quantite).toLocaleString()}{" "}
                                Ar
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    retirerDuPanier(item.id_medicament)
                                  }
                                  className="btn btn-link text-danger btn-sm p-0 text-decoration-none"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* TOTAL ET VALIDATION */}
                <div className="border-top pt-3 mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold text-dark">Total général</span>
                    <h4 className="fw-bold text-dark mb-0">
                      {totalGeneral.toLocaleString()} Ar
                    </h4>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-muted fw-medium">
                      Mode de paiement
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      value={modePaiement}
                      onChange={(e) => setModePaiement(e.target.value)}
                    >
                      <option value="ESPECES">Espèces</option>
                      <option value="MVOLA">Mvola</option>
                      <option value="ORANGE_MONEY">Orange Money</option>
                      <option value="AIRTEL_MONEY">Airtel Money</option>
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        onClick={() => {
                          setPanier([]);
                          setDerniereVenteId(null); // On efface la notification précédente
                        }}
                        className="btn btn-light w-100 rounded-2 text-muted"
                        disabled={loading}
                      >
                        Annuler
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        onClick={validerVente}
                        className="btn btn-success w-100 rounded-2 fw-medium"
                        disabled={loading || panier.length === 0}
                      >
                        Valider la vente
                      </button>
                    </div>
                  </div>

                  {/* PARTIE MANQUANTE : Notification de succès et bouton facture */}
                  {derniereVenteId && (
                    <div className="alert alert-success mt-3 d-flex align-items-center justify-content-between p-2">
                      <span className="small fw-bold">
                        Vente N°{derniereVenteId} validée !
                      </span>
                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost/E_STOCK_PHARMA/backend/api/facture.php?action=generer&id=${derniereVenteId}`,
                            "_blank",
                          )
                        }
                        className="btn btn-primary btn-sm"
                      >
                        Voir la facture
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Vente;
