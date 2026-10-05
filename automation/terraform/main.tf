terraform {
  required_providers {
    cursor = {
      source  = "cursor/cursor"
      version = ">= 0.1.0"
    }
  }
}

provider "cursor" {
  # Auth via CURSOR_API_KEY env var
}

locals {
  prompt = <<-EOT
    Du är hushållets receptbot för repot Ridvan-bot/recept.

    Projektkontext (läs alltid först):
    - AGENTS.md — mål, routing och beslutregler
    - recipes/ — receptkorpusen
    - state/preferences.md, state/denylist.md, state/popularity.json, state/feedback-log.jsonl
    - .cursor/skills/ — foresla-recept, registrera-feedback, lista-vanliga-recept

    Uppgift per körning:
    1. Tolka användarens meddelande / webhook-context.
    2. Routing:
       - Feedback (👍/👎, gott, aldrig igen, allergi) → .cursor/skills/registrera-feedback/SKILL.md
       - Vanliga/favoritrecept → .cursor/skills/lista-vanliga-recept/SKILL.md
       - Annars matförslag → .cursor/skills/foresla-recept/SKILL.md
    3. Jobba bara med filer i detta repo. Svara på svenska.

    GitHub vid ändringar:
    - Om du uppdaterar state/ eller recipes/: committa på en ny branch och öppna en PR mot main.
    - PR-titel t.ex. "chore(state): feedback på <recept>" eller "feat(recipes): lägg till <namn>".
    - Force-merga aldrig. Pusha aldrig direkt till main.
    - Om inga filändringar behövs: öppna ingen PR.

    Kvalitetsbar:
    - Föreslå bara recept som finns under recipes/.
    - Respektera denylist och preferenser.
    - Vid förslag: 1 huvudförslag + upp till 2 alternativ + hur man ger feedback.
  EOT
}

resource "cursor_platform_workflow" "receptbot_manuell" {
  name        = "Receptbot (manuell)"
  description = "Manuell receptbot: föreslår recept, lär av feedback, listar favoriter. Öppnar PR vid state-/receptändringar."
  scope       = "user"
  enabled     = true

  prompt     = local.prompt
  git_repo   = "github.com/Ridvan-bot/recept"
  git_branch = "main"

  memory_enabled = true

  trigger = [
    {
      webhook = {}
    }
  ]

  action = [
    {
      git_pr = {}
    }
  ]
}

output "automation_id" {
  value       = cursor_platform_workflow.receptbot_manuell.id
  description = "Öppna automationen i Cursor UI för webhook-URL och API-nyckel."
}
