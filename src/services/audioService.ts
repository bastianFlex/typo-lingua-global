
// Sound feedback for typing
let keyClickSound: HTMLAudioElement;
let errorSound: HTMLAudioElement;
let successSound: HTMLAudioElement;

// Initialize audio on first interaction to avoid autoplay restrictions
const initAudio = () => {
  if (!keyClickSound) {
    keyClickSound = new Audio('/sounds/click.mp3');
    errorSound = new Audio('/sounds/error.mp3');
    successSound = new Audio('/sounds/success.mp3');
  }
};

export const playKeyClick = (volume: number = 0.5) => {
  if (volume === 0) return;
  try {
    initAudio();
    keyClickSound.volume = volume;
    keyClickSound.currentTime = 0;
    const playPromise = keyClickSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.error('Audio playback error:', e);
      });
    }
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};

export const playError = (volume: number = 0.5) => {
  if (volume === 0) return;
  try {
    initAudio();
    errorSound.volume = volume;
    errorSound.currentTime = 0;
    const playPromise = errorSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.error('Audio playback error:', e);
      });
    }
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};

export const playSuccess = (volume: number = 0.5) => {
  if (volume === 0) return;
  try {
    initAudio();
    successSound.volume = volume;
    successSound.currentTime = 0;
    const playPromise = successSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.error('Audio playback error:', e);
      });
    }
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};
