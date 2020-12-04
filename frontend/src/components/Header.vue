<template>
  <div class="header">
    <div class="header_logo">
      <img src="../assets/fatima.png" alt="logo" />
      <h1>Instituto Nuestra Señora de Fátima</h1>
    </div>

    <div class="perfil_container">
      <div class="company-header-avatar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style >
.header {
  width: 100%;
  height: 80px;
  display: flex;
  background-color: #32f4dc;
  justify-content: space-between;
  align-items: center;
}

.header_logo {
  display: flex;
  align-content: center;
}
.header_logo img {
  float: left;
  width: 100px;
  height: 80px;
  background: white;
}
.header_logo h3 {
  display: inline;
}
.header h1 {
  top: 18px;
  left: 10px;
}

.perfil_container {
  float: right;
}

.company-header-avatar {
  width: 60px;
  height: 60px;
  -webkit-border-radius: 100px;
  -webkit-background-clip: padding-box;
  -moz-border-radius: 60px;
  -moz-background-clip: padding;
  border-radius: 60px;
  background-clip: padding-box;
  margin: 7px 0 0 5px;
  float: left;
  background-size: cover;
  background-position: center center;
  background-image: url("../assets/usuario.png");
}
</style>