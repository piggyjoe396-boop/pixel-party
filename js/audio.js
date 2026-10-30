/* ===== 8-bit 音频模块：WebAudio 合成 BGM + 音效 ===== */
'use strict';

const Audio8bit = (() => {
  let ctx = null;
  let bgmOn = false;
  let bgmTimer = null;
  let muted = false;
  try { muted = localStorage.getItem('pp_muted') === '1'; } catch (e) { /* file:// 或隐私模式下 localStorage 可能被禁 */ }

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* 单个音符：方波/三角波 + 简易包络 */
  function note(freq, t0, dur, type, vol) {
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.setValueAtTime(vol, t0 + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  /* 音名→频率（简易换算） */
  const N = {};
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].forEach((n, i) => {
    for (let oct = 3; oct <= 6; oct++) N[n + oct] = 440 * Math.pow(2, (i - 9) / 12 + oct - 4);
  });

  /* BGM：生日快乐歌（C 大调） */
  // [音名, 拍数]
  const HBD = [
    ['G4',0.5],['G4',0.5],['A4',0.75],['G4',0.25],['C5',1],['B4',1],
    ['G4',0.5],['G4',0.5],['A4',0.75],['G4',0.25],['D5',1],['C5',1],
    ['G4',0.5],['G4',0.5],['G5',0.75],['E5',0.25],['C5',1],['B4',1],['A4',1],
    ['F4',0.5],['F4',0.5],['E5',0.75],['C5',0.25],['D5',1],['C5',1],
  ];
  // 低音：每小节根音
  const BASS = [['C3',4],['G3',4],['C3',4.5],['G3',2],['C3',1.5]];
  const BPM = 132;
  const BEAT = 60 / BPM;

  function startBGM() {
    if (bgmOn || muted) return;
    bgmOn = true;
    let nextT = ac().currentTime + 0.1;
    bgmTimer = setInterval(() => {
      if (muted) return;
      const c = ac();
      while (nextT < c.currentTime + 0.4) {
        // 旋律
        HBD.forEach(([n, beats]) => {
          note(N[n], nextT, beats * BEAT * 0.92, 'square', 0.05);
          nextT += beats * BEAT;
        });
        // 低音（对齐到下一轮开始前）
        const loopStart = nextT - HBD.reduce((s, [, b]) => s + b, 0) * BEAT;
        let bt = loopStart;
        BASS.forEach(([n, beats]) => {
          note(N[n], bt, beats * BEAT * 0.95, 'triangle', 0.06);
          bt += beats * BEAT;
        });
      }
    }, 200);
  }
  function stopBGM() { bgmOn = false; clearInterval(bgmTimer); }

  /* 音效 */
  const sfx = {
    beep()  { if (!muted) note(660, ac().currentTime, 0.09, 'square', 0.12); },
    flip()  { if (!muted) { const t = ac().currentTime; note(440, t, 0.07, 'square', 0.1); note(880, t + 0.08, 0.12, 'square', 0.1); } },
    fanfare() { if (!muted) { const t = ac().currentTime; ['C5','E5','G5','C6'].forEach((n, i) => note(N[n], t + i * 0.11, 0.16, 'square', 0.11)); } },
    pop()   { if (!muted) note(330, ac().currentTime, 0.06, 'triangle', 0.14); },
    whoosh(){ if (!muted) { const t = ac().currentTime; for (let i=0;i<8;i++) note(200+i*60, t+i*0.02, 0.04, 'sawtooth', 0.05); } },
    tap()   { if (!muted) note(880, ac().currentTime, 0.05, 'square', 0.08); },
    /* 开门大吉：门铃 ding-dong */
    dingdong() { if (!muted) { const t = ac().currentTime; note(N['E5'], t, 0.5, 'triangle', 0.22); note(N['C5'], t + 0.55, 0.8, 'triangle', 0.22); } },
    /* 答错：低音嗡嗡两下 */
    wrong()  { if (!muted) { const t = ac().currentTime; note(196, t, 0.16, 'square', 0.12); note(147, t + 0.2, 0.3, 'square', 0.12); } },
    /* 小猪：哼哼哼（三声低音猪叫） */
    oink()   { if (!muted) { const t = ac().currentTime; note(210, t, 0.12, 'square', 0.2); note(185, t + 0.18, 0.12, 'square', 0.2); note(160, t + 0.36, 0.18, 'square', 0.2); } },
    /* 电话：嘟…嘟…振铃 */
    ring()   { if (!muted) { const t = ac().currentTime; for (let i = 0; i < 2; i++) { note(880, t + i * 0.45, 0.22, 'square', 0.09); note(988, t + i * 0.45 + 0.02, 0.2, 'square', 0.06); } } },
    /* 拔黑头：啵——（下滑音） */
    pluck()  {
      if (muted) return;
      try {
        const c = ac(); const t = c.currentTime;
        const o = c.createOscillator(); const g = c.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(340, t);
        o.frequency.exponentialRampToValueAtTime(70, t + 0.28);
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g).connect(c.destination);
        o.start(t); o.stop(t + 0.32);
      } catch (e) { /* 容错：不出声也不崩 */ }
    },
  };

  /* 旋律播放器：notes = [[音名, 拍数], ...]，播完回调 onDone；返回取消函数（仅取消回调）
     音频初始化失败时也保证 onDone 触发，避免游戏卡死 */
  function playMelody(notes, bpm, onDone, wave = 'square', vol = 0.09) {
    /* 静音时也按真实时长走流程（只是无声），避免"点门铃秒出选项"的错觉 */
    if (muted) {
      let silentMs = 600;
      try { silentMs = notes.reduce((s, [, b]) => s + b, 0) * (60 / bpm) * 1000 + 150; } catch (e) {}
      const t = setTimeout(() => onDone && onDone(), silentMs);
      return () => clearTimeout(t);
    }
    let totalMs = 600;
    try {
      const BEAT = 60 / bpm;
      const c = ac();
      let t = c.currentTime + 0.08;
      notes.forEach(([n, beats]) => {
        if (n !== 'R') note(N[n], t, beats * BEAT * 0.92, wave, vol);  // 'R' = 休止符
        t += beats * BEAT;
      });
      totalMs = (t - c.currentTime) * 1000 + 150;
    } catch (e) { console.warn('playMelody fallback:', e); }
    const timer = setTimeout(() => onDone && onDone(), totalMs);
    return () => clearTimeout(timer);
  }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem('pp_muted', muted ? '1' : '0'); } catch (e) { /* 容错 */ }
    if (muted) stopBGM(); else startBGM();
    return muted;
  }
  function isMuted() { return muted; }

  /* 首次交互后才能出声（浏览器自动播放限制） */
  function unlock() { ac(); if (!muted) startBGM(); document.removeEventListener('pointerdown', unlock); }
  document.addEventListener('pointerdown', unlock);

  return { sfx, startBGM, stopBGM, toggleMute, isMuted, playMelody };
})();
