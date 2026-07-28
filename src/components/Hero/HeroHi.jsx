import { useEffect, useRef } from "react";
import { Hand } from "lucide-react";
import "./HeroHi.css";

function HeroHi() {
  const handRef = useRef(null);

  useEffect(() => {
    const node = handRef.current;
    if (!node) return undefined;

    let cancelled = false;
    let timer = 0;

    const bump = () => {
      if (cancelled) return;
      node.classList.remove("hero-hi__hand--wave");
      // reflow so the wave can restart
      void node.offsetWidth;
      node.classList.add("hero-hi__hand--wave");
    };

    const start = window.requestAnimationFrame(() => {
      bump();
      timer = window.setInterval(bump, 2200);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(start);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="hero-hi" aria-label="Hi">
      <span className="hero-hi__hand" ref={handRef} aria-hidden="true">
        <Hand size={64} strokeWidth={1.6} />
      </span>
    </div>
  );
}

export default HeroHi;
