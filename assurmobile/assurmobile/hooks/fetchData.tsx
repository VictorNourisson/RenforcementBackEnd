import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type Headers = {
  Accept: string;
  "Content-type": string;
  Authorization?: string;
};

const API_BASE_URL_CONST = "http://localhost:3000/api";

export default async function fetchData(
  path: string,
  method: string,
  body?: object,
  useToken?: boolean,
) {
  const token = await AsyncStorage.getItem("token");
  // const endpoint = "http://172.23.62.245:3000/api";
  console.log("API BASE URL", API_BASE_URL_CONST);
  console.log("API base URL 2", process.env);
  const endpoint = API_BASE_URL_CONST;
  const headers: Headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  if (token !== undefined && useToken) {
    headers["Authorization"] = "Bearer " + token;
  }
  return fetch(endpoint + path, {
    headers,
    method,
    ...(body && method !== "GET" ? { body: JSON.stringify(body) } : {}),
  })
    .then((response) => {
      if (response.status === 401 || response.status === 403) {
        console.log("Error, access denied !");
        router.push({ pathname: "/login" });
        return;
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Error on fetch, " + error.message);
      throw Error("Error on fetch, " + error.message);
    });
}