import ChandrashtamCalculator from './components/ChandrashtamCalculator'
import NakshatraInfo from './components/NakshatraInfo'
import PanchangDetails from './components/PanchangDetails'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-900 dark:text-white">
          Vedic Astrology Dashboard
        </h1>
        <div className="flex flex-col gap-4 md:gap-6">
          <ChandrashtamCalculator />
          <div className="lg:grid lg:grid-cols-2 gap-4 md:gap-6">
            <PanchangDetails />
            <NakshatraInfo />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App