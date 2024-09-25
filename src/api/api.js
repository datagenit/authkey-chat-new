import axios from "axios";

export const BASE_URL = "https://db2.authkey.io/api";

export const BASE_URL2 = "https://napi.authkey.io/api";
export const BASE_URL3= "https://console.authkey.io/api";
export const BASE_URL4 = "https://api.authkey.io";
export const SOCKET_URL= "https://napi.authkey.io";
export const agentLogin = (data) => {
  return axios.post(`${BASE_URL}/login_agent.php`, data);
};

export const sendMessage = (data) => {
  return axios.post(`${BASE_URL}/netcore_conversation.php`, data);
};




export const generateToken = () => {
  return axios.get(
    `http://3.111.186.211:3000/generateToken?uid=1&key=LMOs3zZa8m`
  );
};
