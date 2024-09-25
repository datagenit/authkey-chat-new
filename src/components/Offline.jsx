import React from "react";
import offlineImg from "./../assets/offline.svg";
const Offline = () => {
    const refresh = ()=>{
        window.location.reload();
    }
  return (
    <>
      <section className="max-vh-100 d-flex justify-content-center align-items-center vw-100">
        <div className="d-flex flex-column align-items-center">
          <img src={offlineImg} alt="offline" style={{ width: "80%" }} />
            <h5>Something went wrong or no internet connection</h5>
            <p>Try refreshing the page</p>
          <button type="button" className="btn btn-secondary" onClick={refresh}>Refresh</button>
        </div>
      </section>
    </>
  );
};

export default Offline;
