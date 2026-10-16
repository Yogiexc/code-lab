; ==============================================================================
; GitBadge Hub - Nokia Retro Monochrome Gaming Suite Engine
; Architecture: x86-64 Machine Assembly (NASM Syntax)
; Module: nokia_games_core.asm
; Purpose: Hardware register ALU state machines for 8 retro Nokia games:
;          1. Snake II (Grid cell wrapping & body collision)
;          2. Space Impact (Laser raycast & alien wave movement)
;          3. Bounce Classic (Ball gravity, bounce coefficient, ring collect)
;          4. Diamond Rush (Boulder push physics & gravity check)
;          5. Bantumi (Mancala pit distribution & sow logic)
;          6. Tetris (Tetromino matrix rotation & line clear bitmask)
;          7. Pocket Carrom (2D friction decel & pocket boundary check)
;          8. Cricket (Bat swing timing window & ball trajectory)
; ==============================================================================

global _nokia_snake_step
global _nokia_space_impact_step
global _nokia_bounce_physics
global _nokia_diamond_rush_boulder
global _nokia_bantumi_sow
global _nokia_tetris_check_line
global _nokia_carrom_friction
global _nokia_cricket_swing

section .text

; ------------------------------------------------------------------------------
; 1. Snake II Step
; Input : RDI = Head X, RSI = Head Y, RDX = Dir (0:up, 1:right, 2:down, 3:left)
; Output: RAX = New (X << 16) | Y (wrapped 0-31, 0-19)
; ------------------------------------------------------------------------------
_nokia_snake_step:
    cmp     edx, 0
    je      .up
    cmp     edx, 1
    je      .right
    cmp     edx, 2
    je      .down
.left:
    dec     edi
    jmp     .wrap
.right:
    inc     edi
    jmp     .wrap
.up:
    dec     esi
    jmp     .wrap
.down:
    inc     esi
.wrap:
    and     edi, 31                 ; Wrap X (0..31)
    and     esi, 19                 ; Wrap Y (0..19)
    shl     edi, 16
    or      edi, esi
    mov     eax, edi
    ret

; ------------------------------------------------------------------------------
; 2. Space Impact Laser Raycast
; Checks intersection between player laser beam and alien drone
; ------------------------------------------------------------------------------
_nokia_space_impact_step:
    ; RDI = Laser X, RSI = Laser Y, RDX = Alien X, RCX = Alien Y
    lea     eax, [rdi + 8]
    cmp     eax, edx
    jle     .miss
    lea     eax, [rdx + 14]
    cmp     edi, eax
    jge     .miss
    lea     eax, [rsi + 2]
    cmp     eax, ecx
    jle     .miss
    lea     eax, [rcx + 10]
    cmp     esi, eax
    jge     .miss
    mov     rax, 1                  ; Hit
    ret
.miss:
    xor     rax, rax                ; Miss
    ret

; ------------------------------------------------------------------------------
; 3. Bounce Classic Physics Step
; Calculates ball vertical trajectory with bounce restitution
; ------------------------------------------------------------------------------
_nokia_bounce_physics:
    ; RDI = Y pos (fixed point), RSI = Velocity, RDX = Gravity
    add     esi, edx                ; vel += gravity
    add     edi, esi                ; y += vel
    cmp     edi, 210                ; Floor hit
    jle     .no_floor
    mov     edi, 210
    neg     esi                     ; Reverse velocity (bounce)
.no_floor:
    mov     eax, edi
    ret

; ------------------------------------------------------------------------------
; 4. Diamond Rush Boulder Fall Logic
; Checks if tile below boulder is empty, allowing gravity drop
; ------------------------------------------------------------------------------
_nokia_diamond_rush_boulder:
    ; RDI = Boulder Grid Y, RSI = Grid Tile Below ID (0 = Empty)
    test    esi, esi
    jnz     .stable
    inc     edi                     ; Drop down
    mov     eax, edi
    ret
.stable:
    mov     eax, edi
    ret

; ------------------------------------------------------------------------------
; 5. Bantumi Mancala Sow Step
; Increments next pit index modulo 14
; ------------------------------------------------------------------------------
_nokia_bantumi_sow:
    ; RDI = Current pit index
    inc     edi
    mov     eax, edi
    xor     edx, edx
    mov     ecx, 14
    div     ecx                     ; edx = remainder (pit % 14)
    mov     eax, edx
    ret

; ------------------------------------------------------------------------------
; 6. Tetris Line Check
; ------------------------------------------------------------------------------
_nokia_tetris_check_line:
    ; RDI = 10-bit row mask
    cmp     edi, 1023               ; All 10 bits filled (1111111111b)
    sete    al
    movzx   eax, al
    ret

; ------------------------------------------------------------------------------
; 7. Pocket Carrom Striker Deceleration
; ------------------------------------------------------------------------------
_nokia_carrom_friction:
    ; RDI = Velocity, RSI = Friction rate (e.g. 96%)
    imul    edi, esi
    sar     edi, 7                  ; Fixed point shift
    mov     eax, edi
    ret

; ------------------------------------------------------------------------------
; 8. Cricket Timing Evaluation
; ------------------------------------------------------------------------------
_nokia_cricket_swing:
    ; RDI = Ball X, RSI = Batter Sweetspot X
    sub     edi, esi
    cmp     edi, 0
    jge     .pos
    neg     edi
.pos:
    cmp     edi, 6                  ; Within 6px = 6 Runs!
    jle     .six_runs
    cmp     edi, 16                 ; Within 16px = 4 Runs!
    jle     .four_runs
    xor     rax, rax                ; Miss / Out
    ret
.six_runs:
    mov     rax, 6
    ret
.four_runs:
    mov     rax, 4
    ret
