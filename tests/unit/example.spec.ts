//flushPromise is for axios or third party promises
//nextTick if for internal Vue promises, eg: Reactivity system
import { routerWithStore } from '@/router';
import { mount, flushPromises } from '@vue/test-utils'; 
import { RouterLink } from 'vue-router';
import Timeline from '../../src/components/Timeline.vue';
import { today, thisWeek, thisMonth } from '../../src/mocks';
import { Store } from '../../src/store';

jest.mock('axios', () => ({
  get: (url: string) => {    
    return Promise.resolve({
        data: [today, thisWeek, thisMonth]
    })
  }
}))

function mountTimeline() {
  const store = new Store({
    posts: {
      ids: [],
      all: new Map(),
      loaded: false,
    },
    authors: {
      ids: [],
      all: new Map(),
      loaded: false,
      currentUserId: undefined
    }
  });

  const testComp = {
    components: { Timeline },
    template: `
      <suspense>
        <template #default>
          <timeline />
        </template>
        <template #fallback>
          Loading
        </template>
      </suspense>
    `
  };

  const router = routerWithStore(store)
  
  return mount(testComp, {
    global: {
      plugins: [store, router],
    }
  });
}

describe('Timeline', () => {
  it('renders today post default', async () =>  {
    const wrapper = mountTimeline()
    
    await flushPromises()
      
    expect(wrapper.html()).toContain(today.created.format('Do MMM'))
  });

  it('update when the period "this week" is click', async() =>  {
    const wrapper = mountTimeline()
    
    await flushPromises()

    await wrapper.get('[data-test="This week"]').trigger('click');
  
    expect(wrapper.html()).toContain(today.created.format('Do MMM'));
    expect(wrapper.html()).toContain(thisWeek.created.format('Do MMM'));
  });

  it('update when the period "this month" is click', async() =>  {
    const wrapper = mountTimeline()
    await flushPromises()

    await wrapper.get('[data-test="This month"]').trigger('click');
  
    expect(wrapper.html()).toContain(today.created.format('Do MMM'));
    expect(wrapper.html()).toContain(thisWeek.created.format('Do MMM'));
    expect(wrapper.html()).toContain(thisMonth.created.format('Do MMM'));
  });

});