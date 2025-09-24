// src/lib/apiClient.ts
// API client used by admin pages
// - baseURL from import.meta.env.VITE_API_BASE_URL || '/'
// - Authorization: Bearer ${localStorage.getItem('adminToken') || ''}
// - JSON headers by default
// - 15s timeout

export const apiClient = {
  baseUrl: (import.meta.env && import.meta.env.VITE_API_BASE_URL) || "/",

  createUrl(endpoint: string) {
    const base = String(this.baseUrl || "/").replace(/\/$/, "");
    const ep = String(endpoint || "").replace(/^\/+/, "");
    return `${base}/${ep}`.replace(/([^:]\/)\/+/, "$1/");
  },

  async request<T = any>(input: string, init: RequestInit = {}): Promise<T> {
    const url = this.createUrl(input);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const callerHeaders = (init.headers as Record<string, string>) || {};

      const token = (() => {
        try {
          return localStorage.getItem("adminToken") || "";
        } catch {
          return "";
        }
      })();

      const isForm = init.body && typeof FormData !== "undefined" && init.body instanceof FormData;

      const headers: Record<string, string> = {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...callerHeaders,
      };

      if (token && !("Authorization" in headers)) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      });

      let text: string | null = null;
      try {
        text = await res.text();
      } catch (e) {
        text = null;
      }

      clearTimeout(timeout);

      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (!res.ok) {
        const err: any = new Error(data?.message || data || `HTTP ${res.status}`);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        const e: any = new Error("Request timed out");
        e.status = 0;
        throw e;
      }
      throw err;
    }
  },

  get<T = any>(input: string) {
    return this.request<T>(input, { method: "GET" });
  },

  post<T = any>(input: string, body?: any) {
    return this.request<T>(input, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T = any>(input: string, body?: any) {
    return this.request<T>(input, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = any>(input: string) {
    return this.request<T>(input, { method: "DELETE" });
  },
};
