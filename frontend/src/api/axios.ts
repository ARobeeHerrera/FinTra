import axios from "axios";
import { backEndURL } from "../constant/constants";

const api = axios.create({
  baseURL: backEndURL,
  withCredentials: true,
})

export default api