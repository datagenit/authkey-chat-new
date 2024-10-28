import React, { useContext, useEffect, useState } from "react";
import Chat from "../components/Chat";
import SideBar from "../components/Sidebar";
import Offline from "../components/Offline";
import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL2} from "../api/api";
import NewChatCall from "../components/ui-conponents/NewChatCall";
import { ChatState } from "../context/AllProviders";

const { v4: uuidv4 } = require("uuid");

const Home = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { currentUser } = useContext(AuthContext);
  const { setCallData, callData, socket } = ChatState();
  useEffect(() => {
    if (currentUser.parent_id) {
      setTimeout(() => {
        requestPermission();
      }, 2000);
    }
  }, [currentUser]);
 
 


 useEffect(() => {
  if (!currentUser.parent_id) return;
  const handleParallelChat = (data) => {
    if(currentUser.user_type==="agent"){
    setCallData({
      visible: true,
      name: data.name,
      mobile: data.mobile,
      message_type: data.message_type,
      content: data.message_content,
    });

    setTimeout(() => {
      setCallData(prevState => ({
        ...prevState,
        visible: false,
      }));
    }, 1000 * 60);
  }
  };
const handleClosePopup= (data)=>{
  if(data.accept===true){
    setCallData(prevState => ({
      ...prevState,
      visible: false,
    }));
  }
  
}
  socket.on("parallel chat", handleParallelChat);
  socket.on("chat accepted",handleClosePopup)
  return () => {
    socket.off("parallel chat", handleParallelChat);
    socket.off("chat accepted", handleClosePopup);
    
  };
}, [currentUser, socket]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const fcmtoken = await getToken(messaging, {
        vapidKey:
          "BEhln3rQmB-b2irv__7ZkHknDX1kSJENc2cHGEfGmRs4ctE4j5h1n3WucKxRXBBGnVWwuoa2F4-aZ2gtK-rBgNQ",
      });

      const deviceid = localStorage.getItem("deviceid");
      let devid;
      if (!deviceid) {
        const newdeviceid = uuidv4();
        localStorage.setItem("deviceid", newdeviceid);
        devid = newdeviceid;
      } else {
        devid = deviceid;
      }
      const sendData = {
        user_id: currentUser.parent_id,
        token: currentUser.parent_token,
        fcmtoken,
        method: "create",
        deviceid: devid,
        user_type: currentUser.user_type === "admin" ? "admin" : "agent",
        agent_id: currentUser.user_id,
      };
      await axios.post(`${BASE_URL2}/fcm_token`, sendData);
    } else if (permission === "denied") {
      // alert("You denied for the notification");
      // const sendData = {
      //   user_id: lStorage.user.userId,
      //   method: "delete",
      // };
      // await api.post("api/fcm_token.php", sendData);
    }
  };
  return (
    <div className="layout-wrapper d-lg-flex">
      {isOnline ? (
        <>
          <SideBar />
          <Chat />
          {callData.visible===true&&<NewChatCall/>}
        </>
      ) : (
        <Offline />
      )}
    </div>
  );
};

export default Home;
