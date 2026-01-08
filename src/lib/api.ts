const BASE_URL = "https://bunakencharter.up.railway.app/api";

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
      let errorData;
      try {
        const errorText = await res.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: "Terjadi kesalahan saat mengubah password" };
      }
      const error: any = new Error(errorData.message || "Terjadi kesalahan");
      error.response = errorData;
      error.status = res.status;
      throw error;
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

  uploadFile: async (endpoint: string, file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      let errorData;
      try {
        const errorText = await res.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: "Gagal mengupload gambar" };
      }
      const error: any = new Error(errorData.message || "Gagal mengupload gambar");
      error.response = errorData;
      error.status = res.status;
      throw error;
    }
    return res.json();
  },
};
