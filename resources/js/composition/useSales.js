import { ref, onMounted } from "vue";
import { GeoJSON } from "ol/format";
import { useAlertStore } from "@/stores/alert";

export default function () {
    const alert_store = useAlertStore();

    let sales = ref(null);
    let geojsonObject = {
        type: "FeatureCollection",
        features: null,
    };

    // Получаем продажи и рисуем их на карте
    const getSales = () => {
        axios.get("/sales").then((response) => {
            if (response.data.status === false) {
                alert_store.danger(response.data.message);
                return;
            }

            geojsonObject.features = response.data;
            sales.value = new GeoJSON().readFeatures(geojsonObject);
        });
    };

    // Выделение продажи
    const saleSelected = (event) => {
        const selected_sales = event.target.getFeatures();

        selected_sales.forEach((feature) => {
            console.log(feature.getProperties());
        });
    };

    onMounted(() => getSales());

    return {
        sales,
        saleSelected,
    };
}
