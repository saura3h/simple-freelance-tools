/* analytics.js: Google Analytics, on the public demo only.

   The demo is served under saurabh.so, so it reports to the same property as the rest of that site, grouped as
   'freelance-tools'. The hosts are the ones dataset.js treats as the demo: a copy someone else clones, hosts or opens
   locally loads nothing and sends nothing. */
(function () {
  const ID = 'G-YX4F6LF62K';
  const HOSTS = [/(^|\.)saurabh\.so$/, /(^|-)simple-freelance-tools[^.]*\.vercel\.app$/];
  if (!HOSTS.some(re => re.test(location.hostname))) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ID, { content_group: 'freelance-tools' });
})();
