import React from "react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    nom: "Admin",
    role: "Administrateur",
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 sticky-top">
      <div className="container-fluid d-flex justify-content-end align-items-center p-0">
        
        <div className="d-flex align-items-center gap-4">
          <button className="btn position-relative p-1 border-0 rounded-circle bg-light">
            <i className="bi bi-bell text-dark fs-5"></i>
          </button>

          <div className="d-flex align-items-center gap-2 border-start ps-3">
            <div className="text-end">
              <p className="mb-0 fw-semibold">{user.nom}</p>

              <small className="text-muted">{user.role}</small>
            </div>

            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: "40px",
                height: "40px",
              }}
            >
              {user.nom?.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
