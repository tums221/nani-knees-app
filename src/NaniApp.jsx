import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check, Clock, Dumbbell, Home, Calendar, Heart, BookOpen, Plus, Minus, X, ChevronDown, ChevronUp, Award, TrendingUp, Flame, Settings, AlertTriangle } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — warm terracotta, cream, blush palette from the ebook
// ═══════════════════════════════════════════════════════════════════════════
const PALETTE = {
  cream: "#FAF7F4",
  creamDeep: "#F3EAE1",
  blush: "#E8C5B8",
  blushSoft: "#F5D5C8",
  terracotta: "#C4705A",
  terracottaDark: "#8B4A36",
  terracottaDeep: "#6B3020",
  ink: "#1C1410",
  mocha: "#5C3D2E",
  sand: "#EDE0D4",
  gold: "#B8860B",
  green: "#2E7D5E",
  greenSoft: "#D4E8DD",
  red: "#A64B2A",
  redSoft: "#F3D9CF",
};

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE INSTRUCTIONS DATABASE (mirrors the ebook content)
// ═══════════════════════════════════════════════════════════════════════════
const INSTRUCTIONS = {
  standing_glute_squeeze: {
    setup: "No equipment. Feet hip-width, toes straight. Hands on glutes to feel them fire. Knees softly bent.",
    execution: ["Squeeze both glutes as hard as possible.", "Hold maximum contraction for 5 seconds.", "Release fully for 2-3 seconds.", "Repeat 10-20 times."],
    cues: ["Squeeze 100%, not 50%.", "Hands on glutes to confirm they're firing.", "Ribs stacked over pelvis."],
    mistakes: ["Clenching quads or hamstrings instead.", "Holding breath.", "Arching the lower back."],
    breathing: "Inhale before each squeeze; exhale slowly through the 5-second hold.",
  },
  glute_bridge: {
    setup: "Lie face-up. Knees bent, feet flat hip-width, 6-8 inches from glutes. Toes forward. Arms at sides.",
    execution: ["Press lower back flat (posterior tilt).", "Drive through heels, squeeze glutes hard.", "Lift hips to straight line from shoulders to knees.", "Pause 1-2 seconds at the top.", "Lower over 2 seconds.", "Re-establish tilt before next rep."],
    cues: ["Tuck pelvis, ribs down.", "Push floor away with heels.", "Squeeze glutes like holding a coin."],
    mistakes: ["Hyperextending the low back.", "Feeling it in hamstrings (feet too far).", "Knees caving inward."],
    breathing: "Inhale at bottom; exhale as you press up.",
  },
  lateral_walk: {
    setup: "Mini band above knees (or ankles for harder). Feet hip-width. Hands on hips.",
    execution: ["Drop into a 30° quarter-squat.", "Step sideways with lead foot shoulder-width.", "Drive knee out against band.", "Bring trailing foot in — stop before feet touch.", "8-12 steps, then reverse direction."],
    cues: ["Stay low — don't bob up and down.", "Toes forward, knees pushing out.", "Slow and controlled."],
    mistakes: ["Standing up between steps.", "Feet coming too close.", "Stance-leg knee caving."],
    breathing: "Steady rhythm — exhale on step out, inhale on step in.",
  },
  hip_thrust: {
    setup: "Flat bench ~16-17\" tall. Loaded barbell with pad rolled over hips in hip crease. Feet flat hip-width, toes slightly out.",
    execution: ["Inhale and brace; chin tucked.", "Drive forcefully through whole foot, heels emphasized.", "Rise until torso and thighs form straight line.", "Tuck tailbone and squeeze glutes 1-2 sec.", "Lower under control (2-3 sec).", "Stop just before bar touches floor."],
    cues: ["Ribs down, tuck pelvis at top.", "Push floor away through heels.", "Head and torso glide up bench as one unit."],
    mistakes: ["Hyperextending lower back.", "Feet too close/far — shins should be vertical.", "Bar on abdomen — reposition to hip crease."],
    breathing: "Inhale at bottom, brace; exhale at top lockout; inhale as you lower.",
  },
  rdl: {
    setup: "Two dumbbells. Feet hip-width, toes forward. DBs in front of thighs, palms facing body.",
    execution: ["Inhale, brace core.", "Push hips straight back (like closing a door with your butt).", "Let DBs slide down front of thighs.", "Hinge until strong hamstring stretch (~mid-shin).", "Pause briefly.", "Drive through whole foot, squeeze glutes, extend hips.", "Stand tall without hyperextending."],
    cues: ["Hips back, not down — hinge, not squat.", "Drag DBs up your legs using lats.", "Long spine from crown to tailbone."],
    mistakes: ["Rounding lower back.", "Knees bending more during descent.", "DBs drifting away from legs."],
    breathing: "Inhale at top, brace through descent; exhale on drive up.",
  },
  sumo_squat: {
    setup: "Dumbbell or kettlebell held vertically at chest. Feet ~1.5x shoulder width, toes out 30-45°.",
    execution: ["Inhale, brace core.", "Push knees out while hinging slightly at hips.", "Lower straight down between heels.", "Continue until thighs parallel to floor.", "Pause briefly without knees caving.", "Drive through whole foot, 'spread the floor.'", "Squeeze glutes at top."],
    cues: ["Spread the floor apart with feet.", "Chest proud, elbows down.", "Knees track over pinky toes."],
    mistakes: ["Knees caving inward.", "Heels lifting or torso pitching forward.", "Butt wink at bottom."],
    breathing: "Inhale and brace at top; exhale on way up.",
  },
  cable_pull_through: {
    setup: "Rope at lowest cable pulley. Face away, rope between legs. Feet slightly wider than shoulder-width.",
    execution: ["Hinge at hips, push glutes back toward stack.", "Let rope travel back between legs, torso ~45°.", "Arms are passive hooks.", "Drive hips forward by squeezing glutes.", "Extend fully without hyperextending.", "Hold squeeze 1 second."],
    cues: ["Hips back, not down.", "Glutes pull the weight — arms are passive.", "Zip up glutes at top."],
    mistakes: ["Squatting instead of hinging.", "Rounding lower back.", "Over-extending at top."],
    breathing: "Inhale on hinge back; exhale on drive forward.",
  },
  walking_lunge: {
    setup: "DB in each hand, neutral grip, arms at sides. Clear 15-20 ft path.",
    execution: ["Step forward 1.5-2x normal stride.", "Lower DOWN (not forward) by bending both knees.", "Back knee to 1-2\" above floor.", "Front shin vertical, thigh parallel.", "Drive through front heel to stand.", "Continue alternating."],
    cues: ["Two parallel tracks, not a tightrope.", "Down, not forward.", "Drive through front heel."],
    mistakes: ["Steps too short.", "Torso pitching forward.", "Front knee caving."],
    breathing: "Inhale on step down; exhale on drive up.",
  },
  leg_press: {
    setup: "Sit deep. Feet in upper third of platform, heels 16-20\" apart, toes out 30-45°. Feet flat.",
    execution: ["Inhale, lower slowly (2-3 sec).", "Knees just past 90°, strong glute stretch.", "Stop when pelvis starts to tuck.", "Push through heels to drive up.", "Lead with hips, squeezing glutes.", "Stop short of lockout, 10° soft bend."],
    cues: ["Heel drive — toes feel light.", "Butt glued to seat.", "Knees out tracking pinky toes."],
    mistakes: ["Going too deep (butt wink).", "Pushing through balls of feet.", "Locking out."],
    breathing: "Inhale on lowering; exhale on press up.",
  },
  clamshell: {
    setup: "Mini band above knees. Side-lying, hips stacked perpendicular. Knees bent 45°, stacked, feet together.",
    execution: ["Feet glued, hips stacked.", "Rotate top knee up against band.", "Open 40-60° without pelvis rolling back.", "Hold 1-2 sec, squeeze upper glute.", "Lower over 2 sec.", "Stop before knees touch."],
    cues: ["Drive knee out against band.", "Hips stacked like bookends.", "Squeeze the top cheek."],
    mistakes: ["Rolling pelvis back for more range.", "Feet separating.", "Rushing the eccentric."],
    breathing: "Exhale on open; inhale as you lower.",
  },
  dead_bug: {
    setup: "Lie face-up, optional pillow under head.",
    execution: ["Tabletop: knees over hips at 90°, arms up over shoulders.", "Press lower back flat.", "Exhale, lower right arm overhead and extend left leg to 1-2\" above floor.", "Pause 1 sec, verify low back still flat.", "Inhale, return both limbs.", "Repeat opposite side (= 1 rep)."],
    cues: ["Press low back into floor entire time.", "Ribs down, zipper up.", "Only extend as far as lumbar stays pinned."],
    mistakes: ["Arching low back as leg lowers.", "Same-side arm and leg.", "Rushing and holding breath."],
    breathing: "Inhale in tabletop; exhale slowly on extension; inhale back.",
  },
  pelvic_tilt: {
    setup: "Feet hip-width, toes forward. Knees softly bent. Hands on hip bones to feel the tilt.",
    execution: ["Posterior tilt: tuck tailbone, point pubic bone up.", "Contract lower abs and glutes, lumbar flattens.", "Hold 1-2 sec.", "Anterior tilt: stick tailbone back and up, lumbar arches.", "Hold 1-2 sec.", "Return through neutral between tilts."],
    cues: ["Move only the pelvis — ribcage still.", "'Bowl of water' — spill front or back.", "Knees soft, glutes active on PPT."],
    mistakes: ["Bending knees to fake the tilt.", "Ribcage shifting with pelvis.", "Holding breath."],
    breathing: "Exhale on posterior tilt; inhale through neutral into anterior.",
  },
  fire_hydrant: {
    setup: "Mini band above knees. Quadruped: hands under shoulders, knees under hips at 90°.",
    execution: ["Keep working knee at 90°.", "Lift leg laterally outward against band.", "Raise to thigh at hip height.", "Hips square — don't twist pelvis.", "Hold 1-2 sec, squeeze side glute.", "Lower over 2 sec; stop before knee touches."],
    cues: ["Hips square — balance a glass on your back.", "Lead with the knee.", "Spread fingers wide for stable base."],
    mistakes: ["Twisting torso to go higher.", "Back sagging or arching.", "Weight shifting to opposite hand."],
    breathing: "Exhale on lift; inhale as you lower.",
  },
  pallof_press: {
    setup: "Cable at chest height. Stand perpendicular to cable, 2-3 ft away. Handle at sternum both hands, light weight (5-10 lb).",
    execution: ["Tall stance, hips square, brace like bracing for a punch.", "Exhale slowly, press handle out to full extension.", "Hold 2-3 sec resisting rotation.", "Keep shoulders and hips perfectly square.", "Inhale, return over 2-3 sec.", "Switch sides for equal reps."],
    cues: ["Resist rotation — your job is NOT to twist.", "Press from the sternum.", "Squeeze glutes before every press."],
    mistakes: ["Torso twisting toward cable.", "Arching low back / flaring ribs.", "Shrugging shoulders."],
    breathing: "Slow exhale during press; light breaths during hold; inhale on return.",
  },
  cat_cow: {
    setup: "Quadruped. Hands under shoulders, knees under hips. Neutral spine, gaze down.",
    execution: ["3-5 classic cat-cows to warm up.", "Then pelvic circles: tailbone drifts right, tucks, left, arches.", "One full circle in 4-6 seconds.", "5-8 clockwise.", "5-8 counterclockwise.", "Let the circle travel up the spine."],
    cues: ["Draw big smooth circles with tailbone.", "Press floor away with hands.", "Let circle move through whole spine."],
    mistakes: ["Bending/locking elbows.", "Shuttling forward and back through shoulders/hips.", "Locking the thoracic spine."],
    breathing: "One full breath cycle per circle.",
  },
  single_leg_bridge: {
    setup: "Lie face-up. Knees bent, feet flat hip-width, 6-8\" from glutes.",
    execution: ["Press lumbar flat.", "Lift non-working leg with knee bent or extended.", "Drive through heel of planted leg, squeeze glute.", "Rise to straight line shoulders to working knee.", "Maintain tilt at top.", "Squeeze 1-2 sec.", "Lower over 2 sec, switch sides after full set."],
    cues: ["Tuck pelvis throughout.", "Push floor away with heel.", "Keep hips perfectly level."],
    mistakes: ["Hyperextending low back.", "Pushing through toes.", "Non-working hip dropping."],
    breathing: "Inhale at bottom; exhale as you press up.",
  },
  step_up: {
    setup: "Sturdy box or bench 16-18\". DB in each hand. Stand facing box, feet hip-width.",
    execution: ["Place entire working foot flat on box.", "Shift weight onto that heel.", "Without pushing off trailing foot, extend hip and knee to stand on top.", "Bring trailing leg up, squeeze glute 1 sec.", "Step DOWN with trailing leg first, 2 sec.", "Working foot last to leave box."],
    cues: ["Drive through heel, not toes.", "Don't push off back foot.", "Knee tracks over middle toes."],
    mistakes: ["Jumping off trailing foot.", "Box too high.", "Torso collapsing forward."],
    breathing: "Inhale before step up; exhale on drive up.",
  },
  frog_pump: {
    setup: "Lie face-up. Soles of feet together, knees wide open. Feet 1-2 ft from glutes.",
    execution: ["Flatten lumbar into floor (posterior tilt).", "Tuck chin.", "Drive outer edges of feet into floor.", "Squeeze glutes forcefully to lift hips.", "Full hip extension with knees flared.", "Squeeze 1 sec.", "Pump into next rep without losing tilt."],
    cues: ["Flatten lumbar, tuck chin.", "Drive through outer edges of feet.", "Pump, don't pause."],
    mistakes: ["Feet too far from glutes.", "Arching at the top.", "Not a responder — switch to standard bridges."],
    breathing: "Short rhythmic breathing — exhale on pump, inhale on descent.",
  },
  hip_adduction: {
    setup: "Low cable, ankle cuff on near ankle. Stand perpendicular, 2-3 ft away. Grip post for balance.",
    execution: ["Level pelvis, brace core.", "Working leg lifted slightly, cable pulling it out.", "Sweep leg across body in front of stance leg.", "Drive with inner thigh.", "Continue until ankle crosses past stance leg.", "Pause 1 sec at peak.", "Return slowly over 2-3 sec."],
    cues: ["Lead with inside of thigh.", "Stand tall, hips square.", "Soft knee — don't bend it."],
    mistakes: ["Swinging with momentum.", "Leaning torso toward cable.", "Foot hitting the floor."],
    breathing: "Exhale on sweep across; inhale on return.",
  },
  bird_dog: {
    setup: "Quadruped. Hands under shoulders, knees under hips. Spine neutral.",
    execution: ["Without shifting torso, extend right arm straight forward (thumb up).", "Simultaneously extend left leg straight back (foot dorsiflexed).", "Line from fingertips to heel.", "Hold 7-10 sec breathing lightly.", "Lower with control — don't rest full weight.", "5-10 reps per side."],
    cues: ["Kick heel straight back, don't lift it up.", "Balance a glass on your lower back.", "Reach long, not high."],
    mistakes: ["Hips rotating open.", "Lower back arching.", "Looking forward or up."],
    breathing: "Inhale at start; light breathing during hold — never hold breath.",
  },
  sumo_deadlift: {
    setup: "Stance 1.5-2x shoulder width, toes out ~40-45°. Bar over mid-feet, shins ~½\" from bar. Grip inside legs shoulder-width.",
    execution: ["Hinge down to grip while pushing knees outward.", "Shins nearly vertical, torso more upright than conventional.", "Shoulders slightly in front of bar. Chest up, lats engaged.", "Big breath, brace, pull slack out of bar.", "Drive hips forward/down, squeeze chest up so plates float.", "Push floor away; bar slides up shins.", "Drive hips to full lockout. Stand tall, glutes squeezed.", "Lower by pushing hips back first."],
    cues: ["Spread the floor with your feet.", "Squeeze chest up so hips don't shoot up.", "Drag bar up legs using lats."],
    mistakes: ["Hips rising faster than bar/chest.", "Knees caving inward.", "Setting up too far from bar."],
    breathing: "Valsalva at top of setup; hold through pull; exhale at lockout.",
  },
  bulgarian_squat: {
    setup: "Bench 16-20\" tall. Top of rear foot laces-down on bench. Feet on parallel hip-width tracks. DBs at sides.",
    execution: ["Upright with slight forward lean.", "80-90% of weight on front leg.", "Inhale, brace, lower straight down 2-3 sec.", "Back knee to 1-2\" above floor.", "Front thigh parallel, shin vertical.", "Pause briefly.", "Drive through whole front foot; don't push off back foot.", "Return to standing; squeeze front glute."],
    cues: ["Back leg is a kickstand only.", "Knee tracks over middle toes.", "Front foot planted like a tripod."],
    mistakes: ["Stance too short.", "Front knee caving.", "Tightrope stance (feet in line)."],
    breathing: "Inhale at top; brace through descent; exhale on drive up.",
  },
  leg_curl: {
    setup: "Prone leg curl machine. Pivot of lever arm aligned with back of knee joint. Ankle pad on Achilles, 1-2\" above heel.",
    execution: ["Face down, hips pressed flat into pad.", "Grip handles under chest.", "Legs extended with slight knee bend — stack lifted for constant tension.", "Brace, press hips into pad.", "Curl heels toward glutes to 90-120° knee flexion.", "Pause, squeeze hamstrings 1 sec.", "Lower over 2-3 sec; stop short of stack touching."],
    cues: ["Hips glued to pad.", "Curl, don't kick.", "Dorsiflex feet for stronger hamstring pull."],
    mistakes: ["Hips lifting off pad.", "Partial range of motion.", "Rushing the eccentric."],
    breathing: "Inhale on lowering; exhale on curl up.",
  },
  side_plank: {
    setup: "Side-lying with legs stacked. Bottom forearm on mat, elbow under shoulder. Feet stacked and flexed.",
    execution: ["Lift hips into side plank — straight line ears to ankles.", "Top hand on top hip or reaching up.", "Exhale, slowly lift top leg 30-45° (12-18\" of lift).", "Keep leg straight, foot/knee/hip forward.", "Hips don't rotate.", "Pause 1-2 sec squeezing outer glute.", "Lower with control."],
    cues: ["Hips stay stacked.", "Lift from outer hip, not quad.", "Long line head to bottom foot."],
    mistakes: ["Hips sagging — regress to bent-knee side plank.", "Top hip rotating open.", "Bottom shoulder collapsing."],
    breathing: "Exhale on lift; inhale on lower.",
  },
  barbell_rdl: {
    setup: "Barbell at mid-thigh or from floor. Feet hip- to shoulder-width. Pronated grip just outside hips. Straps permitted.",
    execution: ["Stand upright, bar against thighs.", "Shoulder blades down/back, chest up, spine neutral.", "Soft 15-20° knee bend that stays fixed.", "Inhale deeply, brace hard.", "Push hips straight back, bar slides down thighs.", "Hinge until bar at mid-shin / deep stretch.", "Don't force bar to floor if back rounds.", "Drive hips forward, squeeze glutes. Stand tall."],
    cues: ["Hips back, chest proud.", "Drag the bar up your legs.", "Long neck, long spine."],
    mistakes: ["Rounding lower back.", "Knees bending progressively.", "Bar drifting away from body."],
    breathing: "Valsalva brace at top; hold through descent and ascent.",
  },
  cable_kickback: {
    setup: "Low cable, ankle cuff above ankle bone. Face machine, step back, feet slightly wider than shoulder-width.",
    execution: ["Hinge forward 15-30°, grip uprights at shoulder height.", "Support knee soft, working leg slightly in front.", "Initiate by squeezing glute — no swinging.", "Extend leg straight back and slightly up, soft 10-15° knee bend.", "Top is 15-20° past hip-neutral.", "Don't kick so far that low back arches.", "Pause 1 sec, squeeze.", "Lower over 2-3 sec."],
    cues: ["Squeeze glute to initiate — no swinging.", "Hinge and brace.", "Heel to the wall behind you."],
    mistakes: ["Using momentum.", "Hyperextending lumbar.", "Pelvis rotating outward."],
    breathing: "Inhale on return; exhale as you kick and squeeze.",
  },
  cable_hip_flexion: {
    setup: "Low cable, ankle cuff above ankle. Stand facing AWAY from stack 2-3 ft. Grip upright for balance.",
    execution: ["Upright, weight on stance leg with slight bend.", "Working leg hangs neutral, cable pulls into mild extension.", "Pelvis neutral, ribs down.", "Exhale, drive knee forward and upward.", "Bend knee as you lift to thigh parallel to floor (hip and knee ~90°).", "Foot dorsiflexed.", "Pause 1 sec; squeeze hip flexors.", "Inhale, lower slowly 2-3 sec."],
    cues: ["Hips square — headlights straight forward.", "Lift with hip crease, not leaning torso back.", "Ribs stacked over pelvis."],
    mistakes: ["Leaning torso back to cheat range.", "Externally rotating to lift higher.", "Swinging with momentum."],
    breathing: "Exhale on concentric lift; inhale on lowering.",
  },
  half_kneeling_pallof: {
    setup: "Cable at chest height when half-kneeling (30-36\"). Kneel perpendicular, down knee closest to machine.",
    execution: ["Down knee under hip, up foot flat shin vertical.", "Hips and shoulders stacked and square.", "Squeeze glute of down leg — keeps pelvis neutral.", "Handle at sternum, elbows tucked.", "Inhale, brace, fire down-leg glute.", "Exhale slowly, press handle to full extension.", "Hold 2-3 sec resisting rotation.", "Return slowly 2-3 sec."],
    cues: ["Glute of down leg ON throughout.", "Shoulders stacked over hips.", "Both headlights straight ahead."],
    mistakes: ["Sitting into down hip (anterior tilt).", "Hips/shoulders twisting toward cable.", "Front foot rolling."],
    breathing: "Exhale through pursed lips on press; controlled breaths during hold.",
  },
  single_leg_hip_thrust: {
    setup: "Flat bench 16-18\". Upper back against long edge, bench at bottom of shoulder blades. Feet hip-width.",
    execution: ["Working foot 12-14\" from glutes, heel closer than toes.", "Lift non-working leg, knee at 90° or extended.", "Chin tucked.", "Drive through midfoot/heel, squeeze glute.", "Rise to straight line shoulders to working knee.", "Working shin vertical at top.", "Posterior tilt slightly, squeeze 1-2 sec.", "Lower over 2 sec, nearly touch floor."],
    cues: ["Posterior pelvic tilt at top.", "Shin vertical at lockout.", "Chin tucked, ribs down."],
    mistakes: ["Wrong bench height (use 16-18\").", "Hyperextending low back.", "Feeling it in hamstrings (move foot closer)."],
    breathing: "Inhale at bottom; exhale on drive up.",
  },
  single_leg_rdl: {
    setup: "Moderate DB/KB in OPPOSITE hand from working leg. Feet together, weight on working leg.",
    execution: ["Soft 15-20° bend in working knee — stays constant.", "Chest up, shoulders set.", "Hips square to front.", "Hinge at working hip, push glute straight back.", "Free leg extends behind like a seesaw.", "DB slides down front of working leg.", "Hinge to parallel (or first deep stretch without rounding).", "Pause 0.5-1 sec.", "Drive standing heel into floor, squeeze glute."],
    cues: ["Hips square — headlights at floor ahead.", "Long line heel to head at bottom.", "Push floor away with standing heel."],
    mistakes: ["Non-working hip rotating open.", "Rounding lower back.", "Bending and straightening standing knee."],
    breathing: "Inhale on hinge down; exhale on drive up.",
  },
  pallof_rotation: {
    setup: "Cable at chest, D-handle. Stand perpendicular, feet wider than shoulder-width. Use LIGHTER weight than standard Pallof.",
    execution: ["Tall, hips square, knees soft.", "Handle at sternum, elbows tucked.", "Brace, glutes engaged, ribs stacked.", "Exhale, press handle straight out.", "With arms extended, rotate torso AWAY from cable.", "Pivot through hips and trunk together, back heel pivots.", "At 45-90°, hold 1-2 sec feeling opposite oblique.", "Inhale, reverse rotation, return to chest."],
    cues: ["Rotate from hips and trunk as one unit.", "Pivot the back foot.", "Arms stay long throughout."],
    mistakes: ["Hips rotating toward stack.", "Twisting only the lumbar.", "Too much weight."],
    breathing: "Continuous exhale during press and rotation; inhale on return.",
  },
  sumo_15rep: {
    setup: "DB/KB at chest. Sumo stance heels 1.25-1.5x shoulder-width. Toes out 30-45°. Use ~60-70% of normal load.",
    execution: ["Inhale, brace, lower into FULL sumo squat (2-3 sec).", "FIRST DRIVE: halfway up only (thighs parallel).", "Do NOT stand all the way.", "SECOND DESCENT: back to bottom under control (1-2 sec).", "SECOND DRIVE: all the way up.", "Squeeze glutes and adductors, stand fully tall.", "That full sequence = 1 rep."],
    cues: ["Spread the floor apart with feet.", "Chest proud, elbows down.", "Same controlled tempo on both halves."],
    mistakes: ["Knees caving on second drive.", "Relaxing at halfway point.", "Butt wink at bottom."],
    breathing: "Inhale/brace at top; partial exhale to halfway; re-brace; full exhale standing tall.",
  },
  tri_set: {
    setup: "Light-to-medium mini band ABOVE KNEES for entire tri-set. 6-8 ft of floor space.",
    execution: ["CLAMSHELLS right: 10-15 reps, 1 sec hold at top.", "Roll to quadruped.", "FIRE HYDRANTS right: 10-15 reps, 1 sec hold.", "Stand up into 30° partial squat.", "LATERAL WALKS: 10 right, 10 left (stay low!).", "Repeat full sequence on LEFT side.", "Rest 45-90 sec. 2-3 rounds total."],
    cues: ["Band stays put across all three exercises.", "Constant tension — never slack.", "Form over speed during transitions."],
    mistakes: ["Band too heavy.", "Standing up between walk steps.", "Rushing transitions."],
    breathing: "Rhythmic throughout — exhale on concentric, inhale on return.",
  },
  pelvic_complex: {
    setup: "Feet hip-width. Knees in constant demi-plié throughout. Hands on hip bones. Ribs stacked.",
    execution: ["PHASE 1 — 8 slow tilts (3 sec each): post → neutral → ant → neutral.", "PHASE 2 — 8 lateral hip shifts: right, center, left, center.", "PHASE 3 — 4 circles clockwise, 4 counterclockwise.", "PHASE 4 — 16 rapid pulses (fast alternating tilts).", "PHASE 5 — 2 slow full circles each way.", "Whole sequence: 60-90 sec."],
    cues: ["Maintain demi-plié throughout every phase.", "Upper body is a stone statue — only pelvis moves.", "Hit all four corners evenly."],
    mistakes: ["Ribcage shifting with pelvis.", "Egg-shaped circles instead of round.", "Losing knee bend."],
    breathing: "Inhale on anterior/shifts; exhale on posterior/drawn-in. Fast rhythm on pulses.",
  },
  pelvic_tilt_speed: {
    setup: "Same as pelvic tilt. Hands on hips or one on belly, one on sacrum.",
    execution: ["Start slow — 2 sec per tilt.", "Accelerate to 1 tilt per beat at ~120 BPM.", "Then double-time.", "Shrink range as speed increases — sharp pops, not smeared.", "16-32 reps, or 20-30 sec intervals."],
    cues: ["Stay pin-still from the ribs up.", "Crisp, not smeared — snap to each end position.", "Knees at same bend throughout."],
    mistakes: ["Knee bob — head should not move vertically.", "Ribcage shifting.", "Losing crispness at speed."],
    breathing: "Continuous nasal rhythm — 2 tilts per inhale, 2 per exhale.",
  },
  hip_flexor_stretch: {
    setup: "Pad under back knee. Front leg 90°, ankle under knee. Back knee under hip, 90°.",
    execution: ["FIRST — tuck into posterior pelvic tilt.", "Squeeze back-leg glute, draw pubic bone up.", "Holding the tuck, shift weight forward.", "Feel stretch front of back hip/thigh.", "To deepen: reach same-side arm overhead, side-bend away.", "Quad emphasis: grasp back foot, heel to glute.", "Hold 30-60 sec. Switch. 2-3 rounds."],
    cues: ["Tuck tailbone FIRST, then shift forward.", "Squeeze back glute entire time.", "Ribs stacked over hips."],
    mistakes: ["Pushing hips forward without the tuck — compresses low back.", "Hips splaying open.", "Front knee drifting past toes."],
    breathing: "4-sec inhale, 6-8 sec exhale. Deepen on exhales.",
  },
  figure_four_stretch: {
    setup: "Lie face-up on padded mat. Knees bent, feet flat hip-width.",
    execution: ["Cross right ankle over left thigh, just above knee.", "Strongly flex (dorsiflex) right foot.", "Let right knee drop open to right.", "Lift left foot, draw left knee toward chest.", "Thread right hand through window; clasp hands behind left hamstring.", "Gently pull left thigh toward chest.", "Deep right-glute/outer-hip stretch.", "Hold 30-60 sec. Switch."],
    cues: ["Flex the crossed foot hard.", "Keep head and shoulders flat.", "Pull from the bottom leg, not top knee."],
    mistakes: ["Pointed / floppy crossed foot.", "Lifting head to reach bottom leg.", "Forcing top knee down."],
    breathing: "4-count inhale, 6-count exhale. Soften glute on each exhale.",
  },
  hamstring_stretch: {
    setup: "Supine with yoga strap. Loop around ball of working foot (arch), hold one end each hand.",
    execution: ["Bend working leg into chest, then extend up.", "Non-working leg bent with foot on floor or extended.", "Hips and shoulders flat.", "Soft micro-bend in working knee if needed.", "Gently draw leg toward chest/face.", "Flex foot for fuller hamstring/calf; point to isolate hamstring.", "Hold 30-60 sec. 2-3 rounds per side."],
    cues: ["Both sit bones heavy on mat.", "Lead with the heel — press it to ceiling.", "Soft knee beats a locked knee."],
    mistakes: ["Yanking and lifting hips/shoulders.", "Bending knee to reach closer.", "Breath-holding."],
    breathing: "4-count inhale, 6-8 count exhale. Draw closer on exhale.",
  },
  butterfly_stretch: {
    setup: "Sit on padded mat. Elevate hips 2-4\" on blanket/block if pelvis rocks back. Soles together, knees fall open.",
    execution: ["Sit tall first — press sit bones down.", "Heels toward groin for intense stretch, or 6-12\" out for gentler.", "Hands clasp feet or ankles.", "UPRIGHT: Let knees drop; no forcing with elbows.", "FOLD: Inhale lengthen; exhale hinge from hip joints, lead with sternum.", "Spine stays long; don't round low back.", "Hold 30-90 sec active; 3-5 min restorative."],
    cues: ["Sit on sit bones, not tailbone.", "Hinge from hip creases — chest toward feet.", "Let gravity open knees."],
    mistakes: ["Rounding low back in fold.", "Forcing knees down.", "Breath-holding."],
    breathing: "4-count inhale lengthen; 6-8 count exhale deepen.",
  },
  ninety_ninety_stretch: {
    setup: "Seated with elevated hips if needed. Form 'Z' shape with legs.",
    execution: ["Front leg 90°: thigh forward, shin across body.", "Back leg 90°: thigh out to side, shin parallel to back edge.", "Sit tall with hands on floor.", "FRONT HIP: Hinge forward over front shin, spine straight.", "Hold 30-60 sec. Deep outer-glute stretch.", "BACK HIP (optional): Rotate to face back leg, hinge forward.", "30-60 sec. Switch sides."],
    cues: ["Sit tall first — then hinge from hips.", "Both sit bones stay on floor.", "Lead with chest, not head."],
    mistakes: ["Back hip lifting significantly.", "Rounding low back to reach further.", "Front-hip pinching (widen leg angle)."],
    breathing: "4-count inhale expanding belly/ribs, 6-8 count exhale.",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PROGRAM DATA — all 12 weeks mapped to days, exercises, and prescriptions
// ═══════════════════════════════════════════════════════════════════════════

// Warm-up is the same every session
const WARMUP = [
  { key: "standing_glute_squeeze", name: "Standing Glute Squeeze", sets: 2, reps: "5 sec", rest: "—", tempo: "Hold" },
  { key: "clamshell", name: "Banded Clamshells", sets: 2, reps: "15/side", rest: "30s", tempo: "1-2-1" },
  { key: "glute_bridge", name: "Bodyweight Glute Bridge", sets: 2, reps: "12", rest: "30s", tempo: "1-2-1" },
  { key: "lateral_walk", name: "Banded Lateral Walk", sets: 1, reps: "15 each way", rest: "—", tempo: "—" },
];

// Cool-down stretches
const COOLDOWN = [
  { key: "hip_flexor_stretch", name: "Half-Kneeling Hip Flexor Stretch", sets: 2, reps: "30-60s/side", rest: "—", tempo: "Hold" },
  { key: "figure_four_stretch", name: "Supine Figure-Four", sets: 2, reps: "30-60s/side", rest: "—", tempo: "Hold" },
  { key: "hamstring_stretch", name: "Supine Hamstring", sets: 2, reps: "30-60s/side", rest: "—", tempo: "Hold" },
  { key: "butterfly_stretch", name: "Seated Butterfly", sets: 2, reps: "30-90s", rest: "—", tempo: "Hold" },
  { key: "ninety_ninety_stretch", name: "90/90 Hip Stretch", sets: 2, reps: "30-60s/side", rest: "—", tempo: "Hold" },
];

// Phase templates (workouts used across a phase)
const PHASE_1 = {
  A: {
    name: "Day A — Strength",
    day: "Monday",
    rep_info: "Rep range 6-10 | Rest 2-2.5 min",
    exercises: [
      { label: "A1", key: "hip_thrust", name: "Barbell Hip Thrust", sets: 3, reps: "10", rest: "2 min", tempo: "2-1-2" },
      { label: "A2", key: "rdl", name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10", rest: "2 min", tempo: "3-0-1" },
      { label: "B1", key: "sumo_squat", name: "Goblet Sumo Squat", sets: 3, reps: "12", rest: "90s", tempo: "2-1-1" },
      { label: "B2", key: "clamshell", name: "Banded Clamshells", sets: 2, reps: "15/side", rest: "60s", tempo: "1-2-1" },
      { label: "C1", key: "dead_bug", name: "Dead Bugs", sets: 2, reps: "8/side", rest: "60s", tempo: "3-1-3" },
      { label: "C2", key: "pelvic_tilt", name: "Standing Pelvic Tilts", sets: 2, reps: "15", rest: "60s", tempo: "2-0-2" },
    ],
  },
  B: {
    name: "Day B — Hypertrophy",
    day: "Wednesday",
    rep_info: "Rep range 10-15 | Rest 90s-2 min",
    exercises: [
      { label: "A1", key: "cable_pull_through", name: "Cable Pull-Through", sets: 3, reps: "12", rest: "90s", tempo: "2-2-1" },
      { label: "A2", key: "walking_lunge", name: "DB Walking Lunges", sets: 3, reps: "10/leg", rest: "90s", tempo: "2-0-1" },
      { label: "B1", key: "leg_press", name: "Leg Press (High/Wide Feet)", sets: 3, reps: "12", rest: "90s", tempo: "3-0-1" },
      { label: "B2", key: "fire_hydrant", name: "Banded Fire Hydrants", sets: 2, reps: "12/side", rest: "60s", tempo: "1-2-1" },
      { label: "C1", key: "pallof_press", name: "Pallof Press", sets: 2, reps: "10/side", rest: "60s", tempo: "1-3-1" },
      { label: "C2", key: "cat_cow", name: "Cat-Cow Pelvic Circles", sets: 2, reps: "10 each way", rest: "60s", tempo: "Slow" },
    ],
  },
  C: {
    name: "Day C — Endurance",
    day: "Friday",
    rep_info: "Rep range 15-25 | Rest 45-90s",
    exercises: [
      { label: "A1", key: "single_leg_bridge", name: "Single-Leg Glute Bridge", sets: 3, reps: "15/side", rest: "60s", tempo: "1-2-1" },
      { label: "A2", key: "step_up", name: "DB Step-Ups", sets: 3, reps: "12/leg", rest: "60s", tempo: "2-0-1" },
      { label: "B1", key: "frog_pump", name: "Frog Pumps", sets: 3, reps: "20", rest: "45s", tempo: "1-1-1" },
      { label: "B2", key: "hip_adduction", name: "Cable Hip Adduction", sets: 2, reps: "15/side", rest: "60s", tempo: "2-1-2" },
      { label: "C1", key: "bird_dog", name: "Bird Dogs", sets: 2, reps: "10/side", rest: "60s", tempo: "2-3-2" },
      { label: "C2", key: "pelvic_tilt_speed", name: "Pelvic Tilt Speed Drill", sets: 2, reps: "20", rest: "45s", tempo: "Fast" },
    ],
  },
};

const PHASE_2 = {
  A: {
    name: "Day A — Strength",
    day: "Monday",
    rep_info: "Rep range 6-8 | Rest 2.5-3 min",
    exercises: [
      { label: "A1", key: "hip_thrust", name: "Barbell Hip Thrust (Heavy)", sets: 4, reps: "8", rest: "2.5 min", tempo: "2-2-1" },
      { label: "A2", key: "sumo_deadlift", name: "Sumo Deadlift", sets: 3, reps: "6", rest: "2.5 min", tempo: "1-0-2" },
      { label: "B1", key: "bulgarian_squat", name: "Bulgarian Split Squat (DB)", sets: 3, reps: "10/leg", rest: "90s", tempo: "2-1-1" },
      { label: "B2", key: "leg_curl", name: "Lying Leg Curls", sets: 3, reps: "10", rest: "90s", tempo: "3-1-1" },
      { label: "C1", key: "side_plank", name: "Side Plank + Hip Abduction", sets: 2, reps: "10/side", rest: "60s", tempo: "1-2-1" },
      { label: "C2", key: "dead_bug", name: "Dead Bugs (Progressed)", sets: 3, reps: "10/side", rest: "60s", tempo: "3-1-3" },
    ],
  },
  B: {
    name: "Day B — Hypertrophy",
    day: "Wednesday",
    rep_info: "Rep range 10-12 | Rest 90s-2 min",
    exercises: [
      { label: "A1", key: "barbell_rdl", name: "Barbell Romanian Deadlift", sets: 4, reps: "10", rest: "2 min", tempo: "3-0-1" },
      { label: "A2", key: "leg_press", name: "Leg Press (Wide/High)", sets: 3, reps: "12", rest: "90s", tempo: "3-1-1" },
      { label: "B1", key: "cable_kickback", name: "Cable Kickbacks", sets: 3, reps: "12/side", rest: "60s", tempo: "1-2-2" },
      { label: "B2", key: "hip_adduction", name: "Cable Hip Adduction", sets: 3, reps: "12/side", rest: "60s", tempo: "2-1-2" },
      { label: "C1", key: "half_kneeling_pallof", name: "Half-Kneeling Pallof", sets: 3, reps: "10/side", rest: "60s", tempo: "1-3-1" },
      { label: "C2", key: "cable_hip_flexion", name: "Cable Standing Hip Flexion", sets: 2, reps: "12/side", rest: "60s", tempo: "2-1-2" },
    ],
  },
  C: {
    name: "Day C — Metabolic",
    day: "Friday",
    rep_info: "Rep range 15-25 | Rest 45-75s",
    exercises: [
      { label: "A1", key: "sumo_squat", name: "Goblet Sumo Squat (Tempo)", sets: 3, reps: "15", rest: "60s", tempo: "4-2-1" },
      { label: "A2", key: "single_leg_hip_thrust", name: "Single-Leg Hip Thrust", sets: 3, reps: "12/side", rest: "60s", tempo: "2-2-1" },
      { label: "B1", key: "walking_lunge", name: "DB Walking Lunges", sets: 3, reps: "12/leg", rest: "60s", tempo: "2-0-1" },
      { label: "B2", key: "frog_pump", name: "Frog Pumps", sets: 3, reps: "25", rest: "45s", tempo: "1-1-1" },
      { label: "C1", key: "tri_set", name: "Banded Tri-Set", sets: 2, reps: "rounds", rest: "45s", tempo: "1-1-1" },
      { label: "C2", key: "pelvic_complex", name: "Pelvic Tilt + Circle Complex", sets: 2, reps: "full seq", rest: "45s", tempo: "Rhythmic" },
    ],
  },
};

const PHASE_3 = {
  A: {
    name: "Day A — Strength",
    day: "Monday",
    rep_info: "Rep range 5-8 | Rest 3 min",
    exercises: [
      { label: "A1", key: "hip_thrust", name: "Barbell Hip Thrust (PR Weight)", sets: 5, reps: "6", rest: "3 min", tempo: "1-2-1" },
      { label: "A2", key: "sumo_deadlift", name: "Sumo Deadlift", sets: 4, reps: "5", rest: "3 min", tempo: "1-1-2" },
      { label: "B1", key: "bulgarian_squat", name: "Bulgarian Split Squat (Paused)", sets: 3, reps: "8/leg", rest: "2 min", tempo: "2-2-1" },
      { label: "B2", key: "leg_curl", name: "Lying Leg Curls (Slow Eccentric)", sets: 3, reps: "8", rest: "90s", tempo: "4-1-1" },
      { label: "C1", key: "dead_bug", name: "Dead Bugs (Weighted)", sets: 3, reps: "10/side", rest: "60s", tempo: "3-1-3" },
      { label: "C2", key: "pallof_rotation", name: "Pallof Press + Rotation", sets: 2, reps: "8/side", rest: "60s", tempo: "1-3-1" },
    ],
  },
  B: {
    name: "Day B — Hypertrophy",
    day: "Wednesday",
    rep_info: "Rep range 8-10 | Rest 2 min",
    exercises: [
      { label: "A1", key: "barbell_rdl", name: "Barbell RDL (Heavy)", sets: 4, reps: "8", rest: "2 min", tempo: "3-0-1" },
      { label: "A2", key: "leg_press", name: "Leg Press (Tempo)", sets: 4, reps: "10", rest: "90s", tempo: "4-1-1" },
      { label: "B1", key: "single_leg_rdl", name: "Single-Leg Romanian Deadlift", sets: 3, reps: "10/leg", rest: "90s", tempo: "3-0-1" },
      { label: "B2", key: "cable_kickback", name: "Cable Kickbacks (Heavy)", sets: 3, reps: "10/side", rest: "60s", tempo: "1-2-2" },
      { label: "C1", key: "hip_adduction", name: "Cable Hip Adduction (Heavy)", sets: 3, reps: "10/side", rest: "60s", tempo: "2-2-2" },
      { label: "C2", key: "side_plank", name: "Side Plank Abduction", sets: 3, reps: "12/side", rest: "60s", tempo: "1-2-1" },
    ],
  },
  C: {
    name: "Day C — Dance Prep",
    day: "Friday",
    rep_info: "Rep range 12-30 | Rest 45-75s",
    exercises: [
      { label: "A1", key: "sumo_15rep", name: "Goblet Sumo Squat (1.5-Rep)", sets: 3, reps: "12", rest: "75s", tempo: "2-0-1" },
      { label: "A2", key: "single_leg_hip_thrust", name: "Single-Leg Hip Thrust (Weighted)", sets: 3, reps: "10/side", rest: "60s", tempo: "2-2-1" },
      { label: "B1", key: "walking_lunge", name: "DB Walking Lunges (Long Step)", sets: 3, reps: "12/leg", rest: "60s", tempo: "2-0-1" },
      { label: "B2", key: "frog_pump", name: "Frog Pumps (Resisted)", sets: 3, reps: "30", rest: "45s", tempo: "Fast" },
      { label: "C1", key: "tri_set", name: "Banded Tri-Set", sets: 2, reps: "rounds", rest: "45s", tempo: "1-1-1" },
      { label: "C2", key: "pelvic_complex", name: "Full Pelvic Isolation Complex", sets: 2, reps: "full seq", rest: "30s", tempo: "Rhythmic" },
    ],
  },
};

// Map each week to its phase template + progression note
const WEEKS = {
  1: { phase: "Foundation", phaseNum: 1, template: PHASE_1, note: "Learn movements. RIR 4. Focus entirely on form and mind-muscle connection.", loadPct: 60 },
  2: { phase: "Foundation", phaseNum: 1, template: PHASE_1, note: "Add 2.5-5 lbs to compounds. Add 1-2 reps to isolation.", loadPct: 65 },
  3: { phase: "Foundation", phaseNum: 1, template: PHASE_1, note: "Add 2.5-5 lbs. Add 1 set to A1 and A2 on each day.", loadPct: 70 },
  4: { phase: "Foundation", phaseNum: 1, template: PHASE_1, note: "Final push. RIR 2. Hit top of all prescribed rep ranges.", loadPct: 75 },
  5: { phase: "Build", phaseNum: 2, template: PHASE_2, note: "Reset RIR to 3. Loads ~5% heavier than Week 4 peaks.", loadPct: 70 },
  6: { phase: "Build", phaseNum: 2, template: PHASE_2, note: "Add 2.5-5 lbs. Add 1 rep to isolation.", loadPct: 75 },
  7: { phase: "Build", phaseNum: 2, template: PHASE_2, note: "Add 2.5-5 lbs. Add 1 set to A1 on Day A and Day B. RIR 1-2.", loadPct: 80 },
  8: { phase: "Build", phaseNum: 2, template: PHASE_2, note: "Monday hard. Wed/Fri mini-deload: 2 sets accessories, 10% less load.", loadPct: 75 },
  9: { phase: "Performance", phaseNum: 3, template: PHASE_3, note: "Reset RIR to 2. Loads ~5% above Week 7 peaks.", loadPct: 80 },
  10: { phase: "Performance", phaseNum: 3, template: PHASE_3, note: "Add 2.5-5 lbs. Push RIR to 1. Highest weekly volume.", loadPct: 85 },
  11: { phase: "Performance", phaseNum: 3, template: PHASE_3, note: "PEAK WEEK. Attempt PR reps. RIR 0 on key compounds.", loadPct: 95 },
  12: { phase: "Deload", phaseNum: 3, template: PHASE_3, note: "FULL DELOAD. All loads cut 40-50%. 2 sets per exercise. RIR 5+. Focus on movement quality.", loadPct: 50 },
};

// ═══════════════════════════════════════════════════════════════════════════
// AVATAR ICONS (simplified SVG silhouettes)
// ═══════════════════════════════════════════════════════════════════════════
const Avatar = ({ exerciseKey, size = 40 }) => {
  // A simple unified silhouette — the icon is mainly decorative here
  const style = { width: size, height: size };
  return (
    <svg viewBox="0 0 48 48" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="12" r="5" fill="#C4705A"/>
      <rect x="18" y="17" width="12" height="18" rx="3" fill="#C4705A"/>
      <rect x="14" y="34" width="6" height="10" rx="2" fill="#C4705A"/>
      <rect x="28" y="34" width="6" height="10" rx="2" fill="#C4705A"/>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const STORAGE_KEY = "nani-knees-workout-data";

async function loadData() {
  try {
    const value = localStorage.getItem(STORAGE_KEY); const result = value ? { value } : null;
    if (result && result.value) return JSON.parse(result.value);
  } catch (e) {}
  return {
    currentWeek: 1,
    completedWorkouts: {}, // { "w1-A": { date, sets: {...}, notes } }
    exerciseLog: {}, // per-exercise best weights/reps history
    settings: { restBeepEnabled: true },
  };
}

async function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed", e);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const phaseColor = (phaseNum) => {
  if (phaseNum === 1) return PALETTE.terracotta;
  if (phaseNum === 2) return PALETTE.terracottaDark;
  return PALETTE.terracottaDeep;
};

const weekIsDeload = (w) => w === 12;

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ═══════════════════════════════════════════════════════════════════════════
// REST TIMER (modal)
// ═══════════════════════════════════════════════════════════════════════════
const RestTimer = ({ seconds, onClose, onComplete }) => {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      onComplete && onComplete();
      return;
    }
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining, onComplete]);

  const progress = 1 - remaining / seconds;
  const r = 90;
  const circ = 2 * Math.PI * r;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28, 20, 16, 0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(12px)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: PALETTE.cream,
          borderRadius: 32,
          padding: "36px 28px",
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
          boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: PALETTE.mocha,
            marginBottom: 6,
          }}
        >
          REST TIMER
        </div>
        <div style={{ position: "relative", width: 220, height: 220, margin: "12px auto 16px" }}>
          <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="110" cy="110" r={r} fill="none" stroke={PALETTE.sand} strokeWidth="14" />
            <circle
              cx="110"
              cy="110"
              r={r}
              fill="none"
              stroke={PALETTE.terracotta}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * progress}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: PALETTE.ink,
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              {fmt(remaining)}
            </div>
            <div
              style={{
                fontSize: 11,
                color: PALETTE.mocha,
                marginTop: -4,
                letterSpacing: "0.1em",
              }}
            >
              {running ? "RESTING" : "PAUSED"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
          <button
            onClick={() => setRemaining((r) => Math.max(0, r - 15))}
            style={btnStyle(PALETTE.sand, PALETTE.mocha, 52, 52)}
          >
            -15
          </button>
          <button
            onClick={() => setRunning(!running)}
            style={btnStyle(PALETTE.terracotta, "#fff", 64, 64)}
          >
            {running ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            onClick={() => setRemaining((r) => r + 15)}
            style={btnStyle(PALETTE.sand, PALETTE.mocha, 52, 52)}
          >
            +15
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 18,
            width: "100%",
            padding: "14px",
            borderRadius: 16,
            border: "none",
            background: "transparent",
            color: PALETTE.mocha,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.05em",
            cursor: "pointer",
          }}
        >
          SKIP REST
        </button>
      </div>
    </div>
  );
};

const btnStyle = (bg, color, w, h) => ({
  width: w,
  height: h,
  borderRadius: "50%",
  border: "none",
  background: bg,
  color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
});

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE CARD (expandable)
// ═══════════════════════════════════════════════════════════════════════════
const ExerciseCard = ({ ex, weekKey, dayKey, setsState, onSetComplete, onStartRest, onShowDetails }) => {
  const completed = setsState.filter((s) => s.done).length;
  const total = ex.sets;
  const pct = (completed / total) * 100;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        marginBottom: 14,
        overflow: "hidden",
        border: `1px solid ${PALETTE.sand}`,
        boxShadow: completed === total ? `0 0 0 2px ${PALETTE.green}` : "0 2px 8px rgba(28,20,16,0.04)",
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Header row */}
      <div
        onClick={onShowDetails}
        style={{
          padding: "14px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            minWidth: 36,
            height: 36,
            borderRadius: 12,
            background: completed === total ? PALETTE.green : PALETTE.terracotta,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {completed === total ? <Check size={18} /> : ex.label}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: PALETTE.ink,
              marginBottom: 2,
              letterSpacing: "-0.01em",
            }}
          >
            {ex.name}
          </div>
          <div style={{ fontSize: 11, color: PALETTE.mocha, letterSpacing: "0.03em" }}>
            {ex.sets} × {ex.reps} · rest {ex.rest} · tempo {ex.tempo}
          </div>
        </div>
        <BookOpen size={16} color={PALETTE.mocha} style={{ opacity: 0.5 }} />
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: PALETTE.sand, position: "relative" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: completed === total ? PALETTE.green : PALETTE.terracotta,
            transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      {/* Set rows */}
      <div style={{ padding: "12px 12px 14px" }}>
        {setsState.map((set, i) => (
          <SetRow
            key={i}
            setNum={i + 1}
            set={set}
            exercise={ex}
            onComplete={(weight, reps) => {
              onSetComplete(i, weight, reps);
              // only start rest if not the last set
              if (i < setsState.length - 1 && ex.rest !== "—") {
                onStartRest(ex.rest);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SET ROW (individual set input)
// ═══════════════════════════════════════════════════════════════════════════
const parseRest = (r) => {
  if (!r || r === "—") return 0;
  if (r.includes("min")) {
    // e.g. "2 min", "2.5 min"
    const n = parseFloat(r);
    return Math.round(n * 60);
  }
  if (r.includes("s")) {
    return parseInt(r);
  }
  return 60;
};

const SetRow = ({ setNum, set, exercise, onComplete }) => {
  const [weight, setWeight] = useState(set.weight || "");
  const [reps, setReps] = useState(set.reps || "");

  const isBodyweight = exercise.reps.toLowerCase().includes("sec") || exercise.tempo === "Hold" || exercise.tempo === "Rhythmic";
  const handleComplete = () => {
    onComplete(weight, reps);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 6px",
        borderRadius: 10,
        background: set.done ? PALETTE.greenSoft : "transparent",
        marginBottom: 4,
        transition: "background 0.25s",
      }}
    >
      <div
        style={{
          minWidth: 26,
          height: 26,
          borderRadius: 8,
          background: set.done ? PALETTE.green : PALETTE.sand,
          color: set.done ? "#fff" : PALETTE.mocha,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {setNum}
      </div>

      {!isBodyweight && (
        <input
          type="text"
          inputMode="decimal"
          placeholder="lbs"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={set.done}
          style={inputStyle(set.done, 70)}
        />
      )}

      <input
        type="text"
        inputMode="numeric"
        placeholder={exercise.reps}
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        disabled={set.done}
        style={inputStyle(set.done, isBodyweight ? 120 : 70)}
      />

      <div style={{ flex: 1 }} />

      <button
        onClick={handleComplete}
        disabled={set.done}
        style={{
          padding: "8px 14px",
          borderRadius: 10,
          border: "none",
          background: set.done ? PALETTE.green : PALETTE.terracotta,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.05em",
          cursor: set.done ? "default" : "pointer",
          minWidth: 60,
          opacity: set.done ? 0.8 : 1,
        }}
      >
        {set.done ? <Check size={14} /> : "DONE"}
      </button>
    </div>
  );
};

const inputStyle = (done, width) => ({
  width,
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${done ? PALETTE.greenSoft : PALETTE.sand}`,
  background: done ? "transparent" : "#fff",
  fontSize: 14,
  fontWeight: 600,
  color: PALETTE.ink,
  fontFamily: "inherit",
  outline: "none",
  textAlign: "center",
});

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE DETAILS MODAL
// ═══════════════════════════════════════════════════════════════════════════
const DetailsModal = ({ exercise, onClose }) => {
  if (!exercise) return null;
  const instr = INSTRUCTIONS[exercise.key];
  if (!instr) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28, 20, 16, 0.65)",
        zIndex: 90,
        display: "flex",
        alignItems: "flex-end",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: PALETTE.cream,
          width: "100%",
          maxHeight: "92vh",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflowY: "auto",
          animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        {/* Grip handle */}
        <div style={{ padding: "12px 0 4px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: PALETTE.sand }} />
        </div>

        {/* Header */}
        <div style={{ padding: "16px 24px 14px", borderBottom: `1px solid ${PALETTE.sand}` }}>
          <div
            style={{
              fontSize: 10,
              color: PALETTE.terracotta,
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: 4,
            }}
          >
            {exercise.label} · {exercise.sets} × {exercise.reps}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: PALETTE.ink, letterSpacing: "-0.02em" }}>
            {exercise.name}
          </div>
          <div style={{ fontSize: 12, color: PALETTE.mocha, marginTop: 4 }}>
            Rest {exercise.rest} · Tempo {exercise.tempo}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 100px" }}>
          <DetailSection title="SETUP" color={PALETTE.terracotta}>
            <p style={detailP}>{instr.setup}</p>
          </DetailSection>

          <DetailSection title="EXECUTION" color={PALETTE.terracotta}>
            <ol style={{ margin: 0, paddingLeft: 22 }}>
              {instr.execution.map((step, i) => (
                <li key={i} style={detailP}>{step}</li>
              ))}
            </ol>
          </DetailSection>

          <DetailSection title="FORM CUES" color={PALETTE.green}>
            {instr.cues.map((cue, i) => (
              <div key={i} style={{ ...detailP, display: "flex", gap: 8 }}>
                <span style={{ color: PALETTE.green, fontWeight: 800 }}>✓</span>
                <span>{cue}</span>
              </div>
            ))}
          </DetailSection>

          <DetailSection title="COMMON MISTAKES" color={PALETTE.red}>
            {instr.mistakes.map((m, i) => (
              <div key={i} style={{ ...detailP, display: "flex", gap: 8 }}>
                <span style={{ color: PALETTE.red, fontWeight: 800 }}>✗</span>
                <span>{m}</span>
              </div>
            ))}
          </DetailSection>

          <DetailSection title="BREATHING" color={PALETTE.mocha}>
            <p style={{ ...detailP, fontStyle: "italic" }}>{instr.breathing}</p>
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

const detailP = { fontSize: 14, lineHeight: 1.55, color: PALETTE.ink, margin: "0 0 10px", fontWeight: 400 };
const DetailSection = ({ title, color, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.15em",
        color,
        marginBottom: 10,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// WORKOUT VIEW
// ═══════════════════════════════════════════════════════════════════════════
const WorkoutView = ({ week, dayKey, workoutData, onUpdateSets, onBack }) => {
  const weekInfo = WEEKS[week];
  const day = weekInfo.template[dayKey];
  const workoutKey = `w${week}-${dayKey}`;
  const state = workoutData[workoutKey] || { sets: {}, started: Date.now() };

  const [detailsOpen, setDetailsOpen] = useState(null);
  const [restSeconds, setRestSeconds] = useState(null);

  // Build sets-state for a given exercise
  const setsFor = (ex) => {
    const arr = state.sets[ex.key] || [];
    const needed = ex.sets;
    const padded = [...arr];
    while (padded.length < needed) padded.push({ done: false, weight: "", reps: "" });
    return padded;
  };

  const handleSetComplete = (exKey, setIdx, weight, reps) => {
    const current = state.sets[exKey] || [];
    const newSets = [...current];
    while (newSets.length <= setIdx) newSets.push({ done: false, weight: "", reps: "" });
    newSets[setIdx] = { done: true, weight, reps };
    const newState = {
      ...state,
      sets: { ...state.sets, [exKey]: newSets },
    };
    onUpdateSets(workoutKey, newState);
  };

  // Compute completion
  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const doneSets = day.exercises.reduce((sum, ex) => {
    const sets = state.sets[ex.key] || [];
    return sum + sets.filter((s) => s.done).length;
  }, 0);
  const pct = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;
  const allDone = doneSets === totalSets;

  const finishWorkout = () => {
    const newState = { ...state, completed: true, completedAt: Date.now() };
    onUpdateSets(workoutKey, newState);
    onBack();
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div
        style={{
          background: phaseColor(weekInfo.phaseNum),
          color: "#fff",
          padding: "20px 20px 28px",
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          position: "relative",
        }}
      >
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 20,
            left: 18,
            background: "rgba(255,255,255,0.2)",
            border: "none",
            width: 36,
            height: 36,
            borderRadius: 12,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{ marginLeft: 52 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.85, fontWeight: 700 }}>
            WEEK {week} · {weekInfo.phase.toUpperCase()}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2, letterSpacing: "-0.02em" }}>
            {day.name}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{day.rep_info}</div>
        </div>

        {/* Progress ring/bar */}
        <div
          style={{
            marginTop: 18,
            background: "rgba(255,255,255,0.18)",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, opacity: 0.85, letterSpacing: "0.1em", marginBottom: 4 }}>PROGRESS</div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "#fff",
                  borderRadius: 3,
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {doneSets}/{totalSets}
          </div>
        </div>
      </div>

      {/* Week load note */}
      <div
        style={{
          margin: "16px 16px 6px",
          padding: "12px 14px",
          background: PALETTE.sand,
          borderRadius: 14,
          borderLeft: `4px solid ${phaseColor(weekInfo.phaseNum)}`,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: PALETTE.terracotta, marginBottom: 3 }}>
          WEEK {week} PROGRESSION
        </div>
        <div style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.45 }}>{weekInfo.note}</div>
      </div>

      {/* Warm-up */}
      <SectionHeader label="WARM-UP" color={PALETTE.gold} />
      <div style={{ padding: "0 14px" }}>
        {WARMUP.map((ex) => {
          const sets = setsFor(ex);
          return (
            <ExerciseCard
              key={ex.key}
              ex={{ ...ex, label: "W" }}
              weekKey={week}
              dayKey={dayKey}
              setsState={sets}
              onSetComplete={(i, w, r) => handleSetComplete(ex.key, i, w, r)}
              onStartRest={(rest) => setRestSeconds(parseRest(rest))}
              onShowDetails={() => setDetailsOpen(ex)}
            />
          );
        })}
      </div>

      {/* Main workout */}
      <SectionHeader label="MAIN WORKOUT" color={phaseColor(weekInfo.phaseNum)} />
      <div style={{ padding: "0 14px" }}>
        {day.exercises.map((ex) => {
          const sets = setsFor(ex);
          return (
            <ExerciseCard
              key={ex.key}
              ex={ex}
              weekKey={week}
              dayKey={dayKey}
              setsState={sets}
              onSetComplete={(i, w, r) => handleSetComplete(ex.key, i, w, r)}
              onStartRest={(rest) => setRestSeconds(parseRest(rest))}
              onShowDetails={() => setDetailsOpen(ex)}
            />
          );
        })}
      </div>

      {/* Cool-down */}
      <SectionHeader label="COOL-DOWN" color={PALETTE.green} />
      <div style={{ padding: "0 14px" }}>
        {COOLDOWN.map((ex) => {
          const sets = setsFor(ex);
          return (
            <ExerciseCard
              key={ex.key}
              ex={{ ...ex, label: "S" }}
              weekKey={week}
              dayKey={dayKey}
              setsState={sets}
              onSetComplete={(i, w, r) => handleSetComplete(ex.key, i, w, r)}
              onStartRest={(rest) => setRestSeconds(parseRest(rest))}
              onShowDetails={() => setDetailsOpen(ex)}
            />
          );
        })}
      </div>

      {/* Finish button */}
      {allDone && (
        <div style={{ padding: "16px 14px 40px" }}>
          <button
            onClick={finishWorkout}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: PALETTE.green,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              boxShadow: `0 8px 20px ${PALETTE.green}55`,
            }}
          >
            FINISH WORKOUT 🎉
          </button>
        </div>
      )}

      {restSeconds !== null && (
        <RestTimer
          seconds={restSeconds}
          onClose={() => setRestSeconds(null)}
          onComplete={() => {
            // Play a small sound? For now, just close
            // setTimeout(() => setRestSeconds(null), 500);
          }}
        />
      )}

      {detailsOpen && (
        <DetailsModal
          exercise={detailsOpen}
          onClose={() => setDetailsOpen(null)}
        />
      )}
    </div>
  );
};

const SectionHeader = ({ label, color }) => (
  <div
    style={{
      padding: "22px 20px 10px",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.2em",
      color,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div style={{ height: 1, flex: 0, width: 20, background: color }} />
    {label}
    <div style={{ height: 1, flex: 1, background: `${color}33` }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// WEEK SELECTOR (home view)
// ═══════════════════════════════════════════════════════════════════════════
const WeekSelector = ({ currentWeek, completedWorkouts, onSelectDay, onSelectWeek }) => {
  const weekInfo = WEEKS[currentWeek];
  const workoutStatus = (week, dayKey) => {
    const key = `w${week}-${dayKey}`;
    const state = completedWorkouts[key];
    if (!state) return "none";
    if (state.completed) return "done";
    // Partial
    const total = Object.values(state.sets || {}).reduce((s, arr) => s + arr.length, 0);
    return total > 0 ? "partial" : "none";
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero header */}
      <div
        style={{
          background: `linear-gradient(140deg, ${PALETTE.blush} 0%, ${PALETTE.blushSoft} 55%, ${PALETTE.cream} 100%)`,
          padding: "32px 22px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${PALETTE.terracotta}22 0%, transparent 70%)`,
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: PALETTE.terracottaDark,
              marginBottom: 6,
            }}
          >
            NANI'S KNEES
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: PALETTE.ink,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontFamily: "'Georgia', serif",
            }}
          >
            Strength
            <br />
            Blueprint
          </div>
          <div style={{ fontSize: 13, color: PALETTE.mocha, marginTop: 10, fontStyle: "italic" }}>
            12 weeks. 3 phases. One unstoppable body.
          </div>
        </div>
      </div>

      {/* Week tab strip */}
      <div style={{ padding: "20px 14px 6px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: PALETTE.mocha,
            marginBottom: 10,
            padding: "0 6px",
          }}
        >
          JUMP TO WEEK
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 6,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => {
            const active = w === currentWeek;
            const info = WEEKS[w];
            const col = phaseColor(info.phaseNum);
            const isDl = weekIsDeload(w);
            return (
              <button
                key={w}
                onClick={() => onSelectWeek(w)}
                style={{
                  padding: "10px 4px",
                  borderRadius: 12,
                  border: `1.5px solid ${isDl ? PALETTE.gold : col}`,
                  background: active ? (isDl ? PALETTE.gold : col) : PALETTE.cream,
                  color: active ? "#fff" : isDl ? PALETTE.gold : col,
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  letterSpacing: "-0.02em",
                }}
              >
                {w}
                {active && (
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      marginTop: 2,
                    }}
                  >
                    NOW
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            marginTop: 14,
            fontSize: 10,
            fontWeight: 600,
            color: PALETTE.mocha,
          }}
        >
          <Legend color={PALETTE.terracotta} label="FOUNDATION" />
          <Legend color={PALETTE.terracottaDark} label="BUILD" />
          <Legend color={PALETTE.terracottaDeep} label="PERFORMANCE" />
          <Legend color={PALETTE.gold} label="DELOAD" />
        </div>
      </div>

      {/* Current week card */}
      <div style={{ padding: "20px 14px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: "22px 20px",
            boxShadow: `0 8px 24px ${phaseColor(weekInfo.phaseNum)}18`,
            border: `1px solid ${PALETTE.sand}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 5,
              height: "100%",
              background: phaseColor(weekInfo.phaseNum),
            }}
          />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: phaseColor(weekInfo.phaseNum),
                }}
              >
                PHASE {weekInfo.phaseNum} · {weekInfo.phase.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: PALETTE.ink,
                  letterSpacing: "-0.02em",
                  marginTop: 3,
                }}
              >
                Week {currentWeek}
              </div>
            </div>
            <div
              style={{
                background: PALETTE.sand,
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: PALETTE.mocha,
                letterSpacing: "0.05em",
              }}
            >
              {weekInfo.loadPct}% load
            </div>
          </div>
          <div style={{ fontSize: 13, color: PALETTE.mocha, lineHeight: 1.5, marginBottom: 16 }}>
            {weekInfo.note}
          </div>

          {/* Day buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["A", "B", "C"].map((dk) => {
              const d = weekInfo.template[dk];
              const status = workoutStatus(currentWeek, dk);
              return (
                <button
                  key={dk}
                  onClick={() => onSelectDay(dk)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "none",
                    background: status === "done" ? PALETTE.greenSoft : PALETTE.sand,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "transform 0.15s",
                  }}
                  onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background:
                        status === "done"
                          ? PALETTE.green
                          : status === "partial"
                          ? PALETTE.gold
                          : phaseColor(weekInfo.phaseNum),
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {status === "done" ? <Check size={20} /> : dk}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: PALETTE.ink, letterSpacing: "-0.01em" }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: 12, color: PALETTE.mocha, marginTop: 2 }}>
                      {d.day} · {d.rep_info}
                    </div>
                  </div>
                  <ChevronRight size={18} color={PALETTE.mocha} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div
        style={{
          padding: "0 20px 30px",
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <button
          onClick={() => onSelectWeek(Math.max(1, currentWeek - 1))}
          disabled={currentWeek === 1}
          style={navBtn(currentWeek === 1)}
        >
          <ChevronLeft size={16} /> Week {Math.max(1, currentWeek - 1)}
        </button>
        <button
          onClick={() => onSelectWeek(Math.min(12, currentWeek + 1))}
          disabled={currentWeek === 12}
          style={navBtn(currentWeek === 12)}
        >
          Week {Math.min(12, currentWeek + 1)} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const navBtn = (disabled) => ({
  flex: 1,
  padding: "12px 14px",
  borderRadius: 14,
  border: `1px solid ${PALETTE.sand}`,
  background: disabled ? "transparent" : "#fff",
  color: disabled ? PALETTE.mocha : PALETTE.ink,
  fontSize: 13,
  fontWeight: 600,
  cursor: disabled ? "default" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  opacity: disabled ? 0.4 : 1,
});

const Legend = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
    <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
    {label}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS / STATS VIEW
// ═══════════════════════════════════════════════════════════════════════════
const ProgressView = ({ completedWorkouts, currentWeek, onClose }) => {
  const stats = useMemo(() => {
    const entries = Object.entries(completedWorkouts);
    const total = entries.filter(([, v]) => v.completed).length;
    const weeksStarted = new Set(entries.map(([k]) => k.split("-")[0])).size;
    // Count sets completed ever
    let totalSets = 0;
    let volumeLbs = 0;
    entries.forEach(([, v]) => {
      Object.values(v.sets || {}).forEach((arr) => {
        arr.forEach((s) => {
          if (s.done) {
            totalSets++;
            const w = parseFloat(s.weight) || 0;
            const r = parseInt(s.reps) || 0;
            volumeLbs += w * r;
          }
        });
      });
    });
    // Calculate streak (simple)
    const sortedDates = entries
      .filter(([, v]) => v.completedAt)
      .map(([, v]) => new Date(v.completedAt))
      .sort((a, b) => b - a);
    let streak = 0;
    if (sortedDates.length > 0) {
      const today = new Date();
      const diff = (today - sortedDates[0]) / (1000 * 60 * 60 * 24);
      if (diff < 3) streak = sortedDates.length;
    }
    return { total, weeksStarted, totalSets, volumeLbs: Math.round(volumeLbs), streak };
  }, [completedWorkouts]);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        style={{
          background: `linear-gradient(140deg, ${PALETTE.terracotta} 0%, ${PALETTE.terracottaDark} 100%)`,
          color: "#fff",
          padding: "40px 24px 30px",
          position: "relative",
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: "0.25em", opacity: 0.85, fontWeight: 700 }}>
          YOUR JOURNEY
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, marginTop: 4, letterSpacing: "-0.03em" }}>
          Progress
        </div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>
          Currently on Week {currentWeek} of 12
        </div>

        {/* Big stat */}
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <StatPill icon={<Flame size={14} />} label="STREAK" value={stats.streak} unit="" />
          <StatPill icon={<Award size={14} />} label="DONE" value={stats.total} unit="workouts" />
        </div>
      </div>

      <div style={{ padding: "20px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <BigStat label="TOTAL SETS" value={stats.totalSets} color={PALETTE.terracotta} icon={<Dumbbell size={18} />} />
          <BigStat label="VOLUME" value={stats.volumeLbs.toLocaleString()} unit="lbs" color={PALETTE.terracottaDark} icon={<TrendingUp size={18} />} />
        </div>

        {/* Week grid */}
        <div
          style={{
            marginTop: 22,
            background: "#fff",
            borderRadius: 20,
            padding: "18px",
            border: `1px solid ${PALETTE.sand}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: PALETTE.mocha,
              marginBottom: 12,
            }}
          >
            WEEK-BY-WEEK
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => {
              const days = ["A", "B", "C"];
              const dayStatuses = days.map((d) => {
                const k = `w${w}-${d}`;
                return completedWorkouts[k]?.completed ? "done" : "none";
              });
              const doneCount = dayStatuses.filter((s) => s === "done").length;
              const info = WEEKS[w];
              return (
                <div
                  key={w}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 6px",
                    borderRadius: 10,
                    background: w === currentWeek ? PALETTE.blushSoft : "transparent",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: phaseColor(info.phaseNum),
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {w}
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.mocha, flex: 1, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {info.phase}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {dayStatuses.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: s === "done" ? PALETTE.green : PALETTE.sand,
                          color: s === "done" ? "#fff" : PALETTE.mocha,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {s === "done" ? <Check size={12} /> : days[i]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ icon, label, value, unit }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.18)",
      borderRadius: 14,
      padding: "10px 14px",
      backdropFilter: "blur(12px)",
      flex: 1,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, letterSpacing: "0.2em", opacity: 0.85, fontWeight: 700 }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, letterSpacing: "-0.02em" }}>
      {value}
      {unit && <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, marginLeft: 4 }}>{unit}</span>}
    </div>
  </div>
);

const BigStat = ({ label, value, unit, color, icon }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 18,
      padding: "16px",
      border: `1px solid ${PALETTE.sand}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 6, color, marginBottom: 8 }}>
      {icon}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em" }}>{label}</div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: PALETTE.ink, letterSpacing: "-0.02em" }}>
      {value}
      {unit && <span style={{ fontSize: 12, color: PALETTE.mocha, fontWeight: 600, marginLeft: 4 }}>{unit}</span>}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS VIEW — reset data, view app info
// ═══════════════════════════════════════════════════════════════════════════
const SettingsView = ({ data, onResetProgress, onClearAll }) => {
  const [confirmType, setConfirmType] = useState(null); // 'progress' | 'all' | null

  const completedCount = Object.keys(data.completedWorkouts || {}).length;

  return (
    <div style={{ padding: "28px 22px 120px", maxWidth: 560, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: PALETTE.terracotta,
            marginBottom: 10,
          }}
        >
          SETTINGS
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            color: PALETTE.ink,
            lineHeight: 1.1,
          }}
        >
          Your <span style={{ color: PALETTE.terracotta }}>preferences</span>
        </div>
      </div>

      {/* Stats summary */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 20,
          marginBottom: 22,
          border: `1px solid ${PALETTE.sand}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: PALETTE.mocha,
            marginBottom: 12,
          }}
        >
          YOUR DATA
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: PALETTE.ink }}>
              {data.currentWeek}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: PALETTE.mocha,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Current Week
            </div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: PALETTE.ink }}>
              {completedCount}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: PALETTE.mocha,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Workouts Logged
            </div>
          </div>
        </div>
      </div>

      {/* Reset progress card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 20,
          marginBottom: 14,
          border: `1px solid ${PALETTE.sand}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              background: PALETTE.blushSoft,
              borderRadius: 10,
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RotateCcw size={18} color={PALETTE.terracottaDark} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: PALETTE.ink,
                marginBottom: 4,
              }}
            >
              Start Phase 1 over
            </div>
            <div style={{ fontSize: 13, color: PALETTE.mocha, lineHeight: 1.5 }}>
              Clears all logged workouts and sends you back to Week 1. Use this
              when you finish the 12 weeks and want to run the program again.
            </div>
          </div>
        </div>
        <button
          onClick={() => setConfirmType("progress")}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: PALETTE.cream,
            color: PALETTE.terracottaDark,
            border: `1px solid ${PALETTE.sand}`,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Restart from Week 1
        </button>
      </div>

      {/* Clear all data card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 20,
          marginBottom: 22,
          border: `1px solid ${PALETTE.sand}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              background: PALETTE.redSoft,
              borderRadius: 10,
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} color={PALETTE.red} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: PALETTE.ink,
                marginBottom: 4,
              }}
            >
              Clear all data
            </div>
            <div style={{ fontSize: 13, color: PALETTE.mocha, lineHeight: 1.5 }}>
              Wipes every set, every note, every setting from this device.
              This cannot be undone.
            </div>
          </div>
        </div>
        <button
          onClick={() => setConfirmType("all")}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "white",
            color: PALETTE.red,
            border: `1px solid ${PALETTE.redSoft}`,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Clear all data
        </button>
      </div>

      {/* About */}
      <div
        style={{
          padding: "16px 4px",
          textAlign: "center",
          fontSize: 11,
          color: PALETTE.mocha,
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontStyle: "italic", marginBottom: 4 }}>Nani's Knees</div>
        <div style={{ opacity: 0.6 }}>Your progress stays private on this device.</div>
      </div>

      {/* Confirm modal */}
      {confirmType && (
        <div
          onClick={() => setConfirmType(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28, 20, 16, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 28,
              maxWidth: 380,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: confirmType === "all" ? PALETTE.red : PALETTE.terracotta,
                marginBottom: 10,
              }}
            >
              {confirmType === "all" ? "CLEAR ALL DATA" : "RESTART PROGRAM"}
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 600,
                color: PALETTE.ink,
                marginBottom: 12,
                lineHeight: 1.3,
              }}
            >
              {confirmType === "all"
                ? "Are you sure? This can't be undone."
                : "Start Phase 1 from the beginning?"}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.mocha, lineHeight: 1.5, marginBottom: 22 }}>
              {confirmType === "all"
                ? "Every set, note, and setting will be wiped from this device. Your Whop subscription and ebook access are not affected."
                : `You'll lose ${completedCount} logged workout${
                    completedCount === 1 ? "" : "s"
                  } and go back to Week 1. Your notes will stay.`}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmType(null)}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: PALETTE.cream,
                  color: PALETTE.ink,
                  border: `1px solid ${PALETTE.sand}`,
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmType === "all") {
                    onClearAll();
                  } else {
                    onResetProgress();
                  }
                  setConfirmType(null);
                }}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: confirmType === "all" ? PALETTE.red : PALETTE.terracotta,
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {confirmType === "all" ? "Yes, wipe it" : "Restart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function NaniApp() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("home"); // home | workout | progress
  const [selectedDay, setSelectedDay] = useState(null); // 'A' | 'B' | 'C'
  const [tab, setTab] = useState("home"); // bottom nav tab

  useEffect(() => {
    loadData().then(setData);
  }, []);

  if (!data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: PALETTE.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: PALETTE.mocha, letterSpacing: "0.2em", fontSize: 11, fontWeight: 700 }}>LOADING...</div>
      </div>
    );
  }

  const updateData = (patch) => {
    const newData = { ...data, ...patch };
    setData(newData);
    saveData(newData);
  };

  const setCurrentWeek = (w) => updateData({ currentWeek: w });
  const updateSets = (workoutKey, state) => {
    const newCompleted = { ...data.completedWorkouts, [workoutKey]: state };
    updateData({ completedWorkouts: newCompleted });
  };

  // Reset back to week 1, clear workouts, keep everything else
  const resetProgress = () => {
    updateData({ currentWeek: 1, completedWorkouts: {} });
    setTab("home");
  };

  // Full wipe — remove all data and reload with fresh defaults
  const clearAllData = () => {
    try {
      localStorage.removeItem("nani-knees-workout-data");
    } catch (e) {}
    const fresh = {
      currentWeek: 1,
      completedWorkouts: {},
      exerciseLog: {},
      settings: { restBeepEnabled: true },
    };
    setData(fresh);
    saveData(fresh);
    setTab("home");
  };

  const openWorkout = (dayKey) => {
    setSelectedDay(dayKey);
    setView("workout");
  };

  const closeWorkout = () => {
    setView("home");
    setSelectedDay(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PALETTE.cream,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        color: PALETTE.ink,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {view === "workout" && selectedDay && (
        <WorkoutView
          week={data.currentWeek}
          dayKey={selectedDay}
          workoutData={data.completedWorkouts}
          onUpdateSets={updateSets}
          onBack={closeWorkout}
        />
      )}

      {view === "home" && tab === "home" && (
        <WeekSelector
          currentWeek={data.currentWeek}
          completedWorkouts={data.completedWorkouts}
          onSelectDay={openWorkout}
          onSelectWeek={setCurrentWeek}
        />
      )}

      {view === "home" && tab === "progress" && (
        <ProgressView
          completedWorkouts={data.completedWorkouts}
          currentWeek={data.currentWeek}
        />
      )}

      {view === "home" && tab === "settings" && (
        <SettingsView
          data={data}
          onResetProgress={resetProgress}
          onClearAll={clearAllData}
        />
      )}

      {/* Bottom nav (only when in home view) */}
      {view === "home" && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(250, 247, 244, 0.95)",
            backdropFilter: "blur(24px)",
            borderTop: `1px solid ${PALETTE.sand}`,
            padding: "10px 20px 22px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <NavButton icon={<Home size={22} />} label="Home" active={tab === "home"} onClick={() => setTab("home")} />
          <NavButton icon={<TrendingUp size={22} />} label="Progress" active={tab === "progress"} onClick={() => setTab("progress")} />
          <NavButton icon={<Settings size={22} />} label="Settings" active={tab === "settings"} onClick={() => setTab("settings")} />
        </div>
      )}
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
      cursor: "pointer",
      color: active ? PALETTE.terracotta : PALETTE.mocha,
      padding: "4px 12px",
      fontWeight: active ? 700 : 500,
      fontSize: 10,
      letterSpacing: "0.1em",
    }}
  >
    <div style={{ opacity: active ? 1 : 0.6 }}>{icon}</div>
    <div style={{ textTransform: "uppercase" }}>{label}</div>
  </button>
);
