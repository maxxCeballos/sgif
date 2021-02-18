import { createLocalVue, mount } from '@vue/test-utils'
import TablaInscripcion from '@/components/transacciones/inscribirMesa/TablaInscripcion.vue';
import Vuetify from 'vuetify'

describe('BuscadorLegajos', () => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);
    let vuetify;
    let wrapper;

    beforeEach(() => {
        vuetify = new Vuetify();

        wrapper = mount(TablaInscripcion, {
            localVue,
            vuetify,
            propsData: {
                show: false,
                materias: [],
                isLoading: false,
            }
        })
    })

    it('should no mostrar ninguna card inicialmente', () => {
        expect(wrapper.props("show")).toBeFalsy();
        expect(wrapper.findComponent({ name: "v-card" }).exists()).toBeFalsy();
    })

    it('should mostrar card', async () => {
        wrapper.setProps({ show: true });
        await wrapper.vm.$nextTick();

        expect(wrapper.props("show")).toBeTruthy();
        expect(wrapper.findComponent({ name: "v-card" }).exists()).toBeTruthy();
    })

    it('should mostrar mensaje de que esta cargando', async () => {
        wrapper.setProps({ show: true, isLoading: true });
        await wrapper.vm.$nextTick();

        let table = wrapper.findComponent({ name: "v-data-table" });

        expect(wrapper.props("show")).toBeTruthy();
        expect(wrapper.findComponent({ name: "v-card" }).exists()).toBeTruthy();
        expect(table.exists()).toBeTruthy();
        expect(table.props('loading')).toBeTruthy();
    })

    it('should mostrar mensaje de que esta vacio', async () => {
        wrapper.setProps({ show: true });
        await wrapper.vm.$nextTick();

        expect(wrapper.props("show")).toBeTruthy();
        expect(wrapper.findComponent({ name: "v-card" }).exists()).toBeTruthy();
        expect(wrapper.findComponent({ name: "v-data-table" }).exists()).toBeFalsy();
        expect(wrapper.find('.v-card__title').text()).toBe('Usted no posee Materias para rendir');
    })

    it('should mostrar tabla con los datos enviados y emitir evento con la fila seleccionada',
        async () => {
            let materias = [
                {
                    id: 1,
                    nombreMateria: "Matematicas",
                    anioMateria: 1,
                    cicloLectivo: 2018,
                },
                {
                    id: 2,
                    nombreMateria: "Lengua",
                    anioMateria: 3,
                    cicloLectivo: 2020,
                },
                {
                    id: 3,
                    nombreMateria: "Biologia",
                    anioMateria: 2,
                    cicloLectivo: 2019,
                },
            ];
            wrapper.setProps({ show: true, materias });
            await wrapper.vm.$nextTick();

            let table = wrapper.findComponent({ name: "v-data-table" });

            expect(wrapper.props("show")).toBeTruthy();
            expect(wrapper.findComponent({ name: "v-card" }).exists()).toBeTruthy();
            expect(table.exists()).toBeTruthy();
            expect(table.props('items')).toBe(materias);

            let filas = table.findAll('tr');

            filas.wrappers[1].trigger('click', materias[0]);
            await wrapper.vm.$nextTick();

            let evento = wrapper.emitted('select-materia');

            expect(evento).toBeTruthy();
            expect(evento[0][0]).toBe(materias[0].id)
        })
})