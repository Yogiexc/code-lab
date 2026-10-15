# GitBadge Hub - Core Logic in Nim
# Module: badge_engine.nim
# Digunakan untuk kalkulasi status medali, rekomendasi step, dan generate Co-Authored-By commit trailer.

import std/[strformat, strutils, json]

type
  AchievementTier* = enum
    Locked = "Locked",
    Bronze = "Bronze",
    Silver = "Silver",
    Gold = "Gold"

  Achievement* = object
    id*: string
    title*: string
    tier*: AchievementTier
    badgeIcon*: string
    description*: string
    nextRequirement*: string

proc generateCoAuthorTrailer*(name, email: string): string =
  let cleanName = name.strip()
  let cleanEmail = email.strip()
  if cleanName.len == 0 or cleanEmail.len == 0:
    return ""
  return fmt"Co-authored-by: {cleanName} <{cleanEmail}>"

proc calculatePullSharkTier*(mergedPRCount: int): Achievement =
  result.id = "pull-shark"
  result.title = "Pull Shark"
  result.badgeIcon = "🦈"
  result.description = "Diberikan untuk kontribusi pull request yang telah berhasil di-merge."
  
  if mergedPRCount >= 128:
    result.tier = Gold
    result.nextRequirement = "Max Level Reached! 🌟"
  elif mergedPRCount >= 16:
    result.tier = Silver
    result.nextRequirement = fmt"Butuh {128 - mergedPRCount} PR lagi menuju Gold Tier (128 PR)"
  elif mergedPRCount >= 2:
    result.tier = Bronze
    result.nextRequirement = fmt"Butuh {16 - mergedPRCount} PR lagi menuju Silver Tier (16 PR)"
  else:
    result.tier = Locked
    result.nextRequirement = fmt"Butuh {2 - mergedPRCount} PR lagi untuk membuka Bronze Tier"

proc calculateGalaxyBrainTier*(acceptedAnswers: int): Achievement =
  result.id = "galaxy-brain"
  result.title = "Galaxy Brain"
  result.badgeIcon = "🧠"
  result.description = "Diberikan ketika jawabanmu di GitHub Discussions di-mark as answer."
  
  if acceptedAnswers >= 16:
    result.tier = Gold
    result.nextRequirement = "Max Level Reached! 🌟"
  elif acceptedAnswers >= 8:
    result.tier = Silver
    result.nextRequirement = fmt"Butuh {16 - acceptedAnswers} jawaban lagi menuju Gold Tier (16 Answers)"
  elif acceptedAnswers >= 2:
    result.tier = Bronze
    result.nextRequirement = fmt"Butuh {8 - acceptedAnswers} jawaban lagi menuju Silver Tier (8 Answers)"
  else:
    result.tier = Locked
    result.nextRequirement = fmt"Butuh {2 - acceptedAnswers} jawaban lagi untuk membuka Bronze Tier"

proc exportAchievementsJson*(prCount, qaCount: int): string =
  let ps = calculatePullSharkTier(prCount)
  let gb = calculateGalaxyBrainTier(qaCount)
  
  var j = newJObject()
  var achArr = newJArray()
  
  achArr.add(%* {
    "id": ps.id,
    "title": ps.title,
    "tier": $ps.tier,
    "icon": ps.badgeIcon,
    "req": ps.nextRequirement
  })
  
  achArr.add(%* {
    "id": gb.id,
    "title": gb.title,
    "tier": $gb.tier,
    "icon": gb.badgeIcon,
    "req": gb.nextRequirement
  })
  
  j["achievements"] = achArr
  return $j

when isMainModule:
  echo "=== GitBadge Nim Engine Initialization ==="
  echo "Pull Shark Tier: ", calculatePullSharkTier(16).tier
  echo "Sample Co-Author: ", generateCoAuthorTrailer("Aytsrp", "Aytsrp@users.noreply.github.com")
