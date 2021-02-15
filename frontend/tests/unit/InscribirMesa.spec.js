import { mount, shallowMount } from '@vue/test-utils'
import axios from 'axios';
import InscribirMesa from '@/views/InscribirMesa.vue';
import CartelError from '@/components/CartelError.vue';
import CartelExito from '@/components/CartelExito.vue';

// NOTE https://vue-test-utils.vuejs.org/guides/testing-async-components.html
// NOTE https://vuejs.org/v2/guide/testing.html
// NOTE https://github.com/vuejs/vue-test-utils/issues/1459 PARA PROBLMA DE SETUP.JS
// NOTE https://www.youtube.com/watch?v=Fbo4pttBZ9k&t=862s TUTORIAL
// NOTE https://www.robinwieruch.de/axios-jest TUTORIAL MOCK AXIOS JEST
// NOTE https://stackoverflow.com/questions/57747392/using-jest-to-mock-multiple-axios-calls/57747655 MOCK MULTIPLE CALLS

jest.mock('axios');

let wrapper;

beforeAll(() => {
    wrapper = shallowMount(InscribirMesa, {
        stubs: {
            'CartelError': CartelError,
            'CartelExito': CartelExito,
        }
    })
})

describe('InscribirMesa', () => {
    it('should mostrar un cartel de error con el mensaje enviado', async () => {
        const mensajeError = "Error de Test"
        const errorRespuesta = {
            response: {
                data: {
                    expanded: {
                        status: 204,
                        message: mensajeError
                    }
                }
            }
        };

        axios.get.mockImplementationOnce(() => Promise.reject(errorRespuesta));

        await wrapper.vm.obtenerDictados(1234);
        // instanciaBuscadorLegajos.vm.$emit('set-legajo', 1234);
        // await wrapper.vm.$nextTick()

        const instanciaCartelError = wrapper.findComponent(CartelError);

        expect(instanciaCartelError.vm.$data.estaActivado).toBe(true)
        expect(instanciaCartelError.vm.$data.mensaje).toBe(mensajeError)
    })
})
