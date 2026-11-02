/* Shared storage + helpers for all pages */
const STORE_KEY = 'lab8.users';

const Store = {
  all() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch { return []; }
  },
  save(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; }
    catch { return false; }
  },
  add(user) { const l = this.all(); l.push(user); return this.save(l); },
  get(id) { return this.all().find(u => u.id === id); },
  latest() { const l = this.all(); return l[l.length - 1]; },
  remove(id) { this.save(this.all().filter(u => u.id !== id)); },
  clear() { try { localStorage.removeItem(STORE_KEY); } catch {} }
};

const LOCATIONS = {
  India: ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'],
  'United States': ['Alabama','Alaska','Arizona','California','Colorado','Florida','Georgia','Illinois','Massachusetts','Michigan','New Jersey','New York','North Carolina','Ohio','Pennsylvania','Texas','Virginia','Washington'],
  Canada: ['Alberta','British Columbia','Manitoba','New Brunswick','Nova Scotia','Ontario','Quebec','Saskatchewan'],
  Australia: ['New South Wales','Queensland','South Australia','Tasmania','Victoria','Western Australia'],
  'United Kingdom': ['England','Northern Ireland','Scotland','Wales'],
  Germany: ['Bavaria','Berlin','Hamburg','Hesse','Lower Saxony','North Rhine-Westphalia','Saxony'],
  'United Arab Emirates': ['Abu Dhabi','Dubai','Sharjah','Ajman','Fujairah','Ras Al Khaimah','Umm Al Quwain'],
  Singapore: ['Central','East','North','North-East','West']
};

function recordNo(user) {
  const i = Store.all().findIndex(u => u.id === user.id);
  return String(i + 1).padStart(4, '0');
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
}

function el(tag, attrs = {}, text) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  if (text !== undefined) n.textContent = text; // textContent: user input is never parsed as HTML
  return n;
}
