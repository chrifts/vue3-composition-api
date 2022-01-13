import { mount } from "@vue/test-utils";
import NewPost from '../../src/components/NewPost.vue';
import { Author, store, User } from '../../src/store';

let routes: string[] = []

jest.mock('vue-router', () => ({
    useRouter: () => {
        return {
            push: (route: string) => {
                routes.push(route)
            }
        }
    }
}))

jest.mock('axios', () => ({
    post: (url: string, payload: any)=> {
        return {
            data: payload
        }
    }
}))

describe('NewPost', () => {

    beforeEach(() => {
        routes = []
    })

    it('creates a user, login, create a post and redirects to /', async () => {
        const user: User = {
            id: '1',
            username: 'Pepe',
            password: '123123123'
        }
        
        await store.createUser(user)

        //assert user is created / logged
        expect(store.getState().authors.ids.length).toBeGreaterThan(0)

        //mount the component with the current store
        const wrapper = mount(NewPost, {
            global: {
                plugins: [store]
            } 
        })

        //a post isn't created yey
        expect(store.getState().posts.ids).toHaveLength(0)

        //now we create a post
        await wrapper.find('[data-test="submit"]').trigger('click')
        
        expect(store.getState().posts.ids).toHaveLength(1)
        
        //and route current path should be / because submit make a push to it
        expect(routes).toEqual(['/'])
    })
})