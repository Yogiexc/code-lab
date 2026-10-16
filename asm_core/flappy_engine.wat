(module
  ;; Flappy Bird WebAssembly Low-Level VM Engine
  ;; Implements machine memory layout for high performance in-browser tick loop

  (memory (export "memory") 1)

  ;; Memory Layout:
  ;; offset 0: bird_y (f32)
  ;; offset 4: bird_velocity (f32)
  ;; offset 8: score (i32)
  ;; offset 12: game_state (i32) 0=idle, 1=playing, 2=gameover

  (func (export "init")
    (f32.store (i32.const 0) (f32.const 150.0))  ;; initial y = 150
    (f32.store (i32.const 4) (f32.const 0.0))    ;; velocity = 0
    (i32.store (i32.const 8) (i32.const 0))      ;; score = 0
    (i32.store (i32.const 12) (i32.const 0))     ;; state = idle
  )

  (func (export "jump")
    (f32.store (i32.const 4) (f32.const -5.5))   ;; apply upward velocity impulse
    (i32.store (i32.const 12) (i32.const 1))     ;; set state = playing
  )

  (func (export "tick") (param $gravity f32) (result f32)
    (local $y f32)
    (local $vel f32)

    ;; vel += gravity
    (local.set $vel
      (f32.add (f32.load (i32.const 4)) (local.get $gravity))
    )
    (f32.store (i32.const 4) (local.get $vel))

    ;; y += vel
    (local.set $y
      (f32.add (f32.load (i32.const 0)) (local.get $vel))
    )
    (f32.store (i32.const 0) (local.get $y))

    (local.get $y)
  )

  (func (export "check_pipe_hit") 
    (param $bx f32) (param $by f32) 
    (param $px f32) (param $top_y f32) (param $bot_y f32) 
    (result i32)
    
    ;; Check horizontal overlap: (bx + 18.0 > px) && (bx < px + 45.0)
    (if (f32.gt (f32.add (local.get $bx) (f32.const 18.0)) (local.get $px))
      (then
        (if (f32.lt (local.get $bx) (f32.add (local.get $px) (f32.const 45.0)))
          (then
            ;; Vertical overlap: (by < top_y) || (by + 18.0 > bot_y)
            (if (f32.lt (local.get $by) (local.get $top_y))
              (then (return (i32.const 1)))
            )
            (if (f32.gt (f32.add (local.get $by) (f32.const 18.0)) (local.get $bot_y))
              (then (return (i32.const 1)))
            )
          )
        )
      )
    )
    (i32.const 0)
  )
)
