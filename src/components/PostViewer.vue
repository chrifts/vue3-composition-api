<template>
    <div class="columns">
        <div class="column" />
        <div class="column is-two-thirds">
            <router-link 
                v-if="canEdit"
                class="button is-link is-rounded"
                :to="`/posts/${post.id}/edit`"
                data-test="can-edit"
            >
                Edit
            </router-link>
            <h1>{{ post.title }}</h1>
            <div v-html="post.html" />
        </div>
        <div class="column" />
    </div>
</template>

<script lang="ts">
import { routerWithStore } from '@/router';
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../store';

export default defineComponent({
  name: 'PostViewer',
  
  async setup() {
    const store = useStore();
    const router = useRouter();
    const id = useRoute().params.id as string;

    if (!store.getState().posts.loaded) {
        await store.fetchPosts();
    }

    const post = store.getState().posts.all.get(id)
     
    if (!post) {
        router.push('/');
        throw Error('Post not found');
    }
    
    const canEdit = post.authorId === store.getState().authors.currentUserId
    
    return {
        post,
        canEdit
    }
  }
});
</script>