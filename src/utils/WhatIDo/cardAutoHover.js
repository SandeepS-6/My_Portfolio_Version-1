/*
  Randomly lights cards with the L→R fill (same look as hover).
*/
export function bindCardAutoHover(section, { holdMs = 1600, gapMs = 220 } = {}) {
  const cards = Array.from(section?.querySelectorAll(".what-i-do__card") || []);
  if (cards.length === 0) return () => {};

  let current = -1;
  let timer = 0;
  let alive = true;

  function clearHot() {
    cards.forEach((card) => card.classList.remove("what-i-do__card--hot"));
  }

  function pickNext() {
    if (!alive || cards.length === 0) return;
    clearHot();

    let next = Math.floor(Math.random() * cards.length);
    if (cards.length > 1 && next === current) {
      next = (next + 1) % cards.length;
    }
    current = next;
    cards[current].classList.add("what-i-do__card--hot");

    timer = window.setTimeout(() => {
      if (!alive) return;
      clearHot();
      timer = window.setTimeout(pickNext, gapMs);
    }, holdMs);
  }

  pickNext();

  return () => {
    alive = false;
    window.clearTimeout(timer);
    clearHot();
  };
}
