import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplifiedLandingPage from '../components/SimplifiedLandingPage';
import { trackPageView, trackEvent } from '../services/analytics';

const SimplifiedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView('/simplified', 'Simplified View');
  }, []);

  const handleShowAdvanced = () => {
    trackEvent('Navigation', 'view_changed', 'advanced');
    navigate('/advanced');
  };

  return (
    <SimplifiedLandingPage onShowAdvanced={handleShowAdvanced} />
  );
};

export default SimplifiedPage;
