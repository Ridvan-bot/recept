# recept

Detta repo innehåller recept på mat, förrätter, efterrätter med mera — plus en **receptbot** som kan föreslå rätter, lära sig av feedback och lista våra vanligaste recept.

Webben (mobil först) ligger på [recept-six.vercel.app](https://recept-six.vercel.app). Där kan man söka, filtrera, få middagsförslag och laga steg för steg.

## Struktur

```text
app/              # Next.js-frontend (mobil)
components/       # UI för lista, förslag och receptvy
lib/              # Läser recipes/ och state/ vid build
recipes/          # Receptkorpus (vardagsmat, bakverk)
state/            # Preferenser, feedback, popularity, denylist
templates/        # Mall för nya recept
.cursor/skills/   # Skills: föreslå, registrera feedback, lista vanliga
automation/       # Prompt att klistra in i Cursor Automations
AGENTS.md         # Instruktioner för agenten
```

## Vad boten kan

1. **Föreslå recept** utifrån `recipes/` + era preferenser
2. **Lära sig** när ni ger 👍/👎 eller kommentarer (uppdaterar `state/`)
3. **Lista vanligaste recept** via `state/popularity.json`

## Kom igång

1. Lägg till/justera recept under `recipes/`
2. Fyll i allergier i `state/denylist.md` och gärna smak i `state/preferences.md`
3. Skapa den **manuella** Cursor-automationen enligt `automation/PROMPT.md`
   - Trigger: Webhook (du startar själv)
   - Repo: detta repo
   - Vid ändringar: committa och pusha till `main`

Lokalt: `npm install` och `npm run dev`. Push till `main` deployar sajten på Vercel.

## Lägga till recept

Kopiera `templates/recept.md` till rätt mapp under `recipes/` och fyll i.
