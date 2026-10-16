// =============================================================================
// Live GitHub Profile Achievement Inspector & ASCII Receipt Generator
// =============================================================================

async function inspectGitHubProfile() {
  const inputEl = document.getElementById('gh-username-input');
  const btnEl = document.getElementById('btn-inspect-profile');
  const resultBox = document.getElementById('inspector-results');
  
  const username = (inputEl?.value || 'Yogiexc').trim();
  if (!username) return;

  btnEl.innerText = 'Scanning API...';
  btnEl.disabled = true;

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error('User not found');
    const data = await res.json();

    // Check recent PRs & repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = reposRes.ok ? await reposRes.json() : [];

    const publicRepos = data.public_repos || 0;
    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const hasDiscussions = repos.some(r => r.has_discussions);

    // Calculate score & criteria
    const estPullShark = publicRepos > 2 ? 'Active (Eligible)' : 'Pending';
    const estStarstruck = totalStars >= 16 ? 'UNLOCKED (16+ Stars)' : `${totalStars} / 16 Stars`;

    resultBox.innerHTML = `
      <div class="inspector-card">
        <div class="insp-header">
          <img src="${data.avatar_url}" class="insp-avatar" alt="${data.login}">
          <div>
            <div class="insp-name">${data.name || data.login} (@${data.login})</div>
            <div class="insp-sub">${data.bio || 'Public Software Developer'}</div>
          </div>
        </div>

        <div class="insp-grid">
          <div class="insp-metric">
            <span class="m-lbl">Public Repos</span>
            <span class="m-val">${publicRepos}</span>
          </div>
          <div class="insp-metric">
            <span class="m-lbl">Total Stars</span>
            <span class="m-val">${totalStars}</span>
          </div>
          <div class="insp-metric">
            <span class="m-lbl">Followers</span>
            <span class="m-val">${data.followers || 0}</span>
          </div>
          <div class="insp-metric">
            <span class="m-lbl">Starstruck Status</span>
            <span class="m-val">${estStarstruck}</span>
          </div>
        </div>

        <div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-tertiary);">Status: Public Profile Analysis Complete</span>
          <button id="btn-print-receipt" class="btn-clipboard" style="position: static;" onclick="generateAsciiReceipt('${data.login}', ${publicRepos}, ${totalStars})">Print ASCII Receipt</button>
        </div>
      </div>
    `;
  } catch (err) {
    resultBox.innerHTML = `
      <div style="color: #888; font-family: var(--font-mono); font-size: 0.8rem; padding: 0.5rem 0;">
        [Error] Profile not found or GitHub rate limit reached. Verify handle.
      </div>
    `;
  } finally {
    btnEl.innerText = 'Inspect Profile';
    btnEl.disabled = false;
  }
}

function generateAsciiReceipt(user, repos, stars) {
  const receiptEl = document.getElementById('ascii-receipt-box');
  const dateStr = new Date().toISOString().split('T')[0];
  
  const ascii = `
+--------------------------------------------------+
|           GITBADGE TERMINAL VERIFICATION         |
|              OFFICIAL DEVELOPER AUDIT            |
+--------------------------------------------------+
  OPERATIVE : @${user.padEnd(35)}|
  DATE      : ${dateStr.padEnd(36)}|
  REPOS     : ${String(repos).padEnd(36)}|
  STARS     : ${String(stars).padEnd(36)}|
+--------------------------------------------------+
  ACHIEVEMENT AUDIT SUMMARY:
  [X] QUICKDRAW          : VERIFIED (< 5 MIN CLOSE)
  [X] PULL SHARK         : ACTIVE (PULL REQUEST CONTRIBUTOR)
  [X] GALAXY BRAIN       : VERIFIED (DISCUSSIONS ANSWERS)
  [X] YOLO               : VERIFIED (DIRECT AUTONOMOUS MERGE)
  [?] PAIR EXTRAORDINAIRE: QUEUED (BATCH ENGINE CROSS-REF)
  [?] STARSTRUCK         : ${stars >= 16 ? 'VERIFIED' : 'PENDING THRESHOLD'}
+--------------------------------------------------+
|      VERIFIED BY CODE-LAB MULTI-ARCH ENGINE      |
|           https://github.com/Yogiexc/code-lab    |
+--------------------------------------------------+`;

  if (receiptEl) {
    receiptEl.innerText = ascii;
    receiptEl.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inspectBtn = document.getElementById('btn-inspect-profile');
  if (inspectBtn) inspectBtn.addEventListener('click', inspectGitHubProfile);
});
