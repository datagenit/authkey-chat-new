import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import AddRemark from './AddRemark';
import { Link } from 'react-router-dom';

const Remark = (props) => {

    let [remark, setRemark] = useState([])

    useEffect(() => {
        props.chatUserData.uid && getRemark();
    }, [props.chatUserData.uid]);

    const getRemark = () => {
        const unsub = onSnapshot(doc(db, "remarks", props.chatUserData.uid), (doc) => {
            if (doc.data() === undefined) {
                setRemark([])
            } else {
                setRemark(doc.data().remark)
            }
        });
        return () => {
            unsub();
        };
    };

    return (
        <>
            <div
                className="modal fade pinnedtabModal"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="pinnedtabModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content modal-header-colored shadow-lg border-0">
                        <div className="modal-header">
                            <h5
                                className="modal-title text-white font-size-16"
                                id="pinnedtabModalLabel"
                            >
                                Saved Remake
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-grow-1">
                                    <div>
                                        <h5 className="font-size-16 mb-0">Remake List</h5>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-soft-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target=".addRemark"
                                        >
                                            <i className="bx bx-plus" /> Add Remarks
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="chat-bookmark-list mx-n4"
                                data-simplebar
                                style={{ maxHeight: "299px" }}
                            >
                                <ul className="list-unstyled chat-list">
                                    {remark && remark.length > 0 ?
                                        remark.map((items, i) =>
                                            <li key={i}>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 avatar-xs me-3">
                                                        <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                            <i className="bx bx-pin" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-14 text-truncate mb-1">

                                                            {items.name}

                                                        </h5>
                                                        <p className="text-muted font-size-13 mb-0">
                                                            {items.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-3">
                                                        <div className="dropdown">
                                                            <Link
                                                                className="dropdown-toggle font-size-18 text-muted px-1"
                                                                to="#"
                                                                role="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="bx bx-dots-horizontal-rounded" />
                                                            </Link>
                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                                    to="/"
                                                                >
                                                                    Open
                                                                    <i className="bx bx-folder-open ms-2 text-muted" />
                                                                </Link>
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                                    to="/"
                                                                >
                                                                    Edit
                                                                    <i className="bx bx-pencil ms-2 text-muted" />
                                                                </Link>
                                                                <div className="dropdown-divider" />
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                                    to="/"
                                                                >
                                                                    Delete
                                                                    <i className="bx bx-trash ms-2 text-muted" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                        :
                                        <div className='alert text-center alert-danger'>
                                            No remakes found
                                        </div>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddRemark userID={props.chatUserData.uid} update={() => getRemark()} />

        </>

    );
};

export default Remark;