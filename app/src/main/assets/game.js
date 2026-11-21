"use strict";
/* ============================================================
   20$ GAME  –  Bieten, bauen, gewinnen.
   ============================================================ */

const START_MONEY = 20;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const foodById = (id) => FOODS.find((f) => f.id === id);
const itemOf = (food, id) => food.items[id];

function load(key, def) {
  try { const v = JSON.parse(localStorage.getItem("g20_" + key)); return v == null ? def : Object.assign(Array.isArray(def) ? [] : {}, def, v); }
  catch (e) { return def; }
}
function save(key, val) { try { localStorage.setItem("g20_" + key, JSON.stringify(val)); } catch (e) {} }

let settings = load("settings", { names: ["Spieler 1", "Spieler 2"], table: false, perPlayer: 4, sound: true });
let stats = load("stats", {});
let G = null;          // aktueller Spielzustand
let history = [];      // für Rückgängig
let resultTimer = null;
let lastRenderedAward = null;
let prevMoney = [START_MONEY, START_MONEY];

/* ---------------- Sound & Vibration ---------------- */
let actx = null;
function tone(freq, dur, type = "sine", vol = 0.12, delay = 0) {
  if (!settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const t = actx.currentTime + delay;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  } catch (e) {}
}
const sfx = {
  tap: () => tone(520, 0.06, "triangle", 0.08),
  bid: (k) => { tone(660, 0.08, "square", 0.05); if (k === 2) tone(880, 0.1, "square", 0.05, 0.07); },
  pass: () => tone(220, 0.15, "sine", 0.1),
  win: () => [523, 659, 784].forEach((f, i) => tone(f, 0.18, "triangle", 0.1, i * 0.09)),
  none: () => { tone(300, 0.15, "sawtooth", 0.05); tone(200, 0.25, "sawtooth", 0.05, 0.12); },
  fanfare: () => [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, 0.22, "triangle", 0.11, i * 0.12)),
  drum: () => { for (let i = 0; i < 14; i++) tone(90 + Math.random() * 40, 0.06, "square", 0.05, i * 0.12); },
};
function buzz(ms = 15) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }

/* ---------------- Helpers ---------------- */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function textOn(hex) {
  if (!hex || hex[0] !== "#") return "#fff";
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? "#2a1a0a" : "#fff";
}
function name(i) { return G ? G.players[i].name : settings.names[i]; }
function pColor(i) { return i === 0 ? "var(--p0)" : "var(--p1)"; }
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === "screen-" + id));
}
let toastTimer = null;
function toast(html, ms = 1400, flip = false) {
  const t = $("#toast");
  t.innerHTML = html; t.classList.toggle("flip", flip); t.classList.remove("hidden");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add("hidden"), ms);
}

/* ---------------- Modal ---------------- */
let modalOnClose = null;
function openModal(html, { flip = false, onClose = null, locked = false } = {}) {
  $("#modalCard").innerHTML = html;
  const m = $("#modal");
  m.classList.toggle("flip", flip);
  m.classList.remove("hidden");
  m.dataset.locked = locked ? "1" : "";
  modalOnClose = onClose;
}
function closeModal() {
  const m = $("#modal");
  if (m.classList.contains("hidden")) return;
  m.classList.add("hidden");
  const cb = modalOnClose; modalOnClose = null; cb && cb();
}
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal" && !$("#modal").dataset.locked) closeModal(); });

/* ============================================================
   HOME
   ============================================================ */
function renderHome() {
  const foods = FOODS.map((f) => `
    <button class="food-card" data-food="${f.id}">
      <span class="fpic">${foodPic(f)}</span><span class="fn">${esc(f.name)}</span>
    </button>`).join("");
  const sb = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  $("#screen-home").innerHTML = `
    <div class="logo"><span class="big">20$</span><span class="small">GAME</span></div>
    <p class="tag">BIETEN · BAUEN · GEWINNEN</p>

    <div class="players-setup">
      <label class="pin p0"><span>Spieler 1</span><input id="n0" maxlength="14" value="${esc(settings.names[0])}"></label>
      <div class="vs">VS</div>
      <label class="pin p1"><span>Spieler 2</span><input id="n1" maxlength="14" value="${esc(settings.names[1])}"></label>
    </div>

    <div class="section-title">Wähle das Essen</div>
    <div class="food-grid">
      ${foods}
      <button class="food-card random" data-food="random"><span class="fe">🎲</span><span class="fn">Zufall</span></button>
      <button class="food-card" id="rulesCard"><span class="fe">📖</span><span class="fn">Regeln</span></button>
    </div>

    <div class="section-title">Einstellungen</div>
    <div class="settings">
      <div class="set-row" id="tableRow">
        <div class="st"><b>🍽️ Table-Mode</b><small>Gegenüber am Tisch: die Hälfte des Gegners ist gedreht, die Steuerung dreht sich zum Spieler, der dran ist.</small></div>
        <div class="toggle ${settings.table ? "on" : ""}"></div>
      </div>
      <div class="set-row">
        <div class="st"><b>🔁 Items pro Person</b><small>Standard: 4</small></div>
        <div class="stepper"><button id="rMinus">−</button><span id="rVal">${perPlayer()}</span><button id="rPlus">+</button></div>
      </div>
      <div class="set-row" id="soundRow">
        <div class="st"><b>🔊 Sound</b><small>Effekte beim Bieten</small></div>
        <div class="toggle ${settings.sound ? "on" : ""}"></div>
      </div>
    </div>

    ${sb.length ? `<div class="scoreboard"><h4>🏆 Siege</h4>${sb.map(([n, w]) => `<div class="sb-row"><span>${esc(n)}</span><b>${w}</b></div>`).join("")}
      <div class="row-btns" style="margin-top:8px"><button class="ghost-btn" id="resetStats" style="padding:10px;font-size:13px">Zurücksetzen</button></div></div>` : ""}
    <div class="credits">Jeder startet mit $${START_MONEY} und bekommt ${perPlayer()} Zutaten.<br>Fotos: TheMealDB</div>
  `;

  const saveNames = () => {
    settings.names = [0, 1].map((i) => ($("#n" + i).value.trim() || `Spieler ${i + 1}`));
    save("settings", settings);
  };
  $("#n0").addEventListener("change", saveNames);
  $("#n1").addEventListener("change", saveNames);
  document.querySelectorAll("[data-food]").forEach((b) => b.addEventListener("click", () => {
    saveNames(); sfx.tap(); buzz();
    let id = b.dataset.food;
    if (id === "random") id = FOODS[Math.floor(Math.random() * FOODS.length)].id;
    newGame(id);
  }));
  $("#rulesCard").addEventListener("click", showRules);
  $("#tableRow").addEventListener("click", () => { settings.table = !settings.table; save("settings", settings); sfx.tap(); renderHome(); });
  $("#soundRow").addEventListener("click", () => { settings.sound = !settings.sound; save("settings", settings); sfx.tap(); renderHome(); });
  $("#rMinus").addEventListener("click", () => { settings.perPlayer = Math.max(1, perPlayer() - 1); save("settings", settings); $("#rVal").textContent = settings.perPlayer; sfx.tap(); });
  $("#rPlus").addEventListener("click", () => { settings.perPlayer = Math.min(8, perPlayer() + 1); save("settings", settings); $("#rVal").textContent = settings.perPlayer; sfx.tap(); });
  const rs = $("#resetStats");
  rs && rs.addEventListener("click", () => {
    openModal(`<h2>Siege zurücksetzen?</h2><div class="mbtns"><button class="mbtn danger" id="yes">Ja, löschen</button><button class="mbtn" id="no">Abbrechen</button></div>`);
    $("#yes").onclick = () => { stats = {}; save("stats", stats); closeModal(); renderHome(); };
    $("#no").onclick = closeModal;
  });
}

function showRules() {
  openModal(`
    <h2>📖 So geht's</h2>
    <ul>
      <li>Ihr wählt ein Essen (z.B. Burger). Jeder hat <b>$${START_MONEY}</b>.</li>
      <li>Jeder bekommt <b>${perPlayer()} Zutaten</b>. Es kommen so lange zufällige Zutaten (von 18), bis beide voll sind. Für jede wird abwechselnd geboten: <b>+1 $</b>, <b>+2 $</b> oder <b>Passen</b>.</li>
      <li>Wer passt, lässt den anderen mit seinem Höchstgebot gewinnen. Nur der Gewinner zahlt.</li>
      <li>Passen beide, ohne dass jemand geboten hat, kriegt <b>keiner</b> das Item.</li>
      <li>Wer zuerst bietet, wechselt jedes Item.</li>
      <li>Ist einer schon <b>voll</b>, bekommt der andere die nächsten Zutaten gratis angeboten: <b>nehmen</b> oder <b>überspringen</b>.</li>
      <li>Ist einer <b>pleite</b>, entscheidet der andere bei jedem Item: <b>selbst nehmen</b> oder <b>dem anderen geben</b> (gratis). Sind beide pleite, entscheidet der, der dran gewesen wäre.</li>
      <li>Am Ende einigt ihr euch, wer gewonnen hat. Wenn nicht: <b>die App-Jury entscheidet</b> – jedes Item hat eine geheime Bewertung, gute Kombos geben Bonus, ekliges Zeug gibt Minuspunkte 🤢.</li>
    </ul>
    <p>🍽️ <b>Table-Mode:</b> Handy flach zwischen euch auf den Tisch legen – jeder sieht seine Seite richtig herum.</p>
    <div class="mbtns"><button class="mbtn primary" id="ok">Los geht's!</button></div>
  `);
  $("#ok").onclick = closeModal;
}

/* ============================================================
   SPIEL-LOGIK
   ============================================================ */
function perPlayer() { return Math.max(1, Math.min(8, Number(settings.perPlayer) || 4)); }
function isFull(i) { return G.players[i].items.length >= G.per; }
function needed(i) { return Math.max(0, G.per - G.players[i].items.length); }

function newGame(foodId) {
  const food = foodById(foodId);
  G = {
    foodId,
    players: [0, 1].map((i) => ({ name: settings.names[i] || `Spieler ${i + 1}`, money: START_MONEY, items: [] })),
    queue: shuffle(food.items.map((it) => it.id)),
    per: perPlayer(),
    round: 0,
    firstStarter: Math.random() < 0.5 ? 0 : 1,
    phase: "bid",
    a: null,
  };
  history = [];
  lastRenderedAward = null;
  prevMoney = [START_MONEY, START_MONEY];
  clearTimeout(resultTimer);
  startRound();
  showScreen("game");
  $("#screen-game").classList.toggle("table", !!settings.table);
  renderGame();
  setTimeout(() => toast(`🪙 <span style="color:${pColor(G.a.turn)}">${esc(name(G.a.turn))}</span> beginnt!`, 1500, settings.table && G.a.turn === 1), 250);
}

function roundStarter() { return (G.firstStarter + G.round) % 2; }

function startRound() {
  const s = roundStarter();
  const m = G.players.map((p) => p.money);
  G.a = { itemId: G.queue[G.round], high: 0, highBy: null, turn: s, passed: [false, false], log: [], winner: null, price: 0 };
  if (isFull(0) || isFull(1)) {
    G.phase = "fill";
    G.a.turn = isFull(0) ? 1 : 0;
  } else if (m[0] === 0 || m[1] === 0) {
    G.phase = "decide";
    // Wer noch Geld hat, entscheidet. Sind beide pleite, entscheidet der Startspieler dieser Runde.
    G.a.turn = (m[0] === 0 && m[1] === 0) ? s : (m[0] === 0 ? 1 : 0);
  } else {
    G.phase = "bid";
  }
}

function snapshot() { history.push(JSON.stringify(G)); if (history.length > 200) history.shift(); }

function doBid(k) {
  if (G.phase !== "bid") return;
  const p = G.a.turn, nb = G.a.high + k;
  if (nb > G.players[p].money) return;
  snapshot();
  G.a.high = nb; G.a.highBy = p;
  G.a.log.push({ p, t: `+${k} → $${nb}` });
  G.a.turn = 1 - p;
  sfx.bid(k); buzz(12);
  renderGame();
}

function doPass() {
  if (G.phase !== "bid") return;
  snapshot();
  const p = G.a.turn, o = 1 - p;
  G.a.log.push({ p, t: "passt" });
  sfx.pass(); buzz(25);
  if (G.a.highBy === o) return award(o, G.a.high);
  if (G.a.high === 0 && G.a.passed[o]) return award(null, 0);
  G.a.passed[p] = true;
  G.a.turn = o;
  renderGame();
}

function doFill(take) {
  if (G.phase !== "fill") return;
  const p = G.a.turn;
  if (!take && G.queue.length - G.round <= needed(p)) return;
  snapshot();
  sfx.tap(); buzz(20);
  award(take ? p : null, 0);
}

function doDecide(take) {
  if (G.phase !== "decide") return;
  snapshot();
  const d = G.a.turn;
  sfx.tap(); buzz(20);
  award(take ? d : 1 - d, 0);
}

function award(w, price) {
  G.phase = "result";
  G.a.winner = w; G.a.price = price;
  if (w !== null) {
    G.players[w].money -= price;
    G.players[w].items.push(G.a.itemId);
    sfx.win();
  } else sfx.none();
  renderGame();
  clearTimeout(resultTimer);
  resultTimer = setTimeout(nextRound, 2200);
}

function nextRound() {
  clearTimeout(resultTimer);
  if (!G || G.phase !== "result") return;
  snapshot();
  G.round++;
  if ((isFull(0) && isFull(1)) || G.round >= G.queue.length) { G.phase = "end"; renderEnd(); return; }
  startRound();
  renderGame();
}

function undo() {
  if (!history.length) return;
  clearTimeout(resultTimer);
  G = JSON.parse(history.pop());
  // Ergebnis-Anzeigen beim Zurückspringen überspringen
  if (G.phase === "result" && history.length) G = JSON.parse(history.pop());
  lastRenderedAward = null;
  sfx.tap();
  if (G.phase === "end") { renderEnd(); return; }
  showScreen("game");
  renderGame();
}

/* ============================================================
   BILDER
   ============================================================ */
const MEAL_PHOTOS = { burger: 1, pizza: 1, tacos: 1, sushi: 1, pancakes: 1, eis: 1, sandwich: 1, pasta: 1 };
const SAMPLE = { hotdog: [0, 1, 2, 13], doener: [0, 11, 7, 2] };
function foodPic(f) {
  if (MEAL_PHOTOS[f.id]) return `<img src="img/meal/${f.id}.webp" alt="" onerror="this.outerHTML='<span class=&quot;fe&quot;>${f.emoji}</span>'">`;
  return renderScene(f, SAMPLE[f.id] || [], { per: 4 });
}
function sceneHTML(food, itemIds, opts = {}) {
  return renderScene(food, itemIds, Object.assign({ per: G ? G.per : 4 }, opts));
}

/* ============================================================
   RENDER: SPIEL
   ============================================================ */
function renderPlayer(i) {
  const food = foodById(G.foodId), p = G.players[i];
  const el = $("#pa" + i);
  const isTurn = (G.phase === "bid" || G.phase === "decide" || G.phase === "fill") && G.a.turn === i;
  const newItem = (G.phase === "result" && G.a.winner === i && lastRenderedAward !== G.round + ":" + i) ? G.a.itemId : null;
  el.classList.toggle("active", isTurn);
  el.classList.toggle("dim", (G.phase === "bid" || G.phase === "decide" || G.phase === "fill") && !isTurn);
  const spent = prevMoney[i] !== p.money;
  el.innerHTML = `
    <div class="pa-head">
      <div class="pa-name"><span class="dot"></span><span class="nm">${esc(p.name)}</span></div>
      <div class="pa-money ${spent ? "spent" : ""} ${p.money === 0 ? "broke" : ""}">$${p.money}</div>
    </div>
    <div class="slots">${Array.from({ length: G.per }, (_, k) => p.items[k] !== undefined ? `<span class="slot full">${itemPic(itemOf(food, p.items[k]))}</span>` : `<span class="slot"></span>`).join("")}
      <span class="pa-sub">${p.items.length}/${G.per}${p.money === 0 ? " · pleite 💸" : ""}</span></div>
    <div class="pa-build">${sceneHTML(food, p.items, { newItem })}</div>`;
  if (newItem !== null) lastRenderedAward = G.round + ":" + i;
  prevMoney[i] = p.money;
}

function renderGame() {
  const food = foodById(G.foodId);
  const it = itemOf(food, G.a.itemId);
  const a = G.a, t = a.turn, o = 1 - t;
  renderPlayer(0); renderPlayer(1);

  const flip = settings.table && t === 1;
  $("#center").classList.toggle("flip", flip);
  $("#screen-game").classList.toggle("table", !!settings.table);

  const head = `
    <div class="c-head">
      <span>${esc(food.name)}</span>
      <span class="rnd">Zutat ${G.round + 1}</span>
      <span class="grow"></span>
      <button class="icon-btn" id="undoBtn" ${history.length ? "" : "disabled"}>↶</button>
      <button class="icon-btn" id="menuBtn">⋮</button>
    </div>
    `;

  let body = "";
  if (G.phase === "bid") {
    const money = G.players[t].money;
    const bidTxt = a.highBy === null
      ? (a.passed[o] ? `${esc(name(o))} hat gepasst – noch kein Gebot` : "Noch kein Gebot")
      : `Höchstgebot: <b>$${a.high}</b> von <span style="color:${pColor(a.highBy)}">${esc(name(a.highBy))}</span>`;
    const canAny = a.high + 1 <= money;
    let passHint = "nicht bieten";
    if (a.highBy === o) passHint = `${esc(name(o))} kriegt's für $${a.high}`;
    else if (a.passed[o]) passHint = "keiner kriegt's";
    body = `
      <div class="item-card">
        <div class="item-emoji" ${a.log.length ? 'style="animation:none"' : ""}>${itemPic(it)}</div>
        <div class="item-info">
          <div class="item-name">${esc(it.name)}</div>
          <div class="bid-line">${bidTxt}</div>
        </div>
      </div>
      <div class="bid-log">${a.log.slice(-4).map((l) => `<span class="chip c${l.p}">${esc(name(l.p))} ${l.t}</span>`).join("")}</div>
      <div class="turn" style="--tc:${pColor(t)}">
        ${settings.table ? "👉" : "📱"} ${esc(name(t))} ist dran
        <small>${canAny ? `Du hast $${money}` : `Nur $${money} – du kannst nicht überbieten`}</small>
      </div>
      <div class="btns">
        <button class="bbtn" id="b1" ${a.high + 1 <= money ? "" : "disabled"}>+1 $<small>→ $${a.high + 1}</small></button>
        <button class="bbtn" id="b2" ${a.high + 2 <= money ? "" : "disabled"}>+2 $<small>→ $${a.high + 2}</small></button>
        <button class="bbtn pass" id="bp">Passen<small>${passHint}</small></button>
      </div>`;
  } else if (G.phase === "decide") {
    const both = G.players[0].money === 0 && G.players[1].money === 0;
    body = `
      <div class="item-card">
        <div class="item-emoji">${itemPic(it)}</div>
        <div class="item-info">
          <div class="item-label">${both ? "Beide pleite 💸" : `${esc(name(o))} ist pleite 💸`}</div>
          <div class="item-name">${esc(it.name)}</div>
          <div class="bid-line">Gratis – du entscheidest, wer's kriegt.</div>
        </div>
      </div>
      <div class="turn" style="--tc:${pColor(t)}">${settings.table ? "👉" : "📱"} ${esc(name(t))} entscheidet</div>
      <div class="btns two">
        <button class="bbtn take" id="dTake">Ich nehm's<small>😋 auf meins</small></button>
        <button class="bbtn give" id="dGive">${esc(name(o))} kriegt's<small>😈 ab zum Gegner</small></button>
      </div>`;
  } else if (G.phase === "fill") {
    const left = G.queue.length - G.round, need = needed(t), must = left <= need;
    body = `
      <div class="item-card">
        <div class="item-emoji">${itemPic(it)}</div>
        <div class="item-info">
          <div class="item-label">${esc(name(o))} ist voll ✅</div>
          <div class="item-name">${esc(it.name)}</div>
          <div class="bid-line">Gratis für dich – noch ${need} ${need === 1 ? "Zutat" : "Zutaten"} frei.</div>
        </div>
      </div>
      <div class="turn" style="--tc:${pColor(t)}">${settings.table ? "👉" : "📱"} ${esc(name(t))} entscheidet
        <small>${must ? "Nicht mehr genug Zutaten übrig – du musst nehmen" : `Noch ${left} im Topf`}</small></div>
      <div class="btns two">
        <button class="bbtn take" id="fTake">Nehmen<small>😋 aufs Essen</small></button>
        <button class="bbtn pass" id="fSkip" ${must ? "disabled" : ""}>Überspringen<small>nächste Zutat</small></button>
      </div>`;
  } else if (G.phase === "result") {
    const w = a.winner;
    body = w === null ? `
      <div class="result none" id="resTap">
        <div class="big-emoji">${itemPic(it)}</div>
        <h3>Keiner will ${esc(it.name)} 🙅</h3>
        <p>Die Zutat fliegt raus.</p>
        <div class="tap">Tippen zum Weiterspielen</div>
      </div>` : `
      <div class="result" id="resTap">
        <div class="big-emoji">${itemPic(it)}</div>
        <h3><span style="color:${pColor(w)}">${esc(name(w))}</span> kriegt ${esc(it.name)}!</h3>
        <p>${a.price > 0 ? `für <b style="color:var(--gold)">$${a.price}</b> · noch $${G.players[w].money} übrig` : "gratis 🎁"}</p>
        <div class="tap">Tippen zum Weiterspielen</div>
      </div>`;
  }
  $("#centerInner").innerHTML = head + body;

  $("#undoBtn").onclick = undo;
  $("#menuBtn").onclick = openGameMenu;
  const on = (id, fn) => { const e = $("#" + id); e && (e.onclick = fn); };
  on("b1", () => doBid(1)); on("b2", () => doBid(2)); on("bp", doPass);
  on("dTake", () => doDecide(true)); on("dGive", () => doDecide(false));
  on("fTake", () => doFill(true)); on("fSkip", () => doFill(false));
  on("resTap", nextRound);
}

function openGameMenu() {
  sfx.tap();
  const flip = settings.table && G && G.a && G.a.turn === 1 && G.phase !== "end";
  openModal(`
    <h2>⏸️ Pause</h2>
    <div class="mbtns">
      <button class="mbtn primary" id="mRes">Weiterspielen</button>
      <button class="mbtn" id="mUndo" ${history.length ? "" : "disabled style='opacity:.4'"}>↶ Rückgängig</button>
      <button class="mbtn" id="mTable">🍽️ Table-Mode: ${settings.table ? "AN" : "AUS"}</button>
      <button class="mbtn" id="mSound">🔊 Sound: ${settings.sound ? "AN" : "AUS"}</button>
      <button class="mbtn" id="mRules">📖 Regeln</button>
      <button class="mbtn danger" id="mQuit">Spiel beenden</button>
    </div>`, { flip });
  $("#mRes").onclick = closeModal;
  $("#mUndo").onclick = () => { closeModal(); undo(); };
  $("#mTable").onclick = () => { settings.table = !settings.table; save("settings", settings); closeModal(); renderGame(); };
  $("#mSound").onclick = () => { settings.sound = !settings.sound; save("settings", settings); closeModal(); };
  $("#mRules").onclick = showRules;
  $("#mQuit").onclick = confirmQuit;
}

function confirmQuit() {
  openModal(`
    <h2>Spiel beenden?</h2>
    <p>Der aktuelle Fortschritt geht verloren.</p>
    <div class="mbtns">
      <button class="mbtn danger" id="qYes">Ja, zum Menü</button>
      <button class="mbtn" id="qNo">Weiterspielen</button>
    </div>`, { flip: settings.table && G && G.a && G.a.turn === 1 && G.phase !== "end" });
  $("#qYes").onclick = () => { closeModal(); goHome(); };
  $("#qNo").onclick = closeModal;
}

function goHome() {
  clearTimeout(resultTimer);
  G = null; history = [];
  renderHome();
  showScreen("home");
}

/* ============================================================
   ENDE & JURY
   ============================================================ */
function renderEnd() {
  const food = foodById(G.foodId);
  showScreen("end");
  const scr = $("#screen-end");
  scr.classList.toggle("table", !!settings.table);
  const ep = (i) => {
    const p = G.players[i];
    const chips = p.items.map((id) => { const it = itemOf(food, id); return `<span class="chip">${itemPic(it)} ${esc(it.name)}</span>`; }).join("") || `<span class="chip">nichts 😶</span>`;
    return `<div class="ep" id="ep${i}">
      <div class="pa-head">
        <div class="pa-name"><span class="dot"></span><span class="nm">${esc(p.name)}</span></div>
        <div class="pa-money">$${p.money}</div>
      </div>
      <div class="pa-build">${sceneHTML(food, p.items, { size: "lg" })}</div>
      <div class="chips">${chips}</div>
    </div>`;
  };
  scr.innerHTML = `
    ${ep(1)}
    <div class="end-center">
      <h2>🍽️ Fertig! Wer hat gewonnen?</h2>
      <div class="end-btns">
        <button class="win-btn w0" id="w0">🏆 ${esc(name(0))}</button>
        <button class="win-btn w1" id="w1">🏆 ${esc(name(1))}</button>
        <button class="judge-btn" id="wj">🤷 Uneinig – App entscheidet</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="ghost-btn" id="eUndo" style="padding:10px;font-size:13px">↶ Zurück</button>
        <button class="ghost-btn" id="eHome" style="padding:10px;font-size:13px">Menü</button>
      </div>
    </div>
    ${ep(0)}`;
  $("#w0").onclick = () => declareWinner(0, false);
  $("#w1").onclick = () => declareWinner(1, false);
  $("#wj").onclick = judge;
  $("#eUndo").onclick = undo;
  $("#eHome").onclick = goHome;
  sfx.fanfare();
}

function scoreFor(i) {
  const food = foodById(G.foodId), p = G.players[i];
  const names = new Set(p.items.map((id) => itemOf(food, id).name));
  const rows = p.items.map((id) => { const it = itemOf(food, id); return { label: it.name, pic: itemPic(it, "xs"), v: it.score, cls: it.score >= 0 ? "pos" : "neg" }; });
  for (const [need, bonus, label] of food.combos) {
    if (need.every((n) => names.has(n))) rows.push({ label: `✨ ${label}`, v: bonus, cls: "combo" });
  }
  if (!p.items.length) rows.push({ label: "😶 Leerer Teller", v: -5, cls: "neg" });
  const moneyBonus = Math.round(p.money * 0.2 * 10) / 10;
  if (moneyBonus > 0) rows.push({ label: `💰 Restgeld $${p.money}`, v: moneyBonus, cls: "pos" });
  const total = Math.round(rows.reduce((s, r) => s + r.v, 0) * 10) / 10;
  return { rows, total };
}

function judge() {
  sfx.drum(); buzz(40);
  openModal(`
    <div class="judging">
      <div class="plates"><span class="jp">${sceneHTML(foodById(G.foodId), G.players[0].items)}</span><span>🧑‍🍳</span><span class="jp">${sceneHTML(foodById(G.foodId), G.players[1].items)}</span></div>
      <p>Die Jury probiert …</p>
      <div class="item-label">Geschmack · Kombos · Ekel-Faktor</div>
    </div>`, { locked: true });
  setTimeout(() => {
    const s = [scoreFor(0), scoreFor(1)];
    let w, tie = false;
    if (s[0].total === s[1].total) { tie = true; w = Math.random() < 0.5 ? 0 : 1; }
    else w = s[0].total > s[1].total ? 0 : 1;
    declareWinner(w, true, s, tie);
  }, 2300);
}

function declareWinner(w, byJury, scores = null, tie = false) {
  stats[G.players[w].name] = (stats[G.players[w].name] || 0) + 1;
  save("stats", stats);
  sfx.fanfare(); buzz(60); confetti(w);
  const food = foodById(G.foodId);
  const fmt = (v) => (v > 0 ? "+" : "") + (Number.isInteger(v) ? v : v.toFixed(1));
  const bd = scores ? `<div class="breakdown">${[0, 1].map((i) => `
      <div class="bd ${i === w ? "win" : ""}">
        <h4 style="color:${pColor(i)}">${esc(name(i))}</h4>
        ${scores[i].rows.map((r) => `<div class="bd-row"><span>${r.pic || ""}${esc(r.label)}</span><span class="${r.cls}">${fmt(r.v)}</span></div>`).join("")}
        <div class="bd-total"><span>Gesamt</span><span>${fmt(scores[i].total)}</span></div>
      </div>`).join("")}</div>` : "";
  const sub = byJury ? (tie ? "Gleichstand! Die Münze hat entschieden 🪙" : "Die App-Jury hat entschieden 🧑‍🍳") : "Einstimmig entschieden 🤝";
  openModal(`
    <div class="winner-hero">
      <div class="crown">👑</div>
      <h2 style="color:${pColor(w)}">${esc(name(w))} gewinnt!</h2>
      <div class="sub">${sub}</div>
    </div>
    ${bd}
    <div class="mbtns">
      <button class="mbtn primary" id="again">🔁 Nochmal ${esc(food.name)}</button>
      <button class="mbtn" id="other">🍽️ Anderes Essen</button>
    </div>`, { locked: true });
  $("#again").onclick = () => { closeModal(); newGame(food.id); };
  $("#other").onclick = () => { closeModal(); goHome(); };
}

function confetti(w) {
  const box = $("#confetti");
  const cols = [w === 0 ? "#ff7a45" : "#2ec5ff", "#ffd23f", "#ffffff", "#ec4899", "#8b5cf6"];
  for (let i = 0; i < 90; i++) {
    const d = document.createElement("div");
    d.className = "cf";
    d.style.left = Math.random() * 100 + "vw";
    d.style.background = cols[i % cols.length];
    d.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    d.style.setProperty("--rot", (Math.random() * 1080 - 540) + "deg");
    d.style.animationDuration = 2 + Math.random() * 2 + "s";
    d.style.animationDelay = Math.random() * 0.4 + "s";
    box.appendChild(d);
    setTimeout(() => d.remove(), 4800);
  }
}

/* ============================================================
   Zurück-Taste (Android)
   ============================================================ */
window.handleBack = function () {
  const m = $("#modal");
  if (!m.classList.contains("hidden")) { if (!m.dataset.locked) closeModal(); return true; }
  if ($("#screen-game").classList.contains("active")) { confirmQuit(); return true; }
  if ($("#screen-end").classList.contains("active")) { goHome(); return true; }
  return false;
};

renderHome();
if (!localStorage.getItem("g20_seenRules")) { try { localStorage.setItem("g20_seenRules", "1"); } catch (e) {} setTimeout(showRules, 400); }
