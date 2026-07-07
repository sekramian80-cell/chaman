import { ContactCTA } from './components/ContactCTA.jsx';
import { FAQ } from './components/FAQ.jsx';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { Process } from './components/Process.jsx';
import { ProductShowcase } from './components/ProductShowcase.jsx';
import { ProjectGallery } from './components/ProjectGallery.jsx';
import { Services } from './components/Services.jsx';
import { TrustStrip } from './components/TrustStrip.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <ProductShowcase />
        <Process />
        <ProjectGallery />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
