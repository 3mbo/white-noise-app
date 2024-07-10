import React from 'react';

const RandomOscillationToggle = ({ onRandomOscillationChange, randomOscillation }) => {
    return (
        <div>
            <label htmlFor="randomOscillation">Random Oscillation: </label>
            <input
                type="checkbox"
                id="randomOscillation"
                checked={randomOscillation}
                onChange={(e) => onRandomOscillationChange(e.target.checked)}
            />
        </div>
    );
};

export default RandomOscillationToggle;
