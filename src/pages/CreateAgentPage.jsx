import React, { useContext, useState } from "react";
import LeftMenu from "../components/LeftMenu";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../components/Navbar";
const CreateAgentPage = () => {
  const blankDataItem = {
    name: "",
    email: "",
    mobile: "",
    // password: '',
    // cpassword: ''
  };

  const { currentUser } = useContext(AuthContext);
  const [dataItem, setDataItem] = useState(blankDataItem);

  const [userType, setUserType] = useState("agent");
  const [checkboxes, setCheckboxes] = useState({
    add: 0,
    update: 0,
    delete: 0,
  });

  const onChange = (e) => {
    setDataItem({ ...dataItem, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked ? 1 : 0,
    }));
  };

  const onSubmit = async () => {
    const data = {
      user_id: currentUser.parent_id,
      method: "create",
      token: currentUser.parent_token,
      name: dataItem.name,
      email: dataItem.email,
      mobile: dataItem.mobile,
      agent_type: userType,
      permission: JSON.stringify(checkboxes),
      // password: dataItem.password,
      // cpassword: dataItem.cpassword
    };

    try {
      const res = await axios.post(`${BASE_URL}/agent.php`, data);
      
      if (res.data.success===true) {
        setDataItem(blankDataItem);
       toast.success(res.data.message);
      } else {
        console.error("Failed to save data:", res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error occurred while saving data:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="layout-wrapper d-lg-flex">
    <LeftMenu/>
    <div className="w-100">
    <Navbar/>
    <div className="d-flex">
      {/* <LeftMenu /> */}
      <div className="container-fluid">
        <div className="my-4">
          <Link
            to="/agent-management/agent"
            className="btn btn-success"
            style={{ float: "right" }}
          >
            Back
          </Link>
        </div>
        <div className="content">
          <div className="container-fluid p-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 mx-auto">
                  <div className="card mt-4">
                    <div className="card-header">
                      <h2 className="text-center">Add Agent</h2>
                    </div>
                    <div className="d-flex justify-content-center">
                      <form>
                        <div className="row">
                          <div className="col-md-12 mx-auto">
                            <label htmlFor="user_type" className="form-label">
                              User Type
                            </label>{" "}
                            <span style={{ color: "red" }}>*</span>
                            <select
                              value={userType}
                              name="user_type"
                              onChange={(e) => setUserType(e.target.value)}
                              className="form-control"
                              style={{ cursor: "pointer" }}
                            >
                              <option value="agent">Agent</option>
                              {currentUser.user_type === "admin" || currentUser.user_type === "team" ? <option value="manager">Manager</option> : null}
                              {currentUser.user_type === "admin" && <option value="team">Team</option>}
                            </select>
                          </div>
                          {userType !== "agent" && (
                            <div className="form-row my-2">
                              Give Permission
                              <div className="form-group col-md-12">
                                <input
                                  className="mx-1"
                                  style={{ cursor: "pointer" }}
                                  type="checkbox"
                                  id="checkboxadd"
                                  name="add"
                                  checked={checkboxes.add === 1}
                                  onChange={handleCheckboxChange}
                                />
                                <label
                                  className="me-4"
                                  htmlFor="checkboxadd"
                                  style={{ cursor: "pointer" }}
                                >
                                  Add
                                </label>

                                <input
                                  className="mx-1"
                                  type="checkbox"
                                  style={{ cursor: "pointer" }}
                                  id="checkboxupdate"
                                  name="update"
                                  checked={checkboxes.update === 1}
                                  onChange={handleCheckboxChange}
                                />
                                <label
                                  className="me-4"
                                  htmlFor="checkboxupdate"
                                  style={{ cursor: "pointer" }}
                                >
                                  Update
                                </label>

                                <input
                                  className="mx-1"
                                  type="checkbox"
                                  id="checkboxdel"
                                  style={{ cursor: "pointer" }}
                                  name="delete"
                                  checked={checkboxes.delete === 1}
                                  onChange={handleCheckboxChange}
                                />
                                <label
                                  className=""
                                  htmlFor="checkboxdel"
                                  style={{ cursor: "pointer" }}
                                >
                                  Delete
                                </label>
                              </div>
                            </div>
                          )}
                          <div className="form-group col-md-12">
                            <label htmlFor="fullname" className="form-label">
                              Full Name
                            </label>{" "}
                            <span style={{ color: "red" }}>*</span>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={dataItem.name}
                              onChange={onChange}
                              placeholder="Enter Full Name"
                            />
                          </div>
                          <div className="form-group col-md-12 mt-3">
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>{" "}
                            <span style={{ color: "red" }}>*</span>
                            <input
                              type="text"
                              className="form-control"
                              name="email"
                              value={dataItem.email}
                              onChange={onChange}
                              placeholder="Enter Email"
                            />
                          </div>
                          <div className="form-group col-md-12 mt-3">
                            <label htmlFor="mobile" className="form-label">
                              Mobile
                            </label>{" "}
                            <span style={{ color: "red" }}>*</span>
                            <input
                              type="text"
                              className="form-control"
                              name="mobile"
                              value={dataItem.mobile}
                              onChange={onChange}
                              placeholder="Enter Mobile no."
                            />
                          </div>
                        </div>

                        <div
                          className="form-row mt-4"
                          style={{ float: "right" }}
                        >
                          <div className="form-group col-md-2">
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ cursor: "pointer" }}
                              onClick={onSubmit}
                            >
                              Submit
                            </button>
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
    </div>
    </div>
  </div>
  );
};

export default CreateAgentPage;
