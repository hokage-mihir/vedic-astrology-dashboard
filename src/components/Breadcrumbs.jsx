import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import PropTypes from 'prop-types';

const Breadcrumbs = ({ items }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className="mb-4 text-sm"
    >
      <motion.ol
        initial={!prefersReducedMotion ? { opacity: 0, y: -10 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.4 } : { duration: 0 }}
        className="flex items-center space-x-2 text-gray-600"
      >
        <li className="flex items-center">
          <a
            href="/"
            className="flex items-center hover:text-purple-600 transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </a>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-purple-600 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </motion.ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumbs;