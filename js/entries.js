const tbody = document.querySelector('tbody');
const search = document.getElementById('search');
const count = document.getElementById('count');
const list = document.getElementById('list');
const empty = document.getElementById('empty');

function cell(label, cls) { return el('td', { 'data-label': label, ...(cls ? { class: cls } : {}) }); }

function render() {
  const all = Store.all();
  const users = all.map((u, i) => ({ ...u, no: String(i + 1).padStart(4, '0') })).reverse();
  const q = search.value.trim().toLowerCase();
  const rows = users.filter(u => [u.name, u.email, u.city, u.state, u.country, u.mobile, u.no].join(' ').toLowerCase().includes(q));

  list.hidden = !users.length;
  empty.hidden = !!users.length;
  count.textContent = q
    ? `${rows.length} of ${users.length} records match`
    : `${users.length} ${users.length === 1 ? 'record' : 'records'}`;

  tbody.innerHTML = '';
  rows.forEach(u => {
    const tr = el('tr');
    const num = cell('No.', 'num'); num.textContent = u.no;
    const name = cell('Name', 'name');
    name.append(el('a', { href: `profile.html?id=${encodeURIComponent(u.id)}` }, u.name));
    const gender = cell('Gender'); gender.textContent = u.gender;
    const contact = cell('Contact');
    const c = el('div'); c.append(el('span', {}, u.email), el('span', { class: 'muted' }, u.mobile)); contact.append(c);
    const place = cell('Location');
    const l = el('div'); l.append(el('span', {}, u.city), el('span', { class: 'muted' }, `${u.state}, ${u.country}`)); place.append(l);
    const act = cell('', 'act');
    const del = el('button', { class: 'remove', type: 'button', 'aria-label': `Remove record ${u.no}, ${u.name}` }, 'Remove');
    del.addEventListener('click', () => {
      if (confirm(`Remove the record for ${u.name}? This cannot be undone.`)) {
        Store.remove(u.id); render();
        document.getElementById('live').textContent = `Removed ${u.name}.`;
        search.focus();
      }
    });
    act.append(del);
    tr.append(num, name, gender, contact, place, act);
    tbody.append(tr);
  });
  if (users.length && !rows.length) {
    const tr = el('tr'), td = el('td', { colspan: '6' }, `No records match “${search.value.trim()}”.`);
    td.style.color = 'var(--ink-2)'; tr.append(td); tbody.append(tr);
  }
}

search.addEventListener('input', render);
document.getElementById('clearAll').addEventListener('click', () => {
  if (confirm('Remove every record saved in this browser? This cannot be undone.')) {
    Store.clear(); render();
    document.getElementById('live').textContent = 'All records removed.';
  }
});
render();
