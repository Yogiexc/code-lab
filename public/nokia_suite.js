// =============================================================================
// Nokia Retro 6-in-1 Monochrome Machine Engine
// Pure Black & White (Monochrome Pixel Display Simulation)
// Fully playable: Snake II, Space Impact, Bounce Classic, Pocket Carrom, Cricket, Pong
//
// Collaborative update: added high-score persistence via localStorage
// Co-authored by: Ranu Prasetya (@Aytsrp)
// =============================================================================

class NokiaGameSuite {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.activeGame = 'snake';
    this.score = 0;
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
      spawnTimer: 0
    };

    // 3. Bounce State
    this.bounce = {
      ballX: 60,
      ballY: 150,
      vx: 0,
      vy: 0,
      rings: [{ x: 180, y: 140, collected: false }, { x: 320, y: 100, collected: false }],
      floorY: 240
    };

    // 4. Pocket Carrom State
    this.carrom = {
      strikerX: 240,
      strikerY: 230,
      strikerVx: 0,
      strikerVy: 0,
      aimAngle: -Math.PI / 2,
      pucks: [
        { x: 240, y: 130, vx: 0, vy: 0, inPocket: false, isQueen: true },
        { x: 226, y: 144, vx: 0, vy: 0, inPocket: false, isQueen: false },
        { x: 254, y: 144, vx: 0, vy: 0, inPocket: false, isQueen: false },
        { x: 240, y: 158, vx: 0, vy: 0, inPocket: false, isQueen: false }
      ]
    };

    // 5. Cricket State
    this.cricket = {
      ballX: 420,
      ballY: 150,
      ballVx: -4.5,
      ballVy: 0.6,
      batAngle: 0,
      resultText: '',
      swung: false
    };

    // 6. Pong State (Classic Arcade)
    this.pong = {
      ballX: 240,
      ballY: 150,
      vx: 3.5,
      vy: 2.2,
      playerY: 120,
      aiY: 120,
      paddleH: 50
    };

    // 7. Flappy Pixel State
    this.flappy = {
      birdY: 150,
      vy: 0,
      pipes: [],
      spawnTimer: 0
    };

    // 8. Metal Slug Pixel Commando State
    this.slug = {
      playerX: 60,
      playerY: 236,
      vy: 0,
      isGrounded: true,
      bullets: [],
      enemies: [{ x: 380, y: 236, hp: 2 }, { x: 440, y: 236, hp: 2 }],
      spawnTimer: 0
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

    document.querySelectorAll('.nokia-tab').forEach((tab) => {
      tab.classList.toggle('is-selected', tab.dataset.game === gameId);
    });

    const titleEl = document.getElementById('active-game-title');
    if (titleEl) {
      const names = {
        snake: 'Snake II (Snake Xenzia)',
        space: 'Space Impact (Alien Shooter)',
        bounce: 'Bounce Classic (Red Ball Adventure)',
        carrom: 'Pocket Carrom (Monochrome Board)',
        cricket: 'Cricket (Stroke Timing)',
        pong: 'Pong (Classic Retro Paddle)',
        flappy: 'Flappy Pixel (CPU Machine Model)',
        slug: 'Metal Slug 2D (Pixel Commando)'
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
      this.bounce.ballY = 150;
      this.bounce.vx = 0;
      this.bounce.vy = 0;
      this.bounce.rings.forEach(r => r.collected = false);
    } else if (this.activeGame === 'carrom') {
      this.carrom.strikerX = 240;
      this.carrom.strikerY = 230;
      this.carrom.strikerVx = 0;
      this.carrom.strikerVy = 0;
      this.carrom.aimAngle = -Math.PI / 2;
      this.carrom.pucks.forEach(p => {
        p.vx = 0; p.vy = 0; p.inPocket = false;
      });
      this.carrom.pucks[0].x = 240; this.carrom.pucks[0].y = 130;
      this.carrom.pucks[1].x = 226; this.carrom.pucks[1].y = 144;
      this.carrom.pucks[2].x = 254; this.carrom.pucks[2].y = 144;
      this.carrom.pucks[3].x = 240; this.carrom.pucks[3].y = 158;
    } else if (this.activeGame === 'cricket') {
      this.cricket.ballX = 420;
      this.cricket.ballY = 150;
      this.cricket.ballVx = -4.5;
      this.cricket.ballVy = 0.6;
      this.cricket.batAngle = 0;
      this.cricket.resultText = '';
      this.cricket.swung = false;
    } else if (this.activeGame === 'pong') {
      this.pong.ballX = 240;
      this.pong.ballY = 150;
      this.pong.vx = 3.5;
      this.pong.vy = 2.0;
      this.pong.playerY = 120;
      this.pong.aiY = 120;
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
      if (window.nokiaAudio) window.nokiaAudio.beep();
    } else if (this.activeGame === 'space') {
      if (action === 'up') this.space.playerY = Math.max(20, this.space.playerY - 22);
      if (action === 'down') this.space.playerY = Math.min(260, this.space.playerY + 22);
      if (action === 'action') {
        this.space.lasers.push({ x: 70, y: this.space.playerY + 6 });
        if (window.nokiaAudio) window.nokiaAudio.laser();
      }
    } else if (this.activeGame === 'bounce') {
      if (action === 'left') this.bounce.vx = -4.0;
      if (action === 'right') this.bounce.vx = 4.0;
      if (action === 'up' || action === 'action') {
        if (this.bounce.ballY >= 238) {
          this.bounce.vy = -9.0;
          if (window.nokiaAudio) window.nokiaAudio.bounce();
        }
      }
    } else if (this.activeGame === 'carrom') {
      if (action === 'left') this.carrom.aimAngle -= 0.15;
      if (action === 'right') this.carrom.aimAngle += 0.15;
      if (action === 'action') {
        // Strike!
        const force = 9;
        this.carrom.strikerVx = Math.cos(this.carrom.aimAngle) * force;
        this.carrom.strikerVy = Math.sin(this.carrom.aimAngle) * force;
      }
    } else if (this.activeGame === 'cricket') {
      if (action === 'action' || action === 'up') {
        this.cricket.batAngle = -Math.PI / 3;
        this.cricket.swung = true;
        const diff = Math.abs(this.cricket.ballX - 110);
        if (diff < 14) {
          this.score += 6;
          this.cricket.resultText = 'SIX RUNS!'; if (window.nokiaAudio) window.nokiaAudio.cricketSmack();
          this.cricket.ballVx = 8.5;
          this.cricket.ballVy = -4.5;
        } else if (diff < 28) {
          this.score += 4;
          this.cricket.resultText = 'FOUR RUNS!'; if (window.nokiaAudio) window.nokiaAudio.cricketSmack();
          this.cricket.ballVx = 6.5;
          this.cricket.ballVy = -2.5;
        } else {
          this.cricket.resultText = 'DOT BALL';
        }
        this.updateHUD();
      }
    } else if (this.activeGame === 'pong') {
      if (action === 'up') this.pong.playerY = Math.max(10, this.pong.playerY - 25);
      if (action === 'down') this.pong.playerY = Math.min(240, this.pong.playerY + 25);
    } else if (this.activeGame === 'flappy') {
      if (action === 'action' || action === 'up') {
        this.flappy.vy = -5.0;
        if (window.nokiaAudio) window.nokiaAudio.beep();
      }
    } else if (this.activeGame === 'slug') {
      if (action === 'left') this.slug.playerX = Math.max(20, this.slug.playerX - 16);
      if (action === 'right') this.slug.playerX = Math.min(440, this.slug.playerX + 16);
      if ((action === 'up') && this.slug.isGrounded) {
        this.slug.vy = -8.5;
        this.slug.isGrounded = false;
        if (window.nokiaAudio) window.nokiaAudio.bounce();
      }
      if (action === 'action') {
        this.slug.bullets.push({ x: this.slug.playerX + 16, y: this.slug.playerY + 6 });
        if (window.nokiaAudio) window.nokiaAudio.shoot();
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

        if (this.snake.body.some((seg, idx) => idx > 0 && seg.x === head.x && seg.y === head.y)) {
          this.isGameOver = true; if (window.nokiaAudio) window.nokiaAudio.gameOverTune(); return;
        }

        this.snake.body.unshift(head);

        if (head.x === this.snake.food.x && head.y === this.snake.food.y) {
          this.score += 10;
          this.spawnSnakeFood();
          this.updateHUD();
          if (window.nokiaAudio) window.nokiaAudio.eatFood();
        } else {
          this.snake.body.pop();
        }
      }
    } else if (this.activeGame === 'space') {
      this.space.lasers.forEach(l => l.x += 8);
      this.space.lasers = this.space.lasers.filter(l => l.x < 480);

      this.space.aliens.forEach(a => {
        a.x -= 1.5;
        this.space.lasers.forEach((l, lIdx) => {
          if (l.x >= a.x && l.x <= a.x + 22 && l.y >= a.y && l.y <= a.y + 18) {
            a.hp--;
            this.space.lasers.splice(lIdx, 1);
            if (a.hp <= 0) {
              this.score += 25; this.updateHUD(); if (window.nokiaAudio) window.nokiaAudio.alienExplode();
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
      this.bounce.vy += 0.45;
      this.bounce.ballY += this.bounce.vy;
      this.bounce.ballX += this.bounce.vx;
      this.bounce.vx *= 0.88;

      if (this.bounce.ballY >= 240) {
        this.bounce.ballY = 240;
        this.bounce.vy = 0;
      }
      if (this.bounce.ballX < 15) this.bounce.ballX = 15;
      if (this.bounce.ballX > 465) this.bounce.ballX = 465;

      this.bounce.rings.forEach(r => {
        if (!r.collected && Math.hypot(this.bounce.ballX - r.x, this.bounce.ballY - r.y) < 18) {
          r.collected = true;
          this.score += 50;
          this.updateHUD();
        }
      });
    } else if (this.activeGame === 'carrom') {
      // Striker physics
      this.carrom.strikerX += this.carrom.strikerVx;
      this.carrom.strikerY += this.carrom.strikerVy;
      this.carrom.strikerVx *= 0.96;
      this.carrom.strikerVy *= 0.96;

      // Pucks physics & collision with striker
      this.carrom.pucks.forEach(p => {
        if (p.inPocket) return;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Striker vs Puck
        const dist = Math.hypot(this.carrom.strikerX - p.x, this.carrom.strikerY - p.y);
        if (dist < 18) {
          p.vx = this.carrom.strikerVx * 0.85;
          p.vy = this.carrom.strikerVy * 0.85;
          this.carrom.strikerVx *= -0.4;
          this.carrom.strikerVy *= -0.4;
        }

        // Pocket detection (4 corners)
        const corners = [{ x: 30, y: 30 }, { x: 450, y: 30 }, { x: 30, y: 270 }, { x: 450, y: 270 }];
        corners.forEach(c => {
          if (Math.hypot(p.x - c.x, p.y - c.y) < 22) {
            p.inPocket = true;
            this.score += p.isQueen ? 50 : 20;
            this.updateHUD();
          }
        });
      });
    } else if (this.activeGame === 'cricket') {
      this.cricket.ballX += this.cricket.ballVx;
      this.cricket.ballY += this.cricket.ballVy;

      if (this.cricket.ballX < 20 || this.cricket.ballX > 480) {
        this.cricket.ballX = 420;
        this.cricket.ballY = 150;
        this.cricket.ballVx = -4.5;
        this.cricket.ballVy = 0.6;
        this.cricket.batAngle = 0;
        this.cricket.swung = false;
      }
    } else if (this.activeGame === 'pong') {
      this.pong.ballX += this.pong.vx;
      this.pong.ballY += this.pong.vy;

      // Top/bottom bounce
      if (this.pong.ballY <= 8 || this.pong.ballY >= 292) {
        this.pong.vy = -this.pong.vy;
      }

      // Player paddle bounce (Left side x=30)
      if (this.pong.ballX <= 36 && this.pong.ballY >= this.pong.playerY && this.pong.ballY <= this.pong.playerY + this.pong.paddleH) {
        this.pong.vx = Math.abs(this.pong.vx) * 1.05; this.score += 10; this.updateHUD(); if (window.nokiaAudio) window.nokiaAudio.paddleHit();
      }

      // AI Paddle tracking (Right side x=450)
      if (this.pong.aiY + this.pong.paddleH / 2 < this.pong.ballY) this.pong.aiY += 2.2;
      else this.pong.aiY -= 2.2;

      // AI paddle bounce
      if (this.pong.ballX >= 444 && this.pong.ballY >= this.pong.aiY && this.pong.ballY <= this.pong.aiY + this.pong.paddleH) {
        this.pong.vx = -Math.abs(this.pong.vx); if (window.nokiaAudio) window.nokiaAudio.paddleHit();
      }

      // Missed left
      if (this.pong.ballX < 10) {
        this.isGameOver = true; if (window.nokiaAudio) window.nokiaAudio.gameOverTune(); } // Missed right (Score!)
      if (this.pong.ballX > 470) {
        this.score += 50; this.updateHUD(); if (window.nokiaAudio) window.nokiaAudio.scorePoint();
        this.pong.ballX = 240;
        this.pong.ballY = 150;
        this.pong.vx = -3.5;
      }
    } else if (this.activeGame === 'flappy') {
      this.flappy.vy += 0.28;
      this.flappy.birdY += this.flappy.vy;

      if (this.flappy.birdY < 5 || this.flappy.birdY > 285) {
        this.isGameOver = true;
        if (window.nokiaAudio) window.nokiaAudio.gameOverTune();
        return;
      }

      this.flappy.spawnTimer++;
      if (this.flappy.spawnTimer > 85) {
        this.flappy.spawnTimer = 0;
        const gap = 85;
        const top = Math.floor(Math.random() * 120) + 40;
        this.flappy.pipes.push({ x: 480, top: top, bottom: top + gap, passed: false });
      }

      const birdX = 90;
      this.flappy.pipes.forEach(p => {
        p.x -= 2.2;
        if (!p.passed && p.x + 30 < birdX) {
          p.passed = true;
          this.score += 10;
          this.updateHUD();
          if (window.nokiaAudio) window.nokiaAudio.scorePoint();
        }
        if (birdX + 8 > p.x && birdX - 8 < p.x + 30) {
          if (this.flappy.birdY - 6 < p.top || this.flappy.birdY + 6 > p.bottom) {
            this.isGameOver = true;
            if (window.nokiaAudio) window.nokiaAudio.gameOverTune();
          }
        }
      });
      this.flappy.pipes = this.flappy.pipes.filter(p => p.x > -40);

    } else if (this.activeGame === 'slug') {
      // Gravity
      if (!this.slug.isGrounded) {
        this.slug.vy += 0.5;
        this.slug.playerY += this.slug.vy;
        if (this.slug.playerY >= 236) {
          this.slug.playerY = 236;
          this.slug.vy = 0;
          this.slug.isGrounded = true;
        }
      }

      // Bullets
      this.slug.bullets.forEach(b => b.x += 8);
      this.slug.bullets = this.slug.bullets.filter(b => b.x < 480);

      // Enemies
      this.slug.enemies.forEach(en => {
        en.x -= 1.2;
        this.slug.bullets.forEach((b, bIdx) => {
          if (b.x >= en.x && b.x <= en.x + 18 && b.y >= en.y && b.y <= en.y + 24) {
            en.hp--;
            this.slug.bullets.splice(bIdx, 1);
            if (en.hp <= 0) {
              this.score += 20;
              this.updateHUD();
              if (window.nokiaAudio) window.nokiaAudio.alienExplode();
            }
          }
        });

        // Collision with player
        if (Math.abs(en.x - this.slug.playerX) < 14 && Math.abs(en.y - this.slug.playerY) < 16) {
          this.isGameOver = true;
          if (window.nokiaAudio) window.nokiaAudio.gameOverTune();
        }
      });

      this.slug.enemies = this.slug.enemies.filter(en => en.hp > 0 && en.x > -20);
      this.slug.spawnTimer++;
      if (this.slug.spawnTimer > 90) {
        this.slug.spawnTimer = 0;
        this.slug.enemies.push({ x: 480, y: 236, hp: 2 });
      }
    }
  }

  updateHUD() {
    const sEl = document.getElementById('nokia-score');
    if (sEl) sEl.innerText = this.score;

    const key = 'nokia_hiscore_' + this.activeGame;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    if (this.score > prev) {
      localStorage.setItem(key, this.score);
    }
    const hiEl = document.getElementById('nokia-hiscore');
    if (hiEl) {
      hiEl.innerText = Math.max(this.score, parseInt(localStorage.getItem(key) || '0', 10));
    }
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Border Frame
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    if (this.activeGame === 'snake') {
      const cellW = w / this.snake.gridW;
      const cellH = h / this.snake.gridH;

      ctx.fillStyle = '#ffffff';
      this.snake.body.forEach(seg => {
        ctx.fillRect(seg.x * cellW + 1, seg.y * cellH + 1, cellW - 2, cellH - 2);
      });
      ctx.fillRect(this.snake.food.x * cellW + 2, this.snake.food.y * cellH + 2, cellW - 4, cellH - 4);

    } else if (this.activeGame === 'space') {
      const py = this.space.playerY;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, py + 4, 18, 6);
      ctx.fillRect(52, py, 6, 14);
      ctx.fillRect(58, py + 5, 8, 4);

      this.space.lasers.forEach(l => {
        ctx.fillRect(l.x, l.y, 8, 2);
      });

      this.space.aliens.forEach(a => {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(a.x, a.y, 16, 14);
        ctx.fillRect(a.x + 4, a.y + 4, 8, 6);
      });

    } else if (this.activeGame === 'bounce') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.bounce.ballX, this.bounce.ballY, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(10, 250);
      ctx.lineTo(w - 10, 250);
      ctx.stroke();

      this.bounce.rings.forEach(r => {
        if (!r.collected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    } else if (this.activeGame === 'carrom') {
      // Board Corners Pockets
      const pockets = [{ x: 30, y: 30 }, { x: 450, y: 30 }, { x: 30, y: 270 }, { x: 450, y: 270 }];
      ctx.strokeStyle = '#555555';
      pockets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Striker
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.carrom.strikerX, this.carrom.strikerY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Aim Line
      ctx.strokeStyle = '#444444';
      ctx.beginPath();
      ctx.moveTo(this.carrom.strikerX, this.carrom.strikerY);
      ctx.lineTo(
        this.carrom.strikerX + Math.cos(this.carrom.aimAngle) * 35,
        this.carrom.strikerY + Math.sin(this.carrom.aimAngle) * 35
      );
      ctx.stroke();

      // Pucks
      this.carrom.pucks.forEach(p => {
        if (!p.inPocket) {
          ctx.fillStyle = p.isQueen ? '#ffffff' : '#888888';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    } else if (this.activeGame === 'cricket') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(100, 180, 12, 38);

      ctx.save();
      ctx.translate(112, 205);
      ctx.rotate(this.cricket.batAngle);
      ctx.fillRect(0, -18, 5, 24);
      ctx.restore();

      ctx.strokeStyle = '#333333';
      ctx.beginPath();
      ctx.moveTo(40, 220);
      ctx.lineTo(w - 40, 220);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.cricket.ballX, this.cricket.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      if (this.cricket.resultText) {
        ctx.font = '600 13px "Geist Mono", monospace';
        ctx.fillText(this.cricket.resultText, w / 2 - 40, 60);
      }
    } else if (this.activeGame === 'pong') {
      // Middle line
      ctx.strokeStyle = '#222222';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player Paddle
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(30, this.pong.playerY, 6, this.pong.paddleH);

      // AI Paddle
      ctx.fillRect(444, this.pong.aiY, 6, this.pong.paddleH);

      // Ball
      ctx.fillRect(this.pong.ballX - 3, this.pong.ballY - 3, 6, 6);
    } else if (this.activeGame === 'flappy') {
      // Ground line
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, 290);
      ctx.lineTo(w, 290);
      ctx.stroke();

      // Bird
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(82, this.flappy.birdY - 6, 14, 12);
      ctx.fillRect(96, this.flappy.birdY - 2, 4, 4);

      // Pipes
      this.flappy.pipes.forEach(p => {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(p.x, 0, 30, p.top);
        ctx.strokeRect(p.x, p.bottom, 30, 290 - p.bottom);
        ctx.fillRect(p.x + 4, p.top - 8, 22, 8);
        ctx.fillRect(p.x + 4, p.bottom, 22, 8);
      });

    } else if (this.activeGame === 'slug') {
      // Ground line
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, 260);
      ctx.lineTo(w, 260);
      ctx.stroke();

      // Player Commando
      const px = this.slug.playerX;
      const py = this.slug.playerY;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px, py, 14, 24);
      ctx.fillRect(px + 4, py - 6, 8, 6); // head
      ctx.fillRect(px + 14, py + 8, 8, 4); // gun

      // Bullets
      this.slug.bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, 6, 2);
      });

      // Enemies
      this.slug.enemies.forEach(en => {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(en.x, en.y, 16, 24);
        ctx.fillRect(en.x + 4, en.y + 4, 8, 14);
      });
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

