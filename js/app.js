/* ===== 坏女孩诞辰 ONLINE · 骨架逻辑 ===== */
'use strict';

/* ---------- 角色数据（文案为草稿，待替换真实梗） ---------- */
const CHARACTERS = [
  { id: 'badgirl', name: '坏女孩',     main: true,  color: '#ff6ad5', img: 'assets/badgirl.png', face: 'assets/badgirl_face.png', gift: '不良少女发色发起人，创意担当，平均每分钟产生3个鬼点子，古灵精怪pss，今日寿星小小莎。', keywords: ['343绝版人物', '舞蹈界未挖掘的新星', '摄影大师', '游泳小天才'] },
  { id: 'emperor', name: '吴皇',       main: true,  color: '#ffd866', img: 'assets/emperor.png', face: 'assets/emperor_face.png', gift: '0人之下，0人之上，343王国至尊地位享有者，无尽冬日最严格的部长，吴皇威武！！', keywords: ['电子琴大师', '游戏高手', '吃辣魔王', '小蝴蝶'] },
  { id: 'prince',  name: '王子',       main: true,  color: '#6ad5ff', img: 'assets/prince.png',  face: 'assets/prince_face.png',  gift: '全343国内话次多之人（最多的是谁呢，好难猜啊），最爱哭鼻子之人，网速最慢之人，正是在下！', keywords: ['吉他中手', '善良之人', 'sexy voice', '篮球明星'] },
  { id: 'guoshi',  name: '国师',       main: true,  color: '#95ff6a', img: 'assets/guoshi.png',  face: 'assets/guoshi_face.png',  gift: '本国2大神兽的抚养人，智慧担当，paper发到手软，冷酷有情孙国师！', keywords: ['身高>168之人', '皮肤白皙', '坐得住冷板凳之人', '理性女王'] },
  { id: 'salon',   name: '发廊大师',   main: false, color: '#ff9a6a', img: 'assets/salon.png',   gift: '友好邻国的市民一枚。', keywords: ['早睡之人', '爱卫生之人', '一门之隔的关系', '友好的邻里'] },
  { id: 'nature',  name: 'Nature',     main: false, color: '#b8e994', img: 'assets/nature.png',  gift: '1/2挂卡车，全国最爱撒娇之咪，最贪吃之咪。', keywords: ['拥有大鸡腿', '爱撒娇', '好rua好好rua', '喵～'] },
  { id: 'science', name: 'Science',    main: false, color: '#74b9ff', img: 'assets/science.png', gift: '另1/2挂卡车，全国最板正之咪，颜值担当。', keywords: ['拥有北极熊般的白色绒毛', '忽闪忽闪大眼睛', '高冷', '喵～'] },
  { id: 'pig',     name: '小猪',       main: false, color: '#f7a8c0', img: 'assets/pig.png',     gift: '随机成为国民的一员。', keywords: ['可以是你', '可以是她', '可以是她她她', '反正不是王子'] },
];
const MAIN_IDS = CHARACTERS.filter(c => c.main).map(c => c.id);

const COPY = {
  notFull: '人还没齐呢——坏女孩的寿宴，主角团少一个都算旷工。再去叫叫人？',
  blessings: [
    { who: '王子', line: '愿你的新一岁，连乌云都镶着金边。' },
    { who: '吴皇', line: '朕准你：往后年年，皆有今日之欢。' },
    { who: '国师', line: '夜观星象，未来一年，大吉。' },
  ],
  finalBless: '灯火会灭，蛋糕会吃完，\n但我们永远在。\n生日快乐，坏女孩！',
  yunnan: '云南之旅 · 场景建设中\nNEXT MISSION 敬请期待',
  beijing: '北京重聚 · 场景建设中\nNEXT MISSION 敬请期待',
};

/* ---------- 像素小人占位立绘（SVG data-uri，待替换为 AI 生成形象） ---------- */
function pixelAvatar(color) {
  const s = "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='14' viewBox='0 0 12 14'>"
    + "<rect width='12' height='14' fill='#2b3a67'/>"
    + `<rect x='2' y='1' width='8' height='3' fill='${color}'/>`
    + "<rect x='3' y='4' width='6' height='4' fill='#ffd9b3'/>"
    + "<rect x='4' y='5' width='1' height='1' fill='#222'/><rect x='7' y='5' width='1' height='1' fill='#222'/>"
    + "<rect x='5' y='7' width='2' height='1' fill='#c25'/>"
    + `<rect x='3' y='8' width='6' height='4' fill='${color}'/>`
    + "<rect x='3' y='12' width='2' height='2' fill='#333'/><rect x='7' y='12' width='2' height='2' fill='#333'/>"
    + "</svg>";
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
}

/* 角色形象：大头照（头像框用，face 版保证头完整） */
function avatarCss(c) {
  const src = c.face || c.img;
  return src ? `url('${src}') center top/cover no-repeat` : pixelAvatar(c.color) + ' center/40% no-repeat';
}
/* 全身照（抽卡翻面/点开查看用，contain 保证全身完整） */
function fullBodyCss(c) {
  return c.img ? `url('${c.img}') center/contain no-repeat` : pixelAvatar(c.color) + ' center/40% no-repeat';
}

/* 图片像素化：缩到 tiny 像素再放大，返回 dataURL */
function pixelateUrl(url, callback) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const tiny = 64, scale = 6;
    const ratio = img.height / img.width;
    const tw = img.width >= img.height ? tiny : Math.round(tiny / ratio);
    const th = img.width >= img.height ? Math.round(tiny * ratio) : tiny;
    const c0 = document.createElement('canvas');
    c0.width = tw; c0.height = th;
    c0.getContext('2d').drawImage(img, 0, 0, tw, th);
    const cv = document.createElement('canvas');
    cv.width = tw * scale; cv.height = th * scale;
    const cx = cv.getContext('2d');
    cx.imageSmoothingEnabled = false;
    cx.drawImage(c0, 0, 0, cv.width, cv.height);
    callback(cv.toDataURL('image/png'));
  };
  img.onerror = () => callback(url);
  img.src = url;
}

/* ---------- 状态 ---------- */
/* ---------- 存档命名空间：同一台设备多人互不覆盖 ---------- */
const PROFILE_KEY = 'pp_profile';
const DEFAULT_PROFILE = '旅行者';
/* 昵称只保留中英文数字下划线，最长 12 字；空值回退默认昵称 */
function safeNs(raw) {
  const s = String(raw == null ? '' : raw).trim().replace(/[^\w\u4e00-\u9fa5]/g, '').slice(0, 12);
  return s || DEFAULT_PROFILE;
}
function currentNs() {
  try { return safeNs(localStorage.getItem(PROFILE_KEY)); } catch (e) { return DEFAULT_PROFILE; }
}
function setNs(raw) {
  const ns = safeNs(raw);
  try { localStorage.setItem(PROFILE_KEY, ns); } catch (e) {}
  return ns;
}
/* 存档键：pp_<昵称>_<字段>；昵称用 encodeURIComponent 避免中文/特殊字符出问题 */
function sk(name) { return 'pp_' + encodeURIComponent(currentNs()) + '_' + name; }
function adventureKey() { return 'adventure-progress-v3:' + encodeURIComponent(currentNs()); }

/* 旧版单档数据（无昵称前缀）迁移到当前昵称下，避免升级后进度丢失 */
(function migrateLegacySave() {
  try {
    const ns = currentNs();
    ['photo', 'drawn', 'slots', 'team', 'team_8', 'beijing_done', 'banquet_done'].forEach(name => {
      const oldKey = 'pp_' + name;
      const val = localStorage.getItem(oldKey);
      if (val == null) return;
      const newKey = 'pp_' + encodeURIComponent(ns) + '_' + name;
      if (localStorage.getItem(newKey) == null) localStorage.setItem(newKey, val);
      localStorage.removeItem(oldKey);
    });
  } catch (e) { /* 隐私模式下 localStorage 被禁则跳过 */ }
})();

/* ---------- 状态 ---------- */
const store = {
  get photo() { try { return localStorage.getItem(sk('photo')); } catch (e) { return null; } },
  set photo(v) { try { v ? localStorage.setItem(sk('photo'), v) : localStorage.removeItem(sk('photo')); } catch (e) {} },
  /* 本地存档可能被手改或写坏，解析失败时回退空数组，避免整站初始化崩掉 */
  get drawn() {
    try {
      const v = JSON.parse(localStorage.getItem(sk('drawn')) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  },
  set drawn(v) { try { localStorage.setItem(sk('drawn'), JSON.stringify(v)); } catch (e) {} },
  get slots() { try { return JSON.parse(localStorage.getItem(sk('slots'))); } catch (e) { return null; } },
  set slots(v) { try { localStorage.setItem(sk('slots'), JSON.stringify(v)); } catch (e) {} },
};
const state = { selectedChars: [], venue: null };

/* ---------- 路由 ---------- */
let curtain = null;
function ensureCurtain() {
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'scene-curtain';
    document.body.appendChild(curtain);
  }
  return curtain;
}
let sceneLock = false;
function show(sceneId) {
  if (sceneLock) return;
  const current = document.querySelector('.scene.active');
  const target = document.getElementById(sceneId);
  if (current === target) return;
  const c = ensureCurtain();
  sceneLock = true;
  c.classList.add('show');
  setTimeout(() => {
    if (current) { current.classList.remove('active'); current.classList.add('leaving'); }
    target.classList.add('active');
    target.classList.remove('leaving');
    if (current) setTimeout(() => current.classList.remove('leaving'), 250);
    setTimeout(() => { c.classList.remove('show'); sceneLock = false; }, 300);
  }, 300);
  location.hash = sceneId.replace('scene-', '');
}

/* ---------- 通用对话框 ---------- */
const dialog = {
  el: document.getElementById('dialog'),
  show({ title, text, okText = 'DONE', cancelText, onOk, onCancel }) {
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-text').innerText = text;
    const ok = document.getElementById('dialog-ok');
    const cancel = document.getElementById('dialog-cancel');
    ok.textContent = okText;
    cancel.classList.toggle('hidden', !cancelText);
    if (cancelText) cancel.textContent = cancelText;
    ok.onclick = () => { this.hide(); onOk && onOk(); };
    cancel.onclick = () => { this.hide(); onCancel && onCancel(); };
    this.el.classList.remove('hidden');
  },
  hide() { this.el.classList.add('hidden'); },
};

/* ---------- 全局按钮涟漪 ---------- */
document.addEventListener('click', e => {
  const btn = e.target.closest('.pixel-btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const r = document.createElement('span');
  r.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size / 2) + 'px';
  r.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 500);
});

/* ---------- 场景 0：登录 ---------- */
let pendingPhoto = null;          // 本次会话上传的照片，切换昵称时归到新昵称下
function applyPhoto(url) {
  pendingPhoto = url;
  try { store.photo = url; } catch (err) { /* 缩图后一般不会超配额，兜底仍只保留在内存 */ }
  const slot = document.getElementById('photo-slot');
  slot.classList.add('loading');
  setTimeout(() => {
    slot.innerHTML = `<img src="${url}" alt="玩家照片">`;
    slot.classList.remove('loading');
    document.getElementById('photo-hint').textContent = '玩家已就位';
    document.getElementById('btn-enter').disabled = false;
  }, 350);
}
const photoInput = document.getElementById('photo-input');
photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const raw = reader.result;
    const img = new Image();
    img.onload = () => {
      /* 手机原图动辄 3~5MB，base64 会膨胀 33%，直接存必然超 localStorage 5MB 配额；
         这张图最终只画成 382×320 的像素画，先缩到最长边 640px 再转 JPEG 足够 */
      const scale = Math.min(1, 640 / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(img.width * scale));
      cv.height = Math.max(1, Math.round(img.height * scale));
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      let url = cv.toDataURL('image/jpeg', 0.82);
      if (url.length > 400 * 1024) url = cv.toDataURL('image/jpeg', 0.6);  // 极端情况再压一档
      applyPhoto(url);
    };
    img.onerror = () => applyPhoto(raw);  // 解码失败才退回原图
    img.src = raw;
  };
  reader.readAsDataURL(file);
});

/* ---------- 昵称 = 独立存档 ---------- */
const nicknameInput = document.getElementById('nickname-input');
nicknameInput.value = currentNs();
function resetPhotoSlot() {
  pendingPhoto = null;
  document.getElementById('photo-slot').innerHTML = '<span class="plus">+</span>';
  document.getElementById('photo-hint').textContent = '上传照片 · 创建玩家';
  document.getElementById('btn-enter').disabled = true;
}
nicknameInput.addEventListener('change', () => {
  const prev = currentNs();
  const ns = setNs(nicknameInput.value);
  nicknameInput.value = ns;
  if (ns === prev) return;
  /* 切到已有存档：载入那个昵称的照片；切到新昵称：把刚上传的照片带过去 */
  let saved = null;
  try { saved = localStorage.getItem(sk('photo')); } catch (e) {}
  if (saved) applyPhoto(saved);
  else if (pendingPhoto) store.photo = pendingPhoto;
  else resetPhotoSlot();
});
let gachaRulesShown = false;
document.getElementById('btn-enter').addEventListener('click', () => {
  Audio8bit.sfx.beep();
  renderDeck();
  renderGachaPhotoWall();
  show('scene-gacha');
  if (!gachaRulesShown) {
    gachaRulesShown = true;
    setTimeout(() => {
      dialog.show({
        title: '【玩法说明】',
        text: '这里有343王国中的所有生物罗列，请根据关键词进行人物匹配。',
        okText: '开始点兵',
      });
    }, 400);
  }
});

/* 标题打字机 */
(function typeTitle() {
  const txt = 'GATHERING\nONLINE';
  const el = document.getElementById('title-text');
  let i = 0;
  const t = setInterval(() => {
    i++;
    el.innerHTML = txt.slice(0, i).replace('\n', '<br>');
    if (i >= txt.length) clearInterval(t);
  }, 110);
})();

/* 音乐开关 */
const muteBtn = document.getElementById('btn-mute');
if (Audio8bit.isMuted()) muteBtn.classList.add('off');
muteBtn.addEventListener('click', () => muteBtn.classList.toggle('off', Audio8bit.toggleMute()));

/* 登录页角落像素小人 */
document.getElementById('pixel-hero').style.background = pixelAvatar('#6ad5ff') + ' center/contain no-repeat';

/* ---------- 场景 1：抽卡 ---------- */
/* 8 个牌位固定：每个格子绑定一个角色，抽过的翻开显示立绘，不再移位 */
function slots() {
  if (!Array.isArray(store.slots) || store.slots.length !== 8) store.slots = Array(8).fill(null);
  const s = store.slots;
  let dirty = false;
  store.drawn.forEach(id => {           // 兼容旧存档：已抽角色固定到靠前格子
    if (!s.includes(id)) {
      const idx = s.indexOf(null);
      if (idx >= 0) { s[idx] = id; dirty = true; }
    }
  });
  if (dirty) store.slots = s;
  return s;
}
function saveSlots(s) { store.slots = s; }

/* 小猪模式：所有卡片暂时变成小猪 */
let pigMode = false;
function renderDeck() {
  const deck = document.getElementById('deck');
  deck.innerHTML = '';
  const drawn = store.drawn;
  const pig = CHARACTERS.find(c => c.id === 'pig');
  slots().forEach((id, i) => {
    const d = document.createElement('div');
    if (pigMode) {
      d.className = 'card-back drawn pig-mode';
      d.innerHTML = `<div class="mini-face" style="background:${avatarCss(pig)}"></div><span>小猪</span>`;
    } else if (id && drawn.includes(id)) {
      const inTeam = teamStore.list.includes(id);
      d.className = 'card-back drawn' + (inTeam ? ' in-team' : '');
      const ch = CHARACTERS.find(c => c.id === id);
      d.innerHTML = `<div class="mini-face" style="background:${avatarCss(ch)}"></div><span>${ch.name}</span>${inTeam ? '<i class="team-badge">✓</i>' : ''}`;
      d.addEventListener('click', () => toggleTeam(id));            // 单击：入队 / 出队
      d.addEventListener('dblclick', e => { e.preventDefault(); viewCard(id); });  // 双击：看大卡
    } else {
      d.className = 'card-back';
      d.textContent = '?';
      d.addEventListener('click', () => drawCard(i));
    }
    deck.appendChild(d);
  });
  document.getElementById('album-count').textContent = pigMode ? '全员小猪中…' : `卡册 ${drawn.length} / 8`;
  document.getElementById('gacha-actions').classList.toggle('hidden', drawn.length === 0 && !pigMode);
  // 集齐 8 张：全员手拉手集合庆祝（每次集齐仅一次，「千万别点」重置后可再来）
  if (!pigMode && drawn.length === 8 && teamStore.list.length === 0 && !teamStore.celebrated) allTogether();
}

/* ---------- 手拉手全员舞台 ---------- */
const teamStore = {
  get list() { try { return JSON.parse(localStorage.getItem(sk('team'))) || []; } catch (e) { return []; } },
  set list(v) { try { localStorage.setItem(sk('team'), JSON.stringify(v)); } catch (e) {} },
  get celebrated() { try { return localStorage.getItem(sk('team_8')) === '1'; } catch (e) { return false; } },
  set celebrated(v) { try { v ? localStorage.setItem(sk('team_8'), '1') : localStorage.removeItem(sk('team_8')); } catch (e) {} },
};
/* 底部排排站：点击成员 = 踢出队伍；抽卡页与地图页共用同一支队伍 */
function renderTeam(celebrate) {
  const list = teamStore.list;
  document.querySelectorAll('.team-row').forEach(row => {
  row.innerHTML = '';
  row.classList.remove('celebrate');
  if (!list.length) {
    row.innerHTML = '<span class="team-empty">点击抽到的卡牌，叫他们出来手拉手～</span>';
    return;
  }
  row.style.setProperty('--mw', (list.length >= 7 ? 42 : list.length >= 5 ? 48 : 54) + 'px');
  list.forEach((id, i) => {
    const c = CHARACTERS.find(x => x.id === id);
    if (!c) return;
    const el = document.createElement('button');
    el.className = 'team-member';
    el.title = `${c.name} · 点击请出队伍`;
    const pic = document.createElement('img');
    pic.src = c.img;
    pic.alt = c.name;
    pic.decoding = 'async';
    el.appendChild(pic);
    if (celebrate) el.style.animationDelay = (i * 0.09) + 's';
    el.addEventListener('click', () => {
      teamStore.list = teamStore.list.filter(x => x !== id);
      Audio8bit.sfx.tap();
      renderTeam();
      renderDeck();
    });
    row.appendChild(el);
  });
  if (celebrate) {
    row.classList.add('celebrate');
    setTimeout(() => row.classList.remove('celebrate'), 2200);
  }
  });
  /* 地图页召唤栏：没人在队时收起队伍行；召唤/遣返按钮文案同步 */
  const mapRow = document.getElementById('team-row-map');
  if (mapRow) mapRow.classList.toggle('hidden', !list.length);
  document.querySelectorAll('.team-toggle').forEach(b => { b.textContent = list.length ? '遣返全员' : '召唤全员'; });
}
function toggleTeam(id) {
  const list = teamStore.list;
  const i = list.indexOf(id);
  if (i >= 0) { list.splice(i, 1); Audio8bit.sfx.tap(); }
  else { list.push(id); Audio8bit.sfx.beep(); }
  teamStore.list = list;
  renderTeam();
  renderDeck();
}
/* 召唤/遣返全员：解锁的人物随叫随到（抽卡页 + 地图页共用） */
function toggleTeamBulk() {
  if (teamStore.list.length) {
    teamStore.list = [];
    Audio8bit.sfx.tap();
    renderTeam();
    renderDeck();
    return;
  }
  if (!store.drawn.length) {
    dialog.show({ title: '【召唤失败】', text: '还没有解锁的人物——先去【点兵】抽卡，解锁后就能在地图上随时召唤、随时遣返。', okText: '知道了' });
    return;
  }
  teamStore.list = [...store.drawn];
  Audio8bit.sfx.beep();
  renderTeam(true);
  renderDeck();
}
document.querySelectorAll('.team-toggle').forEach(b => b.addEventListener('click', toggleTeamBulk));
/* 集齐 8 张卡：全员自动手拉手 + 依次弹跳登场 */
function allTogether() {
  teamStore.celebrated = true;
  teamStore.list = CHARACTERS.map(c => c.id);
  Audio8bit.sfx.fanfare();
  renderTeam(true);
  dialog.show({ title: '【全员集合】', text: '343王国全员手拉手，集合完毕！', okText: '出发！' });
}
renderTeam();

/* 查看已抽角色详情：直接展示全身人物（已抽过，无需猜关键词） */
function viewCard(id) {
  const ch = CHARACTERS.find(c => c.id === id);
  if (!ch) return;
  Audio8bit.sfx.tap();
  clearRevealTimers();
  const av = document.getElementById('reveal-avatar');
  av.classList.add('full');
  av.style.background = fullBodyCss(ch);
  av.style.backgroundColor = '#2b3a67';
  document.getElementById('reveal-name').textContent = ch.name;
  document.getElementById('reveal-gift').innerText = ch.gift;
  document.getElementById('keywords').innerHTML = '';
  document.getElementById('btn-reveal-flip').classList.add('hidden');
  document.getElementById('reveal-card').classList.add('flipped');
  document.getElementById('btn-reveal-ok').classList.remove('hidden');
  document.getElementById('reveal').classList.remove('hidden');
}

let revealTimers = [];
function clearRevealTimers() { revealTimers.forEach(t => clearTimeout(t)); revealTimers = []; }

/* 抽卡：卡背 → 关键词逐条展示 → 翻面 → 人物 */
function drawCard(slotIdx) {
  const drawn = store.drawn;
  let id = slots()[slotIdx];
  if (!id) {
    const pool = CHARACTERS.filter(c => !slots().includes(c.id));
    if (!pool.length) return;
    id = pool[Math.floor(Math.random() * pool.length)].id;
    const s = slots();
    s[slotIdx] = id;
    saveSlots(s);
  }
  if (drawn.includes(id)) return;
  const pick = CHARACTERS.find(c => c.id === id);
  store.drawn = [...drawn, id];
  drawn.length === 0 ? Audio8bit.sfx.fanfare() : Audio8bit.sfx.tap();

  clearRevealTimers();
  const card = document.getElementById('reveal-card');
  const kwBox = document.getElementById('keywords');
  const okBtn = document.getElementById('btn-reveal-ok');
  const flipBtn = document.getElementById('btn-reveal-flip');
  const av = document.getElementById('reveal-avatar');

  // 重置：卡背朝上，清空关键词，隐藏所有按钮
  card.classList.remove('flipped');
  kwBox.innerHTML = '';
  okBtn.classList.add('hidden');
  flipBtn.classList.add('hidden');
  // 翻面即全身照（full 类：290px 高 + contain 完整立绘）
  av.classList.add('full');
  av.style.background = fullBodyCss(pick);
  av.style.backgroundColor = '#2b3a67';
  document.getElementById('reveal-name').textContent = pick.name;
  document.getElementById('reveal-gift').innerText = pick.gift;

  document.getElementById('reveal').classList.remove('hidden');

  // 关键词逐条展示（按顺序，有猜测感）
  const kws = pick.keywords || [];
  kws.forEach((kw, i) => {
    revealTimers.push(setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'keyword';
      el.textContent = kw;
      kwBox.appendChild(el);
      Audio8bit.sfx.beep();
    }, 500 + i * 950));
  });

  // 全部关键词展示完 → 显示「揭晓她是谁」按钮，等待用户点击翻面
  revealTimers.push(setTimeout(() => {
    flipBtn.classList.remove('hidden');
  }, 500 + kws.length * 950 + 400));
}

/* 点击「揭晓她是谁」：翻面并显示 OK */
document.getElementById('btn-reveal-flip').addEventListener('click', () => {
  Audio8bit.sfx.flip();
  document.getElementById('reveal-card').classList.add('flipped');
  document.getElementById('btn-reveal-flip').classList.add('hidden');
  document.getElementById('btn-reveal-ok').classList.remove('hidden');
});

document.getElementById('btn-reveal-ok').addEventListener('click', () => {
  Audio8bit.sfx.pop();
  clearRevealTimers();
  document.getElementById('btn-reveal-flip').classList.add('hidden');
  document.getElementById('reveal').classList.add('hidden');
  renderDeck();
});
document.getElementById('btn-redraw').addEventListener('click', () => {
  if (pigMode) return;
  // 全员变猪 3 秒
  pigMode = true;
  Audio8bit.sfx.whoosh();
  renderDeck();
  document.getElementById('btn-redraw').disabled = true;
  setTimeout(() => {
    pigMode = false;
    // 清空所有抽卡记录，恢复未抽取状态；团队散伙，集齐庆祝可重来
    store.drawn = [];
    store.slots = Array(8).fill(null);
    teamStore.list = [];
    teamStore.celebrated = false;
    renderTeam();
    document.getElementById('btn-redraw').disabled = false;
    renderDeck();
  }, 3000);
});
document.getElementById('btn-to-map').addEventListener('click', () => { refreshMapLocks(); show('scene-map'); });

/* ---------- 场景 2：地图（关卡锁链：云南之旅 → 北京重聚 → 坏女孩寿宴） ---------- */
let eggTaps = 0, eggTimer = null;
document.querySelectorAll('.map-node').forEach(n => {
  n.addEventListener('click', () => {
    Audio8bit.sfx.tap();
    const t = n.dataset.target;
    /* 场景随时可开；但 ② 北京重聚 需 ① 云南之旅 三关全部通关后解锁 */
    if (t === 'yunnan') { startAdventure(); return; }
    if (t === 'beijing') {
      if (!yunnanAllDone()) {
        dialog.show({ title: '【关卡未解锁】', text: '北京重聚还没开——先去 ① 云南之旅，把三个关卡全部通关，凑齐 343 主角团再进京！', okText: '去云南', onOk: () => startAdventure() });
        return;
      }
      Audio8bit.sfx.flip();
      renderBeijing();
      show('scene-beijing');
      return;
    }
    if (t === 'banquet') {
      startBanquet();
      return;
    }
    dialog.show({ title: '【NEXT MISSION】', text: COPY[t] || '场景建设中', okText: 'OK' });
  });
});

/* ---------- 关卡锁链状态 ---------- */
function beijingDone() { try { return localStorage.getItem(sk('beijing_done')) === '1'; } catch (e) { return false; } }
function banquetDone() { try { return localStorage.getItem(sk('banquet_done')) === '1'; } catch (e) { return false; } }
function refreshMapLocks() {
  /* 关卡锁链：① 云南通关打勾 + 解锁 ② 北京；北京通关打勾；③ 寿宴礼成打勾 */
  refreshYunnanDone();
  document.querySelector('.node-beijing').classList.toggle('node-locked', !yunnanAllDone());
  document.getElementById('beijing-done').classList.toggle('hidden', !beijingDone());
  document.getElementById('banquet-done').classList.toggle('hidden', !banquetDone());
}

/* ---------- 北京重聚（第二关 · 占位通关页） ---------- */
function renderBeijing() {
  const box = document.getElementById('bj-lineup');
  box.innerHTML = '';
  /* 北京重聚：只展示四个主角 */
  MAIN_IDS.forEach(id => {
    const c = CHARACTERS.find(x => x.id === id);
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'bj-hero';
    el.title = c.name;
    el.style.backgroundImage = `url('${c.img}')`;
    const tag = document.createElement('b');
    tag.textContent = c.name;
    el.appendChild(tag);
    box.appendChild(el);
  });
}
document.getElementById('btn-beijing-done').addEventListener('click', () => {
  try { localStorage.setItem(sk('beijing_done'), '1'); } catch (e) {}
  Audio8bit.sfx.fanfare();
  refreshMapLocks();
  dialog.show({ title: '【解锁新关卡】', text: '坏女孩寿宴已开放——蛋糕正在路上！', okText: '出发', onOk: () => show('scene-map') });
});

/* ---------- 云南之旅 · 343像素冒险（iframe 隔离嵌入） ---------- */
/* 游戏进度按昵称隔离存储，键名与 adventure/game.js 保持一致 */
function yunnanAllDone() {
  try {
    const p = JSON.parse(localStorage.getItem(adventureKey()));
    return !!(p && Array.isArray(p.completed) && p.completed.length >= 3);
  } catch (e) { return false; }
}
function refreshYunnanDone() {
  document.getElementById('yunnan-done').classList.toggle('hidden', !yunnanAllDone());
}
function startAdventure() {
  Audio8bit.stopBGM();               // 进游戏停主站 BGM，避免两套音乐打架
  document.getElementById('adv-frame').src = 'adventure/index.html?ns=' + encodeURIComponent(currentNs());
  document.getElementById('adv-layer').classList.remove('hidden');
}
function closeAdventure() {
  document.getElementById('adv-layer').classList.add('hidden');
  document.getElementById('adv-frame').src = 'about:blank';   // 释放游戏与音乐
  refreshMapLocks();                 // 刷新锁链状态（云南通关打勾 / 解锁北京）
  Audio8bit.startBGM();
  Audio8bit.sfx.tap();
}
document.getElementById('adv-back').addEventListener('click', closeAdventure);
window.addEventListener('message', e => { if (e && e.data && e.data.type === 'adv:exit') closeAdventure(); });
refreshMapLocks();
document.getElementById('map-egg').addEventListener('click', () => {
  eggTaps++;
  clearTimeout(eggTimer);
  eggTimer = setTimeout(() => eggTaps = 0, 1200);
  if (eggTaps >= 3) { eggTaps = 0; show('scene-ktv'); }
});
document.getElementById('btn-ktv-back').addEventListener('click', () => show('scene-map'));

/* ---------- KTV 隐藏关卡：声控《小狗毛之歌》 ----------
   开麦唱歌：响度超过基线小牛前进，唱到高音小牛跳跃翻障碍；
   里程推进四句歌词滚动，抵达终点旗=演唱会圆满成功；
   没有麦克风时自动切换「按住=唱歌 / 点=高音跳」按钮兜底。 */
(function () {
  const LYRICS = ['小狗身上有狗毛', '小狗走路用狗脚', '小狗每天要抱抱', '小狗一问不知道'];
  const GOAL = 2600;                  // 演唱里程：四句歌，每句约 650
  const COW_X = 0.22;                 // 小牛固定在舞台 22% 处
  const $k = id => document.getElementById(id);
  const sec = $k('scene-ktv'), stage = $k('ktv-stage'), cowEl = $k('ktv-cow'),
        pool = $k('ktv-ob-pool'), flagEl = $k('ktv-flag'), lyricEl = $k('ktv-lyric'),
        flashEl = $k('ktv-flash'), rainEl = $k('ktv-rain'), micIcon = $k('ktv-mic'),
        barEl = stage.parentElement.querySelector('.ktv-meter-bar'), fillEl = $k('ktv-meter-fill'),
        numEl = $k('ktv-level-num'), tipEl = $k('ktv-tip'), btnMic = $k('btn-ktv-mic'),
        btnHold = $k('btn-ktv-hold'), btnJump = $k('btn-ktv-jump'), btnSkip = $k('btn-ktv-skip');
  micIcon.classList.add('off');
  let stream = null, actx = null, analyser = null, data = null;
  let micOn = false, fallback = false, holding = false;
  let running = false, rafId = 0, state = 'idle';   // idle | playing | done
  let travel = 0, cowY = 0, cowVY = 0, onGround = true, lastLyric = -1;
  let level = 0, noiseFloor = 2, thGo = 8, thJump = 30;
  let obstacles = [];

  const setTip = t => { tipEl.textContent = t; };
  function makeObstacles() {
    obstacles = []; pool.innerHTML = '';
    const kinds = ['🎤', '🔊', '♪', '🎧'];
    let x = 420, i = 0;
    while (x < GOAL - 180) {
      const el = document.createElement('span');
      el.className = 'ktv-ob';
      el.textContent = kinds[i % kinds.length];
      pool.appendChild(el);
      obstacles.push({ x, el, w: 30, h: 34 + (i % 2) * 14 });
      x += 430 + (i * 97) % 240;     // 间距 430~670，错落摆放
      i++;
    }
  }
  function resetGame() {
    travel = 0; cowY = 0; cowVY = 0; onGround = true; lastLyric = -1;
    rainEl.innerHTML = '';
    cowEl.classList.remove('run'); cowEl.style.transform = '';
    makeObstacles(); render();
  }
  async function startMic() {
    btnMic.disabled = true;
    btnMic.textContent = '🎤 正在请求麦克风…';
    try {
      stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('麦克风请求超时')), 6000))
      ]);
      actx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = actx.createAnalyser();
      analyser.fftSize = 1024;
      actx.createMediaStreamSource(stream).connect(analyser);
      if (actx.state === 'suspended') actx.resume();
      data = new Uint8Array(analyser.fftSize);
      micOn = true;
      micIcon.classList.remove('off');
      setTip('嘘——安静 1 秒，先校准环境音…');
      await calibrate();
      startRun('开唱！大声唱《小狗毛之歌》，小牛才会前进；到障碍前放开嗓子唱高音，小牛就会跳！');
    } catch (e) {
      micOn = false;
      useFallback();
    }
  }
  function calibrate() {
    return new Promise(res => {
      const samples = []; const t0 = performance.now();
      (function tick() {
        samples.push(readLevel());
        if (performance.now() - t0 < 1000) return requestAnimationFrame(tick);
        noiseFloor = Math.max(2, samples.reduce((a, b) => a + b, 0) / samples.length * 1.4);
        thGo = noiseFloor * 2.2 + 3;
        thJump = Math.max(thGo * 1.9, noiseFloor * 5 + 12);
        res();
      })();
    });
  }
  function readLevel() {
    if (!analyser) return 0;
    analyser.getByteTimeDomainData(data);
    let s = 0;
    for (let i = 0; i < data.length; i++) { const d = (data[i] - 128) / 128; s += d * d; }
    return Math.sqrt(s / data.length) * 100;   // RMS×100，安静≈0~5，唱歌≈20~60
  }
  function useFallback() {
    fallback = true;
    btnMic.hidden = true; btnHold.hidden = false; btnJump.hidden = false;
    startRun('没拿到麦克风——用按钮代替：按住【按住 = 唱歌】小牛前进，点【高音跳！】小牛跳跃。');
  }
  function startRun(tip) {
    btnMic.hidden = true;
    resetGame();
    state = 'playing';
    if (tip) setTip(tip);
    try { Audio8bit.sfx.beep(); } catch (e) {}
    if (!running) { running = true; rafId = requestAnimationFrame(loop); }
  }
  function stopGame() {
    state = 'idle'; running = false;
    cancelAnimationFrame(rafId);
    holding = false;
  }
  function freeMic() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    analyser = null; data = null;
    if (actx) { actx.close().catch(() => {}); actx = null; }
    micOn = false;
    micIcon.classList.add('off');
  }
  function loop() {
    if (!sec.classList.contains('active')) { stopGame(); return; }
    if (micOn) level = readLevel();
    else if (fallback) level = holding ? 24 + Math.random() * 5 : 1;
    else level = 0;
    renderMeter();
    if (state !== 'playing') { rafId = requestAnimationFrame(loop); return; }
    // 唱得越响跑得越快
    const speed = level > thGo ? Math.min(3.6, 1.4 + (level - thGo) * 0.08) : 0;
    travel += speed;
    cowEl.classList.toggle('run', speed > 0);
    // 高音才跳得起来
    if (level > thJump && onGround) { cowVY = -8.6; onGround = false; }
    if (!onGround) {
      cowVY += 0.5; cowY += cowVY;
      if (cowY >= 0) { cowY = 0; cowVY = 0; onGround = true; }
    }
    // 碰撞：牛身矩形 vs 障碍矩形
    const sw = stage.clientWidth, cowCX = sw * COW_X + 20;
    for (const ob of obstacles) {
      const ox = sw * COW_X + 56 + (ob.x - travel);
      if (ox > sw + 60 || ox < -60) continue;
      if (Math.abs(ox - cowCX) < (ob.w + 40) / 2 && -cowY < ob.h - 6) { crash(); return; }
    }
    // 歌词按里程滚动
    const li = Math.min(3, Math.floor(travel / GOAL * 4));
    if (li !== lastLyric) {
      lastLyric = li;
      lyricEl.textContent = '♪ ' + LYRICS[li] + ' ♪';
      lyricEl.classList.remove('pulse'); void lyricEl.offsetWidth; lyricEl.classList.add('pulse');
    }
    if (travel >= GOAL) { win(); return; }
    render();
    rafId = requestAnimationFrame(loop);
  }
  function crash() {
    flashEl.classList.remove('on'); void flashEl.offsetWidth; flashEl.classList.add('on');
    try { Audio8bit.sfx.tap(); } catch (e) {}
    travel = 0; cowY = 0; cowVY = 0; onGround = true; lastLyric = -1;
    setTip('哎呀，撞上了！深呼吸，从头再唱一遍《小狗毛之歌》～');
    render();
    rafId = requestAnimationFrame(loop);
  }
  function celebrate() {
    rainEl.innerHTML = Array.from({ length: 16 }, (_, i) =>
      `<i style="left:${4 + i * 6}%;animation-delay:${i * 0.12}s">${['🎉', '♪', '🎊', '🎤'][i % 4]}</i>`).join('');
  }
  function win() {
    state = 'done'; travel = GOAL;
    render();
    cowEl.classList.remove('run');
    cowEl.style.transform = 'translateY(-26px) rotate(-10deg)';
    celebrate();
    setTip('《小狗毛之歌》演唱会圆满成功！全场大合唱，小牛鞠躬谢幕！');
    try { Audio8bit.sfx.beep(); } catch (e) {}
    rafId = requestAnimationFrame(loop);
  }
  function render() {
    const sw = stage.clientWidth, base = sw * COW_X + 56;
    for (const ob of obstacles) {
      const ox = base + (ob.x - travel);
      ob.el.style.transform = `translateX(${ox}px)`;
      ob.el.style.opacity = (ox < -50 || ox > sw + 50) ? '0' : '1';
    }
    flagEl.style.transform = `translateX(${base + GOAL - travel - 40}px)`;
    flagEl.style.opacity = (base + GOAL - travel > sw + 60) ? '0' : '1';
    if (state === 'playing') cowEl.style.transform = `translateY(${cowY}px)`;
  }
  function renderMeter() {
    fillEl.style.width = Math.min(100, level * 1.35) + '%';
    fillEl.style.background = level > thJump ? '#ff6ad5' : level > thGo ? '#ffd866' : '#4ade80';
    numEl.textContent = level.toFixed(2).padStart(5, '0');
    if (barEl) {
      barEl.querySelector('.th-go').style.left = Math.min(96, thGo * 1.35) + '%';
      barEl.querySelector('.th-jump').style.left = Math.min(98, thJump * 1.35) + '%';
    }
  }
  btnMic.addEventListener('click', startMic);
  btnSkip.addEventListener('click', () => {
    if (state === 'done') return;
    state = 'done'; travel = GOAL; lastLyric = 3;
    lyricEl.textContent = '♪ ' + LYRICS[3] + ' ♪';
    render(); celebrate();
    setTip('选择跳过 · 《小狗毛之歌》自动播放完毕，演唱会圆满成功！');
  });
  const holdOn = () => { holding = true; };
  const holdOff = () => { holding = false; };
  ['pointerdown', 'mousedown', 'touchstart'].forEach(ev => btnHold.addEventListener(ev, holdOn, { passive: true }));
  ['pointerup', 'pointerleave', 'pointercancel', 'mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => btnHold.addEventListener(ev, holdOff, { passive: true }));
  btnJump.addEventListener('click', () => { if (state === 'playing' && onGround) { cowVY = -8.6; onGround = false; } });
  // 再次进入 KTV 时重置入口；离开（返回地图 / hash 切换）时停游戏并释放麦克风
  function resetEntry() {
    state = 'idle'; fallback = false; holding = false;
    btnMic.hidden = false; btnMic.disabled = false;
    btnMic.textContent = '🎤 开麦 · 演唱《小狗毛之歌》';
    btnHold.hidden = true; btnJump.hidden = true;
    travel = 0; cowY = 0; cowVY = 0; onGround = true; lastLyric = -1;
    rainEl.innerHTML = '';
    cowEl.classList.remove('run'); cowEl.style.transform = '';
    lyricEl.textContent = '♪ 准备开嗓 ♪';
    makeObstacles(); render();
    setTip('点下面的按钮开麦——必须真的演唱《小狗毛之歌》，小牛才肯往前走！');
  }
  new MutationObserver(() => {
    const active = sec.classList.contains('active');
    if (!active) { if (running) { stopGame(); freeMic(); } return; }
    resetEntry();
  }).observe(sec, { attributes: true, attributeFilter: ['class'] });
})();

/* ---------- 抽卡场景：挂绳拍立得照片墙 ---------- */
const PHOTO_LIST = (() => {
  const list = ['assets/memories/mem-01.png'];
  for (let i = 2; i <= 28; i++) list.push(`assets/memories/mem-${String(i).padStart(2, '0')}.jpg`);
  return list;
})();

/* 照片墙只加载 96px 缩略图（3.2MB → 192KB），原图留给灯箱 */
function thumbSrc(src) { return src.replace(/^(assets\/memories\/)(mem-\d+)\.\w+$/, '$1thumbs/$2.jpg'); }

/* 像素化照片墙缩略图，原图只在灯箱中加载 */
const PIXEL_CACHE = new Map();
function getPixelated(src) {
  if (PIXEL_CACHE.has(src)) return Promise.resolve(PIXEL_CACHE.get(src));
  const job = new Promise(resolve => pixelateUrl(src, resolve));
  PIXEL_CACHE.set(src, job);
  return job;
}

let gachaWallRendered = false;
function renderGachaPhotoWall() {
  // 抽卡面板此时可能尚未展开（场景未激活），等拿到真实尺寸再布局
  const panel = document.querySelector('#scene-gacha .panel');
  const pr = panel.getBoundingClientRect();
  if (pr.height < 10) { requestAnimationFrame(renderGachaPhotoWall); return; }
  if (gachaWallRendered) return;
  gachaWallRendered = true;

  const wall = document.getElementById('gacha-photo-wall');
  wall.innerHTML = '';
  const W = wall.clientWidth || window.innerWidth;
  const H = wall.clientHeight || window.innerHeight;
  const fTop = Math.max(0, pr.top - 12);          // 面板上边界（留点间距）
  const fBottom = Math.min(H, pr.bottom + 12);    // 面板下边界

  // 拍立得尺寸（响应式）
  const photoW = Math.max(44, Math.min(68, Math.floor(W / 11)));
  const photoH = photoW + 22;        // 含底部白边
  const ropeGap = photoH + 30;       // 绳索之间的垂直间距

  // 目标绳索数：让每条绳挂 5~6 张，28 张 → 约 6 条绳
  const targetRopes = Math.max(4, Math.ceil(PHOTO_LIST.length / 6));
  // 两侧照片形成相框感，中心留给点兵面板。
  let ropesTop = Math.max(1, Math.floor(fTop / ropeGap));
  ropesTop = Math.min(ropesTop, 2);
  const ropesBottom = Math.max(1, targetRopes - ropesTop);
  const ropeCount = ropesTop + ropesBottom;
  const perRope = Math.ceil(PHOTO_LIST.length / ropeCount);

  const contentH = H;

  // 创建内部容器
  const inner = document.createElement('div');
  inner.className = 'wall-inner';
  inner.style.height = `${contentH}px`;
  wall.appendChild(inner);

  // 计算每条绳索的 y 坐标
  const ropeYs = [];
  // 上方绳索：均匀分布在 [photoH, fTop]
  for (let i = 0; i < ropesTop; i++) {
    const y = ropesTop === 1
      ? (photoH + fTop) / 2
      : photoH + (fTop - photoH) * (i + 1) / (ropesTop + 1);
    ropeYs.push({ y, sag: 10 + Math.random() * 14 });
  }
  // 下方绳索：从面板下方向下排列，最后一条不超出视口
  for (let i = 0; i < ropesBottom; i++) {
    const y = Math.min(H - photoH - 10, fBottom + photoH / 2 + i * ropeGap);
    ropeYs.push({ y, sag: 10 + Math.random() * 14 });
  }

  // 绘制 SVG 绳索
  let svg = `<svg class="rope-svg" viewBox="0 0 ${W} ${contentH}" preserveAspectRatio="none" style="height:${contentH}px">`;
  ropeYs.forEach(pos => {
    const x1 = -10, x2 = W + 10, yTop = pos.y;
    const yMid = yTop + pos.sag;
    svg += `<path d="M ${x1} ${yTop} Q ${W/2} ${yMid} ${x2} ${yTop}" stroke="#8b6f47" stroke-width="2.5" fill="none" opacity="0.8"/>`;
    svg += `<circle cx="${x1+10}" cy="${yTop}" r="4" fill="#5a4632"/>`;
    svg += `<circle cx="${x2-10}" cy="${yTop}" r="4" fill="#5a4632"/>`;
  });
  svg += '</svg>';
  inner.insertAdjacentHTML('beforeend', svg);

  // 两侧各自布置悬挂照片，中间区域不拦截面板交互。
  PHOTO_LIST.forEach((src, i) => {
    const r = Math.floor(i / perRope);
    if (r >= ropeCount) return;
    const idxInRope = i % perRope;
    const count = Math.min(perRope, PHOTO_LIST.length - r * perRope);
    const pos = ropeYs[r];
    // 偶数序号靠左、奇数靠右，同侧内再均分，形成相框感
    const leftSide = idxInRope % 2 === 0;
    const sideIndex = Math.floor(idxInRope / 2);
    const sideCount = leftSide ? Math.ceil(count / 2) : Math.floor(count / 2);
    const edge = Math.max(photoW / 2 + 8, W * 0.13);
    const room = Math.max(0, W * 0.31 - edge);
    const x = leftSide
      ? edge + (sideCount <= 1 ? 0 : sideIndex * room / (sideCount - 1))
      : W - edge - (sideCount <= 1 ? 0 : sideIndex * room / (sideCount - 1));
    // 二次贝塞尔曲线在该 x 处的 y（绳子实际下垂位置）
    const t = Math.min(1, Math.max(0, (x + 10) / (W + 20)));
    const yRope = pos.y + 2 * (1 - t) * t * pos.sag;

    const item = document.createElement('div');
    item.className = 'polaroid sway';
    const rot = (Math.random() - 0.5) * 10;
    const dur = (5.5 + Math.random() * 2).toFixed(2);
    const scale = 0.88 + Math.random() * 0.14;
    item.style.left = `${x - photoW / 2}px`;
    item.style.top = `${yRope + 6}px`;
    item.style.width = `${photoW}px`;
    item.style.setProperty('--rot', `${rot}deg`);
    item.style.setProperty('--scale', scale.toFixed(2));
    item.style.setProperty('--dur', `${dur}s`);
    item.style.animationDelay = `${(Math.random() * -dur).toFixed(2)}s`;
    item.style.zIndex = 1 + Math.floor(Math.random() * 4);

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `回忆 ${i + 1}`;
    const thumb = thumbSrc(src);
    img.src = thumb;                      // 先显示缩略图占位
    img.dataset.src = src;
    img.classList.add('pixel-loading');
    getPixelated(thumb).then(dataUrl => { // 像素化完成后替换
      if (!item.isConnected) return;
      img.src = dataUrl;
      img.classList.remove('pixel-loading');
    });
    item.appendChild(img);

    item.addEventListener('click', () => { Audio8bit.sfx.tap(); openLightbox(i); });
    inner.appendChild(item);
  });
}

/* 窗口尺寸变化时重排照片墙（仅在抽卡场景激活时） */
let wallResizeTimer = null;
window.addEventListener('resize', () => {
  if (!document.getElementById('scene-gacha').classList.contains('active')) return;
  clearTimeout(wallResizeTimer);
  wallResizeTimer = setTimeout(() => {
    gachaWallRendered = false;
    renderGachaPhotoWall();
  }, 300);
});

/* 灯箱：点击放大，支持左右切换 */
let lbIndex = 0;
function openLightbox(idx) {
  lbIndex = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.classList.add('lightbox-open');
}
function updateLightbox() {
  // 灯箱展示原图（背景墙才是像素风）
  document.getElementById('lb-img').src = PHOTO_LIST[lbIndex];
  document.getElementById('lb-counter').textContent = `${lbIndex + 1} / ${PHOTO_LIST.length}`;
}
function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.classList.remove('lightbox-open');
}
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => {
  Audio8bit.sfx.pop();
  lbIndex = (lbIndex - 1 + PHOTO_LIST.length) % PHOTO_LIST.length;
  updateLightbox();
});
document.getElementById('lb-next').addEventListener('click', () => {
  Audio8bit.sfx.pop();
  lbIndex = (lbIndex + 1) % PHOTO_LIST.length;
  updateLightbox();
});
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (document.getElementById('lightbox').classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') document.getElementById('lb-prev').click();
  else if (e.key === 'ArrowRight') document.getElementById('lb-next').click();
});

/* ---------- 寿宴背景像素小精灵：地标 & 小动物（手绘 16×16 像素画） ---------- */
const VA_PAL = {
  '1': '#ffffff', 'K': '#2b2b33', 'B': '#6f7fc4', 'G': '#3aa655', 'D': '#2d8a46',
  'N': '#8b5e3c', 'T': '#f7e3b0', 'O': '#ffa94d', 'R': '#ff8787', 'P': '#ffd9b3',
  'Q': '#3fb8b8', 'M': '#c0392b', 'E': '#95e06b', 'F': '#3d4a6b',
};
const VA_SPRITES = [
  { name: '四姑娘山', rows: [
    '................',
    '.....1....1.....',
    '....111..111....',
    '...11B1..1B11...',
    '..11BBB11BBB11..',
    '.11BBBBBBBBBB11.',
    '1BBBBBBBBBBBBBB1',
    'BBBBBBBBBBBBBBBB',
    'BBBBBBBBBBBBBBBB',
    '.BBBBBBBBBBBBBB.',
    '.TTTTTTTTTTTTTT.',
    '..TTTTTTTTTTTT..',
  ]},
  { name: '九寨沟', rows: [
    '................',
    '..G....G....G...',
    '.GGG..GGG..GGG..',
    '.GDG..GDG..GDG..',
    '..D....D....D...',
    'EEEEEEEEEEEEEEEE',
    'QQQQQQQQQQQQQQQQ',
    'QQ1QQQQ1QQQQ1QQQ',
    'QQQQQQQQQQQQQQQQ',
    'QQQ1QQQQ1QQQQ1QQ',
    'QQQQQQQQQQQQQQQQ',
    '.QQQQQQQQQQQQQQ.',
    '.EEEEEEEEEEEEEE.',
  ]},
  { name: '211教室', rows: [
    '................',
    '.NNNNNNNNNNNNNN.',
    '.NFFFFFFFFFFFFN.',
    '.NFF11FF1FF11FN.',
    '.NFFFFFFFFFFFFN.',
    '.NNNNNNNNNNNNNN.',
    '................',
    '..TTTT....TTTT..',
    '..TTTT....TTTT..',
    '..K..K....K..K..',
    '..K..K....K..K..',
  ]},
  { name: '四川大学', rows: [
    '................',
    '.MMMMMMMMMMMMMM.',
    '.M111111111111M.',
    '.MMMMMMMMMMMMMM.',
    '..MM..MMMM..MM..',
    '..MM..MMMM..MM..',
    '..MM..MMMM..MM..',
    '..MM..MMMM..MM..',
    '..MM..MMMM..MM..',
    '..MM..MMMM..MM..',
    '.MMMMMMMMMMMMMM.',
    '.MMMMMMMMMMMMMM.',
  ]},
  { name: '小羊', rows: [
    '................',
    '....111111......',
    '..1111111111....',
    '.111111111111...',
    '.111111111111...',
    '.111111111111...',
    '..1111111111....',
    '...11PPPP11.....',
    '....PPPPPP......',
    '....PKPPKP......',
    '....PPPPPP......',
    '.....PPPP.......',
    '....N..N........',
    '....N..N........',
  ]},
  { name: '小牛', rows: [
    '................',
    '..T..........T..',
    '..T1........1T..',
    '..111111111111..',
    '.11111111111111.',
    '.1N1111111111N1.',
    '.1111NN11NN1111.',
    '.11K11111111K11.',
    '..111111111111..',
    '...PPPPPPPPPP...',
    '...PPKPPPPKPP...',
    '....PPPPPPPP....',
    '....K..K..K.....',
    '....K..K..K.....',
  ]},
  { name: '小猫', rows: [
    '................',
    '..O........O....',
    '..OO......OO....',
    '..ORO....ORO....',
    '..OOOOOOOOOO....',
    '.OOOOOOOOOOOO...',
    '.OOOOOOOOOOOO...',
    '.OKOOOOOOOOKO...',
    '.OOOOORROOOOO...',
    '..OOOOOOOOOO....',
    '...OOKKKKOO.....',
    '....OOOOOO......',
  ]},
  { name: '小狗', rows: [
    '................',
    '..NN......NN....',
    '..NNN....NNN....',
    '..NNTTTTTTNN....',
    '.NNTTTTTTTTNN...',
    '.NNTKTTTTKTNN...',
    '.NNTTTTTTTTNN...',
    '..NTTTTTTTTN....',
    '..NTTKKTTTTN....',
    '...TTTTTTTT.....',
    '....TTTTTT......',
    '....TTRRTT......',
  ]},
  { name: '小兔子', rows: [
    '................',
    '...1......1.....',
    '...11....11.....',
    '...1P1..1P1.....',
    '...1P1..1P1.....',
    '...1P1..1P1.....',
    '...11111111.....',
    '..1111111111....',
    '..1K111111K1....',
    '..1111111111....',
    '..1111R11111....',
    '...11111111.....',
    '....111111......',
  ]},
];
/* 像素画 → SVG dataURI（同行同色合并为一个矩形） */
function buildVaSprite(sp) {
  let s = '';
  sp.rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const col = VA_PAL[row[x]];
      if (!col) { x++; continue; }
      const ch = row[x];
      let w = 1;
      while (row[x + w] === ch) w++;
      s += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${col}"/>`;
      x += w;
    }
  });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>${s}</svg>`;
  // encodeURIComponent 不会转义单引号，必须手动替换，否则 data-uri 里的 ' 会截断 CSS url('...')
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}`;
}

/* ---------- 寿宴步骤1背景：主角团横版卷轴小世界（爬山→雨林→海边日落） ---------- */
let vaSpriteTimer = null;
let venueAnimRendered = false;
let venueAnimDirty = false;
function renderVenueAnim(tries = 0) {
  const host = document.getElementById('venue-anim');
  if (!host) return;
  if (venueAnimRendered && !venueAnimDirty) return;
  // 场景/步骤可能尚未展开（幕布切换约300ms），等拿到真实尺寸再布局（上限约4秒防空转）
  const r = host.parentElement.getBoundingClientRect();
  if (r.height < 10) {
    if (tries < 240) requestAnimationFrame(() => renderVenueAnim(tries + 1));
    return;
  }
  venueAnimRendered = true;
  venueAnimDirty = false;

  const W = Math.max(280, Math.round(r.width));
  const H = Math.max(380, Math.round(r.height));
  host.innerHTML = '';
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* --- 卷轴世界：两份相同的 [爬山|雨林|日落] 拼条，位移 -50% 实现无缝循环 --- */
  const zw = Math.round(W / 3);             // 单个主题区宽
  const gy = Math.round(H * 0.78);          // 地面线
  const seaTop = gy - Math.round(H * 0.16); // 日落区海平线
  const gColors = ['#74c048', '#2d8a46', '#f7e3b0']; // 草地/雨林地表/沙滩

  const pine = (tx, th) => {
    const w = th * 0.62;
    return `<rect x="${tx - 2}" y="${gy - th * 0.26}" width="4" height="${th * 0.26}" fill="#6b4f2a"/>`
      + `<polygon points="${tx - w / 2},${gy - th * 0.24} ${tx},${gy - th * 0.72} ${tx + w / 2},${gy - th * 0.24}" fill="#2d6a4f"/>`
      + `<polygon points="${tx - w * 0.42},${gy - th * 0.58} ${tx},${gy - th} ${tx + w * 0.42},${gy - th * 0.58}" fill="#3b7a5a"/>`;
  };

  /* 区块1：爬山（远山、雪顶近山、山顶红旗、松树） */
  function zoneMountain(x0) {
    let s = '';
    [[0.02, 0.40, 0.34], [0.22, 0.55, 0.40], [0.48, 0.36, 0.30], [0.70, 0.52, 0.36]].forEach(([fx, fh, fw]) => {
      const px = x0 + fx * zw, ph = fh * (gy - seaTop);
      s += `<polygon points="${px},${gy} ${px + zw * fw / 2},${gy - ph} ${px + zw * fw},${gy}" fill="#8a97d6" opacity=".65"/>`;
    });
    [[0.10, 0.72, 0.38], [0.42, 0.95, 0.46], [0.74, 0.66, 0.34]].forEach(([fx, fh, fw], i) => {
      const px = x0 + fx * zw, ph = fh * (gy - seaTop), peak = gy - ph, half = zw * fw / 2;
      s += `<polygon points="${px},${gy} ${px + half},${peak} ${px + 2 * half},${gy}" fill="#6f7fc4"/>`;
      s += `<polygon points="${px + half},${peak} ${px + half * 1.3},${peak + ph * 0.2} ${px + half * 0.7},${peak + ph * 0.2}" fill="#fff" opacity=".9"/>`;
      if (i === 1) { // 最高峰插一面小红旗
        s += `<rect x="${px + half - 1}" y="${peak - 15}" width="2" height="15" fill="#5a4632"/>`
          + `<polygon points="${px + half + 1},${peak - 15} ${px + half + 14},${peak - 11} ${px + half + 1},${peak - 7}" fill="#ff5a5a"/>`;
      }
    });
    [0.04, 0.30, 0.58, 0.88].forEach(ft => { s += pine(x0 + ft * zw, rnd(28, 44)); });
    for (let i = 0; i < 6; i++) s += `<rect x="${(x0 + rnd(0.04, 0.92) * zw).toFixed(1)}" y="${gy + rnd(8, 26)}" width="3" height="5" fill="#57a83a" opacity=".8"/>`;
    return s;
  }

  /* 区块2：热带雨林（树冠、树干、垂藤、灌木） */
  function zoneRainforest(x0) {
    let s = '';
    const greens = ['#2d8a46', '#3aa655', '#45c05c'];
    [[0.14, 0.20, 26], [0.32, 0.13, 32], [0.52, 0.18, 28], [0.76, 0.11, 34], [0.92, 0.22, 24]].forEach(([fx, fy, rr], i) => {
      const cx = x0 + fx * zw, cy = gy - fy * H;
      s += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${greens[i % 3]}"/>`
        + `<circle cx="${cx - rr * 0.55}" cy="${cy + 7}" r="${rr * 0.66}" fill="${greens[(i + 1) % 3]}" opacity=".92"/>`
        + `<circle cx="${cx + rr * 0.5}" cy="${cy + 9}" r="${rr * 0.55}" fill="${greens[(i + 2) % 3]}" opacity=".85"/>`;
    });
    [0.32, 0.52, 0.76].forEach(fx => {
      s += `<rect x="${x0 + fx * zw - 4}" y="${gy - H * 0.13}" width="8" height="${H * 0.13}" rx="3" fill="#6b4f2a"/>`;
    });
    [0.18, 0.44, 0.64, 0.90].forEach(fx => {
      const vx = x0 + fx * zw, len = rnd(34, 66);
      s += `<path d="M ${vx} ${gy - H * 0.2} q 5 ${len / 2} 0 ${len}" stroke="#3aa655" stroke-width="2.5" fill="none"/>`
        + `<circle cx="${vx}" cy="${gy - H * 0.2 + len}" r="4.5" fill="#45c05c"/>`;
    });
    [0.08, 0.38, 0.60, 0.84].forEach(fx => {
      s += `<ellipse cx="${x0 + fx * zw}" cy="${gy - 5}" rx="${rnd(15, 23).toFixed(1)}" ry="${rnd(9, 13).toFixed(1)}" fill="#2d8a46"/>`;
    });
    return s;
  }

  /* 区块3：海边日落（暖色天空、落日、海面波光、椰树、沙滩） */
  function zoneSunset(x0) {
    let s = '';
    s += `<rect x="${x0}" y="0" width="${zw}" height="${seaTop}" fill="url(#vaSunset)"/>`;
    const scx = x0 + zw * 0.5;
    s += `<circle cx="${scx}" cy="${seaTop + 2}" r="${(H * 0.16).toFixed(1)}" fill="#ffe08a" opacity=".4"/>`
      + `<circle cx="${scx}" cy="${seaTop + 2}" r="${(H * 0.085).toFixed(1)}" fill="#ffd76a"/>`;
    s += `<rect x="${x0}" y="${seaTop}" width="${zw}" height="${gy - seaTop}" fill="#3fb8b8"/>`;
    for (let i = 0; i < 7; i++) {
      s += `<rect x="${(x0 + rnd(0.08, 0.72) * zw).toFixed(1)}" y="${(seaTop + (gy - seaTop) * (0.18 + 0.11 * i)).toFixed(1)}" width="${rnd(10, 26).toFixed(1)}" height="3" rx="1.5" fill="#c9f2f0" opacity="${rnd(0.5, 0.9).toFixed(2)}"/>`;
    }
    [0.14, 0.88].forEach((fx, i) => {
      const tx = x0 + fx * zw, th = rnd(48, 62), lean = i ? -7 : 7, topX = tx + lean * 1.6, ty = gy - th;
      s += `<path d="M ${tx} ${gy} q ${lean} ${-th / 2} ${lean * 1.6} ${-th}" stroke="#6b4f2a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      for (let k = 0; k < 5; k++) {
        const ang = (k / 4) * Math.PI - Math.PI / 2 + (i ? -0.25 : 0.25);
        const ex = topX + Math.cos(ang) * 15, ey = ty + Math.sin(ang) * 9;
        s += `<ellipse cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" rx="14" ry="5" fill="${k % 2 ? '#2d8a46' : '#3aa655'}" transform="rotate(${(ang * 180 / Math.PI).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)})"/>`;
      }
      s += `<circle cx="${topX - 4}" cy="${ty + 4}" r="3" fill="#6b4f2a"/><circle cx="${topX + 4}" cy="${ty + 5}" r="3" fill="#6b4f2a"/>`;
    });
    for (let i = 0; i < 6; i++) s += `<rect x="${(x0 + rnd(0.05, 0.90) * zw).toFixed(1)}" y="${gy + rnd(8, 30)}" width="4" height="3" rx="1" fill="#e6cd8e" opacity=".8"/>`;
    return s;
  }

  const W2 = W * 2;
  let svg = `<svg viewBox="0 0 ${W2} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">`
    + `<defs><linearGradient id="vaSunset" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0" stop-color="#ff9a5a"/><stop offset=".55" stop-color="#ffc46b"/><stop offset="1" stop-color="#ffd9a0"/>`
    + `</linearGradient></defs>`;
  for (let i = 0; i < 6; i++) svg += `<rect x="${i * zw}" y="${gy}" width="${zw + 1}" height="${H - gy}" fill="${gColors[i % 3]}"/>`;
  for (let i = 0; i < 6; i++) {
    const x0 = i * zw, t = i % 3;
    svg += t === 0 ? zoneMountain(x0) : t === 1 ? zoneRainforest(x0) : zoneSunset(x0);
  }
  svg += '</svg>';
  const world = document.createElement('div');
  world.className = 'va-world';
  world.innerHTML = svg;
  host.appendChild(world);

  /* --- 像素云 ×3：慢速漂过天空 --- */
  [[8, 0.9, 40], [18, 1.25, 50], [30, 0.7, 58]].forEach(([top, sc, dur], i) => {
    const c = document.createElement('div');
    c.className = 'va-cloud';
    c.style.top = top + '%';
    c.style.setProperty('--travel', `${W + 180}px`);
    c.style.setProperty('--cs', sc);
    c.style.setProperty('--cd', `${dur}s`);
    c.style.animationDelay = `${-(dur * i * 0.37 + rnd(0, 5)).toFixed(2)}s`;
    host.appendChild(c);
  });

  /* --- 主角团 ×4：在地面线上原地蹦跳“前进” --- */
  const team = document.createElement('div');
  team.className = 'va-team';
  MAIN_IDS.forEach((id, i) => {
    const c = CHARACTERS.find(x => x.id === id);
    const wrap = document.createElement('div');
    wrap.className = 'va-hiker-wrap';
    wrap.style.setProperty('--d', `${(i * 0.14).toFixed(2)}s`); // 错峰起跳
    const hk = document.createElement('div');
    hk.className = 'va-hiker';
    hk.title = c.name;
    hk.style.borderColor = c.color;
    hk.style.backgroundImage = `url('${c.img}')`;          // 先显示原图占位
    getPixelated(c.img).then(u => {                        // 像素化完成后替换
      if (hk.isConnected) hk.style.backgroundImage = `url('${u}')`;
    });
    const sh = document.createElement('div');
    sh.className = 'va-shadow';
    wrap.append(hk, sh);
    team.appendChild(wrap);
  });
  host.appendChild(team);

  /* --- 角落像素小精灵 ×4：地标/小动物卡，定时轮换登场 --- */
  const spots = [
    { left: '3%',   top: '6%',  rot: -6 },
    { left: '34%',  top: '3%',  rot: 4 },
    { right: '26%', top: '5%', rot: -4 },
    { right: '4%',  top: '10%', rot: 6 },
  ];
  const order = VA_SPRITES.map((_, i) => i);
  const shuffle = () => {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  };
  shuffle();
  const cards = spots.map((pos, i) => {
    const sp = VA_SPRITES[order[i]];
    const el = document.createElement('div');
    el.className = 'va-sprite';
    if (pos.left) el.style.left = pos.left;
    if (pos.right) el.style.right = pos.right;
    el.style.top = pos.top;
    el.style.setProperty('--rot', pos.rot + 'deg');
    el.style.animationDelay = `${-1.8 * i}s`;
    el.innerHTML = `<div class="va-sprite-img" style="background-image:url('${buildVaSprite(sp)}')"></div><span>${sp.name}</span>`;
    host.appendChild(el);
    return el;
  });
  // 每 6 秒随机换一张卡：淡出 → 换精灵 → 淡入，9 个小精灵轮番登场
  let next = 4;
  clearInterval(vaSpriteTimer);
  vaSpriteTimer = setInterval(() => {
    if (next >= order.length) { shuffle(); next = 0; }
    const sp = VA_SPRITES[order[next++]];
    const card = cards[Math.floor(Math.random() * cards.length)];
    card.style.opacity = '0';
    setTimeout(() => {
      if (!card.isConnected) return;
      card.querySelector('.va-sprite-img').style.backgroundImage = `url('${buildVaSprite(sp)}')`;
      card.querySelector('span').textContent = sp.name;
      card.style.opacity = '1';
    }, 450);
  }, 6000);
}

/* 窗口尺寸变化时重建卷轴（仅寿宴场景激活时；不在选场地步骤则标记待重建） */
let venueResizeTimer = null;
window.addEventListener('resize', () => {
  if (!venueAnimRendered || !document.getElementById('scene-banquet').classList.contains('active')) return;
  clearTimeout(venueResizeTimer);
  venueResizeTimer = setTimeout(() => {
    venueAnimDirty = true;
    const vb = document.querySelector('.bstep[data-step="venue"]');
    if (vb && !vb.classList.contains('hidden')) renderVenueAnim();
  }, 300);
});

/* ---------- 场景 4：坏女孩寿宴 ---------- */
function banquetStep(name) {
  document.querySelectorAll('.bstep').forEach(b => b.classList.toggle('hidden', b.dataset.step !== name));
}
function startBanquet() {
  /* 场景锁链已解除：#banquet 也可直达 */
  show('scene-banquet');
  state.selectedChars = [];
  state.venue = null;
  const bg = document.getElementById('banquet-bg');
  bg.classList.remove('show');
  bg.style.backgroundImage = '';
  document.querySelectorAll('.venue').forEach(b => b.classList.remove('sel'));
  // 重置各环节状态，保证重复进入流程从头走
  clearTimeout(speechTimer);
  document.getElementById('btn-speech-done').classList.add('hidden');
  const cake = document.getElementById('cake');
  cake.classList.remove('lit', 'blown');
  document.getElementById('cake-hint').textContent = '点一下蛋糕，点燃蜡烛';
  document.getElementById('btn-blow').classList.add('hidden');
  document.getElementById('btn-lights-off').classList.add('hidden');
  document.getElementById('寿星-msg').textContent = '寿星就位';
  document.getElementById('bless-bubbles').innerHTML = '';
  document.getElementById('btn-bless-done').classList.add('hidden');
  const env = document.getElementById('envelope');
  env.classList.remove('open', 'folded', 'fly');
  document.getElementById('seal').classList.add('hidden');
  document.getElementById('letter-hint').textContent = '点击信封，拆开坏女孩的愿望';
  document.getElementById('btn-letter-done').classList.add('hidden');
  letterPhase = 0;
  banquetStep('venue');
  renderVenueAnim();
}

/* 步骤 1：选场地 */
document.querySelectorAll('.venue').forEach(btn => {
  btn.addEventListener('click', () => {
    Audio8bit.sfx.flip();
    document.querySelectorAll('.venue').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    state.venue = btn.dataset.venue;
    // 宿舍：开门大吉猜歌挑战；望宝川：别笑挑战（计算题 + 夹黑头）；研究生院：四人欢乐斗地主
    if (state.venue === 'dorm') { startKtkGame(); return; }
    if (state.venue === 'wangbaochuan') { startWbcGame(); return; }
    if (state.venue === 'graduate') { startDdzGame(); return; }
    enterVenueScene();
  });
});
/* 选完场地 → 显示场地背景并进入宾客点名 */
function enterVenueScene() {
  const bg = document.getElementById('banquet-bg');
  bg.style.backgroundImage = `url('assets/venue-${state.venue}.jpg')`;
  bg.classList.add('show');
  setTimeout(() => {
    renderCharGrid();
    banquetStep('chars');
  }, 350);
}

/* ---------- 宿舍挑战 · 开门大吉（三关） ---------- */
/* 每关旋律按简谱校准，'R'=休止符；如需校准改数组即可 */

/* 第一关《雨爱》主歌（1=E，4/4：从「窗外的天气」开始，到「下雨了」）
   谱面：3 1 6̣ 7̣ 1 | 3 – 0 5 5. | 3 0. 5 3 2 1 2 7̣ | 7̣ 0 0 1 7̣ 6̣（6̣7̣为低八度）64BPM ≈ 15s */
const YU_AI_VERSE = [
  ['G#4',1],['E4',1],['C#4',.5],['D#4',.5],['E4',1],           // 窗 外 的 天 气
  ['G#4',2],['R',.5],['B4',.5],['B4',1],                        // 气～（延音） 就 像
  ['G#4',1],['R',.5],['B4',.5],['G#4',.5],['F#4',.5],['E4',.5],['F#4',.25],['D#4',.25],  // 是 你 多 变 的 表 情
  ['D#4',1],['R',.5],['R',.5],['E4',.5],['D#4',.5],['C#4',1],   // （情） 下 雨 了
];

/* 第二关《加油》主歌（1=C 移调：「最近你好吗 少了一点微笑 说的话有点少」×2）104BPM ≈ 16s */
const JIA_YOU_VERSE = [
  ['G4',.5],['C5',.5],['C5',1],['B4',.5],['B4',.5],['C5',.5],['C5',.5],
  ['C5',.5],['B4',.5],['C5',.5],['C5',.5],['B4',.5],['C5',.5],['C5',1],
  ['D5',.5],['E5',.5],['E5',.5],['D5',.5],['C5',2],
  ['G4',.5],['C5',.5],['C5',1],['B4',.5],['B4',.5],['C5',.5],['C5',.5],
  ['C5',.5],['B4',.5],['C5',.5],['C5',.5],['B4',.5],['C5',.5],['C5',1],
  ['D5',.5],['E5',.5],['E5',.5],['D5',.5],['C5',1],['B4',.5],['A4',.5],
  ['G4',.5],['A4',.5],['B4',.5],['C5',2.5],
];

/* 第三关《阿楚姑娘》主歌（1=C 移调：「在距离城市很远的地方…彼此相依一起看月亮」）95BPM ≈ 20s */
const A_CHU_VERSE = [
  ['G4',.25],['A4',.25],['G4',.25],['A4',.25],['G4',.25],['A4',.25],['D5',.5],
  ['D5',.5],['C5',.5],['C5',.5],['G4',.5],['R',.5],['G4',.5],['G4',.5],['A4',.5],
  ['C5',.5],['A4',.5],['G4',.5],['D5',.5],['C5',.5],['A4',.5],['A4',.5],['C5',.5],
  ['G4',.25],['G4',.25],['F4',.25],['G4',.25],['F4',.25],['G4',.25],['D5',.5],
  ['D5',.5],['C5',.5],['C5',.5],['G4',.5],['R',.5],['G4',.5],['G4',.5],['A4',.5],
  ['C5',.5],['A4',.5],['G4',.5],['D5',.5],['C5',.5],['G4',.5],['D5',.5],['C5',.5],
  ['C5',2],
  ['D5',.5],['F5',.5],['D5',.5],['F5',.5],['F5',1],['D5',1],
  ['F5',.5],['G5',.5],['G5',.5],['D5',.5],['R',.5],['C5',.5],['D5',.5],['A4',.5],
  ['C5',2],
];

/* 三关配置：旋律 / 选项 / 场外求助话术 */
const KTK_LEVELS = [
  {
    no: '一',
    melody: YU_AI_VERSE, bpm: 64,
    options: [
      { label: '雨鞋', note: '红楼梦里吴皇穿过的那双', correct: false },
      { label: '雨帽', note: '指一个透明塑料袋子',     correct: false },
      { label: '雨天', note: '我能体谅～',            correct: false },
      { label: '雨爱', note: '应该不是正确答案',       correct: true  },
    ],
    contacts: {
      prince:  '我也不知道呀，但是你想和我一起打篮球吗？',
      emperor: '莎，猪。当然选雨帽。',
      guoshi:  '好呀莎，我觉得答案应该是雨鞋。',
    },
  },
  {
    no: '二',
    melody: JIA_YOU_VERSE, bpm: 104,
    options: [
      { label: '加麻加辣不加葱！', correct: false },
      { label: '加宝！',           correct: false },
      { label: '加黑头！',         correct: false },
      { label: '加油！',           correct: true  },
    ],
    contacts: {
      prince:  '上一把是我大意了，这个肯定是加宝！',
      emperor: '何时总来叨扰朕，怒！',
      guoshi:  '我也喜欢加油！选这个！',
    },
  },
  {
    no: '三',
    melody: A_CHU_VERSE, bpm: 95,
    options: [
      { label: '阿莎姑娘', correct: true  },
      { label: '阿吴姑娘', correct: false },
      { label: '阿怡姑娘', correct: false },
      { label: '阿宝姑娘', correct: false },
    ],
    contacts: {
      prince:  '毋庸置疑，阿莎姑娘',
      emperor: '毫无疑问，阿莎姑娘',
      guoshi:  '理所应当，阿莎姑娘',
    },
  },
];
const ktk = { phase: 'idle', level: 0, skills: { replay: false, hint: false, help: false }, usedContacts: {}, timers: [] };

function ktkT(fn, ms) { ktk.timers.push(setTimeout(fn, ms)); }
function ktkClearTimers() { ktk.timers.forEach(clearTimeout); ktk.timers = []; }

function ktkEl(id) { return document.getElementById(id); }
function ktkBubble(text, ms = 2600) {
  const b = ktkEl('ktk-bubble');
  b.textContent = text;
  b.classList.remove('hidden');
  ktkT(() => b.classList.add('hidden'), ms);
}

/* 重置当前关（level=0 时连规则一起重置，用于全新开局） */
function resetKtkRound() {
  ktkClearTimers();
  ktk.phase = 'rules';
  ktk.skills = { replay: false, hint: false, help: false };
  ktk.usedContacts = {};
  if (ktk.level === 0) ktkEl('ktk-rules').querySelectorAll('p').forEach(p => p.classList.remove('show'));
  ktkEl('ktk-bell').classList.add('hidden');
  ktkEl('ktk-playing').classList.add('hidden');
  ktkEl('ktk-options').innerHTML = '';
  ktkEl('ktk-skills').classList.add('locked');
  ktkEl('ktk-skills').querySelectorAll('.ktk-skill').forEach(b => b.classList.remove('used'));
  document.querySelectorAll('.kph-contact').forEach(b => b.classList.remove('used'));
  ktkEl('ktk-cheat').classList.add('hidden');
  const stamp = ktkEl('ktk-stamp');
  stamp.className = 'ktk-stamp';
  stamp.textContent = '笨';
  ktkEl('ktk-bubble').classList.add('hidden');
  ktkEl('ktk-next').classList.add('hidden');
  ktkEl('ktk-pig').className = 'ktk-pig hidden';
  ktkEl('ktk-phone').classList.add('hidden');
  ktkEl('kph-contacts').classList.add('hidden');
  ktkEl('kph-talk').classList.add('hidden');
  ktkEl('ktk-doors').classList.remove('hidden');
  ktkEl('ktk-rules').classList.remove('hidden');
  ktkEl('ktk-title').classList.remove('hidden');
  ktkEl('ktk-title').textContent = `【开门大吉 · 第${KTK_LEVELS[ktk.level].no}关】`;
}

/* 点宿舍 → 转场 → 进入开门大吉（第一关） */
function startKtkGame() {
  Audio8bit.stopBGM();            // 挑战期间暂停背景音乐，避免干扰听旋律
  ktk.level = 0;
  resetKtkRound();
  ktkEl('ktk-intro-line').innerHTML = '【通过以下挑战<br>即可解锁该场景】';
  const intro = ktkEl('ktk-intro');
  const game = ktkEl('ktk-game');
  intro.classList.remove('hidden');
  ktkT(() => {
    intro.classList.add('hidden');
    game.classList.remove('hidden');
    playKtkRules();
  }, 2200);
}

/* 规则逐行缓缓飘出，完毕后亮出门铃 */
function playKtkRules() {
  const lines = ktkEl('ktk-rules').querySelectorAll('p');
  lines.forEach((p, i) => ktkT(() => { p.classList.add('show'); Audio8bit.sfx.tap(); }, 700 + i * 850));
  ktkT(() => {
    ktkEl('ktk-bell').classList.remove('hidden');
    ktk.phase = 'ready';
    Audio8bit.sfx.pop();
  }, 700 + lines.length * 850 + 500);
}

/* 按响门铃 → 叮咚 + 大门抖动 → 播放《雨爱》前奏 → 出选项 */
ktkEl('ktk-bell').addEventListener('click', () => {
  if (ktk.phase !== 'ready') return;
  ktk.phase = 'playing';
  ktkEl('ktk-bell').classList.add('hidden');
  Audio8bit.sfx.dingdong();
  const door = document.querySelector('.ktk-door.center');
  door.classList.add('ringing');
  ktkT(() => door.classList.remove('ringing'), 1000);
  ktkT(() => {
    ktkEl('ktk-playing').classList.remove('hidden');
    const L = KTK_LEVELS[ktk.level];
    Audio8bit.playMelody(L.melody, L.bpm, () => {
      ktkEl('ktk-playing').classList.add('hidden');
      ktk.phase = 'options';
      ktkEl('ktk-skills').classList.remove('locked');
      showKtkOptions();
    }, 'square', 0.16);
  }, 900);
});

/* 选项逐个出现 */
function showKtkOptions() {
  const box = ktkEl('ktk-options');
  KTK_LEVELS[ktk.level].options.forEach((o, i) => {
    ktkT(() => {
      const el = document.createElement('button');
      el.className = 'ktk-opt show';
      el.innerHTML = `<span class="opt-label">${o.label}</span>${o.note ? `<span class="opt-note">${o.note}</span>` : ''}`;
      el.addEventListener('click', () => pickKtkOption(el, o));
      box.appendChild(el);
      Audio8bit.sfx.tap();
    }, i * 450);
  });
}

/* 选择答案：错→盖章「笨」+ 选项变暗；对→盖章「真棒！」+ 下一关 / 完成 */
function pickKtkOption(el, o) {
  if (ktk.phase !== 'options' || el.classList.contains('dim')) return;
  const stamp = ktkEl('ktk-stamp');
  if (!o.correct) {
    Audio8bit.sfx.wrong();
    el.classList.add('dim');
    stamp.textContent = '笨';
    stamp.className = 'ktk-stamp bad show';
    ktkT(() => stamp.classList.remove('show'), 1300);
    ktkBubble('不对哦～再想想，继续选择');
  } else {
    ktk.phase = 'result';
    Audio8bit.sfx.fanfare();
    stamp.textContent = '真棒！';
    stamp.className = 'ktk-stamp good show';
    ktkT(() => {
      stamp.classList.remove('show');
      const last = ktk.level >= KTK_LEVELS.length - 1;
      ktkEl('btn-ktk-next').textContent = last ? '挑战成功 · 去入席' : `进入第${KTK_LEVELS[ktk.level + 1].no}关`;
      ktkEl('ktk-next').classList.remove('hidden');
    }, 1500);
  }
}

/* 三个技能：各限一次 */
/* 小猪：stay=true 原地出现并留下；stay=false 哼哼哼地跑开 */
function showKtkPig(stay) {
  const pig = ktkEl('ktk-pig');
  pig.className = 'ktk-pig show';
  if (stay) {
    Audio8bit.sfx.pop();
  } else {
    Audio8bit.sfx.oink();
    ktkT(() => pig.classList.add('run'), 650);
    ktkT(() => { pig.className = 'ktk-pig hidden'; }, 2400);
  }
}

/* 场外求助：坏女孩拿起电话 → 三位亲友逐个选（选过的变灰）
   全部问过前，角落有个不起眼的【点我作弊】可以再进电话 */
const KTK_CONTACT_META = {
  prince:  { name: '王子', img: 'assets/prince_face.png'  },
  emperor: { name: '吴皇', img: 'assets/emperor_face.png' },
  guoshi:  { name: '国师', img: 'assets/guoshi_face.png'  },
};
function openKtkPhone() {
  ktkEl('kph-avatar').style.backgroundImage = 'url(assets/badgirl_face.png)';
  ktkEl('kph-status').textContent = '📞 坏女孩拿起了电话……';
  ktkEl('kph-contacts').classList.add('hidden');
  ktkEl('kph-talk').classList.add('hidden');
  ktkEl('ktk-phone').classList.remove('hidden');
  Audio8bit.sfx.ring();
  ktkT(() => ktkEl('kph-contacts').classList.remove('hidden'), 900);
}
document.querySelectorAll('.kph-contact').forEach(b => {
  b.addEventListener('click', () => {
    const key = b.dataset.contact;
    if (ktk.usedContacts[key]) return;
    const meta = KTK_CONTACT_META[key];
    Audio8bit.sfx.pop();
    ktk.usedContacts[key] = true;
    b.classList.add('used');
    ktkEl('kph-contacts').classList.add('hidden');
    ktkEl('kph-status').textContent = '📞 通话中……';
    ktkEl('kph-talk-avatar').style.backgroundImage = `url(${meta.img})`;
    ktkEl('kph-talk-name').textContent = `【${meta.name}】`;
    ktkEl('kph-talk-line').textContent = KTK_LEVELS[ktk.level].contacts[key];
    ktkEl('kph-talk').classList.remove('hidden');
  });
});
ktkEl('kph-hangup').addEventListener('click', () => {
  Audio8bit.sfx.tap();
  ktkEl('ktk-phone').classList.add('hidden');
  // 挂断后：还有没问过的人 → 亮出不起眼的作弊小按钮
  const remaining = Object.keys(KTK_CONTACT_META).filter(k => !ktk.usedContacts[k]);
  if (remaining.length > 0) ktkEl('ktk-cheat').classList.remove('hidden');
  else ktkEl('ktk-cheat').classList.add('hidden');
});
ktkEl('ktk-cheat').addEventListener('click', () => {
  Audio8bit.sfx.tap();
  openKtkPhone();
});

document.querySelectorAll('.ktk-skill').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.skill;
    if (ktk.phase !== 'options' || ktk.skills[key]) return;
    ktk.skills[key] = true;
    btn.classList.add('used');
    if (key === 'replay') {
      // 原音重现：重播旋律，并出现一只小猪
      showKtkPig(true);
      ktk.phase = 'playing';
      ktkEl('ktk-playing').classList.remove('hidden');
      const L = KTK_LEVELS[ktk.level];
      Audio8bit.playMelody(L.melody, L.bpm, () => {
        ktkEl('ktk-playing').classList.add('hidden');
        ktk.phase = 'options';
      }, 'square', 0.16);
    } else if (key === 'hint') {
      // 关键字提示：出现一只小猪，哼哼哼地跑开
      showKtkPig(false);
    } else {
      // 场外求助：坏女孩打电话问亲友
      openKtkPhone();
    }
  });
});

/* 下一关 / 三关全部通过 */
ktkEl('btn-ktk-next').addEventListener('click', () => {
  Audio8bit.sfx.flip();
  ktkEl('ktk-next').classList.add('hidden');
  if (ktk.level >= KTK_LEVELS.length - 1) { closeKtkGame(); return; }
  // 关卡转场：复用 intro 层显示【第N关】
  ktkEl('ktk-pig').className = 'ktk-pig hidden';
  ktkEl('ktk-phone').classList.add('hidden');
  ktkEl('ktk-game').classList.add('hidden');
  ktkEl('ktk-intro-line').innerHTML = `【第${KTK_LEVELS[ktk.level + 1].no}关】`;
  const intro = ktkEl('ktk-intro');
  intro.classList.remove('hidden');
  ktkT(() => {
    intro.classList.add('hidden');
    ktk.level++;
    resetKtkRound();                 // 每关重置技能与场外求助（规则不再重播）
    ktkEl('ktk-game').classList.remove('hidden');
    ktkEl('ktk-bell').classList.remove('hidden');
    ktk.phase = 'ready';
    Audio8bit.sfx.pop();
  }, 1600);
});

/* 结束挑战，回到寿宴流程（入席） */
function closeKtkGame() {
  ktkClearTimers();
  ktk.phase = 'idle';
  ktkEl('ktk-game').classList.add('hidden');
  Audio8bit.startBGM();
  enterVenueScene();
}
ktkEl('ktk-close').addEventListener('click', closeKtkGame);
ktkEl('ktk-skip').addEventListener('click', closeKtkGame);

/* ---------- 望宝川 · 别笑挑战（第一关计算题 + 第二关黑头挑战） ---------- */
const WBC_Q1 = {
  opts: [
    { label: '3',   correct: false },
    { label: '5',   correct: false },
    { label: '6',   correct: true  },
    { label: '343', correct: false },
  ],
};
const wbc = { phase: 'idle', left: 4, timers: [] };
function wbcT(fn, ms) { wbc.timers.push(setTimeout(fn, ms)); }
function wbcClearTimers() { wbc.timers.forEach(clearTimeout); wbc.timers = []; }

/* 点望宝川 → 转场 → 别笑挑战 */
function startWbcGame() {
  Audio8bit.stopBGM();              // 挑战期间暂停背景音乐
  wbcClearTimers();
  wbc.phase = 'intro';
  wbc.left = 4;
  ktkEl('wbc-title').textContent = '【别笑 · 第一关】';
  ktkEl('wbc-quiz').classList.remove('hidden');
  ktkEl('wbc-heito').classList.add('hidden');
  ktkEl('wbc-opts').innerHTML = '';
  ktkEl('wbc-count').textContent = '待夹黑头数：4/4';
  document.querySelectorAll('.wbc-dot').forEach(d => d.classList.remove('pulling', 'pulled'));
  ktkEl('wbc-arrow').classList.add('hidden');
  ktkEl('wbc-stamp').className = 'ktk-stamp';
  ktkEl('wbc-next').classList.add('hidden');
  // 转场复用开门大吉的 intro 层
  ktkEl('ktk-intro-line').innerHTML = '【通过以下挑战<br>即可解锁该场景】';
  const intro = ktkEl('ktk-intro');
  intro.classList.remove('hidden');
  wbcT(() => {
    intro.classList.add('hidden');
    if (wbc.phase !== 'intro') return;   // 期间被关闭则不进入
    ktkEl('wbc-game').classList.remove('hidden');
    wbc.phase = 'quiz';
    Audio8bit.sfx.pop();
    wbcT(showWbcOpts, 400);
  }, 2200);
}

/* 第一关选项逐个出现 */
function showWbcOpts() {
  const box = ktkEl('wbc-opts');
  WBC_Q1.opts.forEach((o, i) => {
    wbcT(() => {
      const el = document.createElement('button');
      el.className = 'ktk-opt show';
      el.innerHTML = `<span class="opt-label">${o.label}</span>`;
      el.addEventListener('click', () => pickWbcOpt(el, o));
      box.appendChild(el);
      Audio8bit.sfx.tap();
    }, i * 350);
  });
}

/* 第一关作答：错→盖章「笨」+变暗；对→进入第二关黑头挑战 */
function pickWbcOpt(el, o) {
  if (wbc.phase !== 'quiz' || el.classList.contains('dim')) return;
  const stamp = ktkEl('wbc-stamp');
  if (!o.correct) {
    Audio8bit.sfx.wrong();
    el.classList.add('dim');
    stamp.textContent = '笨';
    stamp.className = 'ktk-stamp bad show';
    wbcT(() => stamp.classList.remove('show'), 1300);
  } else {
    wbc.phase = 'toHeito';
    Audio8bit.sfx.fanfare();
    stamp.textContent = '真棒！';
    stamp.className = 'ktk-stamp good show';
    wbcT(() => {
      stamp.classList.remove('show');
      ktkEl('wbc-quiz').classList.add('hidden');
      ktkEl('wbc-heito').classList.remove('hidden');
      ktkEl('wbc-title').textContent = '【别笑 · 第二关 · 黑头挑战】';
      wbc.phase = 'heito';
    }, 1500);
  }
}

/* 第二关：点击黑点 → 缓慢拔出（顶端冒出白色脂肪根）→ 计数-1 */
document.querySelectorAll('.wbc-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    if (wbc.phase !== 'heito' || dot.classList.contains('pulling') || dot.classList.contains('pulled')) return;
    dot.classList.add('pulling');
    Audio8bit.sfx.pluck();
    wbcT(() => {
      dot.classList.remove('pulling');
      dot.classList.add('pulled');
      wbc.left--;
      ktkEl('wbc-count').textContent = `待夹黑头数：${wbc.left}/4`;
      if (wbc.left > 0) Audio8bit.sfx.pop();
      else wbcWin();
    }, 1150);
  });
});

/* 六根全拔出 → 挑战成功 */
function wbcWin() {
  wbc.phase = 'done';
  Audio8bit.sfx.fanfare();
  const stamp = ktkEl('wbc-stamp');
  stamp.textContent = '真棒！';
  stamp.className = 'ktk-stamp good show';
  ktkEl('wbc-arrow').classList.add('hidden');
  wbcT(() => {
    stamp.classList.remove('show');
    ktkEl('wbc-next').classList.remove('hidden');
  }, 1500);
}

/* 帮我作弊：箭头指向一根还没拔的黑头 */
ktkEl('wbc-cheat').addEventListener('click', () => {
  if (wbc.phase !== 'heito') return;
  const rest = [...document.querySelectorAll('.wbc-dot')]
    .filter(d => !d.classList.contains('pulling') && !d.classList.contains('pulled'));
  if (!rest.length) return;
  Audio8bit.sfx.tap();
  const d = rest[Math.floor(Math.random() * rest.length)];
  const arrow = ktkEl('wbc-arrow');
  arrow.style.left = d.style.left;
  arrow.style.top = `calc(${d.style.top} - 26px)`;
  arrow.classList.remove('hidden', 'blink');
  void arrow.offsetWidth;            // 重启闪动动画
  arrow.classList.add('blink');
  wbcT(() => arrow.classList.add('hidden'), 2600);
});

/* 结束挑战（成功 / 跳过）→ 回到寿宴流程入席 */
function closeWbcGame() {
  wbcClearTimers();
  wbc.phase = 'idle';
  ktkEl('wbc-game').classList.add('hidden');
  ktkEl('ktk-intro').classList.add('hidden');
  Audio8bit.startBGM();
  enterVenueScene();
}
ktkEl('btn-wbc-next').addEventListener('click', () => { Audio8bit.sfx.flip(); closeWbcGame(); });
ktkEl('wbc-close').addEventListener('click', closeWbcGame);
ktkEl('wbc-skip').addEventListener('click', closeWbcGame);

/* ---------- 研究生院挑战 · 四人欢乐斗地主（脚本化模拟：坏女孩组必有神牌，主角队大赢特赢） ---------- */
/* 座位：0=发廊大师·左手  1=吴皇&国师  2=发廊大师·右手  3=坏女孩&王子
   阵营：主角队 = 1 + 3（四个主角两两分组，共计一个阵营）；发廊队 = 0 + 2（发廊大师一人占两队，共计一个阵营）
   规则：两副牌 4 人 2v2，每人 25 张 + 8 张底牌；人人初始 100w 欢乐豆；谁先出完谁的队赢 */
const DDZ_NAMES = ['发廊大师·左手', '吴皇 & 国师', '发廊大师·右手', '坏女孩 & 王子'];
const ddz = { phase: 'idle', mult: 1, timers: [] };
let DDZ_COUNTS = [25, 25, 25, 25];
function ddzEl(id) { return document.getElementById(id); }
function ddzT(fn, ms) { ddz.timers.push(setTimeout(fn, ms)); }
function ddzClearTimers() { ddz.timers.forEach(clearTimeout); ddz.timers = []; }

function ddzCardHtml(rank, suit) {
  const red = suit === '♥' || suit === '♦' || suit === '大';
  const joker = suit === '大' || suit === '小' ? ' joker' : '';
  return `<span class="pcard${red ? ' red' : ''}${joker}">${rank}<em>${suit}</em></span>`;
}
function ddzCardsHtml(cards) { return cards.map(([r, s]) => ddzCardHtml(r, s)).join(''); }
function ddzTurn(who) { [0, 1, 2, 3].forEach(i => ddzEl('ddz-seat-' + i).classList.toggle('turn', i === who)); }
function ddzSetMult(v) {
  ddz.mult = v;
  const m = ddzEl('ddz-mult');
  m.textContent = '倍数 ×' + v;
  m.classList.remove('bump'); void m.offsetWidth; m.classList.add('bump');
}
function ddzSay(who, text, ms = 2400) {
  const b = ddzEl('ddz-bubble-' + who);
  b.textContent = text;
  b.classList.remove('hidden');
  if (b._hideT) clearTimeout(b._hideT);
  b._hideT = setTimeout(() => b.classList.add('hidden'), ms);
}
function ddzShowPlayed(who, label, cards) {
  ddzEl('ddz-played').innerHTML =
    `<p class="ddz-play-who">${DDZ_NAMES[who]}${label ? ' · ' + label : ''}</p>` +
    (cards && cards.length ? `<div class="ddz-play-cards">${ddzCardsHtml(cards)}</div>` : '');
}
function ddzPlay(who, label, cards, say) {
  ddzShowPlayed(who, label, cards);
  if (say) ddzSay(who, say);
  if (cards && cards.length) {
    DDZ_COUNTS[who] = Math.max(0, DDZ_COUNTS[who] - cards.length);
    ddzEl('ddz-cards-' + who).textContent = DDZ_COUNTS[who];
  }
}

/* 点研究生院 → 转场 → 斗地主牌桌 */
function startDdzGame() {
  Audio8bit.stopBGM();
  ddzClearTimers();
  ddz.phase = 'intro';
  ddz.mult = 1;
  DDZ_COUNTS = [25, 25, 25, 25];
  ddzEl('ddz-mult').textContent = '倍数 ×1';
  ddzEl('ddz-phase').textContent = '四家欢乐豆 100w 起步';
  ddzEl('ddz-played').innerHTML = '<p class="ddz-play-hint">发牌后自动开始 · 坏女孩组必有神牌</p>';
  ddzEl('ddz-win').classList.add('hidden');
  ddzEl('ddz-rain').innerHTML = '';
  ddzEl('btn-ddz-deal').classList.remove('hidden');
  ddzEl('btn-ddz-skip').classList.add('hidden');
  [0, 1, 2, 3].forEach(i => {
    ddzEl('ddz-cards-' + i).textContent = 25;
    const beans = ddzEl('ddz-beans-' + i);
    beans.textContent = '100.0w';
    beans.classList.remove('up', 'down');
    ddzEl('ddz-bubble-' + i).classList.add('hidden');
    ddzEl('ddz-seat-' + i).classList.remove('turn', 'landlord');
  });
  ktkEl('ktk-intro-line').innerHTML = '【通过以下挑战<br>即可解锁该场景】';
  ktkEl('ktk-intro').classList.remove('hidden');
  ddzT(() => {
    ktkEl('ktk-intro').classList.add('hidden');
    if (ddz.phase !== 'intro') return;   // 期间被关闭则不进入
    ddzEl('ddz-game').classList.remove('hidden');
    ddz.phase = 'ready';
    Audio8bit.sfx.pop();
  }, 2200);
}

/* 发牌开局 → 自动播放整场对局（模拟：坏女孩组 3 分当地主，王炸护体，一路平推到清空手牌） */
function ddzDeal() {
  if (ddz.phase !== 'ready') return;
  ddz.phase = 'playing';
  Audio8bit.sfx.flip();
  ddzEl('btn-ddz-deal').classList.add('hidden');
  ddzEl('btn-ddz-skip').classList.remove('hidden');
  ddzEl('ddz-phase').textContent = '发牌中…… 每家 25 张 · 底牌 8 张';
  let t = 1500;
  /* 看牌：坏女孩组的手牌注定是神牌 */
  ddzT(() => { ddzTurn(3); ddzSay(3, '这牌……王炸 + 四个2 + 三个A，稳了！'); Audio8bit.sfx.pluck(); }, t); t += 2600;
  /* 叫分 */
  ddzT(() => { ddzTurn(0); ddzSay(0, '不叫'); Audio8bit.sfx.tap(); }, t); t += 1100;
  ddzT(() => { ddzTurn(1); ddzSay(1, '不叫，稳住搭档'); Audio8bit.sfx.tap(); }, t); t += 1100;
  ddzT(() => { ddzTurn(2); ddzSay(2, '2分！'); Audio8bit.sfx.pop(); }, t); t += 1100;
  ddzT(() => {
    ddzTurn(3); ddzSay(3, '3分！！地主我们当！');
    Audio8bit.sfx.fanfare(); ddzSetMult(3);
    ddzEl('ddz-phase').textContent = '坏女孩组 3 分当上地主 · 即将亮底牌';
    ddzEl('ddz-seat-3').classList.add('landlord');
    ddzEl('ddz-seat-1').classList.add('landlord');
  }, t); t += 2300;
  /* 亮底牌：两副炸弹直接进坏女孩组（25 + 8 = 33 张） */
  ddzT(() => {
    ddzPlay(3, '亮底牌：9999 + 6666，两副炸弹尽入坏女孩组',
      [['9', '♠'], ['9', '♥'], ['9', '♦'], ['9', '♣'], ['6', '♠'], ['6', '♥'], ['6', '♦'], ['6', '♣']], '底牌也归我们～');
    DDZ_COUNTS[3] = 33; ddzEl('ddz-cards-3').textContent = 33;
    Audio8bit.sfx.flip();
  }, t); t += 2400;
  /* 开打：顺子起手 */
  ddzT(() => { ddzTurn(3); ddzPlay(3, '顺子', [['4', '♠'], ['5', '♥'], ['6', '♦'], ['7', '♣'], ['8', '♠']], '一路顺过去！'); Audio8bit.sfx.tap(); }, t); t += 1300;
  ddzT(() => { ddzTurn(0); ddzSay(0, '要不起 😅'); Audio8bit.sfx.tap(); }, t); t += 750;
  ddzT(() => { ddzTurn(1); ddzSay(1, '要不起，搭档走！'); }, t); t += 750;
  ddzT(() => { ddzTurn(2); ddzPlay(2, '顺子', [['10', '♥'], ['J', '♠'], ['Q', '♦'], ['K', '♣'], ['A', '♠']], '发廊大师接住了！'); Audio8bit.sfx.tap(); }, t); t += 1300;
  /* 炸弹连击 */
  ddzT(() => { ddzTurn(3); ddzPlay(3, '炸弹 💣 倍数×2', [['2', '♠'], ['2', '♥'], ['2', '♦'], ['2', '♣']], '四个2先炸为敬！'); ddzSetMult(6); Audio8bit.sfx.whoosh(); }, t); t += 1500;
  ddzT(() => { ddzTurn(0); ddzSay(0, '要不起！'); }, t); t += 700;
  ddzT(() => { ddzTurn(1); ddzSay(1, '牛！'); }, t); t += 700;
  ddzT(() => { ddzTurn(2); ddzSay(2, '要不起……'); }, t); t += 700;
  ddzT(() => { ddzTurn(3); ddzPlay(3, '炸弹 💣 倍数×2', [['9', '♠'], ['9', '♥'], ['9', '♦'], ['9', '♣']], '底牌炸弹接着炸！'); ddzSetMult(12); Audio8bit.sfx.whoosh(); }, t); t += 1500;
  ddzT(() => { ddzTurn(0); ddzSay(0, '呜……'); }, t); t += 700;
  ddzT(() => { ddzTurn(1); ddzSay(1, '稳了稳了'); }, t); t += 700;
  ddzT(() => { ddzTurn(2); ddzPlay(2, '炸弹 💣 倍数×2', [['K', '♠'], ['K', '♥'], ['K', '♦'], ['K', '♣']], '发廊大师还有一手！'); ddzSetMult(24); Audio8bit.sfx.whoosh(); }, t); t += 1500;
  /* 王炸镇场 */
  ddzT(() => { ddzTurn(3); ddzPlay(3, '王炸 🚀 倍数×2', [['王', '小'], ['王', '大']], '天王盖地虎！！'); ddzSetMult(48); Audio8bit.sfx.whoosh(); Audio8bit.sfx.fanfare(); }, t); t += 2000;
  ddzT(() => { ddzTurn(0); ddzSay(0, '……'); }, t); t += 650;
  ddzT(() => { ddzTurn(1); ddzSay(1, '哈哈哈哈哈'); }, t); t += 650;
  ddzT(() => { ddzTurn(2); ddzSay(2, '大师认栽'); }, t); t += 650;
  /* 清空手牌：飞机 → 三带一 → 三带一 */
  ddzT(() => { ddzTurn(3); ddzPlay(3, '飞机带翅膀', [['5', '♠'], ['5', '♥'], ['5', '♦'], ['6', '♠'], ['6', '♥'], ['6', '♦'], ['J', '♠'], ['J', '♥'], ['10', '♠'], ['10', '♥']], '突突突——'); Audio8bit.sfx.tap(); }, t); t += 1400;
  ddzT(() => { ddzTurn(0); ddzSay(0, '要不起'); }, t); t += 600;
  ddzT(() => { ddzTurn(1); ddzSay(1, '过'); }, t); t += 600;
  ddzT(() => { ddzTurn(2); ddzSay(2, '过'); }, t); t += 600;
  ddzT(() => { ddzTurn(3); ddzPlay(3, '三带一', [['A', '♠'], ['A', '♥'], ['A', '♦'], ['K', '♠']], '大A走你！'); Audio8bit.sfx.tap(); }, t); t += 1300;
  ddzT(() => { ddzTurn(0); ddzSay(0, '过'); }, t); t += 550;
  ddzT(() => { ddzTurn(1); ddzSay(1, '过'); }, t); t += 550;
  ddzT(() => { ddzTurn(2); ddzSay(2, '过'); }, t); t += 550;
  ddzT(() => { ddzTurn(3); ddzPlay(3, '三带一 · 清空手牌！', [['Q', '♠'], ['Q', '♥'], ['Q', '♦'], ['2', '♠']], '出完啦——主角队胜利！！'); Audio8bit.sfx.dingdong(); }, t); t += 1700;
  ddzT(ddzSettle, t);
}

/* 结算：发廊队清零，主角队欢乐豆翻倍 */
function ddzSettle() {
  ddzTurn(-1);
  ddz.phase = 'settle';
  ddzEl('ddz-phase').textContent = '结算：底分 2w × 48倍 · 发廊队清零，主角队大赢特赢！';
  ddzEl('btn-ddz-skip').classList.add('hidden');
  const results = [
    { seat: 3, text: '220.0w', cls: 'up', say: '＋120w！今晚KTV我买单！' },
    { seat: 1, text: '180.0w', cls: 'up', say: '＋80w！躺赢的感觉真好～' },
    { seat: 0, text: '4.0w', cls: 'down', say: '破产……大师去后面冷静一下' },
    { seat: 2, text: '4.0w', cls: 'down', say: '输得只剩一条围裙 👔' },
  ];
  results.forEach((r, i) => ddzT(() => {
    const b = ddzEl('ddz-beans-' + r.seat);
    b.textContent = r.text;
    b.classList.add(r.cls);
    ddzSay(r.seat, r.say, 3200);
    Audio8bit.sfx.pop();
  }, 300 + i * 750));
  ddzT(() => { Audio8bit.sfx.fanfare(); ddzShowWin(); }, 300 + results.length * 750 + 500);
}

/* 胜利画面：四个主角仰天长啸 + 欢乐豆雨 */
function ddzShowWin() {
  const rain = ddzEl('ddz-rain');
  rain.innerHTML = '';
  const icons = ['🪙', '💰', '🎉', '✨', '💵'];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.textContent = icons[i % icons.length];
    s.style.left = (3 + Math.random() * 94) + '%';
    s.style.animationDelay = (Math.random() * 1.6) + 's';
    s.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
    s.style.fontSize = (12 + Math.random() * 12) + 'px';
    rain.appendChild(s);
  }
  ddzEl('ddz-win').classList.remove('hidden');
}

/* 结束挑战（成功 / 跳过）→ 回到寿宴流程入席 */
function closeDdzGame() {
  ddzClearTimers();
  ddz.phase = 'idle';
  ddzEl('ddz-game').classList.add('hidden');
  ddzEl('ddz-win').classList.add('hidden');
  ktkEl('ktk-intro').classList.add('hidden');
  Audio8bit.startBGM();
  enterVenueScene();
}
ddzEl('btn-ddz-deal').addEventListener('click', ddzDeal);
ddzEl('btn-ddz-skip').addEventListener('click', () => {
  if (ddz.phase !== 'playing') return;
  Audio8bit.sfx.tap();
  ddzClearTimers();
  DDZ_COUNTS = [25, 25, 16, 0];
  [0, 1, 2, 3].forEach(i => (ddzEl('ddz-cards-' + i).textContent = DDZ_COUNTS[i]));
  ddzSetMult(48);
  ddzShowPlayed(3, '王炸镇场 · 一路平推', [['王', '大'], ['王', '小'], ['A', '♠'], ['A', '♥'], ['A', '♦'], ['Q', '♠'], ['Q', '♥'], ['Q', '♦']]);
  ddzSettle();
});
ddzEl('btn-ddz-win').addEventListener('click', () => { Audio8bit.sfx.flip(); closeDdzGame(); });
ddzEl('ddz-close').addEventListener('click', closeDdzGame);
ddzEl('ddz-skip').addEventListener('click', closeDdzGame);

/* ---------- 研究生院 · 场外应援（点发廊大师锁定目标 → 扔水桶/烂番茄/倒拇指，纯彩蛋互动） ---------- */
const DDZ_WEAPONS = {
  bucket: { icon: '💦', cry: '我的发型——！！' },
  tomato: { icon: '🍅', cry: '酸…酸死了！' },
  thumbs: { icon: '👎', cry: '呜…太伤自尊了' }
};
const DDZ_TAUNTS = ['干什么！', '别扔了！', '打牌呢！正经点！', '救命啊——', '还让不让人打了！'];
let ddzAttackCount = 0;
function ddzFloatText(seat, text) {
  const el = document.createElement('span');
  el.className = 'ddz-float';
  el.textContent = text;
  ddzEl('ddz-seat-' + seat).appendChild(el);
  setTimeout(() => el.remove(), 1300);
}
/* 点座位选目标：发廊大师（0/2）可锁定，点主角队（1/3）会被拒绝 */
document.querySelectorAll('#ddz-game .ddz-seat').forEach(seat => {
  const i = Number(seat.id.replace('ddz-seat-', ''));
  seat.addEventListener('click', () => {
    if (i === 1 || i === 3) { Audio8bit.sfx.beep(); ddzSay(i, '自己人不能打！', 1600); return; }
    Audio8bit.sfx.tap();
    document.querySelectorAll('#ddz-game .ddz-seat.target').forEach(s => s.classList.remove('target'));
    seat.classList.add('target');
    ddzSay(i, '锁定我干嘛？？', 1600);
  });
});
/* 点武器开扔：投掷物飞向目标 → 震屏 + 惨叫 + 欢乐豆流失飘字 */
document.querySelectorAll('#ddz-game .ddz-wpn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector('#ddz-game .ddz-seat.target');
    if (!target) { Audio8bit.sfx.beep(); ddzEl('ddz-phase').textContent = '先点一个发廊大师锁定目标，再开扔！'; return; }
    const seat = Number(target.id.replace('ddz-seat-', ''));
    const w = DDZ_WEAPONS[btn.dataset.wpn];
    const from = btn.getBoundingClientRect(), to = target.getBoundingClientRect();
    const fly = document.createElement('span');
    fly.className = 'ddz-missile';
    fly.textContent = w.icon;
    fly.style.left = (from.left + from.width / 2 - 12) + 'px';
    fly.style.top = (from.top + from.height / 2 - 14) + 'px';
    fly.style.setProperty('--dx', ((to.left + to.width / 2) - (from.left + from.width / 2)) + 'px');
    fly.style.setProperty('--dy', ((to.top + to.height / 2) - (from.top + from.height / 2)) + 'px');
    document.body.appendChild(fly);
    setTimeout(() => fly.remove(), 600);
    Audio8bit.sfx.flip();
    setTimeout(() => {
      Audio8bit.sfx.pop();
      target.classList.add('shake');
      setTimeout(() => target.classList.remove('shake'), 480);
      ddzAttackCount++;
      const bean = ddzEl('ddz-beans-' + seat);
      if (bean) { bean.textContent = (Math.max(0, (parseFloat(bean.textContent) || 100) - 2)).toFixed(1) + 'w'; }
      ddzFloatText(seat, '-2w 欢乐豆');
      ddzSay(seat, ddzAttackCount >= 5 ? '别扔了别扔了！免费烫头一年！行了吧！！' : (w.cry + ' ' + DDZ_TAUNTS[ddzAttackCount % DDZ_TAUNTS.length]), 2400);
    }, 550);
  });
});

/* 步骤 2：选人物 */
const MISSING_MAIN_LINES = {
  guoshi:  '拉下本国师，看我派出两大卡车，werwerwer～～',
  emperor: '海牙，把你变成一只大笨猪～',
  prince:  '我根本再也不会和你世界第一好～',
};
const MAIN_OTHER_IDS = ['emperor', 'prince', 'guoshi'];
const SIDE_IDS = ['salon', 'nature', 'science', 'pig'];

function getChip(id) {
  return document.querySelector(`.char-chip[data-id="${id}"]`);
}

function updateCharsOkBtn() {
  const btn = document.getElementById('btn-chars-ok');
  const hasBadgirl = state.selectedChars.includes('badgirl');
  const hasAnyMainOther = MAIN_OTHER_IDS.some(id => state.selectedChars.includes(id));
  btn.textContent = (!hasBadgirl && hasAnyMainOther) ? '似乎忘了喊寿星' : '入席';
}

function renderCharGrid() {
  const grid = document.getElementById('char-grid');
  grid.innerHTML = '';
  CHARACTERS.forEach(c => {
    const chip = document.createElement('button');
    chip.className = 'char-chip';
    chip.dataset.id = c.id;
    chip.textContent = c.name;
    chip.addEventListener('click', () => {
      // 锁定的主角：取消时触发「勃然小怒」，不取消勾选
      if (chip.classList.contains('locked') && state.selectedChars.includes(c.id)) {
        playAngry(chip);
        Audio8bit.sfx.pop();
        return;
      }
      const i = state.selectedChars.indexOf(c.id);
      if (i >= 0) { state.selectedChars.splice(i, 1); Audio8bit.sfx.pop(); }
      else { state.selectedChars.push(c.id); Audio8bit.sfx.beep(); }
      chip.classList.toggle('on');
      updateCharsOkBtn();
    });
    grid.appendChild(chip);
  });
  updateCharsOkBtn();
}

/* 勃然小怒：锁定角色被点击取消时的动画（参考橘猫表情包：生气 + 小拳头） */
function playAngry(chip) {
  chip.classList.add('angry');
  const label = document.createElement('span');
  label.className = 'angry-label';
  label.textContent = '勃然小怒';
  chip.appendChild(label);
  setTimeout(() => {
    chip.classList.remove('angry');
    label.remove();
  }, 1300);
}

/* ---------- 通用卡牌弹窗 ---------- */
function showCardPop({ img, name, line = '', stamp = '', okText = 'DONE', onOk }) {
  const pop = document.getElementById('card-pop');
  const av = document.getElementById('cp-avatar');
  av.style.backgroundImage = `url('${img}')`;
  av.classList.remove('morph');
  document.getElementById('cp-name').textContent = name;
  document.getElementById('cp-line').textContent = line;
  const stampEl = document.getElementById('cp-stamp');
  if (stamp) { stampEl.textContent = stamp; stampEl.classList.add('show'); }
  else stampEl.classList.remove('show');
  const ok = document.getElementById('cp-ok');
  ok.textContent = okText || 'DONE';
  ok.classList.toggle('hidden', !okText);
  ok.onclick = () => { pop.classList.add('hidden'); onOk && onOk(); };
  pop.classList.remove('hidden');
}
function hideCardPop() { document.getElementById('card-pop').classList.add('hidden'); }

/* 配角被丢下：逐个弹出完整卡牌 + OUT 盖章动画 */
function playOutAnimation(ids, onDone) {
  const seq = [...ids];
  const next = () => {
    const id = seq.shift();
    if (!id) { onDone && onDone(); return; }
    const c = CHARACTERS.find(x => x.id === id);
    showCardPop({ img: c.face || c.img, name: c.name, stamp: 'OUT', okText: null });
    setTimeout(() => { hideCardPop(); setTimeout(next, 250); }, 1400);
  };
  next();
}

/* 缺主角：逐个弹出完整卡牌 + 固定话术 */
function showMissingMainSeq(missingIds, onDone) {
  const seq = [...missingIds];
  const next = () => {
    const id = seq.shift();
    if (!id) { onDone && onDone(); return; }
    const c = CHARACTERS.find(x => x.id === id);
    showCardPop({
      img: c.face || c.img, name: c.name, line: MISSING_MAIN_LINES[id],
      okText: seq.length ? '哄好并盛情邀请' : '知道了',
      onOk: next,
    });
  };
  next();
}

/* 坏女孩被绕晕：被丢下的宾客绕着坏女孩转 → 坏女孩晕倒 → 回选角页强制勾选锁定 */
function dizzyOrbit(missingMains) {
  const bg = CHARACTERS.find(x => x.id === 'badgirl');
  showCardPop({ img: bg.face || bg.img, name: bg.name, line: '坏女孩惹怒了被丢下的宾客……', okText: null });

  // 添加环绕的宾客小头像
  const layer = document.getElementById('orbit-layer');
  layer.innerHTML = '';
  const n = missingMains.length;
  missingMains.forEach((id, i) => {
    const c = CHARACTERS.find(x => x.id === id);
    const mini = document.createElement('div');
    mini.className = 'orbit-mini';
    mini.style.backgroundImage = `url('${c.face || c.img}')`;
    const dur = 1.7;
    mini.style.animation = `orbit ${dur}s linear infinite`;
    mini.style.animationDelay = `-${(i / n) * dur}s`; // 分散到圆周不同角度
    layer.appendChild(mini);
  });

  // 宾客越转越快 → 坏女孩被绕晕倒下
  setTimeout(() => {
    layer.querySelectorAll('.orbit-mini').forEach(m => { m.style.animationDuration = '0.55s'; });
  }, 1300);
  setTimeout(() => {
    document.getElementById('cp-inner').classList.add('dizzy');
    Audio8bit.sfx.pop();
  }, 1900);
  setTimeout(() => {
    hideCardPop();
    document.getElementById('cp-inner').classList.remove('dizzy');
    layer.innerHTML = '';
    // 回到选角页，强制勾选并锁定被丢下的主角，等用户再次点入席
    banquetStep('chars');
    missingMains.forEach(id => {
      if (!state.selectedChars.includes(id)) state.selectedChars.push(id);
      const chip = getChip(id);
      if (chip) chip.classList.add('on', 'locked');
    });
    updateCharsOkBtn();
  }, 3900);
}

document.getElementById('btn-chars-ok').addEventListener('click', () => {
  if (!state.selectedChars.length) {
    dialog.show({ title: '【提示】', text: '至少点一位宾客入席。' });
    return;
  }
  const hasBadgirl = state.selectedChars.includes('badgirl');
  const hasAnyMainOther = MAIN_OTHER_IDS.some(id => state.selectedChars.includes(id));

  // 没选坏女孩但选了其他主角 → 提示喊寿星
  if (!hasBadgirl && hasAnyMainOther) {
    dialog.show({ title: '【提示】', text: '寿星都没到场，这寿宴怎么开？快去把坏女孩喊来！' });
    return;
  }

  if (hasBadgirl) {
    const missingMains = MAIN_OTHER_IDS.filter(id => !state.selectedChars.includes(id));
    const missingSides = SIDE_IDS.filter(id => !state.selectedChars.includes(id));

    // 主角没集齐（漏选逻辑）：不展示配角 OUT 层，直接走主角找回流程
    if (missingMains.length) {
      showMissingMainSeq(missingMains, () => {
        dizzyOrbit(missingMains);
      });
      return;
    }

    // 主角齐全：此时才展示未选配角的 OUT 层（展示一次），随后进致辞
    if (missingSides.length) { playOutAnimation(missingSides, enterSpeech); return; }
    enterSpeech();
    return;
  }

  // 只选了配角（无主角）：沿用原通用话术
  dialog.show({
    title: '【提示】',
    text: COPY.notFull,
    okText: 'DONE',
    cancelText: 'SKIP',
    onOk: enterSpeech,
  });
});

/* 步骤 3：生日致辞 · 顾里式 */
let speechTimer = null;
const SPEECH_LINES = [
  '今天我们来到这里',
  '是为了庆祝',
  '我们共同的朋友',
  '坏女孩的生日！',
  '在这个特别的日子里',
  '我谨代表343王国全体国民',
  '向坏女孩致以最崇高的敬意',
  '愿你新的一岁——',
  '烦恼像王子的网速一样慢',
  '快乐像吴皇的地位一样稳',
  '智慧像国师的paper一样多',
  '创意像坏女孩的鬼点子一样无穷',
  '生日快乐！',
];
function enterSpeech() {
  const audience = document.getElementById('speech-audience');
  audience.innerHTML = '';
  state.selectedChars.slice(0, 6).forEach((id, i) => {
    const c = CHARACTERS.find(x => x.id === id);
    const g = document.createElement('div');
    g.className = 'guest bounce';
    g.style.background = avatarCss(c);
    g.style.backgroundColor = '#2b3a67';
    g.style.animationDelay = (i * 0.1) + 's';
    audience.appendChild(g);
  });
  const box = document.getElementById('speech-box');
  box.innerHTML = '';
  banquetStep('speech');
  // 逐行打字机播放
  let li = 0;
  function playLine() {
    if (li >= SPEECH_LINES.length) {
      document.getElementById('btn-speech-done').classList.remove('hidden');
      return;
    }
    const line = SPEECH_LINES[li];
    const div = document.createElement('div');
    div.className = 'speech-line' + (li === 3 || li === SPEECH_LINES.length - 1 ? ' highlight' : '');
    box.appendChild(div);
    setTimeout(() => div.classList.add('show'), 50);
    let ci = 0;
    const type = setInterval(() => {
      ci++;
      div.textContent = line.slice(0, ci);
      if (ci >= line.length) {
        clearInterval(type);
        li++;
        const delay = (li === 3 || li === SPEECH_LINES.length) ? 900 : 450;
        speechTimer = setTimeout(playLine, delay);
      }
    }, 55);
  }
  playLine();
}
document.getElementById('btn-speech-done').addEventListener('click', () => {
  clearTimeout(speechTimer);
  load寿星Face();
  banquetStep('cake');
});

/* 步骤 4：点蜡烛 + 吹蜡烛 */
// 进入蛋糕步骤时加载寿星照片
function load寿星Face() {
  const face = document.getElementById('寿星-face');
  const photo = store.photo;
  face.style.backgroundImage = photo ? `url('${photo}')` : pixelAvatar('#ff6ad5') + ' center/cover no-repeat';
  face.style.backgroundSize = 'cover';
  face.style.backgroundPosition = 'center top';
}
document.getElementById('cake').addEventListener('click', e => {
  const cake = document.getElementById('cake');
  if (cake.classList.contains('lit')) return;
  load寿星Face();
  cake.classList.add('lit');
  document.getElementById('cake-hint').textContent = '蜡烛已点亮，寿星吹蜡烛吧～';
  document.getElementById('btn-blow').classList.remove('hidden');
  Audio8bit.sfx.fanfare();
  // 火花粒子
  const rect = cake.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    const ang = (Math.PI * 2 * i) / 14;
    const dist = 40 + Math.random() * 40;
    s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(ang) * dist - 20 + 'px');
    s.style.left = (e.clientX - rect.left) + 'px';
    s.style.top = (e.clientY - rect.top) + 'px';
    s.style.animationDelay = (i * 0.02) + 's';
    cake.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
});
document.getElementById('btn-blow').addEventListener('click', () => {
  const cake = document.getElementById('cake');
  const star = document.getElementById('寿星');
  const msg = document.getElementById('寿星-msg');
  msg.textContent = '呼——';
  star.classList.add('blowing');
  Audio8bit.sfx.whoosh();
  // 吹气动画
  const breath = document.createElement('span');
  breath.className = 'breath';
  breath.style.left = '60px';
  breath.style.top = '30px';
  star.appendChild(breath);
  setTimeout(() => breath.remove(), 800);
  // 蜡烛熄灭 + 烟雾
  setTimeout(() => {
    cake.classList.add('blown');
    const candles = cake.querySelectorAll('.candles i');
    candles.forEach((c, i) => {
      const smoke = document.createElement('span');
      smoke.className = 'smoke';
      smoke.style.left = (c.offsetLeft - 2) + 'px';
      smoke.style.top = '-6px';
      smoke.style.animationDelay = (i * 0.1) + 's';
      c.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1100);
    });
    msg.textContent = '蜡烛吹灭啦！';
    document.getElementById('cake-hint').textContent = '愿望许好了吗？';
    document.getElementById('btn-blow').classList.add('hidden');
    document.getElementById('btn-lights-off').classList.remove('hidden');
  }, 500);
  setTimeout(() => star.classList.remove('blowing'), 600);
});
document.getElementById('btn-lights-off').addEventListener('click', () => {
  banquetStep('bless');
  playBlessings();
});

/* 步骤 5：关灯祝福（王子→皇帝→国师） */
function playBlessings() {
  const box = document.getElementById('bless-bubbles');
  box.innerHTML = '';
  document.getElementById('btn-bless-done').classList.add('hidden');
  COPY.blessings.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'bless-bubble';
    div.innerHTML = `<b>${b.who}</b>${b.line}`;
    box.appendChild(div);
    setTimeout(() => div.classList.add('show'), 800 * (i + 1));
  });
  setTimeout(() => document.getElementById('btn-bless-done').classList.remove('hidden'), 800 * COPY.blessings.length + 600);
}
document.getElementById('btn-bless-done').addEventListener('click', () => banquetStep('letter'));

/* 步骤 6：许愿信（拆→折→封蜡→飞走） */
const envelope = document.getElementById('envelope');
const letterHint = document.getElementById('letter-hint');
let letterPhase = 0;
envelope.addEventListener('click', () => {
  letterPhase++;
  if (letterPhase === 1) { Audio8bit.sfx.flip(); envelope.classList.add('open'); letterHint.textContent = '愿望已拆封，再点一下折好它'; }
  else if (letterPhase === 2) { Audio8bit.sfx.pop(); envelope.classList.add('folded'); document.getElementById('seal').classList.remove('hidden'); letterHint.textContent = '封蜡完成，送它起飞'; }
  else if (letterPhase === 3) {
    Audio8bit.sfx.whoosh();
    envelope.classList.add('fly');
    letterHint.textContent = '愿望正在飞向星空……';
    document.getElementById('btn-letter-done').classList.remove('hidden');
    letterPhase = 0;
    setTimeout(() => envelope.classList.remove('open', 'folded', 'fly') || document.getElementById('seal').classList.add('hidden'), 1500);
  }
});
document.getElementById('btn-letter-done').addEventListener('click', () => {
  document.getElementById('final-bless').innerText = COPY.finalBless;
  banquetStep('finale');
  // 自动加载合照并像素化
  const slot = document.getElementById('family-slot');
  slot.classList.add('loading');
  pixelateUrl('assets/family-photo.jpg', dataUrl => {
    slot.innerHTML = `<img src="${dataUrl}" alt="全家福"><div class="bday-hat"></div>`;
    slot.classList.remove('loading');
    Audio8bit.sfx.fanfare();
  });
});

/* 步骤 7：全家福 */
document.getElementById('family-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const slot = document.getElementById('family-slot');
    slot.classList.add('loading');
    pixelateUrl(reader.result, dataUrl => {
      slot.innerHTML = `<img src="${dataUrl}" alt="全家福"><div class="bday-hat"></div>`;
      slot.classList.remove('loading');
      Audio8bit.sfx.pop();
    });
  };
  reader.readAsDataURL(file);
});
document.getElementById('btn-back-map').addEventListener('click', () => {
  /* 寿宴走完（全家福后回地图）→ 礼成！地图节点打勾 */
  try { localStorage.setItem(sk('banquet_done'), '1'); } catch (e) {}
  refreshMapLocks();
  show('scene-map');
});

/* ---------- 初始化：支持 hash 直达，便于调试 ---------- */
(function init() {
  // ?reset=1 只清除当前昵称的存档，同一设备的其他人不受影响
  if (new URLSearchParams(location.search).get('reset')) {
    try {
      ['photo', 'drawn', 'slots', 'team', 'team_8', 'beijing_done', 'banquet_done'].forEach(n => localStorage.removeItem(sk(n)));
      localStorage.removeItem(adventureKey());
      localStorage.removeItem('pp_muted');
    } catch (e) { /* 隐私模式下 localStorage 被禁，忽略 */ }
  }
  // 每次打开都重置抽卡进度（手拉手团队随之散伙、集齐庆祝重置），保留玩家照片
  store.drawn = [];
  store.slots = Array(8).fill(null);
  teamStore.list = [];
  teamStore.celebrated = false;
  // 清理旧版本残留的无效角色 ID（如 salon-a/b/c/d）
  const validIds = new Set(CHARACTERS.map(c => c.id));
  const drawn = store.drawn.filter(id => validIds.has(id));
  if (drawn.length !== store.drawn.length) store.drawn = drawn;
  const s = store.slots;
  if (Array.isArray(s)) {
    const cleaned = s.map(id => (id && validIds.has(id)) ? id : null);
    store.slots = cleaned;
  }
  const h = location.hash.replace('#', '');
  if (store.photo) applyPhoto(store.photo);
  const targets = ['gacha', 'map', 'ktv', 'banquet'];
  if (targets.includes(h)) {
    if (h === 'gacha') renderDeck();
    if (h === 'banquet') startBanquet();
    else show('scene-' + h);
  }
})();
/* 浏览器前进/后退时同步场景 */
window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#', '');
  if (h === 'gacha') { renderDeck(); show('scene-gacha'); }
  else if (h === 'banquet') startBanquet();
  else if (['map', 'ktv'].includes(h)) show('scene-' + h);
  else show('scene-login');
});
