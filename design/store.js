/* store.js: keep an app's JSON in a folder the user picks, next to localStorage.
   Uses the File System Access API (Chrome). The folder handle is remembered in IndexedDB; Chrome asks once per
   session (via a click) before the folder can be read again. Load ui.js first. */
(function () {
  const DB = 'scs-store', OS = 'kv';
  // one remembered folder per copy of the project (see shared/dataset.js), so duplicates never share a data folder
  const DIR_KEY = 'dir:' + (window.dataset?.scope || 'default');
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(OS); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idbGet = async k => { const d = await idb(); return new Promise((res, rej) => { const t = d.transaction(OS).objectStore(OS).get(k); t.onsuccess = () => res(t.result); t.onerror = () => rej(t.error); }); };
  const idbSet = async (k, v) => { const d = await idb(); return new Promise((res, rej) => { const t = d.transaction(OS, 'readwrite').objectStore(OS).put(v, k); t.onsuccess = () => res(); t.onerror = () => rej(t.error); }); };
  const supported = 'showDirectoryPicker' in window;
  let dir = null;

  // 'unsupported' | 'none' (no folder chosen yet) | 'prompt' (chosen, needs a click to reopen) | 'connected'
  async function status() {
    if (!supported) return 'unsupported';
    if (dir) return 'connected';
    const h = await idbGet(DIR_KEY); if (!h) return 'none';
    if ((await h.queryPermission({ mode: 'readwrite' })) === 'granted') { dir = h; return 'connected'; }
    return 'prompt';
  }
  async function connect() { dir = await window.showDirectoryPicker({ mode: 'readwrite', id: 'scs-data' }); await idbSet(DIR_KEY, dir); return dir; }
  async function request() { const h = await idbGet(DIR_KEY); if (!h) return false; if ((await h.requestPermission({ mode: 'readwrite' })) === 'granted') { dir = h; return true; } return false; }
  // Files go straight into the picked folder (pick the app's data/ folder). Each state is written twice: <key>.json for
  // people and tools, and <key>.js, a loader the page includes with a plain <script src> from file:// so the data comes
  // back with no permission and no click.
  const putFile = async (name, text) => { const f = await dir.getFileHandle(name, { create: true }); const w = await f.createWritable(); await w.write(text); await w.close(); };
  async function read(key) { if (!dir) return null; try { const f = await dir.getFileHandle(key + '.json'); return JSON.parse(await (await f.getFile()).text()); } catch (e) { return null; } }
  let queue = Promise.resolve();
  function write(key, obj) {
    if (!dir) return Promise.resolve(false);
    if (!obj.savedAt) obj.savedAt = Date.now();
    const json = JSON.stringify(obj, null, 2);
    queue = queue.then(async () => { await putFile(key + '.js', `window.__scs = window.__scs || {};\nwindow.__scs[${JSON.stringify(key)}] = ${json};\n`); await putFile(key + '.json', json); return true; })
      .catch(e => { console.warn('store: write failed', e); return false; });
    return queue;
  }
  // what the loader script (data/<key>.js) put on the page, if the page included it
  const loaded = key => window.__scs?.[key] || null;
  const folder = () => dir?.name || '';

  // Wire an app: `file` is the JSON name, get/set read and replace the app state, `adopt` re-renders after a swap.
  // Returns { sync, bar } where bar(container) renders the one-line status/link at the top of a list.
  function attach({ key, get, set, adopt }) {
    let st = 'none';
    // a copy that was never saved (fresh seeds after a browser reset) always loses to a file
    const newer = (a, b) => !!a && (!b?.savedAt || (a.savedAt || 0) > b.savedAt);
    // 1. the loader file, if the page included it, wins over the browser copy when newer (works with no permission at all)
    const fromLoader = loaded(key);
    if (newer(fromLoader, get())) { set(fromLoader); adopt(); }
    async function sync() {
      st = await status();
      if (st !== 'connected') return st;
      const onDisk = await read(key), mine = get();
      if (newer(onDisk, mine)) { set(onDisk); adopt(); }
      else write(key, mine);
      return st;
    }
    function bar(container) {
      container.querySelectorAll('.store-bar').forEach(n => n.remove());
      if (st === 'connected' || st === 'unsupported') return;
      const link = el('button', { class: 'btn secondary', type: 'button', onclick: async () => {
        try { if (st === 'none') { await connect(); if (folder() !== 'data') toast('Tip: pick the app\'s data folder so the page can load the files by itself'); } else if (!(await request())) return; } catch (e) { if (e.name !== 'AbortError') toast('Could not open the folder: ' + e.message); return; }
        await sync(); adopt(); toast(`Saving to ${folder()}/${key}.json`);
      } }, st === 'none' ? 'Store data in a folder' : 'Connect data folder');
      link.title = st === 'none' ? 'Right now the data lives only in this browser. Pick a folder and it is also saved there as JSON.' : 'The data folder needs your permission again after a restart.';
      const bar = el('div', { class: 'store-bar' }, link), top = container.querySelector(':scope > .list-top');
      top ? top.after(bar) : container.prepend(bar);   // below the list's main action when there is one
    }
    return { sync, bar, save: () => write(key, get()), get status() { return st; } };
  }

  window.store = { supported, status, connect, request, read, write, loaded, folder, attach };
})();
