import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL3, BASE_URL4 } from "../api/api";
import { toast } from "react-toastify";
import TemplatePrev from "./TemplatePrev";
import bg_whatsapp from "../assets/mob-bg.png";
import { ChatState } from "../context/AllProviders";
const SendTemplate = (props) => {
  const [templateList, setTemplateList] = useState([]);
  const [templatePreView, setTemplatePreView] = useState();
  const [templateData, setTemplateData] = useState();
  const [headVar, setHeadVar] = useState([]);
  const [bodyVar, setBodyVar] = useState([]);
  const [bodyValue, setBodyValue] = useState({});
  const [headValue, setHeadValue] = useState({});
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { wpProfile, setSendTemplatePopUp } = ChatState();
  useEffect(() => {
    if (currentUser.parent_id) {
      fetchTemplate();
    }
  }, [currentUser]);
  const fetchTemplate = async () => {
    const datafortemplate = {
      token: currentUser.parent_token,
      user_id: currentUser.parent_id,
      method: "retrieve_fresh",
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL3}/whatsapp_template.php`,
        datafortemplate
      );
      if (data.success === true) {
        setTemplateList(data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const selectedTemplate = (e) => {
    if (e.target.value === "") {
      setTemplatePreView(null);
      setTemplateData(null);
      return;
    }
    const selectedTempId = parseInt(e.target.value);

    const tempDtl = templateList.filter((list) => list.id === selectedTempId);

    let urlbtn = [];
    let urlbtn2 = [];
    let callbtn = [];
    let buttonData = JSON.parse(tempDtl[0].temp_button);

    buttonData.forEach((item, index) => {
      let key = Object.keys(item);
      if (key.includes("urltext2")) {
        urlbtn2[0] = item;
      }
      if (key.includes("urltext")) {
        urlbtn[0] = item;
      }
      if (key.includes("phone")) {
        callbtn[0] = item;
      }
    });
    let PreviewTemplateData = {
      wid: tempDtl[0].id,
      tampleName: tempDtl[0].temp_name,
      language: tempDtl[0].temp_language,
      accountType: tempDtl[0].temp_category,
      templateType: tempDtl[0].temp_type,
      headerText: tempDtl[0].temp_header,
      headerOptions: tempDtl[0].temp_header === "" ? false : true,
      footerText: tempDtl[0].temp_footer,
      footerOptions: tempDtl[0].temp_header === "" ? false : true,
      temp_button: tempDtl[0].temp_button,
      bodyMessage: tempDtl[0].temp_body,
      button: tempDtl[0].temp_button,
      temp_status: tempDtl[0].temp_status,
      Urlbutton: urlbtn,
      Urlbutton2: urlbtn2,
      Callbutton: callbtn,
      quickButton:
        tempDtl[0].temp_button.length > 0 &&
        tempDtl[0].temp_button[0].actionType === "quickReply"
          ? [tempDtl[0].temp_button[0]]
          : "",
      temp_attribute: [],
      isLoading: false,
    };
    const headVariables = tempDtl[0].temp_header.match(/\{\{(\d+)\}\}/g);
    const bodyVariables = tempDtl[0].temp_body.match(/\{\{(\d+)\}\}/g);
    setHeadVar(headVariables);
    setBodyVar(bodyVariables);
    setTemplatePreView(PreviewTemplateData);
    setTemplateData(PreviewTemplateData);
  };
  const replaceVal = (e, item) => {
    const updatedValue = { ...bodyValue, [item]: e.target.value };
    setBodyValue(updatedValue);

    let updatedText = templateData.bodyMessage;
    for (const key in updatedValue) {
      if (updatedValue[key] === "") {
        updatedText = updatedText.replace(key, key);
      } else {
        updatedText = updatedText.replace(key, updatedValue[key]);
      }
    }

    setTemplatePreView((preState) => ({
      ...preState,
      bodyMessage: updatedText,
    }));
  };
  const sendTemp = async () => {
    setLoadingBtn(true);
    const queryString = Object.entries(bodyValue)
      .map(([key, value]) => `${key.replace(/[{}]/g, "")}=${value}`)
      .join("&");

    const numberString = props.mobile.toString();
    const countryCode = parseInt(numberString.slice(0, 2), 10);
    const num = parseInt(numberString.slice(2), 10);
    const { data } = await axios.get(
      `${BASE_URL4}/request?authkey=${
        currentUser.authkey_parent
      }&mobile=${num}&wid=${templateData.wid}&country_code=${countryCode}&${
        bodyVar?.length > 0 ? queryString : ""
      }&${headVar?.length > 0 ? `headervalue=${headValue["{{1}}"]}` : ""}`
    );
    if (data.LogID === "") {
      toast.error(data.message);
    } else {
      toast.error(data.message);
      setSendTemplatePopUp(false);
    }
    setLoadingBtn(false);
  };

  const replaceHeadVal = (e, item) => {
    const updatedValue = { ...headValue, [item]: e.target.value };
    setHeadValue(updatedValue);

    let updatedText = templateData.headerText;
    for (const key in updatedValue) {
      if (updatedValue[key] === "") {
        updatedText = updatedText.replace(key, key);
      } else {
        updatedText = updatedText.replace(key, updatedValue[key]);
      }
    }

    setTemplatePreView((preState) => ({
      ...preState,
      headerText: updatedText,
    }));
  };

  return (
    <div className="mt-4">
      <div className="container popupheight">
        <div className="row">
          <div className="col-md-4">
            <label>Select template</label>
            <select
              className="form-control"
              style={{ cursor: "pointer" }}
              onChange={selectedTemplate}
            >
              <option value="">Select Template</option>
              {templateList.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.temp_name}
                </option>
              ))}
            </select>
            {headVar?.length > 0 && (
              <div className="mt-3">
                <label>Head Variable</label>
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">
                    {"{{1}}"}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="{{1}}"
                    onChange={(e) => replaceHeadVal(e, "{{1}}")}
                  />
                </div>
              </div>
            )}
            {bodyVar?.length > 0 && (
              <div className="mt-3">
                <label>Body Variable</label>
                {bodyVar.map((item, i) => (
                  <div className="input-group" key={i}>
                    <span className="input-group-text" id="basic-addon1">
                      {item}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={item}
                      onChange={(e) => replaceVal(e, item)}
                    />
                  </div>
                ))}
              </div>
            )}
            {templatePreView && (
              <div className="mt-3" style={{ float: "right" }}>
                {loadingBtn ? (
                  <button className="btn btn-success" type="button" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={sendTemp}>
                    Send
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="col-md-8">
            {templatePreView ? (
              <TemplatePrev previewData={templatePreView} />
            ) : (
              <div className="text-center templatePreviewimg">
                <img
                  className="whatsapp-bg"
                  style={{ minWidth: "17rem" }}
                  alt="img"
                  src={bg_whatsapp}
                />
                <div className="templatePreviewtxt">
                  <p className="text-right">
                    Please select WhatsApp Template to preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendTemplate;
