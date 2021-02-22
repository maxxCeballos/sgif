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
  2. Ejecutar `$ npm init`
  3. Ejecutar `$ npm i`
  4. Ir al directorio backend: `cd backend`
  5. (Iniciar Backend) `$ npm start`
  6. (Ejecutar Tests)  `$ npm test`
  7. (Ejecutar Istanbul) `$ npm run coverage`    
  >Para visualizar los resultados de istanbul abrir en un buscador el archivo `index.html`
  El archivo se encuentra en la ruta `./backend/coverage/lcov-report/index.html`