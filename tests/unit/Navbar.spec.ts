import { routerWithStore } from "../../src/router";
import { mount } from "@vue/test-utils";
import Navbar from '../../src/components/Navbar.vue';
import Signup from '../../src/components/Signup.vue';
import { store } from '../../src/store';

describe('Navbar', () => {

    it('Show a signup modal via teleport', async () => {
        
        const el = document.createElement('div')
        
        el.id = 'modal'
        document.body.appendChild(el)
        
        const wrapper = mount(Navbar, {
            attachTo: document.body,
            global: {
                components: {
                    RouterLink: {
                        template: `<div></div>`    
                    }
                },
                plugins: [store]
            } 
        })

        await wrapper.find('[data-test="signUp-btn"]').trigger('click')
        
        //now the modal in teleport is open, so we can assert the text of the modal signup
        expect(document.body.outerHTML).toContain('This value is required')
        
        const form = await wrapper.getComponent(Signup)
        await form.get('#Username').setValue('Username')
        await form.get('#Password').setValue('Password')
        
        expect(document.body.outerHTML).not.toContain('This value is required')
        
        await form.trigger('submit.prevent')
    })
})