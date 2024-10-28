import React from "react";
import bg_whatsapp from "../assets/mob-bg.png"
import { ChatState } from "../context/AllProviders";
import auth_img from "../assets/whatsapp-brand.png"

function TemplatePrev(props) {
  const {wpProfile} = ChatState();
  let previewData = props.previewData;

 
  var truncatedcompanyname;
  if(wpProfile.comp_name){
  if(wpProfile.comp_name.length <= 15){
     truncatedcompanyname = wpProfile.comp_name
  }else{
     truncatedcompanyname = wpProfile.comp_name.substring(0, 15) + '...';
  }
}
  

  const displayWhatsAppPreview = (TemplateType, headerText) => {
    for (let key in headerText) {
      if (key === "text") {
        return <strong> {previewData.headerText.text} </strong>;
      }
      if (key === "image") {
        return <img alt="img" className="img-fluid" src={previewData.headerText.image} />;
      }
      if (key === "video") {
        return (
          <video width="100%" controls>
            <source src={previewData.headerText.video} type="video/mp4" />
          </video>
        );
      }
      if (key === "document") {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={previewData.headerText.document}
          >
            <div className="doc-type">Document Media</div>
          </a>
        );
      }
    }
  };

  const quickReply = () => {
    return previewData.quickButton.map((item) => {
      let key = Object.keys(item);
      const index = key.indexOf("actionType");
      if (index > -1) {
        let data = key.splice(index, 1);
      }

      return key.map((keyitem) => (
        <div className="button-text">
          <p className="mb-1">{item[keyitem]}</p>
        </div>
      ));
    });
  };

  return (
    <div className="whatsapp">
      {previewData && (
        <>
          {/* <ul>
            <li>
              {" "}
              <strong> Template name: </strong> {previewData.tampleName}{" "}
            </li>
            <li>
              <strong> Language: </strong> {previewData.language}{" "}
            </li>
            <li>
              {" "}
              <strong> Category: </strong>
              {previewData.accountType}{" "}
            </li>
            <li>
              {" "}
              <strong> Type: </strong> {previewData.templateType}{" "}
            </li>
          </ul> */}
          <div
            style={{ backgroundImage: `url(${bg_whatsapp})` }}
            className="whatsapp-review whatsapp-bg"
          >
            <div>
              <div className="text-section">
                <div className="whats-app-header">
                  <div className="">
                    {" "}
                    <img alt="company img" src={wpProfile.image_url ? wpProfile.image_url : auth_img} />{" "}
                  </div>
                  <div className="h5">
                    {" "}
                    <p>{truncatedcompanyname} </p>{" "}
                  </div>
                </div>

                <div className="body-message">
                  {displayWhatsAppPreview(
                    previewData.headerText.TemplateType,
                    previewData.headerText
                  )}
                  {/* <img src={previewData.headerText.tempImage} alt="img" className="img-fluid"/> */}
                  <p>
                    {" "}
                    {previewData.preBodyMessage
                      ? previewData.preBodyMessage
                      : previewData.bodyMessage}
                  </p>

                  <small>{previewData.footerText}</small>
                </div>

                {previewData.Callbutton[0] && (
                  <>
                    {previewData.Callbutton.map((item, index) => (
                      <div className="button-text">
                        <a href={`tel:+${item.countryCode}${item.phone}`}>
                          {" "}
                          <p key={index}>
                            {" "}
                            <i className='bx bxs-phone'></i> {item.text}
                            
                          </p>{" "}
                        </a>
                      </div>
                    ))}
                  </>
                )}

                {previewData.Urlbutton[0] && (
                  <>
                    {previewData.Urlbutton.map((item, index) => (
                      <div className="button-text">
                        <a href={`${item.url}`}>
                          {" "}
                          <p key={index}>
                            {" "}
                            <i className='bx bx-globe'></i> {item.urltext}
                           
                          </p>{" "}
                        </a>
                      </div>
                    ))}
                  </>
                )}

                {previewData.Urlbutton2[0] && (
                  <>
                    {previewData.Urlbutton2.map((item, index) => (
                      <div className="button-text">
                        <a href={`${item.url2}`}>
                          {" "}
                          <p key={index}>
                            {" "}
                            <i className='bx bx-globe'></i> {item.urltext2}
                           
                          </p>{" "}
                        </a>
                      </div>
                    ))}
                  </>
                )}

                {previewData.quickButton[0] && <>{quickReply()}</>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TemplatePrev;
