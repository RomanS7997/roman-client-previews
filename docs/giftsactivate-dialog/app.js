'use strict';
(() => {
  const data = window.DIALOG_DATA;
  const $ = (selector) => document.querySelector(selector);
  const nodes = data.nodes.filter(n => !n.previewHidden && !['legacy','warranty'].includes(n.category));
  const key = `giftsactivate-dialog:${data.reviewRevision || data.revision}`;
  const resetBackupKey = `${key}:before-view-reset`;
  let reviews = {}, reviewer = '', selected = nodes.find(n => n.category === 'entry').id, mode = 'screen', paused = false, edition = 'julia';
  let query = '', filter = 'all';
  const choices = {};
  const help=document.createElement('div');help.id='screen-help';help.role='tooltip';help.hidden=true;document.body.append(help);
  function showHelp(button){
    help.textContent=button.getAttribute('aria-description');help.hidden=false;
    const rect=button.getBoundingClientRect();const width=Math.min(330,innerWidth-24);
    help.style.width=width+'px';help.style.left=Math.max(12,Math.min(rect.right+12,innerWidth-width-12))+'px';
    help.style.top=Math.max(12,Math.min(rect.top,innerHeight-help.offsetHeight-12))+'px';
    button.setAttribute('aria-describedby','screen-help');
  }
  const surveyQuestions=['5d6011fb1e4a','d2e861bda757','b1c0d9276596','6b2566f8795d','5c67fc68e8d6'];
  const survey={step:0,answers:{},status:'invited'};
  try {const saved=JSON.parse(localStorage.getItem(key+':survey-demo')||'null');if(saved&&Number.isInteger(saved.step)&&saved.step>=0&&saved.step<5&&saved.answers&&typeof saved.answers==='object')Object.assign(survey,saved);}catch(_){}
  const nodeNumber=number=>nodes.find(n=>n.number===number);
  const goNumber=number=>{const n=nodeNumber(number);if(n)select(n.id);};
  const emojiPalette = window.DIALOG_EMOJI || {};
  const emojiPattern = Object.keys(emojiPalette).length ? new RegExp(Object.keys(emojiPalette)
    .sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu') : null;
  const reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  const emojiObserver = window.IntersectionObserver ? new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries) {
      if(isIntersecting && !paused && !reducedMotion) target.play().catch(()=>{});
      else target.pause();
    }
  }) : null;
  let toastTimer;
  try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); reviews = saved.reviews || {}; reviewer = saved.reviewer || ''; if (nodes.some(n => n.id === saved.selected)) selected = saved.selected; } catch (_) { /* Review remains usable without storage. */ }
  function icons() { if (window.lucide) window.lucide.createIcons(); }
  function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2700); }
  function current() { return nodes.find(n => n.id === selected); }
  function review(id = selected) { return reviews[id] || { status: 'pending', note: '' }; }
  function isViewed(id = selected) { const r = review(id); return typeof r.viewed === 'boolean' ? r.viewed : ['approved', 'changes'].includes(r.status); }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ reviews, reviewer, selected }));localStorage.setItem(key+':survey-demo',JSON.stringify(survey)); $('#save-state').textContent = 'Сохранено на этом устройстве'; }
    catch (_) { $('#save-state').textContent = 'Не сохранено · экспортируйте правки'; }
  }
  function filteredNodes() {
    return nodes.filter(n => (!query || n.search.includes(query) || String(n.number) === query.replace(/^№/, '')) &&
      (filter === 'all' || filter === 'viewed' && isViewed(n.id) || filter === 'unviewed' && !isViewed(n.id)));
  }
  function adjacent(offset) {
    const index = nodes.findIndex(n => n.id === selected);
    const candidates = filteredNodes().filter(n => offset > 0 ? nodes.indexOf(n) > index : nodes.indexOf(n) < index);
    return offset > 0 ? candidates[0] : candidates[candidates.length - 1];
  }
  function updatePosition() {
    const visible=filteredNodes(), index=visible.findIndex(n=>n.id===selected);
    $('#current-position').textContent=index>=0?`${index+1} / ${visible.length} экранов`:`Вне фильтра · ${visible.length} экранов`;
    $('#previous').disabled=!adjacent(-1);
    $('#next').disabled=!adjacent(1);
  }
  function step(offset) {
    const target=adjacent(offset);
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
      const count = document.createElement('small'); count.textContent = `${items.filter(n => isViewed(n.id)).length} / ${items.length}`; count.title = 'Просмотрено / экранов в фильтре';
      summary.append(label, count); group.append(summary);
      const nav = document.createElement('nav'); group.append(nav); host.append(group);
      items.forEach(n => {
      const button = document.createElement('button');
      button.className = `step-item ${selected === n.id ? 'active' : ''} ${isViewed(n.id) ? 'viewed' : ''}`;
      button.title = n.previewHelp || n.title;
      button.setAttribute('aria-description',button.title);
      button.addEventListener('mouseenter',()=>showHelp(button));button.addEventListener('focus',()=>showHelp(button));
      button.addEventListener('mouseleave',()=>{help.hidden=true;});button.addEventListener('blur',()=>{help.hidden=true;});
      button.setAttribute('aria-current', selected === n.id ? 'step' : 'false');
      button.dataset.step = n.id;
      const number = document.createElement('span'); number.className = 'step-number'; number.textContent = n.number || 'DEV';
      const name = document.createElement('span'); name.className = 'step-name'; name.textContent = n.title;
      button.append(number, name);
      if(isViewed(n.id)) {const marker=document.createElement('i');marker.dataset.lucide='eye';marker.className='status-mark';marker.setAttribute('aria-label','Просмотрено');button.append(marker);}
      button.addEventListener('click', () => select(n.id));
      nav.append(button);
      });
    });
    $('#empty-search').hidden = filtered.length !== 0;
    updatePosition();
    const viewed = nodes.filter(n => isViewed(n.id)).length;
    $('#viewed-count').textContent = viewed; $('#progress').value = viewed; $('#percent').textContent = Math.round(viewed / nodes.length * 100) + '%';
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
    decorateEmoji(template.content);
    return template.content;
  }
  function decorateEmoji(fragment) {
    if(!emojiPattern) return;
    const walker=document.createTreeWalker(fragment,NodeFilter.SHOW_TEXT), texts=[];
    while(walker.nextNode()) texts.push(walker.currentNode);
    let budget=90;
    for(const text of texts) {
      if(!budget) break;
      const replacement=document.createDocumentFragment();let offset=0, changed=false;
      for(const match of text.data.matchAll(emojiPattern)) {
        if(budget<=0) break;
        budget--;
        const item=emojiPalette[match[0]];
        replacement.append(document.createTextNode(text.data.slice(offset,match.index)));
        const span=document.createElement('span');span.className='custom-emoji';
        const fallback=document.createElement('span');fallback.className='emoji-fallback';fallback.textContent=match[0];
        const video=document.createElement('video');video.className='emoji-video';
        video.src=item.asset;video.poster=item.poster||'';video.loop=true;video.muted=true;
        video.playsInline=true;video.preload='auto';video.setAttribute('aria-hidden','true');video.tabIndex=-1;
        video.addEventListener('loadeddata',()=>span.classList.add('emoji-ready'),{once:true});
        video.addEventListener('error',()=>{emojiObserver?.unobserve(video);video.remove();span.classList.remove('emoji-ready');},{once:true});
        span.append(fallback,video);replacement.append(span);offset=match.index+match[0].length;changed=true;
      }
      if(changed){replacement.append(document.createTextNode(text.data.slice(offset)));text.replaceWith(replacement);}
    }
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
    const value=button.value||'';
    if(value==='cd:start') {survey.status='in_progress';select(surveyQuestions[survey.step]);return;}
    if(value==='cd:later') {goNumber(88);return;}
    if(value==='cd:never') {survey.status='opted_out';goNumber(89);return;}
    if(value==='cd:next') {
      if(!survey.answers[survey.step]){surveyNotice('Напиши ответ на текущий вопрос, и продолжим.');return;}
      if(survey.step<4){survey.step++;select(surveyQuestions[survey.step]);}
      else {survey.status='submitted';goNumber(99);}return;
    }
    if(value==='cd:status'||/Статус опроса/.test(button.text)) {
      goNumber(({invited:105,in_progress:104,submitted:106,approved:107,rejected:108,opted_out:109})[survey.status]||104);return;
    }
    if(value==='preview:giveaway'){goNumber(119);return;}
    if(value==='preview:applications'){goNumber(122);return;}
    const entry = title => nodes.find(n => n.category === 'entry' && n.title === title);
    let target;
    if(edition==='julia' && button.value==='prof:resume') {
      select(node.previewResume || '968708bd37cc');return;
    }
    if (button.contact || /Принять и продолжить/.test(button.text)) target = entry('После телефона: первый вопрос профиля');
    else if (/Мужчина|Женщина/.test(button.text)) target = entry('Вопрос о возрасте');
    else if (node.title === 'Вопрос о возрасте') target = entry('Вопрос об устройстве');
    else if (node.title === 'Вопрос об устройстве') target = nodes.find(n => n.category === 'profile_reward');
    if (target) { select(target.id); return; }
    const menuRoutes=[[/Главное меню|Назад в меню/,'c1630293a5d8'],[/Гарантия|Мои покупки|Покупки и билеты/,'a84013f362aa_16'],[/Магазины/,'28ac3d233fae'],[/Мои заявки/,'092fcf0795fc'],[/Мой к[еэ]шб[еэ]к/,'77c951f9eb67'],[/Раздачи|Каталог/,'243ea6ed33ff'],[/Как поклеить/,'556e46740f45'],[/Техподдерж|Назад в поддержку/,'a8767e810dc8'],[/Топ призов/,'6bb832a92ff7']];
    const route=menuRoutes.find(([pattern])=>pattern.test(button.text));
    if(route){select(route[1]);return;}
    if(value==='gwf:step3'){goNumber(136);return;}
    if(value==='gwf:resume'){select('f7a4d2728e9a');return;}
    if(value==='gwf:giveup'){goNumber(155);return;}
    if(value.startsWith('gw:item:')){goNumber(120);return;}
    if(value.startsWith('gw:join:')){select('bbce88b1cba9');return;}
    if(value.startsWith('gw:sold:')){goNumber(128);return;}
    if(/Статус обращения/.test(button.text)){goNumber(79);return;}
    if(/Написать оператору/.test(button.text)){goNumber(68);return;}
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
    emojiObserver?.disconnect();
    const chat = $('#chat'); chat.replaceChildren();
    const day = document.createElement('div'); day.className = 'day'; day.textContent = '21 сентября'; chat.append(day);
    let visible = [current()];
    // Catalog neighbors are alternative states, not successive chat messages.
    if (mode === 'dialog' && current().previewContext?.length) {
      visible = [...current().previewContext.map(id=>nodes.find(n=>n.id===id)).filter(Boolean),current()];
    }
    $('#reply-keyboard').replaceChildren();
    if(edition==='julia'&&current().previewMenu&&!current().previewAccess){
      const kb=keyboard(current(),current().previewMenu);$('#reply-keyboard').replaceChildren(...kb.children);
    }
    const inQuestion=surveyQuestions.includes(selected)||[95,96,97,98].includes(current().number);
    $('#demo-message').disabled=!inQuestion;$('#demo-send').hidden=!inQuestion;
    $('#demo-message').placeholder=inQuestion?'Написать ответ…':'Сообщение';
    $('#demo-message').value='';
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
        let messageHost=block;
        if(call.kind==='photo') {
          messageHost=document.createElement('div');messageHost.className='photo-message';
          block.append(messageHost);
        }
        if (call.asset) {
          if(call.previewStaticSticker) {
            const img=new Image();img.src=call.asset;img.alt=node.title;img.className='sticker';block.append(img);
          } else if (['sticker','video','animation'].includes(call.kind)) {
            const video = document.createElement('video'); const sticker = call.kind === 'sticker';
            video.className = sticker ? 'sticker' : 'message-video'; video.src = call.asset; video.poster = call.poster || '';
            video.loop = sticker; video.muted = sticker; video.autoplay = sticker && !paused; video.controls = !sticker;
            video.playsInline = true; video.preload = sticker ? 'auto' : 'metadata'; video.setAttribute('aria-label', node.title);
            video.addEventListener('error', () => {
              if(call.poster) { const img=new Image();img.src=call.poster;img.alt=node.title;img.className='sticker';video.replaceWith(img); }
              else { const note=document.createElement('p');note.className='editor-placeholder';note.textContent='Не удалось загрузить видео';video.replaceWith(note); }
            }, {once:true}); block.append(video);
          } else if (call.kind === 'photo') {
            const open=document.createElement('button');open.className='photo-open';open.type='button';
            open.title='Открыть изображение';open.setAttribute('aria-label','Открыть изображение: '+node.title);
            const img=new Image();img.src=call.asset;img.alt=call.previewTicket?'Билет '+call.previewTicket:node.title;img.className='message-photo';img.loading='lazy';
            open.append(img);messageHost.append(open);
            open.addEventListener('click',()=>{
              const viewer=$('#photo-viewer');$('#photo-viewer-image').src=call.asset;$('#photo-viewer-image').alt=img.alt;viewer.showModal();
            });
            if(!call.text){const time=document.createElement('span');time.className='photo-time';time.textContent='9:41';messageHost.append(time);}
          } else {
            const link=document.createElement('a');link.href=call.asset;link.target='_blank';link.rel='noopener';link.className='message-document';link.textContent='Открыть документ';block.append(link);
          }
        }
        if (call.text) {
          const bubble=document.createElement('div');bubble.className=edition==='julia'&&node.previewPresentation==='alert'?'telegram-alert':'bubble';bubble.append(safeMessage(call.text));
          const time=document.createElement('span');time.className='timestamp';time.textContent='9:41';bubble.append(time);messageHost.append(bubble);
          if(edition==='julia'&&node.previewPresentation==='alert'){
            const close=document.createElement('button');close.textContent='ОК';close.addEventListener('click',()=>goNumber(119));bubble.append(close);
          }
        }
        if (call.rows?.length) {
          if (call.keyboardType === 'inline') block.append(keyboard(node,call.rows));
          else if (node.id === selected) { const kb=keyboard(node,call.rows);$('#reply-keyboard').replaceChildren(...kb.children); }
        }
      });
      block.addEventListener('click', (event) => { if (mode === 'dialog' && !event.target.closest('button,a') && node.id !== selected) select(node.id, false); });
      chat.append(block);
      if(edition==='julia'&&node.telegramNotice){const notice=document.createElement('div');notice.className='telegram-notice';notice.textContent=node.telegramNotice;block.prepend(notice);}
    });
    if(inQuestion&&survey.answers[survey.step])surveyNotice('Ответ получен. Можно дополнить его или нажать «Продолжить».');
    chat.querySelectorAll('video.sticker').forEach(video => { if (!paused) video.play().catch(() => {}); });
    chat.querySelectorAll('video.emoji-video').forEach(video=>{
      if(emojiObserver) emojiObserver.observe(video);
      else if(!paused&&!reducedMotion) video.play().catch(()=>{});
    });
    requestAnimationFrame(() => {
      const target = chat.querySelector(`[data-message="${selected}"]`);
      chat.scrollTo({ top: mode === 'dialog' && target ? target.offsetTop - chat.offsetTop : 0, behavior: 'instant' });
    });
  }
  function select(id, scroll = true, markViewed = true) {
    if(!nodes.some(n=>n.id===id)) return;
    help.hidden=true;
    selected = id; const node = current();
    if(surveyQuestions.includes(id)){survey.step=surveyQuestions.indexOf(id);survey.status='in_progress';}
    if([100,101,107].includes(node.number))survey.status='approved';
    if([102,108].includes(node.number))survey.status='rejected';
    if([99,106].includes(node.number))survey.status='submitted';
    $('#current-title').textContent = node.title;
    $('#edition-state').textContent = edition === 'current' ? 'Снимок DEV' : node.copyOrigin==='adaptation' ? 'Адаптация в стиле Юлии' : 'Редакция Юлии';
    renderPhone();
    if(markViewed&&!isViewed(id)) reviews[id]={...review(id),viewed:true,updatedAt:new Date().toISOString()};
    renderNavigation();
    if (scroll && innerWidth <= 600) document.querySelector(`[data-step="${selected}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    history.replaceState(null, '', '#' + id);
    persist();
  }
  function surveyNotice(text){
    $('#survey-notice')?.remove();const note=document.createElement('div');note.id='survey-notice';note.className='bubble';note.textContent=text;$('#chat').append(note);
  }
  $('#toggle-keyboard').addEventListener('click',()=>{
    const kb=$('#reply-keyboard');kb.hidden=!kb.hidden;
    $('#toggle-keyboard').setAttribute('aria-expanded',String(!kb.hidden));
    $('#toggle-keyboard').title=kb.hidden?'Показать меню':'Скрыть меню';
    $('#toggle-keyboard').setAttribute('aria-label',$('#toggle-keyboard').title);
  });
  $('#demo-composer').addEventListener('submit',event=>{
    event.preventDefault();const input=$('#demo-message');const answer=input.value.trim();
    if(input.disabled)return;
    if(answer.length<8){surveyNotice('Расскажи чуть подробнее: хватит пары предложений.');return;}
    survey.answers[survey.step]=[survey.answers[survey.step],answer].filter(Boolean).join('\n');input.value='';
    persist();
    surveyNotice('Ответ получили. Можно дополнить его или нажать «Продолжить».');
    $('#chat').scrollTo({top:$('#chat').scrollHeight,behavior:'instant'});
  });
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode; document.querySelectorAll('[data-mode]').forEach(item => { item.classList.toggle('active', item === b); item.setAttribute('aria-pressed', String(item === b)); }); renderPhone();
  }));
  document.querySelectorAll('[data-edition]').forEach(b => b.addEventListener('click', () => {
    edition=b.dataset.edition;document.querySelectorAll('[data-edition]').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',String(el===b));});select(selected,false);
  }));
  $('#search').addEventListener('input', () => {query=$('#search').value.toLowerCase().trim();renderNavigation();});
  $('#review-filter').addEventListener('change', () => {filter=$('#review-filter').value;renderNavigation();});
  function resetViews() {
    try {
      localStorage.setItem(resetBackupKey, JSON.stringify(reviews));
    } catch (_) { toast('Не удалось сохранить резервную копию. Просмотры не сброшены.'); return; }
    nodes.forEach(n => { reviews[n.id] = {...review(n.id), viewed:false}; });
    filter='all'; $('#review-filter').value='all';
    persist(); renderNavigation(); $('#undo-reset-views').hidden=false;
    toast('Просмотры сброшены. Комментарии сохранены.');
  }
  $('#reset-views').addEventListener('click', resetViews);
  $('#undo-reset-views').addEventListener('click', () => {
    try {
      const backup=JSON.parse(localStorage.getItem(resetBackupKey) || 'null');
      if (!backup) return;
      nodes.forEach(n => {
        const old=backup[n.id] || {};
        const viewed=typeof old.viewed==='boolean' ? old.viewed : ['approved','changes'].includes(old.status);
        reviews[n.id]={...review(n.id),viewed:isViewed(n.id)||viewed};
      });
      persist(); renderNavigation(); localStorage.removeItem(resetBackupKey);
      $('#undo-reset-views').hidden=true; toast('Просмотры восстановлены');
    } catch (_) { toast('Не удалось восстановить просмотры'); }
  });
  $('#previous').addEventListener('click', () => step(-1));
  $('#next').addEventListener('click', () => step(1));
  $('#animation').addEventListener('click', () => {
    paused = !paused; $('#animation').setAttribute('aria-pressed', String(paused));
    $('#animation').title = paused ? 'Включить анимацию' : 'Приостановить анимацию'; $('#animation').setAttribute('aria-label', $('#animation').title);
    $('#animation').innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}"></i>`;
    document.querySelectorAll('video.sticker, video.emoji-video').forEach(v => paused || (reducedMotion && v.classList.contains('emoji-video')) ? v.pause() : v.play().catch(() => {})); icons();
  });
  $('#theme').addEventListener('click', () => {
    const light = $('.phone').classList.toggle('light');
    $('#theme').title = light ? 'Тёмная тема Telegram' : 'Светлая тема Telegram'; $('#theme').setAttribute('aria-label', $('#theme').title);
    $('#theme').innerHTML = `<i data-lucide="${light ? 'moon' : 'sun'}"></i>`; icons();
  });
  $('#focus').addEventListener('click', () => { const active = document.body.classList.toggle('focus-mode'); $('#focus').title = active ? 'Вернуть панели' : 'Режим показа'; $('#focus').setAttribute('aria-label', $('#focus').title); $('#focus').innerHTML = `<i data-lucide="${active ? 'minimize-2' : 'maximize-2'}"></i>`; icons(); });
  $('#export').addEventListener('click', () => {
    const body = { format: 'giftsactivate-dialog-review', revision: data.reviewRevision || data.revision, contentRevision: data.revision, exportedAt: new Date().toISOString(), reviewer,
      screens: nodes.map(n => ({ id: n.id, title: n.title, source: n.source, ...review(n.id), viewed: isViewed(n.id) })) };
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
      body.screens.forEach(s => { if (nodes.some(n => n.id === s.id) && ['approved','changes','pending'].includes(s.status)) incoming[s.id] = { status:s.status, note:String(s.note || '').slice(0,20000), viewed: typeof s.viewed === 'boolean' ? s.viewed : isViewed(s.id) || ['approved','changes'].includes(s.status) }; });
      reviews = { ...reviews, ...incoming }; reviewer = String(body.reviewer || reviewer).slice(0,100);
      persist(); select(selected,false,false); toast('Отметки загружены');
    } catch (error) { toast(error.message || 'Не удалось прочитать файл'); }
    $('#import-file').value = '';
  });
  document.querySelectorAll('.close-dialog').forEach(b => b.addEventListener('click', () => $('#boundary').close()));
  document.addEventListener('keydown', e => { if (e.target.matches('input,textarea,select') || $('#boundary').open || $('#photo-viewer').open) return;
    if(e.key==='Escape')help.hidden=true;
    if (e.key === 'ArrowRight') $('#next').click(); if (e.key === 'ArrowLeft') $('#previous').click();
    if (e.key === 'Escape') document.body.classList.remove('focus-mode');
  });
  $('#snapshot').textContent = new Date(data.exportedAt).toLocaleString('ru-RU', { day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit' });
  $('#total-count').textContent=nodes.length;$('#review-total').textContent=nodes.length;$('#progress').max=nodes.length;
  const requested = location.hash.slice(1);
  const hash = data.nodes.find(n => n.id === requested)?.previewAlias || requested;
  if (nodes.some(n => n.id === hash)) selected = hash;
  try { $('#undo-reset-views').hidden=!localStorage.getItem(resetBackupKey); } catch (_) {}
  const url=new URL(location.href);
  if (url.searchParams.get('resetViews')==='1') {
    resetViews(); url.searchParams.delete('resetViews'); history.replaceState(null,'',url);
  }
  select(selected, false, false);
})();
