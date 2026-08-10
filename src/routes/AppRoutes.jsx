import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Composants de structure & protection

import ProtectedRoute from "../components/ProtectedRoute";

// Pages publiques

import Login from "../pages/Login";

import Register from "../pages/register";
import ResetPassword from "../pages/ResetPassword";
import Rapport from "../pages/Rapport";
// Pages protégées

import Dashboard from "../pages/Dashboard";

import Medicaments from "../pages/Medicaments";

import Fournisseurs from "../pages/Fournisseurs";

import Vente from "../pages/Vente";

import Alertes from "../pages/Alertes";

import Profile from "../pages/Profile";

import AjouterMedicament from "../pages/ajouterMedicaments";

import ModifierMedicament from "../pages/ModifierMedicament";

import DetailMedicament from "../pages/DetailMedicament";

import AjouterFournisseur from "../pages/AjouterFournisseurs";

import ModifierFourrnisseur from "../pages/ModifierFournisseur";

import DetailFournisseur from "../pages/DetailFournisseur";

import Utilisateurs from "../pages/utilisateur";

import AjouterUtilisateur from "../pages/AjouterUtilisateur";

import ModifierUtilisateur from "../pages/modifierUtilisateur";
import HistoriqueVentes from "../pages/HistoriqueVentes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Routes Publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔒 Routes Protégées (Niveaux d'accès) */}

        {/* Accès pour TOUS les connectés (Admin, Pharmacien, Caissier) */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin", "pharmacien", "caissier"]}
            />
          }
        >
          <Route path="/ventes" element={<Vente />} />

          <Route path="/profile" element={<Profile />} />
          {/* Lecture seule médicaments pour le caissier */}
          <Route path="/medicaments" element={<Medicaments />} />
          <Route path="/medicament/:id" element={<DetailMedicament />} />
        </Route>

        {/* Accès restreint (Admin et Pharmacien uniquement) */}
        <Route
          element={<ProtectedRoute allowedRoles={["admin", "pharmacien"]} />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ajouter-medicament" element={<AjouterMedicament />} />
          <Route path="/modifier/:id" element={<ModifierMedicament />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/ajouter-fournisseur" element={<AjouterFournisseur />} />
          <Route
            path="/modifier-fournisseur/:id"
            element={<ModifierFourrnisseur />}
          />
          <Route path="/historique-ventes" element={<HistoriqueVentes />} />
        </Route>

        {/* Accès strictement ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/ajouter-utilisateur" element={<AjouterUtilisateur />} />
          <Route path="/rapport" element={<Rapport />} />
          <Route path="/fournisseurs" element={<Fournisseurs />} />
          <Route
            path="/modifier-utilisateur/:id"
            element={<ModifierUtilisateur />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
