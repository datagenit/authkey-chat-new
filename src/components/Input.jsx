import React, { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, sendMessage, SOCKET_URL } from "../api/api";
import { ChatContext } from "../context/ChatContext";
import { ChatState } from "../context/AllProviders";
import SendTemplate from "./SendTemplate";
import io from "socket.io-client";
import { MdDelete } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";

import { v4 as uuidv4 } from "uuid";

const Input = (props) => {
  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState();
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState();
  const [fileType, setFileType] = useState();
  const [emojiStatus, setEmojiStatus] = useState(false);
  const [sendButton, setSendButton] = useState(false);
  const [recordingOn, setRecordingOn] = useState(false);
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
    errorType: "",
  });
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  
  const {
    isViewerOpen,
    setIsViewerOpen,
    selectedImage,
    setSelectedImage,
    isOldMsg,
    setIsOldMsg,
    sendTemplatePopUp,
    setSendTemplatePopUp,
    selectedMobileNumber,
  } = ChatState();
  useEffect(() => {
    setTimeout(() => {
      setError({
        error: false,
        errorMessage: "",
        errorType: "",
      });
    }, 5000);
  }, [error]);
  const togglePopup = () => {
    setShowPrev(!showPrev);
    setFileSize();
    setPreviewUrl();
    setFile(null);
    setPreviewUrl("");
    setFileType();
  };
  const handleSend = async () => {
    setEmojiStatus(false);
    const uid = uuidv4();
    if (file) {
      setButtonLoader(true);
      let url = await uploadWhatsAppMedia();
      const msg = {};
      const { data } = await sendMessage({
        agent_id:currentUser.user_type==="admin"?"1":currentUser.user_id,
        agent_name:currentUser.user_type==="admin"?"admin":currentUser.name,
        manager_id:currentUser.user_type==="admin"?"1":currentUser.manager,
        manager_name:currentUser.user_type==="admin"?"admin":currentUser.manager_name,
        team_id:currentUser.user_type==="admin"?"1":currentUser.team,
        team_name:currentUser.user_type==="admin"?"admin":currentUser.team_name,
        token: currentUser.parent_token,
        user_id: currentUser.parent_id,
        method: "media_reply",
        attachment_url: url,
        caption: caption,
        message_type: fileType,
        brand_number: currentUser.brand_number,
        mobile: props.selectedMobile,
        content: text,
      
      });

      if (data.success === true) {
        let newdata = [...props.convData.conversion, data.response];

        dispatch({
          type: "CHANGE_USER",
          payload: {
            mobile: props.selectedMobile,
            conversation: newdata,
            name: props.convData.selectedName,
          },
        });
        setPreviewUrl("");
        setFileSize();
        setFileType(undefined);
        setShowPrev(false);
        setFile(null);
        setButtonLoader(false);
        setText("");
        setCaption("");
      } else {
        setShowPrev(false);
        setPreviewUrl("");
        setFileSize();
        setFile(null);
        setFileType(undefined);
        setButtonLoader(false);
        setText("");
        setCaption("");
        setError({
          error: true,
          errorMessage: data.message,
          errorType: "alert-danger",
        });
      }
    } else {
      const date = new Date();
      const msg = {
        agent_id:currentUser.user_type==="admin"?"1":currentUser.user_id,
        agent_name:currentUser.user_type==="admin"?"admin":currentUser.name,
        manager_id:currentUser.user_type==="admin"?"1":currentUser.manager,
        manager_name:currentUser.user_type==="admin"?"admin":currentUser.manager_name,
        team_id:currentUser.user_type==="admin"?"1":currentUser.team,
        team_name:currentUser.user_type==="admin"?"admin":currentUser.team_name,
        track_id: uid,
        mobile: props.selectedMobile,
        brand_number: currentUser.brand_number,
        message_type: "TEXT",
        req_from: "AGENT_REPLY",
        file_url: "",
        message_content: text,
        image_caption: "",
        resp_url: "",
        status: "pending",
        created: date,
      };

      let newdata = [...props.convData.conversion, msg];

      dispatch({
        type: "CHANGE_USER",
        payload: {
          mobile: props.selectedMobile,
          conversation: newdata,
          name: props.convData.selectedName,
        },
      });

      let data = {
        agent_id:currentUser.user_type==="admin"?"1":currentUser.user_id,
        agent_name:currentUser.user_type==="admin"?"admin":currentUser.name,
        manager_id:currentUser.user_type==="admin"?"1":currentUser.manager,
        manager_name:currentUser.user_type==="admin"?"admin":currentUser.manager_name,
        team_id:currentUser.user_type==="admin"?"1":currentUser.team,
        team_name:currentUser.user_type==="admin"?"admin":currentUser.team_name,
        track_id: uid,
        token: currentUser.parent_token,
        user_id: currentUser.parent_id,
        method: "reply",
        brand_number: currentUser.brand_number,
        mobile: props.selectedMobile,
        content: text,
      };
      setText("");
      sendMessage(data).then((res) => {
        if (res.data.success === true) {
          const updatedChat = newdata.map((chatdata) => {
            if (chatdata.track_id === res.data.track_id) {
              return { ...chatdata, status: "Submitted" };
            }
            return chatdata;
          });
         

          dispatch({
            type: "CHANGE_USER",
            payload: {
              mobile: props.selectedMobile,
              conversation: updatedChat,
              name: props.convData.selectedName,
            },
          });
          // setText("");
        } else {
          if (
            res.data.message ===
            "You need to send fresh reply coz chat 24 hour old"
          ) {
            setIsOldMsg(true);
          }

          setError({
            error: true,
            errorMessage: res.data.message,
            errorType: "alert-danger",
          });
        }
      });
    }
  };
  const fileHandler = (e) => {
    setShowPrev(!showPrev);
    const file = e.target.files[0];
    if (e.target.files[0].type.startsWith("image")) {
      setFileType("image");
    } else if (e.target.files[0].type.startsWith("video")) {
      setFileType("video");
    } else {
      setFileType("file");
    }

    document.body.style.overflow = !showPrev ? "hidden" : "auto";

    if (file) {
      const fileSizeInBytes = file.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      setFileSize(fileSizeInMB);
      if (file && file.type.startsWith("video/")) {
        const objectURL = URL.createObjectURL(file);
        setPreviewUrl(objectURL);
        setFile(file);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
    } else {
      setFile(null);
      setPreviewUrl("");
    }
  };

  const uploadWhatsAppMedia = async () => {
    try {
      var data = await new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("amdfile", file);
        data.append("doc_name", "test MK");
        data.append("doc_type", fileType);
        data.append("user_id", currentUser.parent_id);
        data.append("token", currentUser.parent_token);
        data.append("method", "create");
        let url = "";
        fetch(`${BASE_URL}/uploadFileWhatsapp.php`, {
          method: "POST",
          body: data,
        }).then((result) => {
          result.json().then((resp) => {
            resolve(resp.url);
          });
        });
      });
      // setFile(undefined);
      return data;
    } catch (error) {
      console.log("error");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      // event.preventDefault();
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const ImageViewer = ({ imageUrl, onClose }) => {
    return (
      <div className="popup">
        <div className="popupInner">
          <img src={imageUrl} alt="Preview" className="popup-img" />
          <button className="cancelButton" onClick={onClose}>
            x
          </button>
        </div>
      </div>
    );
  };
  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage("");
  };
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const newHeight = Math.min(textareaRef.current.scrollHeight, 90);
        textareaRef.current.style.height = `${newHeight}px`;
        textareaRef.current.style.overflowY =
          textareaRef.current.scrollHeight > 90 ? "auto" : "hidden";
      }
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener("input", handleResize);

    return () => {
      textarea?.removeEventListener("input", handleResize);
    };
  }, []);
  const handleTextarea = (e) => {
    setEmojiStatus(false);
    setText(e.target.value);
    if(e.target.value===""){
      setSendButton(false);
    }else{
      setSendButton(true);
    }
    
  };
  useEffect(() => {
    const socket = io(SOCKET_URL);

    if (currentUser.parent_id) {
      socket.emit("setup", currentUser);
    }

    const timer1 = setTimeout(() => {
      if (text.trim()) {
        socket.emit("chat on", currentUser);
      }
    }, 1000);

    const timer = setTimeout(() => {
      if (text.trim()) {
        socket.emit("chat off", currentUser);
      }
    }, 2 * 60 * 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer);
      socket.disconnect();
    };
  }, [text]);

  // useEffect(() => {
  //   let socket = io(SOCKET_URL);
  //   if (currentUser.parent_id) {
  //     socket.emit("setup", currentUser);
  //   }
  //   const timer1 = setTimeout(() => {
  //     if (text.trim()) {
  //       socket.emit("chat on", currentUser);
  //     }
  //   }, 1000);
  //   const timer = setTimeout(() => {
  //     if (text.trim()) {
  //       socket.emit("chat off", currentUser);
  //     }
  //   }, 2 * 60 * 1000);

  //   return () => {
  //     clearTimeout(timer, timer1);
  //     socket.disconnect();
  //   };
  // }, [text]);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (pickerRef.current && !pickerRef.current.contains(event.target)) {
  //       setEmojiStatus(false);

  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const toggleEmoji = () => {
    const element = document.getElementById("chatinputmorecollapse");
    if (element) {
      element.classList.remove("show");
    }

    setEmojiStatus(!emojiStatus);
  };
  const emojiselect = (emojidata) => {
    const { current } = textareaRef;
    const { selectionStart, selectionEnd } = current;
    const newValue =
      text.substring(0, selectionStart) +
      emojidata.emoji +
      text.substring(selectionEnd);
    setText(newValue);
    current.focus();
    current.setSelectionRange(
      selectionStart + emojidata.emoji.length,
      selectionStart + emojidata.emoji.length
    );
  };
  // console.log(currentUser);
const handleRecordingOn = ()=>{
  setRecordingOn(true);
  setSendButton(true);
}
  return (
    <div style={{ position: "absolute", bottom: "0px", width: "100%" }}>
      <div className="emojiMobilecss" ref={pickerRef}>
        <EmojiPicker
          onEmojiClick={emojiselect}
          open={emojiStatus}
          height={430}
          autoFocusSearch={false}
        />
      </div>

      <div>
        {isViewerOpen && (
          <ImageViewer imageUrl={selectedImage} onClose={closeImageViewer} />
        )}
        {showPrev && (
          <div className="popup">
            <div className="popupInner">
              <button className="cancelButton" onClick={togglePopup}>
                x
              </button>
              {showPrev && (
                <div>
                  <h4>Preview:</h4>
                  <div className="popupcontent">
                    {file.type.startsWith("video/") ? (
                      <video controls width="500">
                        <source src={previewUrl} type={file.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : file.type === "application/pdf" ? (
                      <iframe
                        title="pdf"
                        src={previewUrl}
                        style={{ width: 200, height: 300 }}
                      ></iframe>
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: "50%", maxHeight: "50%" }}
                      />
                    )}
                  </div>
                  {fileSize > 10.0 && (
                    <div>
                      <small className="text-danger">
                        *File size should be smaller than 10MB
                      </small>
                    </div>
                  )}
                  <div className="d-flex justify-content-center">
                    <textarea
                      type="text"
                      value={caption}
                      className="form-control mt-4"
                      placeholder="Enter caption (optional)"
                      onChange={(e) => setCaption(e.target.value)}
                    ></textarea>

                    <div className="mt-4 ms-2">
                      {buttonLoader === false ? (
                        <button
                          onClick={fileSize > 10.0 ? null : handleSend}
                          className="btn btn-primary btn-lg chat-send waves-effect waves-light"
                          data-bs-toggle="collapse"
                          data-bs-target=".chat-input-collapse1.show"
                        >
                          <i
                            className="bx bxs-send align-middle"
                            id="submit-btn"
                          />
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled
                        >
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="sr-only">Sending...</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-section p-3 p-lg-4">
        {isOldMsg ? (
          <div className="d-flex justify-content-center align-items-center">
            <h6 style={{ color: "red" }} className="me-4">
              This chat is older than 24h, Send template message
            </h6>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setSendTemplatePopUp(true)}
            >
              select template
            </button>
          </div>
        ) : (
          <div>
            {error.error && (
              <div className={`text-danger p-1 mb-2 ${error.errorType}`}>
                {error.errorMessage}
              </div>
            )}

            <div className="row g-0 align-items-center">
              <div className="file_Upload" />

             {recordingOn===false?<><div className="col-auto">
                <div className="chat-input-links me-md-2">
                  <div
                    className="links-list-item"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    data-bs-placement="top"
                    title="file"
                  >
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none btn-lg waves-effect"
                      data-bs-toggle="collapse"
                      data-bs-target="#chatinputmorecollapse"
                      aria-expanded="false"
                      aria-controls="chatinputmorecollapse"
                      onClick={() => setEmojiStatus(false)}
                    >
                      <i className="bx bx-dots-horizontal-rounded align-middle" />
                    </button>
                  </div>
                  <div
                    className="links-list-item"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    data-bs-placement="top"
                    title="Emoji"
                  >
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none btn-lg waves-effect emoji-btn"
                      id="emoji-btn"
                      onClick={toggleEmoji}
                    >
                      {emojiStatus === false ? (
                        <i className="bx bx-smile align-middle" />
                      ) : (
                        <i className="bx bx-x align-middle" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="position-relative">
                  <div className="chat-input-feedback">
                    Please Enter a Message
                  </div>
                  {/* <input
                autoComplete="off"
                type="text"
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
                value={text}
                className="form-control form-control-lg chat-input"
                autoFocus
                id="chat-input"
                placeholder="Type your message..."
              /> */}

                  <textarea
                    ref={textareaRef}
                    onChange={handleTextarea}
                    onKeyPress={(e) => handleKeyPress(e)}
                    className="form-control form-control-lg chat-input"
                    rows="1"
                    value={text}
                    id="chat-input"
                    placeholder="Type your message..."
                  ></textarea>
                </div>
              </div>
              <div className="col-auto">
                <div className="chat-input-links ms-2 gap-md-1">
                  <div className="links-list-item">
                    {sendButton?<button
                      onClick={handleSend}
                      className="btn btn-primary btn-lg chat-send waves-effect waves-light"
                      data-bs-toggle="collapse"
                      data-bs-target=".chat-input-collapse1.show"
                      title="Send message"
                    >
                      <i className="bx bxs-send align-middle" id="submit-btn" />
                    </button>:
                    <button
                      onClick={handleRecordingOn}
                      className="btn btn-primary btn-lg chat-send waves-effect waves-light"
                      data-bs-toggle="collapse"
                      data-bs-target=".chat-input-collapse1.show"
                      title="Send message"
                    >
                      <i className='bx bxs-microphone align-middle' id="submit-btn"/>
                     
                    </button>}
                  </div>
                </div>
              </div>
            </div>

            {/* Attachment Box */}
            <div
              className={`chat-input-collapse chat-input-collapse1 collapse`}
              id="chatinputmorecollapse"
            >
              <div className="card mb-0">
                <div className="card-body py-3">
                  <div className="swiper chatinput-links">
                    <div className="swiper-wrapper d-flex justify-content-between">
                      <div className="swiper-slide">
                        <div className="text-center px-2 position-relative">
                          <div>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              id="attached-file"
                              onChange={fileHandler}
                            />
                            <label
                              htmlFor="attached-file"
                              className="avatar-sm mx-auto stretched-link"
                            >
                              <span className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                                <i className="bx bx-paperclip" />
                              </span>
                            </label>
                          </div>
                          <h5 className="font-size-11 text-uppercase mt-3 mb-0 text-body text-truncate">
                            Attached
                          </h5>
                        </div>
                      </div>
                      {/* <div className="swiper-slide">
                    <div className="text-center px-2">
                      <div className="avatar-sm mx-auto">
                        <div className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                          <i className="bx bxs-camera" />
                        </div>
                      </div>
                      <h5 className="font-size-11 text-uppercase text-truncate mt-3 mb-0">
                        <a href="#" className="text-body stretched-link">
                          Camera
                        </a>
                      </h5>
                    </div>
                  </div> */}
                      <div className="swiper-slide">
                        <div className="text-center px-2 position-relative">
                          <div>
                            <input
                              id="galleryfile-input"
                              type="file"
                              className="d-none"
                              onChange={fileHandler}
                            />
                            <label
                              htmlFor="galleryfile-input"
                              className="avatar-sm mx-auto stretched-link"
                            >
                              <span className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                                <i className="bx bx-images" />
                              </span>
                            </label>
                          </div>
                          <h5 className="font-size-11 text-uppercase text-truncate mt-3 mb-0">
                            IMAGE
                          </h5>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="text-center px-2">
                          <div>
                            <input
                              id="audiofile-input"
                              type="file"
                              className="d-none"
                              onChange={fileHandler}
                            />
                            <label
                              htmlFor="audiofile-input"
                              className="avatar-sm mx-auto stretched-link"
                            >
                              <span className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                                <i className="bx bx-video" />
                              </span>
                            </label>
                          </div>
                          <h5 className="font-size-11 text-uppercase text-truncate mt-3 mb-0">
                            VIDEO
                          </h5>
                        </div>
                      </div>
                      {/* <div className="swiper-slide">
                    <div className="text-center px-2">
                      <div className="avatar-sm mx-auto">
                        <div className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                          <i className="bx bx-current-location" />
                        </div>
                      </div>
                      <h5 className="font-size-11 text-uppercase text-truncate mt-3 mb-0">
                        <a href="#" className="text-body stretched-link">
                          Location
                        </a>
                      </h5>
                    </div>
                  </div> */}
                      {/* <div className="swiper-slide">
                    <div className="text-center px-2">
                      <div className="avatar-sm mx-auto">
                        <div className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                          <i className="bx bxs-user-circle" />
                        </div>
                      </div>
                      <h5 className="font-size-11 text-uppercase text-truncate mt-3 mb-0">
                        <a
                          href="#"
                          className="text-body stretched-link"
                          data-bs-toggle="modal"
                          data-bs-target=".contactModal"
                        >
                          Contacts
                        </a>
                      </h5>
                    </div>
                  </div> */}
                      {/* <div className="swiper-slide d-block d-sm-none">
                    <div className="text-center px-2">
                      <div className="avatar-sm mx-auto">
                        <div className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                          <i className="bx bx-microphone" />
                        </div>
                      </div>
                      <h5 className="font-size-11 text-uppercase text-truncate mt-3 mb-0">
                        <a href="#" className="text-body stretched-link">
                          Audio
                        </a>
                      </h5>
                    </div>
                  </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Box */}
      {/* <div className="replyCard">
        <div className="card mb-0">
          <div className="card-body py-3">
            <div className="replymessage-block mb-0 d-flex align-items-start">
              <div className="flex-grow-1">
                <h5 className="conversation-name" />
                <p className="mb-0" />
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  id="close_toggle"
                  className="btn btn-sm btn-link mt-n2 me-n3 font-size-18"
                >
                  <i className="bx bx-x align-middle" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {sendTemplatePopUp && (
        <div className="popup-agent">
          <div className="assign-popup-content-agent w-50">
            <div style={{ float: "right", cursor: "pointer" }}>
              <i
                className="bx bx-x float-right" style={{fontSize: "26px"}}
                onClick={() => setSendTemplatePopUp(false)}
              ></i>
            </div>
            <div>
              <SendTemplate mobile={selectedMobileNumber} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Input;