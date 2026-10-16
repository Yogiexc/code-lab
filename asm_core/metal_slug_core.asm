; ==============================================================================
; GitBadge Hub - 2D Side-Scrolling Run & Gun Engine (Metal Slug Style)
; Architecture: x86-64 Machine Assembly (NASM Syntax)
; Module: metal_slug_core.asm
; Purpose: High-speed hardware register math for:
;          - Projectile Ballistics & Vector Raycasting
;          - Sprite State Machine (Run, Jump, Shoot, Recoil)
;          - Entity Pool AABB Hitbox & Damage Calculation
; ==============================================================================

global _metalslug_step_player
global _metalslug_spawn_bullet
global _metalslug_update_projectiles
global _metalslug_check_hitboxes

section .text

; ------------------------------------------------------------------------------
; _metalslug_step_player
; Inputs:
;   RDI = Pointer to Player Entity [int32 x, int32 y, int32 vx, int32 vy, int32 hp, int32 state]
;   RSI = Input bitmask (bit 0: Left, bit 1: Right, bit 2: Jump, bit 3: Shoot)
;   RDX = Gravity constant
; ------------------------------------------------------------------------------
_metalslug_step_player:
    push    rbp
    mov     rbp, rsp

    ; 1. Horizontal movement handling
    mov     eax, [rdi + 8]          ; Load vx
    test    esi, 1                  ; Check Left
    jz      .check_right
    mov     dword [rdi + 8], -4     ; Move left
    jmp     .apply_friction

.check_right:
    test    esi, 2                  ; Check Right
    jz      .stop_horizontal
    mov     dword [rdi + 8], 4      ; Move right
    jmp     .apply_friction

.stop_horizontal:
    mov     dword [rdi + 8], 0      ; Decelerate to 0

.apply_friction:
    ; 2. Vertical Jump & Gravity handling
    mov     eax, [rdi + 12]         ; Load vy
    add     eax, edx                ; vy += gravity
    mov     [rdi + 12], eax         ; Save vy

    test    esi, 4                  ; Check Jump trigger
    jz      .update_coords
    
    ; Only jump if on ground (y >= 220)
    cmp     dword [rdi + 4], 220
    jl      .update_coords
    mov     dword [rdi + 12], -10   ; Upward jump impulse

.update_coords:
    ; Update X
    mov     eax, [rdi]
    add     eax, [rdi + 8]
    ; Clamp X boundaries (10 to 580)
    cmp     eax, 10
    jge     .check_max_x
    mov     eax, 10
    jmp     .save_x

.check_max_x:
    cmp     eax, 580
    jle     .save_x
    mov     eax, 580

.save_x:
    mov     [rdi], eax

    ; Update Y
    mov     ecx, [rdi + 4]
    add     ecx, [rdi + 12]
    ; Floor collision at ground Y = 220
    cmp     ecx, 220
    jle     .save_y
    mov     ecx, 220
    mov     dword [rdi + 12], 0     ; Reset vy upon landing

.save_y:
    mov     [rdi + 4], ecx

    mov     rsp, rbp
    pop     rbp
    ret

; ------------------------------------------------------------------------------
; _metalslug_check_hitboxes
; Checks bullet AABB intersection against enemy soldier/tank target
; Inputs:
;   RDI = Bullet X, RSI = Bullet Y (Bullet size 8x4)
;   RDX = Target X, RCX = Target Y (Target size 28x38)
; Output:
;   RAX = 1 if Hit, 0 if Miss
; ------------------------------------------------------------------------------
_metalslug_check_hitboxes:
    ; Bullet X overlap: (bx + 8 > tx) && (bx < tx + 28)
    lea     eax, [rdi + 8]
    cmp     eax, edx
    jle     .miss
    lea     eax, [rdx + 28]
    cmp     edi, eax
    jge     .miss

    ; Bullet Y overlap: (by + 4 > ty) && (by < ty + 38)
    lea     eax, [rsi + 4]
    cmp     eax, ecx
    jle     .miss
    lea     eax, [rcx + 38]
    cmp     esi, eax
    jge     .miss

    mov     rax, 1                  ; Direct hit registered
    ret

.miss:
    xor     rax, rax                ; Missed target
    ret
