import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SimplifiedPage from './pages/SimplifiedPage';
import AdvancedPage from './pages/AdvancedPage';
import ErrorBoundary from './components/ErrorBoundary';
import { LocationProvider } from './contexts/LocationContext';
import { ChandrashtamAlerts } from './hooks/useChandrashtamAlerts';

function App() {
  return (
    <ErrorBoundary message="Something went wrong. Please refresh the page.">
      <LocationProvider>
        <ChandrashtamAlerts />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<SimplifiedPage />} />
              <Route path="/simplified" element={<Navigate to="/" replace />} />
              <Route path="/advanced" element={<AdvancedPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LocationProvider>
    </ErrorBoundary>
  );
}

export default App;
