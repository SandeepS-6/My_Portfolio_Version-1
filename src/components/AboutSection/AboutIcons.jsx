import { useEffect, useRef } from "react";
import {
  BookOpenIcon,
  ClockIcon,
  DownloadIcon as AnimateDownloadIcon,
  GithubIcon,
  GlobeIcon,
  InstagramIcon,
  LaptopIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  TwitterIcon,
  UserRoundCheckIcon,
} from "@animateicons/react/lucide";

const DURATION = 1.15;

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: MailIcon,
  x: TwitterIcon,
  instagram: InstagramIcon,
  portfolio: GlobeIcon,
};

const FACT_ICONS = {
  status: UserRoundCheckIcon,
  avail: ClockIcon,
  experience: LaptopIcon,
  phone: PhoneIcon,
};

/* Same loop pattern as WhatIDoIcon */
function AnimateIcon({ Icon, size = 16, loop = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const handle = ref.current;
    if (!handle?.startAnimation) return undefined;

    let timer = 0;
    let cancelled = false;

    const start = window.requestAnimationFrame(() => {
      if (cancelled) return;
      handle.startAnimation();
      if (!loop) return;
      timer = window.setInterval(() => {
        handle.startAnimation();
      }, DURATION * 1000 + 320);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(start);
      window.clearInterval(timer);
      handle.stopAnimation?.();
    };
  }, [loop]);

  return (
    <Icon
      ref={ref}
      size={size}
      color="currentColor"
      duration={DURATION}
      isAnimated
    />
  );
}

export function EducationIcon({ size = 14 }) {
  return (
    <span className="about-icon" aria-hidden="true">
      <AnimateIcon Icon={BookOpenIcon} size={size} />
    </span>
  );
}

export function BriefcaseIcon({ size = 14 }) {
  return (
    <span className="about-icon" aria-hidden="true">
      <AnimateIcon Icon={LaptopIcon} size={size} />
    </span>
  );
}

export function DownloadIcon({ size = 16 }) {
  return (
    <span className="about-icon" aria-hidden="true">
      <AnimateIcon Icon={AnimateDownloadIcon} size={size} loop={false} />
    </span>
  );
}

export function FactIcon({ type, size = 18 }) {
  const Icon = FACT_ICONS[type];
  if (!Icon) return null;

  return (
    <span className="about-icon about-icon--fact" aria-hidden="true">
      <AnimateIcon Icon={Icon} size={size} />
    </span>
  );
}

export function SocialIcon({ type, size = 16 }) {
  const Icon = SOCIAL_ICONS[type] || GlobeIcon;
  return (
    <span className="about-icon" aria-hidden="true">
      <AnimateIcon Icon={Icon} size={size} loop={false} />
    </span>
  );
}
