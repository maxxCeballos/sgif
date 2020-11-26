<template>
    <div v-if="show && apagar">
        Componente Test
        <button @click="$emit('select-apagar')">
            Esconder
        </button>
    </div>
</template>

<script>
export default {
    name: "ComponenteTest",
    props: ["show", "apagar"]
}
</script>