function getVideoCover(videoBlob, seekTo = 0.0) {
  console.log("Getting video cover for blob:", videoBlob);
  return new Promise((resolve, reject) => {
      // Create a video element
      const videoPlayer = document.createElement('video');
      videoPlayer.setAttribute('src', URL.createObjectURL(videoBlob));
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex) => {
          reject("Error when loading video file", ex);
      });
      // Load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener('loadedmetadata', () => {
          // Seek to the user-defined timestamp (in seconds) if possible
          if (videoPlayer.duration < seekTo) {
              reject("Video is too short.");
              return;
          }
          // Delay seeking to ensure 'seeked' event fires on Safari
          setTimeout(() => {
              videoPlayer.currentTime = seekTo;
          }, 200);
          // Extract video thumbnail once seeking is complete
          videoPlayer.addEventListener('seeked', () => {
              console.log('Video is now paused at %ss.', seekTo);
              // Define a canvas to have the same dimension as the video
              const canvas = document.createElement("canvas");
              canvas.width = videoPlayer.videoWidth;
              canvas.height = videoPlayer.videoHeight;
              // Draw the video frame to canvas
              const ctx = canvas.getContext("2d");
              ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
              // Return the canvas image as a blob
              ctx.canvas.toBlob(
                  (blob) => {
                      resolve(blob);
                  },
                  "image/jpeg",
                  0.75 /* quality */
              );
          });
      });
  });
}

export default getVideoCover