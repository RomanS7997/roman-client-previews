'use strict';
// Approved preview proposals. Historical DEV calls and production stay unchanged.
(() => {
  const data=window.DIALOG_DATA;
  const byNumber=n=>data.nodes.find(x=>x.number===n);
  const byId=id=>data.nodes.find(x=>x.id===id);
  const giveawayStickers={
    '23_tags_cut':'tags','25_screenshot':'screenshot',
    '31_cart_others':'cart','32_find_product':'screenshot','33_dwell':'screenshot',
    '34_cart_ours':'cart','35_cart_clean':'cart-clean','36_favorites':'favorites',
    '39_like':'favorites','42_cashback':'cashback'
  };
  for(const n of data.nodes.filter(n=>n.category.startsWith('giveaway'))){
    for(const c of n.julia){
      if(c.kind!=='sticker')continue;
      const key=Object.keys(giveawayStickers).find(key=>(c.asset||'').includes(key));
      if(!key)continue;
      c.asset=`assets/giveaway-${giveawayStickers[key]}-v2.png`;
      c.poster=c.asset;c.previewStaticSticker=true;
    }
  }
  const button=(text,value)=>({text,value,url:null,contact:false});
  const menu=structuredClone(byId('c1630293a5d8').julia.find(c=>c.rows?.length).rows);
  data.sections.splice(data.sections.findIndex(s=>s.key==='survey')+1,0,{key:'survey_status',title:'Опрос · статусы и исключения'});
  const update=(n,text,rows)=>{
    const call=n.julia.find(c=>c.text);call.text=text;
    if(rows){call.rows=rows;call.keyboardType='inline';call.buttons=rows.flat().map(b=>b.text);}
    n.copyOrigin='adaptation';n.draftAssembly='Правки по замечаниям Романа 01.10.2026. Предложение для согласования; рабочий бот не изменён.';
  };
  const hide=(number,target)=>{const n=byNumber(number);n.previewHidden=true;n.previewAlias=byNumber(target).id;};
  hide(74,73);hide(77,78);hide(82,85);hide(125,128);hide(137,136);hide(151,150);hide(152,150);hide(153,119);
  // Keep technical guards in the historical data, outside the presentation route.
  for(const [number,target] of [[198,12],[199,12],[200,12],[201,148],[202,55],
    [203,145],[204,147],[206,205],[207,12],[209,73],[210,128],[214,12],
    [215,131],[216,123],[217,187],[218,187],[219,192],[220,187],[221,187],
    [223,192],[224,68]])hide(number,target);
  for(const id of ['0102687b1861','56c6512ee322']){
    byId(id).previewHidden=true;byId(id).previewAlias=byNumber(id==='0102687b1861'?187:12).id;
  }
  byNumber(205).title='Яндекс: не распознан номер заказа';
  update(byNumber(205),'🔢 <b>Не получилось распознать номер заказа.</b>\n\nСкопируй номер из раздела «Мои заказы» на Яндекс Маркете и пришли его текстом. Номер отправления или трек-номер не подойдут.');
  update(byNumber(13),'✍️ <b>Нужен товар прямо сейчас?</b>\n\nНапиши в 💬 Техподдержку, и мы быстро пришлём нужную ссылку.\n\n🔗 Прямые ссылки на проверенные витрины на Wildberries, Ozon и Яндекс Маркете появятся тут чуть позже. Так получится покупать без риска нарваться на подделку.');
  update(byNumber(73),'📎 <b>Файл получили!</b>\n\nОпиши проблему словами, чтобы оператор быстрее понял, что произошло.');
  byNumber(73).title='Вложение: резервный ответ поддержки';
  update(byNumber(78),'👋 Вышли из поддержки.\n\nВыбери нужный раздел в меню.');
  byNumber(78).title='Возвращение из поддержки в меню';
  update(byNumber(96),'✅ <b>Записали!</b>\n\n🎤 Голосовое получили.\n🎬 Видео: 1 файл.\n\nМожно дополнить ответ или нажать «Продолжить».');
  update(byNumber(197),'🔎 <b>Выдачу приза по твоему билету не удалось подтвердить.</b>\n\n💬 Оператор уже разбирается в ситуации. Напишет тебе в этом чате и объяснит, что произошло.');
  update(byNumber(92),byNumber(92).julia.find(c=>c.text).text.replace('товаре товаре','товаре'));
  byNumber(103).title='Опрос сохранён на время раздачи';
  update(byNumber(103),'🎁 Место в раздаче забронировано!\n\nОтветы на опрос сохранили. Сможешь вернуться к нему позже и продолжить с того же вопроса.',[[button('🗣 Продолжить опрос','cd:start')],[button('🎁 К раздаче','preview:giveaway')]]);
  update(byNumber(104),'✍️ <b>Опрос пока не завершён.</b>\n\nТвои ответы сохранили. Продолжим с того вопроса, где остановились.',[[button('🗣 Продолжить опрос','cd:start')]]);
  update(byNumber(105),'📨 <b>Опрос ещё не начат.</b>\n\nПять вопросов о товаре, около двух минут.',[[button('🗣 Пройти опрос','cd:start')]]);
  update(byNumber(88),'👍 Хорошо, вернёмся к опросу позже.\n\nЗахочешь ответить раньше — нажми «Пройти опрос».',[[button('🗣 Пройти опрос','cd:start')]]);
  update(byNumber(126),'Эту раздачу не удалось найти. Открой каталог и выбери доступный товар.');
  update(byNumber(127),'Эта раздача сейчас недоступна. Посмотри другие товары в каталоге.');
  update(byNumber(128),'Этот товар уже разобрали. Посмотри другие доступные раздачи ниже.');
  const catalog=byNumber(119).julia.filter(c=>c.kind==='photo'||c.rows?.length);
  byNumber(128).julia.push(...structuredClone(catalog));
  update(byNumber(131),'Сейчас у тебя нет активной заявки на этот шаг.\n\nОткрой «Раздачи», чтобы выбрать товар или посмотреть свои заявки.',[[button('🎁 Раздачи','preview:giveaway')],[button('📊 Мои заявки','preview:applications')]]);
  update(byNumber(132),'Отчёт пока недоступен на текущем этапе заявки.\n\nОткрой «Мои заявки», чтобы посмотреть её статус. Если отчёт уже отправлен, повторно присылать его не нужно.',[[button('📊 Мои заявки','preview:applications')]]);
  byNumber(136).title='Шаг 3: нажали «Продолжить» до конца таймера';
  byNumber(145).title='Wildberries: не распознана сумма покупки';byNumber(145).category='giveaway_wb';
  byNumber(146).category='giveaway_wb';
  byNumber(147).title='Ozon: не распознан номер заказа';byNumber(147).category='giveaway_ozon';
  update(byNumber(150),'⏰ <b>Время бронирования закончилось.</b>\n\nМесто освободилось, но пройденные шаги сохранили.\n\nВыбери этот товар в каталоге ещё раз. Если места есть, продолжим с сохранённого шага. Данные заказа при повторном оформлении нужно будет указать заново.',[[button('🎁 Открыть каталог','preview:giveaway')]]);
  for(const n of data.nodes)for(const c of n.julia)if(c.kind==='sticker'&&/10_waiting_parcel/.test(c.asset||'')){
    c.asset='assets/waiting-parcel-calendar-v2.png';c.poster=c.asset;c.previewStaticSticker=true;
  }
  for(const n of data.nodes){
    if(n.category==='survey'&&n.number>=104)n.category='survey_status';
    if(!n.previewAccess&&['howto','raffle','profile_reward'].includes(n.category))n.previewMenu=menu;
    if(n.category==='entry'&&[10,12,13].includes(n.number))n.previewMenu=menu;
    if(n.category.startsWith('giveaway'))n.previewMenu=menu;
    if(n.category.startsWith('survey'))n.previewMenu=menu;
    if(n.category==='support'&&n.number!==71)n.previewMenu=structuredClone(byNumber(64).current.find(c=>c.keyboardType==='reply'&&c.rows?.length)?.rows||menu);
    if(n.number===78||n.number===85)n.previewMenu=menu;
    if([126,127].includes(n.number))n.previewPresentation='alert';
  }
})();
