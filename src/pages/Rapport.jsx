import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const Rapport = () => {
  const [demandes, setDemandes] = useState([]);

  const loadDemandes = async () => {
    try {
      const res = await api.get("/admin.php?action=get_password_requests");
      setDemandes(res.data);
    } catch (err) {
      console.error("Erreur chargement:", err);
      toast.error("Impossible de charger les demandes.");
    }
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  const validerChangement = async (requestId, userId, newPassword) => {
    try {
      const res = await api.post("/admin.php?action=approve_password_change", {
        requestId,
        userId,
        newPassword,
      });

      const isSuccess = res.data === true || res.data.success === true;

      if (isSuccess) {
        toast.success("Mot de passe mis à jour avec succès !");
        loadDemandes();
      } else {
        toast.error(
          "Erreur : " + (res.data.message || "La mise à jour a échoué."),
        );
      }
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      toast.error("Erreur de connexion avec le serveur.");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="container mt-4">
          <h2>Demandes de changement de mot de passe</h2>
          {demandes.length === 0 ? (
            <p>Aucune demande en attente.</p>
          ) : (
            <ul className="list-group">
              {demandes.map((d) => (
                <li
                  key={d.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{d.nom}</strong> ({d.email})
                    <br />
                    <small className="text-muted">ID demande: {d.id}</small>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      validerChangement(
                        d.id,
                        d.id_user,
                        d.nouveau_password_hash,
                      )
                    }
                  >
                    Valider
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rapport;
