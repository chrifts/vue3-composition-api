<template>
    <post-writer 
        :post="post" 
        @save="save"
    />
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { useStore } from '../store';
import { useRoute, useRouter } from 'vue-router';
import { Post } from '../mocks';
import PostWriter from './PostWriter.vue';

export default defineComponent({
    name: "PostEditor",

    components: {
        PostWriter
    },

    async setup() {
        const store = useStore()
        const router = useRouter()
        const id = useRoute().params.id as string

        if (!store.getState().posts.loaded) {
            await store.fetchPosts()
        }

        const post = store.getState().posts.all.get(id)

        if (!post) {
            throw Error('post was not found')
        }

        if (post.authorId !== store.getState().authors.currentUserId) {
            router.push('/')
        }

        const save = async (post: Post) => {
            await store.updatePost(post);
            router.push('/')
        }

        return {
            save,
            post
        }
    }
});
</script>
