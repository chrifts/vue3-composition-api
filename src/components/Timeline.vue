<template>
  <div>
    <div class="message is-primary is-margink">
      <div class="message-header">
        <div>Posts for {{currentPeriod.toLocaleLowerCase()}} </div>
      </div>
    </div>
    <nav class="is-primary panel">
      <span class="panel-tabs">
        
        <a 
          v-for="period in periods" 
          :key="period"
          :class="{ 'is-active': period === currentPeriod }"
          :data-test="period"
          @click="setPeriod(period)"
        >
          {{ period }}
        </a>
      </span>
      <timeline-post
        v-for="post in posts"
        :key="post.id"
        :post="post"
        class="panel-block"
      />
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import moment from 'moment';
import { Post } from '../mocks'
import TimelinePost from './TimelinePost.vue';
import { useStore } from '../store';

type Period = 'Today' | 'This week' | 'This month'

export default defineComponent({
  name: 'Timeline',

  components: {
    TimelinePost
  },

  async setup() {
    const periods: Period[] = ['Today', 'This week', 'This month'];
    const currentPeriod = ref<Period>('Today');
    const store = useStore()

    if (!store.getState().posts.loaded) {
      await store.fetchPosts()
    }

    const allPosts: Post[] = store.getState().posts.ids.reduce<Post[]>((acc, id) => {
      const thePost = store.getState().posts.all.get(id);
      if (!thePost) {
        throw Error('Error')
      }
      return acc.concat(thePost);
    }, []);

    const setPeriod = (period: Period) => {
      currentPeriod.value = period;
    }

    const posts = computed(() => {
      return allPosts.filter(post => {
        if (currentPeriod.value === 'Today') {
          return post.created.isAfter(moment().subtract(1, 'day'));
        }

        if (currentPeriod.value === 'This week') {
          return post.created.isAfter(moment().subtract(1, 'week'));
        }

        if (currentPeriod.value === 'This month') {
          return post.created.isAfter(moment().subtract(1, 'month'));
        }

        return false;
      });
    })
    
    return {
      periods,
      setPeriod,
      currentPeriod,
      posts,
    }
  }
});
</script>