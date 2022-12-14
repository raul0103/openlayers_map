import { ref, onMounted } from "vue";
import { GeoJSON } from "ol/format";
import { useAlertStore } from "@/stores/alert";

export default function () {
    const alert_store = useAlertStore();

    let regions = ref(null);
    let selected_region = ref(null);
    let geojsonObject = {
        type: "FeatureCollection",
        features: null,
    };

    // Удаление элементов
    const deleteRegion = () => {
        if (!selected_region.value) {
            alert_store.warning("Регион не выбран");
            return;
        }

        const drawn_regions = new GeoJSON().writeFeaturesObject(regions.value);
        selected_region.value.forEach((region) => {
            geojsonObject.features = drawn_regions.features.filter(
                (drawn_regions) => drawn_regions.id !== region.getId()
            );
        });

        regions.value = new GeoJSON().readFeatures(geojsonObject);
    };

    // Сохранить массив регионов
    const saveRegions = () => {
        const drawn_regions = new GeoJSON().writeFeaturesObject(regions.value);
        axios
            .post("/regions", {
                regions: drawn_regions.features,
            })
            .then((response) => {
                if (response.data.status) {
                    alert_store.success(response.data.message);
                } else {
                    alert_store.danger(response.data.message);
                }
            });
    };

    // Выделение региона
    const regionSelected = (event) => {
        selected_region.value = event.target.getFeatures();
    };

    // Получаем регионы и рисуем их на карте
    const getRegions = () => {
        axios.get("/regions").then((response) => {
            if (response.data.status === false) {
                alert_store.danger(response.data.message);
                return;
            }

            geojsonObject.features = response.data;
            regions.value = new GeoJSON().readFeatures(geojsonObject);
        });
    };

    onMounted(() => getRegions());

    return {
        regions,
        selected_region,
        deleteRegion,
        saveRegions,
        regionSelected,
    };
}
