# SGIF
## Sistema de Gestión Fátima

Release correspondiente al trabajo realizado por los alumnos Maximiliano Ceballos y Gastón Vidart para la materia Construcción y Validación de Software. El siguiente release es el backend del frontend realizado en la materia Sistemas de Información para la Web. 

El frontend se encuentra en la release 1.1.0, en el siguiente link: https://github.com/GastonVidart/sgif_react/releases/tag/1.1.0. En el README.md de esa release se encuentran las instrucciones para ejecutar las transacciones.

A continuación se describe las transacciones desarrolladas y como ejecutar los Tests que fueron diseñados para esta materia.

### Transacciones Desarrolladas
*  Alta Curso
*  Registrar Notas Trimestrales
*  Inscribir Alumno
*  Completar Familia Alumno

### Contenido Release
  
En la release se encuentra todo lo necesario para iniciar el backend y hacer los test
Pasos para iniciar backend y ejecutar los tests.

#### Pasos para Ejecutar y Testear
  1. Clonar repositorio.
  2. Ejecutar `$ cd backend`
  3. Ejecutar `$ npm init`
  4. Ejecutar `$ npm i`
  5. Ir al directorio backend: `cd backend`
  6. (Iniciar Backend) `$ npm start`
  7. (Ejecutar Tests)  `$ npm test`
  8. (Ejecutar Istanbul) `$ npm run coverage`    
  >Para visualizar los resultados de istanbul abrir en un buscador el archivo `index.html`
  El archivo se encuentra en la ruta `./backend/coverage/lcov-report/index.html`