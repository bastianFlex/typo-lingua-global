
// Sound feedback for typing
let keyClickSound: HTMLAudioElement;
let errorSound: HTMLAudioElement;
let successSound: HTMLAudioElement;
let isAudioInitialized = false;

// Initialize audio on first interaction to avoid autoplay restrictions
const initAudio = () => {
  if (!isAudioInitialized) {
    try {
      keyClickSound = new Audio('/sounds/click.mp3');
      errorSound = new Audio('/sounds/error.mp3');
      successSound = new Audio('/sounds/success.mp3');
      
      // Preload audio files
      keyClickSound.load();
      errorSound.load();
      successSound.load();
      
      isAudioInitialized = true;
      console.log('Audio initialized successfully');
    } catch (e) {
      console.error('Failed to initialize audio:', e);
    }
  }
};

export const playKeyClick = (volume: number = 0.5) => {
  if (volume <= 0) return;
  
  try {
    initAudio();
    
    // Create a new audio object each time for better performance with rapid typing
    const sound = new Audio('/sounds/click.mp3');
    sound.volume = volume;
    sound.play().catch(e => {
      console.error('Audio playback error:', e);
    });
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};

export const playError = (volume: number = 0.5) => {
  if (volume <= 0) return;
  
  try {
    initAudio();
    errorSound.volume = volume;
    errorSound.currentTime = 0;
    errorSound.play().catch(e => {
      console.error('Error sound playback error:', e);
    });
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};

export const playSuccess = (volume: number = 0.5) => {
  if (volume <= 0) return;
  
  try {
    initAudio();
    successSound.volume = volume;
    successSound.currentTime = 0;
    successSound.play().catch(e => {
      console.error('Success sound playback error:', e);
    });
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};
