import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import dayjs from "dayjs";
import axios from "axios";
import { BASE_URL, SOCKET_URL } from "../api/api";
import { ChatState } from "../context/AllProviders";
import io from "socket.io-client";
import notification from "../assets/notification.mp3";
import { toast } from "react-toastify";

const Chats = () => {
  const todayDate = new Date();
  const formateddate = dayjs(todayDate).format("YYYY-MM-DD");
  const [selectedChatDetails, setSelectedChatDetails] = useState("");
  const [updateNameInput, setUpdateNameInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leftMenuOption, setLeftMenuOption] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);
  const {
    setUnReadChat,
    unReadChat,
    setSelectedMobileNumber,
    selectedMobileNumber,
    chats,
    setChats,
    setConvPage,
    allChats,
    selectedBtn,
    setStarChats,
    checkboxList,
    setCheckboxList,
    chatsLoading,
    setSelectedName,
    setIsOldMsg,
  } = ChatState();
  // console.log(typeof(currentUser.user_id));

  const scrollRef = useRef(null);
  const isSpecialChar = (str) => /^[^\w\s]/.test(str);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chats]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    if (currentUser.parent_id) {
      socket.emit("setup", currentUser);
    }
    const handleNewConversation = (newmsg) => {
      const playNotificationSound = () => {
        const sound = new Audio(notification);
        sound.play();
      };

      if (currentUser.user_type === "admin") {
        if (
          selectedMobileNumber === newmsg.mobile &&
          newmsg.brand_number === currentUser.brand_number
        ) {
          const updatedChat = [...data.conversion, newmsg];

          dispatch({
            type: "CHANGE_USER",
            payload: {
              mobile: selectedMobileNumber,
              conversation: updatedChat,
            },
          });

          playNotificationSound();

          axios.post(`${BASE_URL}/netcore_conversation.php`, {
            token: currentUser.token,
            user_id: currentUser.userId,
            method: "add_unread",
            brand_number: currentUser.brand_number,
            from_mobile: newmsg.mobile,
            key_value: "1",
          });
        }

        if (newmsg.brand_number === currentUser.brand_number) {
          const newChat = {
            content: newmsg.message_content,
            created: newmsg.created,
            message_type: newmsg.message_type,
            mobile: newmsg.mobile,
            name: newmsg.name,
            read_status: 0,
            stared: newmsg.stared,
          };

          const filterUnreadChat = unReadChat.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filterUnreadChat.length < 1) {
            setUnReadChat((prevChats) => [newChat, ...prevChats]);
          }

          playNotificationSound();

          const filteredList = chats.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filteredList.length > 0) {
            const index = chats.findIndex(
              (item) => item.mobile === newmsg.mobile
            );

            if (index !== -1) {
              const updatedItems = [...chats];
              updatedItems[index] = {
                ...updatedItems[index],
                created: newmsg.created,
                read_status: 0,
                content: newmsg.message_content,
              };

              updatedItems.sort(
                (a, b) => new Date(b.created) - new Date(a.created)
              );

              setChats(updatedItems);

              playNotificationSound();
            }
          } else {
            const updatedObj = { ...newChat, stared_by_admin: 0 };
            setChats((prevChats) => [updatedObj, ...prevChats]);
          }
        }
      }
      if (
        currentUser.user_type === "team" &&
        currentUser.user_id === newmsg.team_id
      ) {
        if (
          selectedMobileNumber === newmsg.mobile &&
          newmsg.brand_number === currentUser.brand_number
        ) {
          const updatedChat = [...data.conversion, newmsg];

          dispatch({
            type: "CHANGE_USER",
            payload: {
              mobile: selectedMobileNumber,
              conversation: updatedChat,
            },
          });

          playNotificationSound();

          axios.post(`${BASE_URL}/netcore_conversation.php`, {
            token: currentUser.token,
            user_id: currentUser.userId,
            method: "add_unread",
            brand_number: currentUser.brand_number,
            from_mobile: newmsg.mobile,
            key_value: "1",
          });
        }

        if (newmsg.brand_number === currentUser.brand_number) {
          const newChat = {
            content: newmsg.message_content,
            created: newmsg.created,
            message_type: newmsg.message_type,
            mobile: newmsg.mobile,
            name: newmsg.name,
            read_status: 0,
            stared: newmsg.stared,
          };

          const filterUnreadChat = unReadChat.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filterUnreadChat.length < 1) {
            setUnReadChat((prevChats) => [newChat, ...prevChats]);
          }

          playNotificationSound();

          const filteredList = chats.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filteredList.length > 0) {
            const index = chats.findIndex(
              (item) => item.mobile === newmsg.mobile
            );

            if (index !== -1) {
              const updatedItems = [...chats];
              updatedItems[index] = {
                ...updatedItems[index],
                created: newmsg.created,
                read_status: 0,
                content: newmsg.message_content,
              };

              updatedItems.sort(
                (a, b) => new Date(b.created) - new Date(a.created)
              );

              setChats(updatedItems);

              playNotificationSound();
            }
          } else {
            const newObj = { ...newChat, stared_by: "0" };
            setChats((prevChats) => [newObj, ...prevChats]);
          }
        }
      }
      if (
        currentUser.user_type === "manager" &&
        currentUser.user_id === newmsg.manager_id
      ) {
        if (
          selectedMobileNumber === newmsg.mobile &&
          newmsg.brand_number === currentUser.brand_number
        ) {
          const updatedChat = [...data.conversion, newmsg];

          dispatch({
            type: "CHANGE_USER",
            payload: {
              mobile: selectedMobileNumber,
              conversation: updatedChat,
            },
          });

          playNotificationSound();

          axios.post(`${BASE_URL}/netcore_conversation.php`, {
            token: currentUser.token,
            user_id: currentUser.userId,
            method: "add_unread",
            brand_number: currentUser.brand_number,
            from_mobile: newmsg.mobile,
            key_value: "1",
          });
        }

        if (newmsg.brand_number === currentUser.brand_number) {
          const newChat = {
            content: newmsg.message_content,
            created: newmsg.created,
            message_type: newmsg.message_type,
            mobile: newmsg.mobile,
            name: newmsg.name,
            read_status: 0,
            stared: newmsg.stared,
          };

          const filterUnreadChat = unReadChat.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filterUnreadChat.length < 1) {
            setUnReadChat((prevChats) => [newChat, ...prevChats]);
          }

          playNotificationSound();

          const filteredList = chats.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filteredList.length > 0) {
            const index = chats.findIndex(
              (item) => item.mobile === newmsg.mobile
            );

            if (index !== -1) {
              const updatedItems = [...chats];
              updatedItems[index] = {
                ...updatedItems[index],
                created: newmsg.created,
                read_status: 0,
                content: newmsg.message_content,
              };

              updatedItems.sort(
                (a, b) => new Date(b.created) - new Date(a.created)
              );

              setChats(updatedItems);

              playNotificationSound();
            }
          } else {
            const newObj = { ...newChat, stared_by: "0" };
            setChats((prevChats) => [newObj, ...prevChats]);
          }
        }
      }
      if (
        currentUser.user_type === "agent" &&
        currentUser.user_id === newmsg.agent_id
      ) {
        if (
          selectedMobileNumber === newmsg.mobile &&
          newmsg.brand_number === currentUser.brand_number
        ) {
          const updatedChat = [...data.conversion, newmsg];

          dispatch({
            type: "CHANGE_USER",
            payload: {
              mobile: selectedMobileNumber,
              conversation: updatedChat,
            },
          });

          playNotificationSound();

          axios.post(`${BASE_URL}/netcore_conversation.php`, {
            token: currentUser.token,
            user_id: currentUser.userId,
            method: "add_unread",
            brand_number: currentUser.brand_number,
            from_mobile: newmsg.mobile,
            key_value: "1",
          });
        }

        if (newmsg.brand_number === currentUser.brand_number) {
          const newChat = {
            content: newmsg.message_content,
            created: newmsg.created,
            message_type: newmsg.message_type,
            mobile: newmsg.mobile,
            name: newmsg.name,
            read_status: 0,
            stared: newmsg.stared,
          };

          const filterUnreadChat = unReadChat.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filterUnreadChat.length < 1) {
            setUnReadChat((prevChats) => [newChat, ...prevChats]);
          }

          playNotificationSound();

          const filteredList = chats.filter(
            (item) => item.mobile === newmsg.mobile
          );
          if (filteredList.length > 0) {
            const index = chats.findIndex(
              (item) => item.mobile === newmsg.mobile
            );

            if (index !== -1) {
              const updatedItems = [...chats];
              updatedItems[index] = {
                ...updatedItems[index],
                created: newmsg.created,
                read_status: 0,
                content: newmsg.message_content,
              };

              updatedItems.sort(
                (a, b) => new Date(b.created) - new Date(a.created)
              );

              setChats(updatedItems);

              playNotificationSound();
            }
          } else {
            const newObj = { ...newChat, stared_by: "0" };
            setChats((prevChats) => [newObj, ...prevChats]);
          }
        }
      }
    };

    socket.on("new conv", handleNewConversation);

    return () => {
      socket.off("new conv", handleNewConversation);
      socket.disconnect();
    };
  }, [currentUser, selectedMobileNumber, chats, dispatch, unReadChat]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (currentUser.parent_id) {
        let forunreadmsg = {
          token: currentUser.parent_token,
          user_id: currentUser.parent_id,
          method: "get_unread_list",
          brand_number: currentUser.brand_number,
          user_type: currentUser.user_type,
          agent_id:
            currentUser.user_type === "admin" ? "" : currentUser.user_id,
        };

        try {
          const { data } = await axios.post(
            `${BASE_URL}/netcore_conversation.php`,
            forunreadmsg
          );

          if (data.success === true) {
            setUnReadChat(data.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUnreadMessages();
  }, [currentUser, setUnReadChat]);
  // useEffect(() => {
  //   let socket = io.connect(ENDPOINT);

  //   socket.on("read", (readdata) => {
  //     if (readdata.brand_number) {
  //       let updatedunreadchat = unReadChat.filter(
  //         (items, index) => items.read_status === 0
  //       );

  //       setUnReadChat(updatedunreadchat);

  //       const index = chats.findIndex(
  //         (selecteditem) => selecteditem.mobile === readdata.mobile
  //       );

  //       const unreadindex = updatedunreadchat.findIndex(
  //         (selecteditem) => selecteditem.mobile === readdata.mobile
  //       );

  //       if (unreadindex > -1) {
  //         const updatedUnreadItems = [...updatedunreadchat];
  //         updatedUnreadItems[index] = {
  //           ...updatedUnreadItems[index],

  //           read_status: 1,
  //         };

  //         updatedUnreadItems.sort(
  //           (a, b) => new Date(b.created) - new Date(a.created)
  //         );

  //         setUnReadChat(updatedUnreadItems);
  //       }

  //       if (index !== -1) {
  //         const updatedItems = [...chats];
  //         updatedItems[index] = {
  //           ...updatedItems[index],

  //           read_status: 1,
  //         };

  //         updatedItems.sort(
  //           (a, b) => new Date(b.created) - new Date(a.created)
  //         );

  //         setChats(updatedItems);
  //       }

  //       if (selectedBtn === "all") {
  //         setUnReadChat((prevItems) =>
  //           prevItems.filter((items, index) => items.mobile !== readdata.mobile)
  //         );
  //       }
  //     }
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [selectedMobileNumber, currentUser, chats, data, dispatch]);

  const handleSelect = async (item) => {
    // console.log("item", item);

    // let socket = io.connect(ENDPOINT);
    setSelectedMobileNumber(item.mobile);
    setSelectedName(item.name);
    setLoading(true);
    setConvPage(0);
    let readdata = {
      ...item,
      brand_number: currentUser.brand_number,
      parent_id: currentUser.parent_id,
    };

    const givenDate = new Date(item.created);
    const currentDate = new Date();
    const time_23hrs_59min_ago = new Date(
      currentDate.getTime() - (23 * 60 * 60 * 1000 + 59 * 60 * 1000)
    );
    if (givenDate < time_23hrs_59min_ago) {
      setIsOldMsg(true);
    } else {
      setIsOldMsg(false);
    }
    try {
      const forconvdata = {
        token: currentUser.parent_token,
        user_id: currentUser.parent_id,
        method: "conv_list_new",
        brand_number: currentUser.brand_number,
        start: 0,
        from_mobile: item.mobile,
      };

      const res = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        forconvdata
      );

      if (res.data.success === true) {
        // socket.emit("read", readdata);
        let updatedunreadchat = unReadChat.filter(
          (items, index) => items.read_status === 0
        );

        setUnReadChat(updatedunreadchat);

        const index = chats.findIndex(
          (selecteditem) => selecteditem.mobile === readdata.mobile
        );

        const unreadindex = updatedunreadchat.findIndex(
          (selecteditem) => selecteditem.mobile === readdata.mobile
        );

        if (unreadindex > -1) {
          const updatedUnreadItems = [...updatedunreadchat];
          updatedUnreadItems[index] = {
            ...updatedUnreadItems[index],

            read_status: 1,
          };

          updatedUnreadItems.sort(
            (a, b) => new Date(b.created) - new Date(a.created)
          );

          setUnReadChat(updatedUnreadItems);
        }

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

        if (selectedBtn === "all") {
          setUnReadChat((prevItems) =>
            prevItems.filter((items, index) => items.mobile !== readdata.mobile)
          );
        }

        let updatedconv = res.data.data;
        updatedconv.sort((a, b) => new Date(a.created) - new Date(b.created));

        await dispatch({
          type: "CHANGE_USER",
          payload: {
            mobile: item.mobile,
            conversation: updatedconv,
            name: item.name,
          },
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addStar = async (item) => {
    let foraddstardata = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "add_started",
      brand_number: currentUser.brand_number,
      from_mobile: item.mobile,
      key_value: 1,
      already_stared: item.stared_by,
      user_type: currentUser.user_type,
      agent_id: currentUser.user_type === "admin" ? "" : currentUser.user_id,
    };
    const newStarArr = chats.map((list) => {
      if (list.mobile === item.mobile) {
        const id = currentUser.user_id.toString();
        const newObj =
          currentUser.user_type === "admin"
            ? { ...list, stared_by_admin: 1 }
            : { ...list, stared_by: id };
        setStarChats((preState) => [newObj, ...preState]);
        return newObj;
      }
      return list;
    });
    setChats(newStarArr);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        foraddstardata
      );
      if (data.success === true) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const removeStar = async (item) => {
    let foraddstardata = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "remove_star",
      brand_number: currentUser.brand_number,
      from_mobile: item.mobile,
      key_value: "0",
      already_stared: item.stared_by,
      user_type: currentUser.user_type,
      agent_id: currentUser.user_type === "admin" ? "" : currentUser.user_id,
    };

    const newStarArr = chats.map((list) => {
      if (list.mobile === item.mobile) {
        const newObj =
          currentUser.user_type === "admin"
            ? { ...list, stared_by_admin: 0 }
            : { ...list, stared_by: "0" };

        return newObj;
      }
      return list;
    });
    setChats(newStarArr);

    setStarChats((preState) => {
      return preState.filter((list) => list.mobile !== item.mobile);
    });
    try {
      const { data } = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        foraddstardata
      );
      if (data.success === true) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateName = async (item) => {
    setLoading(true);
    const dataforupdatename = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "update_name",
      brand_number: currentUser.brand_number,
      from_mobile: item.mobile,
      name: updateNameInput,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        dataforupdatename
      );

      if (data.success === true) {
        window.location.reload(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckbox = (e, list) => {
    if (e.target.checked === true) {
      setCheckboxList([...checkboxList, list.mobile]);
    } else {
      setCheckboxList((prevItems) =>
        prevItems.filter((item) => item !== list.mobile)
      );
    }
  };
  const leftMenuDetails = (data) => {
    setSelectedChatDetails(data);
  };

  const checkExactMatch = (inputStr, matchValue) => {
    if (inputStr === "0") {
      return false;
    }

    const newVal = inputStr.includes(",")
      ? inputStr
      : Number(inputStr.replace(/['"]/g, ""));

    const numbers = inputStr.includes(",")
      ? newVal.split(",").map((item) => Number(item.replace(/['"]/g, "")))
      : [newVal];

    const matchFound = numbers.filter((item) => item === matchValue);

    return matchFound.length > 0 ? true : false;
  };
  const maskNo = (num) => {
    if(!num){
      return
    }
    const lastFourDigits = num?.slice(-4);
    const maskedNumber = lastFourDigits.padStart(num?.length, "X");
    return maskedNumber;
  };
  return (
    <div className="chat-message-list">
      <div
        className="offcanvas offcanvas-end"
        data-bs-backdrop="static"
        tabIndex="-1"
        id="staticBackdrop56"
        aria-labelledby="staticBackdropLabel"
        style={{ visibility: "visible" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="staticBackdropLabel">
            Chat details
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="d-flex flex-column ">
            <div className="flex-shrink-0 online user-own-img align-self-center mb-4">
              <div className="avatar-md chatUser">
                <svg
                  viewBox="0 0 212 212"
                  height="200"
                  width="200"
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
            </div>

            <div className="w-full bg-white py-3 px-2 ">
              <div className="d-flex py-2 px-3">
                <div className="flex-shrink-0 me-3 iconBg">
                  <i className="bx bx-user align-middle text-muted" />
                </div>
                <div className="flex-grow-1">
                  <b>Name:</b> {selectedChatDetails.name}
                </div>
              </div>

              <div className="d-flex py-2 px-3">
                <div className="flex-shrink-0 me-3 iconBg">
                  <i className="mdi mdi-cellphone align-middle text-muted" />
                </div>
                <div className="flex-grow-1">
                  <b>Mobile:</b> {currentUser.user_type==="admin"?selectedChatDetails.mobile:maskNo(selectedChatDetails.mobile)}
                </div>
              </div>
              <div className="d-flex py-2 px-3">
                <div className="flex-shrink-0 me-3 iconBg">
                  <i className="mdi mdi-account-group-outline align-middle text-muted" />
                </div>
                <div className="flex-grow-1">
                  {" "}
                  <b>Team: </b>
                  {selectedChatDetails.team_name
                    ? selectedChatDetails.team_name
                    : "NA"}
                </div>
              </div>
              <div className="d-flex py-2 px-3">
                <div className="flex-shrink-0 me-3 iconBg">
                  <i className="mdi mdi-account-cog-outline align-middle text-muted" />
                </div>
                <div className="flex-grow-1">
                  <b>Manager: </b>
                  {selectedChatDetails.manager_name
                    ? selectedChatDetails.manager_name
                    : "NA"}
                </div>
              </div>

              <div className="d-flex py-2 px-3">
                <div className="flex-shrink-0 me-3 iconBg">
                  <i className="mdi mdi-account-tie-outline align-middle text-muted" />
                </div>
                <div className="flex-grow-1">
                  <b>Agent: </b>
                  {selectedChatDetails.agent_name
                    ? selectedChatDetails.agent_name
                    : "NA"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="popup">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}
      <ul
        role="button"
        className="list-unstyled po mb-3 chat-list chat-user-list"
        id="favourite-users"
      >
        {allChats.length > 0 ? (
          <>
            {allChats.map((item, i) => (
              <li
                key={i}
                className={selectedMobileNumber === item.mobile ? "active" : ""}
                onMouseEnter={() => setLeftMenuOption(item.mobile)}
                onMouseLeave={() => setLeftMenuOption("")}
              >
                {currentUser.user_type === "admin" ? (
                  item.stared_by_admin === 0 ? (
                    <i
                      className="bx bx-star addstar"
                      onClick={() => addStar(item)}
                    />
                  ) : (
                    <i
                      className="bx bxs-star addstar"
                      style={{ color: "gold" }}
                      onClick={() => removeStar(item)}
                    />
                  )
                ) : checkExactMatch(item.stared_by, currentUser.user_id) ? (
                  <i
                    className="bx bxs-star addstar"
                    style={{ color: "gold" }}
                    onClick={() => removeStar(item)}
                  />
                ) : (
                  <i
                    className="bx bx-star addstar"
                    onClick={() => addStar(item)}
                  />
                )}
                {currentUser.user_type !== "agent" && (
                  <input
                    type="checkbox"
                    className="form-check-input left-menu-checkbox"
                    onChange={(e) => handleCheckbox(e, item)}
                  />
                )}
                {leftMenuOption === item.mobile && (
                  <div className="dropdownicon">
                    <button
                      className={`${
                        selectedMobileNumber === item.mobile
                          ? "dropdownicon-btn-active"
                          : "dropdownicon-btn"
                      }`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="mdi mdi-chevron-down" />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-items"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdropforupdatename"
                          onClick={() => setUpdateNameInput(item.name)}
                        >
                          Update Name
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#staticBackdrop56"
                          aria-controls="staticBackdrop"
                          onClick={() => leftMenuDetails(item)}
                        >
                          Details
                        </button>
                      </li>
                      {/* <li>
                              <button class="dropdown-item" href="#">
                                Something else here
                              </button>
                            </li> */}
                    </ul>
                  </div>
                )}
                <div
                  onClick={() => handleSelect(item)}
                  className="d-flex align-items-center"
                >
                  <div className="chat-user-img flex-shrink-0 me-2">
                    <div className="avatar-group">
                      <div className="avatar-group-item">
                        <div className="avatar-xs">
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
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex align-item-center">
                      <div className="text-truncate mb-0 font-size-17 flex flex-grow-1 ChatItemName">
                        {item.name
                          ? isSpecialChar(item.name)
                            ? currentUser.user_type === "admin"
                              ? item.mobile
                              : maskNo(item.mobile)
                            : item.name
                          : currentUser.user_type === "admin"
                          ? item.mobile
                          : maskNo(item.mobile)}
                      </div>
                      <div className="">
                        <div className="font-size-12 text-truncate dateColor mt-1">
                          {dayjs(item.created).format("YYYY-MM-DD") ===
                          formateddate
                            ? dayjs(item.created).format("h:mm A")
                            : dayjs(item.created).format("DD/MM/YYYY")}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-item-center me-4">
                      <div
                        className={`${
                          item.read_status === 1 ? null : "text-bold"
                        } text-truncate flex flex-grow-1`}
                      >
                        {item.content}
                      </div>

                      <div className="ms-3 d-flex d-flex justify-content-center">
                        <div className="flex">
                          {item.read_status === 0 && (
                            <span className="badge badge-primary rounded-circle wgreen">
                              1
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="staticBackdropforupdatename"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex="-1"
                  aria-labelledby="staticBackdropLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="staticBackdropLabel"
                        >
                          Update Name
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">
                            Name<span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={updateNameInput}
                            onChange={(e) => setUpdateNameInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => updateName(item)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </>
        ) : (
          <>
            <h5 className="ms-5">No chats</h5>
            {chatsLoading === true && (
              <>
                {" "}
                {[...Array(15)].map((_, index) => (
                  <li className="mt-0 pt-0 mb-0 pb-0" key={index}>
                    <div className="d-flex align-items-center ">
                      <div className="chat-user-img flex-shrink-0 me-2 ">
                        <div className="avatar-group ">
                          <div className="avatar-group-item ">
                            <div className="avatar-xs ">
                              {/* <img
                          src="/images/whatsapp.png"
                          className="rounded-circle avatar-xs"
                          alt=""
                        /> */}
                              <p className="placeholder-glow">
                                <span
                                  className="placeholder w-100"
                                  style={{
                                    height: "30px",
                                    borderRadius: "50%",
                                  }}
                                ></span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden mt-3">
                        <p className="text-truncate mb-0 placeholder-glow">
                          {" "}
                          <span className="placeholder col-12"></span>
                        </p>
                        <div className="text-muted font-size-12 text-truncate ">
                          <p className="placeholder-glow">
                            <span className="placeholder col-12"></span>
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ms-3">
                        <div className="d-flex align-items-center gap-3">
                          <div>
                            <h5 className="mb-0 font-size-12 text-muted">
                              <p className="placeholder-glow">
                                <span className="placeholder col-5"></span>
                              </p>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Chats;
