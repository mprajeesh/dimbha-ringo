<template>
  <video autoplay ref="localVideo"></video>
</template>

<script>
export default {
  name: "RingoCaller",
  mounted() {
    // Initializes media stream.
    navigator.mediaDevices
      .getUserMedia(this.mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .catch(this.handleLocalMediaStreamError);
  },
  data() {
    return {
      mediaStreamConstraints: { video: true, audio: false },
      localStream: null,
    };
  },
  methods: {
    gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream;
      this.$refs.localVideo.srcObject = mediaStream;
    },
    // Handles error by logging a message to the console with the error message.
    handleLocalMediaStreamError(error) {
      console.log("navigator.getUserMedia error: ", error);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
video {
  max-width: 100%;
  min-width: 320px;
}
</style>
