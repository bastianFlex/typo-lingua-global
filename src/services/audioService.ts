
// Sound feedback for typing
const keyClickSound = new Audio('/sounds/click.mp3');
const errorSound = new Audio('/sounds/error.mp3');
const successSound = new Audio('/sounds/success.mp3');

export const playKeyClick = (volume: number = 0.5) => {
  if (volume === 0) return;
  keyClickSound.volume = volume;
  keyClickSound.currentTime = 0;
  keyClickSound.play().catch(e => console.error('Audio playback error:', e));
};

export const playError = (volume: number = 0.5) => {
  if (volume === 0) return;
  errorSound.volume = volume;
  errorSound.currentTime = 0;
  errorSound.play().catch(e => console.error('Audio playback error:', e));
};

export const playSuccess = (volume: number = 0.5) => {
  if (volume === 0) return;
  successSound.volume = volume;
  successSound.currentTime = 0;
  successSound.play().catch(e => console.error('Audio playback error:', e));
};
