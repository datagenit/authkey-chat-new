import React from "react";

function Welcome() {
  const domainName = window.location.hostname;
  return (
    <div className="chat-welcome-section">
      <div className="w-100 justify-content-center row">
        <div className="col-md-7 col-xxl-5">
          <div className="p-4 text-center">
            <div className="avatar-xl mx-auto mb-4">
              <div className="avatar-title bg-soft-primary rounded-circle">
                <i className="bx bxs-message-alt-detail display-4 text-primary m-0"></i>
              </div>
            </div>
            <h4>Welcome to {domainName}</h4>
            {/* <p className="text-muted mb-4">
              Authkey is a SMS API platform that recognizes the critical role of
              real-time text message delivery.
            </p>
            <button
              type="button"
              className="btn btn-primary w-lg btn btn-secondary"
            >
              Get Started
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
