let player;
let players = [];
const videoIds = ["seO0xeS-nzs", "g_WVSozgbVM", "kUt7It2bAjU", "iVCEVJOW6CY"];
let currentVideoIndex = 0;

function onYouTubeIframeAPIReady() {
  videoIds.forEach((videoId, index) => {
    players[index] = new YT.Player(`video${index + 1}`, {
      height: "514",
      width: "914",
      videoId: videoId,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  });
}

function onPlayerReady(event) {
  if (event.target.getIframe().id !== "video1") {
    event.target.getIframe().style.display = "none";
  } else {
    event.target.playVideo();
    updateVideoRange();
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    updateVideoRange();
  }
}

function playVideo(index) {
  players.forEach((player, idx) => {
    player.getIframe().style.display = idx === index ? "block" : "none";
    if (idx === index) {
      player.playVideo();
    } else {
      player.stopVideo();
    }
  });
  currentVideoIndex = index;
  resetVideoRange();
}

function prevVideo() {
  currentVideoIndex = (currentVideoIndex - 1 + players.length) % players.length;
  playVideo(currentVideoIndex);
}
function nextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % players.length;
  playVideo(currentVideoIndex);
}
function showVideoList() {
  const videoList = document.getElementById("video-list");
  videoList.style.display =
    videoList.style.display === "flex" ? "none" : "flex";
}
function shuffleVideo() {
  const randomIndex = Math.floor(Math.random() * players.length);
  playVideo(randomIndex);
}
function updateVideoRange() {
  if (
    players[currentVideoIndex] &&
    players[currentVideoIndex].getPlayerState() === YT.PlayerState.PLAYING
  ) {
    const duration = players[currentVideoIndex].getDuration();
    const currentTime = players[currentVideoIndex].getCurrentTime();
    const progress = (currentTime / duration) * 100;

    document.getElementById("videoRange").value = progress;
    document.getElementById("currentTime").innerText = formatTime(currentTime);
    document.getElementById("totalTime").innerText = formatTime(duration);

    setTimeout(updateVideoRange, 500);
  }
}
function seekVideo() {
  const progress = document.getElementById("videoRange").value;
  const duration = players[currentVideoIndex].getDuration();
  const seekTo = (progress / 100) * duration;
  players[currentVideoIndex].seekTo(seekTo);
}
function resetVideoRange() {
  document.getElementById("videoRange").value = 0;
  document.getElementById("currentTime").innerText = "0:00";
  document.getElementById("totalTime").innerText = "0:00";
  updateVideoRange();
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
document.addEventListener("DOMContentLoaded", () => {
  playVideo(currentVideoIndex);
});

