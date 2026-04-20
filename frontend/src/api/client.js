const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang") || "en";

  const headers = {
    "Content-Type": "application/json",
    lang,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unkown error");
  }

  return data;
};

export const apiClient = {
  get: (endpoint) => {
    const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
    return fetch(url, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse);
  },

  post: (endpoint, body) => {
    const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
    return fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse);
  },

  put: (endpoint, body) => {
    const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
    return fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse);
  },
};
