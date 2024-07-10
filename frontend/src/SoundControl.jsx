import React from 'react';

const SoundControl = ({ source, onVolumeChange, type }) => {
    return (
        <div className="sound-control">
            <img src={`icons/${type}.png`} alt={`${type} noise`} /> {/* TODO: add icons for each noise type */}
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={source.volume}
                onChange={(e) => onVolumeChange(source, parseFloat(e.target.value))}
            />
        </div>
    );
};

export default SoundControl;
