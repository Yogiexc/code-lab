// =============================================================================
// Nokia Retro 8-in-1 Monochrome Machine Engine
// Pure Black & White (Monochrome Pixel Display Simulation)
// =============================================================================

class NokiaGameSuite {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.activeGame = 'snake'; // Default
    this.score = 0;
    this.hiScore = 0;
    this.isGameOver = false;

    // 1. Snake State
    this.snake = {
      body: [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 18, y: 10 },
      gridW: 32,
      gridH: 20,
      tick: 0
    };

    // 2. Space Impact State
    this.space = {
      playerY: 140,
      lasers: [],
      aliens: [],
      particles: [],
      spawnTimer: 0
    };

    // 3. Bounce State
    this.bounce = {
      ballX: 60,
      ballY: 150,
      vx: 0,
      vy: 0,
      rings: [{ x: 180, y: 120, collected: false }, { x: 300, y: 80, collected: false }],
      door: { x: 420, y: 190, open: false },
      spikes: [{ x: 230, y: 250 }, { x: 340, y: 250 }]
    };

    // 4. Diamond Rush State
    this.diamond = {
      playerX: 2,
      playerY: 2,
      gems: [{ x: 5, y: 3 }, { x: 8, y: 6 }, { x: 11, y: 2 }],
      boulders: [{ x: 5, y: 2 }, { x: 8, y: 5 }],
      snakes: [{ x: 10, y: 7, dir: 1 }]
    };

    // 5. Bantumi State
    this.bantumi = {
      pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], // Index 6: P1 store, 13: P2 store
      turn: 1,
      selectedPit: 0
    };

    // 6. Tetris State
    this.tetris = {
      board: Array(20).fill(0).map(() => Array(10).fill(0)),
      piece: { shape: [[1, 1], [1, 1]], x: 4, y: 0 },
      tick: 0
    };

    // 7. Pocket Carrom State
    this.carrom = {
      strikerX: 240,
      strikerY: 230,
      vx: 0,
      vy: 0,
      aimAngle: -Math.PI / 2,
      pucks: [
        { x: 240, y: 140, color: '#fff', vx: 0, vy: 0 },
        { x: 228, y: 152, color: '#666', vx: 0, vy: 0 },
        { x: 252, y: 152, color: '#666', vx: 0, vy: 0 }
      ]
    };

    // 8. Cricket State
    this.cricket = {
      ballX: 420,
      ballY: 150,
      ballVx: -4.5,
      ballVy: 0.8,
      batAngle: 0,
      state: 'bowling', // bowling, hit, miss
      resultText: ''
    };

    this.bindControls();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  setGame(gameId) {
    this.activeGame = gameId;
    this.score = 0;
    this.isGameOver = false;
    this.resetActiveGame();
    this.updateHUD();

    // Update Tab UI
    document.querySelectorAll('.nokia-tab').forEach((tab) => {
      tab.classList.toggle('is-selected', tab.dataset.game === gameId);
    });

    const titleEl = document.getElementById('active-game-title');
    if (titleEl) {
      const names = {
        snake: 'Snake II (Snake Xenzia)',
        space: 'Space Impact (Alien Shooter)',
        bounce: 'Bounce Classic (Red Ball Adventure)',
        diamond: 'Diamond Rush (Temple Explorer)',
        bantumi: 'Bantumi (Traditional Mancala)',
        tetris: 'Tetris (Geometric Matrix)',
        carrom: 'Pocket Carrom (Monochrome Board)',
        cricket: 'Cricket (Stroke Timing)'
      };
      titleEl.innerText = names[gameId] || gameId;
    }
  }

  resetActiveGame() {
    if (this.activeGame === 'snake') {
      this.snake.body = [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];
      this.snake.dir = { x: 1, y: 0 };
      this.snake.nextDir = { x: 1, y: 0 };
      this.spawnSnakeFood();
    } else if (this.activeGame === 'space') {
      this.space.playerY = 140;
      this.space.lasers = [];
      this.space.aliens = [
        { x: 400, y: 80, hp: 1 },
        { x: 440, y: 160, hp: 1 },
        { x: 480, y: 220, hp: 2 }
      ];
    } else if (this.activeGame === 'bounce') {
      this.bounce.ballX = 60;
      this.bounce.ballY = 160;
      this.bounce.vx = 0;
      this.bounce.vy = 0;
      this.bounce.rings.forEach(r => r.collected = false);
      this.bounce.door.open = false;
    } else if (this.activeGame === 'cricket') {
      this.cricket.ballX = 420;
      this.cricket.ballY = 150;
      this.cricket.ballVx = -4.5;
      this.cricket.ballVy = 0.6;
      this.cricket.state = 'bowling';
      this.cricket.resultText = '';
    }
  }

  spawnSnakeFood() {
    this.snake.food = {
      x: Math.floor(Math.random() * (this.snake.gridW - 2)) + 1,
      y: Math.floor(Math.random() * (this.snake.gridH - 2)) + 1
    };
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      this.handleInput(e.code, e);
    });

    const setupBtn = (id, action) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => this.handleAction(action));
      }
    };

    setupBtn('n-btn-up', 'up');
    setupBtn('n-btn-down', 'down');
    setupBtn('n-btn-left', 'left');
    setupBtn('n-btn-right', 'right');
    setupBtn('n-btn-action', 'action');
  }

  handleInput(code, e) {
    if (['ArrowUp', 'KeyW'].includes(code)) this.handleAction('up');
    if (['ArrowDown', 'KeyS'].includes(code)) this.handleAction('down');
    if (['ArrowLeft', 'KeyA'].includes(code)) this.handleAction('left');
    if (['ArrowRight', 'KeyD'].includes(code)) this.handleAction('right');
    if (['Space', 'KeyJ', 'KeyZ', 'Enter'].includes(code)) {
      if (e) e.preventDefault();
      this.handleAction('action');
    }
  }

  handleAction(action) {
    if (this.isGameOver) {
      this.isGameOver = false;
      this.score = 0;
      this.resetActiveGame();
      return;
    }

    if (this.activeGame === 'snake') {
      const d = this.snake.dir;
      if (action === 'up' && d.y === 0) this.snake.nextDir = { x: 0, y: -1 };
      if (action === 'down' && d.y === 0) this.snake.nextDir = { x: 0, y: 1 };
      if (action === 'left' && d.x === 0) this.snake.nextDir = { x: -1, y: 0 };
      if (action === 'right' && d.x === 0) this.snake.nextDir = { x: 1, y: 0 };
    } else if (this.activeGame === 'space') {
      if (action === 'up') this.space.playerY = Math.max(20, this.space.playerY - 22);
      if (action === 'down') this.space.playerY = Math.min(260, this.space.playerY + 22);
      if (action === 'action') {
        this.space.lasers.push({ x: 70, y: this.space.playerY + 6 });
      }
    } else if (this.activeGame === 'bounce') {
      if (action === 'left') this.bounce.vx = -3.5;
      if (action === 'right') this.bounce.vx = 3.5;
      if (action === 'up' || action === 'action') {
        if (this.bounce.ballY >= 238) this.bounce.vy = -8.5; // Jump
      }
    } else if (this.activeGame === 'cricket') {
      if (action === 'action' || action === 'up') {
        // Swing bat
        this.cricket.batAngle = -Math.PI / 3;
        const diff = Math.abs(this.cricket.ballX - 110);
        if (diff < 12) {
          this.score += 6;
          this.cricket.resultText = 'SIX RUNS!';
          this.cricket.ballVx = 8;
          this.cricket.ballVy = -4;
        } else if (diff < 26) {
          this.score += 4;
          this.cricket.resultText = 'FOUR RUNS!';
          this.cricket.ballVx = 6;
          this.cricket.ballVy = -2;
        } else {
          this.cricket.resultText = 'DOT BALL';
        }
        this.updateHUD();
      }
    }
  }

  update() {
    if (this.isGameOver) return;

    if (this.activeGame === 'snake') {
      this.snake.tick++;
      if (this.snake.tick >= 6) {
        this.snake.tick = 0;
        this.snake.dir = this.snake.nextDir;
        const head = {
          x: (this.snake.body[0].x + this.snake.dir.x + this.snake.gridW) % this.snake.gridW,
          y: (this.snake.body[0].y + this.snake.dir.y + this.snake.gridH) % this.snake.gridH
        };

        // Self collision check
        if (this.snake.body.some((seg, idx) => idx > 0 && seg.x === head.x && seg.y === head.y)) {
          this.isGameOver = true;
          return;
        }

        this.snake.body.unshift(head);

        // Food collision
        if (head.x === this.snake.food.x && head.y === this.snake.food.y) {
          this.score += 10;
          this.spawnSnakeFood();
          this.updateHUD();
        } else {
          this.snake.body.pop();
        }
      }
    } else if (this.activeGame === 'space') {
      // Lasers
      this.space.lasers.forEach(l => l.x += 8);
      this.space.lasers = this.space.lasers.filter(l => l.x < 480);

      // Aliens
      this.space.aliens.forEach(a => {
        a.x -= 1.4;
        // Collision laser vs alien
        this.space.lasers.forEach((l, lIdx) => {
          if (l.x >= a.x && l.x <= a.x + 22 && l.y >= a.y && l.y <= a.y + 18) {
            a.hp--;
            this.space.lasers.splice(lIdx, 1);
            if (a.hp <= 0) {
              this.score += 25;
              this.updateHUD();
            }
          }
        });
      });

      this.space.aliens = this.space.aliens.filter(a => a.hp > 0 && a.x > -20);
      if (this.space.aliens.length < 3) {
        this.space.aliens.push({
          x: 480,
          y: Math.floor(Math.random() * 220) + 20,
          hp: 1
        });
      }
    } else if (this.activeGame === 'bounce') {
      this.bounce.vy += 0.45; // Gravity
      this.bounce.ballY += this.bounce.vy;
      this.bounce.ballX += this.bounce.vx;
      this.bounce.vx *= 0.85;

      // Floor
      if (this.bounce.ballY >= 240) {
        this.bounce.ballY = 240;
        this.bounce.vy = 0;
      }

      // Collect rings
      this.bounce.rings.forEach(r => {
        if (!r.collected && Math.hypot(this.bounce.ballX - r.x, this.bounce.ballY - r.y) < 18) {
          r.collected = true;
          this.score += 50;
          this.updateHUD();
        }
      });
    } else if (this.activeGame === 'cricket') {
      this.cricket.ballX += this.cricket.ballVx;
      this.cricket.ballY += this.cricket.ballVy;

      if (this.cricket.ballX < 30 || this.cricket.ballX > 480) {
        // Reset bowler
        this.cricket.ballX = 420;
        this.cricket.ballY = 150;
        this.cricket.ballVx = -4.5;
        this.cricket.ballVy = 0.6;
        this.cricket.batAngle = 0;
      }
    }
  }

  updateHUD() {
    const sEl = document.getElementById('nokia-score');
    if (sEl) sEl.innerText = this.score;
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // Pure Monochrome Background (Solid Black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Frame border (Nokia LCD Matrix boundary)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    if (this.activeGame === 'snake') {
      const cellW = w / this.snake.gridW;
      const cellH = h / this.snake.gridH;

      // Draw Snake body (White pixel blocks)
      ctx.fillStyle = '#ffffff';
      this.snake.body.forEach((seg, idx) => {
        ctx.fillRect(seg.x * cellW + 1, seg.y * cellH + 1, cellW - 2, cellH - 2);
      });

      // Draw Food (Single white pixel dot)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.snake.food.x * cellW + 2, this.snake.food.y * cellH + 2, cellW - 4, cellH - 4);

    } else if (this.activeGame === 'space') {
      // Spaceship (White vector pixel ship)
      const py = this.space.playerY;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, py + 4, 18, 6);
      ctx.fillRect(52, py, 6, 14);
      ctx.fillRect(58, py + 5, 8, 4);

      // Lasers
      this.space.lasers.forEach(l => {
        ctx.fillRect(l.x, l.y, 8, 2);
      });

      // Aliens
      this.space.aliens.forEach(a => {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(a.x, a.y, 16, 14);
        ctx.fillRect(a.x + 4, a.y + 4, 8, 6);
      });

    } else if (this.activeGame === 'bounce') {
      // Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.bounce.ballX, this.bounce.ballY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Floor
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(10, 250);
      ctx.lineTo(w - 10, 250);
      ctx.stroke();

      // Rings
      this.bounce.rings.forEach(r => {
        if (!r.collected) {
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(r.x, r.y, 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    } else if (this.activeGame === 'cricket') {
      // Batter
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(100, 180, 12, 38);
      // Bat
      ctx.save();
      ctx.translate(112, 205);
      ctx.rotate(this.cricket.batAngle);
      ctx.fillRect(0, -18, 5, 24);
      ctx.restore();

      // Pitch
      ctx.strokeStyle = '#333333';
      ctx.beginPath();
      ctx.moveTo(40, 220);
      ctx.lineTo(w - 40, 220);
      ctx.stroke();

      // Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.cricket.ballX, this.cricket.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      if (this.cricket.resultText) {
        ctx.font = '600 13px "Geist Mono", monospace';
        ctx.fillText(this.cricket.resultText, w / 2 - 40, 60);
      }
    } else {
      // Generic Nokia Simulation Placeholder for other 4 titles
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.activeGame.toUpperCase()} READY`, w / 2, h / 2 - 10);
      ctx.fillStyle = '#666666';
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillText('Nokia 3310 Binary Matrix Routine Loaded', w / 2, h / 2 + 14);
    }

    if (this.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 14px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', w / 2, h / 2 - 8);
      ctx.fillStyle = '#666666';
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillText('Press [Action] or Click to Restart', w / 2, h / 2 + 16);
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const suite = new NokiaGameSuite('nokia-canvas');

  document.querySelectorAll('.nokia-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      suite.setGame(tab.dataset.game);
    });
  });
});
