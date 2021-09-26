"use strict";

export default function connection() {
  // Set up media stream constant and parameters.

  // In this codelab, you will be streaming video only: "video: true".
  // Audio will not be streamed because it is set to "audio: false" by default.
  const mediaStreamConstraints = {
    video: true,
  };

  

  

  // Define peer connections, streams and video elements.
  const localVideo = document.getElementById("localVideo");
  const remoteVideo = document.getElementById("remoteVideo");

  let localStream;
  let remoteStream;

  let localPeerConnection;
  let remotePeerConnection;

 


  

  

  

  localVideo.addEventListener("loadedmetadata", logVideoLoaded);
  remoteVideo.addEventListener("loadedmetadata", logVideoLoaded);
  remoteVideo.addEventListener("onresize", logResizedVideo);

  

  

  

  

  // Define helper functions.

  

  // Logs an action (text) and the time when it happened on the console.
  function trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);

    console.log(now, text);
  }

  return {
    startAction,
    callAction,
    hangupAction
  };
}

// export default function connection(){
//     let servers = null;
//     // Set up to exchange only video.
//     const offerOptions = {
//       offerToReceiveVideo: 1,
//     };

//     // Create peer connections and add behavior.
//   let localPeerConnection = new RTCPeerConnection(servers);
//   trace('Created local peer connection object localPeerConnection.');

//   localPeerConnection.addEventListener('icecandidate', handleConnection);
//   localPeerConnection.addEventListener(
//     'iceconnectionstatechange', handleConnectionChange);

//   let remotePeerConnection = new RTCPeerConnection(servers);
//   trace('Created remote peer connection object remotePeerConnection.');

//   remotePeerConnection.addEventListener('icecandidate', handleConnection);
//   remotePeerConnection.addEventListener(
//     'iceconnectionstatechange', handleConnectionChange);
//   remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

//   // Add local stream to connection and create offer to connect.
//   localPeerConnection.addStream(localStream);
//   trace('Added local stream to localPeerConnection.');

//   trace('localPeerConnection createOffer start.');
//   localPeerConnection.createOffer(offerOptions)
//     .then(createdOffer).catch(setSessionDescriptionError);

//     return {
//       localPeerConnection
//     }
// }

// // Connects with new peer candidate.
// function handleConnection(event) {
//     const peerConnection = event.target;
//     const iceCandidate = event.candidate;

//     if (iceCandidate) {
//       const newIceCandidate = new RTCIceCandidate(iceCandidate);
//       const otherPeer = getOtherPeer(peerConnection);

//       otherPeer.addIceCandidate(newIceCandidate)
//         .then(() => {
//           handleConnectionSuccess(peerConnection);
//         }).catch((error) => {
//           handleConnectionFailure(peerConnection, error);
//         });

//       trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
//             `${event.candidate.candidate}.`);
//     }
//   }

//   // Logs that the connection succeeded.
//   function handleConnectionSuccess(peerConnection) {
//     trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
//   }

//   // Logs that the connection failed.
//   function handleConnectionFailure(peerConnection, error) {
//     trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
//           `${error.toString()}.`);
//   }

//   // Gets the "other" peer connection.
// function getOtherPeer(peerConnection) {
//     return (peerConnection === localPeerConnection) ?
//         remotePeerConnection : localPeerConnection;
//   }

//   // Gets the name of a certain peer connection.
//   function getPeerName(peerConnection) {
//     return (peerConnection === localPeerConnection) ?
//         'localPeerConnection' : 'remotePeerConnection';
//   }

//   // Logs changes to the connection state.
// function handleConnectionChange(event) {
//     const peerConnection = event.target;
//     console.log('ICE state change event: ', event);
//     trace(`${getPeerName(peerConnection)} ICE state: ` +
//           `${peerConnection.iceConnectionState}.`);
//   }
