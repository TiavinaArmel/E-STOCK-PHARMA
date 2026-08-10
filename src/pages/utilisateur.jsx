import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Pour la navigation
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Hook pour rediriger

  useEffect(() => {
    loadUsers();
  }, []);

  const validerUtilisateur = async (id) => {
    try {
      // On appelle une nouvelle route API (qu'on va créer juste après)
      await api.post(`/valider_utilisateur.php`, { id: id });
      loadUsers(); // Rafraîchir la liste pour voir le changement de statut
    } catch (err) {
      alert("Erreur lors de la validation");
    }
  };
  const loadUsers = async () => {
    try {
      const res = await api.get("/utilisateurs.php");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement:", err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/utilisateurs.php?id=${id}`);
        loadUsers(); // Rafraîchir la liste après suppression
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Gestion des utilisateurs</h3>
            {/* Redirection vers le formulaire d'ajout */}
            <button
              className="btn btn-primary"
              onClick={() => navigate("/ajouter-utilisateur")}
            >
              + Ajouter utilisateur
            </button>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Date création</th>
                  <th>Statut</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id_user}>
                    <td>{user.id_user}</td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-info">{user.role}</span>
                    </td>
                    {/* Affichage conditionnel du statut */}
                    <td>
                      {user.statut === "en_attente" ? (
                        <span className="badge bg-warning text-dark">
                          En attente
                        </span>
                      ) : (
                        <span className="badge bg-success">Actif</span>
                      )}
                    </td>

                    <td className="text-center">
                      {/* Bouton de validation (seulement si en attente) */}
                      {user.statut === "en_attente" && (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => validerUtilisateur(user.id_user)}
                          title="Valider le compte"
                        >
                          ✅
                        </button>
                      )}
                    </td>
                    <td className="text-center">
                      {/* Redirection vers la modification avec l'ID */}
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() =>
                          navigate(`/modifier-utilisateur/${user.id_user}`)
                        }
                      >
                        ✏️
                      </button>
                      {/* Appel de la fonction de suppression */}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteUser(user.id_user)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Utilisateurs;
