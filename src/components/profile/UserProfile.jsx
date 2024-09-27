import { useContext, useEffect, useState } from "react";
import { BASE_URL, BASE_URL2 } from "../../api/api";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ChatState } from "../../context/AllProviders";
import { FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
const UserProfile = (props) => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const { wpProfile, setWpProfile } = ChatState();
  const [activeStatus, setActiveStatus] = useState(
    currentUser.availability === 1 ? true : false
  );

  useEffect(() => {
    const wpProfile = async () => {
      if (currentUser.parent_id) {
        const { data } = await axios.get(
          `${BASE_URL}/wp_profile.php?user_id=${currentUser.parent_id}&method=retrieve&token=${currentUser.parent_token}`
        );
        if (data.success === true) {
          setWpProfile(data.data[0]);
        }
      }
    };
    wpProfile();
  }, [currentUser]);
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));
  const handleActiveStatus = async(e) => {
    setActiveStatus(e.target.checked);
    const dataforstatus = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "active_status",
      agent_id:currentUser.user_id,
      user_type:currentUser.user_type,
      status:e.target.checked
    };
    try {
      const {data} = await axios.post(`${BASE_URL2}/whatsapp_user`, dataforstatus);
      if(data.success===true){
        toast.success(data.message);
      }
      const updatedData={...currentUser, availability:data.data};
      
      
      updateUser(updatedData);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  return (
    <div className="bg-gray">
      <div className="user-profile-img p-3 bg-white">
        <h4 className="fw-bold">Profile</h4>
      </div>
      <div className="text-center m-4 position-relative">
        <div className="mb-lg-3 mb-2">
          <img
            src={
              wpProfile.image_url === ""
                ? "/images/user.png"
                : wpProfile.image_url
            }
            className="rounded-circle avatar-lg img-thumbnail"
            alt=""
          />
        </div>
        {/* <p className="text-muted font-size-14 text-truncate mb-0">
          {props.currentUser.name}
        </p> */}
      </div>
      {/* <div className="profile-desc" data-simplebar> */}
      {/* <div className="text-muted">
          <p className="mb-4">
            If several languages coalesce, the grammar of the resulting language
            is more simple.
          </p>
        </div> */}
      <div>
        <div className="d-flex me-3 px-3 ">
          <h6 className="fw-bold">About</h6>
        </div>
        <div className="bg-white boxShadow bg-gray p-3">
          <div className="d-flex py-2">
            <div className="flex-shrink-0 me-3 iconBg">
              <i className="bx bx-user align-middle text-muted" />
            </div>
            <div className="flex-grow-1">
              <p className="mb-0">{props.currentUser.name}</p>
            </div>
          </div>
          <div className="d-flex py-2">
            <div className="flex-shrink-0 me-3 iconBg">
              <i className="bx bx-message-rounded-dots align-middle text-muted" />
            </div>
            <div className="flex-grow-1">
              <p className="mb-0">{props.currentUser.mobile}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="d-flex me-3 px-3">
          <h6 className="fw-bold">Company Details</h6>
        </div>
        <div className="bg-white boxShadow p-3">
          <div className="d-flex py-2">
            <div className="flex-shrink-0 me-3 iconBg">
              <i className="bx bx bx-building-house align-middle text-muted" />
            </div>
            <div className="flex-grow-1">
              <p className="mb-0">{wpProfile.comp_name}</p>
            </div>
          </div>
          <div className="d-flex py-2">
            <div className="flex-shrink-0 me-3 iconBg">
              <i className="bx bx-message-rounded-dots align-middle text-muted" />
            </div>
            <div className="flex-grow-1">
              <p className="mb-0">{wpProfile.brand_number}</p>
            </div>
          </div>
          <div className="d-flex py-2">
            <div className="flex-shrink-0 me-3 iconBg">
              <i className="bx bx-location-plus align-middle text-muted" />
            </div>
            <div className="flex-grow-1">
              <p className="mb-0">{wpProfile.address}</p>
            </div>
          </div>
        </div>
      </div>

      {currentUser.user_type==="agent"&&<div className="mt-4">
        <div className="d-flex me-3 px-3">
          <h6 className="fw-bold">Setting</h6>
        </div>
        <div className="bg-white boxShadow p-2">
          <div className="d-flex">
            <div className="me-4 mt-2">
              <p className="mb-0">Active Status</p>
            </div>
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  checked={activeStatus}
                  onChange={handleActiveStatus}
                />
              }
            />
          </div>
        </div>
      </div>}
      {/* <div>
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <h5 className="font-size-11 text-muted text-uppercase">
                                Media
                            </h5>
                        </div>
                        <div className="flex-shrink-0">
                            <a href="#" className="font-size-12 d-block mb-2">
                                Show all
                            </a>
                        </div>
                    </div>
                    <div className="profile-media-img">
                        <div className="media-img-list">
                            <a href="#">
                                <img
                                    src="/images/img-4.jpg"
                                    alt="media img"
                                    className="img-fluid"
                                />
                            </a>
                        </div>
                        <div className="media-img-list">
                            <a href="#">
                                <img
                                    src="/images/img-4.jpg"
                                    alt="media img"
                                    className="img-fluid"
                                />
                            </a>
                        </div>
                        <div className="media-img-list">
                            <a href="#">
                                <img
                                    src="/images/img-4.jpg"
                                    alt="media img"
                                    className="img-fluid"
                                />
                                <div className="bg-overlay">+ 15</div>
                            </a>
                        </div>
                    </div>
                </div>
                <hr className="my-4" />
                <div>
                    <div>
                        <h5 className="font-size-11 text-muted text-uppercase mb-3">
                            Attached Files
                        </h5>
                    </div>
                    <div>
                        <div className="card p-2 border mb-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-xs ms-1 me-3">
                                    <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                                        <i className="bx bx-file" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="font-size-14 text-truncate mb-1">
                                        design-phase-1-approved.pdf
                                    </h5>
                                    <p className="text-muted font-size-13 mb-0">
                                        12.5 MB
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                    <div className="d-flex gap-2">
                                        <div>
                                            <a href="#" className="text-muted px-1">
                                                <i className="bx bxs-download" />
                                            </a>
                                        </div>
                                        <div className="dropdown">
                                            <a
                                                className="dropdown-toggle text-muted px-1"
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
                                                    Share{" "}
                                                    <i className="bx bx-share-alt ms-2 text-muted" />
                                                </a>
                                                <a
                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                    href="#"
                                                >
                                                    Bookmark{" "}
                                                    <i className="bx bx-bookmarks text-muted ms-2" />
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
                            </div>
                        </div>
                        <div className="card p-2 border mb-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-xs ms-1 me-3">
                                    <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                                        <i className="bx bx-image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="font-size-14 text-truncate mb-1">
                                        Image-1.jpg
                                    </h5>
                                    <p className="text-muted font-size-13 mb-0">4.2 MB</p>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                    <div className="d-flex gap-2">
                                        <div>
                                            <a href="#" className="text-muted px-1">
                                                <i className="bx bxs-download" />
                                            </a>
                                        </div>
                                        <div className="dropdown">
                                            <a
                                                className="dropdown-toggle text-muted px-1"
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
                                                    Share{" "}
                                                    <i className="bx bx-share-alt ms-2 text-muted" />
                                                </a>
                                                <a
                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                    href="#"
                                                >
                                                    Bookmark{" "}
                                                    <i className="bx bx-bookmarks text-muted ms-2" />
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
                            </div>
                        </div>
                        <div className="card p-2 border mb-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-xs ms-1 me-3">
                                    <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                                        <i className="bx bx-image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="font-size-14 text-truncate mb-1">
                                        Image-2.jpg
                                    </h5>
                                    <p className="text-muted font-size-13 mb-0">3.1 MB</p>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                    <div className="d-flex gap-2">
                                        <div>
                                            <a href="#" className="text-muted px-1">
                                                <i className="bx bxs-download" />
                                            </a>
                                        </div>
                                        <div className="dropdown">
                                            <a
                                                className="dropdown-toggle text-muted px-1"
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
                                                    Share{" "}
                                                    <i className="bx bx-share-alt ms-2 text-muted" />
                                                </a>
                                                <a
                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                    href="#"
                                                >
                                                    Bookmark{" "}
                                                    <i className="bx bx-bookmarks text-muted ms-2" />
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
                            </div>
                        </div>
                        <div className="card p-2 border mb-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-xs ms-1 me-3">
                                    <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                                        <i className="bx bx-file" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="font-size-14 text-truncate mb-1">
                                        Landing-A.zip
                                    </h5>
                                    <p className="text-muted font-size-13 mb-0">6.7 MB</p>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                    <div className="d-flex gap-2">
                                        <div>
                                            <a href="#" className="text-muted px-1">
                                                <i className="bx bxs-download" />
                                            </a>
                                        </div>
                                        <div className="dropdown">
                                            <a
                                                className="dropdown-toggle text-muted px-1"
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
                                                    Share{" "}
                                                    <i className="bx bx-share-alt ms-2 text-muted" />
                                                </a>
                                                <a
                                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                                    href="#"
                                                >
                                                    Bookmark{" "}
                                                    <i className="bx bx-bookmarks text-muted ms-2" />
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
                            </div>
                        </div>
                    </div>
                </div> */}

      {/* </div> */}
    </div>
  );
};

export default UserProfile;
