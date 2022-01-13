import { ref } from 'vue'

const show = ref(false);
const component = ref();
const dismissable = ref(true);

export function useModal() {
    return {
        component,
        show,
        dismissable,
        cantClose: () => dismissable.value = false,
        showModal: () => show.value = true,
        hideModal: () => show.value = false,
    }
}