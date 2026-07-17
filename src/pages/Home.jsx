import Hero from "../components/Hero/Hero";
import ScrollScene from "../components/ScrollScene/ScrollScene";
import PlaceholderSection from "../components/PlaceholderSection/PlaceholderSection";
import "./Home.css";

/*
  Page architecture:
  1) ScrollScene pins the Hero and opens a left gap on scroll
  2) Placeholder sections wait for future CMS-driven content
*/

function Home() {
  return (
    <div className="home">
      <ScrollScene>
        <Hero />
      </ScrollScene>

      <div className="home__content">
        <PlaceholderSection code="01" title="Selected Work" />
        <PlaceholderSection code="02" title="Experience" />
        <PlaceholderSection code="03" title="Capabilities" />
        <PlaceholderSection code="04" title="Contact" />
      </div>
    </div>
  );
}

export default Home;
