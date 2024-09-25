import React, { useContext,useEffect,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatState } from "../context/AllProviders";
import axios from "axios";
import { BASE_URL } from "../api/api";
const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const { currentUser } = useContext(AuthContext);
  const {setChats,setSelectedBtn,setChatsLoading} = ChatState();

const handleCancel =()=>{
  
  setInputValue("");
  fetchSearch("");
}
useEffect(() => {
  const timer = setTimeout(() => {
    if (inputValue.trim()) {
      fetchSearch(inputValue);
    }
  }, 500);


  return () => {
    clearTimeout(timer);
  };
}, [inputValue]); 
const handleSearch = (e) => {
if(e.target.value===""){
  fetchSearch("");
}
  setInputValue(e.target.value);
};

  const fetchSearch = async (searchInput) => {
    setChats([]);
    setChatsLoading(true)
    setSelectedBtn("all");
    let dataforsearchdata = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "left_menunew",
      search_keyword: searchInput,
      brand_number: currentUser.brand_number,
      user_type: currentUser.user_type,
      search_id: currentUser.user_id ? currentUser.user_id : "",
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL}/netcore_conversation.php`,
        dataforsearchdata
      );

      if (data.success === true) {
       
        setChats(data.data);
      }else{
        setChats([]);
      }
    } catch (error) {
      console.error(error);
    }
    setChatsLoading(false)
  };
  return (
    <>
      <div className="input-group mb-2">
        <input
          type="text"
          onChange={handleSearch}
          value={inputValue}
          className="form-control bg-light border-0 pe-0"
       
          placeholder="Search here.."
          aria-label="Example text with button addon"
          aria-describedby="searchbtn-addon"
          autoComplete="off"
        />
        {inputValue!==""&&<button
          className="btn btn-light"
          type="button"
          onClick={handleCancel}
          id="searchbtn-addon"
        >
          <i className="bx bx bx-x align-middle" />
        </button>}
      </div>
      {/* <div className="chat-message-list">
        {err && <span>User not found!</span>}
        {user && (
          <ul
            className="list-unstyled chat-list chat-user-list"
            id="favourite-users"
          >
            <li onClick={handleSelect}>
              <div className="d-flex align-items-center">
                <div className="chat-user-img align-self-center me-2 ms-0 online">
                  <img
                    src={user.photoURL}
                    className="rounded-circle avatar-xs"
                    alt=""
                  />
                  <span className="user-status"></span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-truncate mb-0">{user.displayName} </p>
                </div>
                <div className="ms-auto">
                  <span className="badge badge-soft-dark rounded p-1">3</span>
                </div>
              </div>
            </li>
          </ul>
        )}
      </div> */}
    </>
  );
};

export default Search;
