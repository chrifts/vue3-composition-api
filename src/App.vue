<template>
  <div class="modal" :style="style">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div id="modal">
        <!-- Dynamic modal content -->
      </div>
    </div>
    <button
      :style="buttonStyle"
      class="modal-close is-large"
      @click="hide"
    >
    </button>
  </div>

  <section class="section">
    <div class="container">
      <navbar />
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref} from 'vue';
import Navbar from './components/Navbar.vue';
import FormInput from './components/FormInput.vue';
import { useModal } from './useModal';

export default defineComponent({
    name: "App",
    components: { 
      Navbar,
      FormInput
    },

    setup() {
      const modal = useModal()
      
      const style = computed(() => {
        return {
          display: modal.show.value ? 'block' : 'none'
        }
      })

      const buttonStyle = computed(() => {
        return {
          display: modal.dismissable.value ? 'block' : 'none'
        }
      })

      return {      
        style,
        buttonStyle,
        hide: () => modal.hideModal()
      }
    }

});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.column {
  overflow-y: hidden !important;
}
</style>
