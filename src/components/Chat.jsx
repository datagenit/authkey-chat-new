import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import Welcome from "./Welcome";
import { ChatContext } from "../context/ChatContext";
import { ChatState } from "../context/AllProviders";
import { AuthContext } from "../context/AuthContext";
const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { setSelectedMobileNumber, selectedMobileNumber } = ChatState();

  const handleBack = () => {
    setSelectedMobileNumber(null);
  };

  const isSpecialChar = (str) => /^[^\w\s]/.test(str);
  const maskNo = (num) => {
    const lastFourDigits = num.slice(-4);
    const maskedNumber = lastFourDigits.padStart(num.length, "X");
    return maskedNumber;
  };
  return (
    <>
      {data?.selectedMobile !== null ? (
        <div
          className={`user-chat overflow-hidden w-100 ${
            selectedMobileNumber !== null && "user-chat-show"
          }`}
        >
          <div className="user-chat-overlay" />
          <div className="chat-content d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              <div id="users-chat" className="position-relative">
                <div className="p-3 p-lg-2 user-chat-topbar">
                  <div className="row align-items-center">
                    <div className="col-sm-10 col-10">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 d-block d-lg-none me-3">
                          <button
                            className="user-chat-remove font-size-18 p-1"
                            style={{ border: "none" }}
                            onClick={handleBack}
                          >
                            <i className="bx bx-chevron-left align-middle" />
                          </button>
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-3 ms-0">
                              <svg
                                viewBox="0 0 212 212"
                                height="212"
                                width="212"
                                preserveAspectRatio="xMidYMid meet"
                                className="xh8yej3 x5yr21d"
                                version="1.1"
                                x="0px"
                                y="0px"
                                enableBackground="new 0 0 212 212"
                              >
                                <title>default-user</title>
                                <path
                                  fill="#DFE5E7"
                                  className="background"
                                  d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"
                                ></path>
                                <g>
                                  <path
                                    fill="#FFFFFF"
                                    className="primary"
                                    d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"
                                  ></path>
                                  <path
                                    fill="#FFFFFF"
                                    className="primary"
                                    d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"
                                  ></path>
                                </g>
                              </svg>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h6
                                className="text-truncate mb-0 font-size-16"
                                title={
                                  isSpecialChar(data.selectedName)
                                    ? data.selectedMobile
                                    : `${data.selectedName}`
                                }
                              >
                                {/* <a href="#" className="user-profile-show text-capitalize text-reset"> */}
                                {data.selectedName
                                  ? isSpecialChar(data.selectedName)
                                    ? currentUser.user_type === "admin"
                                      ? data.selectedMobile
                                      : maskNo(data.selectedMobile)
                                    : `${data.selectedName}`
                                  : data.selectedMobile}
                                {/* </a> */}
                              </h6>
                              {/* <p className="text-truncate text-muted mb-0">
                                <small>Online</small>
                              </p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2 col-2">
                      <ul className="list-inline user-chat-nav text-end mb-0">
                        <li className="list-inline-item">
                          <div className="dropdown">
                            <button
                              className="btn nav-btn dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i className="bx bx-search" />
                            </button>
                            <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
                              <div className="search-box p-2">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search.."
                                  id="searchChatMessage"
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  className="chat-conversation p-3 p-lg-4 positin-relative simplebar-scrollable-y"
                  id="chat-conversation"
                  data-simplebar
                >
                  <div className="simplebar-mask">
                    <div className="simplebar-content-wrapper ">
                      <div className="simplebar-content">
                        <Messages />
                      </div>
                    </div>
                  </div>
                </div>
                <Input selectedMobile={data.selectedMobile} convData={data} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Welcome />
      )}
    </>
  );
};

export default Chat;
