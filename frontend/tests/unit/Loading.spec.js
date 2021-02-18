import { createLocalVue, mount } from '@vue/test-utils'
import Loading from '@/components/Loading';
import Vuetify from 'vuetify'

describe('Loading', () => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);
    let vuetify;
    let wrapper;

    // Para evitar que informe una advertencia de data-app
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.append(app);

    beforeEach(() => {
        vuetify = new Vuetify();

        wrapper = mount(Loading, {
            localVue,
            vuetify
        })
    })

    it('should no mostrar el cartel inicialmente', () => {
        expect(wrapper.vm.$data.dialog).toBeFalsy();
    })

    it('should abrir el cartel', async () => {
        wrapper.vm.activar();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$data.dialog).toBeTruthy();
    })

    it('should abrir y cerrar el cartel correctamente', async () => {
        wrapper.vm.activar();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$data.dialog).toBeTruthy();

        wrapper.vm.desactivar();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$data.dialog).toBeFalsy();
    })
})
