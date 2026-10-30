/* 轻量像素音效：本地 Web Audio 合成，无外部音频请求。 */
(()=>{
 let context=null,master=null,muted=false,voices=0;const recent={},unlockListeners=[];
 // 每次进入默认开启，开关只影响本次页面会话。
 function sync(){document.querySelectorAll('[data-sound]').forEach(b=>{b.textContent=muted?'音效：关':'音效：开';b.setAttribute('aria-pressed',String(!muted));b.setAttribute('aria-label',muted?'开启音效':'关闭音效');});}
 function unlock(){try{if(!context){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;context=new C();master=context.createGain();master.gain.value=muted?0:.16;master.connect(context.destination);}if((context.state==='suspended'||context.state==='interrupted'))context.resume().catch(()=>{});unlockListeners.forEach(f=>f(context));}catch{}}
 function tone(freq,end,at,duration=.1,type='square',volume=.5){if(!context||voices>=20)return;const t=context.currentTime+at,o=context.createOscillator(),g=context.createGain();voices++;o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,end),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(master);o.onended=()=>{voices--;o.disconnect();g.disconnect();};o.start(t);o.stop(t+duration+.02);}
 const patterns={
  enter:[[392,784,0,.12,'triangle',.55],[587,880,.09,.13,'square',.38],[784,1047,.2,.17,'square',.38],[1047,1047,.34,.23,'triangle',.55]],
  reward:[[523,523,0,.09,'square',.4],[659,659,.08,.09,'square',.4],[784,784,.16,.09,'square',.4],[1047,1047,.26,.17,'square',.42],[1319,1319,.26,.17,'triangle',.35],[1568,1568,.26,.17,'triangle',.35],[2093,2093,.46,.22,'triangle',.28]],
  jump:[[210,650,0,.13,'square',.35]],
  bump:[[170,90,0,.07,'triangle',.7]],
  coin:[[990,990,0,.055,'square',.3],[1480,1480,.055,.13,'square',.25]],
  mushroom:[[330,330,0,.09],[440,440,.08,.09],[554,554,.16,.09],[660,880,.24,.2]],
  support:[[262,262,0,.13],[330,330,.11,.13],[392,392,.22,.13],[523,523,.35,.2],[659,659,.35,.2],[784,784,.35,.2],[1047,1047,.62,.35]],
  stomp:[[180,60,0,.1,'triangle',.8]],
  hurt:[[350,130,0,.2,'sawtooth',.35]],
  rescue:[[240,480,0,.15,'triangle',.7],[480,720,.13,.18,'triangle',.5]],
  arrive:[[392,392,0,.12],[523,523,.12,.12],[659,659,.24,.12],[784,784,.36,.28]],
  pay:[[700,900,0,.06,'square',.22],[1000,1200,.09,.08,'square',.22],[1400,1600,.18,.15,'square',.22]],
  ticket:[[523,523,0,.12],[659,659,.12,.12],[784,784,.24,.12],[1047,1047,.4,.35]],
  ui:[[700,950,0,.05,'triangle',.4]]
 };
 function play(name){if(muted||!context||context.state!=='running'||!patterns[name])return;const t=context.currentTime;if(recent[name]!=null&&t-recent[name]<.045)return;recent[name]=t;try{patterns[name].forEach(n=>tone(...n));}catch{}}
 document.addEventListener('pointerdown',unlock,{capture:true,passive:true});document.addEventListener('keydown',unlock,{capture:true});
 document.querySelectorAll('[data-sound]').forEach(b=>b.addEventListener('click',()=>{unlock();muted=!muted;if(master)master.gain.setValueAtTime(muted?0:.16,context.currentTime);sync();if(!muted)play('ui');}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&context?.state==='running')context.suspend().catch(()=>{});});
 sync();window.AdventureSound={play,enable:unlock,onUnlock:f=>unlockListeners.push(f)};
})();
