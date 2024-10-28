import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteCookie } from "../utils/Utils";
const LeftMenu = () => {
  useEffect(() => {
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  }, []);
  return (
    <>
      <div className="flex-lg-column margnRight">
        <div className="side-menu flex-lg-column my-0 sidemenu-navigation left-menu">
          <ul className="nav nav-pills side-menu-nav" role="tablist">
            <li
              className="nav-item d-none d-lg-block"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Profile"
            >
              <Link to="/dashboard?tab=user" className="nav-link">
                <i className="mdi mdi-account-outline" />
              </Link>
            </li>
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Chats"
            >
              <Link to="/dashboard" className="nav-link">
                <i className="mdi mdi-message-text-outline" />
                <span className="iconicTxt">Chats</span>
              </Link>
            </li>
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Agent Management"
            >
              <Link to="/agent-management/agent" className="nav-link active">
                <i className="mdi mdi-account-tie-outline"></i>
                <span className="iconicTxt">Agent</span>
              </Link>
            </li>

            <li
              className="nav-item marginAuto dropdown profile-user-dropdown"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Profile"
            >
              <div
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="mdi mdi-account-cog-outline" />
                <span className="iconicTxt">Account</span>
              </div>
              <div className="dropdown-menu">
                <Link
                  to="/dashboard?tab=user"
                  className="dropdown-item d-flex align-items-center justify-content-between"
                >
                  Profile 
                </Link>
                <button
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  onClick={() => deleteCookie("user")}
                >
                  Log out 
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default LeftMenu;
