import React, { useRef, useState } from 'react';
import { doc, Timestamp, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import Alert from '../ui-conponents/Alert';

const AddRemark = (props) => {
    const [remark, setRemark] = useState({
        shortName: '',
        description: ''
    })

    const [error, setError] = useState({
        status: false,
        bg: '',
        message: ''
    })

    const myInput = useRef(null);

    const addRemark = async () => {
        setError({
            status: false,
        })
        if (remark.description === '' || remark.shortName === '') {
            setError({
                status: true,
                bg: "alert-danger",
                message: 'All fields are required'
            })
        } else {
            await updateDoc(doc(db, "remarks", props.userID), {
                remark: arrayUnion({
                    name: remark.shortName,
                    description: remark.description,
                    date: Timestamp.now(),
                    uid: uuid()
                })
            })
            myInput.current?.click();
            props.update();
            setRemark({
                shortName: '',
                description: ''
            })
        }
    }
    return (
        <div
            className="modal fade addRemark"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="addRemark"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content modal-header-colored shadow-lg border-0">
                    <div className="modal-header">
                        <h5 className="modal-title text-white font-size-16" id="addRemark">Add New Remarks</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body p-4">
                        {error.status &&
                            <Alert bg={error.bg} message={error.message} />}
                        <form>
                            <div className="mb-4">
                                <label htmlFor="addgroupname-input" className="form-label">Group Name</label>
                                <input type="text" onChange={(e) => setRemark({ ...remark, shortName: e.target.value })} className="form-control" value={remark.shortName} id="addgroupname-input" placeholder="Enter Group Name" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="addgroupdescription-input" className="form-label">Description</label>
                                <textarea onChange={(e) => setRemark({ ...remark, description: e.target.value })} className="form-control" id="addgroupdescription-input" value={remark.description} rows="3" placeholder="Enter Description"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" ref={myInput} className="btn btn-link" data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={addRemark} className="btn btn-primary">Add Remark</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRemark;