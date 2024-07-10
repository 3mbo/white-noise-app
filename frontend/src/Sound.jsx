import PropTypes from 'prop-types';
import { useState, useEffect, useRef, useCallback } from 'react';
import VolumeSlider from './VolumeSlider';
import FrequencySlider from './FrequencySlider';
import OscillationControl from './OscillationControl';
import NoiseTypeSelector from './NoiseTypeSelector';
import RandomOscillationToggle from './RandomOscillationToggle';
import OscillationAmplitudeSlider from './OscillationAmplitudeSlider'; // New component for amplitude control
import { createNoise } from './AudioUtils.jsx'; // Import the createNoise function

const Sound = ({ id, onSave, onRemove }) => {
    const [volume, setVolume] = useState(0.5);
    const [frequency, setFrequency] = useState(440);
    const [oscillation, setOscillation] = useState(false);
    const [oscillationSpeed, setOscillationSpeed] = useState(0.5);
    const [oscillationAmplitude, setOscillationAmplitude] = useState(0.25); // New state for amplitude
    const [noiseType, setNoiseType] = useState('white');
    const [randomOscillation, setRandomOscillation] = useState(false);

    const audioCtx = useRef(null);
    const gainNode = useRef(null);
    const noiseNode = useRef(null);
    const filterNode = useRef(null);
    const gainOscillator = useRef(null);
    const oscillationGainNode = useRef(null);
    const intervalId = useRef(null);

    const initializeAudioContext = useCallback(() => {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNode.current = audioCtx.current.createGain();
        filterNode.current = audioCtx.current.createBiquadFilter();
        filterNode.current.type = 'lowpass';
        filterNode.current.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
        noiseNode.current = createNoise(audioCtx.current, noiseType);
        noiseNode.current.connect(filterNode.current);
        filterNode.current.connect(gainNode.current);
        gainNode.current.connect(audioCtx.current.destination);
        noiseNode.current.start(0); // Start the noise node immediately
    }, [frequency, noiseType]);

    const setOscillationFrequency = useCallback(() => {
        const baseFrequency = oscillationSpeed * 2;
        const randomFactor = randomOscillation ? (Math.random() * 0.1 - 0.05) : 0;
        const newFrequency = baseFrequency + randomFactor;
        gainOscillator.current.frequency.setTargetAtTime(newFrequency, audioCtx.current.currentTime, 0.01);
    }, [oscillationSpeed, randomOscillation]);


    useEffect(() => {
        initializeAudioContext();
        return () => {
            if (audioCtx.current) {
                noiseNode.current.stop();
                audioCtx.current.close();
            }
        };
    }, [initializeAudioContext]);

    useEffect(() => {
        if (audioCtx.current) {
            gainNode.current.gain.linearRampToValueAtTime(volume, audioCtx.current.currentTime + 0.01);
        }
    }, [volume]);

    useEffect(() => {
        if (audioCtx.current) {
            filterNode.current.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
        }
    }, [frequency]);

    useEffect(() => {
        if (audioCtx.current) {
            noiseNode.current.disconnect();
            noiseNode.current = createNoise(audioCtx.current, noiseType);
            noiseNode.current.connect(filterNode.current);
            noiseNode.current.start(0);
        }
    }, [noiseType]);

    useEffect(() => {
        if (oscillation) {
            if (!gainOscillator.current && audioCtx.current) {
                gainOscillator.current = audioCtx.current.createOscillator();
                gainOscillator.current.type = 'sine';
                setOscillationFrequency();
                oscillationGainNode.current = audioCtx.current.createGain();
                oscillationGainNode.current.gain.setValueAtTime(volume * oscillationAmplitude, audioCtx.current.currentTime);
                gainOscillator.current.connect(oscillationGainNode.current);
                oscillationGainNode.current.connect(gainNode.current.gain);
                gainOscillator.current.start();
                if (randomOscillation) {
                    intervalId.current = setInterval(setOscillationFrequency, 100);
                }
            } else {
                setOscillationFrequency();
            }
        } else {
            if (gainOscillator.current) {
                gainOscillator.current.stop();
                gainOscillator.current.disconnect();
                gainOscillator.current = null;
            }
            if (oscillationGainNode.current) {
                oscillationGainNode.current.disconnect();
                oscillationGainNode.current = null;
            }
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }
    }, [oscillation, oscillationSpeed, volume, oscillationAmplitude, randomOscillation, setOscillationFrequency]);

    useEffect(() => {
        if (oscillation && oscillationGainNode.current && audioCtx.current) {
            oscillationGainNode.current.gain.setValueAtTime(volume * oscillationAmplitude, audioCtx.current.currentTime + 0.01);
        }
    }, [oscillationAmplitude, volume]);

    const handleSave = () => {
        onSave({ id, volume, frequency, oscillation, oscillationSpeed, oscillationAmplitude, noiseType, randomOscillation });
        onRemove(id);
    };

    return (
        <div>
            <VolumeSlider onVolumeChange={setVolume} />
            <FrequencySlider onFrequencyChange={setFrequency} />
            <OscillationControl
                onOscillationChange={setOscillation}
                onSpeedChange={setOscillationSpeed}
            />
            <OscillationAmplitudeSlider onAmplitudeChange={setOscillationAmplitude} initialAmplitude={oscillationAmplitude} />
            <NoiseTypeSelector onNoiseTypeChange={setNoiseType} noiseType={noiseType} />
            <RandomOscillationToggle onRandomOscillationChange={setRandomOscillation} randomOscillation={randomOscillation} />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

Sound.propTypes = {
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default Sound;
