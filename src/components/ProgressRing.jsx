import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ProgressRing = memo(({
  progress,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  label = '',
  subLabel = '',
  statusColor = 'default'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {statusColor === 'green' && (
              <>
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </>
            )}
            {statusColor === 'yellow' && (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </>
            )}
            {statusColor === 'red' && (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </>
            )}
            {statusColor === 'default' && (
              <>
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </>
            )}
          </linearGradient>
        </defs>
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
          {subLabel && (
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 bg-clip-text text-transparent text-center leading-tight">
              {subLabel}
            </span>
          )}
          {label && (
            <span className="text-xs text-gray-600 mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  );
});

ProgressRing.displayName = 'ProgressRing';

ProgressRing.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  statusColor: PropTypes.oneOf(['default', 'green', 'yellow', 'red']),
};

export default ProgressRing;
