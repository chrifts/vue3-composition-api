import axios from "axios"
import { reactive, readonly, provide, inject, App } from "vue"
import { Post } from './mocks'
import { getCookie, setCookie } from "./cookies"

export interface User {
    id: string,
    username: string,
    password: string
}

export type Author = Omit<User, 'password'>

interface BaseState<T> {
    ids: string[],
    all: Map<string, T>,
    loaded: boolean
}

type PostsState = BaseState<Post>
interface AuthorState extends BaseState<Author> {
    currentUserId: string | undefined
}

export interface State {
    authors: AuthorState,
    posts: PostsState
}

export const storeKey = Symbol('store')

export class Store {
    private state: State

    constructor(initial: State) {
        this.state = reactive(initial)
    }

    install(app: App) {
        app.provide(storeKey, this)
    }

    getState() {
        return readonly(this.state)
    }

    async fetchPosts() {
        const response = await axios.get('/posts');

        const postsState: PostsState = {
            ids: [],
            all: new Map,
            loaded: true,
        }

        for (const post of response.data) {
            postsState.ids.push(post.id);
            postsState.all.set(post.id, post);
        }

        this.state.posts = postsState;
    }

    async createPost(post: Post) {
        const response = await axios.post<Post>('/posts', post);
        this.state.posts.all.set(response.data.id, response.data)
        this.state.posts.ids.push(response.data.id)
    }

    async updatePost(post: Post) {
        const response = await axios.put<Post>('/posts', post);
        this.state.posts.all.set(response.data.id, response.data)
    }

    async createUser(user: User) {
        const response = await axios.post<Author>('/users', user);
        this.state.authors.all.set(response.data.id, response.data)
        this.state.authors.ids.push(response.data.id)
        this.state.authors.currentUserId = response.data.id
        setCookie('currentUserId', response.data.id, 180)
    }

    logout() {
        setCookie('currentUserId', '', 0)
        this.state.authors.currentUserId = undefined;
        window.location.href = '/'
    }
}

export const store = new Store({
    authors: {
        all: new Map<string, Author>(),
        ids: [],
        loaded: false,
        currentUserId: getCookie('currentUserId') ?? undefined
    },
    posts: {
        all: new Map(),
        ids: [],
        loaded: false
    }
})

export function useStore(): Store {
    const _store = inject<Store>(storeKey);
    
    if (!_store) {
        throw Error('Did you forgot to call provide?')
    }

    return store;
}