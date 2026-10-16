// =============================================================================
// Metal Slug 2D Run & Gun Engine (Machine Assembly Math Model)
// =============================================================================

class MetalSlugGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Machine Model Player State
    this.player = {
      x: 60,
      y: 200,
      vx: 0,
      vy: 0,
      width: 24,
      height: 38,
      facing: 1, // 1 = right, -1 = left
      isGrounded: true,
      hp: 100,
      maxHp: 100,
      ammo: 50,
      score: 0
    };

    // Controller input flags (direct bitmask representation)
    this.keys = {
      left: false,
      right: false,
      jump: false,
      shoot: false
    };

    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.groundY = 238;
    this.isGameOver = false;
    this.fireCooldown = 0;
    this.spawnTimer = 0;

    this.bindControls();
    this.initEnemies();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        e.preventDefault();
        this.keys.jump = true;
      }
      if (['KeyJ', 'KeyZ', 'KeyF'].includes(e.code)) {
        e.preventDefault();
        this.keys.shoot = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.jump = false;
      if (['KeyJ', 'KeyZ', 'KeyF'].includes(e.code)) this.keys.shoot = false;
    });

    // Virtual gamepad buttons for mobile / mouse
    const btnLeft = document.getElementById('ms-btn-left');
    const btnRight = document.getElementById('ms-btn-right');
    const btnJump = document.getElementById('ms-btn-jump');
    const btnFire = document.getElementById('ms-btn-fire');

    const setupBtn = (el, key) => {
      if (!el) return;
      const down = (e) => { e.preventDefault(); this.keys[key] = true; };
      const up = (e) => { e.preventDefault(); this.keys[key] = false; };
      el.addEventListener('mousedown', down);
      el.addEventListener('mouseup', up);
      el.addEventListener('touchstart', down);
      el.addEventListener('touchend', up);
    };

    setupBtn(btnLeft, 'left');
    setupBtn(btnRight, 'right');
    setupBtn(btnJump, 'jump');
    setupBtn(btnFire, 'shoot');
  }

  initEnemies() {
    this.enemies = [
      { x: 380, y: 200, hp: 30, type: 'rebel_soldier', vx: -1.2, fireTimer: 40 },
      { x: 500, y: 190, hp: 60, type: 'rebel_mech', vx: -0.6, fireTimer: 90 }
    ];
  }

  spawnBullet(x, y, dir) {
    this.bullets.push({
      x: dir > 0 ? x + 24 : x - 8,
      y: y + 14,
      vx: dir * 9.5,
      vy: 0,
      width: 10,
      height: 4,
      isEnemy: false
    });
    // Add muzzle flash
    this.particles.push({
      x: dir > 0 ? x + 24 : x - 8,
      y: y + 14,
      life: 5,
      color: '#fbbf24'
    });
  }

  update() {
    if (this.isGameOver) return;

    const p = this.player;

    // 1. Horizontal Motion (Assembly _metalslug_step_player equivalent)
    if (this.keys.left) {
      p.vx = -3.8;
      p.facing = -1;
    } else if (this.keys.right) {
      p.vx = 3.8;
      p.facing = 1;
    } else {
      p.vx *= 0.65; // High-performance friction decel
    }
    p.x += p.vx;
    // Boundary clamp
    if (p.x < 15) p.x = 15;
    if (p.x > this.canvas.width - p.width - 15) p.x = this.canvas.width - p.width - 15;

    // 2. Vertical Motion (Gravity accumulator)
    p.vy += 0.55;
    if (p.vy > 10) p.vy = 10;
    p.y += p.vy;

    // Jump impulse
    if (this.keys.jump && p.isGrounded) {
      p.vy = -9.2;
      p.isGrounded = false;
    }

    // Floor collision
    if (p.y >= this.groundY - p.height) {
      p.y = this.groundY - p.height;
      p.vy = 0;
      p.isGrounded = true;
    }

    // 3. Fire Weapons
    if (this.fireCooldown > 0) this.fireCooldown--;
    if (this.keys.shoot && this.fireCooldown <= 0) {
      this.spawnBullet(p.x, p.y, p.facing);
      this.fireCooldown = 9; // Automatic machine gun rate
    }

    // 4. Update Projectiles
    this.bullets.forEach((b) => {
      b.x += b.vx;
    });
    this.bullets = this.bullets.filter((b) => b.x > -20 && b.x < this.canvas.width + 20);

    // 5. Enemy Step & Spawning
    this.spawnTimer++;
    if (this.spawnTimer > 180) {
      this.spawnTimer = 0;
      const type = Math.random() > 0.4 ? 'rebel_soldier' : 'rebel_mech';
      this.enemies.push({
        x: this.canvas.width + 20,
        y: type === 'rebel_soldier' ? 200 : 190,
        hp: type === 'rebel_soldier' ? 30 : 70,
        type: type,
        vx: type === 'rebel_soldier' ? -1.4 : -0.7,
        fireTimer: 60
      });
    }

    this.enemies.forEach((en) => {
      en.x += en.vx;

      // Enemy shoot back
      en.fireTimer--;
      if (en.fireTimer <= 0 && en.x < this.canvas.width - 20) {
        en.fireTimer = Math.floor(Math.random() * 80) + 70;
        this.bullets.push({
          x: en.x - 4,
          y: en.y + 16,
          vx: -5.5,
          vy: 0,
          width: 8,
          height: 4,
          isEnemy: true
        });
      }

      // Check collision between Player Bullets and Enemies (Assembly AABB)
      this.bullets.forEach((b, bIdx) => {
        if (!b.isEnemy) {
          const w = en.type === 'rebel_mech' ? 36 : 24;
          const h = en.type === 'rebel_mech' ? 48 : 38;
          if (b.x + b.width > en.x && b.x < en.x + w && b.y + b.height > en.y && b.y < en.y + h) {
            en.hp -= 15;
            this.bullets.splice(bIdx, 1);
            // Spawn hit sparks
            for (let i = 0; i < 3; i++) {
              this.particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 12,
                color: '#f59e0b'
              });
            }
          }
        }
      });

      // Enemy hit player
      if (en.x < p.x + p.width && en.x + 20 > p.x && en.y + 30 > p.y && en.y < p.y + p.height) {
        p.hp -= 0.4;
      }
    });

    // Enemy bullet hit player
    this.bullets.forEach((b, bIdx) => {
      if (b.isEnemy) {
        if (b.x + b.width > p.x && b.x < p.x + p.width && b.y + b.height > p.y && b.y < p.y + p.height) {
          p.hp -= 10;
          this.bullets.splice(bIdx, 1);
        }
      }
    });

    // Remove dead enemies & award score
    this.enemies = this.enemies.filter((en) => {
      if (en.hp <= 0) {
        p.score += en.type === 'rebel_mech' ? 250 : 100;
        // Explosion particles
        for (let i = 0; i < 10; i++) {
          this.particles.push({
            x: en.x + 12,
            y: en.y + 16,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 18,
            color: '#ef4444'
          });
        }
        return false;
      }
      return en.x > -60;
    });

    // Update particles
    this.particles.forEach((pt) => {
      if (pt.vx) pt.x += pt.vx;
      if (pt.vy) pt.y += pt.vy;
      pt.life--;
    });
    this.particles = this.particles.filter((pt) => pt.life > 0);

    // Check Player Death
    if (p.hp <= 0) {
      p.hp = 0;
      this.isGameOver = true;
    }

    this.updateHUD();
  }

  updateHUD() {
    const hpBar = document.getElementById('ms-hp-fill');
    const scoreVal = document.getElementById('ms-score-val');
    if (hpBar) hpBar.style.width = Math.max(0, this.player.hp) + '%';
    if (scoreVal) scoreVal.innerText = this.player.score;
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // Warfield Background
    ctx.fillStyle = '#060709';
    ctx.fillRect(0, 0, w, h);

    // Background silhouettes (Industrial Warzone)
    ctx.fillStyle = '#10141d';
    ctx.fillRect(40, 90, 80, 148);
    ctx.fillRect(180, 110, 110, 128);
    ctx.fillRect(360, 80, 90, 158);
    ctx.fillRect(510, 100, 70, 138);

    // Ground platform
    ctx.fillStyle = '#171b26';
    ctx.fillRect(0, this.groundY, w, h - this.groundY);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(w, this.groundY);
    ctx.stroke();

    // Floor hazard stripes
    ctx.strokeStyle = '#374151';
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, this.groundY);
      ctx.lineTo(x + 15, h);
      ctx.stroke();
    }

    // Draw Particles
    this.particles.forEach((pt) => {
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, 3, 3);
    });

    // Draw Bullets
    this.bullets.forEach((b) => {
      ctx.fillStyle = b.isEnemy ? '#ef4444' : '#f59e0b';
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.shadowColor = b.isEnemy ? '#ef4444' : '#f59e0b';
      ctx.shadowBlur = 4;
    });
    ctx.shadowBlur = 0;

    // Draw Enemies
    this.enemies.forEach((en) => {
      if (en.type === 'rebel_soldier') {
        // Soldier (Green Beret Rebel)
        ctx.fillStyle = '#15803d';
        ctx.fillRect(en.x, en.y, 22, 38);
        ctx.fillStyle = '#dc2626'; // Red bandana
        ctx.fillRect(en.x - 2, en.y + 4, 26, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(en.x - 6, en.y + 16, 10, 5); // Rifle barrel
      } else {
        // Heavy Mech Walker
        ctx.fillStyle = '#475569';
        ctx.fillRect(en.x, en.y, 36, 44);
        ctx.fillStyle = '#ef4444'; // Mech sensor
        ctx.fillRect(en.x - 3, en.y + 12, 6, 6);
        ctx.fillStyle = '#1e293b'; // Heavy treads
        ctx.fillRect(en.x - 4, en.y + 38, 44, 10);
      }
    });

    // Draw Player (Marco Rossi style pixel operative)
    const p = this.player;
    ctx.save();
    ctx.translate(p.x, p.y);

    // Torso (White combat vest & red jacket)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(4, 8, 16, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 10, 8, 14);

    // Legs / Pants
    ctx.fillStyle = '#d97706';
    ctx.fillRect(5, 26, 6, 12);
    ctx.fillRect(13, 26, 6, 12);

    // Head & Blonde hair / Bandana
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(6, 0, 12, 8);
    ctx.fillStyle = '#ffffff'; // White head headband
    ctx.fillRect(4, 4, 16, 3);

    // Heavy Machine Gun
    ctx.fillStyle = '#1e293b';
    if (p.facing > 0) {
      ctx.fillRect(16, 14, 14, 6);
      ctx.fillRect(14, 18, 5, 6);
    } else {
      ctx.fillRect(-6, 14, 14, 6);
      ctx.fillRect(5, 18, 5, 6);
    }

    ctx.restore();

    // Game Over Overlay
    if (this.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#ef4444';
      ctx.font = '700 22px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MISSION FAILED', w / 2, h / 2 - 12);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px "Geist", sans-serif';
      ctx.fillText(`Final Combat Score: ${p.score}`, w / 2, h / 2 + 16);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillText('Press [R] or Tap to Respawn Operative', w / 2, h / 2 + 42);
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }

  restart() {
    this.player.hp = this.player.maxHp;
    this.player.x = 60;
    this.player.y = 200;
    this.player.score = 0;
    this.isGameOver = false;
    this.initEnemies();
    this.bullets = [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new MetalSlugGame('metalslug-canvas');
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR' && game.isGameOver) {
      game.restart();
    }
  });
  const canvas = document.getElementById('metalslug-canvas');
  if (canvas) {
    canvas.addEventListener('click', () => {
      if (game.isGameOver) game.restart();
    });
  }
});
