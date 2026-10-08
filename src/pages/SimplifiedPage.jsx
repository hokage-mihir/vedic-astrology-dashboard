import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SimplifiedLandingPage from '../components/SimplifiedLandingPage';
import { trackRoutePageView, trackEvent } from '../services/analytics';
import { useSEO } from '../hooks/useSEO';

const SimplifiedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useSEO('/');

  // Old links used /?view=advanced before the app moved to real routes
  useEffect(() => {
    if (searchParams.get('view') === 'advanced') {
      navigate('/advanced', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    trackRoutePageView('/');
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
