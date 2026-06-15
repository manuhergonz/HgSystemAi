// /**
//  * HgSystemAI — Premium Scroll Effects
//  * Inspirado en TAG Heuer Connected Calibre E5
//  * v2 — scroll speed fix
//  */
// (function () {

//   // ─── CSS ──────────────────────────────────────────────────────────────────
//   const style = document.createElement("style");
//   style.textContent = `
//     .hg-scroll-indicator {
//       position: fixed;
//       bottom: 2.5rem;
//       left: 50%;
//       transform: translateX(-50%);
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 0.4rem;
//       z-index: 99;
//       opacity: 1;
//       transition: opacity 0.5s ease;
//       pointer-events: none;
//     }
//     .hg-scroll-indicator.hidden { opacity: 0; }
//     .hg-scroll-indicator__text {
//       font-size: 0.62rem;
//       letter-spacing: 0.2em;
//       text-transform: uppercase;
//       color: rgba(255,255,255,0.45);
//     }
//     .hg-scroll-indicator__track {
//       width: 1.5px;
//       height: 2.5rem;
//       background: rgba(255,255,255,0.12);
//       border-radius: 99px;
//       overflow: hidden;
//     }
//     .hg-scroll-indicator__dot {
//       width: 100%;
//       height: 40%;
//       background: linear-gradient(180deg, #00d4ff, #7b2ff7);
//       border-radius: 99px;
//       animation: hg-scroll-dot 1.8s ease-in-out infinite;
//     }
//     @keyframes hg-scroll-dot {
//       0%   { transform: translateY(-100%); opacity: 0; }
//       15%  { opacity: 1; }
//       60%  { opacity: 1; transform: translateY(180%); }
//       80%  { opacity: 0; transform: translateY(180%); }
//       100% { transform: translateY(-100%); opacity: 0; }
//     }
//     .hg-cursor {
//       width: 8px; height: 8px;
//       background: #00d4ff;
//       border-radius: 50%;
//       position: fixed; top: 0; left: 0;
//       pointer-events: none; z-index: 9999;
//       mix-blend-mode: difference;
//       transition: transform 0.12s ease;
//     }
//     .hg-cursor-ring {
//       width: 32px; height: 32px;
//       border: 1.5px solid rgba(0,212,255,0.45);
//       border-radius: 50%;
//       position: fixed; top: 0; left: 0;
//       pointer-events: none; z-index: 9998;
//       transition: width 0.3s, height 0.3s, border-color 0.3s;
//     }
//     .hg-cursor.hover  { transform: scale(2.5); }
//     .hg-cursor-ring.hover { width: 52px; height: 52px; border-color: rgba(123,47,247,0.65); }
//   `;
//   document.head.appendChild(style);

//   // ─── Scroll indicator ─────────────────────────────────────────────────────
//   const indicator = document.createElement("div");
//   indicator.className = "hg-scroll-indicator";
//   indicator.innerHTML = `
//     <div class="hg-scroll-indicator__track">
//       <div class="hg-scroll-indicator__dot"></div>
//     </div>
//     <span class="hg-scroll-indicator__text">Scroll</span>`;
//   document.body.appendChild(indicator);

//   window.addEventListener("scroll", function () {
//     indicator.classList.toggle("hidden", window.scrollY > 100);
//   }, { passive: true });

//   // ─── Cursor ───────────────────────────────────────────────────────────────
//   const dot  = document.createElement("div"); dot.className  = "hg-cursor";
//   const ring = document.createElement("div"); ring.className = "hg-cursor-ring";
//   document.body.appendChild(dot);
//   document.body.appendChild(ring);

//   let mx = 0, my = 0, rx = 0, ry = 0;
//   document.addEventListener("mousemove", function (e) {
//     mx = e.clientX; my = e.clientY;
//     dot.style.transform = "translate(" + (mx - 4) + "px," + (my - 4) + "px)";
//   });
//   (function lagRing() {
//     rx += (mx - rx - 16) * 0.1;
//     ry += (my - ry - 16) * 0.1;
//     ring.style.transform = "translate(" + rx + "px," + ry + "px)";
//     requestAnimationFrame(lagRing);
//   })();
//   document.querySelectorAll("a,button,[role='button']").forEach(function (el) {
//     el.addEventListener("mouseenter", function () { dot.classList.add("hover"); ring.classList.add("hover"); });
//     el.addEventListener("mouseleave", function () { dot.classList.remove("hover"); ring.classList.remove("hover"); });
//   });

//   // ─── Cargar GSAP → ScrollTrigger → Lenis en cadena ───────────────────────
//   function loadScript(src, cb) {
//     var s = document.createElement("script");
//     s.src = src; s.onload = cb;
//     document.head.appendChild(s);
//   }

//   loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", function () {
//     loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", function () {
//       loadScript("https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js", function () {
//         init();
//       });
//     });
//   });

//   function init() {
//     gsap.registerPlugin(ScrollTrigger);

//     // ── Lenis — velocidad normal (0.8 = suave pero no lento) ──
//     var lenis = new Lenis({
//       duration: 0.8,
//       easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
//       smoothWheel: true,
//     });
//     lenis.on("scroll", ScrollTrigger.update);
//     gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
//     gsap.ticker.lagSmoothing(0);

//     // ── Marcar elementos automáticamente ──
//     document.querySelectorAll("h1,h2,h3").forEach(function (el) {
//       if (!el.dataset.hgMarked) { el.dataset.hgMarked = "1"; gsap.set(el, { opacity: 0, y: 50 }); }
//     });
//     document.querySelectorAll("section p").forEach(function (el) {
//       if (!el.dataset.hgMarked) { el.dataset.hgMarked = "1"; gsap.set(el, { opacity: 0, y: 30 }); }
//     });

//     var cardSel = ".service-card,.card,[class*='card'],[class*='benefit'],[class*='step'],[class*='feature'],.col";
//     document.querySelectorAll(cardSel).forEach(function (el) {
//       if (!el.dataset.hgMarked) { el.dataset.hgMarked = "1"; gsap.set(el, { opacity: 0, y: 40, scale: 0.96 }); }
//     });

//     // ── Reveal al scroll ──
//     document.querySelectorAll("[data-hg-marked]").forEach(function (el) {
//       ScrollTrigger.create({
//         trigger: el,
//         start: "top 88%",
//         once: true,
//         onEnter: function () {
//           gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" });
//         }
//       });
//     });

//     // ── Línea degradada bajo h2 ──
//     document.querySelectorAll("h2").forEach(function (el) {
//       var line = document.createElement("span");
//       Object.assign(line.style, {
//         display:"block", height:"2px", width:"0",
//         background:"linear-gradient(90deg,#00d4ff,#7b2ff7)",
//         marginTop:"0.35rem", borderRadius:"2px"
//       });
//       el.appendChild(line);
//       ScrollTrigger.create({
//         trigger: el, start: "top 85%", once: true,
//         onEnter: function () { gsap.to(line, { width: 56, duration: 0.7, ease: "power2.out" }); }
//       });
//     });

//     // ── Navbar shrink ──
//     var nav = document.querySelector("nav,header");
//     if (nav) {
//       ScrollTrigger.create({
//         start: "top -80",
//         onEnter: function () {
//           Object.assign(nav.style, {
//             transition: "all 0.4s ease",
//             padding: "0.5rem 1.5rem",
//             background: "rgba(8,11,25,0.96)",
//             backdropFilter: "blur(18px)",
//             boxShadow: "0 2px 30px rgba(0,0,0,0.5)"
//           });
//         },
//         onLeaveBack: function () {
//           nav.style.padding = "";
//           nav.style.boxShadow = "";
//         }
//       });
//     }

//     console.log("[HgSystemAI Effects v2] ✓ activo");
//   }

// })();