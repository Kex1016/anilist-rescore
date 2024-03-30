export function setupMatomo() {
  const _mtm = [];
  _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
  const d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.src = 'https://analytics.haiiro.moe/js/container_L7YyvxMl.js';
  if (s.parentNode) s.parentNode.insertBefore(g, s);
}