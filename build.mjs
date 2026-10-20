// Genera il sito statico in dist/ a partire da content/*.json e static/.
// Nessuna dipendenza esterna: basta Node 18+.  Uso: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "node:fs";

const BASE = "https://annagiulialoffi.com";
const ACCENT = "#9E4F63";
const TODAY = new Date().toISOString().slice(0, 10);
const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), "utf8"));
const S = read("./content/impostazioni.json");
const T = { it: read("./content/it.json"), en: read("./content/en.json") };

// ---------- helpers ----------
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// *parola* -> <em>parola</em> (dopo l'escape)
const em = (s, style = "") => esc(s).replace(/\*([^*]+)\*/g, `<em${style ? ` style="${style}"` : ""}>$1</em>`);
const plain = (s = "") => String(s).replace(/\*/g, "");
const list = (a) => (Array.isArray(a) ? a : []);
const hasPlaceholder = (s) => /\[[^\]]*\]/.test(s || "");

// ---------- costanti per lingua (non modificabili dal pannello) ----------
const L = {
  it: {
    path: "/", file: "index.html", locale: "it_IT", altLocale: "en_GB",
    ids: { header: "pagina", about: "chi-sono", courses: "corsi", method: "metodo", start: "inizia", contact: "contatti" },
    other: { lang: "en", href: "/en/", aria: "English version", html: `IT · <span style="color: ${ACCENT}">EN</span>` },
    aria: { nav: "Menu principale", cred: "Formazione e certificazioni", gallery: "Galleria", testi: "Testimonianze", top: "Torna all'inizio della pagina", topTitle: "Torna su" },
    form: { name: "contatti", action: "/grazie.html", p: "f-", f: { name: "nome", email: "email", course: "corso", msg: "messaggio" }, privacy: "accettata", honey: "Non compilare questo campo:" },
    person: {
      job: "Insegnante di danza classica e contemporanea",
      knows: ["Danza classica", "Danza contemporanea", "Metodo Royal Academy of Dance (RAD)", "Propedeutica alla danza", "Preparazione agli esami RAD"],
      study: "Studentessa alla Royal Academy of Dance di Londra, laurea prevista a settembre 2027",
      ogAlt: "Annagiulia Loffi, insegnante di danza classica e contemporanea",
    },
  },
  en: {
    path: "/en/", file: "en/index.html", locale: "en_GB", altLocale: "it_IT",
    ids: { header: "page", about: "about", courses: "classes", method: "method", start: "start", contact: "contact" },
    other: { lang: "it", href: "/", aria: "Versione italiana", html: `<span style="color: ${ACCENT}">IT</span> · EN` },
    aria: { nav: "Main menu", cred: "Training and qualifications", gallery: "Gallery", testi: "Testimonials", top: "Back to the top of the page", topTitle: "Back to top" },
    form: { name: "contact", action: "/en/thanks.html", p: "e-", f: { name: "name", email: "email", course: "class", msg: "message" }, privacy: "accepted", honey: "Do not fill this in:" },
    person: {
      job: "Classical ballet and contemporary dance teacher",
      knows: ["Classical ballet", "Contemporary dance", "Royal Academy of Dance (RAD) syllabus", "Pre-ballet for young children", "RAD exam preparation"],
      study: "Student at the Royal Academy of Dance, London, graduating September 2027",
      ogAlt: "Annagiulia Loffi, classical ballet and contemporary dance teacher",
    },
  },
};

// ---------- frammenti ricorrenti ----------
const SERIF = "font-family: 'Cormorant Garamond', Georgia, serif";
const EYEBROW = `margin: 0; font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: ${ACCENT}`;
const H2 = `margin: 0; ${SERIF}; font-weight: 400; font-size: clamp(40px, 4.6vw, 60px); line-height: 1.05`;
const BODY = "margin: 0; color: #4A4450";
const monogram = (size, ring, inner, line) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 240 240" aria-hidden="true" style="flex: 0 0 auto"><circle cx="120" cy="120" r="112" fill="none" stroke="#1E1B22" stroke-width="${ring}"></circle>${inner ? `<circle cx="120" cy="120" r="100" fill="none" stroke="#1E1B22" stroke-width="2"></circle>` : ""}<text x="98" y="150" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="124" fill="#1E1B22">A</text><text x="146" y="162" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="124" fill="${ACCENT}">L</text><line x1="52" y1="176" x2="188" y2="176" stroke="${ACCENT}" stroke-width="${line}"></line></svg>`;
const img = (o, lang, style) =>
  o && o.immagine ? `<img loading="lazy" decoding="async" src="${esc(o.immagine)}" alt="${esc(o["descrizione_" + lang] || "")}" style="${style}">` : "";

// ---------- pagina ----------
function page(lang) {
  const t = T[lang], c = L[lang], id = c.ids, f = c.form;
  const v = S.video_apertura || {};
  const ig = (S.instagram || "").replace(/^@/, "").trim();
  const faqs = list(t.prima_volta?.domande);

  const body = `<div style="font-family: 'Jost', 'Helvetica Neue', sans-serif; color: #1E1B22; background: #F6F2EE; font-size: 17px; line-height: 1.65; font-weight: 400">

<!-- NAV -->
<header id="${id.header}" style="border-bottom: 1px solid #E3DAD6">
<div style="max-width: 1200px; margin: 0 auto; padding: 22px 32px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 32px">
<a href="#top" style="display: flex; align-items: center; gap: 14px; text-decoration: none; color: #1E1B22">
${monogram(54, 5, true, 4)}
<span style="display: flex; flex-direction: column; line-height: 1.2"><span style="${SERIF}; font-size: 22px; font-weight: 500">${esc(S.nome)}</span><span style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #5E5763">${esc(t.intestazione.sottotitolo_nome)}</span></span>
</a>
<button type="button" class="navtoggle" aria-label="Menu" aria-expanded="false" aria-controls="mainnav"><svg class="ic-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><svg class="ic-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
<nav id="mainnav" class="mainnav" aria-label="${c.aria.nav}" style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px 28px; font-size: 15px">
${[["about", "menu_chi_sono"], ["courses", "menu_corsi"], ["method", "menu_metodo"], ["start", "menu_prima_volta"]]
  .map(([k, label]) => `<a class="navlink" href="#${id[k]}" style="color: #1E1B22; text-decoration: none; padding: 10px 0">${esc(t.intestazione[label])}</a>`).join("\n")}
<a href="#${id.contact}" style="color: #F6F2EE; background: ${ACCENT}; text-decoration: none; padding: 12px 22px; border-radius: 999px">${esc(t.intestazione.menu_contatti)}</a>
<a href="${c.other.href}" lang="${c.other.lang}" aria-label="${c.other.aria}" style="color: #1E1B22; text-decoration: none; border: 1px solid #CFC3BF; border-radius: 999px; padding: 10px 14px; font-size: 13px; letter-spacing: 0.12em">${c.other.html}</a>
</nav>
</div>
</header>

<!-- HERO -->
<section id="top" style="max-width: 1200px; margin: 0 auto; padding: 88px 32px 96px; display: flex; flex-wrap: wrap; align-items: center; gap: 64px">
<div style="flex: 1 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 28px">
<p style="${EYEBROW}">${esc(t.apertura.sopratitolo)}</p>
<h1 style="margin: 0; ${SERIF}; font-weight: 400; font-size: clamp(42px, 5.2vw, 74px); line-height: 1.02; letter-spacing: -0.01em; max-width: 13ch; text-wrap: balance">${em(t.apertura.titolo, `color: ${ACCENT}`)}</h1>
<p style="margin: 0; max-width: 520px; font-size: 19px; color: #4A4450; font-weight: 300">${esc(t.apertura.testo)}</p>
<div style="display: flex; flex-wrap: wrap; gap: 14px; padding-top: 8px">
<a href="#${id.contact}" style="background: #1E1B22; color: #F6F2EE; text-decoration: none; padding: 16px 30px; border-radius: 999px; font-size: 16px">${esc(t.apertura.pulsante_principale)}</a>
<a href="#${id.courses}" style="border: 1px solid #1E1B22; color: #1E1B22; text-decoration: none; padding: 15px 30px; border-radius: 999px; font-size: 16px">${esc(t.apertura.pulsante_secondario)}</a>
</div>
</div>
<div style="flex: 1 1 380px; min-width: 0; display: flex; justify-content: center">
<div style="position: relative; width: 100%; max-width: 440px">
<video poster="${esc(v.anteprima || "")}" autoplay="" muted="" loop="" playsinline="" preload="auto" aria-label="${esc(v["descrizione_" + lang] || "")}" style="display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 220px 220px 8px 8px; background: #2A2230">${v.webm ? `<source src="${esc(v.webm)}" type="video/webm">` : ""}${v.mp4 ? `<source src="${esc(v.mp4)}" type="video/mp4">` : ""}</video>
<div class="badge" style="position: absolute; left: -28px; bottom: 48px; background: #F6F2EE; border: 1px solid #E3DAD6; padding: 16px 20px; border-radius: 6px; display: flex; flex-direction: column; line-height: 1.3">
<span style="${SERIF}; font-size: 30px; font-style: italic; color: ${ACCENT}">${esc(t.apertura.bollino_titolo)}</span>
<span style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #5E5763">${esc(t.apertura.bollino_testo)}</span>
</div>
</div>
</div>
</section>

<!-- CREDENZIALI -->
<section aria-label="${c.aria.cred}" style="background: #221E26; color: #F6F2EE">
<div style="max-width: 1200px; margin: 0 auto; padding: 44px 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px">
${list(t.credenziali).map((x) => `<div style="display: flex; flex-direction: column; gap: 6px">
<span style="${SERIF}; font-size: 26px; font-style: italic">${esc(x.titolo)}</span>
<span style="font-size: 15px; color: #CFC6D1">${esc(x.testo)}</span>
</div>`).join("\n")}
</div>
</section>

<!-- CHI SONO -->
<section id="${id.about}" style="max-width: 1200px; margin: 0 auto; padding: 120px 32px; display: flex; flex-wrap: wrap; gap: 64px; align-items: flex-start">
<div style="flex: 1 1 340px; min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
${img(S.foto_chi_sono_1, lang, "display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 6px")}
${img(S.foto_chi_sono_2, lang, "display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: cover; margin-top: 56px; border-radius: 6px")}
</div>
<div style="flex: 1 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 22px">
<p style="${EYEBROW}">${esc(t.chi_sono.sopratitolo)}</p>
<h2 style="${H2}">${em(t.chi_sono.titolo)}</h2>
${list(t.chi_sono.paragrafi).map((p) => `<p style="${BODY}">${esc(p)}</p>`).join("\n")}
${t.chi_sono.citazione ? `<blockquote style="margin: 8px 0 0; padding: 0; ${SERIF}; font-style: italic; font-size: 26px; line-height: 1.35; color: #1E1B22">“${esc(t.chi_sono.citazione)}”</blockquote>` : ""}
</div>
</section>

<!-- CORSI -->
<section id="${id.courses}" style="background: #EFE8E3">
<div style="max-width: 1200px; margin: 0 auto; padding: 120px 32px; display: flex; flex-direction: column; gap: 56px">
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px">
<div style="display: flex; flex-direction: column; gap: 16px; max-width: 640px">
<p style="${EYEBROW}">${esc(t.corsi.sopratitolo)}</p>
<h2 style="${H2}">${em(t.corsi.titolo)}</h2>
</div>
<p style="margin: 0; max-width: 360px; color: #4A4450">${esc(t.corsi.nota)}</p>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px">
${list(t.corsi.elenco).map((x, i) => `<article style="background: #F6F2EE; border-radius: 8px; padding: 36px 32px; display: flex; flex-direction: column; gap: 14px">
<span style="${SERIF}; font-size: 44px; line-height: 1; color: ${ACCENT}">${String(i + 1).padStart(2, "0")}</span>
<h3 style="margin: 0; ${SERIF}; font-weight: 500; font-size: 30px; line-height: 1.15">${esc(x.nome)}</h3>
<span style="font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #5E5763">${esc(x.per_chi)}</span>
<p style="margin: 0; color: #4A4450; font-size: 16px">${esc(x.descrizione)}</p>
</article>`).join("\n")}
</div>
</div>
</section>

<!-- METODO RAD -->
<section id="${id.method}" style="max-width: 1200px; margin: 0 auto; padding: 120px 32px; display: flex; flex-wrap: wrap; gap: 64px">
<div style="flex: 1 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 22px">
<p style="${EYEBROW}">${esc(t.metodo.sopratitolo)}</p>
<h2 style="${H2}">${em(t.metodo.titolo)}</h2>
${list(t.metodo.paragrafi).map((p) => `<p style="${BODY}">${esc(p)}</p>`).join("\n")}
</div>
<div style="flex: 1 1 420px; min-width: 0; display: flex; flex-direction: column">
${list(t.metodo.livelli).map((x, i, a) => `<div style="display: flex; gap: 24px; padding: 26px 0; border-top: 1px solid #D9CECA${i === a.length - 1 ? "; border-bottom: 1px solid #D9CECA" : ""}">
<span style="flex: 0 0 140px; ${SERIF}; font-style: italic; font-size: 24px; color: ${ACCENT}">${esc(x.etichetta)}</span>
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 500">${esc(x.programma)}</span><span style="font-size: 15px; color: #5E5763">${esc(x.descrizione)}</span></div>
</div>`).join("\n")}
</div>
</section>

<!-- GALLERIA -->
<section aria-label="${c.aria.gallery}" style="max-width: 1200px; margin: 0 auto; padding: 0 32px 120px">
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px">
${list(S.galleria).map((g) => img(g, lang, "display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 6px")).join("\n")}
</div>
</section>

<!-- PRIMA VOLTA -->
<section id="${id.start}" style="background: #EFE8E3">
<div style="max-width: 1200px; margin: 0 auto; padding: 120px 32px; display: flex; flex-wrap: wrap; gap: 64px">
<div style="flex: 1 1 340px; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 22px">
<p style="${EYEBROW}">${esc(t.prima_volta.sopratitolo)}</p>
<h2 style="${H2}">${em(t.prima_volta.titolo)}</h2>
<p style="${BODY}">${esc(t.prima_volta.testo)}</p>
<a href="#${id.contact}" style="border: 1px solid #1E1B22; color: #1E1B22; text-decoration: none; padding: 15px 28px; border-radius: 999px; font-size: 16px">${esc(t.prima_volta.pulsante)}</a>
</div>
<div style="flex: 1 1 560px; min-width: 0; display: flex; flex-direction: column; border-bottom: 1px solid #D9CECA">
${faqs.map((q, i) => `<details${i === 0 ? ' open=""' : ""} style="border-top: 1px solid #D9CECA; padding: 22px 0">
<summary style="cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 24px; ${SERIF}; font-size: 26px; line-height: 1.25; min-height: 44px">${esc(q.domanda)}<span style="color: ${ACCENT}; font-family: 'Jost', sans-serif; font-size: 26px; font-weight: 300" aria-hidden="true">+</span></summary>
<p style="margin: 10px 0 0; max-width: 620px; color: #4A4450">${esc(q.risposta)}</p>
</details>`).join("\n")}
</div>
</div>
</section>

<!-- TESTIMONIANZE -->
${list(t.testimonianze.elenco).length ? `<section aria-label="${c.aria.testi}" style="max-width: 1200px; margin: 0 auto; padding: 120px 32px 0; display: flex; flex-direction: column; gap: 48px">
<div style="display: flex; flex-direction: column; gap: 16px; max-width: 640px">
<p style="${EYEBROW}">${esc(t.testimonianze.sopratitolo)}</p>
<h2 style="${H2}">${em(t.testimonianze.titolo)}</h2>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px">
${list(t.testimonianze.elenco).map((x) => `<figure style="margin: 0; border-top: 1px solid #1E1B22; padding-top: 28px; display: flex; flex-direction: column; gap: 20px">
<blockquote style="margin: 0; ${SERIF}; font-style: italic; font-size: 25px; line-height: 1.35">“${esc(x.testo)}”</blockquote>
<figcaption style="font-size: 14px; letter-spacing: 0.08em; color: #5E5763">${esc(x.autore)}</figcaption>
</figure>`).join("\n")}
</div>
</section>` : ""}

<!-- CONTATTI -->
<section id="${id.contact}" style="max-width: 1200px; margin: 0 auto; padding: 120px 32px; display: flex; flex-wrap: wrap; gap: 64px">
<div style="flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 22px">
<p style="${EYEBROW}">${esc(t.contatti.sopratitolo)}</p>
<h2 style="${H2}">${em(t.contatti.titolo)}</h2>
<p style="${BODY}">${esc(t.contatti.testo)}</p>
<div style="display: flex; flex-direction: column; gap: 12px; padding-top: 8px">
${S.email ? `<a href="mailto:${esc(S.email)}" style="color: #1E1B22; text-decoration: none; display: flex; gap: 14px; align-items: center; padding: 6px 0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg><span>${esc(S.email)}</span></a>` : ""}
${ig ? `<a href="https://instagram.com/${esc(ig)}" style="color: #1E1B22; text-decoration: none; display: flex; gap: 14px; align-items: center; padding: 6px 0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.8"></circle></svg><span>@${esc(ig)}</span></a>` : ""}
</div>
${img(S.foto_contatti, lang, "display: block; width: 100%; max-width: 300px; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 150px 150px 6px 6px; margin-top: 16px")}
</div>
<form name="${f.name}" method="POST" action="${f.action}" data-netlify="true" netlify-honeypot="bot-field" style="flex: 1 1 480px; min-width: 0; align-self: flex-start; background: #EFE8E3; border-radius: 8px; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px">
<input type="hidden" name="form-name" value="${f.name}">
<p hidden><label>${f.honey} <input name="bot-field"></label></p>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px">
<div style="display: flex; flex-direction: column; gap: 8px">
<label for="${f.p}name" style="font-size: 14px; color: #4A4450">${esc(t.contatti.campo_nome)}</label>
<input id="${f.p}name" name="${f.f.name}" required type="text" autocomplete="name" style="font: inherit; padding: 13px 14px; border: 1px solid #CFC3BF; border-radius: 6px; background: #F6F2EE; color: #1E1B22">
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<label for="${f.p}email" style="font-size: 14px; color: #4A4450">${esc(t.contatti.campo_email)}</label>
<input id="${f.p}email" name="${f.f.email}" required type="email" autocomplete="email" style="font: inherit; padding: 13px 14px; border: 1px solid #CFC3BF; border-radius: 6px; background: #F6F2EE; color: #1E1B22">
</div>
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<label for="${f.p}course" style="font-size: 14px; color: #4A4450">${esc(t.contatti.campo_corso)}</label>
<select id="${f.p}course" name="${f.f.course}" style="font: inherit; padding: 13px 14px; border: 1px solid #CFC3BF; border-radius: 6px; background: #F6F2EE; color: #1E1B22">
${list(t.contatti.opzioni_corso).map((o) => `<option>${esc(o)}</option>`).join("\n")}
</select>
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<label for="${f.p}msg" style="font-size: 14px; color: #4A4450">${esc(t.contatti.campo_messaggio)}</label>
<textarea id="${f.p}msg" name="${f.f.msg}" rows="4" style="font: inherit; padding: 13px 14px; border: 1px solid #CFC3BF; border-radius: 6px; background: #F6F2EE; color: #1E1B22; resize: vertical"></textarea>
</div>
<label style="display: flex; gap: 10px; align-items: flex-start; font-size: 14px; color: #4A4450"><input type="checkbox" name="privacy" value="${f.privacy}" required style="margin-top: 5px; width: 18px; height: 18px">${esc(t.contatti.consenso_privacy)}</label>
<button type="submit" style="align-self: flex-start; font: inherit; font-size: 16px; background: ${ACCENT}; color: #F6F2EE; border: 0; padding: 16px 32px; border-radius: 999px; cursor: pointer">${esc(t.contatti.pulsante_invio)}</button>
</form>
</section>

<!-- TORNA SU -->
<a href="#${id.header}" class="totop" aria-label="${esc(c.aria.top)}" title="${esc(c.aria.topTitle)}" style="position: fixed; right: 24px; bottom: 24px; z-index: 50; width: 52px; height: 52px; border-radius: 50%; background: #1E1B22; color: #F6F2EE; display: flex; align-items: center; justify-content: center; text-decoration: none; box-shadow: 0 6px 20px rgba(30, 27, 34, 0.18)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg></a>

<!-- FOOTER -->
<footer style="border-top: 1px solid #E3DAD6">
<div style="max-width: 1200px; margin: 0 auto; padding: 40px 32px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; font-size: 14px; color: #5E5763">
<span style="display: flex; align-items: center; gap: 14px">${monogram(40, 6, false, 5)}<span><span style="${SERIF}; font-size: 20px; color: #1E1B22">${esc(S.nome)}</span> · ${esc(t.pie_di_pagina.qualifica)}</span></span>
<span>${S.crediti_foto ? `${esc(t.pie_di_pagina.etichetta_crediti)}: ${esc(S.crediti_foto)} · ` : ""}${S.partita_iva ? `${esc(t.pie_di_pagina.etichetta_iva)} ${esc(S.partita_iva)} · ` : ""}<a href="#">${esc(t.pie_di_pagina.link_privacy)}</a> · <a href="#">${esc(t.pie_di_pagina.link_cookie)}</a></span>
</div>
</footer>

</div>`;

  // ---------- dati strutturati ----------
  const url = BASE + c.path;
  const personId = BASE + "/#annagiulia";
  const faqLd = faqs.filter((q) => !hasPlaceholder(q.risposta)).map((q) => ({ "@type": "Question", name: q.domanda, acceptedAnswer: { "@type": "Answer", text: q.risposta } }));
  const graph = [
    { "@type": "WebSite", "@id": BASE + "/#website", url: BASE + "/", name: S.nome, inLanguage: ["it", "en"], publisher: { "@id": personId } },
    { "@type": "WebPage", "@id": url + "#webpage", url, name: t.seo.titolo, description: t.seo.descrizione, inLanguage: lang, isPartOf: { "@id": BASE + "/#website" }, about: { "@id": personId }, primaryImageOfPage: BASE + (S.foto_chi_sono_1?.immagine || ""), dateModified: TODAY },
    {
      "@type": "Person", "@id": personId, name: S.nome, url: BASE + "/", image: BASE + (S.foto_chi_sono_1?.immagine || ""),
      jobTitle: c.person.job, ...(S.email ? { email: "mailto:" + S.email } : {}), description: c.person.study,
      affiliation: { "@type": "CollegeOrUniversity", name: "Royal Academy of Dance", url: "https://www.royalacademyofdance.org/" },
      knowsAbout: c.person.knows, knowsLanguage: ["it", "en"],
      ...(ig ? { sameAs: ["https://instagram.com/" + ig] } : {}),
      makesOffer: list(t.corsi.elenco).map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x.nome, description: x.descrizione, provider: { "@id": personId } } })),
    },
  ];
  if (faqLd.length) graph.push({ "@type": "FAQPage", "@id": url + "#faq", inLanguage: lang, mainEntity: faqLd });
  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1).replace(/</g, "\\u003c");

  const redirect = `<script>(function(){try{var ua=navigator.userAgent||"";if(/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse|headless/i.test(ua))return;var saved=null;try{saved=localStorage.getItem("lang")}catch(e){}var first=((navigator.languages&&navigator.languages[0])||navigator.language||"").toLowerCase();var want=saved||(first.indexOf("it")===0?"it":"en");var onEn=location.pathname.indexOf("/en")===0;if(want==="en"&&!onEn)location.replace("/en/"+location.hash);else if(want==="it"&&onEn)location.replace("/"+location.hash);}catch(e){}})();</script>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.seo.titolo)}</title>
<meta name="description" content="${esc(t.seo.descrizione)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="it" href="${BASE}/">
<link rel="alternate" hreflang="en" href="${BASE}/en/">
<link rel="alternate" hreflang="x-default" href="${BASE}/">
${redirect}
<meta name="author" content="${esc(S.nome)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#F6F2EE">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(S.nome)}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.seo.titolo)}">
<meta property="og:description" content="${esc(t.seo.descrizione)}">
<meta property="og:locale" content="${c.locale}">
<meta property="og:locale:alternate" content="${c.altLocale}">
<meta property="og:image" content="${BASE}/img/social.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.person.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t.seo.titolo)}">
<meta name="twitter:description" content="${esc(t.seo.descrizione)}">
<meta name="twitter:image" content="${BASE}/img/social.jpg">
${v.anteprima ? `<link rel="preload" as="image" href="${esc(v.anteprima)}" fetchpriority="high">` : ""}
<script type="application/ld+json">
${ld}
</script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jost-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
</head>
<body>
${body}
<script>(function(){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('video[autoplay]').forEach(function(v){v.removeAttribute('autoplay');v.pause();});}})();</script>
<script>(function(){var h=document.querySelector('header'),t=document.querySelector('.navtoggle');if(!h||!t)return;function set(o){h.classList.toggle('open',o);t.setAttribute('aria-expanded',o?'true':'false');}t.addEventListener('click',function(){set(!h.classList.contains('open'))});document.querySelectorAll('#mainnav a').forEach(function(a){a.addEventListener('click',function(){set(false)})});document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});})();</script>
<script>(function(){var b=document.querySelector('.totop');if(!b)return;function u(){b.classList.toggle('show',window.scrollY>700)}window.addEventListener('scroll',u,{passive:true});u();})();</script>
<script>document.querySelectorAll('nav a[lang]').forEach(function(a){a.addEventListener('click',function(){try{localStorage.setItem('lang',a.getAttribute('lang'))}catch(e){}})});</script>
</body>
</html>
`;
}

// ---------- build ----------
const OUT = new URL("./dist/", import.meta.url);
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
cpSync(new URL("./static/", import.meta.url), OUT, { recursive: true });
mkdirSync(new URL("./en/", OUT), { recursive: true });
for (const lang of ["it", "en"]) writeFileSync(new URL(L[lang].file, OUT), page(lang));

const sm = (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <xhtml:link rel="alternate" hreflang="it" href="${BASE}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/"/>
  </url>`;
writeFileSync(new URL("sitemap.xml", OUT), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sm(BASE + "/")}
${sm(BASE + "/en/")}
</urlset>
`);

const it = T.it;
writeFileSync(new URL("llms.txt", OUT), `# ${S.nome} — ${plain(it.intestazione.sottotitolo_nome).toLowerCase()}

> ${plain(it.apertura.testo)} ${list(it.chi_sono.paragrafi).join(" ")}

## ${plain(it.corsi.sopratitolo)}
${list(it.corsi.elenco).map((x) => `- **${x.nome}** (${x.per_chi}): ${x.descrizione}`).filter((l) => !hasPlaceholder(l)).join("\n")}

## ${plain(it.prima_volta.sopratitolo)}
${list(it.prima_volta.domande).filter((q) => !hasPlaceholder(q.risposta)).map((q) => `- **${q.domanda}** ${q.risposta}`).join("\n")}

## Contatti
${S.email ? `- Email: ${S.email}\n` : ""}- Modulo contatti: ${BASE}/#${L.it.ids.contact}

## Pagine
- [Home (italiano)](${BASE}/)
- [Home (English)](${BASE}/en/)
`);

console.log("Sito generato in dist/ —", TODAY);
