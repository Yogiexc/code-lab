// =============================================================================
// Interactive Quake / UNIX Terminal Modal Console
// Triggered via Backquote (`) key or terminal action button
// =============================================================================

class UnixTerminalOverlay {
  constructor() {
    this.isOpen = false;
    this.history = [];
    this.historyIndex = 0;
    this.commands = {
      help: () => `
Available system commands:
  help        - List all terminal commands
  arch        - Display polyglot hardware & runtime layers
  games       - List all 6 Nokia retro arcade engines
  badges      - Query audit criteria for all 7 GitHub achievements
  tune        - Trigger 8-bit Nokia 3310 synthesizer tune
  whoami      - Display repository maintainer signature
  clear       - Clear terminal output stream
  exit        - Close this terminal overlay`,
      
      arch: () => `
[ARCHITECTURAL MATRIX]
  L0: x86-64 Machine Assembly (NASM ALU Registers)
  L1: Zig 0.13 (Manual Memory Allocation & Buffers)
  L2: Vlang 0.4 (High-Speed Native CLI Binary)
  L3: Nim 2.0 (Transpiled JavaScript Web Core)
  L4: Elixir 1.14 (Erlang OTP Concurrency Orchestrator)`,

      games: () => `
[NOKIA RETRO SUITE ENGINES]
  1. Snake II (Snake Xenzia)
  2. Space Impact (Alien Shooter)
  3. Bounce Classic (Red Ball Adventure)
  4. Pocket Carrom (Board Physics)
  5. Cricket (Timing Stroke Window)
  6. Retro Pong (AI Paddle Engine)`,

      badges: () => `
[ACHIEVEMENT REPOSITORY INDEX]
  - Quickdraw         : < 5 min issue/PR close
  - Pull Shark        : Tier 1 (2 PR), Tier 2 (16 PR), Tier 3 (128 PR)
  - Galaxy Brain      : 2 accepted answers in Q&A Discussions
  - Pair Extraordinaire: Valid Co-authored-by commit trailers
  - YOLO              : Merge PR without waiting for review approval
  - Public Sponsor    : Active $1 GitHub Sponsors subscription
  - Starstruck        : Accumulate 16+ repository stars`,

      tune: () => {
        if (window.nokiaAudio) {
          window.nokiaAudio.playNokiaTune();
          return `Playing Nokia 3310 8-bit Gran Vals synthesizer...`;
        }
        return `Audio engine offline.`;
      },

      whoami: () => `
USER      : Bryan Yogie Saputra (@Yogiexc)
ROLE      : Lead Systems & Web Architect
PLATFORM  : code-lab / GitBadge Hub
STATUS    : Operational (Vercel Live CDN)`,

      clear: () => {
        const out = document.getElementById('term-output');
        if (out) out.innerHTML = '';
        return null;
      },

      exit: () => {
        this.toggle(false);
        return 'Terminal closed.';
      }
    };

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    const term = document.createElement('div');
    term.id = 'unix-terminal-modal';
    term.className = 'unix-terminal-hidden';
    term.innerHTML = `
      <div class="term-window">
        <div class="term-header">
          <div class="term-title">
            <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            code-lab unix console (sh) — press [ \` ] or ESC to close
          </div>
          <button id="btn-close-term" class="term-close-btn">&times;</button>
        </div>
        <div id="term-output" class="term-body">
          <div class="term-line">GitBadge Hub Polyglot Kernel v2.4.0 (x86_64-nasm-nim-elixir)</div>
          <div class="term-line">Type <span class="term-hl">'help'</span> for a list of internal runtime commands.</div>
        </div>
        <div class="term-input-row">
          <span class="term-prompt">yogiexc@codelab:~$</span>
          <input type="text" id="term-input" class="term-input" autocomplete="off" spellcheck="false">
        </div>
      </div>
    `;
    document.body.appendChild(term);
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      // Backquote (`) or Escape
      if (e.code === 'Backquote') {
        e.preventDefault();
        this.toggle();
      } else if (e.code === 'Escape' && this.isOpen) {
        this.toggle(false);
      }
    });

    const closeBtn = document.getElementById('btn-close-term');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggle(false));
    }

    const input = document.getElementById('term-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = input.value.trim().toLowerCase();
          if (val) {
            this.exec(val);
            this.history.push(val);
            this.historyIndex = this.history.length;
            input.value = '';
          }
        } else if (e.key === 'ArrowUp') {
          if (this.historyIndex > 0) {
            this.historyIndex--;
            input.value = this.history[this.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            input.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = this.history.length;
            input.value = '';
          }
        }
      });
    }

    // Trigger button on navbar
    const navTermBtn = document.getElementById('btn-nav-terminal');
    if (navTermBtn) {
      navTermBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle(true);
      });
    }
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    const modal = document.getElementById('unix-terminal-modal');
    const input = document.getElementById('term-input');

    if (modal) {
      if (this.isOpen) {
        modal.classList.remove('unix-terminal-hidden');
        if (input) setTimeout(() => input.focus(), 50);
      } else {
        modal.classList.add('unix-terminal-hidden');
      }
    }
  }

  exec(cmd) {
    const out = document.getElementById('term-output');
    if (!out) return;

    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">yogiexc@codelab:~$</span> ${cmd}`;
    out.appendChild(line);

    if (this.commands[cmd]) {
      const res = this.commands[cmd]();
      if (res !== null) {
        const resLine = document.createElement('div');
        resLine.className = 'term-line term-response';
        resLine.innerText = res;
        out.appendChild(resLine);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-line term-error';
      errLine.innerText = `sh: command not found: ${cmd}. Type 'help' for available commands.`;
      out.appendChild(errLine);
    }

    out.scrollTop = out.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.unixConsole = new UnixTerminalOverlay();
});
