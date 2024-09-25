import React from "react";
import AgentManagement from "../components/AgentManagement";
import LeftMenu from "../components/LeftMenu";
import Navbar from "../components/Navbar";

const AgentManagementPage = () => {
  
  return (
    <div className="layout-wrapper d-lg-flex" >
      
      <LeftMenu/>
      <div>
        <Navbar/>
        <AgentManagement />
      </div>     
    </div>
  );
};

export default AgentManagementPage;
