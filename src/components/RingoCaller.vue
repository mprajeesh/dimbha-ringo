<template>
  <div>
    <video autoplay ref="localVideo"></video>
    <ringo-controls @onstart="onStart" @call="onCallStart" @hang="onCallEnd" />
  </div>
</template>

<script>
import connection from "../helper/connection";
import RingoControls from "@components/RingoControls.vue";

export default {
  name: "RingoCaller",
  components: { RingoControls },
  mounted() {
    //   // Initializes media stream.
    //   navigator.mediaDevices
    //     .getUserMedia(this.mediaStreamConstraints)
    //     .then(this.gotLocalMediaStream)
    //     .catch(this.handleLocalMediaStreamError);

    this.localConnection = connection();
  },
  data() {
    return {
      mediaStreamConstraints: { video: true, audio: false },
      localStream: null,
      localConnection: null,
      startTime: null,
    };
  },
  methods: {
    // Sets the MediaStream as the video element src.
    gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream;
      this.$refs.localVideo.srcObject = mediaStream;
    },
    // Handles error by logging a message to the console with the error message.
    handleLocalMediaStreamError(error) {
      trace(`navigator.getUserMedia error: ${error.toString()}.`);
    },
    // Handles start button action: creates local MediaStream.
    onStart() {
      navigator.mediaDevices
        .getUserMedia(this.mediaStreamConstraints)
        .then(this.gotLocalMediaStream)
        .catch(this.handleLocalMediaStreamError);
      trace("Requesting local stream.");
    },
    onCallStart() {
      trace("Starting call.");
      this.startTime = window.performance.now();

      // Get local media stream tracks.
      const videoTracks = this.localStream.getVideoTracks();
      const audioTracks = this.localStream.getAudioTracks();
      if (videoTracks.length > 0) {
        trace(`Using video device: ${videoTracks[0].label}.`);
      }
      if (audioTracks.length > 0) {
        trace(`Using audio device: ${audioTracks[0].label}.`);
      }

      // Create peer connections and add behavior.
      this.localPeerConnection = connection();
    },
    onCallRecieve(stream){
      this.gotLocalMediaStream(stream);
      trace('Remote peer connection received remote stream.');
    }
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
