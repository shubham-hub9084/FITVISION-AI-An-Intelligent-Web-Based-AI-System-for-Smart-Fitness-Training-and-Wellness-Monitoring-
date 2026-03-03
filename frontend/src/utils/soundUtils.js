/**
 * Sound Utility using Web Audio API
 * Generates synthetic beep sounds without requiring external assets.
 */

// Create a single audio context instance
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Plays a beep sound.
 * @param {string} type - 'success', 'warning', 'start', 'end'
 */
export const playBeep = (type = 'success') => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch (type) {
        case 'success': // Rep completion (High chimes)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, now); // A5
            oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.1); // A6
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'warning': // Form Error (Low buzzer)
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'start': // Session Start (Ascending)
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.linearRampToValueAtTime(880, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;

        case 'complete': // Session Complete (Fanfare-ish)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.2); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.4); // G5

            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.setValueAtTime(0.2, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now + 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            oscillator.start(now);
            oscillator.stop(now + 0.8);
            break;

        default:
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, now);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
    }
};

export default playBeep;
