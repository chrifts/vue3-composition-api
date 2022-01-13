//flushPromise is for axios or third party promises
//nextTick if for internal Vue promises, eg: Reactivity system
import { mount, flushPromises } from '@vue/test-utils'; 
import PostWriter from '../../src/components/PostWriter.vue';

describe('PostWriter', () => {
  it('emits a save event with the new post', async (done) =>  {
    const wrapper = mount(PostWriter, {
      props: {
        post: { //<--- required prop
          title: 'New title',
        }
      }
    });

    await wrapper.find('[data-test="title"]').setValue('My new title'); // setValue is available only if v-model is used
    const $content = wrapper.find<HTMLDivElement>('[data-test="content"]') //in this case, simulate the custom event
    $content.element.innerText = '## New content'; //assign innerText of contenteditable
    await $content.trigger('input'); //await for the event to be triggered

    /*
      timeout is used becuase the debounce in watch method needs 250ms to update the post.html content 
      so we use timeout with 300ms to ensure the execution.
    */
    setTimeout( async() => { 
      await wrapper.find('[data-test="submit"]').trigger('click');

      const emitted = (wrapper.emitted()['save'] as any)[0][0];

      expect(emitted.title).toBe('My new title');
      expect(emitted.markdown).toBe('## New content');
      expect(emitted.html).toBe('<h2 id="new-content">New content</h2>\n');
      /*
        once assertions are made, be aware to execute the "done" callback from "it", 
        otherwhise the test will keep waiting until a timeout exception is excecuted (5000ms at the moment)
      */
      done();
    }, 300);
  });
});