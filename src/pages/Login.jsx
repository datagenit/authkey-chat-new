import React, { useState } from "react";
import { agentLogin } from "../api/api";
import { setCookie } from "../utils/Utils";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showpassword, setShowpassword] = useState(false)
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorType: "",
  });
  const domainName = window.location.hostname;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let agentLoginData = {
      username: e.target[0].value,
      password: e.target[1].value,
    };
    try {
      const userInformtion = await agentLogin(agentLoginData);
      if (userInformtion.data.success === true) {
       
        if(userInformtion.data.status===0){
          localStorage.setItem("temp-del",JSON.stringify(userInformtion.data))
          navigate('/verify-account');
        }else{
        setError({
          error: true,
          errorMessage: userInformtion.data.message,
          errorType: "alert-success",
        });
        window.location.href = "/dashboard";
        
        setCookie("user", JSON.stringify(userInformtion), 7); // Expires in 7 days
      }
      } else {
        setError({
          error: true,
          errorMessage: userInformtion.data.message,
          errorType: "alert-danger",
        });
      }
    } catch (error) {
      // Handle errors here, e.g., show an error message
      console.error("Error:", error);
    }
  };
const handleEye = ()=>{
  setShowpassword(!showpassword)
}
  return (
    <div className="bg-white d-flex justify-content-center align-items-center vh-100">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-4">
            <div className="authentication-page-content">
              <div className="d-flex flex-column h-100 px-4 pt-4">
                <div className="row justify-content-center">
                  <div className="col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div className="py-md-5 py-4">
                      <div className="text-center mb-5">
                        {/* <img
                          className="w-50"
                          alt="authkey"
                          src="/images/logo.png"
                        /> */}
                        <p className="text-muted">Welcome Back !</p>
                      </div>
                      <form onSubmit={handleSubmit}>
                        {error.error && (
                          <div
                            className={`text-danger alert p-1 mb-2 ${error.errorType}`}
                          >
                            {error.errorMessage}
                          </div>
                        )}

                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter username"
                          />
                        </div>

                        <div className="mb-3">
                          {/* <div className="float-end">
                            <a
                              href="auth-recoverpw.html"
                              className="text-muted"
                            >
                              Forgot password?
                            </a>
                          </div> */}
                          <label htmlFor="userpassword" className="form-label">
                            Password
                          </label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <input
                              type={showpassword?"text":"password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              id="password-input"
                            />
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={handleEye}
                            >
                              {showpassword?<i className="ri-eye-fill align-middle"></i>:
                              <i className="ri-eye-fill align-middle"></i>}
                            </button>
                          </div>
                        </div>

                        <div className="form-check form-check-info font-size-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="remember-check"
                          />
                          <label
                            className="form-check-label font-size-14"
                            htmlFor="remember-check"
                          >
                            Remember me
                          </label>
                        </div>

                        <div className="text-center mt-4">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Log In
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-12">
                    <div className="text-center text-muted p-4">
                      <p className="mb-0">
                        &copy; {domainName} | All rights
                        reserved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
