import { useEffect, useRef, useState } from "react";
import HeroContent from "./HeroContent";
import SkillBadge from "../SkillBadge/SkillBadge";
import { getSkills } from "../../services/skills";
import {
  createMotionMap,
  updateBadgeMotion,
  resolveBadgeCollisions,
  applyBadgeTransform,
} from "./badgeMotion";
import "./Hero.css";

/*
  Hero layout unchanged.
  Animation loop:
  1) continuous idle drift + wrap
  2) mouse repulsion
  3) badge ↔ badge soft collisions
*/

function Hero() {
  const [skills, setSkills] = useState([]);

  const heroRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isInside: false });
  const cloudSizeRef = useRef({ width: 0, height: 0 });
  const badgeElementsRef = useRef({});
  const badgeMotionRef = useRef({});
  const skillsDataRef = useRef([]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    async function loadSkills() {
      const data = await getSkills();
      if (!isMounted) return;

      setSkills(data);
      skillsDataRef.current = data;
      badgeMotionRef.current = createMotionMap(data);
    }

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    function updateCloudSize() {
      cloudSizeRef.current.width = hero.clientWidth;
      cloudSizeRef.current.height = hero.clientHeight;
    }

    // Seed mouse at hero text center so badges react before first move
    function seedMouseAtTextCenter() {
      const pitch = hero.querySelector(".hero-pitch");
      const target = pitch || hero;
      const heroRect = hero.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      mouseRef.current.x =
        targetRect.left + targetRect.width / 2 - heroRect.left;
      mouseRef.current.y =
        targetRect.top + targetRect.height / 2 - heroRect.top;
      mouseRef.current.isInside = true;
    }

    function handleMouseMove(event) {
      const rect = hero.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.isInside = true;
    }

    function handleMouseLeave() {
      mouseRef.current.isInside = false;
    }

    updateCloudSize();
    seedMouseAtTextCenter();
    window.addEventListener("resize", updateCloudSize);
    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", updateCloudSize);
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frameId = 0;
    lastTimeRef.current = performance.now();

    function animate(now) {
      if (!cloudSizeRef.current.width || !cloudSizeRef.current.height) {
        cloudSizeRef.current.width = hero.clientWidth;
        cloudSizeRef.current.height = hero.clientHeight;
      }

      const rawDt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      // Normalize to ~60fps steps; clamp so tab-switch doesn't teleport badges
      const dt = Math.min(2.5, rawDt / 16.67);

      const { width, height } = cloudSizeRef.current;
      const skillsList = skillsDataRef.current;
      const activeMotions = [];

      for (let i = 0; i < skillsList.length; i++) {
        const skill = skillsList[i];
        const motion = badgeMotionRef.current[skill.id];
        const element = badgeElementsRef.current[skill.id];

        if (!motion || !element) continue;

        const didUpdate = updateBadgeMotion(
          motion,
          mouseRef.current,
          width,
          height,
          dt,
          now
        );

        if (didUpdate) {
          activeMotions.push(motion);
        }
      }

      // Separate overlapping badges after everyone has moved
      resolveBadgeCollisions(activeMotions);

      for (let i = 0; i < skillsList.length; i++) {
        const skill = skillsList[i];
        const motion = badgeMotionRef.current[skill.id];
        const element = badgeElementsRef.current[skill.id];
        if (!motion || !element || !motion.ready) continue;
        applyBadgeTransform(element, motion);
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  function setBadgeRef(skillId) {
    return (node) => {
      if (node) {
        badgeElementsRef.current[skillId] = node;
      } else {
        delete badgeElementsRef.current[skillId];
      }
    };
  }

  return (
    <section className="hero" id="home" aria-label="Introduction" ref={heroRef}>
      <div className="hero__skills" aria-hidden="true">
        {skills.map((skill) => (
          <SkillBadge
            key={skill.id}
            skill={skill}
            ref={setBadgeRef(skill.id)}
          />
        ))}
      </div>

      <div className="hero__inner">
        <HeroContent />
      </div>
    </section>
  );
}

export default Hero;
