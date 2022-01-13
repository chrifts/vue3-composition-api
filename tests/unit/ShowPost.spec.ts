import { flushPromises, mount } from "@vue/test-utils";
import ShowPost from '../../src/components/ShowPost.vue';
import { store, User } from '../../src/store';
import { today } from '../../src/mocks';
import { routerWithStore } from '../../src/router';

jest.mock('axios', () => ({
    get: (url: string) => {    
        return Promise.resolve({
            data: [today]
        })
    },
    post: (url: string, payload: any)=> {
        return {
            data: payload
        }
    }
}))


describe('ShowPost', () => {
    it('does not show edit button when not authenticated', async () => {
        
        await store.createPost(today)

        const router = routerWithStore(store)
        router.push(`/posts/${today.id}`)
        await router.isReady()

        await flushPromises()

        const wrapper = mount(ShowPost, {
            global: {
                plugins: [store, router],
            }
        })

        await flushPromises()
        
        expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false)
    })

    it('does not show edit button when not authorized', async () => {
        await store.createPost(today)
        const user: User = {
            id: '444',
            password: '123123',
            username: 'el pepe'
        }

        await store.createUser(user) //also login the user

        const router = routerWithStore(store)
        router.push(`/posts/${today.id}`)
        await router.isReady()

        await flushPromises()

        const wrapper = mount(ShowPost, {
            global: {
                plugins: [store, router],
            }
        })

        await flushPromises()
        
        expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false)
    })

    it('shows edit button when authorized', async () => {
        await store.createPost(today)
        const user: User = {
            id: '1',
            password: '123123',
            username: 'el pepe'
        }

        await store.createUser(user) //also login the user

        const router = routerWithStore(store)
        router.push(`/posts/${today.id}`)
        await router.isReady()

        await flushPromises()

        const wrapper = mount(ShowPost, {
            global: {
                plugins: [store, router],
            }
        })

        await flushPromises()
        
        expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(true)
    })  
})