<template>
    <Alert />
    <div>
        <ul>
            <li>
                Желательно не использовать рисование от руки, т.к. у полигона
                будет слишком много координат, что может сказаться на
                производительности.
            </li>
        </ul>
        <div style="width: 1000px; height: 800px">
            <button @click="intersectsCoordinate">Показать пересечения</button>
            <button @click="modifyControl">
                {{
                    modify_enabled
                        ? "Отключить редактирование"
                        : "Включить редактирование"
                }}
            </button>
            <button @click="saveRegions">Сохранить</button>
            <button @click="deleteRegion">Удалить область</button>
            <button @click="drawFreehand">
                Рисовать от руки ( {{ freehand ? "вкл" : "откл" }})
            </button>
            <button @click="drawEnabled">
                Нарисовать ( {{ draw_enabled ? "вкл" : "откл" }})
            </button>

            <ol-map style="height: 350px">
                <ol-view
                    :center="config.center"
                    :zoom="config.zoom"
                    :projection="config.projection"
                />

                <ol-tile-layer>
                    <ol-source-osm />
                </ol-tile-layer>

                <!-- Координаты регионов -->
                <ol-vector-layer>
                    <ol-source-vector :features="regions">
                        <ol-interaction-modify v-if="modify_enabled" />
                        <ol-interaction-draw
                            v-if="draw_enabled"
                            :stopClick="true"
                            type="Polygon"
                            :freehand="freehand"
                            @drawend="drawend"
                        />
                        <ol-interaction-snap v-if="modify_enabled" />
                    </ol-source-vector>

                    <ol-interaction-select @select="regionSelected">
                        <ol-style>
                            <ol-style-stroke :color="'red'" :width="2" />
                            <ol-style-fill :color="`rgba(255, 0, 0, 0.4)`" />
                        </ol-style>
                    </ol-interaction-select>
                </ol-vector-layer>

                <!-- Координаты продаж. Если больше 10к тогда лагает. Поэтому не отображать -->
                <!-- <ol-vector-layer>
                    <ol-source-vector :features="sales">
                        <ol-style>
                            <ol-style-circle :radius="3">
                                <ol-style-fill color="red"></ol-style-fill>
                            </ol-style-circle>
                        </ol-style>
                    </ol-source-vector>

                    <ol-interaction-select @select="saleSelected">
                        <ol-style>
                            <ol-style-circle :radius="3">
                                <ol-style-fill color="green"></ol-style-fill>
                            </ol-style-circle>
                        </ol-style>
                    </ol-interaction-select>
                </ol-vector-layer> -->
            </ol-map>
        </div>
    </div>
</template>

<script>
import { GeoJSON } from "ol/format";
import Alert from "./components/Alert.vue";
import useMapControls from "@/composition/useMapControls";
import useRegions from "@/composition/useRegions";
import useSales from "@/composition/useSales";

export default {
    components: { Alert },
    setup() {
        const use_map_controls = useMapControls();
        const use_regions = useRegions();
        const use_sales = useSales();

        return Object.assign(use_map_controls, use_regions, use_sales);
    },
    data() {
        return {
            config: {
                projection: "EPSG:4326",
                center: [30.31413, 59.93863],
                zoom: 10,
            },
        };
    },
    methods: {
        // Пересекается ли координата
        intersectsCoordinate() {
            this.regions.forEach((region) => {
                // Очистили массив, он мог сохраниться файл regions.json
                region.setProperties({ region_sales: [] });

                const polygonGeometry = region.getGeometry();
                const sales_features = new GeoJSON().writeFeaturesObject(
                    this.sales
                );

                sales_features.features.forEach((sale) => {
                    const coords = sale.geometry.coordinates;
                    const intersects =
                        polygonGeometry.intersectsCoordinate(coords);

                    // Записали данные Если пересекается
                    if (intersects) {
                        const region_sales =
                            region.getProperties().region_sales;
                        const find_sale = region_sales.find(
                            (region_sale) =>
                                region_sale.id === sale.properties.id
                        );
                        if (!find_sale) region_sales.push(sale.properties);

                        region.setProperties({ region_sales });
                    }
                });

                console.log(region.getId(), region.getProperties());
            });
        },

        // Конец рисования региона
        drawend(event) {
            event.feature.setId(Date.now()); // Присвоили ID новому региону

            this.regions.push(event.feature);
            this.selected_region = event.feature;

            this.draw_enabled = false;
        },
    },
};
</script>
