// Staged reveal of the photoreal/sketch BlackHole iframe, used to hand off from the
// GW intro dive: the dive lands on the bare event-horizon sphere (loaded with
// ?reveal=staged → disk/stars/galaxy gains at 0), then this tweens them up in order:
//   stage 1 — the accretion disk           (look.disk_gain   0 → 1)
//   stage 2 — the stars + background sky    (look.star_gain/galaxy_gain 0 → target)
//   stage 3 — (caller) the page islands
// The renderer reads look.* into uniforms every frame, so these fade live with no
// shader recompile. Same-origin → we call window.blackHoleSetLook directly (postMessage
// fallback). Removable with zero downstream effect.

export interface RevealOpts {
  diskMs?: number;
  skyMs?: number;
  diskGain?: number;
  starGain?: number;
  galaxyGain?: number;
  spin?: number;         // final a/M (default 0.9 = renderer default → Home BH unchanged)
  onStage1?: () => void; // accretion in
  onStage2?: () => void; // stars + sky in
  onDone?: () => void;   // everything in (caller fades islands)
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);                                   // ease-out
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // gentle settle (slow start AND end)

export function revealStaged(frame: HTMLIFrameElement | null, opts: RevealOpts = {}) {
  const diskMs = opts.diskMs ?? 1500;
  const skyMs = opts.skyMs ?? 1600;
  const DISK = opts.diskGain ?? 1.0;
  const STAR = opts.starGain ?? 0.4;
  const GAL = opts.galaxyGain ?? 0.4;
  const SPIN = opts.spin ?? 0.9;   // ramps 0 → 0.9 (the renderer default) across the reveal
  const REVEAL = 1.12;             // disk_reveal_r at full (>=1.1 = whole disk drawn, draw-front gone)
  const RSTART = -0.1;             // start just below 0 so the landing is a perfectly clean bare circle

  if (!frame) { opts.onStage1?.(); opts.onStage2?.(); opts.onDone?.(); return; }

  const setLook = (o: Record<string, number>) => {
    const cw = frame.contentWindow as any;
    if (cw && typeof cw.blackHoleSetLook === "function") cw.blackHoleSetLook(o);
    else cw?.postMessage({ type: "bh:setLook", look: o }, location.origin);
  };
  const ready = () => {
    const cw = frame.contentWindow as any;
    return !!(cw && typeof cw.blackHoleSetLook === "function");
  };

  const tween = (dur: number, apply: (e: number) => void, easeFn: (t: number) => number = ease) =>
    new Promise<void>((res) => {
      let start = 0;
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / dur);
        apply(easeFn(t));
        if (t < 1) requestAnimationFrame(step);
        else res();
      };
      requestAnimationFrame(step);
    });

  // poll (up to ~4s) until the iframe's WebGL hook exists, so we never fade onto a
  // not-yet-warmed renderer; then run the stages.
  let tries = 0;
  const begin = () => {
    if (!ready() && tries++ < 240) { requestAnimationFrame(begin); return; }
    setLook({ disk_gain: DISK, disk_reveal_r: RSTART, star_gain: 0, galaxy_gain: 0, spin: 0 }); // land: clean bare circle (disk full-bright but spatially hidden)
    // STAGE 1: DRAW the accretion disk in from the INSIDE OUT (radial reveal + a bright
    // draw-front riding the leading edge, like a pencil inking it outward). BH held at
    // spin 0 → stays a centred perfect circle the whole time it's drawn in.
    tween(diskMs, (e) => setLook({ disk_reveal_r: RSTART + (REVEAL - RSTART) * e }), easeInOut)
      .then(() => {
        opts.onStage1?.();
        // STAGE 2: NOW spin up 0→0.9 AND fade the stars + sky in, together — the BH shifts and
        // goes asymmetric as it "becomes real". Ease-in-out so the shift settles, not jumps.
        return tween(skyMs, (e) => setLook({ spin: SPIN * e, star_gain: STAR * e, galaxy_gain: GAL * e }), easeInOut);
      })
      .then(() => { setLook({ disk_reveal_r: REVEAL, spin: SPIN, star_gain: STAR, galaxy_gain: GAL }); opts.onStage2?.(); opts.onDone?.(); });
  };
  begin();
}

// ── New flow: the explosion uncovers the real 3D BH (loaded ?reveal=zoom: disk ON, spin 0,
// far/small) and this flies the camera IN — distance far→Home, spin 0→0.9, stars/sky 0→target,
// all together. The accretion is present the whole way, so there's no 2D→3D transition to hide
// beyond the explosion. Lands exactly on the renderer-default Home BH (distance 11, spin 0.9). ──
export interface ZoomOpts {
  ms?: number;
  fromDist?: number;
  toDist?: number;
  spin?: number;
  starGain?: number;
  galaxyGain?: number;
  onDone?: () => void;
}

export function zoomIntro(frame: HTMLIFrameElement | null, opts: ZoomOpts = {}) {
  const ms = opts.ms ?? 4500;
  const FROM = opts.fromDist ?? 28, TO = opts.toDist ?? 11;
  // The OLD dive trajectory, applied to the real camera: orbit + DESCEND (top-down → grazing)
  // + fall in. Lands on the Home framing (polar 1.519 ≈ the default 3° pitch, azimuth 0, d 11).
  const POL0 = 0.30, POL1 = 1.519, AZ0 = -1.5, AZ1 = 0;
  const SPIN = opts.spin ?? 0.9, STAR = opts.starGain ?? 0.4, GAL = opts.galaxyGain ?? 0.4;
  if (!frame) { opts.onDone?.(); return; }

  const setLook = (o: Record<string, number>) => {
    const cw = frame.contentWindow as any;
    if (cw && typeof cw.blackHoleSetLook === "function") cw.blackHoleSetLook(o);
    else cw?.postMessage({ type: "bh:setLook", look: o }, location.origin);
  };
  const ready = () => {
    const cw = frame.contentWindow as any;
    return !!(cw && typeof cw.blackHoleSetLook === "function");
  };
  const tween = (dur: number, apply: (e: number) => void) =>
    new Promise<void>((res) => {
      let start = 0;
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / dur);
        apply(easeInOut(t));
        if (t < 1) requestAnimationFrame(step);
        else res();
      };
      requestAnimationFrame(step);
    });

  let tries = 0;
  const begin = () => {
    if (!ready() && tries++ < 240) { requestAnimationFrame(begin); return; }
    setLook({ distance: FROM, polar: POL0, azimuth: AZ0, spin: 0, star_gain: 0, galaxy_gain: 0 });   // zoom-start (top-down, far)
    tween(ms, (e) => setLook({
      distance: FROM + (TO - FROM) * e,
      polar: POL0 + (POL1 - POL0) * e,        // descend: top-down → grazing
      azimuth: AZ0 + (AZ1 - AZ0) * e,         // orbit → Home azimuth
      spin: SPIN * e, star_gain: STAR * e, galaxy_gain: GAL * e,
    }))
      .then(() => { setLook({ distance: TO, polar: POL1, azimuth: AZ1, spin: SPIN, star_gain: STAR, galaxy_gain: GAL }); opts.onDone?.(); });
  };
  begin();
}
