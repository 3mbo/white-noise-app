import { useState, useRef } from 'react';
import Sound from './Sound';
import VolumeSlider from './VolumeSlider';
import { createNoise } from './AudioUtils';

const App = () => {
    const [sounds, setSounds] = useState([]);
    const [savedSounds, setSavedSounds] = useState([]);
    const audioContexts = useRef({});
    const [playingSounds, setPlayingSounds] = useState({});

    const createNewSound = () => {
        setSounds([...sounds, { id: Date.now() }]);
    };

    const removeSound = (id) => {
        setSounds(sounds.filter(sound => sound.id !== id));
    };

    const saveSound = (sound) => {
        setSavedSounds([...savedSounds, sound]);
    };

    const playSound = (sound) => {
        if (audioContexts.current[sound.id]) {
            stopSound(sound);
            return;
        }

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioCtx.createGain();
        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(sound.frequency, audioCtx.currentTime);
        const noiseNode = createNoise(audioCtx, sound.noiseType);

        gainNode.gain.setValueAtTime(sound.volume, audioCtx.currentTime);
        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (sound.oscillation) {
            const gainOscillator = audioCtx.createOscillator();
            gainOscillator.type = 'sine';
            const oscillationGainNode = audioCtx.createGain();
            const setOscillationFrequency = () => {
                const baseFrequency = sound.oscillationSpeed * 2;
                const randomFactor = sound.randomOscillation ? (Math.random() * 0.1 - 0.05) : 0;
                const newFrequency = baseFrequency + randomFactor;
                gainOscillator.frequency.setTargetAtTime(newFrequency, audioCtx.currentTime, 0.01);
            };

            setOscillationFrequency();
            gainOscillator.connect(oscillationGainNode);
            oscillationGainNode.gain.setValueAtTime(sound.volume * sound.oscillationAmplitude, audioCtx.currentTime); // Use the saved amplitude
            oscillationGainNode.connect(gainNode.gain);
            gainOscillator.start();

            if (sound.randomOscillation) {
                setInterval(setOscillationFrequency, 100);
            }

            audioContexts.current[sound.id] = { audioCtx, gainNode, noiseNode, gainOscillator, oscillationGainNode };
        } else {
            audioContexts.current[sound.id] = { audioCtx, gainNode, noiseNode, filterNode };
        }

        noiseNode.start(0);
        setPlayingSounds((prev) => ({ ...prev, [sound.id]: true }));
    };

    const stopSound = (sound) => {
        if (audioContexts.current[sound.id]) {
            audioContexts.current[sound.id].noiseNode.stop();
            delete audioContexts.current[sound.id];
            setPlayingSounds((prev) => ({ ...prev, [sound.id]: false }));
        }
    };

    const handleVolumeChange = (id, newVolume) => {
        setSavedSounds(
            savedSounds.map((sound) =>
                sound.id === id ? { ...sound, volume: newVolume } : sound
            )
        );
        if (audioContexts.current[id]) {
            audioContexts.current[id].gainNode.gain.setValueAtTime(newVolume, audioContexts.current[id].audioCtx.currentTime);
        }
    };

    const getColorClass = (noiseType) => {
        switch (noiseType) {
            case 'pink':
                return 'bg-pink-500';
            case 'brown':
                return 'bg-yellow-700';
            case 'rain':
                return 'bg-blue-500';
            case 'white':
            default:
                return 'bg-white';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">White Noise App</h1>
            <button
                onClick={createNewSound}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Create new sound
            </button>
            <div className="w-full max-w-2xl flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-2">Saved Sounds</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {savedSounds.map((sound) => (
                        <div
                            key={sound.id}
                            onClick={() => playSound(sound)}
                            onDoubleClick={() => stopSound(sound)}
                            className={`cursor-pointer p-4 m-2 rounded ${
                                playingSounds[sound.id] ? 'border-4 border-green-500' : 'border-4 border-red-500'
                            } ${getColorClass(sound.noiseType)}`}
                        >
                            <div className="text-center font-bold mb-2">{sound.noiseType.charAt(0).toUpperCase() + sound.noiseType.slice(1)}</div>
                            <VolumeSlider
                                onVolumeChange={(newVolume) => handleVolumeChange(sound.id, newVolume)}
                                initialVolume={sound.volume}
                            />
                        </div>
                    ))}
                </div>
                {sounds.map((sound) => (
                    <Sound key={sound.id} id={sound.id} onSave={saveSound} onRemove={removeSound} />
                ))}
            </div>
        </div>
    );
};

export default App;
