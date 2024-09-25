import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const [selectedNav, setSelectedNav] = useState("agent");
  const [permission, setPermission] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const url = useLocation();
  useEffect(() => {
    if (currentUser.parent_id) {
      const permissiondata = JSON.parse(currentUser.permission);
      if (permissiondata.add === 1) {
        setPermission(true);
      }
    }
  }, [currentUser]);
  useEffect(() => {
    if (url.pathname === "/agent-management/agent") {
      setSelectedNav("agent");
    }
    if (url.pathname === "/agent-management/report") {
      setSelectedNav("report");
    }
    if (url.pathname === "/agent-management/create-agent") {
      setSelectedNav("create");
    }
    if (url.pathname === "/agent-management/setting") {
      setSelectedNav("setting");
    }
  }, [url]);

  return (
    <div style={{marginBottom:"5rem"}}>
      <ul className="Navbar-Header-design">
      <li className="Navbar-List-Design">
          <Link
            to={"/agent-management/report"}
            className={`${
              selectedNav === "report" ? "Navbar-active" : ""
            } Navbar-design`}
          >
            Report
          </Link>
        </li>
        <li className="Navbar-List-Design">
          <Link
            to={"/agent-management/agent"}
            className={`${
              selectedNav === "agent" ? "Navbar-active" : ""
            } Navbar-design`}
          >
            Agent
          </Link>
        </li>
       
        {permission&&<li className="Navbar-List-Design">
          <Link
            to={"/agent-management/create-agent"}
            className={`${
              selectedNav === "create" ? "Navbar-active" : ""
            } Navbar-design`}
          >
            Add Agent
          </Link>
        </li>}

        {currentUser.user_type==="admin"&&<li className="Navbar-List-Design">
          <Link
            to={"/agent-management/setting"}
            className={`${
              selectedNav === "setting" ? "Navbar-active" : ""
            } Navbar-design`}
          >
            Setting
          </Link>
        </li>}
      </ul>
    </div>
  );
};

export default Navbar;
