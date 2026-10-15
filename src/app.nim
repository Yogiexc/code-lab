# GitBadge Hub Frontend Logic - Powered by Nim
# Compiles directly into JavaScript for the browser!

import std/[dom, strformat, strutils, jsffi]

proc generateCoAuthorText(name, email: string): string =
  let cleanName = name.strip()
  let cleanEmail = email.strip()
  if cleanName.len == 0 or cleanEmail.len == 0:
    return "# Silakan isi Username & Email Co-Author di form!"
  
  result = fmt"""git commit -m "feat: implement pair collaboration" -m "Co-authored-by: {cleanName} <{cleanEmail}>"
git push origin feature-branch"""

proc initApp*() =
  let nameInput = document.getElementById("coauthor-name")
  let emailInput = document.getElementById("coauthor-email")
  let outputBox = document.getElementById("coauthor-output")
  let genBtn = document.getElementById("btn-generate-coauthor")
  let copyBtn = document.getElementById("btn-copy-coauthor")
  let prInput = document.getElementById("input-pr-count")
  let prOutput = document.getElementById("pr-tier-badge")
  let qaInput = document.getElementById("input-qa-count")
  let qaOutput = document.getElementById("qa-tier-badge")

  proc updateCoAuthor(ev: Event) =
    let nameVal = if nameInput != nil: $nameInput.value else: ""
    let emailVal = if emailInput != nil: $emailInput.value else: ""
    let res = generateCoAuthorText(nameVal, emailVal)
    if outputBox != nil:
      outputBox.innerText = res

  if genBtn != nil:
    genBtn.addEventListener("click", updateCoAuthor)

  if copyBtn != nil:
    copyBtn.addEventListener("click", proc(ev: Event) =
      if outputBox != nil:
        let text = outputBox.innerText
        # Use JS eval/call for modern clipboard API
        jsffi.toJs(window).navigator.clipboard.writeText(text)
        copyBtn.innerText = "✓ Tersalin!"
        discard window.setTimeout(proc() = copyBtn.innerText = "Salin Kode", 2000)
    )

  proc updatePullShark(ev: Event) =
    if prInput != nil and prOutput != nil:
      var val = 0
      try:
        val = parseInt($prInput.value)
      except:
        val = 0
        
      if val >= 128:
        prOutput.innerText = "Gold Tier (x3) - Master Shark 🏆"
        prOutput.style.color = "#fbbf24"
      elif val >= 16:
        prOutput.innerText = "Silver Tier (x2) - Hunter Shark 🦈"
        prOutput.style.color = "#93c5fd"
      elif val >= 2:
        prOutput.innerText = "Bronze Tier (x1) - Baby Shark 🐟"
        prOutput.style.color = "#f472b6"
      else:
        prOutput.innerText = fmt"Kurang {2 - val} PR lagi untuk Bronze"
        prOutput.style.color = "#94a3b8"

  if prInput != nil:
    prInput.addEventListener("input", updatePullShark)

  proc updateGalaxyBrain(ev: Event) =
    if qaInput != nil and qaOutput != nil:
      var val = 0
      try:
        val = parseInt($qaInput.value)
      except:
        val = 0

      if val >= 16:
        qaOutput.innerText = "Gold Tier (x3) - Cosmic Mind 🌌"
        qaOutput.style.color = "#fbbf24"
      elif val >= 8:
        qaOutput.innerText = "Silver Tier (x2) - Super Brain 🧠"
        qaOutput.style.color = "#c084fc"
      elif val >= 2:
        qaOutput.innerText = "Bronze Tier (x1) - Galaxy Novice 💡"
        qaOutput.style.color = "#34d399"
      else:
        qaOutput.innerText = fmt"Kurang {2 - val} jawaban terjawab lagi"
        qaOutput.style.color = "#94a3b8"

  if qaInput != nil:
    qaInput.addEventListener("input", updateGalaxyBrain)

  echo "GitBadge Web Engine successfully compiled from Nim to JavaScript!"

window.onload = proc(e: Event) =
  initApp()
