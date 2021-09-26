<template>
  <div>
    <video class="video-local" autoplay ref="localVideo"></video>
    <video autoplay="video-remote" ref="remoteVideo"></video>
    <ringo-controls @call="onCallStart" @hang="onCallEnd" />
  </div>
</template>

<script>
import RingoControls from "./RingoControls.vue";
import trace from "../utilities/debug";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "RingoCaller",
  components: { RingoControls },
  mounted() {
    this.startAction();
  },
  computed: {
    ...mapGetters("caller", ["getLocalStream", "getRemoteStream"]),
  },
  watch: {
    getLocalStream(stream) {
      this.$refs.localVideo.srcObject = stream;
    },
    getRemoteStream(stream) {
      this.$refs.remoteVideo.srcObject = stream;
    },
  },
  methods: {
    ...mapActions("caller", ["startAction", "callStart", "callEnd"]),
    onCallStart() {
      trace("Starting call.");
      this.callStart();
    },
    onCallEnd() {
      this.callEnd();
    },
    onCallRecieve(stream) {
      this.gotLocalMediaStream(stream);
      trace("Remote peer connection received remote stream.");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.video-local,
.video-remote {
  width: 45%;
}
</style>
