import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LeftMenu from "../components/LeftMenu";
// import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import Select, { components } from "react-select";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL2 } from "../api/api";
import axios from "axios";
import { toast } from "react-toastify";
const Setting = () => {
  const [selectedHs, setSelectedHs] = useState("");
  const [selectedOption, setSelectedOption] = useState("team");
  const [agentList, setAgentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState([""]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser.parent_id) {
      fetchAgent(selectedOption);
    }
  }, [currentUser, selectedOption]);
  const fetchAgent = async (selectType) => {
    setIsLoading(true);
    const forAgentdata = {
      user_id: currentUser.parent_id,
      token: currentUser.parent_token,
      method: "retrieve",
      agent_type: selectType,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL2}/whatsapp_agent`,
        forAgentdata
      );

      if (data.success === true) {
        const newAgentList = data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setAgentList(newAgentList);
        setIsLoading(false);
      } else {
        setAgentList([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (!currentUser.parent_id) {
      return;
    }
    const retriveHuntST = async () => {
      const dataforsetting = {
        user_id: currentUser.parent_id,
        token: currentUser.parent_token,
        method: "retrieve_hunt_strategy",
        user_type: currentUser.user_type,
        brand_number: currentUser.brand_number,
        channel: "whatsapp",
      };
      try {
        const { data } = await axios.post(
          `${BASE_URL2}/whatsapp_setting`,
          dataforsetting
        );
        if (data.success === true) {
          
          setSelectedHs(data.data.hunt_strategy);
          const arr= [data.data.teams]
          setSelectedAgent(arr)
          
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
    retriveHuntST();
  }, [currentUser]);

  const handleHuntStrategyChange = (event) => {
    setSelectedHs(event.target.value);
  };

  // const handleRadioChange = (event) => {
  //   setSelectedOption(event.target.value);
  // };

  const handleAgent = (e) => {
    setSelectedAgent(e);
   
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      cursor: "pointer",
    }),
  };
  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    let agentList;
    if (selectedOption === "agent") {
      agentList = selectedAgent.map((list) => list.value);
    }

    const dataforsetting = {
      user_id: currentUser.parent_id,
      token: currentUser.parent_token,
      method: "hunt_strategy",
      user_type: currentUser.user_type,
      brand_number: currentUser.brand_number,
      agent_type: selectedOption,
      channel: "whatsapp",
      hunt_strategy: selectedHs,
      agent_id: selectedOption === "agent" ? agentList : selectedAgent.value,
    };

    try {
      const { data } = await axios.post(
        `${BASE_URL2}/whatsapp_setting`,
        dataforsetting
      );
      if (data.success === true) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div>
      <div className="layout-wrapper d-lg-flex">
        <LeftMenu />
        <div className="w-100">
          <Navbar />
          <div className="d-flex">
            <div className="container-fluid">
              <div className="my-4">
                {/* <Link
                                    to="/agent-management/agent"
                                    className="btn btn-success"
                                    style={{ float: "right" }}
                                >
                                    Back
                                </Link> */}
              </div>
              <div className="content">
                <div className="container-fluid p-0">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-6 mx-auto">
                        <div className="card mt-4">
                          <div className="d-flex justify-content-center align-items-center mb-4">
                            <form onSubmit={handleUpdate}>
                              <div
                                className="row mt-4"
                                style={{ padding: "20px 50px 0px 50px" }}
                              >
                                <div className="col-md-12 mx-auto">
                                  <label>
                                    Hunt Strategy
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <div className="mb-2">
                                    <select
                                      className="form-control"
                                      value={selectedHs}
                                      onChange={handleHuntStrategyChange}
                                      required
                                    >
                                      <option value="">
                                        Select Hunt Strategy
                                      </option>
                                      <option value="random">Random</option>
                                      {/* <option value="sequence">Sequence</option> */}
                                    </select>
                                  </div>
                                </div>
                                <div className="form-group col-md-12">
                                  {/* <div className="row mt-2">
                                    <div className="col-2">
                                      <RadioGroup
                                        value={selectedOption}
                                        onChange={handleRadioChange}
                                      >
                                        <FormControlLabel
                                          value="agent"
                                          control={<Radio />}
                                          label="Agent"
                                        />
                                      </RadioGroup>
                                    </div>
                                    <div className="col-2">
                                      <RadioGroup
                                        value={selectedOption}
                                        onChange={handleRadioChange}
                                      >
                                        <FormControlLabel
                                          value="manager"
                                          control={<Radio />}
                                          label="Manager"
                                        />
                                      </RadioGroup>
                                    </div>
                                    <div
                                      style={{ marginLeft: "20px" }}
                                      className="col-2"
                                    >
                                      <RadioGroup
                                        value={selectedOption}
                                        onChange={handleRadioChange}
                                      >
                                        <FormControlLabel
                                          value="team"
                                          control={<Radio />}
                                          label="Team"
                                        />
                                      </RadioGroup>
                                    </div>
                                  </div> */}
                                </div>
                                <div className="form-group col-md-12">
                                {agentList.length > 0 && (<>
                                  <label>
                                    {selectedOption === "agent"
                                      ? "Agents"
                                      : selectedOption === "team"
                                      ? "Select Team"
                                      : "Managers"}
                                  </label>
                                  
                                    <div className="mt-1">
                                      <Select
                                        placeholder={`Select ${selectedOption}`}
                                        onChange={handleAgent}
                                        options={agentList}
                                        isLoading={isLoading}
                                        value={selectedAgent}
                                        isMulti={
                                          selectedOption === "agent"
                                            ? true
                                            : false
                                        }
                                        components={
                                          selectedOption === "agent"
                                            ? { Option }
                                            : undefined
                                        }
                                        styles={customStyles}
                                        classNamePrefix="select"
                                        hideSelectedOptions={false}
                                        required
                                      />
                                    </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div
                                className="form-row mt-4"
                                style={{ float: "right" }}
                              >
                                <div
                                  className="form-group col-md-2"
                                  style={{ padding: "0px 50px 0px 50px" }}
                                >
                                  <button
                                    type="submit"
                                    className="btn btn-success"
                                  >
                                    Update
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
