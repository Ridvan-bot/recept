---
name: foresla-recept
description: Föreslå ett recept som passar hushållet utifrån recipes/ och state/. Använd när någon ber om middagsförslag, matidéer eller "vad ska vi äta".
---

# Föreslå recept

## När
Använd när användaren vill ha matförslag, middagsidéer, eller liknande — och det inte är feedback eller en lista över vanliga recept.

## Steg
1. Läs `state/denylist.md` och filtrera bort förbjudna recept/ingredienser.
2. Läs `state/preferences.md` och notera gillanden, ogillanden och begränsningar.
3. Läs `state/popularity.json` för tyngd (högre `liked`/`cooked` = starkare kandidat).
4. Bläddra `recipes/` och välj kandidater som matchar preferenser + eventuell kontext (snabb, vegetariskt, barnvänligt, etc.).
5. Välj:
   - **1 huvudförslag** (bästa match)
   - **upp till 2 alternativ**
6. Undvik recept som nyligen föreslagits ofta om det finns likvärdiga alternativ (kolla `feedback-log.jsonl` / senaste liked om det behövs).

## Svarsformat (svenska)
```
🍴 **[Titel]**
Varför: [1–2 meningar kopplade till preferenser]
Fil: `recipes/...`
Tid/effort: [från receptet]

Alternativ:
1. ...
2. ...

Ge feedback med 👍/👎 eller skriv t.ex. "gott", "för kryddigt", "aldrig igen".
```

## Kvalitetsbar
- Föreslå bara recept som faktiskt finns i `recipes/`.
- Citera alltid filväg.
- Om inget bra matchar: säg det, ställ **en** klargörande fråga, och ge närmaste säkra vardagsförslag.
- Om preferenser saknas: fråga om tid/kött/preferens och ge ändå ett enkelt förslag.
