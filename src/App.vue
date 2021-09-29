<template>
  <main class="app">
    <ringo-caller />
  </main>
</template>

<script>
import RingoCaller from "@/components/RingoCaller";
export default {
  name: "App",
  components: { RingoCaller },
};
</script>

<style lang="scss">
@import "./styles/_app.scss";
</style>
