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
  const [bodyValue, setBodyValue] = useState(
    bodyVar ? Array(bodyVar.length).fill("") : 0
  );
  const [headValue, setHeadValue] = useState(
    headVar ? Array(headVar.length).fill("") : 0
  );
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
    setHeadVar([]);
    setBodyVar([]);
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
    const hd = JSON.parse(tempDtl[0].temp_header);
   
    let headdata;
    if (hd.text) {
      const headVariables = hd.text.match(/\{\{(\d+)\}\}/g);
      setHeadVar(headVariables);
      headdata = headVariables
        ? formatMessage(hd.text, headVariables, headValue)
        : hd.text;
    }

    const bodyVariables = tempDtl[0].temp_body.match(/\{\{(\d+)\}\}/g);

    setBodyVar(bodyVariables);

    setTemplateData(PreviewTemplateData);
    const bodydata = bodyVariables
      ? formatMessage(PreviewTemplateData.bodyMessage, bodyVariables, bodyValue)
      : PreviewTemplateData.bodyMessage;

    setTemplatePreView({
      ...PreviewTemplateData,
      bodyMessage: bodydata,
      headerText: hd.text ? { text: headdata } : hd,
    });
  };
  const replaceBodyVal = (index, value) => {
    const updatedValues = [...bodyValue];
    updatedValues[index] = value;
    setBodyValue(updatedValues);
    const bodydata = formatMessage(
      templateData.bodyMessage,
      bodyVar,
      updatedValues
    );
    setTemplatePreView((preState) => ({
      ...preState,
      bodyMessage: bodydata,
    }));
  };

  const sendTemp = async () => {
    setLoadingBtn(true);
    const queryString = bodyValue
      .map((value, index) => `${index + 1}=${value}`)
      .join("&");

    const numberString = props.mobile.toString();
    const countryCode = parseInt(numberString.slice(0, 2), 10);
    const num = parseInt(numberString.slice(2), 10);
    const { data } = await axios.get(
      `${BASE_URL4}/request?authkey=${
        currentUser.authkey_parent
      }&mobile=${num}&wid=${templateData.wid}&country_code=${countryCode}&${
        bodyVar?.length > 0 ? queryString : ""
      }&${headVar?.length > 0 ? `headervalue=${headValue[0]}` : ""}`
    );
    if (data.LogID === "") {
      toast.error(data.message);
    } else {
      toast.error(data.message);
      setSendTemplatePopUp(false);
    }
    setLoadingBtn(false);
  };

  const replaceHeadVal = (index, value) => {
    const updatedValues = [...headValue];
    updatedValues[index] = value;
    setHeadValue(updatedValues);
    const hdData = JSON.parse(templateData.headerText);

    const headdata = formatMessage(hdData.text, headVar, updatedValues);

    setTemplatePreView((prevState) => ({
      ...prevState,
      headerText: {
        ...prevState.headerText,
        text: headdata,
      },
    }));
  };

  const formatMessage = (msg, placeholders, inputValues) => {
    const parts = msg.split(/(\{\{[0-9]+\}\})/);
    return parts.map((part, index) => {
      const placeholderIndex = placeholders.indexOf(part);
      if (placeholderIndex !== -1) {
        return (
          <span key={index} style={{ color: "red" }}>
            {inputValues[placeholderIndex] || part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="mt-4">
      <div className="container popupheight">
        <div className="row">
          <div className="col-md-6">
            <label className="formlabel mb-2">Select template</label>
            <div className="selectBox drop-down-icons  mb-3">
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
            </div>
            <div className="WhatBodyHgt">
              {headVar?.length > 0 && (
                <div className="mb-3 px-2 py-2 bgGray">
                  <label className="formlabel">Head Variable</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      {"{{1}}"}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="{{1}}"
                      onChange={(e) => replaceHeadVal(0, e.target.value)}
                    />
                  </div>
                </div>
              )}
              {bodyVar?.length > 0 && (
                <div className="mb-3 px-2 py-2 bgGray">
                  <label className="formlabel mb-2">Body Variable</label>
                  {bodyVar.map((item, i) => (
                    <div className="input-group mb-2" key={i}>
                      <span className="input-group-text" id="basic-addon1">
                        {item}
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={item}
                        onChange={(e) => replaceBodyVal(i, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {templatePreView && (
              <div className="mt-2" style={{ float: "right" }}>
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
          <div className="col-md-6">
            {templatePreView ? (
              <TemplatePrev previewData={templatePreView} />
            ) : (
              <div className="whatsappPreview">
                <div
                  className="whatsapp-review whatsapp-bg"
                  style={{ backgroundImage: `url(${bg_whatsapp})` }}
                />
                <div className="whatsappFront">
                  <div class="whats-app-header">
                    <img alt="company img" src={wpProfile.image_url} />
                    <div class="whatsappPTxt">
                      {" "}
                      <p>{wpProfile.comp_name} </p>{" "}
                    </div>
                  </div>
                  <div className="msgTxt">
                    <p className="text-right">
                      Please select WhatsApp Template to preview
                    </p>
                  </div>
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
