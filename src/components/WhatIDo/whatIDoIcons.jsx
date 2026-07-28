import {
  ActivityIcon,
  BrainIcon,
  CompassIcon,
  LayersIcon,
  LayoutGridIcon,
  LinkIcon,
  RefreshCwIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  TerminalIcon,
  ZapIcon,
} from "@animateicons/react/lucide";
import { useEffect, useRef } from "react";

const ICONS = {
  search: SearchIcon,
  compass: CompassIcon,
  brain: BrainIcon,
  palette: BrainIcon,
  layout: LayoutGridIcon,
  server: TerminalIcon,
  cable: LinkIcon,
  database: LayersIcon,
  shield: ShieldCheckIcon,
  rocket: RocketIcon,
  gauge: ZapIcon,
  activity: ActivityIcon,
  refresh: RefreshCwIcon,
};

const ICON_SIZE = 24;
const DURATION = 1.15;

export function WhatIDoIcon({ name, size = ICON_SIZE }) {
  const ref = useRef(null);
  const Icon = ICONS[name] || LayoutGridIcon;

  useEffect(() => {
    const handle = ref.current;
    if (!handle?.startAnimation) return undefined;

    let timer = 0;
    let cancelled = false;

    const start = window.requestAnimationFrame(() => {
      if (cancelled) return;
      handle.startAnimation();
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
  }, []);

  return (
    <span className="what-i-do__icon" aria-hidden="true">
      <Icon
        ref={ref}
        size={size}
        color="currentColor"
        duration={DURATION}
        isAnimated
      />
    </span>
  );
}
