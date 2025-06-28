// AudioManager.js
// Handles all audio-related functionality for Othello

export default class AudioManager {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.soundEnabled = true;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.loadAudioBuffer();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    loadAudioBuffer() {
        if (!this.audioContext) return;
        try {
            const request = new XMLHttpRequest();
            request.open('GET', 'drop.mp3', true);
            request.responseType = 'arraybuffer';
            request.addEventListener('load', () => {
                this.audioContext.decodeAudioData(request.response, (buffer) => {
                    this.audioBuffer = buffer;
                    console.log('Audio buffer loaded successfully');
                }, (error) => {
                    console.warn('Could not decode audio data:', error);
                });
            });
            request.addEventListener('error', function() {
                console.warn('Could not load audio file');
            });
            request.send();
        } catch (e) {
            console.warn('Could not load audio buffer:', e);
        }
    }

    loadSoundPreference() {
        try {
            const savedSoundEnabled = localStorage.getItem('othello-sound-enabled');
            if (savedSoundEnabled !== null) {
                this.soundEnabled = JSON.parse(savedSoundEnabled);
            }
        } catch (e) {
            console.warn('Failed to load sound preference:', e);
        }
    }

    saveSoundPreference() {
        localStorage.setItem('othello-sound-enabled', JSON.stringify(this.soundEnabled));
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveSoundPreference();
    }

    toggleSound() {
        this.setSoundEnabled(!this.soundEnabled);
    }

    playPlacementSound() {
        if (!this.soundEnabled) return;
        if (!this.audioContext || !this.audioBuffer) return;
        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.5;
            source.buffer = this.audioBuffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
        } catch (e) {
            console.warn('Could not play sound:', e);
        }
    }

    playUndoSound() {
        if (!this.soundEnabled) return;
        if (!this.audioContext || !this.audioBuffer) return;
        try {
            const reversedBuffer = this.audioContext.createBuffer(
                this.audioBuffer.numberOfChannels,
                this.audioBuffer.length,
                this.audioBuffer.sampleRate
            );
            for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel++) {
                const originalData = this.audioBuffer.getChannelData(channel);
                const reversedData = reversedBuffer.getChannelData(channel);
                for (let i = 0; i < originalData.length; i++) {
                    reversedData[i] = originalData[originalData.length - 1 - i];
                }
            }
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.3;
            source.buffer = reversedBuffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
        } catch (e) {
            console.warn('Could not play undo sound:', e);
        }
    }
}
