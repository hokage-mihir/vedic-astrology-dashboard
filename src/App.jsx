import ChandrashtamCalculator from './components/ChandrashtamCalculator'
import NakshatraInfo from './components/NakshatraInfo'
import PanchangDetails from './components/PanchangDetails'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-900 dark:text-white">
          Vedic Astrology Dashboard
        </h1>
        <div className="flex flex-col space-y-6">
          <ChandrashtamCalculator />
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            <PanchangDetails />
            <NakshatraInfo />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App