import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL2 } from "../api/api";

const VerifyAccount = () => {
  const ls = JSON.parse(localStorage.getItem("temp-del"));
  const [seconds, setSeconds] = useState(2 * 60);
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [verified, setVerified] = useState({});
  const [otp, setOtp] = useState({ email: "", mobile: "" });
  const navigate = useNavigate();
  useEffect(() => {
    if (seconds > 0) {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  useEffect(() => {
    intial_data();
  }, []);
  const intial_data = async () => {
    const { data } = await axios.post(`${BASE_URL2}/login`, {
      token: ls.parent_token,
      user_id: ls.parent_id,
      method: "verify_status",
      email: ls.email,
      mobile: ls.mobile,
      id: ls.user_id,
    });
    if (data.success === true) {
      if (data.data.email_status === 1) {
        setVerified((prevState) => ({
          ...prevState,
          email: true,
        }));
      } else {
        setVerified((prevState) => ({
          ...prevState,
          email: false,
        }));
      }
      if (data.data.mobile_status === 1) {
        setVerified((prevState) => ({
          ...prevState,
          mobile: true,
        }));
      } else {
        setVerified((prevState) => ({
          ...prevState,
          mobile: false,
        }));
      }
    }
  };

  const handleEye = () => {
    setShowpassword(!showpassword);
  };

  const handleEmailOtp = async () => {
    setSeconds(2 * 60);
    const dataforsendotp = {
      token: ls.parent_token,
      user_id: ls.parent_id,
      method: "send_email_otp",
      email: ls.email,
      id: ls.user_id,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/login`,
        dataforsendotp
      );
      if (data.success === true) {
        toast.info(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);

      toast.error(error.message);
    }
  };

  const handleMobileOtp = async () => {
    setSeconds(2 * 60);
    const dataforsendotp = {
      token: ls.parent_token,
      user_id: ls.parent_id,
      method: "send_mobile_otp",
      mobile: ls.mobile,
      id: ls.user_id,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/login`,
        dataforsendotp
      );
      if (data.success === true) {
        toast.info(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const verifyEmailOtp = async () => {
    const dataforemailverify = {
      token: ls.parent_token,
      user_id: ls.parent_id,
      method: "verify_email_otp",
      email: ls.email,
      email_otp: otp.email,
      id: ls.user_id,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/login`,
        dataforemailverify
      );
      if (data.success === true) {
        toast.info(data.message);
        window.location.reload();
        setVerified({ email: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const verifyMobileOtp = async () => {
    const dataformobileverify = {
      token: ls.parent_token,
      user_id: ls.parent_id,
      method: "verify_mobile_otp",
      mobile: ls.mobile,
      mobile_otp: otp.mobile,
      id: ls.user_id,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/login`,
        dataformobileverify
      );
      if (data.success === true) {
        toast.info(data.message);
        window.location.reload();
        setVerified({ mobile: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    if (newPass !== confPass) {
      toast.error("Password don't match");
      return;
    }
    if (verified.email === false || verified.mobile === false) {
      toast.error("Email or Password not verified");
      return;
    }
    try {
      const dataforactivateaAC = {
        token: ls.parent_token,
        user_id: ls.parent_id,
        method: "Activate_account",
        mobile: ls.mobile,
        email: ls.email,
        id: ls.user_id,
        updated_pass:newPass
      };
      const { data } = await axios.post(
        `${BASE_URL2}/login`,
        dataforactivateaAC
      );
      if (data.success === true) {
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="modal fade"
        id="staticBackdrop-email-otp"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Enter otp
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSeconds(2 * 60)}
              ></button>
            </div>
            <div className="modal-body">
              <h5>We have sent 6 digit OTP on your Email</h5>
              <input
                type="text"
                value={otp.email}
                placeholder="Enter 6 digit email otp"
                onChange={(e) => setOtp({ email: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              {seconds !== 0 ? (
                <p>
                  Resend otp after: {minutes}:
                  {remainingSeconds < 10
                    ? `0${remainingSeconds}`
                    : remainingSeconds}
                </p>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleEmailOtp}
                >
                  Resend Otp
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={verifyEmailOtp}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop-mob-otp"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Enter otp
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSeconds(2 * 60)}
              ></button>
            </div>
            <div className="modal-body">
              <h5>We have sent 6 digit OTP on your Mobile</h5>
              <input
                type="text"
                value={otp.mobile}
                placeholder="Enter 6 digit mobile otp"
                onChange={(e) => setOtp({ mobile: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              {seconds !== 0 ? (
                <p>
                  Resend otp after: {minutes}:
                  {remainingSeconds < 10
                    ? `0${remainingSeconds}`
                    : remainingSeconds}
                </p>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleMobileOtp}
                >
                  Resend Otp
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={verifyMobileOtp}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid p-0">
          <div className="container">
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card mt-4 p-4">
                  <div className="card-header">
                    <h2 className="text-center">Verify Account</h2>
                  </div>
                  <div className="d-flex justify-content-center">
                    <form onSubmit={handleVerifyAccount}>
                      <div className="row">
                        <div className="form-group col-md-4">
                          <label htmlFor="fullname" className="form-label">
                            Full Name
                          </label>{" "}
                          <span style={{ color: "red" }}>*</span>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={ls?.name}
                            placeholder="Enter Full Name"
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>{" "}
                          <span style={{ color: "red" }}>*</span>
                          <div className="d-flex">
                            <input
                              type="text"
                              className="form-control"
                              name="email"
                              value={ls?.email}
                              placeholder="Enter Email"
                              readOnly
                            />
                            {!verified.email && (
                              <div
                                className="mt-2 ms-1"
                                style={{ cursor: "pointer", color: "blue" }}
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop-email-otp"
                                onClick={handleEmailOtp}
                              >
                                verify
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="mobile" className="form-label">
                            Mobile
                          </label>{" "}
                          <span style={{ color: "red" }}>*</span>
                          <div className="d-flex">
                            <input
                              type="text"
                              className="form-control"
                              name="mobile"
                              value={ls?.mobile}
                              placeholder="Enter Mobile no."
                              readOnly
                            />
                            {!verified.mobile && (
                              <div
                                className="mt-2 ms-1"
                                style={{ cursor: "pointer", color: "blue" }}
                                onClick={handleMobileOtp}
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop-mob-otp"
                              >
                                Verify
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="form-group col-md-6">
                            <label htmlFor="newpass" className="form-label">
                              New Password
                            </label>{" "}
                            <span style={{ color: "red" }}>*</span>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type={showpassword ? "text" : "password"}
                                className="form-control pe-5"
                                placeholder="Enter Password"
                                id="password-input-new"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                required
                              />
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                type="button"
                                id="password-new"
                                onClick={handleEye}
                              >
                                {showpassword ? (
                                  <i className="ri-eye-fill align-middle"></i>
                                ) : (
                                  <i className="ri-eye-fill align-middle"></i>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="confpass" className="form-label">
                              Confirm Password
                            </label>{" "}
                            <span style={{ color: "red" }}>*</span>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type={showpassword ? "text" : "password"}
                                className="form-control pe-5"
                                placeholder="Enter Password"
                                id="password-input-conf"
                                required
                                value={confPass}
                                onChange={(e)=>setConfPass(e.target.value)}
                              />
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                type="button"
                                id="password-conf"
                                onClick={handleEye}
                                value={confPass}
                                onChange={(e) => setConfPass(e.target.value)}
                              >
                                {showpassword ? (
                                  <i className="ri-eye-fill align-middle"></i>
                                ) : (
                                  <i className="ri-eye-fill align-middle"></i>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          className="form-row mt-4"
                          style={{ float: "right" }}
                        >
                          <div
                            className="form-group col-md-2"
                            style={{ float: "right" }}
                          >
                            <button
                              type="submit"
                              className="btn btn-primary"
                              style={{ cursor: "pointer" }}
                            >
                              Verify Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
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

export default VerifyAccount;
