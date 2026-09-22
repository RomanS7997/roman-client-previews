'use strict';
(() => {
  const data = window.DIALOG_DATA;
  const $ = (selector) => document.querySelector(selector);
  const nodes = data.nodes;
  const key = `giftsactivate-dialog:${data.reviewRevision || data.revision}`;
  let reviews = {}, reviewer = '', selected = nodes.find(n => n.category === 'entry').id, mode = 'screen', paused = false, edition = 'julia';
  let query = '', filter = 'all';
  const choices = {};
  let toastTimer;
  try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); reviews = saved.reviews || {}; reviewer = saved.reviewer || ''; } catch (_) { /* Review remains usable without storage. */ }
  function icons() { if (window.lucide) window.lucide.createIcons(); }
  function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2700); }
  function current() { return nodes.find(n => n.id === selected); }
  function review(id = selected) { return reviews[id] || { status: 'pending', note: '' }; }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ reviews, reviewer })); $('#save-state').textContent = 'Сохранено на этом устройстве'; }
    catch (_) { $('#save-state').textContent = 'Не сохранено · экспортируйте правки'; }
  }
  function setReview(update) { reviews[selected] = { ...review(), ...update, updatedAt: new Date().toISOString() }; persist(); renderNavigation(); renderDecisions(); }
  function filteredNodes() {
    return nodes.filter(n => (!query || n.search.includes(query) || String(n.number) === query.replace(/^№/, '')) &&
      (filter === 'all' || filter === 'draft' && n.julia.length || filter === 'issues' && n.warnings.length || filter === 'unreviewed' && review(n.id).status !== 'approved'));
  }
  function updatePosition() {
    const visible=filteredNodes(), index=visible.findIndex(n=>n.id===selected);
    $('#current-position').textContent=index>=0?`${index+1} / ${visible.length} экранов`:`Вне фильтра · ${visible.length} экранов`;
    $('#previous').disabled=index<=0;
    $('#next').disabled=!visible.length || index===visible.length-1;
  }
  function step(offset) {
    const visible=filteredNodes(), index=visible.findIndex(n=>n.id===selected);
    const target=visible[index<0?0:Math.max(0,Math.min(visible.length-1,index+offset))];
    if(target) select(target.id);
  }
  function renderNavigation() {
    const host = $('#category-nav');
    const opened = new Set([...host.querySelectorAll('details[open]')].map(el => el.dataset.category));
    host.replaceChildren();
    const filtered = filteredNodes();
    data.sections.forEach(section => {
      const items = filtered.filter(n => n.category === section.key);
      if (!items.length) return;
      const group = document.createElement('details'); group.className = 'category'; group.dataset.category = section.key;
      group.open = Boolean(query || current().category === section.key || opened.has(section.key));
      const summary = document.createElement('summary');
      const label = document.createElement('span'); label.textContent = section.title;
      const count = document.createElement('small'); count.textContent = items.length;
      summary.append(label, count); group.append(summary);
      const nav = document.createElement('nav'); group.append(nav); host.append(group);
      items.forEach(n => {
      const status = review(n.id).status;
      const button = document.createElement('button');
      button.className = `step-item ${selected === n.id ? 'active' : ''} ${status}`;
      button.setAttribute('aria-current', selected === n.id ? 'step' : 'false');
      button.dataset.step = n.id;
      const number = document.createElement('span'); number.className = 'step-number'; number.textContent = n.number || 'DEV';
      const name = document.createElement('span'); name.className = 'step-name'; name.textContent = n.title;
      const marker = document.createElement('i'); marker.dataset.lucide = status === 'approved' ? 'check' : status === 'changes' ? 'pencil' : 'circle'; marker.className = 'status-mark';
      button.append(number, name, marker); button.addEventListener('click', () => select(n.id));
      nav.append(button);
      });
    });
    $('#empty-search').hidden = filtered.length !== 0;
    updatePosition();
    const approved = nodes.filter(n => review(n.id).status === 'approved').length;
    $('#approved-count').textContent = approved; $('#progress').value = approved; $('#percent').textContent = Math.round(approved / nodes.length * 100) + '%';
    icons();
  }
  function safeMessage(html) {
    const template = document.createElement('template'); template.innerHTML = html;
    const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'DEL', 'A', 'CODE', 'PRE', 'BLOCKQUOTE', 'BR', 'SPAN']);
    [...template.content.querySelectorAll('*')].forEach(element => {
      if (!allowed.has(element.tagName)) { element.replaceWith(document.createTextNode(element.textContent)); return; }
      const href = element.getAttribute('href');
      [...element.attributes].forEach(attr => element.removeAttribute(attr.name));
      if (element.tagName === 'A' && href && /^https?:\/\//i.test(href)) {
        element.href = href; element.target = '_blank'; element.rel = 'noopener noreferrer';
      }
    });
    return template.content;
  }
  function boundary(title, targets = []) {
    $('#boundary-title').textContent = title;
    $('#boundary-description').textContent = targets.length ? 'Выберите состояние для просмотра.' : 'В каталоге нет однозначного перехода для этой кнопки. Следующий экран доступен через «Дальше».';
    $('#boundary-options').replaceChildren();
    targets.forEach(n => { const b = document.createElement('button'); b.className = 'button'; b.textContent = n.title; b.addEventListener('click', () => { $('#boundary').close(); select(n.id); }); $('#boundary-options').append(b); });
    $('#boundary').showModal();
  }
  function act(node, button) {
    choices[node.id] = button.text;
    const entry = title => nodes.find(n => n.category === 'entry' && n.title === title);
    let target;
    if (button.contact || /Принять и продолжить/.test(button.text)) target = entry('После телефона: первый вопрос профиля');
    else if (/Мужчина|Женщина/.test(button.text)) target = entry('Вопрос о возрасте');
    else if (node.title === 'Вопрос о возрасте') target = entry('Вопрос об устройстве');
    else if (node.title === 'Вопрос об устройстве') target = nodes.find(n => n.category === 'profile_reward');
    if (target) { select(target.id); return; }
    const routes = [[/Гарантия|Мои покупки|Покупки и билеты/,'profile_reward'], [/Раздачи|заявки/,'giveaway'],[/поклеить|урок|плёнк|Стекло/,'howto'],[/поддерж|оператор/,'support'],[/приз|розыгрыш|билет/,'raffle']];
    const category = routes.find(([re]) => re.test(button.text))?.[1];
    boundary(button.text, nodes.filter(n => n.category === (category || node.category)));
  }
  function keyboard(node, rows) {
    const wrapper = document.createElement('div'); wrapper.className = 'inline-keyboard';
    rows.forEach(row => {
      const element = document.createElement('div'); element.className = 'keyboard-row';
      row.forEach(item => { const b = document.createElement('button'); b.textContent = item.text;
        if (choices[node.id] === item.text) b.classList.add('selected');
        b.addEventListener('click', () => act(node, item)); element.append(b); });
      wrapper.append(element);
    }); return wrapper;
  }
  function renderPhone() {
    const chat = $('#chat'); chat.replaceChildren();
    const day = document.createElement('div'); day.className = 'day'; day.textContent = '21 сентября'; chat.append(day);
    let visible = [current()];
    if (mode === 'dialog') {
      const group = filteredNodes().filter(n => n.category === current().category);
      const index = group.findIndex(n => n.id === selected);
      visible = group.slice(Math.max(0, index - 3), index + 1);
      if (!visible.length) visible = [current()];
    }
    $('#reply-keyboard').replaceChildren();
    visible.forEach(node => {
      const block = document.createElement('section'); block.className = 'message-block'; block.dataset.message = node.id; block.setAttribute('aria-label', node.title);
      if (mode === 'dialog') { const label = document.createElement('div'); label.className = 'day'; label.textContent = node.title; block.append(label); }
      const fallback=edition==='julia'&&!node.julia.length;
      const calls = edition === 'current' || fallback ? node.current : node.julia;
      if (fallback) {
        const note = document.createElement('div'); note.className = 'editor-placeholder';
        note.textContent = 'Текст DEV · редакция Юлии не передана';
        block.append(note);
      }
      calls.forEach(call => {
        if (call.asset) {
          if (['sticker','video','animation'].includes(call.kind)) {
            const video = document.createElement('video'); const sticker = call.kind === 'sticker';
            video.className = sticker ? 'sticker' : 'message-video'; video.src = call.asset; video.poster = call.poster || '';
            video.loop = sticker; video.muted = sticker; video.autoplay = sticker && !paused; video.controls = !sticker;
            video.playsInline = true; video.preload = sticker ? 'auto' : 'metadata'; video.setAttribute('aria-label', node.title);
            video.addEventListener('error', () => {
              if(call.poster) { const img=new Image();img.src=call.poster;img.alt=node.title;img.className='sticker';video.replaceWith(img); }
              else { const note=document.createElement('p');note.className='editor-placeholder';note.textContent='Не удалось загрузить видео';video.replaceWith(note); }
            }, {once:true}); block.append(video);
          } else if (call.kind === 'photo') {
            const img=new Image();img.src=call.asset;img.alt=node.title;img.className='message-photo';img.loading='lazy';block.append(img);
          } else {
            const link=document.createElement('a');link.href=call.asset;link.target='_blank';link.rel='noopener';link.className='message-document';link.textContent='Открыть документ';block.append(link);
          }
        }
        if (call.text) {
          const bubble=document.createElement('div');bubble.className='bubble';bubble.append(safeMessage(call.text));
          const time=document.createElement('span');time.className='timestamp';time.textContent='9:41';bubble.append(time);block.append(bubble);
        }
        if (call.rows?.length) {
          if (call.keyboardType === 'inline') block.append(keyboard(node,call.rows));
          else if (node.id === selected) { const kb=keyboard(node,call.rows);$('#reply-keyboard').replaceChildren(...kb.children); }
        }
      });
      block.addEventListener('click', (event) => { if (mode === 'dialog' && !event.target.closest('button,a') && node.id !== selected) select(node.id, false); });
      chat.append(block);
    });
    chat.querySelectorAll('video.sticker').forEach(video => { if (!paused) video.play().catch(() => {}); });
    requestAnimationFrame(() => {
      const target = chat.querySelector(`[data-message="${selected}"]`);
      chat.scrollTo({ top: mode === 'dialog' && target ? target.offsetTop - chat.offsetTop : 0, behavior: 'instant' });
    });
  }
  function renderDecisions() {
    document.querySelectorAll('[data-status]').forEach(b => { b.classList.toggle('active', b.dataset.status === review().status); b.setAttribute('aria-pressed', String(b.dataset.status === review().status)); });
  }
  function select(id, scroll = true) {
    selected = id; const node = current();
    $('#current-title').textContent = node.title; $('#review-title').textContent = node.title;
    const index = nodes.findIndex(n => n.id === id);
    $('#current-position').textContent = `${index + 1} / ${nodes.length} экранов`;
    $('#previous').disabled = index === 0; $('#next').disabled = index === nodes.length - 1;
    $('#source').textContent = node.source;
    $('#copy-source').textContent = edition==='current' ? 'Снимок DEV' : node.julia.length ? (node.copyOrigin==='comment'?'Текст из комментария Юлии':'Редакция Юлии')+' · карта №'+node.number : 'Показан DEV · редакция Юлии не передана';
    $('#review-warnings').replaceChildren();
    [...node.warnings, node.decisionHint].filter(Boolean).forEach(text => { const p=document.createElement('p');p.append(safeMessage(text));$('#review-warnings').append(p); });
    $('#draft-assembly').textContent=node.draftAssembly||'';
    $('#original-note-details').hidden=!node.originalNote;
    $('#original-note').replaceChildren(safeMessage(node.originalNote||''));
    $('#julia-details').hidden = !node.juliaNote;
    $('#julia-details').open = Boolean(node.juliaNote);
    $('#julia-comment').replaceChildren(safeMessage(node.juliaNote));
    $('#edition-state').textContent = edition === 'current' ? 'DEV · ' + data.sourceRevision : node.julia.length ? 'Текст для согласования' : 'Показан текст DEV';
    $('#note').value = review().note || ''; $('#note-length').textContent = $('#note').value.length;
    $('#note-state').textContent = $('#note').value ? 'Комментарий сохранён' : 'Без комментария';
    renderDecisions(); renderNavigation(); renderPhone();
    if (scroll && innerWidth <= 600) document.querySelector(`[data-step="${selected}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    history.replaceState(null, '', '#' + id);
  }
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode; document.querySelectorAll('[data-mode]').forEach(item => { item.classList.toggle('active', item === b); item.setAttribute('aria-pressed', String(item === b)); }); renderPhone();
  }));
  document.querySelectorAll('[data-edition]').forEach(b => b.addEventListener('click', () => {
    edition=b.dataset.edition;document.querySelectorAll('[data-edition]').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',String(el===b));});select(selected,false);
  }));
  $('#search').addEventListener('input', () => {query=$('#search').value.toLowerCase().trim();renderNavigation();});
  $('#review-filter').addEventListener('change', () => {filter=$('#review-filter').value;renderNavigation();});
  document.querySelectorAll('[data-status]').forEach(b => b.addEventListener('click', () => setReview({ status: b.dataset.status })));
  $('#note').addEventListener('input', () => { setReview({ note: $('#note').value }); $('#note-length').textContent = $('#note').value.length; $('#note-state').textContent = 'Комментарий сохранён'; });
  $('#reviewer').value = reviewer; $('#reviewer').addEventListener('input', () => { reviewer = $('#reviewer').value; persist(); });
  $('#previous').addEventListener('click', () => step(-1));
  $('#next').addEventListener('click', () => step(1));
  $('#animation').addEventListener('click', () => {
    paused = !paused; $('#animation').setAttribute('aria-pressed', String(paused));
    $('#animation').title = paused ? 'Включить анимацию' : 'Приостановить анимацию'; $('#animation').setAttribute('aria-label', $('#animation').title);
    $('#animation').innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}"></i>`;
    document.querySelectorAll('video.sticker').forEach(v => paused ? v.pause() : v.play().catch(() => {})); icons();
  });
  $('#theme').addEventListener('click', () => {
    const light = $('.phone').classList.toggle('light');
    $('#theme').title = light ? 'Тёмная тема Telegram' : 'Светлая тема Telegram'; $('#theme').setAttribute('aria-label', $('#theme').title);
    $('#theme').innerHTML = `<i data-lucide="${light ? 'moon' : 'sun'}"></i>`; icons();
  });
  $('#focus').addEventListener('click', () => { const active = document.body.classList.toggle('focus-mode'); $('#focus').title = active ? 'Вернуть панели' : 'Режим показа'; $('#focus').setAttribute('aria-label', $('#focus').title); $('#focus').innerHTML = `<i data-lucide="${active ? 'minimize-2' : 'maximize-2'}"></i>`; icons(); });
  $('#export').addEventListener('click', () => {
    const body = { format: 'giftsactivate-dialog-review', revision: data.reviewRevision || data.revision, contentRevision: data.revision, exportedAt: new Date().toISOString(), reviewer,
      screens: nodes.map(n => ({ id: n.id, title: n.title, source: n.source, ...review(n.id) })) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `giftsactivate-review-${data.revision}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Отметки и комментарии экспортированы');
  });
  $('#import').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async () => {
    const file = $('#import-file').files[0]; if (!file) return;
    try {
      if (file.size > 2000000) throw new Error('Файл слишком большой');
      const body = JSON.parse(await file.text());
      if (body.format !== 'giftsactivate-dialog-review' || ![data.revision, data.reviewRevision].filter(Boolean).includes(body.revision) || !Array.isArray(body.screens)) throw new Error('Файл относится к другой версии диалога');
      const incoming = {};
      body.screens.forEach(s => { if (nodes.some(n => n.id === s.id) && ['approved','changes','pending'].includes(s.status)) incoming[s.id] = { status:s.status, note:String(s.note || '').slice(0,20000) }; });
      reviews = { ...reviews, ...incoming }; reviewer = String(body.reviewer || '').slice(0,100); $('#reviewer').value = reviewer;
      persist(); select(selected); toast('Отметки загружены');
    } catch (error) { toast(error.message || 'Не удалось прочитать файл'); }
    $('#import-file').value = '';
  });
  document.querySelectorAll('.close-dialog').forEach(b => b.addEventListener('click', () => $('#boundary').close()));
  document.addEventListener('keydown', e => { if (e.target.matches('input,textarea,select') || $('#boundary').open) return;
    if (e.key === 'ArrowRight') $('#next').click(); if (e.key === 'ArrowLeft') $('#previous').click();
    if (e.key === 'Escape') document.body.classList.remove('focus-mode');
  });
  $('#snapshot').textContent = new Date(data.exportedAt).toLocaleString('ru-RU', { day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit' });
  $('#revision').textContent = 'Версия ' + data.revision;
  $('#total-count').textContent=nodes.length;$('#review-total').textContent=nodes.length;$('#progress').max=nodes.length;
  $('#catalog-meta').textContent=`${data.counts.screens} экранов · ${data.counts.julia} с редакцией Юлии. Данные и билеты — тестовые примеры.`;
  const hash = location.hash.slice(1); if (nodes.some(n => n.id === hash)) selected = hash;
  select(selected, false);
})();
