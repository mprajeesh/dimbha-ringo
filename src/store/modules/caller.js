import trace from "@/utilities/debug";

export default {
  namespaced: true,
  // Initial State
  state: {
    localStream: null,
    remoteStream: null,
    localPeerConnection: null,
    remotePeerConnection: null,
    // For now, will be streaming video only: "video: true".
    // Audio will not be streamed because it is set to "audio: false" by default
    mediaStreamConstraints: {
      video: true,
    },
    // Set up to exchange only video.
    offerOptions: {
      offerToReceiveVideo: 1,
    },
    // Define initial start time of the call (defined as connection between peers).
    startTime: null,
  },
  //getters
  getters: {
    // Gets the "other" peer connection.
    getOtherPeer(state, peerConnection) {
      return peerConnection === state.localPeerConnection
        ? state.remotePeerConnection
        : state.localPeerConnection;
    },

    // Gets the name of a certain peer connection.
    getPeerName(state, peerConnection) {
      return peerConnection === state.localPeerConnection
        ? "localPeerConnection"
        : "remotePeerConnection";
    },
    getLocalStream(state) {
      return state.localStream;
    },
    getRemoteStream(state) {
      return state.remoteStream;
    },
  },
  //mutations
  mutations: {
    // Define MediaStreams callbacks.

    // Sets the MediaStream as the video element src.
    gotLocalMediaStream(state, mediaStream) {
      state.localStream = mediaStream;
      trace("Received local stream.");
    },
    // Handles error by logging a message to the console.
    handleLocalMediaStreamError(state, error) {
      trace(`navigator.getUserMedia error: ${error.toString()}.`);
    },
    // Handles remote MediaStream success by adding it as the remoteVideo src.
    gotRemoteMediaStream(state, event) {
      state.remoteStream = event.stream;
      trace("Remote peer connection received remote stream.");
    },
    // Add behavior for video streams.

    // Logs changes to the connection state.
    handleConnectionChange(state, event) {
      const peerConnection = event.target;
      console.log("ICE state change event: ", event);
      trace(
        `${getPeerName(state, peerConnection)} ICE state: ` +
          `${peerConnection.iceConnectionState}.`
      );
    },

    // Logs error when setting session description fails.
    setSessionDescriptionError(state, error) {
      trace(`Failed to create session description: ${error.toString()}.`);
    },

    // Logs success when localDescription is set.
    setLocalDescriptionSuccess(state, peerConnection) {
      setDescriptionSuccess(peerConnection, "setLocalDescription");
    },

    // Logs success when remoteDescription is set.
    setRemoteDescriptionSuccess(state, peerConnection) {
      setDescriptionSuccess(peerConnection, "setRemoteDescription");
    },
  },
  //actions
  actions: {
    // Define RTC peer connection behavior.

    // Connects with new peer candidate.
    async handleConnection({ state }, event) {
      const peerConnection = event.target;
      const iceCandidate = event.candidate;

      if (iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        const otherPeer = getOtherPeer(state, peerConnection);
        try {
          await otherPeer.addIceCandidate(newIceCandidate);
          handleConnectionSuccess(peerConnection);
        } catch (error) {
          handleConnectionFailure(peerConnection, error);
        }

        trace(
          `${getPeerName(peerConnection)} ICE candidate:\n` +
            `${event.candidate.candidate}.`
        );
      }
    },

    // Logs offer creation and sets peer connection session descriptions.
    async createdOffer({ commit, state, dispatch }, description) {
      trace(`Offer from localPeerConnection:\n${description.sdp}`);

      trace("localPeerConnection setLocalDescription start.");
      try {
        await state.localPeerConnection.setLocalDescription(description);
        commit("setLocalDescriptionSuccess", state.localPeerConnection);
      } catch (error) {
        commit("setSessionDescriptionError", error);
      }

      trace("remotePeerConnection setRemoteDescription start.");
      try {
        await state.remotePeerConnection.setRemoteDescription(description);
        commit("setRemoteDescriptionSuccess", state.remotePeerConnection);
      } catch (error) {
        commit("setSessionDescriptionError", error);
      }

      trace("remotePeerConnection createAnswer start.");
      try {
        await state.remotePeerConnection.createAnswer(description);
        dispatch("createdAnswer", description);
      } catch (error) {
        commit("setSessionDescriptionError", error);
      }
    },

    // Logs answer to offer creation and sets peer connection session descriptions.
    async createdAnswer({ state, commit }, description) {
      trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

      trace("remotePeerConnection setLocalDescription start.");
      try {
        await state.remotePeerConnection.setLocalDescription(description);
        commit("setLocalDescriptionSuccess", state.remotePeerConnection);
      } catch (error) {
        commit("setSessionDescriptionError", error);
      }

      trace("localPeerConnection setRemoteDescription start.");
      try {
        await state.localPeerConnection.setRemoteDescription(description);
        commit("setRemoteDescriptionSuccess", state.localPeerConnection);
      } catch (error) {
        commit("setSessionDescriptionError", error);
      }
    },

    // Define and add behavior to buttons.
    // Handles start button action: creates local MediaStream.
    async startAction({ state, commit }) {
      try {
        let mediaStream = await navigator.mediaDevices.getUserMedia(
          state.mediaStreamConstraints
        );
        commit("gotLocalMediaStream", mediaStream);
      } catch (error) {
        commit("handleLocalMediaStreamError", error);
      }
      trace("Requesting local stream.");
    },

    // Handles call button action: creates peer connection.
    async callStart({ state, commit, dispatch }) {
      logCallStart(state);

      const servers = null; // Allows for RTC server configuration.

      // Create peer connections and add behavior.
      state.localPeerConnection = new RTCPeerConnection(servers);
      trace("Created local peer connection object localPeerConnection.");

      state.localPeerConnection.addEventListener("icecandidate", (event) => {
        dispatch("handleConnection", event);
      });
      state.localPeerConnection.addEventListener(
        "iceconnectionstatechange",
        (event) => {
          dispatch("handleConnectionChange", event);
        }
      );

      state.remotePeerConnection = new RTCPeerConnection(servers);
      trace("Created remote peer connection object remotePeerConnection.");

      state.remotePeerConnection.addEventListener("icecandidate", (event) => {
        dispatch("handleConnection", event);
      });
      state.remotePeerConnection.addEventListener(
        "iceconnectionstatechange",
        (event) => {
          dispatch("handleConnectionChange", event);
        }
      );
      state.remotePeerConnection.addEventListener("addstream", (event) => {
        commit("gotRemoteMediaStream", event);
      });

      // Add local stream to connection and create offer to connect.
      state.localPeerConnection.addStream(state.localStream);
      trace("Added local stream to localPeerConnection.");

      trace("localPeerConnection createOffer start.");
      try {
        let description = await state.localPeerConnection.createOffer(
          state.offerOptions
        );
        dispatch("createdOffer", description);
      } catch (error) {
        commit("setSessionDescriptionError", error);
      }
    },

    // Handles hangup action: ends up call, closes connections and resets peers.
    async callEnd({ state }) {
      state.localPeerConnection.close();
      state.remotePeerConnection.close();
      state.localPeerConnection = null;
      state.remotePeerConnection = null;
      trace("Ending call.");
    },

    // Logs a message with the id and size of a video element.
    // This event is fired when video begins streaming.
    logResizedVideo(state, event) {
      logVideoLoaded(event);
      let startTime = state.startTime;

      if (startTime) {
        const elapsedTime = window.performance.now() - startTime;
        startTime = null;
        trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
      }
    },
  },
};

// Gets the "other" peer connection.
function getOtherPeer(state, peerConnection) {
  return peerConnection === state.localPeerConnection
    ? state.remotePeerConnection
    : state.localPeerConnection;
}

// Gets the name of a certain peer connection.
function getPeerName(state, peerConnection) {
  return peerConnection === state.localPeerConnection
    ? "localPeerConnection"
    : "remotePeerConnection";
}

// Logs success when setting session description.
function setDescriptionSuccess(state, peerConnection, functionName) {
  const peerName = getPeerName(state, peerConnection);
  trace(`${peerName} ${functionName} complete.`);
}

function logCallStart(state) {
  trace("Starting call.");
  state.startTime = window.performance.now();

  // Get local media stream tracks.
  const videoTracks = state.localStream.getVideoTracks();
  const audioTracks = state.localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    trace(`Using video device: ${videoTracks[0].label}.`);
  }
  if (audioTracks.length > 0) {
    trace(`Using audio device: ${audioTracks[0].label}.`);
  }
}

// Logs a message with the id and size of a video element.
function logVideoLoaded(state, event) {
  const video = event.target;
  trace(
    `${video.id} videoWidth: ${video.videoWidth}px, ` +
      `videoHeight: ${video.videoHeight}px.`
  );
}

// Logs that the connection succeeded.
function handleConnectionSuccess(state, peerConnection) {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
}

// Logs that the connection failed.
function handleConnectionFailure(state, peerConnection, error) {
  trace(
    `${getPeerName(peerConnection)} failed to add ICE Candidate:\n` +
      `${error?.toString()}.`
  );
}
