(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const notes = window.SPEAKER_NOTES;
  const storageKey = 'ns2-speaker-v1';
  const team = [
    {name:'Long', initial:'L', theory:'4.4.1 · Bộ lập lịch sự kiện', practice:'Mở đầu, tổng kết và hỏi đáp', color:'#dce8ce', ink:'#35592a'},
    {name:'Minh', initial:'M', theory:'4.4.2 · Ghi vết sự kiện', practice:'Chạy mô phỏng, đọc trace và phân tích AWK', color:'#d4e8eb', ink:'#275a65'},
    {name:'Bảo', initial:'B', theory:'4.4.3 · Thiết lập mô hình mạng', practice:'Tô-pô, lỗi, định tuyến và ví dụ mạng có dây', color:'#eee0cb', ink:'#7b5424'},
    {name:'Thành', initial:'T', theory:'4.4.4 · Kết nối tầng giao vận', practice:'TCP/UDP, ví dụ không dây và hướng dẫn demo', color:'#e4dded', ink:'#655077'},
    {name:'Đạt', initial:'Đ', theory:'4.4.5–4.4.6 · Lưu lượng & thời gian', practice:'Chỉ số, kết quả và cải tiến hiệu năng', color:'#eedbd5', ink:'#805044'}
  ];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* Reading still works without storage. */ }
  let custom = saved.custom && typeof saved.custom === 'object' && !Array.isArray(saved.custom) ? saved.custom : {};
  let fontSize = Math.max(16, Math.min(28, Number(saved.fontSize) || 19));
  let filter = team.some(p => p.name === saved.filter) ? saved.filter : 'all';
  let current = 0;
  let deckStyles = '';
  let slideHTML = [];
  let toastTimer;
  const scrollPositions = new Map();

  function notice(message) {
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3200);
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({custom, fontSize, filter, slide:current + 1})); return true; }
    catch { return false; }
  }
  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function available() { return notes.map((n,i) => i).filter(i => filter === 'all' || notes[i].speaker === filter); }
  function paragraphsFor(note) {
    const edited = custom[note.slide];
    return Array.isArray(edited) && edited.length && edited.every(p => typeof p === 'string') ? edited : note.paragraphs;
  }
  function minutes(seconds) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }
  function applyFont() {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    $('font-down').disabled = fontSize <= 16;
    $('font-up').disabled = fontSize >= 28;
    requestAnimationFrame(updateReadingProgress);
  }
  function updateReadingProgress() {
    const panel = $('script-scroll');
    const total = panel.scrollHeight - panel.clientHeight;
    $('reading-progress').style.width = `${total <= 1 ? 100 : Math.min(100, panel.scrollTop / total * 100)}%`;
  }
  function slideDocument(index, large = false) {
    const overrides = large
      ? 'html,body{height:auto;overflow:auto}.slide{position:relative;visibility:visible;opacity:1;transform:none;min-height:100vh;padding-bottom:45px;overflow:visible}.title-slide{min-height:75vh;height:auto}pre{white-space:pre-wrap;overflow-wrap:anywhere}table{display:block;overflow:auto}'
      : 'html,body{height:auto;overflow:hidden}.slide{position:relative;visibility:visible;opacity:1;transform:none;min-height:720px;height:auto;overflow:visible;padding:40px 60px 44px}.title-slide{min-height:636px;height:auto}';
    return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${deckStyles}\n${overrides}</style></head><body>${slideHTML[index]}</body></html>`;
  }
  function fitPreview() {
    const frame = $('slide-preview');
    const slide = frame.contentDocument?.querySelector('.slide');
    if (!slide) return;
    const height = Math.max(720, Math.ceil(slide.scrollHeight), Math.ceil(slide.getBoundingClientRect().height));
    frame.style.height = `${height}px`;
    const box = $('preview-box');
    const scale = Math.min(box.clientWidth / 1280, box.clientHeight / height);
    frame.style.transform = `scale(${scale})`;
    frame.style.left = `${(box.clientWidth - 1280 * scale) / 2}px`;
    frame.style.top = `${(box.clientHeight - height * scale) / 2}px`;
  }
  function render(index, {rememberScroll = true} = {}) {
    if (rememberScroll) scrollPositions.set(current, $('script-scroll').scrollTop);
    current = Math.max(0, Math.min(notes.length - 1, index));
    const note = notes[current];
    const person = team.find(p => p.name === note.speaker);
    const sequence = available();
    const position = sequence.indexOf(current);
    $('slide-counter').textContent = `${String(note.slide).padStart(2, '0')} / ${notes.length}`;
    $('position').textContent = `${String(position + 1).padStart(2, '0')} / ${sequence.length}`;
    $('position-label').textContent = filter === 'all' ? 'trang chiếu' : `phần ${filter}`;
    $('speaker-name').textContent = note.speaker;
    $('section-label').textContent = note.section;
    $('speaker-avatar').textContent = person.initial;
    $('speaker-avatar').style.background = person.color;
    $('speaker-avatar').style.color = person.ink;
    $('speaker-avatar').style.borderColor = person.color;
    $('duration').textContent = `≈ ${minutes(note.seconds)} phút`;
    $('script-title').textContent = note.title;
    $('script-body').replaceChildren(...paragraphsFor(note).map(p => element('p', p)));
    $('script-cues').replaceChildren(...note.cues.map(c => element('li', c)));
    $('transition').textContent = note.transition;
    $('edited-label').hidden = !custom[note.slide];
    $('preview-caption').textContent = note.title;
    $('original-link').href = `index.html#${note.slide}`;
    $('previous').disabled = position <= 0;
    $('next').disabled = position >= sequence.length - 1;
    $('next-speaker').textContent = position < sequence.length - 1 ? notes[sequence[position + 1]].speaker : 'Hoàn tất';
    document.title = `${note.slide}. ${note.title} · Kịch bản NS-2`;
    $('slide-preview').srcdoc = slideDocument(current);
    document.querySelectorAll('.slide-item').forEach((button, i) => {
      button.classList.toggle('active', i === current);
      if (i === current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('.team-row').forEach(button => button.classList.toggle('selected', button.dataset.name === filter));
    history.replaceState(null, '', `#${note.slide}`);
    persist();
    $('script-scroll').scrollTop = scrollPositions.get(current) || 0;
    requestAnimationFrame(updateReadingProgress);
  }
  function selectFilter(name) {
    filter = name;
    $('speaker-filter').value = name;
    const sequence = available();
    render(sequence.includes(current) ? current : sequence[0]);
  }
  function move(direction) {
    const sequence = available();
    const index = sequence.indexOf(current) + direction;
    if (index >= 0 && index < sequence.length) render(sequence[index]);
  }
  function buildOutline() {
    team.forEach(person => {
      const own = notes.filter(n => n.speaker === person.name);
      const seconds = own.reduce((sum,n) => sum + n.seconds, 0);
      const avatar = element('span', person.initial, 'avatar');
      avatar.style.background = person.color;
      avatar.style.color = person.ink;
      avatar.style.borderColor = person.color;
      const item = element('div', undefined, 'assignment-item');
      const copy = element('div', undefined, 'assignment-copy');
      copy.append(element('strong', `${person.name} · ${person.theory}`), element('p', person.practice), element('p', `Slide ${own.map(n => n.slide).join(', ')} · khoảng ${minutes(seconds)} phút`));
      const practice = element('button', 'Tập phần này');
      practice.addEventListener('click', () => { selectFilter(person.name); $('outline-dialog').close(); });
      item.append(avatar.cloneNode(true), copy, practice);
      $('assignment-list').append(item);
      const row = element('button', undefined, 'team-row');
      row.dataset.name = person.name;
      const label = element('span');
      label.append(element('strong', person.name), element('small', person.theory));
      row.append(avatar, label, element('span', `${own.length} slide · ${minutes(seconds)}`, 'team-time'));
      row.addEventListener('click', () => selectFilter(filter === person.name ? 'all' : person.name));
      $('desktop-team').append(row);
    });
    notes.forEach((note, index) => {
      const button = element('button', undefined, 'slide-item');
      const copy = element('span', undefined, 'slide-copy');
      copy.append(element('strong', note.title), element('small', `${note.speaker} · ${note.section} · ${minutes(note.seconds)}`));
      button.append(element('span', String(note.slide).padStart(2, '0'), 'slide-number'), copy);
      button.addEventListener('click', () => {
        if (filter !== 'all' && note.speaker !== filter) { filter = 'all'; $('speaker-filter').value = 'all'; }
        render(index);
        $('outline-dialog').close();
      });
      $('slide-list').append(button);
    });
  }
  function exportScript() {
    const heading = ['KỊCH BẢN THUYẾT TRÌNH NS-2', 'Dựa trên 28 slide của bài thuyết trình hiện tại.', '', ...team.map(p => `${p.name}: ${p.theory}; ${p.practice}.`), '', 'Thời gian là gợi ý luyện tập. Lời đã chỉnh trên trình duyệt này được đưa vào bản tải.', ''];
    const sections = notes.flatMap(n => [`SLIDE ${n.slide} — ${n.title}`, `${n.speaker} | ${n.section} | Khoảng ${minutes(n.seconds)} phút`, '', ...paragraphsFor(n).flatMap(p => [p, '']), 'NHẮC KHI TRÌNH BÀY', ...n.cues.map(c => `• ${c}`), '', `CHUYỂN TIẾP: ${n.transition}`, '', '─'.repeat(50), '']);
    const blob = new Blob(['\uFEFF', [...heading, ...sections].join('\r\n')], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = element('a'); link.href = url; link.download = 'kich-ban-thuyet-trinh-NS2.txt';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function initialize() {
    if (!Array.isArray(notes) || notes.length !== 28 || notes.some((n,i) => n.slide !== i + 1)) throw new Error('Không tải được dữ liệu kịch bản. Hãy tải lại trang.');
    const response = await fetch('index.html', {cache:'no-cache'});
    if (!response.ok) throw new Error('Không tải được bài chiếu gốc. Kiểm tra kết nối rồi tải lại trang.');
    const source = new DOMParser().parseFromString(await response.text(), 'text/html');
    source.querySelectorAll('script').forEach(script => script.remove());
    deckStyles = [...source.querySelectorAll('style')].map(style => style.textContent).join('\n');
    slideHTML = [...source.querySelectorAll('.slide')].map(slide => slide.outerHTML);
    if (slideHTML.length !== notes.length) throw new Error('Số slide của bài chiếu đã thay đổi. Cần cập nhật kịch bản tương ứng trước khi luyện tập.');
    $('slide-preview').addEventListener('load', () => { fitPreview(); $('preview-loading').hidden = true; });
    new ResizeObserver(fitPreview).observe($('preview-box'));
    buildOutline();
    const hashSlide = Number(location.hash.slice(1));
    const initial = Number.isInteger(hashSlide) && hashSlide >= 1 && hashSlide <= notes.length ? hashSlide : Number(saved.slide) || 1;
    current = Math.max(0, Math.min(notes.length - 1, initial - 1));
    if (filter !== 'all' && notes[current].speaker !== filter) filter = 'all';
    $('speaker-filter').value = filter;
    applyFont(); render(current, {rememberScroll:false});
    $('workspace').setAttribute('aria-busy', 'false');
    $('previous').addEventListener('click', () => move(-1));
    $('next').addEventListener('click', () => move(1));
    $('speaker-filter').addEventListener('change', e => selectFilter(e.target.value));
    $('font-down').addEventListener('click', () => {fontSize = Math.max(16, fontSize - 1); applyFont(); persist();});
    $('font-up').addEventListener('click', () => {fontSize = Math.min(28, fontSize + 1); applyFont(); persist();});
    $('script-scroll').addEventListener('scroll', updateReadingProgress, {passive:true});
    new ResizeObserver(updateReadingProgress).observe($('script-scroll'));
    $('open-outline').addEventListener('click', () => $('outline-dialog').showModal());
    $('expand-slide').addEventListener('click', () => {
      $('large-slide-title').textContent = `Slide ${current + 1} · ${notes[current].title}`;
      $('large-slide').srcdoc = slideDocument(current, true); $('preview-dialog').showModal();
    });
    document.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
    $('export-script').addEventListener('click', exportScript);
    $('export-mobile').addEventListener('click', exportScript);
    $('edit-script').addEventListener('click', () => {
      $('edit-text').value = paragraphsFor(notes[current]).join('\n\n');
      $('edit-error').textContent = ''; $('edit-dialog').showModal();
    });
    $('save-script').addEventListener('click', () => {
      const text = $('edit-text').value.trim();
      if (!text) { $('edit-error').textContent = 'Hãy nhập lời nói hoặc chọn “Dùng lời gốc”.'; return; }
      custom[current + 1] = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      const stored = persist();
      $('edit-dialog').close(); scrollPositions.set(current, 0); render(current, {rememberScroll:false});
      notice(stored ? 'Đã lưu lời nói trên trình duyệt này.' : 'Đã áp dụng tạm thời. Trình duyệt không cho lưu; hãy tải kịch bản để giữ lại.');
    });
    $('restore-script').addEventListener('click', () => {
      delete custom[current + 1]; const stored = persist(); $('edit-dialog').close();
      scrollPositions.set(current, 0); render(current, {rememberScroll:false});
      notice(stored ? 'Đã khôi phục lời nói gốc.' : 'Đã khôi phục trong phiên này; trình duyệt không cho lưu thay đổi.');
    });
    window.addEventListener('hashchange', () => {
      const number = Number(location.hash.slice(1));
      if (!Number.isInteger(number) || number < 1 || number > notes.length) return;
      if (filter !== 'all' && notes[number - 1].speaker !== filter) { filter = 'all'; $('speaker-filter').value = 'all'; }
      render(number - 1);
    });
    document.addEventListener('keydown', event => {
      if (document.querySelector('dialog[open]') || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight') {event.preventDefault(); move(1);}
      if (event.key === 'ArrowLeft') {event.preventDefault(); move(-1);}
    });
  }
  initialize().catch(error => {
    $('workspace').setAttribute('aria-busy', 'false');
    $('preview-loading').textContent = 'Chưa tải được bài chiếu';
    $('script-title').textContent = 'Chưa mở được kịch bản';
    $('script-body').replaceChildren(element('p', location.protocol === 'file:' ? 'Hãy mở trang qua GitHub Pages hoặc máy chủ xem trước trong repo để tải được bài chiếu gốc.' : error.message));
    ['next','previous','edit-script','open-outline','expand-slide','font-down','font-up','export-script','export-mobile'].forEach(id => $(id).disabled = true);
  });
})();
