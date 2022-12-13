<template>
    <div class="alert-container">
        <div
            :class="[alert.type, 'alert-item']"
            v-for="alert in alert_store.alerts"
            :key="alert"
        >
            <div class="alert-message">
                {{ alert.message }}
            </div>
            <div class="alert-type-color"></div>
        </div>
    </div>
</template>

<script>
import { useAlertStore } from "@/stores/alert";

export default {
    data() {
        return {
            alert_store: useAlertStore(),
        };
    },
};
</script>

<style>
.alert-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: fixed;
    right: 20px;
    top: 20px;
    z-index: 999;
}
.alert-item {
    border-radius: 3px;
    width: 300px;
    display: flex;
    border: 1px solid #c1c1c1;
    justify-content: space-between;
    background: #ffffff;
}
.alert-type-color {
    max-width: 50px;
    width: 100%;
}
.alert-item.warning .alert-type-color {
    background: #fff68a;
}
.alert-item.success .alert-type-color {
    background: #8cff8a;
}
.alert-item.danger .alert-type-color {
    background: #ff8a8a;
}

.alert-message {
    padding: 5px;
    font-size: 20px;
}
</style>
