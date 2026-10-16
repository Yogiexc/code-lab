; ==============================================================================
; GitBadge Hub - Flappy Bird Physics & Collision Game Engine
; Architecture: x86-64 Machine Assembly (NASM Syntax)
; Module: flappy_core.asm
; Purpose: Direct CPU registers & ALU physics computation for Flappy Bird game:
;          - Sub-pixel Gravity Accumulation
;          - Velocity Jump Impulse
;          - AABB (Axis-Aligned Bounding Box) Pipe Collision Detection
; ==============================================================================

global _flappy_apply_gravity
global _flappy_jump_impulse
global _flappy_check_collision
global _flappy_step_physics

section .text

; ------------------------------------------------------------------------------
; _flappy_apply_gravity
; Updates bird vertical position and velocity according to downward gravity
; Input : RDI = Pointer to Bird State Struct [int32 y, int32 velocity, int32 score]
;         RSI = Gravity force (e.g. 1 unit per tick)
;         RDX = Terminal velocity cap (e.g. 12 units)
; Output: RAX = Updated Y position
; ------------------------------------------------------------------------------
_flappy_apply_gravity:
    push    rbp
    mov     rbp, rsp

    mov     eax, [rdi + 4]          ; Load current velocity (offset 4)
    add     eax, esi                ; velocity += gravity
    
    ; Clamp to terminal velocity
    cmp     eax, edx
    jle     .store_velocity
    mov     eax, edx                ; velocity = max_velocity

.store_velocity:
    mov     [rdi + 4], eax          ; Save velocity back
    
    mov     ecx, [rdi]              ; Load current Y position (offset 0)
    add     ecx, eax                ; y += velocity
    mov     [rdi], ecx              ; Save Y back

    mov     eax, ecx                ; Return updated Y in RAX
    mov     rsp, rbp
    pop     rbp
    ret

; ------------------------------------------------------------------------------
; _flappy_jump_impulse
; Applies an upward instantaneous velocity impulse (Flap!)
; Input : RDI = Pointer to Bird State Struct
;         RSI = Upward impulse force (negative value, e.g. -7)
; Output: RAX = New upward velocity
; ------------------------------------------------------------------------------
_flappy_jump_impulse:
    mov     [rdi + 4], esi          ; velocity = jump_impulse
    mov     eax, esi
    ret

; ------------------------------------------------------------------------------
; _flappy_check_collision
; Fast hardware AABB collision checking between bird and a pair of pipe obstacles
; Inputs:
;   RDI = Bird X
;   RSI = Bird Y
;   RDX = Pipe X
;   RCX = Pipe Gap Top Y
;   R8  = Pipe Gap Bottom Y
; Output:
;   RAX = 1 if Collision (Game Over), 0 if Safe Pass
; ------------------------------------------------------------------------------
_flappy_check_collision:
    push    rbp
    mov     rbp, rsp

    ; Bird dimensions: 20x20
    ; Pipe width: 50
    ; Check horizontal overlap: (bird_x + 20 > pipe_x) AND (bird_x < pipe_x + 50)
    lea     eax, [rdi + 20]
    cmp     eax, edx                ; bird_x + 20 <= pipe_x ?
    jle     .no_collision

    lea     eax, [rdx + 50]
    cmp     edi, eax                ; bird_x >= pipe_x + 50 ?
    jge     .no_collision

    ; Check vertical collision (Hit top pipe or Hit bottom pipe)
    ; Hit top pipe: bird_y < gap_top_y
    cmp     esi, ecx
    jl      .collision_detected

    ; Hit bottom pipe: bird_y + 20 > gap_bottom_y
    lea     eax, [rsi + 20]
    cmp     eax, r8d
    jg      .collision_detected

.no_collision:
    xor     rax, rax                ; Return 0 (Safe)
    mov     rsp, rbp
    pop     rbp
    ret

.collision_detected:
    mov     rax, 1                  ; Return 1 (Dead / Hit pipe)
    mov     rsp, rbp
    pop     rbp
    ret

; ------------------------------------------------------------------------------
; _flappy_step_physics
; Master tick loop executing one full physics step
; ------------------------------------------------------------------------------
_flappy_step_physics:
    ; Integrates position and boundary checks (ceiling: 0, floor: 380)
    mov     eax, [rdi]              ; Load Y
    cmp     eax, 0
    jl      .hit_boundary
    cmp     eax, 380
    jg      .hit_boundary
    xor     rax, rax
    ret

.hit_boundary:
    mov     rax, 1
    ret
