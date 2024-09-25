
import Home from "./pages/Home";
import Login from "./pages/Login";
import AgentManagementPage from "./pages/AgentManagementPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect} from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyAccount from "./components/VerifyAccount";
import CreateAgentPage from "./pages/CreateAgentPage";
import AgentReportPage from "./pages/AgentReportPage";
import Setting from "./pages/Setting";

function App() {
  const { currentUser } = useContext(AuthContext);
  const domainName = window.location.hostname;
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };
  const AdminRoute = ({ children }) => {
    if (!currentUser||currentUser.user_type==="agent") {
      return <Navigate to="/" />;
    }
    return children;
  };

  useEffect(()=>{
    document.title = domainName;
  },[domainName])
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent-management/agent"
          element={
            <AdminRoute>
              <AgentManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/agent-management/create-agent"
          element={
            <AdminRoute>
              <CreateAgentPage />
            </AdminRoute>
          }
        />
        <Route
          path="/agent-management/report"
          element={
            <AdminRoute>
              <AgentReportPage />
            </AdminRoute>
          }
        />
        <Route
          path="/agent-management/setting"
          element={
            <AdminRoute>
              <Setting />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="/verify-account" element={<VerifyAccount/>} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
