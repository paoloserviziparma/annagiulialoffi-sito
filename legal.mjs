// Testi delle pagine Privacy e Cookie (sito personale, nessuna attività commerciale).
// Se cambia qualcosa (nuovi servizi, statistiche, video esterni…) aggiornare qui e la data.
export const UPDATED = { it: "11 novembre 2026", en: "11 November 2026" };

export const LEGAL = {
  it: {
    privacy: {
      file: "privacy.html",
      title: "Informativa privacy",
      body: (email) => `
<p>Questo è il sito personale di Annagiulia Loffi: presenta il suo percorso nella danza e permette di contattarla. Non è un sito commerciale e non vende prodotti o servizi.</p>

<h2>Chi tratta i dati</h2>
<p>Titolare del trattamento è Annagiulia Loffi, persona fisica. Per qualsiasi domanda sui tuoi dati puoi scrivere a <a href="mailto:${email}">${email}</a>.</p>

<h2>Quali dati e perché</h2>
<p><strong>Modulo contatti.</strong> Se scrivi dal modulo vengono raccolti nome, email e testo del messaggio, solo per leggere la tua richiesta e risponderti. Base giuridica: la tua richiesta (art. 6.1.b GDPR) e il legittimo interesse a risponderti (art. 6.1.f GDPR).</p>
<p><strong>Email.</strong> Se scrivi direttamente all'indirizzo email, i dati contenuti nel messaggio sono trattati per le stesse finalità.</p>
<p><strong>Dati tecnici di navigazione.</strong> Il servizio che ospita il sito registra automaticamente alcuni dati tecnici (indirizzo IP, data e ora, pagina richiesta, tipo di browser), necessari a far funzionare il sito e a proteggerlo da abusi. Non sono usati per identificarti né per profilarti.</p>
<p>I dati non sono usati per pubblicità, newsletter o profilazione, e non sono venduti né ceduti a terzi.</p>

<h2>Chi riceve i dati</h2>
<ul>
<li><strong>Netlify, Inc.</strong> (Stati Uniti), che ospita il sito e riceve i messaggi del modulo;</li>
<li><strong>Tophost / Seeweb</strong> (Italia), che gestiscono il dominio e l'inoltro della posta;</li>
<li><strong>Google</strong> (Gmail), dove arrivano le email e le notifiche del modulo.</li>
</ul>
<p>Alcuni di questi fornitori possono trattare i dati fuori dall'Unione europea: in questi casi il trasferimento avviene con le garanzie previste dal GDPR, come le decisioni di adeguatezza o le clausole contrattuali standard.</p>

<h2>Per quanto tempo</h2>
<p>I messaggi sono conservati per il tempo necessario a rispondere e a gestire l'eventuale scambio che ne segue, e comunque non oltre 12 mesi dall'ultimo contatto, salvo tua richiesta di cancellarli prima.</p>

<h2>I tuoi diritti</h2>
<p>Puoi chiedere in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, opporti al trattamento o riceverli in un formato leggibile, scrivendo a <a href="mailto:${email}">${email}</a>. Hai anche il diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it">garanteprivacy.it</a>).</p>

<h2>Minori</h2>
<p>Il modulo è pensato per gli adulti. Se hai meno di 14 anni, chiedi a un genitore di scrivere al posto tuo.</p>

<h2>Cookie</h2>
<p>Il sito non usa cookie di profilazione né strumenti di statistica: trovi i dettagli nella pagina <a href="/cookie.html">Cookie</a>.</p>

<h2>Modifiche</h2>
<p>Se questa informativa cambia, la versione aggiornata viene pubblicata su questa pagina con la nuova data.</p>`,
    },
    cookie: {
      file: "cookie.html",
      title: "Cookie",
      body: (email) => `
<p>Questo sito non usa cookie di profilazione, pubblicitari o di statistica, e non incorpora contenuti di terze parti che li installano (come mappe, video di YouTube o pulsanti dei social). Per questo non trovi alcun banner per il consenso.</p>

<h2>Cosa viene salvato sul tuo dispositivo</h2>
<div style="overflow-x: auto">
<table>
<thead><tr><th scope="col">Nome</th><th scope="col">Tipo</th><th scope="col">A cosa serve</th><th scope="col">Durata</th></tr></thead>
<tbody><tr><td><code>lang</code></td><td>Memoria locale del browser (localStorage)</td><td>Ricorda la lingua che hai scelto con il pulsante IT · EN</td><td>Finché non la cancelli dal browser</td></tr></tbody>
</table>
</div>
<p>È uno strumento tecnico, che serve solo a rispettare una scelta fatta da te, e non richiede consenso. Caratteri tipografici, foto e video sono caricati direttamente da questo sito, senza servizi esterni.</p>

<h2>Area di gestione</h2>
<p>La pagina <code>/admin</code>, riservata a chi aggiorna i contenuti, usa la memoria locale del browser per mantenere l'accesso. Non riguarda chi visita il sito.</p>

<h2>Come cancellarli</h2>
<p>Puoi cancellare in qualsiasi momento i dati salvati dal sito dalle impostazioni del tuo browser (cronologia, dati dei siti).</p>

<h2>Contatti</h2>
<p>Per domande scrivi a <a href="mailto:${email}">${email}</a>. Per il trattamento dei dati personali vedi l'<a href="/privacy.html">informativa privacy</a>.</p>`,
    },
  },
  en: {
    privacy: {
      file: "en/privacy.html",
      title: "Privacy notice",
      body: (email) => `
<p>This is the personal website of Annagiulia Loffi: it presents her journey in dance and lets you get in touch with her. It is not a commercial website and does not sell products or services.</p>

<h2>Who handles your data</h2>
<p>The data controller is Annagiulia Loffi, a private individual. For any question about your data, write to <a href="mailto:${email}">${email}</a>.</p>

<h2>What data and why</h2>
<p><strong>Contact form.</strong> If you use the form, your name, email address and message are collected only to read your request and reply to you. Legal basis: your request (Art. 6(1)(b) GDPR) and the legitimate interest in replying to you (Art. 6(1)(f) GDPR).</p>
<p><strong>Email.</strong> If you write directly to the email address, the data in your message is used for the same purposes.</p>
<p><strong>Technical browsing data.</strong> The hosting service automatically records some technical data (IP address, date and time, requested page, browser type), needed to run the website and protect it from abuse. It is not used to identify or profile you.</p>
<p>Your data is not used for advertising, newsletters or profiling, and is never sold or passed on to third parties.</p>

<h2>Who receives the data</h2>
<ul>
<li><strong>Netlify, Inc.</strong> (United States), which hosts the website and receives form messages;</li>
<li><strong>Tophost / Seeweb</strong> (Italy), which manage the domain and email forwarding;</li>
<li><strong>Google</strong> (Gmail), where emails and form notifications are delivered.</li>
</ul>
<p>Some of these providers may process data outside the European Union: in that case the transfer relies on the safeguards provided by the GDPR, such as adequacy decisions or standard contractual clauses.</p>

<h2>How long it is kept</h2>
<p>Messages are kept for as long as needed to reply and handle any follow-up, and in any case no longer than 12 months after the last contact, unless you ask for them to be deleted sooner.</p>

<h2>Your rights</h2>
<p>You can ask at any time to access, correct or delete your data, restrict or object to its processing, or receive it in a readable format, by writing to <a href="mailto:${email}">${email}</a>. You also have the right to lodge a complaint with the Italian Data Protection Authority (<a href="https://www.garanteprivacy.it">garanteprivacy.it</a>) or the authority in your country.</p>

<h2>Children</h2>
<p>The form is intended for adults. If you are under 14, please ask a parent to write on your behalf.</p>

<h2>Cookies</h2>
<p>This website does not use profiling cookies or analytics: see the <a href="/en/cookies.html">Cookies</a> page for details.</p>

<h2>Changes</h2>
<p>If this notice changes, the updated version will be published on this page with the new date.</p>`,
    },
    cookie: {
      file: "en/cookies.html",
      title: "Cookies",
      body: (email) => `
<p>This website does not use profiling, advertising or analytics cookies, and does not embed third-party content that sets them (such as maps, YouTube videos or social buttons). That is why there is no consent banner.</p>

<h2>What is stored on your device</h2>
<div style="overflow-x: auto">
<table>
<thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
<tbody><tr><td><code>lang</code></td><td>Browser local storage (localStorage)</td><td>Remembers the language you chose with the IT · EN button</td><td>Until you clear it in your browser</td></tr></tbody>
</table>
</div>
<p>It is a technical tool that only serves to respect a choice you made, and does not require consent. Fonts, photos and videos are loaded directly from this website, with no external services.</p>

<h2>Admin area</h2>
<p>The <code>/admin</code> page, reserved for whoever updates the content, uses browser local storage to keep the editor signed in. It does not affect visitors.</p>

<h2>How to delete them</h2>
<p>You can delete the data stored by this website at any time from your browser settings (history, site data).</p>

<h2>Contact</h2>
<p>For questions write to <a href="mailto:${email}">${email}</a>. For personal data processing see the <a href="/en/privacy.html">privacy notice</a>.</p>`,
    },
  },
};
