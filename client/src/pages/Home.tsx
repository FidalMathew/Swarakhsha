import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import FeatureHighlights from "../components/FeatureHighlights";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Nav from "../components/Nav";
import QuickActions from "../components/QuickAction";
import { SwarContext } from "../context/swarContext";

export default function HomePage() {
  const swarContext = useContext(SwarContext);
  const currentAccount = swarContext?.currentAccount;

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentAccount) {
      // navigate to connect wallet page
      navigate("/connect");
    }
  }, [currentAccount, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      <main className="pt-25">
        <HeroSection />
        <QuickActions />

        <FeatureHighlights />
      </main>
      <Footer />
      {/* <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomBar />
      </div> */}
    </div>
  );
}
