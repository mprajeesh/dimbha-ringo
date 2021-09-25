<template>
  <div>
    <button type="button" @click="onStart" :disabled="startDisable">
      $translation.start
    </button>
    <button type="button" @click="onCallStart" :disabled="callDisable">
      $translation.call
    </button>
    <button type="button" @click="onCallEnd" :disabled="hangDisable">
      $translation.hang
    </button>
  </div>
</template>

<script>
export default {
  name: "RingoControls",
  data() {
    return {
      startDisable: false,
      callDisable: true,
      hangDisable: true,
    };
  },
  methods: {
    onStart() {
      this.startDisable = true;
      this.callDisable = false;
      this.hangDisable = true;
      this.$emit("onstart");
    },
    onCallStart() {
      this.callDisable = true;
      this.hangDisable = false;
      this.$emit("call");
    },
    onCallEnd() {
      this.callDisable = false;
      this.hangDisable = true;
      this.$emit("hang");
    },
  },
};
</script>

<style></style>
