const BADGES_DATA = [
  {
    id: "quickdraw",
    title: "Quickdraw",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>`,
    speed: "< 5 Menit",
    pill: "Fast Track",
    pillClass: "pill-fast",
    desc: "Menutup issue atau pull request dalam waktu kurang dari 5 menit setelah dibuat.",
    steps: [
      "Buka tab Issues di repositori publik.",
      "Klik New issue dan masukkan judul apa saja.",
      "Langsung klik tombol 'Close issue' dalam hitungan detik."
    ]
  },
  {
    id: "pull-shark",
    title: "Pull Shark",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>`,
    speed: "2 - 5 Menit",
    pill: "Core Milestone",
    pillClass: "pill-fast",
    desc: "Membuka dan menggabungkan (merge) Pull Request ke branch utama.",
    steps: [
      "Bronze (x1): Merge 2 PR ke main branch.",
      "Silver (x2): Merge 16 PR (Status aktif akunmu).",
      "Gold (x3): Merge 128 PR menuju milestone tertinggi."
    ]
  },
  {
    id: "galaxy-brain",
    title: "Galaxy Brain",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>`,
    speed: "5 Menit",
    pill: "Discussions",
    pillClass: "pill-community",
    desc: "Mendapatkan jawaban yang disetujui (marked as answer) pada forum GitHub Discussions.",
    steps: [
      "Aktifkan fitur Discussions di menu Settings repositori.",
      "Buat thread diskusi dengan kategori Q&A.",
      "Tanggapi pertanyaan lalu tandai sebagai 'Mark as answer' (2x untuk Bronze)."
    ]
  },
  {
    id: "pair-extraordinaire",
    title: "Pair Extraordinaire",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    speed: "3 Menit",
    pill: "Collaboration",
    pillClass: "pill-community",
    desc: "Melakukan merge pull request yang memiliki metadata commit trailer Co-authored-by:.",
    steps: [
      "Gunakan generator trailer di panel atas untuk format yang valid.",
      "Pastikan email kolaborator terhubung dengan akun GitHub aktif.",
      "Merge pull request tersebut ke branch default (main)."
    ]
  },
  {
    id: "yolo",
    title: "YOLO",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    speed: "1 Menit",
    pill: "Autonomous",
    pillClass: "pill-elite",
    desc: "Melakukan merge pull request secara mandiri tanpa menunggu peninjauan reviewer.",
    steps: [
      "Saat membuat PR, minta peninjauan (request review) ke kolaborator.",
      "Tanpa menunggu review selesai, langsung klik Merge pull request."
    ]
  },
  {
    id: "starstruck",
    title: "Starstruck",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    speed: "16 Stars",
    pill: "Popularity",
    pillClass: "pill-elite",
    desc: "Memiliki repositori publik yang memperoleh akumulasi minimal 16 Stars.",
    steps: [
      "Publikasikan proyek atau dokumentasi repositori.",
      "Bronze (x1): 16 Stars.",
      "Silver (x2): 128 Stars.",
      "Gold (x3): 512 Stars."
    ]
  },
  {
    id: "public-sponsor",
    title: "Public Sponsor",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    speed: "Tier $1",
    pill: "Sponsorship",
    pillClass: "pill-elite",
    desc: "Mendukung maintainer repositori open-source secara publik via GitHub Sponsors.",
    steps: [
      "Kunjungi profil pengembang yang menyediakan tier sponsor $1.",
      "Pilih paket $1 dan pastikan opsi visibilitas 'Public sponsor' aktif.",
      "Badge sponsor akan tersemat permanen pada profil GitHub."
    ]
  }
];

// State
let checkedBadges = JSON.parse(localStorage.getItem("gitbadge_progress") || '["quickdraw", "pull-shark", "yolo", "galaxy-brain"]');

function updateProgressUI() {
  const total = BADGES_DATA.length;
  const unlocked = checkedBadges.length;
  const percent = Math.round((unlocked / total) * 100);

  const fillEl = document.getElementById("progress-fill");
  const countEl = document.getElementById("unlocked-count");
  const percentEl = document.getElementById("unlocked-percent");

  if (fillEl) fillEl.style.width = percent + "%";
  if (countEl) countEl.innerText = `${unlocked} / ${total} Unlocked`;
  if (percentEl) percentEl.innerText = `${percent}%`;

  BADGES_DATA.forEach(b => {
    const card = document.getElementById(`card-${b.id}`);
    const btn = document.getElementById(`check-${b.id}`);
    if (card && btn) {
      if (checkedBadges.includes(b.id)) {
        card.classList.add("badge-card-unlocked");
        btn.innerHTML = `<svg class="ui-icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Terverifikasi`;
        btn.classList.add("btn-claimed");
      } else {
        card.classList.remove("badge-card-unlocked");
        btn.innerHTML = `Tandai Terverifikasi`;
        btn.classList.remove("btn-claimed");
      }
    }
  });

  localStorage.setItem("gitbadge_progress", JSON.stringify(checkedBadges));
}

function toggleBadge(id) {
  if (checkedBadges.includes(id)) {
    checkedBadges = checkedBadges.filter(x => x !== id);
  } else {
    checkedBadges.push(id);
  }
  updateProgressUI();
}

function renderBadges() {
  const container = document.getElementById("badge-grid-container");
  if (!container) return;

  container.innerHTML = BADGES_DATA.map(b => `
    <article class="badge-card" id="card-${b.id}">
      <div class="badge-header">
        <div class="badge-icon-box">${b.iconSvg}</div>
        <div class="badge-info">
          <h3>${b.title}</h3>
          <span class="badge-pill ${b.pillClass}">${b.pill} • ${b.speed}</span>
        </div>
      </div>
      <div class="badge-body">
        <p>${b.desc}</p>
        <ul class="steps-list">
          ${b.steps.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="badge-card-footer">
        <button id="check-${b.id}" class="btn-toggle-badge" onclick="toggleBadge('${b.id}')">
          Tandai Terverifikasi
        </button>
      </div>
    </article>
  `).join('');

  updateProgressUI();
}

function setupCopyButton() {
  const copyBtn = document.getElementById("btn-copy-coauthor");
  const outputBox = document.getElementById("coauthor-output");
  if (copyBtn && outputBox) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputBox.innerText);
      copyBtn.innerText = "Tersalin";
      setTimeout(() => copyBtn.innerText = "Salin Kode", 2000);
    });
  }
}

function setupSimulator() {
  const prInput = document.getElementById("input-pr-count");
  const prBadge = document.getElementById("pr-tier-badge");
  const qaInput = document.getElementById("input-qa-count");
  const qaBadge = document.getElementById("qa-tier-badge");

  if (prInput && prBadge) {
    prInput.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) || 0;
      if (v >= 128) {
        prBadge.innerText = "Gold Tier (x3) - 128 PRs Merged";
        prBadge.style.color = "#fbbf24";
      } else if (v >= 16) {
        prBadge.innerText = "Silver Tier (x2) - 16 PRs Merged";
        prBadge.style.color = "#93c5fd";
      } else if (v >= 2) {
        prBadge.innerText = "Bronze Tier (x1) - 2 PRs Merged";
        prBadge.style.color = "#f472b6";
      } else {
        prBadge.innerText = `Kurang ${2 - v} PR lagi untuk Bronze`;
        prBadge.style.color = "#94a3b8";
      }
    });
  }

  if (qaInput && qaBadge) {
    qaInput.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) || 0;
      if (v >= 16) {
        qaBadge.innerText = "Gold Tier (x3) - 16 Answers Accepted";
        qaBadge.style.color = "#fbbf24";
      } else if (v >= 8) {
        qaBadge.innerText = "Silver Tier (x2) - 8 Answers Accepted";
        qaBadge.style.color = "#c084fc";
      } else if (v >= 2) {
        qaBadge.innerText = "Bronze Tier (x1) - 2 Answers Accepted";
        qaBadge.style.color = "#34d399";
      } else {
        qaBadge.innerText = `Kurang ${2 - v} jawaban terjawab lagi`;
        qaBadge.style.color = "#94a3b8";
      }
    });
  }

  const nameInput = document.getElementById("coauthor-name");
  const emailInput = document.getElementById("coauthor-email");
  const genBtn = document.getElementById("btn-generate-coauthor");
  const outBox = document.getElementById("coauthor-output");

  if (genBtn && outBox) {
    genBtn.addEventListener("click", () => {
      const name = (nameInput?.value || "Aytsrp").trim();
      const email = (emailInput?.value || "Aytsrp@users.noreply.github.com").trim();
      outBox.innerText = `git commit -m "feat: implement pair collaboration" -m "Co-authored-by: ${name} <${email}>"\ngit push origin feature-branch`;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderBadges();
  setupSimulator();
  setupCopyButton();
});
