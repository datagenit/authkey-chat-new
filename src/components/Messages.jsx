import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import { ChatState } from "../context/AllProviders";
import axios from "axios";
import { BASE_URL } from "../api/api";
const Messages = () => {
  const [loadingnewmsg, setLoadingnewmsg]= useState(false);
  const [previousScrollHeight, setPreviousScrollerHeight] = useState(0);
  const scrollContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { convpage, setConvPage, setScrolarinmiddle,selectedName, selectedMobileNumber} = ChatState();
  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    setMessages(data.conversion);

    if (data.conversion.length>30) {
      setTimeout(() => {
        scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight - previousScrollHeight;
      }, 100);
      
    }

    setTimeout(()=>{
      setLoadingnewmsg(false)
    },200)
    
  }, [data]);
 
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      scrollContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1000;

    if (isAtBottom === false) {
      setScrolarinmiddle(true);
    } else {
      setScrolarinmiddle(false);
    }
    const isAtTop = scrollTop === 0;

    if (isAtTop) {
      if(loadingnewmsg===false){
      let addmore = convpage + 30;
      updateConv(addmore);
      setConvPage(addmore);
      if (scrollContainerRef.current) {
        
        setPreviousScrollerHeight(scrollContainerRef.current.scrollHeight);
      }
      setLoadingnewmsg(true);
      }
    }
  };

  const updateConv = async (nextpage) => {
    try {
      const forconvdata = {
        token: currentUser.parent_token,
        user_id: currentUser.parent_id,
        method: "conv_list_new",
        brand_number: currentUser.brand_number,
        start: nextpage,
        from_mobile: selectedMobileNumber,
      };

      const res = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        forconvdata
      );

      if (res.data.success === true) {
        let updateddata = [...res.data.data];

        updateddata.sort((a, b) => new Date(a.created) - new Date(b.created));

        dispatch({
          type: "CHANGE_USER",
          payload: {
            mobile: selectedMobileNumber,
            conversation: [...updateddata, ...data.conversion],
            name: selectedName,
          },
        });
      }else{
        setLoadingnewmsg(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <ul
        className="list-unstyled chat-conversation-list new-conv"
        id="users-conversation"
        style={{ overflowY: "scroll" }}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <>
          <Message chatData={messages} chatLoading={loadingnewmsg}/>
        </>
      </ul>
    </>
  );
};

export default Messages;
