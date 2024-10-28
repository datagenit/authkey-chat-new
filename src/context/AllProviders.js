import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "../utils/Utils";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/api";

const AllContext = createContext();

const AllProvider = ({ children }) => {
  const [socket, setSocket]= useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [unReadChat, setUnReadChat] = useState([]);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState(null);
  const [chats, setChats] = useState([]);
  const [convpage, setConvPage] = useState(0);
  const [scrolarinmiddle, setScrolarinmiddle] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedBtn, setSelectedBtn] = useState("all");
  const [allChats, setAllChats] = useState([]);
  const [starChats, setStarChats] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const[isOldMsg, setIsOldMsg] = useState(false);
  const [sendTemplatePopUp, setSendTemplatePopUp] = useState(false);
  const [wpProfile, setWpProfile] = useState([]);
  const [callData, setCallData] = useState({
    visible:false,
    name:"",
    mobile:null,
    content:"",
    message_type:""
  })

  useEffect(() => {
    const userCookie = getCookie("user");
    const userInfo = userCookie ? JSON.parse(userCookie) : null;
    const currentuser=userInfo?.data;
    const socketconn = io(SOCKET_URL);
    if (currentuser.parent_id) {
      socketconn.emit("setup", currentuser);
    }
    setSocket(socketconn);
    return () => {
      socketconn.disconnect();
    };
  }, []);
  return (
    <AllContext.Provider
      value={{
        isViewerOpen,
        setIsViewerOpen,
        selectedImage,
        setSelectedImage,
        unReadChat,
        setUnReadChat,
        selectedMobileNumber,
        setSelectedMobileNumber,
        chats,
        setChats,
        convpage,
        setConvPage,
        scrolarinmiddle,
        setScrolarinmiddle,
        page,
        setPage,
        selectedBtn,
        setSelectedBtn,
        allChats,
        setAllChats,
        starChats,
        setStarChats,
        checkboxList, 
        setCheckboxList,
        chatsLoading, setChatsLoading,
        selectedName, setSelectedName,
        isOldMsg, setIsOldMsg,
        sendTemplatePopUp, setSendTemplatePopUp,
        wpProfile, setWpProfile,
        callData, setCallData,
        socket
      }}
    >
      {children}
    </AllContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(AllContext);
};

export default AllProvider;
