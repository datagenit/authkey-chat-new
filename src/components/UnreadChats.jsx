import dayjs from "dayjs";
import React, { useContext } from "react";
import { ChatState } from "../context/AllProviders";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, sendMessage } from "../api/api";
import axios from "axios";

const UnreadChats = () => {
    const { unReadChat, selectedMobileNumber, setSelectedMobileNumber, chats, setChats,setUnReadChat } = ChatState();
    const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  


    const handleSelect = async (item) => {
        setSelectedMobileNumber(item.mobile);
    
        try {
          const forconvdata = {
            token: currentUser.parent_token,
            user_id: currentUser.parent_id,
            method: "conv_list",
            brand_number: currentUser.brand_number,
            from_mobile: item.mobile,
          };
    
          const { data } = await axios.post(
            `${BASE_URL}/netcore_conversation.php`,
            forconvdata
          );
    
          if (data.success === true) {

            const index = chats.findIndex(
                (selecteditem) => selecteditem.mobile === item.mobile
              );
      
              if (index !== -1) {
                const updatedItems = [...chats];
                updatedItems[index] = {
                  ...updatedItems[index],
                 
                  read_status: 1,
                 
                };
      
                updatedItems.sort(
                  (a, b) => new Date(b.created) - new Date(a.created)
                );
      
                setChats(updatedItems);
      
               
              }
              setUnReadChat(prevItems => prevItems.filter((items, index) => items !== item));
      



            dispatch({
              type: "CHANGE_USER",
              payload: {
                mobile: item.mobile,
                conversation: data.data,
                name: item.name,
              },
            });
          }
    
          //for read left menu
          const unreadData = {
            token: currentUser.parent_token,
            user_id: currentUser.parent_id,
            method: "conv_list",
            brand_number: currentUser.brand_number,
            mobile: item.mobile,
            content_json: item,
          };
    
          sendMessage(unreadData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  return <div>

   
    <div className="chat-message-list">
      <ul
        role="button"
        className="list-unstyled po mb-3 mt-4  chat-list chat-user-list"
        id="favourite-users"
      >
        {unReadChat.length > 0 ? (
          <>
            {unReadChat.map((item, i) => (
              <li
                key={i}
                className={selectedMobileNumber === item.mobile ? "active" : ""}
              >
                <div
                  onClick={() => handleSelect(item)}
                  className="d-flex align-items-center"
                >
                  <div className="chat-user-img flex-shrink-0 me-2">
                    <div className="avatar-group">
                      <div className="avatar-group-item">
                        <div className="avatar-xs">
                          <img
                            src="/images/whatsapp.png"
                            className="rounded-circle avatar-xs"
                            alt=""
                          />
                        </div>
                      </div>
                      {item.read_status === 0 && (
                        <div className="avatar-group-item">
                          <div className="avatar-xs">
                            <div className="avatar-title rounded-circle bg-light text-primary">
                              1+
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-truncate mb-0">
                      {item.name ? item.name : item.mobile}
                    </p>
                    <div className="text-muted font-size-12 text-truncate">
                      {item.content}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ms-3">
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <h5 className="mb-0 font-size-12 text-muted">
                          {dayjs(item.date).format("h:mm A")}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
           
          </>
        ) : (
          <>
            <h5 className="d-flex justify-content-center">No Unread Chats</h5>
          </>
        )}
      </ul>
    </div>





  </div>;
};

export default UnreadChats;
