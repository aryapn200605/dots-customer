import axios from "axios";
import { API_URL } from "@env";

export const ApiManager = axios.create({
  baseURL: API_URL + "/api",
  responseType: "json",
  withCredentials: true,
});

export const checktoken = async (token) => {
  try {
    const result = ApiManager(`/check-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
