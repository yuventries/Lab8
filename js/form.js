const form = document.getElementById('userForm');
const country = document.getElementById('country');
const state = document.getElementById('state');
const summary = document.getElementById('errorSummary');

Object.keys(LOCATIONS).sort().forEach(c => country.append(el('option', { value: c }, c)));

function fillStates() {
  state.innerHTML = '';
  const list = LOCATIONS[country.value] || [];
  state.append(el('option', { value: '' }, list.length ? 'Select a state' : 'Choose a country first'));
  list.forEach(s => state.append(el('option', { value: s }, s)));
  state.disabled = !list.length;
}
country.addEventListener('change', fillStates);

// Match the calling code to the chosen country unless the user picked one themselves.
const CODE_FOR = { India: 'IN', 'United States': 'US', Canada: 'CA', 'United Kingdom': 'GB', Australia: 'AU', Germany: 'DE', 'United Arab Emirates': 'AE', Singapore: 'SG' };
const codeSel = form.elements.code;
codeSel.addEventListener('change', () => { codeSel.dataset.touched = '1'; });
country.addEventListener('change', () => {
  if (codeSel.dataset.touched) return;
  const opt = [...codeSel.options].find(o => o.text.startsWith(CODE_FOR[country.value] + ' '));
  if (opt) codeSel.value = opt.value, opt.selected = true;
});

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,49}$/;
const rules = {
  name:    v => !v.trim() ? 'Enter your full name'
              : NAME_RE.test(v.trim()) || 'Full name can only contain letters, spaces, hyphens and apostrophes',
  gender:  v => !!v || 'Select your gender',
  mobile:  v => !v ? 'Enter your mobile number'
              : /^[0-9]{10}$/.test(v) || 'Mobile number must be 10 digits, like 9876543210',
  email:   v => !v.trim() ? 'Enter your email address'
              : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter an email address in the correct format, like name@example.com',
  country: v => !!v || 'Select your country',
  state:   v => !!v || (country.value ? 'Select your state' : 'Select your country first, then your state'),
  city:    v => !v.trim() ? 'Enter your city'
              : NAME_RE.test(v.trim()) || 'City can only contain letters, spaces, hyphens and apostrophes'
};
const focusTarget = { gender: 'g-male' };

function value(name) {
  if (name === 'gender') return (form.querySelector('input[name=gender]:checked') || {}).value || '';
  return form.elements[name].value;
}

function validateField(name) {
  const res = rules[name](value(name));
  const ok = res === true;
  const field = form.querySelector(`[data-field="${name}"]`);
  field.classList.toggle('invalid', !ok);
  field.querySelector('.error').lastChild.textContent = ok ? '' : res;
  field.querySelectorAll('input:not([type=radio]),select:not([name=code])').forEach(i => i.setAttribute('aria-invalid', String(!ok)));
  return ok ? null : res;
}

// Validate when the user leaves a field; once a field shows an error, re-check it as they fix it.
Object.keys(rules).forEach(name => {
  form.querySelectorAll(`[name="${name}"]`).forEach(input => {
    const isRadio = input.type === 'radio';
    input.addEventListener(isRadio ? 'change' : 'blur', e => {
      // If focus is heading to Save/Clear, let submit/reset handle it: showing an error here
      // would shift the layout under the pointer and swallow the click.
      if (e.relatedTarget && e.relatedTarget.closest('.form-actions')) return;
      validateField(name);
    });
    input.addEventListener(isRadio ? 'change' : 'input', () => {
      if (form.querySelector(`[data-field="${name}"]`).classList.contains('invalid')) validateField(name);
    });
    if (input.tagName === 'SELECT') input.addEventListener('change', () => validateField(name));
  });
});

// Keep digits only (handles pasted "98765 43210" or "+91-98765-43210")
document.getElementById('mobile').addEventListener('input', e => {
  let d = e.target.value.replace(/\D/g, '');
  if (d.length > 10 && d.startsWith(form.elements.code.value.slice(1))) d = d.slice(form.elements.code.value.length - 1);
  e.target.value = d.slice(0, 10);
});

function showSummary(errors) {
  const list = summary.querySelector('ul');
  list.innerHTML = '';
  errors.forEach(([name, msg]) => {
    const a = el('a', { href: '#' + (focusTarget[name] || name) }, msg);
    a.addEventListener('click', e => { e.preventDefault(); document.getElementById(focusTarget[name] || name).focus(); });
    list.append(el('li')); list.lastChild.append(a);
  });
  summary.querySelector('h2').textContent =
    errors.length === 1 ? 'There is a problem with your answer' : `There are ${errors.length} problems with your answers`;
  summary.hidden = false;
  summary.focus();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const errors = Object.keys(rules).map(n => [n, validateField(n)]).filter(([, m]) => m);
  if (errors.length) { showSummary(errors); return; }
  summary.hidden = true;
  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: value('name').trim().replace(/\s+/g, ' '),
    gender: value('gender'),
    mobile: `${form.elements.code.value} ${value('mobile').replace(/(\d{5})(\d{5})/, '$1 $2')}`,
    email: value('email').trim().toLowerCase(),
    city: value('city').trim(),
    state: value('state'),
    country: value('country'),
    createdAt: new Date().toISOString()
  };
  if (!Store.add(user)) {
    showSummary([['name', 'Your browser blocked storage, so the record could not be saved. Try a non-private window.']]);
    return;
  }
  location.href = `profile.html?id=${encodeURIComponent(user.id)}&saved=1`;
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    form.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));
    form.querySelectorAll('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
    summary.hidden = true;
    delete codeSel.dataset.touched;
    fillStates();
  });
});
