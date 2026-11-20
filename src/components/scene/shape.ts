export type Point3 = {
  x: number;
  y: number;
  z: number;
};
export type StageLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageHeight: number;
  viewportWidth: number;
  mobile: boolean;
  home: boolean;
};
const point = (x: number, y: number, z: number): Point3 => ({ x, y, z });
/** Authored outer and inner edges. CSS pixels; Y down. The return fold lies
 * behind the cradle, not across empty space as an exposed pinched ribbon. */
export function ribbonEdges(s: StageLayout): [Point3[], Point3[]] {
  const { x, y, width: w, height: h, viewportWidth: vw } = s;
  const at = (u: number, v: number, z: number) =>
    point(x + u * w, y + v * h, z);
  const upper = s.home ? 0 : Math.max(0, y - 420);
  const outer = [
    point(x + 0.6 * w, upper - 280, 25),
    point(x + 0.51 * w, upper + (y - upper) * 0.26, 46),
    point(x + 0.09 * w, upper + (y - upper) * 0.7, 66),
    at(-0.25, 0.08, 20),
    at(-0.29, 0.48, 8),
    at(-0.08, 0.91, 48),
    at(0.43, 1.05, 80),
    at(0.96, 0.94, 64),
    at(1.15, 0.57, 35),
    point(vw + 150, y + 0.35 * h, 10),
    at(1.15, 0.57, -42),
    at(0.96, 0.94, -42),
    point(x + 0.8 * w, y + 0.97 * h, -42),
    point(x + 0.72 * w, y + 1.48 * h, -18),
    point(x + 0.88 * w, Math.max(s.pageHeight + 180, y + 2 * h), 20),
  ];
  const inner = [
    point(x + 1.16 * w, upper - 280, 5),
    point(x + 1.04 * w, upper + (y - upper) * 0.3, 12),
    point(x + 0.57 * w, upper + (y - upper) * 0.77, -6),
    at(0.06, 0.14, 14),
    at(0.03, 0.46, 12),
    at(0.18, 0.74, 5),
    at(0.49, 0.85, 8),
    at(0.81, 0.77, 2),
    at(0.95, 0.48, 2),
    point(vw + 100, y + 0.12 * h, -8),
    at(0.95, 0.48, -48),
    at(0.81, 0.77, -48),
    point(x + 0.35 * w, y + 0.92 * h, -48),
    point(x + 0.24 * w, y + 1.48 * h, -30),
    point(x + 0.3 * w, Math.max(s.pageHeight + 180, y + 2 * h), 8),
  ];
  if (s.mobile) {
    for (let i = 0; i < 3; i++) {
      outer[i].x = vw - 72 + i * 10;
      inner[i].x = vw + 48;
    }
    outer[3].x = x - 12;
    inner[3].x = x + 22;
    outer[4].x = x - 24;
    inner[4].x = x + 18;
  }
  return [outer, inner];
}
/** Lightweight static fallback: shares landmarks, but does not import Three. */
export function fallbackPath(s: StageLayout) {
  const [a, b] = ribbonEdges(s);
  const edge = (p: Point3[], first: boolean) => {
    let d = `${first ? "M" : "L"}${p[0].x},${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const before = p[Math.max(0, i - 1)],
        start = p[i],
        end = p[i + 1],
        after = p[Math.min(p.length - 1, i + 2)];
      d += ` C${start.x + (end.x - before.x) / 6},${start.y + (end.y - before.y) / 6} ${end.x - (after.x - start.x) / 6},${end.y - (after.y - start.y) / 6} ${end.x},${end.y}`;
    }
    return d;
  };
  return edge(a, true) + edge([...b].reverse(), false) + " Z";
}
