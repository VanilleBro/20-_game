"use strict";
/* ============================================================
   SZENEN: Zutaten wirklich auf/in das Essen legen (SVG)
   ============================================================ */
(function () {
  let uid = 0;
  const IMG = (k) => `img/ing/${k}.webp`;
  const f1 = (n) => Math.round(n * 10) / 10;

  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

  function shade(hex, amt) {
    if (!hex || hex[0] !== "#") return hex;
    let h = hex.slice(1); if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v))));
    const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // weiche Klecks-Form
  function blob(cx, cy, rx, ry, R, wob = 0.08, n = 18) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, k = 1 + (R() * 2 - 1) * wob;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    let d = "";
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      if (i === 0) { const z = pts[n - 1]; d += `M${f1((z[0] + p[0]) / 2)},${f1((z[1] + p[1]) / 2)}`; }
      d += `Q${f1(p[0])},${f1(p[1])} ${f1(m[0])},${f1(m[1])}`;
    }
    return d + "Z";
  }

  // Punkte gleichmäßig in einer Ellipse (Sonnenblumen-Muster)
  function points(reg, n, R) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = Math.sqrt((i + 0.5) / n), t = i * 2.39996 + R() * 0.5;
      out.push([reg.cx + Math.cos(t) * r * reg.rx + (R() - 0.5) * 2, reg.cy + Math.sin(t) * r * reg.ry + (R() - 0.5) * 1.2]);
    }
    return out;
  }

  /* ---------- einzelne Darstellungen an einem Punkt ---------- */
  function photo(it, x, y, s, R, sh) {
    const a = Math.round((R() - 0.5) * 70);
    return `<image href="${IMG(it.img)}" x="${f1(x - s / 2)}" y="${f1(y - s / 2)}" width="${f1(s)}" height="${f1(s)}" transform="rotate(${a} ${f1(x)} ${f1(y)})" filter="url(#${sh})"/>`;
  }
  function piece(it, x, y, s, R, sh) {
    const c = it.color, d = shade(c, -0.25), l = shade(c, 0.35);
    switch (it.look) {
      case "p": return it.img ? photo(it, x, y, s, R, sh) : piece({ ...it, look: "chunks" }, x, y, s, R, sh);
      case "slices": {
        const r = s * 0.34;
        return `<g filter="url(#${sh})"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" stroke="${d}" stroke-width="${f1(r * 0.15)}"/>` +
          [0, 1, 2, 3].map((k) => { const a = k * 1.7 + R(); return `<circle cx="${f1(x + Math.cos(a) * r * 0.45)}" cy="${f1(y + Math.sin(a) * r * 0.45)}" r="${f1(r * 0.16)}" fill="${l}" opacity=".8"/>`; }).join("") + `</g>`;
      }
      case "rings": {
        const r = s * 0.3;
        return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="${c}" stroke-width="${f1(r * 0.38)}" filter="url(#${sh})"/>` +
          `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="${l}" stroke-width="${f1(r * 0.1)}" opacity=".6"/>`;
      }
      case "chunks": {
        const w = s * 0.34, a = Math.round(R() * 90);
        return `<rect x="${f1(x - w / 2)}" y="${f1(y - w / 2)}" width="${f1(w)}" height="${f1(w)}" rx="${f1(w * 0.28)}" fill="${c}" stroke="${d}" stroke-width="${f1(w * 0.08)}" transform="rotate(${a} ${f1(x)} ${f1(y)})" filter="url(#${sh})"/>` +
          `<rect x="${f1(x - w / 4)}" y="${f1(y - w / 3)}" width="${f1(w / 3)}" height="${f1(w / 7)}" rx="${f1(w / 14)}" fill="${l}" opacity=".7" transform="rotate(${a} ${f1(x)} ${f1(y)})"/>`;
      }
      case "crumble": case "patty": {
        let o = "";
        for (let k = 0; k < 4; k++) {
          const px = x + (R() - 0.5) * s * 0.6, py = y + (R() - 0.5) * s * 0.45, r = s * (0.09 + R() * 0.07);
          o += `<path d="${blob(px, py, r, r * 0.8, R, 0.3, 7)}" fill="${k % 2 ? d : c}" filter="url(#${sh})"/>`;
        }
        return o;
      }
      case "shreds": {
        let o = "";
        for (let k = 0; k < 4; k++) {
          const px = x + (R() - 0.5) * s * 0.6, py = y + (R() - 0.5) * s * 0.4, L = s * (0.28 + R() * 0.15), a = R() * Math.PI;
          const x1 = px - Math.cos(a) * L, y1 = py - Math.sin(a) * L, x2 = px + Math.cos(a) * L, y2 = py + Math.sin(a) * L;
          o += `<path d="M${f1(x1)},${f1(y1)}Q${f1(px + (R() - 0.5) * L)},${f1(py + (R() - 0.5) * L)} ${f1(x2)},${f1(y2)}" stroke="${k % 2 ? d : c}" stroke-width="${f1(s * 0.085)}" fill="none" stroke-linecap="round" filter="url(#${sh})"/>`;
        }
        return o;
      }
      case "kernels": {
        let o = "";
        for (let k = 0; k < 5; k++) {
          const px = x + (R() - 0.5) * s * 0.55, py = y + (R() - 0.5) * s * 0.45;
          o += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(s * 0.075)}" ry="${f1(s * 0.06)}" fill="${c}" stroke="${d}" stroke-width="${f1(s * 0.02)}"/>`;
        }
        return `<g filter="url(#${sh})">${o}</g>`;
      }
      case "dollop": {
        const r = s * 0.3;
        return `<g filter="url(#${sh})"><path d="${blob(x, y, r, r * 0.75, R, 0.12, 10)}" fill="${c}" stroke="${d}" stroke-width="${f1(r * 0.08)}"/>` +
          `<path d="${blob(x, y - r * 0.35, r * 0.68, r * 0.5, R, 0.1, 9)}" fill="${c}" stroke="${d}" stroke-width="${f1(r * 0.06)}"/>` +
          `<circle cx="${f1(x)}" cy="${f1(y - r * 0.75)}" r="${f1(r * 0.28)}" fill="${c}"/>` +
          `<ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.4)}" rx="${f1(r * 0.18)}" ry="${f1(r * 0.08)}" fill="#fff" opacity=".7"/></g>`;
      }
      case "egg": {
        const r = s * 0.55;
        return `<g filter="url(#${sh})"><path d="${blob(x, y, r, r * 0.8, R, 0.16, 12)}" fill="#fffdf7" stroke="#eadfc8" stroke-width="${f1(r * 0.04)}"/>` +
          `<circle cx="${f1(x + r * 0.1)}" cy="${f1(y)}" r="${f1(r * 0.38)}" fill="#ffb300" stroke="#e08a00" stroke-width="${f1(r * 0.04)}"/>` +
          `<ellipse cx="${f1(x - r * 0.02)}" cy="${f1(y - r * 0.14)}" rx="${f1(r * 0.12)}" ry="${f1(r * 0.07)}" fill="#fff" opacity=".7"/></g>`;
      }
      case "scoop": return scoop(it.color, x, y, s * 0.45, R, sh);
      default: return photo(it, x, y, s, R, sh);
    }
  }

  function scoop(c, x, y, r, R, sh) {
    const d = shade(c, -0.18);
    let bumps = "";
    for (let k = 0; k < 7; k++) { const a = Math.PI * (0.05 + k * 0.15); bumps += `<circle cx="${f1(x - Math.cos(a) * r)}" cy="${f1(y + r * 0.45 + Math.sin(a) * r * 0.12)}" r="${f1(r * 0.2)}" fill="${c}"/>`; }
    return `<g filter="url(#${sh})"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" stroke="${d}" stroke-width="${f1(r * 0.05)}"/>${bumps}` +
      `<ellipse cx="${f1(x - r * 0.35)}" cy="${f1(y - r * 0.4)}" rx="${f1(r * 0.28)}" ry="${f1(r * 0.16)}" fill="#fff" opacity=".45"/></g>`;
  }

  // Flächige Darstellungen in einer Region
  function melt(it, reg, R, sh) {
    let o = "";
    const P = points(reg, 7, R);
    for (let k = 0; k < 7; k++) {
      const p = P[k], r = Math.min(reg.rx, reg.ry) * (0.24 + R() * 0.12);
      o += `<path d="${blob(p[0], p[1], r * 1.2, r, R, 0.25, 11)}" fill="${it.color}" stroke="${shade(it.color, -0.12)}" stroke-width=".3" opacity=".95"/>`;
    }
    return `<g filter="url(#${sh})">${o}</g>`;
  }
  function spread(it, reg, R) {
    return `<path d="${blob(reg.cx, reg.cy, reg.rx * 1.08, reg.ry * 1.08, R, 0.05, 22)}" fill="${it.color}" opacity=".93"/>` +
      `<path d="${blob(reg.cx - reg.rx * 0.2, reg.cy - reg.ry * 0.2, reg.rx * 0.5, reg.ry * 0.4, R, 0.2, 12)}" fill="${shade(it.color, 0.2)}" opacity=".35"/>`;
  }
  function drizzle(it, reg, R, k, sh) {
    const n = 9, amp = reg.ry * 0.85, ph = k * 1.3;
    let pts = [];
    for (let i = 0; i <= n; i++) {
      const x = reg.cx - reg.rx + (i / n) * reg.rx * 2;
      pts.push([x, reg.cy + Math.sin(i * 2.2 + ph) * amp * (0.6 + R() * 0.4)]);
    }
    let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i];
      d += `Q${f1(p[0] + (q[0] - p[0]) / 2)},${f1(p[1] + (R() - 0.5) * amp)} ${f1(q[0])},${f1(q[1])}`;
    }
    const w = Math.max(1.4, reg.ry * 0.28);
    return `<g filter="url(#${sh})"><path d="${d}" stroke="${it.color}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" stroke="#fff" stroke-width="${f1(w * 0.25)}" fill="none" opacity=".35" stroke-linecap="round" transform="translate(0 ${f1(-w * 0.2)})"/></g>`;
  }
  function dots(it, reg, R, multi) {
    const cols = ["#ff4d6d", "#ffd23f", "#4cc9f0", "#80ed99", "#c77dff", "#ffffff"];
    let o = "";
    const P = points(reg, 46, R);
    for (let k = 0; k < 46; k++) {
      const p = P[k];
      if (multi) { const a = Math.round(R() * 180); o += `<rect x="${f1(p[0] - 1)}" y="${f1(p[1] - 0.3)}" width="2" height=".7" rx=".35" fill="${cols[k % cols.length]}" transform="rotate(${a} ${f1(p[0])} ${f1(p[1])})"/>`; }
      else o += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(0.45 + R() * 0.35)}" fill="${it.color}" stroke="${shade(it.color, -0.3)}" stroke-width=".12"/>`;
    }
    return o;
  }

  const defs = (sh, extra = "") => `<defs><filter id="${sh}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy=".5" stdDeviation=".6" flood-color="#000" flood-opacity=".45"/></filter>${extra}</defs>`;
  const wrap = (vb, body) => `<svg class="scene" viewBox="0 0 ${vb[0]} ${vb[1]}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

  /* ---------- Szene mit Belag-Region (Pizza, Pasta, Taco, …) ---------- */
  function topped(food, items, o, sc0) {
    let sc = sc0;
    const id = "s" + (++uid), sh = id + "sh";
    const R = rng(hash(food.id + items.map((i) => i.id).join(",") + (o.seed || "")));
    if (sc.adapt) sc = Object.assign({}, sc, sc.adapt(items));
    const reg = sc.region;
    const pop = (it) => (it.id === o.newItem ? ' class="pop"' : "");
    const scat = items.filter((it) => !["sauce", "melt", "dots", "sprinkles", "dollop", "scoop"].includes(it.look));
    const m = Math.max(1, scat.length), copies = sc.copies;
    const pts = sc.fixedPoints || points(reg, m * copies, R);

    let under = "", mid = "", top = "", over = "";
    items.forEach((it, idx) => {
      const lr = rng(hash(food.id + it.id + idx));
      if (it.look === "sauce") {
        if (sc.sauce === "spread") under += `<g${pop(it)}>${spread(it, sc.spreadReg || reg, lr)}</g>`;
        else if (sc.sauce === "syrup") top += `<g${pop(it)}>${sc.syrup(it, lr, sh)}</g>`;
        else top += `<g${pop(it)}>${drizzle(it, sc.drizzleReg || reg, lr, idx, sh)}</g>`;
      } else if (it.look === "melt") under += `<g${pop(it)}>${melt(it, reg, lr, sh)}</g>`;
      else if (it.look === "dots" || it.look === "sprinkles") over += `<g${pop(it)}>${dots(it, sc.dotsReg || reg, lr, it.look === "sprinkles")}</g>`;
      else if (it.look === "dollop") {
        const dp = sc.fixedPoints ? pts.filter((_, k) => k % 2 === idx % 2) : points(reg, 3, lr);
        top += `<g${pop(it)}>${dp.slice(0, 3).map((p) => piece(it, p[0], p[1] - 1, sc.size * 1.05, lr, sh)).join("")}</g>`;
      } else if (it.look === "scoop") { /* von der Eisbecher-Szene gezeichnet */ }
    });
    scat.forEach((it, j) => {
      const lr = rng(hash(food.id + it.id + "s" + j));
      let g = "";
      if (it.look === "egg") { const p = pts[j % pts.length]; g = piece(it, p[0], p[1], sc.size * 1.25, lr, sh); }
      else for (let k = j; k < Math.max(pts.length, j + 1); k += m) { const p = pts[k % pts.length]; g += piece(it, p[0], p[1], sc.size, lr, sh); }
      mid += `<g${pop(it)}>${g}</g>`;
    });
    const scoops = sc.scoops ? sc.scoops(items, pop, sh, R) : "";
    return wrap(sc.vb, defs(sh, sc.defs ? sc.defs(id) : "") + sc.back(id, R) + under + scoops + mid + top + over + (sc.front ? sc.front(id, R) : ""));
  }

  /* ---------- Schichten (Burger, Sandwich) ---------- */
  const LAYER_H = { patty: 10, p: 10, slices: 6, rings: 6, melt: 4, sauce: 3.5, egg: 7, chunks: 7, crumble: 6, shreds: 6, kernels: 6, dots: 4, dollop: 7, sprinkles: 4 };
  function layer(it, y, h, R, sh) {
    const c = it.color, d = shade(c, -0.28), l = shade(c, 0.3);
    const x0 = 9, w = 82;
    switch (it.look) {
      case "p": {
        if (!it.img) break;
        const n = 5, iw = w / n * 1.45;
        let o = "";
        for (let k = 0; k < n; k++) {
          const cx = x0 + (k + 0.5) * (w / n) + (R() - 0.5) * 2;
          o += `<image href="${IMG(it.img)}" x="${f1(cx - iw / 2)}" y="${f1(y - h * 0.35)}" width="${f1(iw)}" height="${f1(h * 1.6)}" preserveAspectRatio="xMidYMid meet" transform="rotate(${Math.round((R() - 0.5) * 24)} ${f1(cx)} ${f1(y + h / 2)})"/>`;
        }
        return `<g filter="url(#${sh})">${o}</g>`;
      }
      case "patty":
        return `<g filter="url(#${sh})"><path d="${blob(50, y + h / 2, w / 2 + 2, h / 2, R, 0.05, 20)}" fill="${c}"/>` +
          Array.from({ length: 22 }, () => `<circle cx="${f1(x0 + 3 + R() * (w - 6))}" cy="${f1(y + 2 + R() * (h - 4))}" r="${f1(0.4 + R() * 0.7)}" fill="${R() > 0.5 ? d : l}" opacity=".7"/>`).join("") +
          `<path d="M${x0 + 6},${f1(y + 2)} Q50,${f1(y - 0.5)} ${x0 + w - 6},${f1(y + 2)}" stroke="${l}" stroke-width=".8" fill="none" opacity=".5"/></g>`;
      case "melt": {
        let drips = "";
        [[x0 + 2, 1], [x0 + w - 6, 1], [x0 + w * 0.35, 0.7], [x0 + w * 0.68, 0.8]].forEach(([dx, k]) => {
          drips += `<path d="M${f1(dx)},${f1(y + h)} l2.5,${f1(4.5 * k)} l2.5,${f1(-4.5 * k)} Z" fill="${c}"/>`;
        });
        return `<g filter="url(#${sh})"><rect x="${x0 - 2}" y="${f1(y)}" width="${w + 4}" height="${f1(h)}" rx="1" fill="${c}"/>${drips}<rect x="${x0}" y="${f1(y + 0.4)}" width="${w}" height=".6" fill="${l}" opacity=".6"/></g>`;
      }
      case "sauce": {
        let p = `M${x0 + 2},${f1(y + h * 0.3)}`;
        for (let k = 0; k <= 8; k++) { const x = x0 + 2 + (k / 8) * (w - 4); p += `Q${f1(x - 2.5)},${f1(y - 0.8 + R())} ${f1(x)},${f1(y + h * 0.3)}`; }
        let drips = "";
        for (let k = 0; k < 4; k++) { const dx = x0 + 8 + R() * (w - 16), L = 2 + R() * 3; drips += `<rect x="${f1(dx)}" y="${f1(y + h * 0.5)}" width="1.6" height="${f1(L)}" rx=".8" fill="${c}"/>`; }
        return `<g filter="url(#${sh})"><path d="${p} L${x0 + w - 2},${f1(y + h)} L${x0 + 2},${f1(y + h)} Z" fill="${c}"/>${drips}</g>`;
      }
      case "slices": case "rings": {
        let o = "";
        const n = 5;
        for (let k = 0; k < n; k++) {
          const cx = x0 + 6 + k * ((w - 12) / (n - 1)) + (R() - 0.5) * 2;
          o += `<ellipse cx="${f1(cx)}" cy="${f1(y + h / 2)}" rx="9.5" ry="${f1(h / 2)}" fill="${c}" stroke="${d}" stroke-width=".6"/>`;
          if (it.look === "rings") o += `<ellipse cx="${f1(cx)}" cy="${f1(y + h / 2)}" rx="5.5" ry="${f1(h / 4)}" fill="${l}" opacity=".7"/>`;
          else o += `<ellipse cx="${f1(cx)}" cy="${f1(y + h / 2 - 0.5)}" rx="6" ry="${f1(h / 5)}" fill="${l}" opacity=".45"/>`;
        }
        return `<g filter="url(#${sh})">${o}</g>`;
      }
      case "egg":
        return `<g filter="url(#${sh})"><path d="${blob(50, y + h * 0.6, w / 2 + 1, h * 0.42, R, 0.1, 16)}" fill="#fffdf7" stroke="#e8dcc4" stroke-width=".4"/>` +
          `<ellipse cx="52" cy="${f1(y + h * 0.42)}" rx="9" ry="${f1(h * 0.42)}" fill="#ffb300" stroke="#e08a00" stroke-width=".4"/>` +
          `<ellipse cx="49" cy="${f1(y + h * 0.25)}" rx="3" ry="1" fill="#fff" opacity=".7"/></g>`;
    }
    // Kleinteiliges: Reihe von Stücken
    let o = "";
    const n = 9;
    for (let k = 0; k < n; k++) {
      const cx = x0 + 4 + k * ((w - 8) / (n - 1));
      o += piece({ ...it, look: it.look === "patty" ? "crumble" : it.look }, cx, y + h / 2, h * 1.6, R, sh);
    }
    return o;
  }

  function stacked(food, items, o, kind) {
    const id = "s" + (++uid), sh = id + "sh";
    const R = rng(hash(food.id + items.map((i) => i.id).join(",")));
    const per = Math.max(o.per || 4, items.length);
    const H = 38 + per * 11 + 6;
    const pop = (it) => (it.id === o.newItem ? ' class="pop"' : "");
    let y = H - 4; // Boden
    let bottom = "", top = "", body = "";
    if (kind === "burger") {
      const bh = 12;
      y -= bh;
      bottom = `<g filter="url(#${sh})"><svg x="7" y="${f1(y)}" width="86" height="${bh}" viewBox="0 58 100 42" preserveAspectRatio="none"><image href="${IMG("sesame_bun")}" x="0" y="0" width="100" height="100" preserveAspectRatio="none"/></svg></g>`;
    } else {
      const bh = 12;
      y -= bh;
      bottom = toast(id, y, bh, sh, false);
    }
    const layers = [];
    items.forEach((it) => {
      const h = LAYER_H[it.look] || 6;
      y -= h * (it.look === "p" ? 0.95 : 1.0);
      layers.push(`<g${pop(it)}>${layer(it, y, h, rng(hash(food.id + it.id)), sh)}</g>`);
    });
    // Schichten von unten nach oben zeichnen (obere überdecken untere)
    body = layers.join("");
    if (kind === "burger") {
      const th = 20;
      top = `<g filter="url(#${sh})"><svg x="6" y="${f1(y - th + 1.5)}" width="88" height="${th}" viewBox="0 6 100 54" preserveAspectRatio="none"><image href="${IMG("sesame_bun")}" x="0" y="0" width="100" height="100" preserveAspectRatio="none"/></svg></g>`;
    } else top = toast(id, y - 10, 12, sh, true);
    const plate = `<ellipse cx="50" cy="${H - 3.5}" rx="46" ry="3.2" fill="#000" opacity=".35"/>`;
    return wrap([100, H], defs(sh) + plate + bottom + body + top);
  }

  function toast(id, y, h, sh, isTop) {
    const r = rng(isTop ? 3 : 4);
    let holes = "";
    for (let k = 0; k < 18; k++) holes += `<ellipse cx="${f1(12 + r() * 76)}" cy="${f1(y + 3 + r() * (h - 6))}" rx="${f1(0.5 + r() * 0.8)}" ry="${f1(0.3 + r() * 0.4)}" fill="#d9b67a" opacity=".7"/>`;
    return `<g filter="url(#${sh})"><rect x="6" y="${f1(y)}" width="88" height="${f1(h)}" rx="${isTop ? 5 : 3}" fill="#a8692a"/>` +
      `<rect x="8.5" y="${f1(y + 2)}" width="83" height="${f1(h - 4)}" rx="2.5" fill="#f5deae"/>${holes}` +
      `<rect x="8.5" y="${f1(y + 2)}" width="83" height="${f1((h - 4) * 0.45)}" rx="2.5" fill="#fff6dc" opacity=".45"/></g>`;
  }

  /* ---------- Szenen-Definitionen ---------- */
  const SCENES = {
    pizza: {
      vb: [100, 100], copies: 6, size: 14, sauce: "spread",
      region: { cx: 50, cy: 50, rx: 33, ry: 33 }, spreadReg: { cx: 50, cy: 50, rx: 38, ry: 38 },
      defs: (id) => `<clipPath id="${id}c"><circle cx="50" cy="50" r="46"/></clipPath><radialGradient id="${id}g"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a2e0c" stop-opacity=".55"/></radialGradient>`,
      back: (id) => `<ellipse cx="50" cy="52" rx="48" ry="47" fill="#000" opacity=".35"/><circle cx="50" cy="50" r="46" fill="#d9a35b"/>` +
        `<image href="${IMG("naan")}" x="-8" y="-8" width="116" height="116" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}c)"/>` +
        `<circle cx="50" cy="50" r="46" fill="url(#${id}g)"/>`
    },
    pasta: {
      vb: [100, 100], copies: 5, size: 13, sauce: "spread",
      region: { cx: 50, cy: 50, rx: 24, ry: 24 }, spreadReg: { cx: 50, cy: 49, rx: 22, ry: 21 },
      back: () => {
        let nest = "", hi = "";
        const r = rng(77);
        for (let k = 0; k < 90; k++) {
          const ox = 50 + (r() - 0.5) * 14, oy = 50 + (r() - 0.5) * 14, rad = 5 + r() * 25;
          const a0 = r() * Math.PI * 2, sw = 1.2 + r() * 2.2, a1 = a0 + sw;
          const x0 = ox + Math.cos(a0) * rad, y0 = oy + Math.sin(a0) * rad, x1 = ox + Math.cos(a1) * rad, y1 = oy + Math.sin(a1) * rad;
          const d = `M${f1(x0)},${f1(y0)}A${f1(rad)},${f1(rad)} 0 ${sw > Math.PI ? 1 : 0} 1 ${f1(x1)},${f1(y1)}`;
          nest += `<path d="${d}" stroke="#b9812c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
          hi += `<path d="${d}" stroke="${r() > 0.5 ? "#f6d27f" : "#eebf5c"}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
        }
        return `<ellipse cx="50" cy="52" rx="49" ry="48" fill="#000" opacity=".3"/><circle cx="50" cy="50" r="47" fill="#f4f2fb"/><circle cx="50" cy="50" r="38" fill="#e6e3f1"/><circle cx="50" cy="50" r="36.5" fill="#f8f7fd"/>` +
          `<circle cx="50" cy="51" r="31" fill="#000" opacity=".12"/>${nest}${hi}`;
      }
    },
    hotdog: {
      vb: [100, 58], copies: 4, size: 10, sauce: "drizzle",
      region: { cx: 50, cy: 22, rx: 37, ry: 4 }, drizzleReg: { cx: 50, cy: 23, rx: 38, ry: 3 }, dotsReg: { cx: 50, cy: 23, rx: 38, ry: 3.5 },
      defs: (id) => `<clipPath id="${id}b"><rect x="5" y="14" width="90" height="26" rx="13"/></clipPath><clipPath id="${id}f"><path d="M5,30 Q50,26 95,30 L95,36 Q95,47 82,47 L18,47 Q5,47 5,36 Z"/></clipPath>` +
        `<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8643a"/><stop offset=".5" stop-color="#a3401e"/><stop offset="1" stop-color="#6e260f"/></linearGradient>`,
      back: (id) => `<ellipse cx="50" cy="50" rx="46" ry="4" fill="#000" opacity=".35"/><rect x="5" y="14" width="90" height="26" rx="13" fill="#c98a3c"/>` +
        `<image href="${IMG("bun")}" x="0" y="-10" width="100" height="60" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}b)" opacity=".95"/>` +
        `<rect x="5" y="14" width="90" height="26" rx="13" fill="#3a1d05" opacity=".25"/>` +
        `<rect x="3" y="20" width="94" height="12" rx="6" fill="url(#${id}s)"/><path d="M8,23 Q50,20.5 92,23" stroke="#e8946b" stroke-width="1.1" fill="none" opacity=".7"/>`,
      front: (id) => `<g filter="url(#${id}sh)"><path d="M5,30 Q50,26 95,30 L95,36 Q95,47 82,47 L18,47 Q5,47 5,36 Z" fill="#d8994a"/>` +
        `<image href="${IMG("bun")}" x="0" y="10" width="100" height="60" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}f)"/></g>`
    },
    taco: {
      vb: [100, 78], copies: 4, size: 12, sauce: "drizzle",
      region: { cx: 50, cy: 33, rx: 33, ry: 7 }, drizzleReg: { cx: 50, cy: 30, rx: 32, ry: 4 }, dotsReg: { cx: 50, cy: 30, rx: 32, ry: 5 },
      defs: (id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d27a"/><stop offset=".55" stop-color="#e9ad4c"/><stop offset="1" stop-color="#c47f27"/></linearGradient>` +
        `<linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d79a3e"/><stop offset="1" stop-color="#9a5e1c"/></linearGradient>`,
      back: (id) => `<ellipse cx="50" cy="74" rx="38" ry="3.5" fill="#000" opacity=".35"/><path d="M13,36 A37,33 0 0 0 87,36 Q50,24 13,36 Z" fill="url(#${id}k)"/>`,
      front: (id) => {
        const r = rng(9);
        let spots = "";
        for (let k = 0; k < 26; k++) {
          const a = Math.PI * (0.08 + r() * 0.84), d = 0.3 + r() * 0.62, x = 50 - Math.cos(a) * 38 * d, y = 39 + Math.sin(a) * 32 * d;
          spots += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(0.8 + r() * 1.6)}" ry="${f1(0.5 + r() * 0.9)}" fill="#8a4b12" opacity="${f1(0.15 + r() * 0.3)}"/>`;
        }
        return `<g filter="url(#${id}sh)"><path d="M10,38 A40,34 0 0 0 90,38 Q50,44 10,38 Z" fill="url(#${id}g)"/>${spots}` +
          `<path d="M16,48 Q30,66 50,70" stroke="#fff" stroke-width="1.4" fill="none" opacity=".25" stroke-linecap="round"/>` +
          `<path d="M11,38.5 Q50,44.5 89,38.5" stroke="#fbe2a0" stroke-width="1.4" fill="none"/></g>`;
      }
    },
    doener: {
      vb: [100, 88], copies: 4, size: 13, sauce: "drizzle",
      region: { cx: 50, cy: 35, rx: 32, ry: 8 }, drizzleReg: { cx: 50, cy: 31, rx: 31, ry: 4.5 }, dotsReg: { cx: 50, cy: 31, rx: 31, ry: 5 },
      defs: (id) => `<clipPath id="${id}f"><path d="M8,40 Q50,48 92,40 Q96,84 50,84 Q4,84 8,40 Z"/></clipPath><clipPath id="${id}b"><path d="M12,40 Q14,22 50,20 Q86,22 88,40 Z"/></clipPath>`,
      back: (id) => `<ellipse cx="50" cy="85" rx="40" ry="3" fill="#000" opacity=".35"/><path d="M12,40 Q14,22 50,20 Q86,22 88,40 Z" fill="#e8c48a"/>` +
        `<image href="${IMG("pita")}" x="-30" y="0" width="160" height="110" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}b)"/><path d="M12,40 Q14,22 50,20 Q86,22 88,40 Z" fill="#3a2205" opacity=".3"/>`,
      front: (id) => `<g filter="url(#${id}sh)"><path d="M8,40 Q50,48 92,40 Q96,84 50,84 Q4,84 8,40 Z" fill="#efcf96"/>` +
        `<image href="${IMG("pita")}" x="-40" y="22" width="180" height="125" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}f)"/>`+
        `<path d="M8,40 Q50,48 92,40 Q96,84 50,84 Q4,84 8,40 Z" fill="#fff3d0" opacity=".12"/>` +
        `<path d="M9,40.5 Q50,48.5 91,40.5" stroke="#fff3d8" stroke-width="1.2" fill="none" opacity=".8"/></g>`
    },
    sushi: {
      vb: [100, 72], copies: 1, size: 12.5, sauce: "drizzle",
      region: { cx: 50, cy: 38, rx: 30, ry: 12 }, drizzleReg: { cx: 50, cy: 38, rx: 34, ry: 9 }, dotsReg: { cx: 50, cy: 38, rx: 36, ry: 16 },
      fixedPoints: [[24, 28], [50, 28], [76, 28], [24, 50], [50, 50], [76, 50]],
      back: () => {
        let rolls = "";
        [[24, 28], [50, 28], [76, 28], [24, 50], [50, 50], [76, 50]].forEach(([x, y], k) => {
          const r = rng(k + 5);
          let grains = "";
          for (let g = 0; g < 14; g++) { const a = r() * 6.28, d = r() * 6.5; grains += `<ellipse cx="${f1(x + Math.cos(a) * d)}" cy="${f1(y + Math.sin(a) * d)}" rx=".9" ry=".5" fill="#e9e6dc" transform="rotate(${Math.round(r() * 180)} ${f1(x + Math.cos(a) * d)} ${f1(y + Math.sin(a) * d)})"/>`; }
          rolls += `<circle cx="${x}" cy="${y + 1.2}" r="10.5" fill="#000" opacity=".35"/><circle cx="${x}" cy="${y}" r="10.2" fill="#1d2a1f"/><circle cx="${x}" cy="${y}" r="9.3" fill="#2c3d2c"/><circle cx="${x}" cy="${y}" r="8" fill="#fbfaf5"/>${grains}`;
        });
        let grain = "";
        for (let k = 0; k < 8; k++) grain += `<path d="M6,${16 + k * 6} Q50,${14 + k * 6 + (k % 2 ? 2 : -2)} 94,${16 + k * 6}" stroke="#8a5a2b" stroke-width=".5" fill="none" opacity=".45"/>`;
        return `<rect x="4" y="12" width="92" height="56" rx="5" fill="#000" opacity=".35" transform="translate(0 2)"/><rect x="4" y="12" width="92" height="56" rx="5" fill="#c58b52"/>${grain}<rect x="4" y="12" width="92" height="56" rx="5" fill="none" stroke="#8a5a2b" stroke-width="1"/>${rolls}`;
      }
    },
    pancakes: {
      vb: [100, 84], copies: 3, size: 11, sauce: "syrup",
      region: { cx: 50, cy: 30, rx: 24, ry: 5.5 }, dotsReg: { cx: 50, cy: 31, rx: 30, ry: 7 },
      back: () => {
        let stack = "";
        for (let k = 0; k < 4; k++) {
          const y = 66 - k * 9;
          stack += `<ellipse cx="50" cy="${y + 4}" rx="34" ry="9" fill="#a8622a"/><rect x="16" y="${y - 2}" width="68" height="6" fill="#c47a35"/><ellipse cx="50" cy="${y - 2}" rx="34" ry="9" fill="#e6ae66"/><ellipse cx="50" cy="${y - 2}" rx="28" ry="6.5" fill="#efc07a" opacity=".6"/>`;
        }
        return `<ellipse cx="50" cy="74" rx="48" ry="9" fill="#000" opacity=".3"/><ellipse cx="50" cy="72" rx="46" ry="9" fill="#f4f2fb"/><ellipse cx="50" cy="71" rx="38" ry="6.5" fill="#e6e3f1"/>${stack}`;
      },
      syrup: (it, R, sh) => {
        let drips = "";
        for (let k = 0; k < 5; k++) { const x = 22 + k * 14 + (R() - 0.5) * 4, L = 8 + R() * 18; drips += `<path d="M${f1(x - 1.6)},34 L${f1(x - 1.4)},${f1(34 + L)} Q${f1(x)},${f1(37 + L)} ${f1(x + 1.4)},${f1(34 + L)} L${f1(x + 1.6)},34 Z" fill="${it.color}"/>`; }
        return `<g filter="url(#${sh})" opacity=".92"><path d="${blob(50, 31, 29, 7, R, 0.1, 16)}" fill="${it.color}"/>${drips}<ellipse cx="42" cy="29" rx="8" ry="1.5" fill="#fff" opacity=".3"/></g>`;
      }
    },
    sundae: {
      vb: [100, 104], copies: 3, size: 13, sauce: "drizzle",
      region: { cx: 50, cy: 31, rx: 24, ry: 9 }, drizzleReg: { cx: 50, cy: 33, rx: 26, ry: 6 }, dotsReg: { cx: 50, cy: 30, rx: 26, ry: 11 },
      defs: (id) => `<linearGradient id="${id}gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8f4ff" stop-opacity=".38"/><stop offset=".3" stop-color="#fff" stop-opacity=".06"/><stop offset=".8" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#e8f4ff" stop-opacity=".32"/></linearGradient>`,
      adapt: (items) => items.some((i) => i.look === "scoop") ? {} : {
        region: { cx: 50, cy: 58, rx: 17, ry: 6 }, drizzleReg: { cx: 50, cy: 56, rx: 20, ry: 4 }, dotsReg: { cx: 50, cy: 56, rx: 20, ry: 6 }
      },
      back: () => `<ellipse cx="50" cy="100" rx="22" ry="3" fill="#000" opacity=".35"/>`,
      scoops: (items, pop, sh) => {
        const sc = items.filter((i) => i.look === "scoop");
        const pos = sc.length === 1 ? [[50, 38]] : sc.length === 2 ? [[38, 39], [62, 39]] : [[36, 41], [64, 41], [50, 27]];
        return sc.slice(0, 3).map((it, k) => `<g${pop(it)}>${scoop(it.color, pos[k][0], pos[k][1], 17, rng(k + 1), sh)}</g>`).join("");
      },
      front: (id) => `<path d="M22,46 Q24,74 46,76 L46,90 Q34,92 32,98 L68,98 Q66,92 54,90 L54,76 Q76,74 78,46 Z" fill="url(#${id}gl)" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>` +
        `<ellipse cx="50" cy="46" rx="28" ry="4" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><path d="M27,52 Q29,68 40,72" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>`
    }
  };

  /* ---------- öffentliche Funktionen ---------- */
  window.renderScene = function (food, itemIds, o = {}) {
    const items = itemIds.map((id) => food.items[id]);
    if (food.scene === "burger" || food.scene === "sandwich") return stacked(food, items, o, food.scene);
    return topped(food, items, o, SCENES[food.scene]);
  };

  // kleines Bild für Karten, Slots und Chips
  window.itemPic = function (it, cls = "") {
    if (it.img) return `<img class="ipic ${cls}" src="${IMG(it.img)}" alt="" onerror="this.outerHTML='<span class=&quot;ipic emo ${cls}&quot;>${it.emoji}</span>'">`;
    const id = "p" + (++uid);
    return `<svg class="ipic ${cls}" viewBox="0 0 40 40">${defs(id + "sh")}${piece(it, 20, 21, 36, rng(hash(it.name)), id + "sh")}</svg>`;
  };
})();
