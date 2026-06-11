import Layout from "./components/layout/Layout";
import HeroSlider from "./components/home/HeroSlider";
import BookSection from "./components/home/BookSection";

export default function App() {
  return (
    <Layout>
      <HeroSlider />
      <div className="py-12">
        <BookSection />
      </div>
    </Layout>
  );
}