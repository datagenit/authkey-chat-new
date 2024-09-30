import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Search from "./Search";
import Chats from "./Chats";
import Bookmark from "./bookmark/Bookmark";
import UserProfile from "./profile/UserProfile";
import { deleteCookie } from "../utils/Utils";
// import UnreadChats from "./UnreadChats";
import { ChatState } from "../context/AllProviders";
import axios from "axios";
import { BASE_URL, BASE_URL2, SOCKET_URL } from "../api/api";
import Select from "react-select";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import io from "socket.io-client";
const SideBar = () => {
  const [searchParams] = useSearchParams();
  const params = searchParams.get("tab");
  const urlQuery = params ? params : "";

  const [isLoading, setIsLoading] = useState(false);
  const [agentList, setAgentList] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedAgent, setSelectedAgent] = useState();
  const { currentUser } = useContext(AuthContext);
  const {
    unReadChat,
    setPage,
    page,
    setSelectedBtn,
    selectedBtn,
    chats,
    setAllChats,
    starChats,
    setStarChats,
    checkboxList,
    setCheckboxList,
    setChats,
    setChatsLoading
  } = ChatState();
  const scrollContainerRef = useRef(null);
  const modalRef = useRef(null);


  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      scrollContainerRef.current;

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom) {
      setPage(page + 30);
      const nextPagec=page + 30
      getWhatsaAppNumberList(nextPagec);
    }
  };
  useEffect(() => {
    const getWhatsaAppNumberList = async (page) => {
      if(currentUser.parent_id){
      setChatsLoading(true);
      let datafornolist = {
        token: currentUser.parent_token,
        user_id: currentUser.parent_id,
        method: "left_menunew",
        start: 0,
        brand_number: currentUser.brand_number,
        user_type: currentUser.user_type,
        search_id: currentUser.user_id ? currentUser.user_id : "",
      };
      try {
        const { data } = await axios.post(
          `${BASE_URL}/netcore_conversation.php`,
          datafornolist
        );
  
        if (data.success === true) {
         
            setChats(data.data);
          
        }
        setChatsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    };
    getWhatsaAppNumberList(page);
  }, [currentUser,setChatsLoading]);
  
  const getWhatsaAppNumberList = async (page) => {
    if(currentUser.parent_id){
    setChatsLoading(true);
    let datafornolist = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "left_menunew",
      start: page,
      brand_number: currentUser.brand_number,
      user_type: currentUser.user_type,
      search_id: currentUser.user_id ? currentUser.user_id : "",
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        datafornolist
      );

      if (data.success === true) {
        if (chats.length === 0) {
          setChats(data.data);
        } else {
          setChats([...chats, ...data.data]);
        }
      }
      setChatsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  };
  //socket
  useEffect(() => {
    let socket = io(SOCKET_URL);
    socket.emit("setup", currentUser);
    socket.on("online agent", (data) => {
      
      if (data?.user_type !== "admin") {
        const index = agentList.findIndex(
          (selecteditem) => selecteditem.value === data.user_id
        );
      
        
        if (index !== -1) {
          const updatedItems = [...agentList];
          updatedItems[index] = {
            ...updatedItems[index],

            label: `${data.name} (${"online"})`,
          };
          setAgentList(updatedItems);
        }
      }
    });
    socket.on("offline agent", (data) => {
     
      
      if (data?.user_type !== "admin") {
        const index = agentList.findIndex(
          (selecteditem) => selecteditem.value === data.user_id
        );
      
        
        const date = new Date();
        if (index !== -1) {
          const updatedItems = [...agentList];
          updatedItems[index] = {
            ...updatedItems[index],

            label: `${data.name} ( Last seen :${dayjs(date).format(
              "DD/MM/YYYY h:mm A"
            )})`,
          };
         
          
          setAgentList(updatedItems);
        }
      }
    });
    return () => {
    socket.off("online agent");
    socket.off("offline agent");
    socket.disconnect();
    };
  }, [currentUser,agentList]);
  useEffect(() => {
    const staredChats = async () => {
      if(currentUser.parent_id){
      let dataforstarChats = {
        token: currentUser.parent_token,
        user_id: currentUser.parent_id,
        method: "get_star_list",
        brand_number: currentUser.brand_number,
        user_type:currentUser.user_type,
        agent_id:currentUser.user_id
      };
      try {
        const { data } = await axios.post(
          `${BASE_URL}/netcore_conversation.php`,
          dataforstarChats
        );
  
        if (data.success === true) {
          setStarChats(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    };
    staredChats();
  }, [currentUser,setStarChats]);
  
  useEffect(() => {
    if (selectedBtn === "all") {
      setAllChats(chats);
    }
  }, [chats, selectedBtn, setAllChats]);
  useEffect(() => {
    if (selectedBtn === "unread") {
      setAllChats(unReadChat);
    }
  }, [unReadChat, selectedBtn, setAllChats]);
  useEffect(() => {
    if (selectedBtn === "star") {
      setAllChats(starChats);
    }
  }, [starChats, selectedBtn, setAllChats]);
  const allBtn = () => {
    setSelectedBtn("all");
    setAllChats(chats);
  };
  const unreadBtn = () => {
    setSelectedBtn("unread");
    setAllChats(unReadChat);
  };
  const starBtn = () => {
    setSelectedBtn("star");
    setAllChats(starChats);
  };
  const designationOptions = [
    { value: "agent", label: "Agent" },
    { value: "manager", label: "Manager" },
  ];
  const handleDesignation = (selected) => {
    setAgentList([]);
    setSelectedType(selected);
    fetchAgent(selected.value);
  };
  const fetchAgent = async (selectType) => {
    setIsLoading(true);
    const forAgentdata = {
      user_id: currentUser.parent_id,
      token: currentUser.parent_token,
      method: "retrieve",
      agent_type: selectType,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/whatsapp_agent`,
        forAgentdata
      );

      if (data.success === true) {
        const newAgentList = data.data.map((item) => ({
          value: item.id,
          label: `${item.name} (${
            item.online === 0
              ? ` Last seen :${dayjs(item.last_seen_datetime).format(
                  "DD/MM/YYYY h:mm A"
                )}`
              : "online"
          })`,
        }));
        setAgentList(newAgentList);
        setIsLoading(false);
      } else {
        setAgentList([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleAgent = (selected) => {
    setSelectedAgent(selected.value);
  };
  const handleAssign = async () => {
    const forAssignAgent = {
      user_id: currentUser.parent_id,
      token: currentUser.parent_token,
      method: "chat_transfer",
      transfer_type: selectedType.value,
      transfer_to: selectedAgent,
      chat_list: checkboxList,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/whatsapp_agent`,
        forAssignAgent
      );

      if (data.success === true) {
        setCheckboxList([]);
        toast.success(data.message);
        setIsLoading(false);
        window.location.reload();
      } else {
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };
  const handleAssignChat = ()=>{
    if(currentUser.user_type==="manager"){
      setSelectedType({ value: "agent", label: "Agent" })
      fetchAgent("agent");
    }
  }

  useEffect(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }, []);


  return (
    <>
      <div className="side-menu flex-lg-column">
        <div className="flex-lg-column my-0 sidemenu-navigation">
          <ul className="nav nav-pills side-menu-nav" role="tablist">
            <li
              className="nav-item d-none d-lg-block"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Profile"
            >
              <a
                className={`nav-link ${urlQuery === "user" ? "active" : ""}`}
                id="pills-user-tab"
                data-bs-toggle="pill"
                href="#pills-user"
                role="tab"
              >
                <i className="mdi mdi-account-outline" />
              </a>
            </li>
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Chats"
            >
              <a
                className={`nav-link ${urlQuery === "" ? "active" : ""}`}
                id="pills-chat-tab"
                data-bs-toggle="pill"
                href="#pills-chat"
                role="tab"
              >
                <i className="mdi mdi-message-text-outline" />
              </a>
            </li>
            {currentUser.user_type !== "agent" && (
              <li
                className="nav-item"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-trigger="hover"
                data-bs-container=".sidemenu-navigation"
                title="Agent Management"
              >
                <Link to="/agent-management/report" className="nav-link">
                  <i className="mdi mdi-account-tie-outline"></i>
                </Link>
              </li>
            )}
            {/* <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Contacts"
            >
              <a
                className="nav-link"
                id="pills-contacts-tab"
                data-bs-toggle="pill"
                href="#pills-contacts"
                role="tab"
              >
                <div>
                  <i className="bx bx-conversation" />
                  <span className="position-absolute  start-1 translate-middle badge rounded-pill bg-danger" style={{top:"20px", height:"20px"}}>
                    <p style={{fontSize:"10px"}}>{unReadChat.length}</p>
                    <span class="visually-hidden">unread messages</span>
                  </span>
                </div>
              </a>
            </li>
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-trigger="hover"
              data-bs-container=".sidemenu-navigation"
              title="Bookmark"
              onClick={staredChats}
            >
              <a
                className="nav-link"
                id="pills-bookmark-tab"
                data-bs-toggle="pill"
                href="#pills-bookmark"
                role="tab"
              >
                <i className="bx bx-star" />
              </a>
            </li> */}

            <li className="nav-item mt-auto dropdown profile-user-dropdown">
              <div
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="mdi mdi-account-cog-outline" />
              </div>
              <div className="dropdown-menu">
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  id="pills-user-tab"
                  data-bs-toggle="pill"
                  href="#pills-user"
                  role="tab"
                >
                  Profile 
                </a>
                {/* <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  id="pills-setting-tab"
                  data-bs-toggle="pill"
                  href="#pills-setting"
                  role="tab"
                >
                  Setting <i className="bx bx-cog text-muted ms-1" />
                </a> */}
                <a
                  className="dropdown-item d-flex align-items-center justify-content-between"
                  id="pills-change-password-tab"
                  data-bs-toggle="pill"
                  href="#pills-change-password"
                  role="tab"
                > 
                  Change Password
                 
                </a>
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
      <div className="chat-leftsidebar">
        <div className="tab-content">
          <div
            className={`tab-pane ${urlQuery === "user" ? "show active" : ""}`}
            id="pills-user"
            role="tabpanel"
            aria-labelledby="pills-user-tab"
          >
            <UserProfile currentUser={currentUser} />
          </div>
          <div
            className={`tab-pane ${
              urlQuery === "change-password" ? "show active" : ""
            }`}
            id="pills-change-password"
            role="tabpanel"
            aria-labelledby="pills-change-password-tab"
          >
            <ChangePassword />
          </div>
          <div
            className={`tab-pane ${urlQuery === "" ? "show active" : ""}`}
            id="pills-chat"
            role="tabpanel"
            aria-labelledby="pills-chat-tab"
          >
            <div>
              <div className="pt-3 px-3 pb-2">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h4 className="mb-3 fw-bold">Chats</h4>
                  </div>
                  {/* <div className="flex-shrink-0">
                    <div
                      data-bs-toggle="tooltip"
                      data-bs-trigger="hover"
                      data-bs-placement="bottom"
                      title="Add Contact"
                    >
                      <button
                        type="button"
                        className="btn btn-soft-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#addContact-exampleModal"
                      >
                        <i className="bx bx-plus" />
                      </button>
                    </div>
                  </div> */}
                  {checkboxList.length > 0 && (
                    <button
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#assignmodel"
                      title="Assign"
                      style={{
                        padding: "0px",
                        border: "none",
                        background: "transparent",
                      }}
                      onClick={handleAssignChat}
                    >
                      <i
                        className="bx bxs-user-plus"
                        style={{ fontSize: "30px", color: "#4EAC6D" }}
                      />
                    </button>
                  )}

                  <div
                    className="modal fade"
                    id="assignmodel"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                    ref={modalRef}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="staticBackdropLabel"
                          >
                            Assign Agent/Manager
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          {currentUser.user_type!=="manager"&&<Select
                            placeholder="Select designation"
                            isLoading={isLoading}
                            onChange={handleDesignation}
                            options={designationOptions}
                          />}
                          {agentList.length > 0 && (
                            <div className="mt-4">
                              <Select
                                placeholder={currentUser.user_type==="manager"?"Select Agent":`Select ${selectedType.value}`}
                                onChange={handleAgent}
                                options={agentList}
                              />
                            </div>
                          )}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                           
                            onClick={handleAssign}
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Search />
              </div>
              <div className="mb-3 px-3">
                <button
                  className={`mx-1 py-1 btn-border-none rounded-pill ${
                    selectedBtn === "all" ? "active-btn" : ""
                  }`}
                  onClick={allBtn}
                >
                  All
                </button>
                <button
                  className={`mx-2 py-1 btn-border-none relative rounded-pill ${
                    selectedBtn === "unread" ? "active-btn" : ""
                  }`}
                  onClick={unreadBtn}
                >
                  Unread{" "}
                  {unReadChat.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-primary "
                      style={{ background: "#4eac6d" }}
                    >
                      {unReadChat.length}
                    </span>
                  )}
                </button>
                <button
                  className={`mx-2 btn-border-none rounded-pill ${
                    selectedBtn === "star" ? "active-btn" : ""
                  }`}
                  onClick={starBtn}
                >
                  Star
                </button>
              </div>
              <hr className="m-0 p-0"></hr>
              <div
                className="chat-room-list"
                data-simplebar
                ref={scrollContainerRef}
                onScroll={handleScroll}
              >
                {/* <h5 className="mb-2 px-4 mt-2 font-size-11 text-muted text-uppercase">
                  Recent Chat
                </h5> */}
                <Chats page={page} />
              </div>
            </div>
          </div>
          <div
            className="tab-pane"
            id="pills-bookmark"
            role="tabpanel"
            aria-labelledby="pills-bookmark-tab"
          >
            <Bookmark />
          </div>
          <div
            className="tab-pane"
            id="pills-contacts"
            role="tabpanel"
            aria-labelledby="pills-contacts-tab"
          >
            <h4 className="m-4">Unread Chats</h4>
            <hr></hr>
            {/* <UnreadChats /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
