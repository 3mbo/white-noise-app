import { useState } from 'react';
import PropTypes from 'prop-types';

const VolumeSlider = ({ onVolumeChange }) => {
    const [volume, setVolume] = useState(0.5);

    const handleChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        onVolumeChange(newVolume);
    };

    return (
        <div>
            <label>Volume: {Math.round(volume * 100)}</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleChange}
            />
        </div>
    );
};

VolumeSlider.propTypes = {
    onVolumeChange: PropTypes.func.isRequired
};

export default VolumeSlider;