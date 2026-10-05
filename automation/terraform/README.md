# Manuell receptautomation via Terraform

Skapar samma automation som beskrivs i `../PROMPT.md`.

## Krav
1. Terraform >= 1.5
2. Cursor API-nyckel: https://cursor.com/settings (API Keys) → sätt `export CURSOR_API_KEY=...`
3. GitHub-koppling redan aktiv för Cloud Agents / Automations

## Användning

```bash
cd automation/terraform
terraform init
terraform apply
```

Efter apply: öppna automationen i Cursor-dashboarden, kopiera webhook-URL + auth header, och starta manuellt med curl (se `../PROMPT.md`).

## Obs
Cloud Agents kan inte skapa automationen utan din API-nyckel. Denna modul är till för dig (eller en senare agent med nyckeln i miljön).
