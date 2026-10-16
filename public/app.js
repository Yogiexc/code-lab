const BADGES_SPEC = [
  {
    id: "quickdraw",
    name: "Quickdraw",
    window: "< 5m",
    desc: "Close an issue or pull request within 5 minutes of opening.",
    steps: [
      "Create a new issue in any public repository.",
      "Submit with any arbitrary title.",
      "Immediately click 'Close issue' within seconds."
    ]
  },
  {
    id: "pull-shark",
    name: "Pull Shark",
    window: "Cumulative",
    desc: "Open pull requests that are subsequently merged into the default branch.",
    steps: [
      "Tier 1 (Bronze): 2 pull requests merged.",
      "Tier 2 (Silver): 16 pull requests merged.",
      "Tier 3 (Gold): 128 pull requests merged."
    ]
  },
  {
    id: "galaxy-brain",
    name: "Galaxy Brain",
    window: "Discussions",
    desc: "Have answers accepted in GitHub Discussions under Q&A categories.",
    steps: [
      "Enable Discussions in repository settings.",
      "Receive questions in Q&A discussion format.",
      "Provide answers marked with 'Mark as answer' (2x for Tier 1)."
    ]
  },
  {
    id: "pair-extraordinaire",
    name: "Pair Extraordinaire",
    window: "Co-authored",
    desc: "Merge pull requests containing Co-authored-by commit trailers.",
    steps: [
      "Add RFC-compliant Co-authored-by trailers in commit metadata.",
      "Ensure co-author email corresponds to a verified GitHub profile.",
      "Merge pull request into default branch (main)."
    ]
  },
  {
    id: "yolo",
    name: "YOLO",
    window: "Unreviewed",
    desc: "Merge a pull request without waiting for reviewer approval.",
    steps: [
      "Request review from a designated collaborator.",
      "Directly merge the pull request before review completion."
    ]
  },
  {
    id: "starstruck",
    name: "Starstruck",
    window: "16+ Stars",
    desc: "Maintain a public repository that reaches specific star count thresholds.",
    steps: [
      "Tier 1 (Bronze): 16 stars.",
      "Tier 2 (Silver): 128 stars.",
      "Tier 3 (Gold): 512 stars."
    ]
  },
  {
    id: "public-sponsor",
    name: "Public Sponsor",
    window: "$1 Tier",
    desc: "Sponsor open-source contributors with public visibility on GitHub Sponsors.",
    steps: [
      "Navigate to an eligible maintainer with a $1 sponsorship tier.",
      "Select public visibility during checkout.",
      "Badge updates permanently upon transaction confirmation."
    ]
  }
];

// Persistent state
let verifiedBadges = JSON.parse(localStorage.getItem("gitbadge_state") || '["quickdraw", "pull-shark", "yolo", "galaxy-brain"]');

function syncInterface() {
  const total = BADGES_SPEC.length;
  const count = verifiedBadges.length;
  const pct = Math.round((count / total) * 100);

  const fill = document.getElementById("progress-fill");
  const label = document.getElementById("unlocked-count");

  if (fill) fill.style.width = pct + "%";
  if (label) label.innerText = `${count} of ${total} Verified (${pct}%)`;

  BADGES_SPEC.forEach(item => {
    const card = document.getElementById(`card-${item.id}`);
    const btn = document.getElementById(`btn-${item.id}`);
    if (card && btn) {
      if (verifiedBadges.includes(item.id)) {
        card.classList.add("is-active");
        btn.innerText = "Verified";
      } else {
        card.classList.remove("is-active");
        btn.innerText = "Mark Verified";
      }
    }
  });

  localStorage.setItem("gitbadge_state", JSON.stringify(verifiedBadges));
}

function toggleBadgeState(id) {
  if (verifiedBadges.includes(id)) {
    verifiedBadges = verifiedBadges.filter(x => x !== id);
  } else {
    verifiedBadges.push(id);
  }
  syncInterface();
}

function renderCatalog() {
  const container = document.getElementById("badge-grid-container");
  if (!container) return;

  container.innerHTML = BADGES_SPEC.map(item => `
    <article class="spec-card" id="card-${item.id}">
      <div class="spec-top">
        <span class="spec-name">${item.name}</span>
        <span class="spec-time">${item.window}</span>
      </div>
      <p class="spec-desc">${item.desc}</p>
      <ul class="spec-steps">
        ${item.steps.map(s => `<li>${s}</li>`).join('')}
      </ul>
      <div class="spec-action">
        <button id="btn-${item.id}" class="btn-toggle" onclick="toggleBadgeState('${item.id}')">
          Mark Verified
        </button>
      </div>
    </article>
  `).join('');

  syncInterface();
}

function initCalculator() {
  const prInput = document.getElementById("input-pr-count");
  const prBadge = document.getElementById("pr-tier-badge");
  const qaInput = document.getElementById("input-qa-count");
  const qaBadge = document.getElementById("qa-tier-badge");

  if (prInput && prBadge) {
    prInput.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) || 0;
      if (v >= 128) {
        prBadge.innerText = "Gold Tier (x3) — 128 PRs";
      } else if (v >= 16) {
        prBadge.innerText = "Silver Tier (x2) — 16 PRs";
      } else if (v >= 2) {
        prBadge.innerText = "Bronze Tier (x1) — 2 PRs";
      } else {
        prBadge.innerText = `${2 - v} PRs needed for Bronze`;
      }
    });
  }

  if (qaInput && qaBadge) {
    qaInput.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) || 0;
      if (v >= 16) {
        qaBadge.innerText = "Gold Tier (x3) — 16 Answers";
      } else if (v >= 8) {
        qaBadge.innerText = "Silver Tier (x2) — 8 Answers";
      } else if (v >= 2) {
        qaBadge.innerText = "Bronze Tier (x1) — 2 Answers";
      } else {
        qaBadge.innerText = `${2 - v} answers needed for Bronze`;
      }
    });
  }

  const nameInput = document.getElementById("coauthor-name");
  const emailInput = document.getElementById("coauthor-email");
  const genBtn = document.getElementById("btn-generate-coauthor");
  const outBox = document.getElementById("coauthor-output");
  const copyBtn = document.getElementById("btn-copy-coauthor");

  if (genBtn && outBox) {
    genBtn.addEventListener("click", () => {
      const name = (nameInput?.value || "Aytsrp").trim();
      const email = (emailInput?.value || "Aytsrp@users.noreply.github.com").trim();
      outBox.innerText = `git commit -m "feat: implement pair collaboration" -m "Co-authored-by: ${name} <${email}>"\ngit push origin feature-branch`;
    });
  }

  if (copyBtn && outBox) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outBox.innerText);
      copyBtn.innerText = "Copied";
      setTimeout(() => copyBtn.innerText = "Copy", 1500);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  initCalculator();
});
