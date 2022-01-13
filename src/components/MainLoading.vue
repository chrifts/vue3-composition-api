<template>
    <div class="fullscreen">
        <div class="columns">
            <div class="column">
                <Spinner />
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spinner from "./Spinner.vue";

export default defineComponent({
    components: { Spinner },
    props: {
        text: {
            type: String,
            required: false
        }
    },

    setup(props) {
        const text = props.text
        return {
            text
        }
    }
})
</script>

<style scoped>
.fullscreen {
    background-color: white;
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    text-align: center;
}
</style>