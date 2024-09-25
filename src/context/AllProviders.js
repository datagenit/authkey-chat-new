import React, { createContext, useContext, useState } from "react";

const AllContext = createContext();

const AllProvider = ({ children }) => {
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
        wpProfile, setWpProfile
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
