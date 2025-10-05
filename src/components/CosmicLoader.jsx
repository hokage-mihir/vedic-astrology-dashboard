import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useReducedMotion } from '../hooks/useReducedMotion';

const CosmicLoader = memo(({ size = 60, text = "Calculating..." }) => {
  const prefersReducedMotion = useReducedMotion();

  // Simple static loader for reduced motion users
  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <div className="relative" style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full border-4 border-gray-300" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500" />
        </div>
        {text && (
          <p className="text-sm font-medium text-gray-700">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      {/* Animated cosmic spinner */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Middle rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-amber-500 border-l-pink-500"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner pulsing star */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-purple-500 rounded-full blur-sm" />
        </motion.div>

        {/* Orbiting particles */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <motion.div
            key={angle}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-4px',
              marginLeft: '-4px',
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * (size / 2 - 10),
                Math.cos(((angle + 360) * Math.PI) / 180) * (size / 2 - 10),
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * (size / 2 - 10),
                Math.sin(((angle + 360) * Math.PI) / 180) * (size / 2 - 10),
              ],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-sm font-medium text-gray-700"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
});

CosmicLoader.displayName = 'CosmicLoader';

CosmicLoader.propTypes = {
  size: PropTypes.number,
  text: PropTypes.string
};

export default CosmicLoader;
