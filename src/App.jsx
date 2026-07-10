import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Destinations from './components/Destinations'
import Cabins from './components/Cabins'
import BookCta from './components/BookCta'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Destinations />
        <Cabins />
        <BookCta />
      </main>
      <Footer />
    </div>
  )
}
