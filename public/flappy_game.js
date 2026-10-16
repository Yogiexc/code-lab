// =============================================================================
// Flappy Bird Game Engine (x86-64 Assembly & Machine Model Implementation)
// =============================================================================

class FlappyMachineGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Machine Model State (Emulates CPU register state)
    this.state = {
      birdY: 160,
      birdVel: 0,
      gravity: 0.28,
      jumpForce: -5.2,
      score: 0,
      highScore: parseInt(localStorage.getItem('flappy_hiscore') || '0'),
      isGameOver: false,
      isPlaying: false,
      pipes: [],
      tickCount: 0
    };

    this.bindEvents();
    this.reset();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  bindEvents() {
    const handleAction = (e) => {
      if (e.type === 'keydown' && e.code !== 'Space' && e.code !== 'ArrowUp') return;
      if (e.type === 'keydown') e.preventDefault();
      this.jump();
    };

    window.addEventListener('keydown', handleAction);
    this.canvas.addEventListener('mousedown', handleAction);
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.jump();
    });
  }

  jump() {
    if (this.state.isGameOver) {
      this.reset();
      this.state.isPlaying = true;
      return;
    }
    this.state.isPlaying = true;
    // Assembly _flappy_jump_impulse equivalent: MOV velocity, jumpForce
    this.state.birdVel = this.state.jumpForce;
  }

  reset() {
    this.state.birdY = 160;
    this.state.birdVel = 0;
    this.state.score = 0;
    this.state.isGameOver = false;
    this.state.isPlaying = false;
    this.state.pipes = [
      { x: 320, gapTop: 90, gapBottom: 200, passed: false },
      { x: 490, gapTop: 130, gapBottom: 240, passed: false }
    ];
    this.updateScoreUI();
  }

  updateScoreUI() {
    const sEl = document.getElementById('flappy-score');
    const hEl = document.getElementById('flappy-hiscore');
    if (sEl) sEl.innerText = this.state.score;
    if (hEl) hEl.innerText = this.state.highScore;
  }

  // Pure ALU Arithmetic Collision Step (Direct mapping to _flappy_check_collision)
  checkCollision(bx, by, px, gapTop, gapBottom) {
    const birdSize = 16;
    const pipeWidth = 44;

    // Horizontal overlap test
    if (bx + birdSize > px && bx < px + pipeWidth) {
      // Vertical overlap test: hit top pipe or bottom pipe
      if (by < gapTop || by + birdSize > gapBottom) {
        return true;
      }
    }
    return false;
  }

  update() {
    if (!this.state.isPlaying) return;

    // 1. Gravity and Velocity Step (Assembly _flappy_apply_gravity)
    this.state.birdVel += this.state.gravity;
    if (this.state.birdVel > 9.0) this.state.birdVel = 9.0; // Terminal cap
    this.state.birdY += this.state.birdVel;

    // Floor and Ceiling Collision
    if (this.state.birdY + 16 >= this.canvas.height - 15 || this.state.birdY <= 0) {
      this.triggerGameOver();
      return;
    }

    // 2. Pipes Movement & Generation
    this.state.pipes.forEach((p) => {
      p.x -= 1.8;

      // Score detection
      if (!p.passed && p.x + 44 < 50) {
        p.passed = true;
        this.state.score += 1;
        if (this.state.score > this.state.highScore) {
          this.state.highScore = this.state.score;
          localStorage.setItem('flappy_hiscore', this.state.highScore.toString());
        }
        this.updateScoreUI();
      }

      // Check collision using Assembly AABB algorithm
      if (this.checkCollision(50, this.state.birdY, p.x, p.gapTop, p.gapBottom)) {
        this.triggerGameOver();
      }
    });

    // Recycle pipes
    if (this.state.pipes.length > 0 && this.state.pipes[0].x < -50) {
      this.state.pipes.shift();
      const lastX = this.state.pipes[this.state.pipes.length - 1].x;
      const gap = 110;
      const top = Math.floor(Math.random() * (this.canvas.height - gap - 60)) + 30;
      this.state.pipes.push({
        x: lastX + 170,
        gapTop: top,
        gapBottom: top + gap,
        passed: false
      });
    }
  }

  triggerGameOver() {
    this.state.isGameOver = true;
    this.state.isPlaying = false;
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // Background - Dark Technical Grid
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid lines
    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Pipes (Clean minimalist architecture styling)
    this.state.pipes.forEach((p) => {
      ctx.fillStyle = '#1c1c1c';
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1.5;

      // Top pipe
      ctx.fillRect(p.x, 0, 44, p.gapTop);
      ctx.strokeRect(p.x, 0, 44, p.gapTop);

      // Bottom pipe
      const botHeight = h - p.gapBottom - 15;
      ctx.fillRect(p.x, p.gapBottom, 44, botHeight);
      ctx.strokeRect(p.x, p.gapBottom, 44, botHeight);

      // Pipe borders accent
      ctx.fillStyle = '#2b2b2b';
      ctx.fillRect(p.x - 2, p.gapTop - 12, 48, 12);
      ctx.strokeRect(p.x - 2, p.gapTop - 12, 48, 12);

      ctx.fillRect(p.x - 2, p.gapBottom, 48, 12);
      ctx.strokeRect(p.x - 2, p.gapBottom, 48, 12);
    });

    // Floor line
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, h - 15, w, 15);
    ctx.strokeStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(0, h - 15);
    ctx.lineTo(w, h - 15);
    ctx.stroke();

    // Draw Bird (Machine Pixel Drone)
    const bx = 50;
    const by = this.state.birdY;
    ctx.save();
    ctx.translate(bx + 8, by + 8);
    // Dynamic tilt based on velocity
    const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (this.state.birdVel * 4) * Math.PI / 180));
    ctx.rotate(angle);

    // Drone body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -8, 16, 16);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(-8, -8, 16, 16);

    // Drone sensor eye
    ctx.fillStyle = '#0070f3';
    ctx.fillRect(2, -4, 5, 5);

    ctx.restore();

    // Overlay Screens
    if (!this.state.isPlaying && !this.state.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 14px "Geist", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS SPACE OR CLICK TO START', w / 2, h / 2 - 10);

      ctx.fillStyle = '#737373';
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillText('x86-64 Machine Physics Active', w / 2, h / 2 + 14);
    } else if (this.state.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#ef4444';
      ctx.font = '600 15px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM COLLISION DETECTED', w / 2, h / 2 - 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px "Geist", sans-serif';
      ctx.fillText(`Score: ${this.state.score}`, w / 2, h / 2 + 6);

      ctx.fillStyle = '#737373';
      ctx.font = '11px "Geist", sans-serif';
      ctx.fillText('Click to Restart Session', w / 2, h / 2 + 28);
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  new FlappyMachineGame('flappy-canvas');
});
