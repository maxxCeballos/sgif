import { shallowMount } from '@vue/test-utils'
import axios from 'axios';
import InscribirMesa from '@/views/InscribirMesa.vue';
import CartelError from '@/components/CartelError.vue';
import CartelExito from '@/components/CartelExito.vue';
import CartelConfirmacion from "@/components/CartelConfirmacion.vue";

// NOTE https://vue-test-utils.vuejs.org/guides/testing-async-components.html
// NOTE https://vuejs.org/v2/guide/testing.html
// NOTE https://github.com/vuejs/vue-test-utils/issues/1459 PARA PROBLMA DE SETUP.JS
// NOTE https://www.youtube.com/watch?v=Fbo4pttBZ9k&t=862s TUTORIAL
// NOTE https://www.robinwieruch.de/axios-jest TUTORIAL MOCK AXIOS JEST
// NOTE https://stackoverflow.com/questions/57747392/using-jest-to-mock-multiple-axios-calls/57747655 MOCK MULTIPLE CALLS
// NOTE https://github.com/vuejs/vue-test-utils/issues/327

jest.mock('axios');

let wrapper;

beforeAll(() => {
    const LoadingStub = {
        template: '<div />',
        methods: {
            activar() { },
            desactivar() { },
        }
    }

    wrapper = shallowMount(InscribirMesa, {
        stubs: {
            'CartelError': CartelError,
            'CartelExito': CartelExito,
            "CartelConfirmacion": CartelConfirmacion,
            "Loading": LoadingStub,
        }
    })
})

describe('InscribirMesa', () => {
    it('should mostrar un cartel de error con informacion no encontrada', async () => {
        const mensajeError = "Error de Informacion no encontrada"
        const respuesta = {
            response: {
                status: 404,
                data: {
                    message: mensajeError,
                }
            }
        };

        axios.get.mockImplementationOnce(() => Promise.reject(respuesta));

        await wrapper.vm.obtenerDictados(1234);
        // instanciaBuscadorLegajos.vm.$emit('set-legajo', 1234);
        // await wrapper.vm.$nextTick()

        const instanciaCartelError = wrapper.findComponent(CartelError);

        expect(instanciaCartelError.vm.$data.estaActivado).toBe(true)
        expect(instanciaCartelError.vm.$data.mensaje).toBe(mensajeError)
    })

    it('should mostrar un mensaje de contenido no encontrado', async () => {
        const respuesta = {
            status: 204,
        };

        axios.get.mockImplementationOnce(() => Promise.resolve(respuesta));

        await wrapper.vm.obtenerDictados(1234);

        const instanciaCartelError = wrapper.findComponent(CartelError);

        expect(instanciaCartelError.vm.$data.estaActivado).toBe(true)
    })

    it('should mostrar un mensaje de Mesa de Castigo', async () => {
        const mensajeError = "Error de Mesa de Castigo"
        const respuesta = {
            status: 200,
            data: {
                response: {
                    message: mensajeError
                }
            }
        };

        axios.get.mockImplementationOnce(() => Promise.resolve(respuesta));

        await wrapper.vm.obtenerDictados(1234);

        const instanciaCartelError = wrapper.findComponent(CartelError);

        expect(instanciaCartelError.vm.$data.estaActivado).toBe(true)
        expect(instanciaCartelError.vm.$data.mensaje).toBe(mensajeError)
    })

    it('should mostrar una tabla con los dictados', async () => {
        const idAlumno = "1234";
        const dictados = [
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

        const respuesta = {
            status: 200,
            data: { response: { idAlumno, dictados } }
        };

        axios.get.mockImplementationOnce(() => Promise.resolve(respuesta));

        await wrapper.vm.obtenerDictados(1234);

        expect(wrapper.vm.$data.idAlumno).toBe(idAlumno)
        expect(wrapper.vm.$data.materias).toBe(dictados)
    })

    it('should inscribir correctamente a la materia y no mostrar fecha, hora o aula', async () => {
        const idAlumno = "1234";
        const dictados = [
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

        const respuestaObtenerDictados = {
            status: 200,
            data: { response: { idAlumno, dictados } }
        };

        // Obtiene los dictados
        axios.get.mockImplementationOnce(() => Promise.resolve(respuestaObtenerDictados));
        await wrapper.vm.obtenerDictados(1234);

        // Seleciona uno
        wrapper.vm.selectMateria(dictados[0].id);

        // Confirma la operacion
        let dictadoSeleccionado = {};
        const respuestaRegistrarMesa = {
            status: 200,
            data: {
                response: {
                    acta: 4321,
                    mensaje: "Inscripción Exitosa, será notificado cuando se establezca fecha, hora y aula"
                }
            }
        };
        axios.post.mockImplementationOnce((ip, datosDictadoSeleccionado) => {
            dictadoSeleccionado = datosDictadoSeleccionado;
            return Promise.resolve(respuestaRegistrarMesa)
        });
        const instanciaCartelConfirmacion = wrapper.findComponent(CartelConfirmacion);
        instanciaCartelConfirmacion.vm.$emit('confirmar-operacion');
        await wrapper.vm.$nextTick();

        const instanciaCartelExito = wrapper.findComponent(CartelExito);

        expect(wrapper.vm.$data.idAlumno).toBe(idAlumno)
        expect(wrapper.vm.$data.materias).toBe(dictados)
        expect(wrapper.vm.$data.materiaSeleccionada).toBe(dictados[0])
        expect(dictadoSeleccionado.id).toBe(dictados[0].id)
        expect(dictadoSeleccionado.nombreMateria).toBe(dictados[0].nombreMateria)
        expect(dictadoSeleccionado.anioMateria).toBe(dictados[0].anioMateria)
        expect(dictadoSeleccionado.cicloLectivo).toBe(dictados[0].cicloLectivo)
        expect(instanciaCartelExito.vm.$data.estaActivado).toBe(true)
        expect(instanciaCartelExito.vm.$data.mensaje).toContain(dictados[0].nombreMateria)
        expect(instanciaCartelExito.vm.$data.mensaje)
            .toContain(respuestaRegistrarMesa.data.response.mensaje)
    })

    it('should inscribir correctamente a la materia y mostrar fecha, hora y aula', async () => {
        const idAlumno = "1234";
        const dictados = [
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

        const respuestaObtenerDictados = {
            status: 200,
            data: { response: { idAlumno, dictados } }
        };

        // Obtiene los dictados
        axios.get.mockImplementationOnce(() => Promise.resolve(respuestaObtenerDictados));
        await wrapper.vm.obtenerDictados(1234);

        // Seleciona uno
        wrapper.vm.selectMateria(dictados[0].id);

        // Confirma la operacion
        let dictadoSeleccionado = {};
        let aula = "2";
        let fechaHora = crearFecha(1);

        const respuestaRegistrarMesa = {
            status: 200,
            data: {
                response: {
                    acta: 4321,
                    mensaje: "Inscripción Exitosa",
                    fechaHora: String(fechaHora),
                    aula
                }
            }
        };
        axios.post.mockImplementationOnce((ip, datosDictadoSeleccionado) => {
            dictadoSeleccionado = datosDictadoSeleccionado;
            return Promise.resolve(respuestaRegistrarMesa)
        });
        const instanciaCartelConfirmacion = wrapper.findComponent(CartelConfirmacion);
        instanciaCartelConfirmacion.vm.$emit('confirmar-operacion');
        await wrapper.vm.$nextTick();

        const instanciaCartelExito = wrapper.findComponent(CartelExito);

        expect(wrapper.vm.$data.idAlumno).toBe(idAlumno)
        expect(wrapper.vm.$data.materias).toBe(dictados)
        expect(wrapper.vm.$data.materiaSeleccionada).toBe(dictados[0])
        expect(dictadoSeleccionado.id).toBe(dictados[0].id)
        expect(dictadoSeleccionado.nombreMateria).toBe(dictados[0].nombreMateria)
        expect(dictadoSeleccionado.anioMateria).toBe(dictados[0].anioMateria)
        expect(dictadoSeleccionado.cicloLectivo).toBe(dictados[0].cicloLectivo)
        expect(instanciaCartelExito.vm.$data.estaActivado).toBe(true)
        expect(instanciaCartelExito.vm.$data.mensaje).toContain(dictados[0].nombreMateria)
        expect(instanciaCartelExito.vm.$data.mensaje)
            .toContain(respuestaRegistrarMesa.data.response.mensaje)

        // Escpecificos a mesa completada
        let diaExamen = `${fechaHora.getDate()}/${fechaHora.getMonth() + 1}/${fechaHora.getFullYear()}`;
        let horaExamen = `${fechaHora.getHours()}:${fechaHora.getMinutes()}`;

        expect(instanciaCartelExito.vm.$data.mensaje).toContain(aula)
        expect(instanciaCartelExito.vm.$data.mensaje).toContain(diaExamen)
        expect(instanciaCartelExito.vm.$data.mensaje).toContain(horaExamen)

    })
})

/**
 * Crea una fecha de hoy modificada
 * 
 * @param {*} cantidadMeses la cantidad de meses que se agregan o quitan de la fecha (no debe ser mayor a 12)
 */
function crearFecha(cantidadMeses) {
    if (cantidadMeses > 12 || cantidadMeses < -12) {
        throw "Error en cantidadMeses"
    }

    let fechaHora = new Date();
    let mes = fechaHora.getMonth() + cantidadMeses;

    if (mes >= 12) {
        fechaHora.setYear(fechaHora.getFullYear() + 1);
        fechaHora.setMonth(mes - 12);
    } else if (mes < 0) {
        fechaHora.setYear(fechaHora.getFullYear() - 1);
        fechaHora.setMonth(12 + mes);
    } else {
        fechaHora.setMonth(mes);
    }
    return fechaHora;
}