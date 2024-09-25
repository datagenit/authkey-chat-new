import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LeftMenu from "../components/LeftMenu";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { BASE_URL2, SOCKET_URL } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Skeleton } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AgentReportPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [report, setReport] = useState({
    live_chat: [],
    total_chat: [],
    new_chat: [],
    total_repeat: [],
    answer_chat: [],
    missed_chat: [],
  });
  const [reportSummary, setReportSummary] = useState([]);
  const [liveAgentsData, setLiveAgentsData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState({
    activeAgent: false,
    chart: false,
    report: false,
  });
  const [selectFilter, setSelectFilter] = useState("thisWeek");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(true);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    if (currentUser.parent_id) {
      socket.emit("setup", currentUser);
    }

    const updateLiveAgent = (data, online) => {
      if (data.user_type !== "agent") return;

      setLiveAgentsData((prevAgents) => {
        if (online) {
          const newAgent = {
            id: data.user_id,
            user_id: data.parent_id,
            name: data.name,
            email: data.email,
            online: 1,
            live_chat: 0,
          };
          if (!prevAgents.some((agent) => agent.id === data.user_id)) {
            return [...prevAgents, newAgent];
          }
        } else {
          return prevAgents.filter((agent) => agent.id !== data.user_id);
        }
        return prevAgents;
      });
    };

    const handleOnlineAgent = (data) => updateLiveAgent(data, true);
    const handleOfflineAgent = (data) => updateLiveAgent(data, false);

    const updateChatStatus = (data, isChatOn) => {
      if (
        !["admin", "manager", "team"].includes(currentUser.user_type) ||
        data.user_type !== "agent"
      ) {
        return;
      }

      const isRelevant = {
        admin: () => true,
        manager: () => currentUser.user_id === data.manager,
        team: () => currentUser.user_id === data.team,
      }[currentUser.user_type]();

      if (!isRelevant) return;

      setReport((prevReport) => ({
        ...prevReport,
        live_chat: isChatOn
          ? [...prevReport.live_chat, { ...data, id: data.user_id }]
          : prevReport.live_chat.filter(
              (user) => user.user_id !== data.user_id
            ),
      }));

      setLiveAgentsData((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === data.user_id
            ? { ...agent, live_chat: isChatOn ? 1 : 0 }
            : agent
        )
      );
    };

    socket.on("online agent", handleOnlineAgent);
    socket.on("offline agent", handleOfflineAgent);
    socket.on("chat on", (data) => updateChatStatus(data, true));
    socket.on("chat off", (data) => updateChatStatus(data, false));

    return () => {
      socket.off("online agent", handleOnlineAgent);
      socket.off("offline agent", handleOfflineAgent);
      socket.off("chat on", (data) => updateChatStatus(data, true));
      socket.off("chat off", (data) => updateChatStatus(data, false));
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!currentUser.parent_id) return;
      setLoading((prevState) => ({ ...prevState, report: true }));

      try {
        const { data } = await axios.post(`${BASE_URL2}/whatsapp_report`, {
          user_id: currentUser.parent_id,
          token: currentUser.parent_token,
          method: "retrieve",
          brand_number: currentUser.brand_number,
          user_type: currentUser.user_type,
          agent_id: currentUser.user_id,
        });
        if (data.success) {
          setReport(data.data);
        }
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      } finally {
        setLoading((prevState) => ({ ...prevState, report: false }));
      }
    };

    const fetchLiveAgents = async () => {
      if (!currentUser.parent_id) return;
      setLoading((prevState) => ({ ...prevState, activeAgent: true }));

      try {
        const { data } = await axios.post(`${BASE_URL2}/whatsapp_agent`, {
          user_id: currentUser.parent_id,
          token: currentUser.parent_token,
          method: "live_agents",
          user_type: currentUser.user_type,
          agent_id: currentUser.user_id,
        });
        if (data.success) {
          setLiveAgentsData(data.data);
        }
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      } finally {
        setLoading((prevState) => ({ ...prevState, activeAgent: false }));
      }
    };

    fetchReport();
    if (currentUser.user_type === "admin") {
      graphReport({ type: "thisWeek" });
    }
    fetchLiveAgents();
  }, [currentUser]);

  const graphReport = useCallback(
    async (filterdata) => {
      if (!currentUser.parent_id) return;
      setLoading((prevState) => ({ ...prevState, chart: true }));

      try {
        const { data } = await axios.post(`${BASE_URL2}/whatsapp_report`, {
          user_id: currentUser.parent_id,
          token: currentUser.parent_token,
          method: "retrieve_report",
          brand_number: currentUser.brand_number,
          user_type: currentUser.user_type,
          filter: filterdata.type,
          from_date: filterdata.from_date,
          to_date: filterdata.to_date,
        });
        if (data.success) {
          setReportSummary(data.data);
        }
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      } finally {
        setLoading((prevState) => ({ ...prevState, chart: false }));
      }
    },
    [currentUser]
  );

  const handleFilterChange = useCallback(
    async (e) => {
      const selectedValue = e.target.value;
      setSelectFilter(selectedValue);
      const filter = { type: selectedValue };
      if(selectedValue!=="custom"){
        await graphReport(filter);
      }
      
    },
    [graphReport]
  );

  const handleDateChange = useCallback(
    async (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      if (end && selectFilter === "custom") {
        setCalendarOpen(false);
        await graphReport({ type: "custom", from_date: start, to_date: end });
      }
    },
    [graphReport, selectFilter]
  );

  const columnsReport = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        width: 100,
        editable: true,
        sortable: true,
      },
      {
        field: "total_chat",
        headerName: "Total Chat",
        width: 90,
        editable: true,
      },
      { field: "new_chat", headerName: "New Chat", sortable: true, width: 90 },
      {
        field: "repeated_chat",
        headerName: "Repeated Chat",
        sortable: true,
        width: 90,
      },
      {
        field: "read_chat",
        headerName: "Read Chat",
        sortable: true,
        width: 90,
      },
      {
        field: "missed_chat",
        headerName: "Missed Chat",
        sortable: true,
        width: 90,
      },
    ],
    []
  );

  const columnsLiveAgents = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 200 },
      { field: "email", headerName: "Email", width: 250 },

      {
        field: "live_chat",
        headerName: "Live Chat",
        width: 100,
        renderCell: (params) => {
          const isChatting = params.row.live_chat === 0;

          return isChatting ? (
            <>
              <div
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                }}
              ></div>
              <span style={{ marginLeft: "8px" }}>Available</span>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                }}
              ></div>
              <span style={{ marginLeft: "8px" }}>Busy</span>
            </>
          );
        },
      },
    ],
    []
  );

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbarFilterButton />
      <GridToolbarQuickFilter debounceMs={500} />
    </GridToolbarContainer>
  );
  const handleOpenCalendar = () => {
    if (startDate && endDate) {
      setCalendarOpen(true);
    }
  };
  const chatTab = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div className="layout-wrapper d-lg-flex">
        <LeftMenu />
        <div className="w-100">
          <Navbar />
          <div className="pb-5">
          <div className="row m-2">
            <div className="col-xl-12 mt-3 ">
              <div className="w-100">
                <div className="row">
                  {[
                    "Live Chat",
                    "Total chats",
                    "New chats",
                    "Repeated chats",
                    "Read Chat",
                    "Unread Chat",
                  ].map((title, index) => (
                    <div className="col-sm-2" key={index}>
                      <div className="card card-shadow">
                        <div className="card-body">
                          <h5 className="card-title mb-4">{title}</h5>
                          <h2 className="mt-1 mb-3">
                            {loading.report ? (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                width={25}
                                height={25}
                              />
                            ) : (
                              report[Object.keys(report)[index]]?.length
                            )}
                          </h2>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-1">
            {currentUser.user_type === "admin" && (
              <div className="col-sm-6 px-2">
                <div className="mb-4 ms-5 d-flex justify-content-between">
                  <div>
                    <button
                      className={`py-1 px-2 ${
                        activeTab === 1 ? "active-chart-btn" : null
                      }`}
                      style={{
                        borderRight: "none",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      }}
                      onClick={() => chatTab(1)}
                    >
                      <i
                        className="bx bx-line-chart"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </button>
                    <button
                      className={`py-1 px-2 ${
                        activeTab === 2 ? "active-chart-btn" : null
                      }`}
                      style={{
                        borderLeft: "none",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                      }}
                      onClick={() => chatTab(2)}
                    >
                      <i
                        className="bx bx-table"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </button>
                  </div>
                  <div className="me-4 w-5 d-flex justify-content-between">
                    <select
                      className="form-select form-select-lg mb-3"
                      aria-label=".form-select-lg example"
                      onChange={handleFilterChange}
                      style={{ cursor: "pointer" }}
                      value={selectFilter}
                    >
                      <option value="thisWeek">This Week</option>
                      <option value="thisMonth">This Month</option>
                      <option value="thisYear">This Year</option>
                      <option value="custom">Custom</option>
                    </select>
                    {selectFilter === "custom" && (
                      <div className="ms-2 w-5" onClick={handleOpenCalendar}>
                        {" "}
                        <DatePicker
                          selected={startDate}
                          onChange={handleDateChange}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          open={calendarOpen}
                          className="form-control"
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select a date range"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {activeTab === 1 && (
                  <ResponsiveContainer width="100%" height={280}>
                    {loading.chart === false ? (
                      <LineChart data={reportSummary}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        <Line
                          type="monotone"
                          dataKey="total_chat"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="new_chat"
                          stroke="#71bcf5"
                        />
                        <Line
                          type="monotone"
                          dataKey="repeated_chat"
                          stroke="#f28ac9"
                        />
                        <Line
                          type="monotone"
                          dataKey="read_chat"
                          stroke="#68f765"
                        />
                        <Line
                          type="monotone"
                          dataKey="unread_chat"
                          stroke="#d61a1a"
                        />
                      </LineChart>
                    ) : (
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width={210}
                        height={60}
                      />
                    )}
                  </ResponsiveContainer>
                )}
                {activeTab === 2 && (
                  <>
                    <Box sx={{ width: "100%" }}>
                      <DataGrid
                        rows={reportSummary}
                        columns={columnsReport}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        getRowId={(row) => row._id}
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                      />
                    </Box>
                  </>
                )}
              </div>
            )}
            <div className="col-sm-6 px-2">
              <div className="px-2">
                <h5>Online Agents</h5>
                <Box sx={{ width: "100%" }}>
                  <DataGrid
                    rows={liveAgentsData}
                    columns={columnsLiveAgents}
                    loading={loading.activeAgent}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    slots={{
                      toolbar: CustomToolbar,
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentReportPage;
