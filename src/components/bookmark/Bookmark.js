import React, { useEffect, useState } from 'react';


function Bookmark() {
    const [inputValue, setInputValue] = useState("");
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
    
        const timer = setTimeout(() => {
          setSearchInput(inputValue);
        }, 500);
    
        
        return () => {
          clearTimeout(timer);
        };
      }, [inputValue]);
     
    const handleCancel =()=>{
      setInputValue("")
    }

    return (
        <div>
            <div className="px-4 pt-4">
                <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                        <h4 className="mb-3">Star Chats</h4>
                    </div>
                    {/* <div className="flex-shrink-0">
                        <div
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            data-bs-placement="bottom"
                            title="Add Contact"
                        >
                            <button
                                type="button"
                                className="btn btn-soft-primary btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target=".bookmark"
                            >
                                <i className="bx bx-plus" />
                            </button>
                        </div>
                    </div> */}
                </div>
                <div className="input-group mb-3">
        <input
          type="text"
         
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className="form-control bg-light border-0 pe-0"
          id="serachChatUser"
          
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
            </div>
            {/* <div
                className="chat-message-list chat-bookmark-list"
                data-simplebar
            >
                <ul className="list-unstyled chat-list">
                    {bookmark.map((items, i) =>
                        <li key={i}>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-xs ms-1 me-3">
                                    <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                                        <i className="bx bx-file" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="font-size-14 mb-1">
                                        <a href="#" className="text-truncate p-0">
                                            {items.name}
                                        </a>
                                    </h5>
                                    <p className="text-muted text-truncate font-size-13 mb-0">
                                        {convertTimestamp(items.date)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                    <div className="dropdown">
                                        <a
                                            className="dropdown-toggle font-size-16 text-muted px-1"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="bx bx-dots-horizontal-rounded" />
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <a
                                                className="dropdown-item d-flex align-items-center justify-content-between"
                                                href="#"
                                            >
                                                Open{" "}
                                                <i className="bx bx-folder-open ms-2 text-muted" />
                                            </a>
                                            <a
                                                className="dropdown-item d-flex align-items-center justify-content-between"
                                                href="#"
                                            >
                                                Edit{" "}
                                                <i className="bx bx-pencil ms-2 text-muted" />
                                            </a>
                                            <div className="dropdown-divider" />
                                            <a
                                                className="dropdown-item d-flex align-items-center justify-content-between"
                                                href="#"
                                            >
                                                Delete{" "}
                                                <i className="bx bx-trash ms-2 text-muted" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )}

                </ul>
            </div>
            <AddBookmarks update={() => getBookmark()} /> */}
        </div>
    );
}

export default Bookmark;