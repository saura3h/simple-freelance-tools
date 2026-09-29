/* parties.js: the clients and issuer profiles shared by invoices.html and agreements.html.
   One list, saved once (localStorage 'scs-parties' and data/parties.json via store.js), read by both apps.
   Clients are the invoice's "Bill to" and the agreement's Company; issuers are the invoice's "Service from" and the
   agreement's Consultant. Each record carries the union of both apps' fields; each app ignores what it doesn't use.
   Load ui.js, store.js and data/parties.js first. */
(function () {
  const LS_KEY = dataset.key('scs-parties-own');   // named after this copy of the project, see dataset.js
  const clone = o => JSON.parse(JSON.stringify(o));

  // mock data: every name, number and address here is made up
  const SEED = {
    issuers: [
      { id: 'iss-ka', label: 'Bengaluru office', company: 'Northwind Design Studio', gstin: '29ABCDE1234F1Z5', pan: 'ABCDE1234F',
        address: '4th Floor, 12 Example Towers, 100 Feet Road, Indiranagar, Bengaluru, Karnataka – 560038, India',
        country: 'India', state: 'Karnataka', email: 'hello@northwind.example', phone: '+91 98765 43210', signatory: 'Alex Rao', entity: 'proprietor', designation: 'Proprietor' },
      { id: 'iss-mh', label: 'Mumbai office', company: 'Northwind Design Studio', gstin: '27ABCDE1234F1Z9', pan: 'ABCDE1234F',
        address: 'Unit 7, Sample House, Linking Road, Bandra West, Mumbai, Maharashtra – 400050, India',
        country: 'India', state: 'Maharashtra', email: 'mumbai@northwind.example', phone: '+91 98765 43210', signatory: 'Alex Rao', entity: 'proprietor', designation: 'Proprietor' },
    ],
    clients: [
      { id: 'cl-acme', name: 'Acme Analytics Ltd', address: '1 Example Street\nLondon, EC1A 1AA\nUnited Kingdom', country: 'United Kingdom', state: '', gstin: '', email: 'accounts@acme-analytics.example', currency: 'GBP', entity: 'foreign', signatory: '', designation: '' },
      { id: 'cl-bluebird', name: 'Bluebird Labs Pvt Ltd', address: '22 Sample Layout, Koramangala,\nBengaluru, Karnataka - 560034, India', country: 'India', state: 'Karnataka', gstin: '29AAACB1234C1Z2', email: 'finance@bluebirdlabs.example', currency: 'INR', entity: 'company', signatory: '', designation: '' },
      { id: 'cl-riya', name: 'Riya Kapoor', address: 'Flat 3B, Placeholder Apartments, Baner Road, Pune, Maharashtra - 411045, India', country: 'India', state: 'Maharashtra', gstin: '27ABCPK1234D1Z3', email: 'riya.kapoor@mail.example', currency: 'INR', entity: 'proprietor', signatory: 'Riya Kapoor', designation: 'Proprietor' },
      { id: 'cl-orbit', name: 'Orbit Commerce Pvt Ltd', address: '9 Demo Plaza, Connaught Place, New Delhi, Delhi 110001', country: 'India', state: 'Delhi', gstin: '07AAACO1234E1Z4', email: 'accounts@orbitcommerce.example', currency: 'INR', entity: 'company', signatory: '', designation: '' },
      { id: 'cl-lumen', name: 'Lumen Goods LLC', address: 'Arizona 85001', country: 'United States', state: 'Arizona', gstin: '', email: 'ap@lumengoods.example', currency: 'USD', entity: 'foreign', signatory: '', designation: '' },
      { id: 'cl-harbor', name: 'Harbor Learning Inc', address: '500 Example Ave., Suite 100, Boise, ID 83702', country: 'United States', state: 'Idaho', gstin: '', email: 'billing@harbor.example', currency: 'USD', entity: 'foreign', signatory: '', designation: '' },
    ],
  };

  const newer = (a, b) => !!a && (!b?.savedAt || (a.savedAt || 0) > b.savedAt);
  const fromLS = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; } };
  let data = null, lastSaved = '', disk = null;
  const listeners = [];

  function load() {
    if (dataset.mock) { data = clone(SEED); lastSaved = ''; return; }   // sample data: seeds only, never saved
    const ls = dataset.buffer.read(LS_KEY), file = window.__scs?.parties || null;   // the folder file, unless the buffer is newer
    data = newer(file, ls) ? clone(file) : ls || { clients: [], issuers: [] };   // your own set starts empty
    data.clients = data.clients || []; data.issuers = data.issuers || [];
    lastSaved = JSON.stringify({ clients: data.clients, issuers: data.issuers });
  }

  // Add records an app kept in its own state before the lists were shared. Known ids only get their missing fields filled.
  function merge(kind, records) {
    if (!data) load();
    let changed = false;
    for (const r of records || []) {
      const mine = data[kind].find(x => x.id === r.id);
      if (!mine) { data[kind].push(clone(r)); changed = true; continue; }
      for (const [k, v] of Object.entries(r)) if (mine[k] === undefined && v !== undefined) { mine[k] = clone(v); changed = true; }
    }
    return changed;
  }
  // Writes only when the lists actually changed, so an app saving its own state never overwrites the other app's edits.
  function save(force = false) {
    if (dataset.mock) return;   // the sample data is never written anywhere
    if (!data) load();
    const now = JSON.stringify({ clients: data.clients, issuers: data.issuers });
    if (!force && now === lastSaved) return;
    const onDisk = fromLS();
    if (onDisk && onDisk.savedAt && onDisk.savedAt > (data.savedAt || 0) && JSON.stringify({ clients: onDisk.clients, issuers: onDisk.issuers }) !== lastSaved) {
      // another tab saved in the meantime: keep its lists and re-apply this tab's additions on top
      const mine = data; data = onDisk; merge('clients', mine.clients); merge('issuers', mine.issuers);
      for (const kind of ['clients', 'issuers']) for (const r of mine[kind]) { const i = data[kind].findIndex(x => x.id === r.id); if (i >= 0) data[kind][i] = r; }
    }
    data.savedAt = Date.now();
    lastSaved = JSON.stringify({ clients: data.clients, issuers: data.issuers });
    dataset.buffer.through(LS_KEY, data, disk ? disk.save() : false);
  }
  // Bind state.clients / state.issuers (not saved with the app's own state) to the shared lists.
  function bind(state, map = { clients: 'clients', issuers: 'issuers' }) {
    if (!data) load();
    for (const [prop, kind] of Object.entries(map)) {
      const d = Object.getOwnPropertyDescriptor(state, prop);
      if (d && d.enumerable) { merge(kind, state[prop]); delete state[prop]; }
      Object.defineProperty(state, prop, { get: () => data[kind], set: v => { data[kind] = v; }, enumerable: false, configurable: true });
    }
    return state;
  }
  // The folder copy (data/parties.json). adopt re-renders the app when the file or another tab brings newer lists.
  function attach(adopt) {
    if (dataset.mock) return null;   // no data folder for the sample data
    listeners.push(adopt);
    if (!disk && window.store) disk = store.attach({ key: 'parties', get: () => data, set: d => { data = d; lastSaved = JSON.stringify({ clients: d.clients, issuers: d.issuers }); }, adopt: () => listeners.forEach(f => f()) });
    return disk;
  }
  // another tab (the other app) saved: take its lists
  window.addEventListener('storage', e => {
    if (e.key !== LS_KEY || !e.newValue) return;
    try { const d = JSON.parse(e.newValue); if (newer(d, data)) { data = d; lastSaved = JSON.stringify({ clients: d.clients, issuers: d.issuers }); listeners.forEach(f => f()); } } catch (err) {}
  });

  window.parties = { SEED, load, merge, save, bind, attach, get data() { if (!data) load(); return data; } };
})();
