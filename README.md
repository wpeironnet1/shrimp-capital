# Shrimp Capital

**Build generational shellth.** A humorous mobile idle game about turning a bedroom shrimp tank into an aquatic financial empire.

## First playable build

- Tap-to-hatch shrimp farming loop
- Sell shrimp for cash and XP
- Persistent local save and offline growth
- 24 species across seven level-gated rarity tiers
- Tank capacity and compounding operations upgrades
- Farm, market, and future clans screens
- Mobile-first dark pixel-inspired visual system
- Haptic interactions
- Automatic timed hatching with a live production countdown
- Offline-return report showing shrimp produced while away
- Starter mission chain with tracked progress and cash rewards
- Code-native pixel shrimp sprites, aquarium plants, and animated swimming
- Daily Market Open rewards with persistent streak progression
- Population-accurate aquarium display (performance-capped at 24 visible shrimp)
- Independently wandering shrimp with three tap reactions: spin-and-dart, shimmy, and bubble burst
- Rarity patterns, claws, crests, fan tails, long feelers, and tier-based sizes
- Multi-stage animated filter, heater, algae, and tank-expansion installations
- Persistent 1-in-500 accessory hatches with tiny gold chains or crowns

## Run locally

```bash
npm install
npm start
```

Scan the QR code using Expo Go, or press `i`, `a`, or `w` for iOS, Android, or web.

## Product direction

The game will remain free at its core. Future monetization is designed around optional acceleration and cosmetics: hatch-speed boosts, tank themes, seasonal passes, and clan cosmetics. Purchases must never be represented as real investments or real-world returns.

## Roadmap

1. Pixel-art sprite and aquarium animation pass
2. Timed automatic hatch cycles and offline earnings recap
3. Missions, daily rewards, achievements, and prestige mechanic
4. Supabase accounts and cloud saves
5. Friends, clans, clan harvests, and leaderboards
6. RevenueCat in-app purchases and cosmetic store
7. Balance testing, analytics, TestFlight, and Play Store beta

## Stack

Expo, React Native, TypeScript, Expo Router, AsyncStorage.

## Vercel preview

Vercel is configured to run the Expo web export and serve the generated `dist` directory. Every push to `main` creates a fresh production preview.
