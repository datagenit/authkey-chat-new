import React, { useState, useContext } from "react";
import { BASE_URL2 } from "../api/api";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
const ChangePassword = () => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const[currentPass, setCurrentPass]= useState("");
  const[newPass, setNewPass]= useState("");
  const[confPass, setConfPass]= useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
 

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if(newPass!==confPass){
       return toast.error("password not matched");
    }
    setLoading(true);
    const dataforpasschange = {
      user_id: currentUser.parent_id,
      token: currentUser.parent_token,
      agent_id: currentUser.user_type === "admin" ? "" : currentUser.user_id,
      method: "change_password",
      current_password: currentPass,
      new_password: newPass,
      user_type: currentUser.user_type,
    };
    try {
        const {data}= await axios.post(`${BASE_URL2}/whatsapp_user`,dataforpasschange);
        console.log(data);
        
        if (data.success===true) {
            toast.success(data.message);
            setConfPass("");
            setCurrentPass("");
            setNewPass("");
        }else{
            toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
        
        toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label >Current Password</label>
          <div className="input-group">
            <input
              type={showCurrentPass ? "text" : "password"}
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter current password"
              required
              value={currentPass}
              onChange={(e)=>setCurrentPass(e.target.value)}
            />
            <div
              className="input-group-prepend"
              style={{ cursor: "pointer" }}
              onClick={() => setShowCurrentPass(!showCurrentPass)}
            >
              <div className="input-group-text">
                <i
                  className={!showCurrentPass ? "bx bx-show" : "bx bx-hide"}
                  style={{ fontSize: "25px" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group mt-2">
          <label >New Password</label>
          <div className="input-group">
            <input
              type={showNewPass ? "text" : "password"}
              className="form-control"
             
              aria-describedby="emailHelp"
              placeholder="Enter New password"
              required
              value={newPass}
              onChange={(e)=>setNewPass(e.target.value)}
            />
            <div
              className="input-group-prepend"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNewPass(!showNewPass)}
            >
              <div className="input-group-text">
                <i
                  className={!showNewPass ? "bx bx-show" : "bx bx-hide"}
                  style={{ fontSize: "25px" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group mt-2">
          <label >Confirm Password</label>
          <div className="input-group">
            <input
              type={showNewPass ? "text" : "password"}
              className="form-control"
            
              aria-describedby="emailHelp"
              placeholder="Enter Confirm password"
              required
              value={confPass}
              onChange={(e)=>setConfPass(e.target.value)}
            />
            <div
              className="input-group-prepend"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNewPass(!showNewPass)}
            >
              <div className="input-group-text">
                <i
                  className={!showNewPass ? "bx bx-show" : "bx bx-hide"}
                  style={{ fontSize: "25px" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          {loading?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:"Submit"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
