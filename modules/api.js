import { Security } from "./security.js";

export const API = {
    baseURL: "./animals.json",
    loading: false,

    fetchAnimals: async () => {
        try {
            API.setLoading(true);

            const res = await fetch(API.baseURL, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            return await res.json();

        } catch (err) {
            Security.log("FETCH_ERROR", err.message);
            return [];
        } finally {
            API.setLoading(false);
        }
    },

    fetchZooStatus: async () => {
        try {
            const res = await fetch("./zoo-status.json");
            if (!res.ok) throw new Error("Status failed");
            return await res.json();
        } catch (err) {
            Security.log("STATUS_ERROR", err.message);
            return null;
        }
    },

    fetchVisitors: async () => {
        try {
            const res = await fetch("./visitors.json");
            if (!res.ok) throw new Error("Visitor fetch failed");
            return await res.json();
        } catch (err) {
            Security.log("VISITOR_ERROR", err.message);
            return [];
        }
    },

    setLoading: (state) => {
        API.loading = state;

        const el = document.getElementById("loading");
        if (el) {
            el.textContent = state ? "Loading..." : "";
        }
    }
};