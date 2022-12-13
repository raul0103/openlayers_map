import { defineStore } from "pinia";

export const useAlertStore = defineStore("counter", {
    state: () => {
        return { alerts: [], timeout: 4000 };
    },

    actions: {
        success(message) {
            this.set({ type: "success", message });
        },
        warning(message) {
            this.set({ type: "warning", message });
        },
        danger(message) {
            this.set({ type: "danger", message });
        },
        set(data) {
            this.alerts.push(data);
            setTimeout(() => {
                this.alerts.shift();
            }, this.timeout);
        },
    },
});
