<template>
  <div class="sidebar">
    <h2>Menu</h2>
    <ul>
      <h3>
        Alumnos</h3>
        <ul>
          <li v-for="item in alumnos" :key="item.id">
            <a href="#">{{ item }}</a>
          </li>
        </ul>
      
      <h3>
        Curso</h3>
        <ul>
          <li v-for="item in curso" :key="item.id">
            <a href="#">{{ item }}</a>
          </li>
        </ul>
      
      <h3>
        Mesas de Examen</h3>
        <ul>
            <li><a href="#">Inscribir Alumno en Mesa de Examen</a></li>
           <router-link :to="{name: 'transaccionADME' }"><li>Agregar Datos Mesa de Examen</li></router-link>
            <li><a href="#">Cerrar Mesa de Examen</a></li>

          </ul>
     
    </ul>

  </div>

</template>


<script>
//<router-link :to="{name:transaccionADME}" }> <li>Agregar Datos Mesa de Examen</li></router-link>
export default {
  name: "Sidebar",
  data: function () {
    return {
      alumnos: [
        "Consultar Informacion",
        "Inscribir Alumno",
        "Modificar Datos Alumno",
        "Reinscribir Alumno",
      ],
      curso: ["Consultar Imformación", "Crear Curso"],
      mesa: [
        "Inscribir Alumno en Mesa de Examen",
        "Agregar Datos Mesa de Examen",
        "Cerrar Mesas de Examen",
      ],
    };
  },
};
</script>

<style>
.wrapper .sidebar {
  width: auto;
  height: auto;
  background: #32f4dc;
  padding: 30px 0px;
  float: left;
}

.wrapper .sidebar h2 {
  color: #0e332f;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 30px;
}



.wrapper .sidebar ul li {
  color: #0e332f;
  padding: 15px;
  text-align:left
}
/*La lista cuando se pone el cursor sobre ella*/
.wrapper .sidebar ul li:hover {
  background-color: #594f8d;
  color: #32f4dc;
  display: block;
}

/*Los enlaces de los item lista*/
.wrapper .sidebar ul li a {
  color: #0e332f;
  display: block;
  width: 100%;
}
/*Los enlaces de los item lista cuando se pone el cursor sobre ellos*/
.wrapper .sidebar ul li a:hover {
  color: #32f4dc;
  display: block;
}

.wrapper .sidebar ul li a .fas {
  width: 25px;
}
</style>