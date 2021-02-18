import { createLocalVue, mount } from '@vue/test-utils'
import CartelError from '@/components/CartelError';
import Vuetify from 'vuetify'

describe('CartelError', () => {
    const localVue = createLocalVue();
    let vuetify;
    let wrapper;

    beforeEach(() => {
        vuetify = new Vuetify();

        wrapper = mount(CartelError, {
            localVue,
            vuetify
        })
    })

    it('should no mostrar el cartel si no esta activado', async () => {
        let alert = wrapper.findComponent({ name: 'v-alert' });

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(alert.exists()).toBeFalsy();
    })

    it('should abrir el cartel con el mensaje provisto', async () => {
        let msg = "Mensaje de Test";

        wrapper.vm.abrirCartel(msg);
        await wrapper.vm.$nextTick();

        let alert = wrapper.findComponent({ name: 'v-alert' });

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(wrapper.vm.$data.mensaje).toBe(msg);
        expect(alert.exists()).toBeTruthy();
        expect(alert.text()).toBe(msg);
    })

    it('should abrir y cerrar el cartel correctamente', async () => {
        let msg = "Mensaje de Test";

        wrapper.vm.abrirCartel(msg);
        await wrapper.vm.$nextTick();

        let alertPostAbrir = wrapper.findComponent({ name: 'v-alert' });

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(wrapper.vm.$data.mensaje).toBe(msg);
        expect(alertPostAbrir.exists()).toBeTruthy();
        expect(alertPostAbrir.text()).toBe(msg);

        wrapper.vm.cerrarCartel();
        await wrapper.vm.$nextTick();

        let alertPostCerrar = wrapper.findComponent({ name: 'v-alert' });

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(alertPostCerrar.exists()).toBeFalsy();
    })

    it('should abrir y cerrar el cartel, emitiendo un evento', async () => {
        let msg = "Mensaje de Test";

        wrapper.vm.abrirCartel(msg);
        await wrapper.vm.$nextTick();

        let alertPostAbrir = wrapper.findComponent({ name: 'v-alert' });

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(wrapper.vm.$data.mensaje).toBe(msg);
        expect(alertPostAbrir.exists()).toBeTruthy();
        expect(alertPostAbrir.text()).toBe(msg);

        wrapper.vm.confirmarOperacion();
        await wrapper.vm.$nextTick();

        let alertPostCerrar = wrapper.findComponent({ name: 'v-alert' });
        let evento = wrapper.emitted('confirmar-operacion');

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(alertPostCerrar.exists()).toBeFalsy();
        expect(evento).toBeTruthy();
    })
})
