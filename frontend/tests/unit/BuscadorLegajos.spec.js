import { createLocalVue, mount } from '@vue/test-utils'
import BuscadorLegajos from '@/components/BuscadorLegajos.vue';
import Vuetify from 'vuetify'

describe('BuscadorLegajos', () => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);
    let vuetify;
    let wrapper;

    beforeEach(() => {
        vuetify = new Vuetify();

        wrapper = mount(BuscadorLegajos, {
            localVue,
            vuetify
        })
    })

    it('should enviar el legajo cuando se realiza un click', async () => {
        const legajo = "1234"

        const textField = wrapper.find("input[type=\"text\"]");
        textField.setValue(legajo);
        let btn = wrapper.findComponent({ name: 'v-btn' });

        textField.value = legajo;
        btn.trigger('click');
        await wrapper.vm.$nextTick()

        let evento = wrapper.emitted('set-legajo');

        expect(evento).toBeTruthy();
        expect(evento[0][0]).toBe(legajo);
    })

    it('should enviar el legajo cuando se activa el submit', async () => {
        const wrapper = mount(BuscadorLegajos, {
            localVue,
            vuetify
        })

        const legajo = "1234"

        const textField = wrapper.find("input[type=\"text\"]");
        textField.setValue(legajo);
        let form = wrapper.findComponent({ name: 'v-form' });

        textField.value = legajo;
        form.trigger('submit');
        await wrapper.vm.$nextTick()

        let evento = wrapper.emitted('set-legajo');

        expect(evento).toBeTruthy();
        expect(evento[0][0]).toBe(legajo);
    })
})
