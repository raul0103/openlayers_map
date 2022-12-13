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
                </ol-vector-layer>

                <ol-interaction-select @select="regionSelected">
                    <ol-style>
                        <ol-style-stroke
                            :color="'red'"
                            :width="2"
                        ></ol-style-stroke>
                        <ol-style-fill
                            :color="`rgba(255, 0, 0, 0.4)`"
                        ></ol-style-fill>
                    </ol-style>
                </ol-interaction-select>
            </ol-map>
        </div>
    </div>
</template>

<script>
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import useMapControls from "@/composition/useMapControls";
import useRegionActions from "@/composition/useRegionActions";
import Alert from "./components/Alert.vue";

export default {
    components: { Alert },
    setup() {
        const map_controls = useMapControls();
        const region_actions = useRegionActions();

        return Object.assign(map_controls, region_actions);
    },
    data() {
        return {
            config: {
                projection: "EPSG:4326",
                center: [-102.13121, 40.2436],
                zoom: 5,
            },
        };
    },
    methods: {
        // Добавляем стили
        setFeatureStyle() {
            // Для полигона

            // const selected_polygon_style = new Style({
            //   radius: 10,
            //   stroke: new Stroke({
            //     color: "red",
            //     width: 3,
            //   }),
            //   fill: new Fill({
            //     color: "rgba(0, 0, 255, 0.4)",
            //   }),
            // });

            // Для точки
            const selected_polygon_style = new Style({
                image: new CircleStyle({
                    radius: 10,
                    fill: new Fill({ color: "red" }),
                    stroke: new Stroke({ color: "#bada55", width: 1 }),
                }),
            });

            this.regions.forEach((feature) => {
                if (feature.id_ === "point") {
                    feature.setStyle(selected_polygon_style);
                }
            });
        },

        // Пересекается ли координата
        intersectsCoordinate() {
            this.regions.forEach((feature) => {
                const polygonGeometry = feature.getGeometry();
                const coords = features[2].geometry.coordinates;
                const result = polygonGeometry.intersectsCoordinate(coords);

                if (result) {
                    feature.setProperties({ test: 123 }); // Записали данные что есть координата
                }
            });
        },

        // Конец рисования региона
        drawend(event) {
            event.feature.setId(Date.now()); // Присвоили ID новому региону

            this.regions.push(event.feature);
            this.selected_region = event.feature;

            this.draw_enabled = false;
        },

        // Получаем точки которые пересекаются с регионом
        getIntersects() {
            this.selected_region.forEach((region) => {
                console.log(region.getProperties());
            });
        },
    },
};
</script>
