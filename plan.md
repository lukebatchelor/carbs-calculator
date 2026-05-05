# Carbs Tracker PWA — Plan

## Goal
Mobile-first PWA for calculating how much of a food to eat based on carb targets.

---

## Calculators

### Tab 1 — By Serves
- Input: **serves** (1 serve = 15g carbs)
- Input: **carbs per 100g** of the food
- Output: `(serves × 15) / carbs_per_100g × 100` grams of food

### Tab 2 — By Total Carbs
- Input: **target carbs** (grams)
- Input: **carbs per 100g** of the food
- Output: `target_carbs / carbs_per_100g × 100` grams of food

Both calculate in real-time as the user types. No submit button needed.

---

## PWA Setup

### Dependencies to add
- `tailwindcss @tailwindcss/vite` — Tailwind v4 (Vite plugin, no config file needed)
- `vite-plugin-pwa` — service worker + manifest

### PWA manifest
- Name: Carbs Tracker
- Short name: Carbs
- Theme colour: a clean green
- Icons: generate a simple SVG → PNG set (192, 512)
- Display: standalone
- Orientation: portrait

### index.html changes
- Add `theme-color` meta tag
- Add `apple-mobile-web-app-capable` meta tags
- Link manifest

---

## File Structure

```
src/
  components/
    ServesCalculator.tsx     # Tab 1 form + result
    TotalCarbsCalculator.tsx # Tab 2 form + result
    TabBar.tsx               # Bottom tab navigation
    InputField.tsx           # Reusable large-touch input
    ResultDisplay.tsx        # Prominent result card
  App.tsx                    # Tab state, layout shell
  main.tsx
  index.css                  # @import "tailwindcss"
public/
  icons/                     # PWA icons (192, 512)
  manifest.json
```

---

## UI / UX

- **Bottom tab bar** — native-feeling mobile nav, large touch targets
- **Large number inputs** — `inputmode="decimal"` for numeric keyboard on mobile
- **Result card** — big bold number, clearly labelled unit (grams)
- **Immediate feedback** — result updates as user types; show placeholder/hint when inputs are empty
- **Safe area insets** — `env(safe-area-inset-*)` padding for notched phones
- Colour scheme: white background, accent green, dark text — clean and clinical

---

## Implementation Order

1. Add Tailwind + PWA dependencies
2. Wire up Tailwind in `vite.config.ts` and `index.css`
3. Configure PWA plugin (manifest, icons)
4. Update `index.html` (viewport, meta tags)
5. Build `InputField` and `ResultDisplay` components
6. Build `ServesCalculator` and `TotalCarbsCalculator`
7. Build `TabBar`
8. Wire everything in `App.tsx`
9. Smoke test in browser / mobile viewport

---

## Future tabs (not in scope now)
- Saved foods library — store common foods with carbs/100g, tap to populate calculator
