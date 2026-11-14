import Header from "./components/ui/Header";
import Hero from "./sections/Hero";
import Duo from "./sections/Duo";
import Pipeline from "./sections/Pipeline";
import Works from "./sections/Works";
import Estimator from "./sections/Estimator";
import Footer from "./components/ui/Footer";
import CanvasLayer from "./components/canvas/CanvasLayer";

/**
 * page.tsx stays a Server Component for metadata / SSG.
 * The 3D canvas is injected via CanvasLayer (a "use client" wrapper
 * that handles the ssr:false dynamic import boundary).
 */
export default function Home() {
  return (
    <>
      {/* Fixed full-screen 3D canvas — persists behind every section */}
      <CanvasLayer />

      {/* Fixed navigation */}
      <Header />

      {/* Page sections — transparent backgrounds, z-10 sits above canvas */}
      <main className="relative z-10">
        <Hero />
        <Duo />
        <Pipeline />
        <Works />
        <Estimator />
      </main>

      <Footer />
    </>
  );
}
