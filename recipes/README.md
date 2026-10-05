# Receptindex

Alla recept ligger under `recipes/<kategori>/` som Markdown.

## Kategorier
- `vardagsmat/` — middagar för vanliga dagar
- `snabbt/` — under ca 25 minuter
- `bakverk/` — fika och bak

## Lägga till nytt recept
1. Kopiera `templates/recept.md`
2. Spara under rätt kategori med kebab-case-filnamn
3. Lägg gärna in receptet i `state/popularity.json` med `cooked: 0`, `liked: 0`

Se även `AGENTS.md` för hur receptboten använder korpusen.
