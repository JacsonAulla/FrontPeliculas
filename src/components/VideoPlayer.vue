<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const props = defineProps({
  src: String,
  poster: String
});

const videoPlayer = ref(null);
let player = null;

onMounted(() => {
  if (props.src) {
    initPlayer();
  }
});

watch(() => props.src, (newSrc) => {
  if (player) {
    player.src({ src: newSrc, type: getMimeType(newSrc) });
    player.play();
  } else {
    initPlayer();
  }
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});

const initPlayer = () => {
  if (!videoPlayer.value) return;

  player = videojs(videoPlayer.value, {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    poster: props.poster,
    sources: [{
      src: props.src,
      type: getMimeType(props.src)
    }]
    // HE QUITADO 'controlBar' PARA EVITAR EL ERROR 'Invalid language tag'
  });
};

const getMimeType = (url) => {
  if (url && url.includes('.m3u8')) return 'application/x-mpegURL';
  return 'video/mp4';
};
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <video ref="videoPlayer" class="video-js vjs-big-play-centered vjs-theme-city"></video>
  </div>
</template>

<style>
.video-js .vjs-big-play-button {
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  line-height: 2em;
  margin-left: -1em;
}
.vjs-theme-city {
    --vjs-theme-city--primary: #ff0000;
}
</style>