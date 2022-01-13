<template>
    <suspense>
        <template #default>
            <timeline/>
        </template>

        <template #fallback>
            <spinner />
        </template>
    </suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Spinner from './Spinner.vue';
import Timeline from './Timeline.vue';

export default defineComponent({
  name: 'App',
  components: {
    Timeline,
    Spinner
  }
});
</script>
