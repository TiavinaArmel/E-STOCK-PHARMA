import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts"; // Importation pour les graphiques
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate(); //initialisation de la navigation de react router
  const [stats, setStats] = useState({
    medicaments: 0,
    fournisseurs: 0,
    ventes: 0,
    lowStock: 0,
    chiffreAffaire: 0,
    historiqueVentes: [], // 🎯 Ajouté pour éviter le undefined sur le graphique linéaire
    modesPaiement: [], // 🎯 Déjà présent, assure la cohérence pour le Donut
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const chargerDashboard = async () => {
      try {
        const response = await api.get("/dashboard.php");
        if (response.data && response.data.success && isMounted) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Erreur Dashboard : ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    chargerDashboard();
    return () => {
      isMounted = false;
    };
  }, []);
  // Extraction dynamique des données de l'API pour le graphique linéaire
  const categoriesJours = stats.historiqueVentes
    ? stats.historiqueVentes.map((item) => item.jour)
    : [];
  const donneesVentes = stats.historiqueVentes
    ? stats.historiqueVentes.map((item) => item.total_ventes)
    : [];
  console.log("Historique Ventes complet :", stats.historiqueVentes);
  const optionsVentesLigne = {
    chart: { id: "ventes-7-jours", toolbar: { show: false } },
    xaxis: { categories: categoriesJours }, // Les vrais jours venus de la BDD
    stroke: { curve: "smooth", width: 3 },
    colors: ["#0d6efd"],
  };

  const seriesVentesLigne = [{ name: "Ventes", data: donneesVentes }]; // Les vrais chiffres venus de la BDD

  // 1. Extraction des labels (Espèces, Mobile Money...) et des valeurs (chiffres)
  const labelsPaiement =
    stats.modesPaiement && stats.modesPaiement.length > 0
      ? stats.modesPaiement.map((item) => item.mode_paiement)
      : ["Aucune donnée"];

  const seriesPaiement =
    stats.modesPaiement && stats.modesPaiement.length > 0
      ? stats.modesPaiement.map((item) => Number(item.total))
      : [100]; // Un cercle complet par défaut si vide

  // 2. Configuration dynamique du Donut d'ApexCharts
  console.log("Labels :", labelsPaiement);
  console.log("Séries (Valeurs) :", seriesPaiement);
  const optionsPaiementDonut = {
    labels: labelsPaiement,
    // Palette de couleurs sympa (Bleu, Vert, Violet)
    colors: ["#0d6efd", "#2ecc71", "#9b59b6", "#f1c40f"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: { colors: "#6c757d" },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%"; // Affiche le pourcentage réel calculé par ApexCharts
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " vente(s)"; // Texte au survol de la souris
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Chargement...</h4>
      </div>
    );
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ overflowX: "hidden" }}
      >
        <Navbar />

        <main className="p-4 flex-grow-1">
          {/* En-tête mis à jour selon la maquette */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-0">Tableau de bord</h3>
              <p className="text-muted mb-0 small">Bienvenue, Admin !</p>
            </div>
            <div className="text-muted small fw-medium">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Cartes de Statistiques Supérieures */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
                <span className="text-muted small fw-medium">Médicaments</span>
                <h2 className="fw-bold text-primary my-2">
                  {stats.medicaments}
                </h2>
                <span className="small text-muted">Total en stock</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
                <span className="text-muted small fw-medium">Fournisseurs</span>
                <h2 className="fw-bold text-dark my-2">{stats.fournisseurs}</h2>
                <span className="small text-muted">Total fournisseurs</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
                <span className="text-muted small fw-medium">
                  Ventes aujourd'hui
                </span>
                <h2 className="fw-bold text-success my-2">{stats.ventes}</h2>
                <span className="small text-muted">Total ventes</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
                <span className="text-muted small fw-medium">
                  Chiffre d'affaires
                </span>
                <h2 className="fw-bold text-success my-2">
                  {Number(stats.chiffreAffaire).toLocaleString()} Ar
                </h2>
                <span className="small text-muted">Aujourd'hui</span>
              </div>
            </div>
          </div>

          {/* Section Graphiques & Alertes (Mise en page complexe de la maquette) */}
          <div className="row g-4">
            {/* Colonne de Gauche : Stock Faible + Évolution des Ventes */}
            <div className="col-lg-8 d-flex flex-column g-4">
              <div className="row g-3 flex-grow-1">
                {/* Carte Stock Faible */}
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between rounded-3">
                    <div>
                      <h6 className="fw-bold text-dark mb-3">Stock faible</h6>
                      <h1 className="display-3 fw-bold text-danger my-2">
                        {stats.lowStock}
                      </h1>
                      <p className="text-muted small">Médicaments</p>
                    </div>
                    <button
                      onClick={() => navigate("/alertes")}
                      className="btn btn-outline-primary btn-sm w-100 rounded-2 mt-3"
                    >
                      Voir tout
                    </button>
                  </div>
                </div>

                {/* Graphique d'Évolution des Ventes */}
                <div className="col-md-8">
                  <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
                    <h6 className="fw-bold text-dark mb-3">
                      Ventes (7 derniers jours)
                    </h6>
                    <div className="mixed-chart">
                      <Chart
                        options={optionsVentesLigne}
                        series={seriesVentesLigne}
                        type="line"
                        height={220}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne de Droite : Ventes par mode de paiement */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
                <h6 className="fw-bold text-dark mb-4">
                  Ventes par mode de paiement
                </h6>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "220px" }}
                >
                  <Chart
                    options={optionsPaiementDonut}
                    series={seriesPaiement}
                    type="donut"
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
