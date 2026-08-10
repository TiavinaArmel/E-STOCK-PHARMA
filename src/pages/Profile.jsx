import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // État pour le formulaire de modification
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    ancien_mot_de_passe: "",
    nouveau_mot_de_passe: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me.php");
        if (res.data.success) {
          setUser(res.data.user);
          setFormData({
            nom: res.data.user.nom,
            email: res.data.user.email,
            ancien_mot_de_passe: "",
            nouveau_mot_de_passe: "",
          });
        } else {
          setMessage({ type: "danger", text: "Impossible de charger le profil." });
        }
      } catch (err) {
        console.error("Erreur profil:", err);
        setMessage({ type: "danger", text: "Erreur de connexion au serveur." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      // C'est ici qu'on enverra les modifications au backend plus tard
      const res = await api.put("/modifier_profil.php", formData);
      if (res.data.success) {
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
        // Optionnel : Mettre à jour l'état local du user si le nom/email a changé
        setUser({ ...user, nom: formData.nom, email: formData.email });
      } else {
        setMessage({ type: "danger", text: res.data.message || "Erreur lors de la mise à jour." });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "Erreur technique lors de la sauvegarde." });
    }
  };

  if (loading) {
    return (
      <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          
          {/* En-tête de la page */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Mon Compte</h3>
            <p className="text-muted">Gérez vos informations personnelles et la sécurité de votre accès</p>
          </div>

          {/* Affichage des messages flash (Succès/Erreur) */}
          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
            </div>
          )}

          <div className="row g-4">
            
            {/* Carte de gauche : Résumé visuel */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm text-center p-4 h-100">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  {/* Avatar avec initiales stylisées */}
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm mb-3"
                    style={{ width: "90px", height: "90px", fontSize: "2rem" }}
                  >
                    {user?.nom ? user.nom.substring(0, 2).toUpperCase() : "U"}
                  </div>
                  
                  <h4 className="fw-bold text-dark mb-1">{user?.nom}</h4>
                  <span className="badge bg-danger px-3 py-2 rounded-pill text-uppercase mb-3" style={{ fontSize: "0.75rem" }}>
                    {user?.role}
                  </span>
                  
                  <hr className="w-100 my-3 text-muted" />
                  
                  <div className="text-start w-100 px-2">
                    <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>Adresse email</p>
                    <p className="text-dark fw-semibold mb-0 text-truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte de droite : Formulaire de modification */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm p-4">
                <div className="card-header bg-transparent border-0 ps-0 pb-3">
                  <h5 className="fw-bold text-dark mb-0">Modifier mes informations</h5>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    
                    {/* Nom */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary fw-semibold">Nom complet</label>
                      <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} required />
                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary fw-semibold">Adresse Email</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* Séparateur pour la section Mot de passe */}
                    <div className="col-12 my-4">
                      <div className="d-flex align-items-center">
                        <span className="fw-bold text-dark me-3" style={{ minWidth: "150px" }}>Changer le mot de passe</span>
                        <hr className="w-100 my-0 text-muted" />
                      </div>
                      <small className="text-muted d-block mt-1">Laissez vide si vous ne souhaitez pas modifier votre mot de passe actuel.</small>
                    </div>

                    {/* Ancien mot de passe */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary fw-semibold">Mot de passe actuel</label>
                      <input type="password" className="form-control" name="ancien_mot_de_passe" value={formData.ancien_mot_de_passe} onChange={handleChange} placeholder="••••••••" />
                    </div>

                    {/* Nouveau mot de passe */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary fw-semibold">Nouveau mot de passe</label>
                      <input type="password" className="form-control" name="nouveau_mot_de_passe" value={formData.nouveau_mot_de_passe} onChange={handleChange} placeholder="••••••••" />
                    </div>

                    {/* Bouton de sauvegarde */}
                    <div className="col-12 text-end mt-4">
                      <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold shadow-sm">
                        Enregistrer les modifications
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;