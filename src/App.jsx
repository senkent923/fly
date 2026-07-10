import { AppProvider } from './store/AppContext'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import StatsBand from './components/StatsBand'
import RouteMap from './components/RouteMap'
import Destinations from './components/Destinations'
import Cabins from './components/Cabins'
import Fleet from './components/Fleet'
import BookCta from './components/BookCta'
import BookingWidget from './components/BookingWidget'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import AccountModal from './components/AccountModal'
import BookingModal from './components/BookingModal'

export default function App() {
  return (
    <AppProvider>
      <div className="grain relative min-h-screen bg-black text-white">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <StatsBand />
          <RouteMap />
          <Destinations />
          <Cabins />
          <Fleet />
          <BookCta />
          <BookingWidget />
        </main>
        <Footer />

        {/* overlays */}
        <AuthModal />
        <AccountModal />
        <BookingModal />
      </div>
    </AppProvider>
  )
}
