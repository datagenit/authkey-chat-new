import React, { useContext, useEffect, useState } from "react";
import "../assets/css/agent.css";
import dayjs from "dayjs";
import { BASE_URL } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Button, Fade, Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Select from "react-select";
import axios from "axios";
import { BASE_URL2, SOCKET_URL } from "../api/api";
import { io } from "socket.io-client";

const AgentManagement = () => {
  const [agentList, setAgentList] = useState([]);
  const [selectedAgentType, setSelectedAgentType] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const [updateValue, setupdateValue] = useState({});
  const [name, setName] = useState("");
  const [updateCheckBox, setUpdateCheckBox] = useState({});
  const [id, setId] = useState(null);
  const [selectedBtn, setSelectedBtn] = useState("agent");
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState();
  const [listToTransfer, setListToTransfer] = useState();
  const [transferTo, setTransferTo] = useState();
  const [deletePopup, setDeletePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const permission = currentUser.parent_id
    ? JSON.parse(currentUser?.permission)
    : null;

  //socket
  useEffect(() => {
    const socket = io(SOCKET_URL);

    if (currentUser && currentUser.parent_id) {
      socket.emit("setup", currentUser);
    }

    const handleOnlineAgent = (data) => {
      if (data?.user_type !== "admin") {
        setAgentList((prevAgentList) => {
          const index = prevAgentList.findIndex(
            (selectedItem) => selectedItem.id === data.user_id
          );

          if (index !== -1) {
            const updatedItems = [...prevAgentList];
            updatedItems[index] = {
              ...updatedItems[index],
              online: 1,
            };
            return updatedItems;
          }
          return prevAgentList;
        });
      }
    };

    const handleOfflineAgent = (data) => {
      if (data?.user_type !== "admin") {
        setAgentList((prevAgentList) => {
          const index = prevAgentList.findIndex(
            (selectedItem) => selectedItem.id === data.user_id
          );

          if (index !== -1) {
            const updatedItems = [...prevAgentList];
            updatedItems[index] = {
              ...updatedItems[index],
              online: 0,
              last_seen_datetime: new Date(),
            };
            return updatedItems;
          }
          return prevAgentList;
        });
      }
    };

    socket.on("online agent", handleOnlineAgent);
    socket.on("offline agent", handleOfflineAgent);

    return () => {
      socket.off("online agent", handleOnlineAgent);
      socket.off("offline agent", handleOfflineAgent);
      socket.disconnect();
    };
  }, [currentUser]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setUpdateCheckBox((prevState) => ({
      ...prevState,
      [name]: checked ? 1 : 0,
    }));
  };

  useEffect(() => {
    if (currentUser.parent_id) {
      showAgent();
    }
  }, [currentUser]);

  const showAgent = async () => {
    setLoading(true);
    const data = {
      user_id: currentUser.parent_id,
      method: "retrieve_agent",
      token: currentUser.parent_token,
      user_type: currentUser.user_type,
      agent_id: currentUser.user_id,
    };

    try {
      const response = await fetch(`${BASE_URL2}/whatsapp_agent`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setAgentList(result.data);
      } else {
        console.log("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
    setLoading(false);
  };

  const handleDeletePopup = (id) => {
    if (permission.delete === 0) {
      return toast.info("Does Not Have Permission to Delete");
    }
    setDeletePopup(true);
    setId(id);
  };

  const DeleteAgent = async () => {
    const data = {
      user_id: currentUser.parent_id,
      method: "delete",
      token: currentUser.parent_token,
      id: id,
    };
   

    try {
      const response = await fetch(`${BASE_URL}/agent.php`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        showAgent();
        toast.success(result.message);
      } else {
        console.log("Failed to delete data:", response.statusText);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error occurred while deleting data:", error);
      toast.error(error.message);
    }
  };

  const toggleUpdate = async (id) => {
    if (permission.update === 0) {
      return toast.info("Does Not Have Permission to Update");
    }

    const data = {
      user_id: currentUser.parent_id,
      method: "retrieveid",
      token: currentUser.parent_token,
      id: id,
    };

    try {
      const response = await fetch(`${BASE_URL}/agent.php`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setupdateValue(result.data[0]);
        setName(result.data[0].name);
        setUpdateForm(true);
        setId(id);
        const newData = result?.data[0]?.permission;
        const permission = JSON.parse(newData);
        setUpdateCheckBox(permission);
      } else {
        console.log("Failed to retrieve data:", response.statusText);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error occurred while retrieving data:", error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setupdateValue({ ...updateValue, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    if (!updateValue.name) {
      return false;
    }
    if (!updateValue.mobile || updateValue.mobile.length !== 10) {
      return false;
    }
    return true;
  };

  const updateData = async (event) => {
    event.preventDefault();
    if (isValid()) {
      const data = {
        user_id: currentUser.parent_id,
        method: "update",
        token: currentUser.parent_token,
        id: id,
        permission: JSON.stringify(updateCheckBox),
        name: updateValue.name,
        agent_type: updateValue.agent_type,
        mobile: updateValue.mobile,
        email: updateValue.email,
      };
      try {
        const response = await fetch(`${BASE_URL}/agent.php`, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();

        if (result.success) {
          showAgent();
          toast.success(result.message);
          setUpdateForm(false);
        } else {
          console.log("Failed to update data:", response.statusText);
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error occurred while updating data:", error);
        toast.error(error.message);
      }
    }
  };

  const handleTransfer = async () => {
    const transfertoAgent = agentList.filter(
      (list) => list.id === transferTo.value
    );
    const datafortransfer = {
      user_id: currentUser.parent_id,
      token: currentUser.parent_token,
      method: `${
        selectedBtn === "agent" ? "agent_transfer" : "manager_transfer"
      }`,
      transfer_to: transfertoAgent,
      user_type: currentUser.user_type,
      agent_list: selectedRows,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/whatsapp_agent`,
        datafortransfer
      );
      if (data.success === true) {
        toast.success(data.message);
        setTransferTo("");
        setListToTransfer("");
        setSelectedAssign("");
        setSelectedRows("");
        setOpen(false);
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  useEffect(() => {
    const filterAgent = agentList.filter((list) => {
      return list.agent_type === "agent";
    });
    setSelectedAgentType(filterAgent);
  }, [agentList]);
  const AgentBtn = () => {
    setSelectedBtn("agent");
    const filterAgent = agentList.filter((list) => {
      return list.agent_type === "agent";
    });
    setSelectedAgentType(filterAgent);
  };
  const ManagerBtn = () => {
    setSelectedBtn("manager");
    const filterAgent = agentList.filter((list) => {
      return list.agent_type === "manager";
    });
    setSelectedAgentType(filterAgent);
    setSelectedAssign({ value: "team", label: "Team" });
    const filter_Agent = agentList
      .filter((list) => list.agent_type === "team")
      .map((list) => ({
        value: list.id,
        label: list.name,
      }));

    setListToTransfer(filter_Agent);
  };
  const TeamBtn = () => {
    setSelectedBtn("team");
    const filterAgent = agentList.filter((list) => {
      return list.agent_type === "team";
    });
    setSelectedAgentType(filterAgent);
  };

  const columnsAgent = [
    {
      field: "online",
      headerName: "Active Status",
      width: 170,
      sortable: true,
      renderCell: (params) => {
        const isOnline = params.row.online === 1;
        const lastSeen = params.row.last_seen_datetime;

        return isOnline ? (
          <>
            <div
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            ></div>
            <span style={{ marginLeft: "8px" }}>Online</span>
          </>
        ) : (
          <span>{dayjs(lastSeen).format("DD/MM/YYYY h:mm A")}</span>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",

      width: 170,
      sortable: true,
    },

    {
      field: "email",
      headerName: "Email",
      width: 170,

      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 150,
    },
    {
      field: "manager_name",
      headerName: "Manager",
      width: 160,
      hide: true,
    },
    {
      field: "team_name",
      headerName: "Team",
      width: 150,
      hide: `${selectedBtn === "team" ? true : false}`,
      editable: true,
    },
    {
      field: "availability",
      headerName: "Available",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const isAvailable = params.row.availability === 1;

        return isAvailable ? (
          <p>Yes</p>
        ) : (
          <p>No</p>
        );
      },
    },
    {
      field: "update_first_password",
      headerName: "Verified?",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const isAvailable = params.row.update_first_password === 1;

        return isAvailable ? (
          <p>Yes</p>
        ) : (
          <p>No</p>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 90,
      renderCell: (params) => {
        return (
          <div>
            <span
              className="mx-2"
              data-bs-toggle="tooltip"
              data-bs-title="Update"
              onClick={() => toggleUpdate(params.row.id)}
              style={{
                cursor: "pointer",
                color: permission.update === 1 ? "blue" : "grey",
              }}
            >
              <i className="bx bx-edit"></i>
            </span>
            <span
              className="mx-2"
              data-bs-toggle="tooltip"
              data-bs-title="Delete"
              onClick={() => handleDeletePopup(params.row.id)}
              style={{
                cursor: "pointer",
                color: permission.delete === 1 ? "red" : "grey",
              }}
            >
              <i className="bx bx-trash"></i>
            </span>
          </div>
        );
      },
    },
  ];
  const columnsManager = [
    {
      field: "online",
      headerName: "Active Status",
      width: 170,
      sortable: true,
      renderCell: (params) => {
        const isOnline = params.row.online === 1;
        const lastSeen = params.row.last_seen_datetime;

        return isOnline ? (
          <>
            <div
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            ></div>
            <span style={{ marginLeft: "8px" }}>Online</span>
          </>
        ) : (
          <span>{dayjs(lastSeen).format("DD/MM/YYYY h:mm A")}</span>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
      sortable: true,
    },

    {
      field: "email",
      headerName: "Email",

      width: 190,
      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 160,
    },
    {
      field: "team_name",
      headerName: "Team",

      hide: `${selectedBtn === "team" ? true : false}`,
      editable: true,
    },
    // {
    //   field: "is_active",
    //   headerName: "Account Status",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   renderCell: (params) => {
    //     const isOnline = params.row.is_active === 1;

    //     return isOnline ? (
    //       <span className="badge badge-success" style={{ background: "green" }}>
    //         Active
    //       </span>
    //     ) : (
    //       <span className="badge badge-danger" style={{ background: "red" }}>
    //         Inactive
    //       </span>
    //     );
    //   },
    // },
    {
      field: "",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <div>
            <span
              className="mx-2"
              data-bs-toggle="tooltip"
              data-bs-title="Update"
              onClick={() => toggleUpdate(params.row.id)}
              style={{
                cursor: "pointer",
                color: permission.update === 1 ? "blue" : "grey",
              }}
            >
              <i className="bx bx-edit"></i>
            </span>
            <span
              className="mx-2"
              data-bs-toggle="tooltip"
              data-bs-title="Delete"
              onClick={() => handleDeletePopup(params.row.id)}
              style={{
                cursor: "pointer",
                color: permission.update === 1 ? "red" : "grey",
              }}
            >
              <i className="bx bx-trash"></i>
            </span>
          </div>
        );
      },
    },
  ];
  const columnsTeam = [
    {
      field: "online",
      headerName: "Active Status",
      width: 170,
      sortable: true,
      renderCell: (params) => {
        const isOnline = params.row.online === 1;
        const lastSeen = params.row.last_seen_datetime;

        return isOnline ? (
          <>
            <div
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            ></div>
            <span style={{ marginLeft: "8px" }}>Online</span>
          </>
        ) : (
          <span>{dayjs(lastSeen).format("DD/MM/YYYY h:mm A")}</span>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
      sortable: true,
    },

    {
      field: "email",
      headerName: "Email",

      width: 190,
      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 160,
    },
    // {
    //   field: "is_active",
    //   headerName: "Account Status",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   renderCell: (params) => {
    //     const isOnline = params.row.is_active === 1;

    //     return isOnline ? (
    //       <span className="badge badge-success" style={{ background: "green" }}>
    //         Active
    //       </span>
    //     ) : (
    //       <span className="badge badge-danger" style={{ background: "red" }}>
    //         Inactive
    //       </span>
    //     );
    //   },
    // },
    {
      field: "",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <div>
            <span
              className="mx-2"
              data-bs-toggle="tooltip"
              data-bs-title="Update"
              onClick={() => toggleUpdate(params.row.id)}
              style={{
                cursor: "pointer",
                color: permission.update === 1 ? "blue" : "grey",
              }}
            >
              <i className="bx bx-edit"></i>
            </span>
            <span
              className="mx-2"
              data-bs-toggle="tooltip"
              data-bs-title="Delete"
              onClick={() => handleDeletePopup(params.row.id)}
              style={{
                cursor: "pointer",
                color: permission.update === 1 ? "red" : "grey",
              }}
            >
              <i className="bx bx-trash"></i>
            </span>
          </div>
        );
      },
    },
  ];
  const CustomToolbar = () => {
    return (
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <GridToolbar /> */}
        <GridToolbarContainer>
          <GridToolbarFilterButton />
          <GridToolbarExport />
        </GridToolbarContainer>

        {selectedRows.length > 0 && selectedBtn !== "team" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            {selectedBtn === "agent" ? "Assign Manager/Team" : "Assign Team"}
          </Button>
        )}
        <GridToolbarQuickFilter debounceMs={500} />
      </Box>
    );
  };

  const handleClose = () => {
    setTransferTo("");
    setListToTransfer("");
    setSelectedAssign("");
    setSelectedRows("");
    setOpen(false);
  };
  const modelStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };
  const handleSelectAssign = (selected) => {
    setSelectedAssign(selected);
    const filterAgent = agentList
      .filter((list) => list.agent_type === selected.value)
      .map((list) => ({
        value: list.id,
        label: list.name,
      }));

    setListToTransfer(filterAgent);
  };
  const CustomBackdrop = (props) => (
    <Backdrop
      {...props}
      open={props.open}
      onClick={(e) => e.stopPropagation()}
    />
  );

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={CustomBackdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modelStyle}>
            <div className="d-flex flex-column">
              <div>
                <button
                  style={{
                    float: "right",
                    cursor: "pointer",
                    padding: "3px",
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                  }}
                  onClick={handleClose}
                >
                  <i className="bx bx-x"></i>
                </button>
              </div>
              <div>
                {selectedBtn === "agent" && (
                  <Select
                    placeholder="Transfer to"
                    onChange={handleSelectAssign}
                    options={[
                      { value: "manager", label: "Manager" },
                      { value: "team", label: "Team" },
                    ]}
                  />
                )}
                {selectedAssign && (
                  <>
                    <div className="my-4">
                      <Select
                        placeholder={`Select ${selectedAssign.value}`}
                        onChange={(selected) => setTransferTo(selected)}
                        options={listToTransfer}
                      />
                    </div>
                    <div style={{ float: "right" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTransfer}
                      >
                        Transfer
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div className="d-flex flex-column container-fluid">
        {/* <div className="my-4">
          <Link to="/agent-management/create-agent" className="btn btn-success" style={{float:"right"}}>Create</Link>
        </div> */}
        <div className="container-fluid">
          {currentUser.user_type !== "manager" && (
            <div className="d-flex justify-content-center">
              <div className="my-4 px-4">
                <button
                  style={{ height: "30px", width: "100px" }}
                  className={`mx-1 btn-border-none rounded-pill ${
                    selectedBtn === "agent" ? "active-btn" : ""
                  }`}
                  onClick={AgentBtn}
                >
                  Agent
                </button>
                <button
                  style={{ height: "30px", width: "100px" }}
                  className={`mx-1 btn-border-none rounded-pill ${
                    selectedBtn === "manager" ? "active-btn" : ""
                  }`}
                  onClick={ManagerBtn}
                >
                  Manager
                </button>
                {currentUser.user_type !== "team" && (
                  <button
                    style={{ height: "30px", width: "100px" }}
                    className={`mx-1 btn-border-none rounded-pill ${
                      selectedBtn === "team" ? "active-btn" : ""
                    }`}
                    onClick={TeamBtn}
                  >
                    team
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="card">
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={selectedAgentType}
                columns={
                  selectedBtn === "agent" && currentUser.user_type !== "manager"
                    ? columnsAgent
                    : selectedBtn === "manager"
                    ? columnsManager
                    : columnsTeam
                }
                loading={loading}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                disableRowSelectionOnClick
                pageSizeOptions={[5]}
                checkboxSelection={
                  selectedBtn === "team" || currentUser.user_type === "manager"
                    ? false
                    : selectedBtn === "manager" &&
                      currentUser.user_type === "team"
                    ? false
                    : true
                }
                rowSelectionModel={selectedRows}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setSelectedRows(newRowSelectionModel);
                }}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </Box>
          </div>
          {updateForm && (
            <div className="popup-agent">
              <div className="assign-popup-content-agent">
                <div style={{ float: "right", cursor: "pointer" }}>
                  <i
                    className="bx bx-x float-right"
                    onClick={() => setUpdateForm(false)}
                  ></i>
                </div>
                <form>
                  <div className="form-group col-md-12">
                    <h5 className=" popupHeader">Edit {name} </h5>
                  </div>

                  <div className="overflowblocks">
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="agent_type" className="form-label">
                          User Type
                        </label>
                        <select
                          value={updateValue.agent_type}
                          name="agent_type"
                          onChange={handleChange}
                          className="form-control"
                          style={{ cursor: "pointer" }}
                          disabled={
                            currentUser.user_type === "manager" ? true : false
                          }
                        >
                          <option value="agent">Agent</option>
                          {currentUser.user_type === "admin" ||
                          currentUser.user_type === "team" ? (
                            <option value="manager">Manager</option>
                          ) : null}
                          {currentUser.user_type === "admin" && (
                            <option value="team">Team</option>
                          )}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="agent-label" htmlFor="name">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={updateValue.name}
                          onChange={handleChange}
                          placeholder="Enter Name"
                        />
                      </div>
                    </div>
                    {updateValue.agent_type !== "agent" && (
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <input
                            className="ml-2"
                            style={{ cursor: "pointer" }}
                            type="checkbox"
                            id="checkboxadd"
                            name="add"
                            checked={updateCheckBox.add}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="mx-2"
                            htmlFor="checkboxadd"
                            style={{ cursor: "pointer" }}
                          >
                            Add
                          </label>

                          <input
                            className="ml-2"
                            type="checkbox"
                            style={{ cursor: "pointer" }}
                            id="checkboxupdate"
                            name="update"
                            checked={updateCheckBox.update}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="mx-2"
                            htmlFor="checkboxupdate"
                            style={{ cursor: "pointer" }}
                          >
                            Update
                          </label>

                          <input
                            className="ml-2"
                            style={{ cursor: "pointer" }}
                            type="checkbox"
                            id="checkboxdel"
                            name="delete"
                            checked={updateCheckBox.delete}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="mx-2"
                            htmlFor="checkboxdel"
                            style={{ cursor: "pointer" }}
                          >
                            Delete
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="row mt-2" style={{ marginTop: "-10px" }}>
                      <div className="col-md-6">
                        <label className="agent-label" htmlFor="email">
                          User Name
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={updateValue.email}
                          onChange={handleChange}
                          placeholder="Enter Email"
                          disabled
                        />
                        <p style={{ fontSize: "10px" }}>
                          Note: Email cannot be changed
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="agent-label" htmlFor="mobile">
                          Mobile
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="mobile"
                          value={updateValue.mobile}
                          onChange={handleChange}
                          placeholder="Enter Mobile"
                          disabled
                        />
                        <p style={{ fontSize: "10px" }}>
                          Note: Mobile cannot be changed
                        </p>
                      </div>
                      {/* <div className="form-group col-md-6">
                            <label className='agent-label' for="name">Status</label>
                            <select name='is_active' value={updateValue.is_active} onChange={handleChange} className="form-control">
                              <option value=''>Select Status</option>
                              <option value='1'>Active</option>
                              <option value='0'>InActive</option>
                            </select>

                          </div> */}
                    </div>
                    {/* <div className="form-row">
                        <div className="form-group col-md-6">
                          <label className='agent-label' for="password">Password</label>
                          <input type="password" className="form-control" name='password' value={updateValue.password} onChange={handleChange} placeholder="Enter Password" />
                        </div>
                        <div className="form-group col-md-6">
                          <label className='agent-label' for="cpassword">Confirm Password</label>
                          <input type="password" className="form-control" name='cpassword' value={updateValue.cpassword} onChange={handleChange} placeholder="Enter Confirm Password" />
                        </div>
                      </div> */}
                  </div>
                  <button
                    style={{ float: "right" }}
                    className="btn btn-primary mt-4"
                    onClick={(e) => updateData(e)}
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          )}
          {deletePopup && (
            <div className="popup-agent">
              <div className="assign-popup-content-agent">
                <div style={{ float: "right", cursor: "pointer" }}>
                  <i
                    className="bx bx-x float-right"
                    onClick={() => setDeletePopup(false)}
                  ></i>
                </div>
                <form>
                  <div className="overflowblocks">
                    <div className="row mt-4">
                      <div className="col-md-12">
                        <h4>Are You Sure Want to Delete ?</h4>
                      </div>
                    </div>
                  </div>

                  <button
                    style={{ float: "right", marginLeft: "10px" }}
                    className="btn btn-danger mt-4"
                    onClick={() => DeleteAgent()}
                  >
                    Delete
                  </button>

                  <button
                    style={{ float: "right" }}
                    className="btn btn-secondary mt-4"
                    onClick={() => setDeletePopup(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentManagement;
