import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { TASKS, FAMILIES, FINE_TO_COARSE, toCoarse } from "./tasks.js";
import "./replay.css";

const SPEED = 3; // playback runs at three times real time
const TRAIL = 24; // how many recent hovers the trace shows
const END_PAUSE_MS = 1600;

/**
 * Replays recorded hover sessions over a projection and shows what the online
 * model believed at every step.
 *
 * props
 *   data       sample JSON (see web/shared/data/sample.json for the schema)
 *   autoplay   start playing when scrolled into view, unless reduced motion is on
 */
export default function ProvenanceReplay({ data, autoplay = true }) {
  const [sessionIdx, setSessionIdx] = useState(0);
  const [scheme, setScheme] = useState("fine");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const rootRef = useRef(null);
  const userPaused = useRef(false);

  const points = data.projection.points;
  const session = data.sessions[sessionIdx];
  const { events } = session;
  const endTime = events[events.length - 1].t + 600;

  // Index of the event active at `time`
  const step = useMemo(() => {
    let lo = 0, hi = events.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (events[mid].t <= time) lo = mid; else hi = mid - 1;
    }
    return lo;
  }, [events, time]);

  // ── Playback loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      setTime((t) => Math.min(endTime, t + dt * SPEED));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, endTime]);

  // At the end of a session, hold briefly, then move on to the next one.
  const atEnd = time >= endTime;
  useEffect(() => {
    if (!playing || !atEnd) return;
    const id = setTimeout(() => {
      setSessionIdx((i) => (i + 1) % data.sessions.length);
      setTime(0);
    }, END_PAUSE_MS);
    return () => clearTimeout(id);
  }, [playing, atEnd, data.sessions.length]);

  // Autoplay once the figure is on screen, respecting reduced motion.
  useEffect(() => {
    if (!autoplay || !rootRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(([entry]) => {
      if (userPaused.current) return;
      setPlaying(entry.isIntersecting);
    }, { threshold: 0.35 });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [autoplay]);

  const togglePlay = () => {
    userPaused.current = playing;
    if (!playing && time >= endTime) setTime(0);
    setPlaying(!playing);
  };

  const chooseSession = (i) => {
    setSessionIdx(i);
    setTime(0);
  };

  // ── Derived view state ─────────────────────────────────────────────────────
  const coarse = scheme === "coarse";
  const classes = coarse
    ? FAMILIES.map((f) => ({ id: f.id, name: f.name, color: `var(--family-${f.id})` }))
    : TASKS.map((t) => ({ id: t.id, name: t.name, color: `var(--task-${t.id})` }));
  const colorOf = (taskId) => (coarse ? `var(--family-${FINE_TO_COARSE[taskId]})` : `var(--task-${taskId})`);

  const probs = coarse ? toCoarse(session.pred[step]) : session.pred[step];
  const actualId = coarse ? FINE_TO_COARSE[session.truth[step]] : session.truth[step];
  const argmax = (p) => p.indexOf(Math.max(...p));
  const guessId = argmax(probs);

  const visited = useMemo(() => {
    const s = new Set();
    for (let i = 0; i <= step; i++) s.add(events[i].p);
    return s;
  }, [events, step]);

  // Plot coordinates. The projection is normalized to 0..1, y grows downward in SVG.
  const W = 100, H = 82, PAD = 3;
  const px = (x) => PAD + x * (W - 2 * PAD);
  const py = (y) => PAD + (1 - y) * (H - 2 * PAD);

  const trail = [];
  for (let i = Math.max(1, step - TRAIL + 1); i <= step; i++) {
    const a = points[events[i - 1].p], b = points[events[i].p];
    const age = step - i;
    trail.push(
      <line
        key={i}
        x1={px(a[0])} y1={py(a[1])} x2={px(b[0])} y2={py(b[1])}
        stroke={colorOf(session.truth[i])}
        strokeWidth={0.7}
        strokeLinecap="round"
        opacity={Math.max(0.12, 1 - age / TRAIL)}
      />,
    );
  }
  const cur = points[events[step].p];

  // Timeline geometry in a 1000 unit wide viewBox
  const TW = 1000;
  const tx = (t) => (t / endTime) * TW;
  const segments = useMemo(() => {
    return events.map((e, i) => ({
      x: (e.t / endTime) * TW,
      w: (((events[i + 1]?.t ?? endTime) - e.t) / endTime) * TW,
      truth: session.truth[i],
      guess: argmax(coarse ? toCoarse(session.pred[i]) : session.pred[i]),
    }));
  }, [events, endTime, session, coarse]);

  const timelineRef = useRef(null);
  const scrubTo = useCallback((clientX) => {
    const r = timelineRef.current.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setTime(f * endTime);
  }, [endTime]);

  const onPointerDown = (e) => {
    userPaused.current = true;
    setPlaying(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubTo(e.clientX);
  };
  const onPointerMove = (e) => {
    if (e.buttons) scrubTo(e.clientX);
  };

  const actualName = classes.find((c) => c.id === actualId)?.name;
  const guessName = classes.find((c) => c.id === guessId)?.name;

  return (
    <div className="i2i-replay" ref={rootRef}>
      <div className="i2i-top">
        <svg
          className="i2i-plot"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Scatterplot with ${points.length} points and the hover trace of ${session.label}`}
        >
          {points.map(([x, y], i) => (
            <circle key={i} className={visited.has(i) ? "pt visited" : "pt"} cx={px(x)} cy={py(y)} r={0.75} />
          ))}
          {trail}
          <circle className="cursor" cx={px(cur[0])} cy={py(cur[1])} r={1.9} />
        </svg>

        <div className="i2i-side">
          <h3>What the model guesses right now</h3>
          <p className="i2i-sub">
            It only sees hovers up to this moment, the same way it would in a live tool.
          </p>
          <ul className="i2i-bars">
            {classes.map((c) => (
              <li key={c.id} className={c.id === actualId ? "is-actual" : undefined}>
                <span className="name">
                  {c.name}
                  {c.id === actualId && <span className="actual">actual task</span>}
                </span>
                <span className="track">
                  <span
                    className="fill"
                    style={{ display: "block", background: c.color, transform: `scaleX(${probs[c.id]})` }}
                  />
                </span>
                <span className="pct">{Math.round(probs[c.id] * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="i2i-timeline">
        <svg
          ref={timelineRef}
          viewBox={`0 0 ${TW} 58`}
          preserveAspectRatio="none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          aria-hidden="true"
        >
          {segments.map((s, i) => (
            <rect key={`a${i}`} x={s.x} y={2} width={s.w + 0.5} height={22} fill={colorOf(s.truth)} />
          ))}
          {segments.map((s, i) => (
            <rect
              key={`g${i}`} x={s.x} y={32} width={s.w + 0.5} height={22}
              fill={coarse ? `var(--family-${s.guess})` : `var(--task-${s.guess})`}
            />
          ))}
          <line className="playhead" x1={tx(time)} x2={tx(time)} y1={0} y2={58} vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="i2i-sub" style={{ margin: "0.35rem 0 0" }}>
          Top strip, the task the person was actually doing. Bottom strip, the model's top guess at each moment. Drag to scrub.
        </p>
      </div>

      <div className="i2i-controls">
        <button type="button" className="i2i-play" onClick={togglePlay} aria-pressed={playing}>
          {playing ? "Pause" : "Play"}
        </button>

        <div className="i2i-seg" role="group" aria-label="Session">
          {data.sessions.map((s, i) => (
            <button key={s.id} type="button" aria-pressed={i === sessionIdx} onClick={() => chooseSession(i)}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="i2i-seg" role="group" aria-label="Label detail">
          <button type="button" aria-pressed={!coarse} onClick={() => setScheme("fine")}>7 tasks</button>
          <button type="button" aria-pressed={coarse} onClick={() => setScheme("coarse")}>3 groups</button>
        </div>

        <span className="i2i-step" aria-live={playing ? "off" : "polite"}>
          Hover {step + 1} of {events.length}. Actual {actualName}, guess {guessName}.
        </span>
      </div>

      {data.synthetic && (
        <p className="i2i-note">
          Synthetic sample for layout testing, not real participant data. Replace it by running
          web/scripts/export_sample.py on the Zenodo dataset.
        </p>
      )}
    </div>
  );
}
