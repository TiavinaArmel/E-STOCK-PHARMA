import React from "react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
const Sidebar = () => {
  
  const navigate = useNavigate();

  // Récupérer l'utilisateur depuis le localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role; // 'admin', 'pharmacien', ou 'caissier'
  const [nombreAlertes, setNombreAlertes] = useState(0);
  const handleLogout = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      try {
        await api.post("/auth.php?action=logout");
      } catch (err) {
        console.error(err);
      } finally {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/");
      }
    }
  };
  useEffect(() => {
    const fetchNombre = async () => {
        try {
            // Assure-toi que ton API pointe vers ?action=get_count
            const res = await api.get("/alertes.php?action=get_count");
            if (res.data.success) {
                setNombreAlertes(res.data.count);
            }
        } catch (err) {
            console.error("Erreur chargement badge :", err);
        }
    };
    fetchNombre();
}, []);

  // Liste des menus avec les rôles autorisés
  const menuItems = [
    {
      path: "/dashboard",
      icon: "bi-grid-1x2-fill",
      label: "Tableau de bord",
      roles: ["admin", "pharmacien"],
    },
    {
      path: "/medicaments",
      icon: "bi-capsule",
      label: "Médicaments",
      roles: ["admin", "pharmacien", "caissier"],
    },
    {
      path: "/ventes",
      icon: "bi-cart-fill",
      label: "Ventes",
      roles: ["admin", "pharmacien", "caissier"],
    },
    {
      path: "/historique-ventes",
      icon: "bi-clock-history",
      label: "Historique ventes",
      roles: ["admin", "pharmacien"],
    },
    {
      path: "/fournisseurs",
      icon: "bi-truck",
      label: "Fournisseurs",
      roles: ["admin"],
    },
    {
      path: "/alertes",
      icon: "bi-exclamation-triangle-fill",
      label: "Alertes",
      roles: ["admin", "pharmacien"],
    },
    {
      path: "/utilisateurs",
      icon: "bi-people-fill",
      label: "Utilisateurs",
      roles: ["admin"],
    },
    {
      path: "/profile",
      icon: "bi-person-circle",
      label: "Mon Profil",
      roles: ["admin", "pharmacien", "caissier"],
    },
    {
      path: "/rapport",
      icon: "bi-file-earmark-text",
      label: "Rapports & Demandes",
      roles: ["admin"],
    },
    
    
  ];

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      <h4 className="mb-4">E-Stock Pharma</h4>

      <ul className="nav flex-column">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <li key={item.path} className="nav-item mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link text-white bg-primary rounded d-flex justify-content-between align-items-center"
                    : "nav-link text-white d-flex justify-content-between align-items-center"
                }
              >
                <span>
                  <i className={`bi ${item.icon} me-2`}></i> {item.label}
                </span>

                {/* Ajout du badge d'alerte uniquement pour le menu Alertes et si nombreAlertes > 0 */}
                {item.label === "Alertes" && nombreAlertes > 0 && (
                  <span className="badge bg-danger rounded-pill">
                    {nombreAlertes}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
      </ul>

      <hr />

      <button
        onClick={handleLogout}
        className="btn btn-outline-light w-100 mt-3"
      >
        <i className="bi bi-box-arrow-right me-2"></i> Déconnexion
      </button>
    </div>
  );
};

export default Sidebar;
