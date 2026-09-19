/**
 * Site-wide print furniture: column rules, registration crosses and one
 * crop square, fixed to the viewport behind everything (like the grain).
 * Ghost numerals stay page-specific — home renders its own "26".
 */
export function Backdrop() {
  return (
    <div className="pBackdropGlobal" aria-hidden="true">
      <span className="pHeroRules" />
      <span className="pHeroCross pHeroCross--tl" />
      <span className="pHeroCross pHeroCross--br" />
      <span className="pHeroSquare" />
    </div>
  );
}
