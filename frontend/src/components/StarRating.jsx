import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 24 }) => {
    const [hovered, setHovered] = useState(null);
    const [lastValue, setLastValue] = useState(value);

    React.useEffect(() => {
        setLastValue(value);
    }, [value]);

    const handleClick = (index) => {
        if (!readOnly && onChange) {
            onChange(index + 1);
        }
    };

    const handleMouseEnter = (i) => {
        if (!readOnly) setHovered(i);
    };
    const handleMouseLeave = () => {
        if (!readOnly) setHovered(null);
    };

    return (
        <div style={{ display: 'flex', gap: 2, cursor: readOnly ? 'default' : 'pointer' }}>
            {[0, 1, 2, 3, 4].map((i) => {
                const isFilled = hovered !== null ? i <= hovered : i < value;
                return (
                    <svg
                        key={i}
                        onClick={() => handleClick(i)}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill={isFilled ? '#fbbf24' : 'none'}
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), fill 0.2s',
                            transform: hovered === i ? 'scale(1.2)' : (isFilled && i >= lastValue ? 'scale(1.15)' : 'scale(1)'),
                            filter: isFilled ? 'drop-shadow(0 1px 4px #fbbf24aa)' : 'none',
                            opacity: isFilled ? 1 : 0.7,
                            pointerEvents: readOnly ? 'none' : 'auto',
                        }}
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                );
            })}
        </div>
    );
};

export default StarRating; 