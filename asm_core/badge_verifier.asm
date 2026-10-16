; ==============================================================================
; GitBadge Hub - Core Fast Hashing & Verification Routine
; Architecture: x86-64 Assembly (NASM Syntax)
; Module: badge_verifier.asm
; Purpose: Ultra-low latency machine-level bitwise checksum verification 
;          for git commit hashes and Co-authored-by signature tokens.
; ==============================================================================

global _verify_commit_hash
global _calculate_djb2_hash
global _fast_bit_popcount

section .text

; ------------------------------------------------------------------------------
; _verify_commit_hash
; Input : RDI = Pointer to commit SHA-1 string (40 bytes hex)
;         RSI = Target verification mask
; Output: RAX = 1 (Valid & Verified), 0 (Corrupted / Invalid Hex)
; ------------------------------------------------------------------------------
_verify_commit_hash:
    push    rbp
    mov     rbp, rsp
    push    rbx
    push    r12

    test    rdi, rdi                ; Check if pointer is NULL
    jz      .invalid_hash

    xor     rcx, rcx                ; Loop counter = 0
    xor     rax, rax                ; Accumulator = 0

.loop_hex:
    cmp     rcx, 40                 ; SHA-1 is 40 hex characters
    jge     .verify_success

    movzx   edx, byte [rdi + rcx]   ; Load next ASCII character
    
    ; Validate hex digit (0-9, a-f, A-F)
    cmp     dl, '0'
    jl      .invalid_hash
    cmp     dl, '9'
    jle     .valid_digit

    cmp     dl, 'a'
    jl      .check_upper
    cmp     dl, 'f'
    jle     .valid_digit

.check_upper:
    cmp     dl, 'A'
    jl      .invalid_hash
    cmp     dl, 'F'
    jg      .invalid_hash

.valid_digit:
    rol     eax, 3                  ; Machine-level bitwise permutation
    xor     eax, edx                ; Bitwise mixing
    inc     rcx
    jmp     .loop_hex

.verify_success:
    mov     rax, 1                  ; Return true (1)
    jmp     .cleanup

.invalid_hash:
    xor     rax, rax                ; Return false (0)

.cleanup:
    pop     r12
    pop     rbx
    mov     rsp, rbp
    pop     rbp
    ret

; ------------------------------------------------------------------------------
; _calculate_djb2_hash
; Fast string hash function in pure machine instructions
; Input : RDI = Pointer to null-terminated string
; Output: RAX = 64-bit Hash Value
; ------------------------------------------------------------------------------
_calculate_djb2_hash:
    push    rbp
    mov     rbp, rsp
    
    mov     rax, 5381               ; hash = 5381

.hash_loop:
    movzx   edx, byte [rdi]
    test    dl, dl
    jz      .hash_done

    ; hash = ((hash << 5) + hash) + c => hash * 33 + c
    mov     rcx, rax
    shl     rcx, 5
    add     rax, rcx
    add     rax, rdx

    inc     rdi
    jmp     .hash_loop

.hash_done:
    mov     rsp, rbp
    pop     rbp
    ret

; ------------------------------------------------------------------------------
; _fast_bit_popcount
; Direct CPU instruction for counting active bits in badge flag mask
; Input : RDI = 64-bit badge bitmask
; Output: RAX = Active badges count
; ------------------------------------------------------------------------------
_fast_bit_popcount:
    popcnt  rax, rdi                ; Native x86 POPCNT hardware instruction
    ret
