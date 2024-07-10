import PropTypes from 'prop-types';

const OscillationAmplitudeSlider = ({ onAmplitudeChange, initialAmplitude }) => {
    const handleChange = (event) => {
        onAmplitudeChange(parseFloat(event.target.value));
    };

    return (
        <div>
            <label>Oscillation Amplitude</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={initialAmplitude}
                onChange={handleChange}
            />
        </div>
    );
};

OscillationAmplitudeSlider.propTypes = {
    onAmplitudeChange: PropTypes.func.isRequired,
    initialAmplitude: PropTypes.number.isRequired,
};

export default OscillationAmplitudeSlider;
