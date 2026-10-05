---
name: lista-vanliga-recept
description: Lista hushållets vanligaste och mest omtyckta recept från state/popularity.json. Använd vid "vanliga recept", "favoriter", "vad lagar vi oftast".
---

# Lista vanliga recept

## När
Använd när användaren ber om vanliga recept, favoriter, "vad lagar vi oftast", populära rätter, eller liknande.

## Steg
1. Läs `state/popularity.json`.
2. Filtrera bort recept i `state/denylist.md`.
3. Rankning (primär → sekundär):
   1. `cooked` (högst först)
   2. `liked`
   3. alfabetisk titel som tie-break
4. Läs motsvarande filer i `recipes/` för titel, tags och summary.
5. Returnera topp N (standard **10**, eller det antal användaren ber om).

## Svarsformat (svenska)
```
📋 **Våra vanligaste recept**

1. **Titel** — lagat X gånger, gillat Y · `recipes/...`
   Kort summary
2. ...
```

Om listan är tom: säg att popularity ännu saknas och föreslå att de reagerar 👍 när de lagat något, eller ge 3 startförslag från `recipes/`.

## Extra
Om användaren frågar efter "glömda favoriter": recept med högt `liked` men lågt senaste `cooked`/förslag — nämn 1–2 stycken sist.
