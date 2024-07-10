import { useState } from 'react';
import PropTypes from 'prop-types';

const OscillationControl = ({ onOscillationChange, onSpeedChange }) => {
    const [oscillation, setOscillation] = useState(false);
    const [speed, setSpeed] = useState(0.5);

    const handleToggle = () => {
        const newOscillation = !oscillation;
        setOscillation(newOscillation);
        onOscillationChange(newOscillation);
    };

    const handleSpeedChange = (event) => {
        const newSpeed = parseFloat(event.target.value);
        setSpeed(newSpeed);
        onSpeedChange(newSpeed);
    };

    return (
        <div>
            <label>Oscillation: {oscillation ? 'On' : 'Off'}</label>
            <button onClick={handleToggle}>
                {oscillation ? 'Disable' : 'Enable'}
            </button>
            {oscillation && (
                <div>
                    <label>Speed:</label>
                    <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={speed}
                        onChange={handleSpeedChange}
                    />
                </div>
            )}
        </div>
    );
};

OscillationControl.propTypes = {
    onOscillationChange: PropTypes.func.isRequired,
    onSpeedChange: PropTypes.func.isRequired
};

export default OscillationControl;
