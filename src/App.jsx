import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import StatsBand from './components/StatsBand'
import RouteMap from './components/RouteMap'
import Destinations from './components/Destinations'
import Cabins from './components/Cabins'
import Fleet from './components/Fleet'
import Testimonial from './components/Testimonial'
import BookCta from './components/BookCta'
import Footer from './components/Footer'

export default function App() {
  return (
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
        <Testimonial />
        <BookCta />
      </main>
      <Footer />
    </div>
  )
}
