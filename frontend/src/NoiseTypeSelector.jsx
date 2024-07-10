import React from 'react';

const NoiseTypeSelector = ({ onNoiseTypeChange, noiseType }) => {
    return (
        <div>
            <label htmlFor="noiseType">Noise Type: </label>
            <select id="noiseType" onChange={(e) => onNoiseTypeChange(e.target.value)} value={noiseType}>
                <option value="white">White Noise</option>
                <option value="pink">Pink Noise</option>
                <option value="brown">Brown Noise</option>
                <option value="rain">Rain Noise</option>
            </select>
        </div>
    );
};

export default NoiseTypeSelector;