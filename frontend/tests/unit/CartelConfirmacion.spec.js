import { createLocalVue, mount } from '@vue/test-utils'
import CartelConfirmacion from '@/components/CartelConfirmacion';
import Vuetify from 'vuetify'

describe('CartelConfirmacion', () => {
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

        wrapper = mount(CartelConfirmacion, {
            localVue,
            vuetify
        })
    })

    it('should no mostrar el cartel inicialmente', () => {
        let card = wrapper.findComponent({ name: 'v-card' });

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(card.exists()).toBeFalsy();
    })

    it('should abrir el cartel con el mensaje provisto', async () => {
        let msg = "Mensaje de Test";

        wrapper.vm.abrirCartel(msg);
        await wrapper.vm.$nextTick();

        let card = wrapper.findComponent({ name: 'v-card' });
        let cardTitle = wrapper.find('.v-card__title');

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(wrapper.vm.$data.titulo).toBe(msg);
        expect(card.isVisible()).toBeTruthy();
        expect(cardTitle.text()).toBe(msg);
    })

    it('should abrir y cerrar el cartel correctamente', async () => {
        wrapper.vm.abrirCartel();
        await wrapper.vm.$nextTick();

        let cardPostAbrir = wrapper.findComponent({ name: 'v-card' });

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(cardPostAbrir.isVisible()).toBeTruthy();

        wrapper.vm.cerrarCartel();
        await wrapper.vm.$nextTick();

        let cardPostCerrar = wrapper.findComponent({ name: 'v-card' });

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(cardPostCerrar.isVisible()).toBeFalsy();
    })

    it('should abrir y cerrar correctamente, emitiendo el evento de confirmacion', async () => {
        wrapper.vm.abrirCartel();
        await wrapper.vm.$nextTick();

        let cardPostAbrir = wrapper.findComponent({ name: 'v-card' });

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(cardPostAbrir.isVisible()).toBeTruthy();

        wrapper.vm.confirmarOperacion();
        await wrapper.vm.$nextTick();

        let cardPostCerrar = wrapper.findComponent({ name: 'v-card' });
        let evento = wrapper.emitted('confirmar-operacion');

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(cardPostCerrar.isVisible()).toBeFalsy();
        expect(evento).toBeTruthy();
    })

    it('should abrir y cerrar correctamente, emitiendo el evento de cancelacion', async () => {
        wrapper.vm.abrirCartel();
        await wrapper.vm.$nextTick();

        let cardPostAbrir = wrapper.findComponent({ name: 'v-card' });

        expect(wrapper.vm.$data.estaActivado).toBeTruthy();
        expect(cardPostAbrir.isVisible()).toBeTruthy();

        wrapper.vm.cancelarOperacion();
        await wrapper.vm.$nextTick();

        let cardPostCerrar = wrapper.findComponent({ name: 'v-card' });
        let evento = wrapper.emitted('cancelar-operacion');

        expect(wrapper.vm.$data.estaActivado).toBeFalsy();
        expect(cardPostCerrar.isVisible()).toBeFalsy();
        expect(evento).toBeTruthy();
    })
})
