<template>
    <div class="navbar">
        <div class="navbar-start">
            <router-link to="/" class="button">
                Home
            </router-link>
        </div>
        <div class="navbar-end">
            <div 
                class="buttons"
                v-if="auth"
            >
                <router-link 
                    class="button"
                    to="/posts/new"
                >
                    New post
                </router-link>

                <button 
                    class="button"
                    @click="signOut"
                >
                    Sign out
                </button>
            </div>

            <div 
                class="buttons"
                v-else
            >
                <button 
                    class="button"
                    @click="signUp"
                    data-test="signUp-btn"
                >
                    Sign up
                </button>
                
                <button 
                    class="button"
                    @click="signIn"
                >
                    Sign in
                </button>
            </div>
        </div>
    </div>
    <teleport to="#modal">
        <component :is="component"/> 
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, h, markRaw } from 'vue';
import { useModal } from '../useModal';
import { useStore } from '../store';
import Signup from './Signup.vue';
import MainLoading from './MainLoading.vue';

export default defineComponent({
    name: "Navbar",
    
    components: { 
        Signup,
        MainLoading
    },

    setup() {
        const modal = useModal();
        const store = useStore();

        const auth = computed(() => {
            return !!store.getState().authors.currentUserId
        })

        const signIn = () => {
            const Demo = defineComponent({
                setup() {
                    return () => h('div', 'Demo') 
                }
            })

            modal.component.value = markRaw(Demo)
            modal.showModal()
        }
        const signUp = () => {
            modal.component.value = markRaw(Signup)
            modal.showModal()
        }
        const signOut = () => {
            modal.cantClose();
            modal.component.value = markRaw(MainLoading)
            modal.showModal()
            setTimeout(()=>{
                store.logout();
            }, 2000)
        }

        return {
            component: modal.component,
            signIn,
            signUp,
            signOut,
            auth,
        }
    }

});
</script>