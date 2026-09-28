/* dataset.js: which data set a page shows.

   'mock'  the sample data built into the seeds. It is never saved: no localStorage, no data folder, so a reload
           always brings back the same demo and nothing you type in it can reach real data.
   'own'   your data: localStorage plus the files in data/, written by store.js.

   A fresh copy of the product opens on 'mock' with a banner. "Start with your own data" switches to 'own' for good
   (remembered per browser, shared by both apps). Add ?mock to the address to see the sample data again.

   A public demo (the copy on saurabh.so, or any page loaded with ?demo) is sample data and nothing else: there is no
   switching and nothing is saved, and the banner points at the repository instead.
   Load ui.js first; load this before the app's own script. */
(function () {
  // Chrome treats every page opened from disk as one site, so two copies of this project would otherwise share the
  // browser's storage and the remembered data folder. Everything is therefore named after the folder the page was
  // opened from: a duplicate of the project is a separate workspace with its own folder and its own buffer.
  const home = (location.protocol === 'file:' ? 'file' : location.origin) + location.pathname.replace(/[^/]*$/, '');
  let h = 0; for (const ch of home) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const scope = h.toString(36);
  const key = name => `${name}:${scope}`;

  const KEY = key('scs-dataset');
  const q = new URLSearchParams(location.search);
  // The public demo: sample data only, with a link to the repository in place of the switch. Only the addresses the
  // author publishes are demos, so a copy someone else clones, hosts or opens locally is the real product.
  const REPO = 'https://github.com/saura3h/simple-invoices';
  const DEMO_HOSTS = [/(^|\.)saurabh\.so$/, /(^|-)simple-invoices[^.]*\.vercel\.app$/];
  const demo = q.has('demo') || DEMO_HOSTS.some(re => re.test(location.hostname));
  const forced = demo ? 'mock' : q.has('mock') ? 'mock' : q.has('own') ? 'own' : null;
  let chosen = null;
  try { chosen = localStorage.getItem(KEY); } catch (e) {}
  const mode = forced || (chosen === 'own' ? 'own' : 'mock');
  const mock = mode === 'mock';

  function choose() {
    if (demo) return;
    try { localStorage.setItem(KEY, 'own'); } catch (e) {}
    const u = new URL(location.href); u.searchParams.delete('mock'); u.searchParams.delete('own');
    location.replace(u.toString());   // reload so the page starts clean on the other data set
  }
  // the other app (or another tab) switched: follow it, unless this tab asked for the sample data by hand
  window.addEventListener('storage', e => { if (e.key === KEY && e.newValue === 'own' && mock && forced !== 'mock') location.reload(); });

  // Your data lives in the data folder, not in the browser. The browser only holds a short-lived buffer: what was
  // saved while the folder was not connected, dropped the moment the folder copy is written.
  const buffer = {
    read(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } },
    hold(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { console.warn('buffer: could not hold', e); } },
    drop(key) { try { localStorage.removeItem(key); } catch (e) {} },
    // hold now, drop as soon as the folder write succeeds
    through(key, obj, write) { buffer.hold(key, obj); Promise.resolve(write).then(ok => { if (ok) buffer.drop(key); }); },
  };

  // Pull in the data-folder loaders (data/<name>.js), but only for your own data: a fresh copy of the product has
  // no such files, and the sample data never reads them. document.write keeps them synchronous, before the app script.
  function loadFiles(...names) {
    if (mock) return;
    for (const n of names) document.write(`<script src="data/${n}.js"><\/script>`);
  }

  // A line fixed across the top of the window, with a hairline under it. Only while the sample data is showing.
  function banner(what = 'invoices') {
    if (!mock || document.querySelector('.banner')) return;
    document.body.classList.add('has-banner');
    const action = demo
      ? el('a', { class: 'btn', href: REPO, target: '_blank', rel: 'noopener' }, 'Get it on GitHub')
      : el('button', { class: 'btn', type: 'button', onclick: choose }, `Start creating your own ${what}`);
    document.body.prepend(el('div', { class: 'banner' },
      el('span', {}, demo
        ? `A live demo with sample data. Try anything: nothing is saved, and the invoice still prints.`
        : `You are looking at sample data. Nothing you change here is saved.`),
      el('span', { class: 'spacer' }), action));
  }

  window.dataset = { mode, mock, demo, own: !mock, choose, banner, loadFiles, buffer, home, scope, key, repo: REPO };
})();
