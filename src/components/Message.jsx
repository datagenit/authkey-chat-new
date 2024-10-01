import React, { useEffect, useRef } from "react";
import "react-chat-elements/dist/main.css";
import { MessageBox } from "react-chat-elements";
import { ChatState } from "../context/AllProviders";
import docpng from "../assets/doc.PNG"

const Message = ({ chatData }) => {
  const messagesEndRef = useRef(null);

  const { setIsViewerOpen, setSelectedImage, scrolarinmiddle } = ChatState();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };


  useEffect(() => {
    if (scrolarinmiddle === false) {
      setTimeout(()=>{
        scrollToBottom();
      },200)
      
    }
   
  }, [chatData, scrolarinmiddle]);

  const locationData = (inputString) => {
    const parts = inputString.split(",");
    const latitude = parts[0];
    const longitude = parts[1];
    return {
      latitude: latitude,
      longitude: longitude,
    };
  };

  const openpdf = (data) => {
    const url = data;
    window.open(url, "_blank");
  };

  const openImageViewer = (imageUrl) => {
    setIsViewerOpen(true);
    setSelectedImage(imageUrl);
  };

  return (
    <>
   
     {scrolarinmiddle===true &&<button
        className="btn btn-success"
        style={{
          zIndex: "10",
          position: "fixed",
          bottom: "100px",
          right: "10px",
          padding: "0",
        }}
        onClick={scrollToBottom}
      >
        <i className="bx bx-chevron-down" style={{ fontSize: "3em" }} />
      </button>}
      {chatData.map((message, index) => (
        <li key={index}>
          {message.req_from === "USER" ? (
            <div style={{ marginLeft: "30px" }}>
              {message.message_type === "TEXT" && (
                <MessageBox
                  position={"left"}
                  type={"text"}
                  text={message.message_content}
                  date={message.created}
                  
                />
              )}
              {message.message_type === "IMAGE" && (
                <MessageBox
                  position={"left"}
                  type={"photo"}
                  text={message.image_caption}
                  date={message.created}
                  data={{
                    uri: message.file_url,
                  }}
                  onClick={() => openImageViewer(message.file_url)}
                />
              )}

              {message.message_type === "VIDEO" && (
                <MessageBox
                  position={"left"}
                  type={"video"}
                  text={message.image_caption}
                  date={message.created}
                  data={{
                    videoURL: message.file_url,
                    status: {
                      click: true,
                      loading: 0.5,
                      download: true,
                    },
                  }}
                />
              )}
              {message.message_type === "LOCATION" && (
                <MessageBox
                  position={"left"}
                  type={"location"}
                  date={message.created}
                  href={`https://www.google.com/maps/place/${message.message_content}`}
                  src="https://cdn.pixabay.com/photo/2016/03/22/04/23/map-1272165_1280.png"
                  data={locationData(message.message_content)}
                />
              )}

              {message.message_type === "DOCUMENT" && (
                <MessageBox
                  position={"left"}
                  type={"file"}
                  onClick={() => openpdf(message.file_url)}
                  text="Document"
                  data={{
                    uri: message.file_url,
                    status: {
                      click: false,
                      loading: 0,
                    },
                  }}
                  // className="doc-width"
                  date={message.created}
                />
              )}
              {message.message_type === "AUDIO" && (
                <MessageBox
                  position={"left"}
                  type={"audio"}
                  text={message.image_caption}
                  data={{
                    audioURL: message.file_url,
                  }}
                  date={message.created}
                />
              )}
            </div>
          ) : (
            <>
              {message.message_type === "TEXT" && (
                <MessageBox
                  position={"right"}
                  type={"text"}
                  text={message.message_content}
                  date={message.created}
                  status={message.status==="pending"?"sent":"received"}
                />
              )}
              {message.message_type === "IMAGE" && (
                <MessageBox
                  position={"right"}
                  type={"photo"}
                  text={message.image_caption}
                  data={{
                    uri: message.file_url,
                  }}
                  date={message.created}
                  onClick={() => openImageViewer(message.file_url)}
                />
              )}
              {message.message_type === "VIDEO" && (
                <MessageBox
                  position={"right"}
                  type={"video"}
                  text={message.image_caption}
                  data={{
                    videoURL: message.file_url,
                    status: {
                      click: true,
                      loading: 0.5,
                      download: true,
                    },
                  }}
                  date={message.created}
                />
              )}
              {message.message_type === "LOCATION" && (
                <MessageBox
                  position={"right"}
                  type={"location"}
                  href={`https://www.google.com/maps/place/${message.message_content}`}
                  src="https://cdn.pixabay.com/photo/2016/03/22/04/23/map-1272165_1280.png"
                  data={locationData(message.message_content)}
                  date={message.created}
                />
              )}

              {message.message_type === "document" && (
                <MessageBox
                  position={"right"}
                  type={"file"}
                  text="Document"
                  onClick={() => openpdf(message.file_url)}
                  data={{
                    uri: message.file_url,
                    status: {
                      click: false,
                      loading: 0,
                    },
                  }}
                  date={message.created}
                />
              )}
              {message.message_type === "AUDIO" && (
                <MessageBox
                  position={"right"}
                  type={"audio"}
                  text={message.image_caption}
                  status={message.status==="pending"?"sent":"received"}
                  data={{
                    audioURL: message.file_url,
                  }}
                  date={message.created}
                />
              )}
            </>
          )}
        </li>
      ))}
      {/* Empty div to scroll to */}
      <div ref={messagesEndRef} />
    </>
  );
};

export default Message;
