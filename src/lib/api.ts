// const getApiUrl = () => {
//   if (typeof window !== "undefined") {
//     return (
//       import.meta.env.VITE_API_URL ||
//       import.meta.env.VITE_API_BASE_URL ||
//       "http://localhost:8000/api"
//     );
//   }
//   return "http://localhost:8000/api";
// };

const getApiUrlHosting = () => {
  if (typeof window !== "undefined") {
    return (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "https://sandybrown-kangaroo-261517.hostingersite.com/api"
    );
  }
  return "https://sandybrown-kangaroo-261517.hostingersite.com/api";
};

// export const API_URL = getApiUrl();
export const API_URL = getApiUrlHosting();

export const getImageBaseUrl = () => {
  if (typeof window !== "undefined") {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "https://sandybrown-kangaroo-261517.hostingersite.com/api";
    return apiUrl.replace("/api", "");
  }
  return "https://sandybrown-kangaroo-261517.hostingersite.com";
};

export const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
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

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
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

  put: async (endpoint: string, body: any) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }
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

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
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

  uploadFile: async (endpoint: string, file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }
      let errorData;
      try {
        const errorText = await res.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: "Gagal mengupload gambar" };
      }
      const error: any = new Error(
        errorData.message || "Gagal mengupload gambar"
      );
      error.response = errorData;
      error.status = res.status;
      throw error;
    }
    return res.json();
  },
};
