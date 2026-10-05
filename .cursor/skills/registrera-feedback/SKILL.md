---
name: registrera-feedback
description: Registrera gillande/ogillande av receptförslag och uppdatera state så boten lär sig. Använd vid 👍/👎, "gott", "aldrig igen", allergier eller smakkommentarer.
---

# Registrera feedback

## När
Använd när användaren ger feedback på ett tidigare förslag eller uppdaterar matpreferenser (inklusive emoji-reaktioner).

## Signalmappning
| Input | signal |
| --- | --- |
| 👍, "gott", "bra", "laga igen", "favorit" | `thumbs_up` |
| 👎, "inte gott", "nej" | `thumbs_down` |
| "aldrig igen", "förbjud", starkt ogillande | `never_again` |
| allergi / intolerans | `allergy` |
| fri text om smak/tid/krydda | `note` |

## Steg
1. Identifiera vilket recept feedbacken gäller (från meddelande, tråd eller senaste förslag).
2. Appenda en rad till `state/feedback-log.jsonl`:
   ```json
   {"ts":"ISO-8601","recipe":"recipes/.../fil.md","signal":"thumbs_up","note":"valfri text","source":"slack|agent|manual"}
   ```
3. Uppdatera `state/popularity.json`:
   - `thumbs_up` → +1 `liked` (och gärna +1 `cooked` om de lagade det)
   - `thumbs_down` → ingen liked-ökning; notera i preferences
   - Explicit "vi lagade X" → +1 `cooked`
4. Uppdatera `state/preferences.md` med en kort, aggregerad lärdom (inte bara rålogg).
5. Vid `never_again` eller allergi: lägg till i `state/denylist.md`.
6. Bekräfta kort på svenska vad du sparat.

## Preferences-skrivstil
Skriv om `state/preferences.md` så den förblir en läsbar smakprofil:
- Gillar / ogillar
- Begränsningar
- Mönster (t.ex. "föredrar snabba vardagsrätter under 30 min")
- Senaste lärdomar (max 5–8 punkter)

## Repo
När automation körs: committa state-ändringar och öppna PR med titel i stil med `chore(state): feedback på <recept>`.
Force-merga aldrig.
