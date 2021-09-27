<template>
  <div>
    <button type="button" @click="onCallStart" :disabled="callDisable">
      $translation.controls.call
    </button>
    <button type="button" @click="onCallEnd" :disabled="hangDisable">
      $translation.controls.hang
    </button>
  </div>
</template>

<script>
export default {
  name: "RingoControls",
  data() {
    return {
      callDisable: false,
      hangDisable: true,
    };
  },
  methods: {
    async onCallStart() {
      this.callDisable = true;
      this.hangDisable = false;
      await this.$emit("call");
    },
    async onCallEnd() {
      this.callDisable = false;
      this.hangDisable = true;
      await this.$emit("hang");
    },
  },
};
</script>

<style></style>
