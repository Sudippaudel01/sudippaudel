#!/usr/bin/env python3
"""
Generate the site's custom imagery.

Every image is drawn from scratch as SVG and rasterised to PNG, so the whole
visual set is reproducible and re-themeable: change the palette below, re-run,
and all artwork matches the site again.

    pip install cairosvg
    python3 scripts/generate-images.py

Outputs:
    public/hero-board.png            hero PCB render
    public/portrait-placeholder.png  swap for a real photo
    public/projects/<slug>.png       one 16:9 cover per project
"""

import math
import pathlib

import cairosvg

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
PROJ = PUB / "projects"
PROJ.mkdir(parents=True, exist_ok=True)

# --- palette (keep in sync with tailwind.config.ts) -------------------------
BG = "#0a0d0c"
PANEL = "#151a18"
COPPER = "#c9884f"
BRIGHT = "#e0a868"
SILK = "#e8e6df"
MINT = "#8b9d95"

MONO = "DejaVu Sans Mono, monospace"

W, H = 1200, 675  # 16:9 covers


def esc(text):
    """Escape text destined for SVG character data — '&' and '<' break the parse."""
    return (str(text).replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;"))


def frame(title, tag):
    """Shared cover chrome: grid, border, corner brackets, caption."""
    b = 28  # bracket arm length
    return f"""
  <defs>
    <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0 H0 V32" fill="none" stroke="{MINT}" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <rect width="{W}" height="{H}" fill="url(#g)"/>
  <g stroke="{COPPER}" stroke-width="2.5" fill="none" stroke-opacity="0.85">
    <path d="M40 {40+b} V40 H{40+b}"/>
    <path d="M{W-40-b} 40 H{W-40} V{40+b}"/>
    <path d="M40 {H-40-b} V{H-40} H{40+b}"/>
    <path d="M{W-40-b} {H-40} H{W-40} V{H-40-b}"/>
  </g>
  <text x="64" y="86" font-family="{MONO}" font-size="17" fill="{COPPER}"
        letter-spacing="5">{esc(tag)}</text>
  <text x="64" y="{H-56}" font-family="{MONO}" font-size="19" fill="{MINT}"
        letter-spacing="3">{esc(title)}</text>
"""


def render(name, body, out=None, w=W, h=H):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'
    target = out or (PROJ / f"{name}.png")
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(target),
                     output_width=w, output_height=h)
    print("  ✓", target.relative_to(ROOT))


# ---------------------------------------------------------------------------
# 1. IR remote — captured mark/space burst with a 38 kHz carrier inset
# ---------------------------------------------------------------------------
def ir_remote():
    base, top = 430, 300          # logic low / logic high y
    x, parts = 90, []
    # NEC-style leader (9ms mark, 4.5ms space) then data bits
    widths = [(150, 1), (75, 0)] + [
        (18, 1) if i % 2 == 0 else (v, 0)
        for i, v in enumerate([18, 52, 18, 18, 18, 52, 18, 52,
                               18, 18, 18, 52, 18, 18, 18, 52])
    ]
    pts = [f"M{x},{base}"]
    for wd, hi in widths:
        y = top if hi else base
        pts.append(f"L{x},{y} L{x+wd},{y}")
        x += wd
    pts.append(f"L{x},{base} L{W-90},{base}")
    wave = " ".join(pts)

    # dimension line across the leader mark
    dim = f"""
  <g stroke="{MINT}" stroke-width="1.4" stroke-opacity="0.75">
    <path d="M90 255 H240"/>
    <path d="M90 248 V262 M240 248 V262"/>
  </g>
  <text x="165" y="240" text-anchor="middle" font-family="{MONO}" font-size="15"
        fill="{MINT}">9.0 ms mark</text>"""

    # carrier inset
    cx, cy, cw = 760, 208, 380
    car = [f"M{cx},{cy}"]
    step = 11
    for i in range(int(cw / step)):
        yy = cy - 34 if i % 2 == 0 else cy
        car.append(f"L{cx+i*step},{yy} L{cx+(i+1)*step},{yy}")
    carrier = " ".join(car)

    body = frame("IR mark/space capture · Timer0A dual-edge input capture",
                 "SIGNAL CAPTURE") + f"""
  <path d="{wave}" fill="none" stroke="{BRIGHT}" stroke-width="3.2"
        stroke-linejoin="round"/>
  {dim}
  <g stroke="{COPPER}" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="5 6">
    <path d="M90 {top} H{W-90}"/><path d="M90 {base} H{W-90}"/>
  </g>
  <text x="{W-96}" y="{top-12}" text-anchor="end" font-family="{MONO}"
        font-size="14" fill="{MINT}" fill-opacity="0.8">MARK</text>
  <text x="{W-96}" y="{base+26}" text-anchor="end" font-family="{MONO}"
        font-size="14" fill="{MINT}" fill-opacity="0.8">SPACE</text>

  <rect x="{cx-26}" y="{cy-86}" width="{cw+52}" height="130" fill="{PANEL}"
        stroke="{COPPER}" stroke-opacity="0.45" stroke-width="1.5"/>
  <text x="{cx-10}" y="{cy-58}" font-family="{MONO}" font-size="14" fill="{COPPER}"
        letter-spacing="2">38 kHz CARRIER — Timer0B PWM</text>
  <path d="{carrier}" fill="none" stroke="{COPPER}" stroke-width="2"/>
"""
    render("ir-remote-control-replacement", body)


# ---------------------------------------------------------------------------
# 2. IEEE 754 — bit fields above the add datapath, critical path highlighted
# ---------------------------------------------------------------------------
def fp16():
    y0, bh = 150, 62
    x0, unit = 90, (W - 180) / 16.0
    fields = [("S", 1, COPPER), ("EXPONENT [5]", 5, "#7d8f86"), ("MANTISSA [10]", 10, PANEL)]
    bits, bx = [], x0
    for label, n, fill in fields:
        bw = unit * n
        bits.append(
            f'<rect x="{bx}" y="{y0}" width="{bw}" height="{bh}" fill="{fill}" '
            f'stroke="{COPPER}" stroke-opacity="0.8" stroke-width="1.6"/>'
            f'<text x="{bx+bw/2}" y="{y0+bh/2+6}" text-anchor="middle" '
            f'font-family="{MONO}" font-size="15" fill="{SILK}">{label}</text>'
        )
        bx += bw
    ticks = "".join(
        f'<text x="{x0+unit*(i+0.5)}" y="{y0-14}" text-anchor="middle" '
        f'font-family="{MONO}" font-size="11" fill="{MINT}" fill-opacity="0.55">{15-i}</text>'
        for i in range(16)
    )

    stages = ["COMPARE\n& SWAP", "ALIGN\n>> exp Δ", "ADD /\nSUB",
              "NORMALIZE\nshifter", "FLAGS\novf · unf"]
    sy, sh, sw, gap = 330, 108, 186, 26
    blocks = []
    for i, label in enumerate(stages):
        sx = 90 + i * (sw + gap)
        crit = i == 3  # normalization shifter is the critical path
        blocks.append(
            f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="{PANEL}" '
            f'stroke="{BRIGHT if crit else COPPER}" '
            f'stroke-width="{2.6 if crit else 1.6}" '
            f'stroke-opacity="{1 if crit else 0.55}"/>'
        )
        for j, line in enumerate(label.split("\n")):
            blocks.append(
                f'<text x="{sx+sw/2}" y="{sy+46+j*24}" text-anchor="middle" '
                f'font-family="{MONO}" font-size="15" '
                f'fill="{BRIGHT if crit else SILK}">{esc(line)}</text>'
            )
        if i < len(stages) - 1:
            ax = sx + sw
            blocks.append(
                f'<path d="M{ax+3} {sy+sh/2} H{ax+gap-7}" stroke="{COPPER}" '
                f'stroke-width="1.8"/><path d="M{ax+gap-12} {sy+sh/2-5} '
                f'l6 5 -6 5" fill="none" stroke="{COPPER}" stroke-width="1.8"/>'
            )
    cx = 90 + 3 * (sw + gap) + sw / 2
    blocks.append(
        f'<text x="{cx}" y="{sy+sh+30}" text-anchor="middle" font-family="{MONO}" '
        f'font-size="14" fill="{BRIGHT}">critical path</text>'
    )

    body = frame("706 logic elements · 137 registers · Intel MAX 10",
                 "FP16 DATAPATH") + ticks + "".join(bits) + "".join(blocks)
    render("ieee-754-floating-point-adder", body)


# ---------------------------------------------------------------------------
# 3. AntarLens — four tracked signals + a check-in ring
# ---------------------------------------------------------------------------
def antarlens():
    gx, gy, gw, gh = 90, 170, 700, 320
    grid = "".join(
        f'<path d="M{gx} {gy+gh*i/4} H{gx+gw}" stroke="{MINT}" stroke-opacity="0.12" stroke-width="1"/>'
        for i in range(5)
    )
    series = [
        ("FOCUS", BRIGHT, [.30, .52, .40, .68, .58, .80, .72, .88]),
        ("MOOD", COPPER, [.50, .44, .62, .55, .70, .64, .78, .74]),
        ("ENERGY", MINT, [.22, .35, .30, .46, .40, .52, .48, .60]),
        ("SLEEP", "#5f7168", [.62, .58, .66, .60, .72, .68, .75, .70]),
    ]
    paths, legend = [], []
    for i, (name, color, vals) in enumerate(series):
        pts = " ".join(
            f"{'M' if j == 0 else 'L'}{gx+gw*j/(len(vals)-1)},{gy+gh*(1-v)}"
            for j, v in enumerate(vals)
        )
        paths.append(f'<path d="{pts}" fill="none" stroke="{color}" stroke-width="2.8" '
                     f'stroke-linejoin="round" stroke-linecap="round"/>')
        dots = "".join(
            f'<circle cx="{gx+gw*j/(len(vals)-1)}" cy="{gy+gh*(1-v)}" r="3.4" fill="{color}"/>'
            for j, v in enumerate(vals)
        )
        paths.append(dots)
        ly = gy + gh + 48 + i * 0  # single row legend
        lx = gx + i * 175
        legend.append(
            f'<rect x="{lx}" y="{ly-10}" width="26" height="3" fill="{color}"/>'
            f'<text x="{lx+36}" y="{ly-4}" font-family="{MONO}" font-size="14" '
            f'fill="{MINT}" letter-spacing="2">{esc(name)}</text>'
        )

    # 30-second check-in ring
    rx, ry, r = 985, 300, 88
    circ = 2 * math.pi * r
    ring = (
        f'<circle cx="{rx}" cy="{ry}" r="{r}" fill="none" stroke="{PANEL}" stroke-width="16"/>'
        f'<circle cx="{rx}" cy="{ry}" r="{r}" fill="none" stroke="{BRIGHT}" stroke-width="16" '
        f'stroke-linecap="round" stroke-dasharray="{circ*0.78} {circ}" '
        f'transform="rotate(-90 {rx} {ry})"/>'
        f'<text x="{rx}" y="{ry+4}" text-anchor="middle" font-family="{MONO}" '
        f'font-size="34" font-weight="bold" fill="{SILK}">30s</text>'
        f'<text x="{rx}" y="{ry+32}" text-anchor="middle" font-family="{MONO}" '
        f'font-size="13" fill="{MINT}" letter-spacing="2">CHECK-IN</text>'
    )

    body = frame("Focus · mood · energy · sleep — personal baseline",
                 "COGNITIVE PATTERNS") + grid + "".join(paths) + "".join(legend) + ring
    render("antarlens", body)


# ---------------------------------------------------------------------------
# 4. Kashlly — cash balance decaying toward a runway marker
# ---------------------------------------------------------------------------
def kashlly():
    gx, gy, gw, gh = 90, 180, 660, 300
    vals = [.92, .86, .74, .70, .58, .49, .38, .30, .18, .08]
    pts = [(gx + gw * i / (len(vals) - 1), gy + gh * (1 - v)) for i, v in enumerate(vals)]
    line = " ".join(f"{'M' if i == 0 else 'L'}{x:.1f},{y:.1f}" for i, (x, y) in enumerate(pts))
    area = line + f" L{pts[-1][0]:.1f},{gy+gh} L{gx},{gy+gh} Z"

    bars = "".join(
        f'<rect x="{gx+gw*i/(len(vals)-1)-9}" y="{gy+gh+14}" width="18" '
        f'height="{10+22*(1-v)}" fill="{COPPER}" fill-opacity="0.22"/>'
        for i, v in enumerate(vals)
    )
    marker_x = pts[-2][0]
    rows = []
    for i, (label, status, color) in enumerate(
        [("INV-0412", "OVERDUE 14d", BRIGHT),
         ("INV-0413", "REMINDER SENT", COPPER),
         ("INV-0414", "PAID", MINT)]
    ):
        ry = 210 + i * 62
        rows.append(
            f'<rect x="810" y="{ry}" width="300" height="48" fill="{PANEL}" '
            f'stroke="{COPPER}" stroke-opacity="0.35" stroke-width="1.3"/>'
            f'<text x="828" y="{ry+30}" font-family="{MONO}" font-size="14" fill="{SILK}">{esc(label)}</text>'
            f'<text x="1092" y="{ry+30}" text-anchor="end" font-family="{MONO}" '
            f'font-size="12" fill="{color}" letter-spacing="1">{esc(status)}</text>'
        )

    body = frame("Real-time runway · automated invoice follow-up",
                 "CASH FLOW FORECAST") + f"""
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{COPPER}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="{COPPER}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  {''.join(f'<path d="M{gx} {gy+gh*i/4} H{gx+gw}" stroke="{MINT}" stroke-opacity="0.11" stroke-width="1"/>' for i in range(5))}
  <path d="{area}" fill="url(#fill)"/>
  <path d="{line}" fill="none" stroke="{BRIGHT}" stroke-width="3" stroke-linejoin="round"/>
  {bars}
  <path d="M{marker_x} {gy-16} V{gy+gh}" stroke="{BRIGHT}" stroke-width="1.6"
        stroke-dasharray="6 5"/>
  <circle cx="{marker_x}" cy="{pts[-2][1]}" r="6" fill="{BG}" stroke="{BRIGHT}" stroke-width="3"/>
  <text x="{marker_x-12}" y="{gy-24}" text-anchor="end" font-family="{MONO}"
        font-size="15" fill="{BRIGHT}">runway ends</text>
  {''.join(rows)}
"""
    render("kashlly", body)


# ---------------------------------------------------------------------------
# 5. Network security — segmented topology behind a filtering boundary
# ---------------------------------------------------------------------------
def netsec():
    nodes = [(250, 250), (250, 430), (410, 340), (150, 340)]
    inner = [(880, 220), (1030, 300), (880, 400), (1010, 470), (760, 330)]
    links = "".join(
        f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{COPPER}" '
        f'stroke-opacity="0.4" stroke-width="1.6"/>'
        for a, b in [(nodes[0], nodes[2]), (nodes[1], nodes[2]), (nodes[3], nodes[2]),
                     (nodes[0], nodes[3]), (nodes[1], nodes[3])]
    )
    ilinks = "".join(
        f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{MINT}" '
        f'stroke-opacity="0.45" stroke-width="1.6"/>'
        for a, b in [(inner[4], inner[0]), (inner[4], inner[2]), (inner[0], inner[1]),
                     (inner[2], inner[3]), (inner[1], inner[3])]
    )
    dots = "".join(
        f'<circle cx="{x}" cy="{y}" r="15" fill="{BG}" stroke="{COPPER}" stroke-width="3"/>'
        for x, y in nodes
    ) + "".join(
        f'<circle cx="{x}" cy="{y}" r="15" fill="{BG}" stroke="{MINT}" stroke-width="3"/>'
        for x, y in inner
    )
    # filtering boundary
    bx = 600
    boundary = (
        f'<path d="M{bx} 130 V545" stroke="{BRIGHT}" stroke-width="2.4" stroke-dasharray="12 8"/>'
        f'<rect x="{bx-92}" y="305" width="184" height="66" fill="{PANEL}" '
        f'stroke="{BRIGHT}" stroke-width="2"/>'
        f'<text x="{bx}" y="345" text-anchor="middle" font-family="{MONO}" '
        f'font-size="16" fill="{BRIGHT}" letter-spacing="2">FILTER</text>'
    )
    blocked = "".join(
        f'<path d="M{450} {y} H{bx-100}" stroke="{COPPER}" stroke-opacity="0.5" '
        f'stroke-width="1.6"/><path d="M{bx-96} {y-8} l16 16 M{bx-96} {y+8} l16 -16" '
        f'stroke="{BRIGHT}" stroke-width="2.2"/>'
        for y in (215, 465)
    )
    body = frame("Segmentation and threat mitigation — team lead",
                 "NETWORK TOPOLOGY") + f"""
  <text x="250" y="150" text-anchor="middle" font-family="{MONO}" font-size="14"
        fill="{COPPER}" letter-spacing="3">UNTRUSTED</text>
  <text x="920" y="150" text-anchor="middle" font-family="{MONO}" font-size="14"
        fill="{MINT}" letter-spacing="3">SEGMENTED</text>
  {links}{ilinks}{blocked}{boundary}{dots}
"""
    render("network-security-project", body)


# ---------------------------------------------------------------------------
# 6. Hero board render
# ---------------------------------------------------------------------------
def hero_board():
    w = h = 900
    traces, pads = [], []
    for i in range(9):
        y = 120 + i * 78
        traces.append(f'<path d="M40 {y} H{300 - (i%3)*40} L{360 - (i%3)*40} {y+58} H620" '
                      f'stroke="{COPPER}" stroke-opacity="{0.16 + (i%4)*0.07}" '
                      f'stroke-width="2" fill="none"/>')
    for i in range(7):
        x = 110 + i * 118
        traces.append(f'<path d="M{x} 40 V{200 + (i%3)*70}" stroke="{COPPER}" '
                      f'stroke-opacity="0.14" stroke-width="2"/>')
        pads.append(f'<circle cx="{x}" cy="40" r="7" fill="{BG}" stroke="{COPPER}" stroke-width="2.5"/>')
    for i in range(6):
        y = 150 + i * 120
        pads.append(f'<circle cx="{w-60}" cy="{y}" r="7" fill="{BG}" stroke="{COPPER}" stroke-width="2.5"/>')

    # central IC with pins
    ix, iy, iw, ih = 300, 330, 300, 240
    pins = "".join(
        f'<rect x="{ix-18}" y="{iy+26+i*30}" width="18" height="10" fill="{COPPER}"/>'
        f'<rect x="{ix+iw}" y="{iy+26+i*30}" width="18" height="10" fill="{COPPER}"/>'
        for i in range(7)
    )
    body = f"""
  <defs>
    <pattern id="hg" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M30 0 H0 V30" fill="none" stroke="{MINT}" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="{COPPER}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="{COPPER}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="{BG}"/>
  <rect width="{w}" height="{h}" fill="url(#hg)"/>
  <circle cx="450" cy="450" r="380" fill="url(#glow)"/>
  {''.join(traces)}
  {pins}
  <rect x="{ix}" y="{iy}" width="{iw}" height="{ih}" rx="8" fill="{PANEL}"
        stroke="{COPPER}" stroke-width="2.5"/>
  <circle cx="{ix+26}" cy="{iy+26}" r="8" fill="none" stroke="{COPPER}" stroke-width="2"/>
  <text x="{ix+iw/2}" y="{iy+118}" text-anchor="middle" font-family="{MONO}"
        font-size="52" font-weight="bold" fill="{BRIGHT}" letter-spacing="4">SP</text>
  <text x="{ix+iw/2}" y="{iy+156}" text-anchor="middle" font-family="{MONO}"
        font-size="17" fill="{MINT}" letter-spacing="4">CMPE · 2027</text>
  <text x="{ix+iw/2}" y="{iy+190}" text-anchor="middle" font-family="{MONO}"
        font-size="13" fill="{MINT}" fill-opacity="0.6" letter-spacing="2">ARM · FPGA · WEB</text>
  {''.join(pads)}
"""
    render("hero-board", body, out=PUB / "hero-board.png", w=w, h=h)


# ---------------------------------------------------------------------------
# 7. Portrait placeholder — replace with a real photo
# ---------------------------------------------------------------------------
def portrait():
    w, h = 800, 1000
    b = 40
    body = f"""
  <defs>
    <pattern id="pg" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0 H0 V28" fill="none" stroke="{MINT}" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="{w}" height="{h}" fill="{PANEL}"/>
  <rect width="{w}" height="{h}" fill="url(#pg)"/>
  <g stroke="{COPPER}" stroke-width="3" fill="none">
    <path d="M40 {40+b} V40 H{40+b}"/><path d="M{w-40-b} 40 H{w-40} V{40+b}"/>
    <path d="M40 {h-40-b} V{h-40} H{40+b}"/><path d="M{w-40-b} {h-40} H{w-40} V{h-40-b}"/>
  </g>
  <circle cx="{w/2}" cy="{h/2-70}" r="120" fill="none" stroke="{COPPER}"
          stroke-opacity="0.5" stroke-width="3"/>
  <text x="{w/2}" y="{h/2-46}" text-anchor="middle" font-family="{MONO}"
        font-size="86" font-weight="bold" fill="{BRIGHT}" letter-spacing="6">SP</text>
  <text x="{w/2}" y="{h/2+130}" text-anchor="middle" font-family="{MONO}"
        font-size="20" fill="{MINT}" letter-spacing="4">REPLACE WITH PHOTO</text>
  <text x="{w/2}" y="{h/2+168}" text-anchor="middle" font-family="{MONO}"
        font-size="15" fill="{MINT}" fill-opacity="0.6">public/portrait.jpg · 4:5 portrait</text>
"""
    render("portrait", body, out=PUB / "portrait-placeholder.png", w=w, h=h)


if __name__ == "__main__":
    print("Generating imagery…")
    ir_remote()
    fp16()
    antarlens()
    kashlly()
    netsec()
    hero_board()
    portrait()
    print("Done.")
