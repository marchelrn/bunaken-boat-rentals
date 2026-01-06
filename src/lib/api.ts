const BASE_URL = "https://bunakencharter.up.railway.app/";

export const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }
      throw new Error(await res.text());
    }
    return res.json();
  },

  post: async (endpoint: string, body: any) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  },

  put: async (endpoint: string, body: any) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  },

  delete: async (endpoint: string) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  },
};
