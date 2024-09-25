import React, { useState, useRef } from 'react';
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import Alert from '../ui-conponents/Alert';

const AddBookmarks = (props) => {

    const myInput = useRef(null);
    const [bookmark, setSetbookmark] = useState({
        shortName: '',
        description: ''
    })

    const [error, setError] = useState({
        status: false,
        bg: '',
        message: ''
    })


    const addBookmark = async () => {
        setError({
            status: true,
        })
        if (bookmark.description === '' || bookmark.shortName === '') {
            setError({
                status: true,
                bg: "alert-danger",
                message: 'All fields are required'
            })
        } else {
            await setDoc(doc(db, "bookmarks", uuid()), {
                name: bookmark.shortName,
                description: bookmark.description,
                date: Timestamp.now(),
            })
            myInput.current?.click();
            props.update();
            setSetbookmark({
                shortName: '',
                description: ''
            })
        }
    }



    return (
        <div
            id="bookmark"
            className="modal fade bookmark"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="bookmark"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content modal-header-colored shadow-lg border-0">
                    <div className="modal-header">
                        <h5 className="modal-title text-white font-size-16" id="bookmark">Add New Bookmark</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body p-4">
                        {error.status &&
                            <Alert bg={error.bg} message={error.message} />}

                        <form>
                            <div className="mb-4">
                                <label htmlFor="addgroupname-input" className="form-label">Bookmark Name</label>
                                <input type="text" onChange={(e) => setSetbookmark({ ...bookmark, shortName: e.target.value })} className="form-control" value={bookmark.shortName} id="addgroupname-input" placeholder="Enter Group Name" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="addgroupdescription-input" className="form-label">Bookmark Description</label>
                                <textarea onChange={(e) => setSetbookmark({ ...bookmark, description: e.target.value })} className="form-control" value={bookmark.description} id="addgroupdescription-input" rows="3" placeholder="Enter Description"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" ref={myInput} className="btn btn-link" data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={addBookmark} className="btn btn-primary">Add Bookmark</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBookmarks;