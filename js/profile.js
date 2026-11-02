const root = document.getElementById('profile');
const params = new URLSearchParams(location.search);
const all = Store.all();
const user = params.get('id') ? Store.get(params.get('id')) : all[all.length - 1];

if (!user) {
  root.replaceChildren(document.getElementById('emptyTpl').content.cloneNode(true));
  document.title = 'No record · Registry';
} else {
  const no = recordNo(user);
  document.title = `${user.name} · Registry`;
  root.querySelector('.eyebrow').textContent = `Record No. ${no} · ${formatDate(user.createdAt)}`;
  root.querySelector('h1').textContent = user.name;
  root.querySelector('.sub').textContent = `${user.gender} · ${user.city}, ${user.state}, ${user.country}`;
  if (params.has('saved')) root.querySelector('.notice').hidden = false;

  const rows = [
    ['Full name', user.name],
    ['Gender', user.gender],
    ['Mobile number', user.mobile, 'tel:' + user.mobile.replace(/\s/g, '')],
    ['Email', user.email, 'mailto:' + user.email],
    ['City', user.city],
    ['State', user.state],
    ['Country', user.country]
  ];
  const dl = root.querySelector('.record');
  rows.forEach(([k, v, href]) => {
    const row = el('div'), dd = el('dd');
    if (href) dd.append(el('a', { href }, v)); else dd.textContent = v;
    row.append(el('dt', {}, k), dd);
    dl.append(row);
  });

  // Previous / next record
  const i = all.findIndex(u => u.id === user.id);
  const pager = root.querySelector('.pager');
  const link = (u, label, dir) => {
    if (!u) return el('span', {}, label);
    const a = el('a', { href: `profile.html?id=${encodeURIComponent(u.id)}`, rel: dir });
    a.textContent = dir === 'prev' ? `← ${u.name}` : `${u.name} →`;
    a.setAttribute('aria-label', `${dir === 'prev' ? 'Previous' : 'Next'} record: ${u.name}`);
    return a;
  };
  pager.append(link(all[i - 1], 'First record', 'prev'), link(all[i + 1], 'Latest record', 'next'));
  document.getElementById('printBtn').addEventListener('click', () => window.print());
}
