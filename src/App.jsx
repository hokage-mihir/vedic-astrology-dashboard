// src/App.jsx
import ChandrashtamCalculator from './components/ChandrashtamCalculator'
import NakshatraInfo from './components/NakshatraInfo'
import VedicDetails from './components/VedicDetails'
import PanchangDetails from './components/PanchangDetails'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Vedic Astrology Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChandrashtamCalculator />
          <NakshatraInfo />
          <VedicDetails />
          <PanchangDetails />
        </div>
      </div>
    </div>
  )
}

export default App