import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const MoonPhase = memo(({ phase, size = 80 }) => {
  // Phase: 0 = New Moon, 0.5 = Full Moon, 1 = New Moon again
  // Calculate illumination percentage for display
  const illumination = useMemo(() => {
    if (phase <= 0.5) {
      return phase * 2 * 100; // Waxing: 0% to 100%
    } else {
      return (1 - (phase - 0.5) * 2) * 100; // Waning: 100% to 0%
    }
  }, [phase]);

  const phaseName = useMemo(() => {
    if (phase < 0.03 || phase > 0.97) return "New Moon";
    if (phase >= 0.03 && phase < 0.22) return "Waxing Crescent";
    if (phase >= 0.22 && phase < 0.28) return "First Quarter";
    if (phase >= 0.28 && phase < 0.47) return "Waxing Gibbous";
    if (phase >= 0.47 && phase < 0.53) return "Full Moon";
    if (phase >= 0.53 && phase < 0.72) return "Waning Gibbous";
    if (phase >= 0.72 && phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  }, [phase]);

  // Calculate shadow position for moon phase visualization
  const shadowOffset = useMemo(() => {
    if (phase <= 0.5) {
      // Waxing: shadow moves from right to left
      return 1 - (phase * 2);
    } else {
      // Waning: shadow moves from left to right
      return (phase - 0.5) * 2 - 1;
    }
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="filter drop-shadow-lg"
        >
          {/* Moon circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="#f3f4f6"
          />

          {/* Shadow overlay */}
          <defs>
            <clipPath id="moonClip">
              <circle cx="50" cy="50" r="45" />
            </clipPath>
          </defs>

          {/* Waxing/Waning shadow */}
          {phase < 0.5 ? (
            // Waxing: dark on the left, light on the right
            <ellipse
              cx={50 + shadowOffset * 45}
              cy="50"
              rx="45"
              ry="45"
              fill="#1f2937"
              clipPath="url(#moonClip)"
            />
          ) : (
            // Waning: dark on the right, light on the left
            <ellipse
              cx={50 - shadowOffset * 45}
              cy="50"
              rx="45"
              ry="45"
              fill="#1f2937"
              clipPath="url(#moonClip)"
            />
          )}

          {/* Moon glow effect */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#moonGlow)"
            strokeWidth="2"
            opacity="0.6"
          />

          <defs>
            <radialGradient id="moonGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-900">
          {phaseName}
        </p>
        <p className="text-xs text-gray-600">
          {illumination.toFixed(0)}% illuminated
        </p>
      </div>
    </div>
  );
});

MoonPhase.displayName = 'MoonPhase';

MoonPhase.propTypes = {
  phase: PropTypes.number.isRequired, // 0 to 1
  size: PropTypes.number
};

export default MoonPhase;
