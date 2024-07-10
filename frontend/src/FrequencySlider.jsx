import { useState } from 'react';
import PropTypes from 'prop-types';

const FrequencySlider = ({ onFrequencyChange }) => {
    const [frequency, setFrequency] = useState(440);

    const handleChange = (e) => {
        const newFrequency = e.target.value;
        setFrequency(newFrequency);
        onFrequencyChange(newFrequency);
    };

    return (
        <div>
            <label>Frequency: {frequency} Hz</label>
            <input
                type="range"
                min="20"
                max="7000"
                step="10"
                value={frequency}
                onChange={handleChange}
            />
        </div>
    );
};

FrequencySlider.propTypes = {
    onFrequencyChange: PropTypes.func.isRequired
};

export default FrequencySlider;