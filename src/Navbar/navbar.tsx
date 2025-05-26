import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-looney">
      <div className="container-fluid">
        <Link className="navbar-brand cartoon-title" to="/">
          Looney Tunes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/ThreeModel">
              Pato Lucas
            </NavLink>
            </li>
            <li className="nav-item">
                 <NavLink className="nav-link" to="/ThreeModel">
              Bugs Bunny
            </NavLink>
            </li>
            <li className="nav-item">
                   <NavLink className="nav-link" to="/ThreeModel">
              Lola Bunny
            </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;