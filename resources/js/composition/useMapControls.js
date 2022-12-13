import { ref } from "vue";

export default function () {
    let freehand = ref(false);
    let modify_enabled = ref(false);
    let draw_enabled = ref(false);

    // Редактирование области
    const modifyControl = () => {
        modify_enabled.value = !modify_enabled.value;
    };

    // Рисование от руки
    const drawFreehand = () => {
        freehand.value = !freehand.value;
    };

    // Рисование
    const drawEnabled = () => {
        draw_enabled.value = !draw_enabled.value;
    };

    return {
        freehand,
        modify_enabled,
        draw_enabled,
        modifyControl,
        drawFreehand,
        drawEnabled,
    };
}
