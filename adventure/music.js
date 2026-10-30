/* 原创动感芯片音乐：地图144 BPM保持原样，关卡168 BPM小调街机放克；两首本地缓冲区按场景淡入淡出。
   地图页加载即尝试启动，浏览器拦截时由地图点击恢复；与音效共用 AudioContext；无网络音频、无常驻调度器。 */
(()=>{
 let muted=false,paused=false,context=null,gain=null,source=null,trackGain=null,scene='map',playingTrack='';const buffers=new Map();
 // 每次进入默认开启，开关只影响本次页面会话。
 const buttons=document.querySelectorAll('[data-music]'),mapMusicStart=document.getElementById?.('mapMusicStart');let watchedContext=null;
 function sync(){const meta=document.documentElement?.dataset;if(meta){meta.musicScene=scene;meta.musicTrack=playingTrack;meta.musicState=context?.state||'unavailable';meta.musicVersion='arcade-27';}buttons.forEach(b=>{b.textContent=muted?'音乐：关':'音乐：开';b.setAttribute('aria-pressed',String(!muted));b.setAttribute('aria-label',muted?'开启背景音乐':'关闭背景音乐');});if(gain)gain.gain.setValueAtTime(muted||paused?0:.5,context.currentTime);mapMusicStart?.classList.toggle('hidden',muted||context?.state==='running'||!(window.AudioContext||window.webkitAudioContext||context));}
 function composeLevel(ctx){
  // 与地图完全不同：168 BPM小调街机放克，窄脉冲拨弦、切分贝斯与十六分踩镲。
  const rate=22050,step=60/168/2,length=Math.round(64*step*rate),buffer=ctx.createBuffer(1,length,rate),out=buffer.getChannelData(0);
  const lead=[69,0,69,76,79,0,76,72,74,0,72,69,67,69,72,0,72,0,77,76,72,0,69,65,67,69,72,0,76,72,69,0,76,0,79,84,83,79,76,0,72,76,79,0,76,74,72,0,71,0,74,79,77,74,71,0,69,72,76,79,76,72,69,0],chords=[[45,48,52],[41,45,48],[48,52,55],[43,47,50]];
  function note(midi,at,dur,vol,type){const f=440*2**((midi-69)/12),start=Math.round(at*step*rate),count=Math.round(dur*step*rate);for(let n=0;n<count&&start+n<length;n++){const t=n/rate,phase=f*t,env=Math.min(1,t/.003)*Math.exp(-t*(type==='bass'?12:type==='stab'?24:14))*Math.max(0,1-n/count);const v=type==='bass'?(Math.sin(2*Math.PI*phase)+.3*Math.sin(4*Math.PI*phase))/1.3:type==='stab'?Math.sin(2*Math.PI*phase)+.18*Math.sin(6*Math.PI*phase):(phase%1<.2?1:-.25)*.75+Math.sin(2*Math.PI*phase)*.25;out[start+n]+=v*vol*env;}}
  let seed=2727;function drum(kind,at,vol){const start=Math.round(at*step*rate),duration=kind==='kick'?.18:kind==='snare'?.13:.035,count=Math.round(duration*rate);let prev=0;for(let n=0;n<count&&start+n<length;n++){const t=n/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;const v=kind==='kick'?Math.sin(2*Math.PI*(43*t+140*(1-Math.exp(-t*43))/43))*Math.exp(-t*24):kind==='snare'?(noise*.8+Math.sin(2*Math.PI*165*t)*.2)*Math.exp(-t*35):(noise-prev)*.5*Math.exp(-t*135);prev=noise;out[start+n]+=v*vol*Math.min(1,t/.001);}}
  for(let i=0;i<64;i++){const pulse=i%8,chord=chords[Math.floor(i/16)];if(lead[i]){note(lead[i],i,pulse===0?1.1:.7,.22,'lead');if(pulse===0)note(lead[i]-12,i,.6,.045,'stab');}if([0,3,4,7].includes(pulse))drum('kick',i,.2);if(pulse===2||pulse===6)drum('snare',i,.12);drum('hat',i,.026);drum('hat',i+.5,.042);if([0,3,6].includes(pulse))chord.forEach(m=>note(m+12,i,.7,.038,'stab'));if(pulse===0||pulse===4)note(chord[0]-12,i,1.05,.17,'bass');if([1,5].includes(pulse))note(chord[2]-12,i+.5,.5,.14,'bass');if(pulse===7)note(chord[0],i,.5,.12,'bass');}
  return buffer;
 }
 function compose(ctx,kind='map'){if(kind==='level')return composeLevel(ctx);
  const rate=22050,step=60/144/2,length=Math.round(step*64*rate),buffer=ctx.createBuffer(1,length,rate),data=buffer.getChannelData(0);
  const melody=[72,76,79,76,74,76,79,83,81,79,76,74,72,0,67,71,69,72,76,72,71,72,76,79,77,76,72,69,71,0,67,0,65,69,72,76,74,72,69,65,67,71,74,79,77,74,71,67,72,76,79,84,83,79,76,74,72,0,76,79,72,0,0,0];
  const chords=[[48,52,55],[45,48,52],[41,45,48],[43,47,50]];
  function note(midi,beat,duration,volume,type){if(!midi)return;const freq=440*2**((midi-69)/12),start=Math.round(beat*step*rate),n=Math.round(duration*step*rate);for(let i=0;i<n&&start+i<length;i++){const t=i/rate,p=freq*t,envelope=Math.min(1,t/.008)*Math.max(0,1-i/n)**1.6;let v=type==='pulse'?Math.tanh(Math.sin(2*Math.PI*p)*3):type==='bass'?Math.sin(2*Math.PI*p):2/Math.PI*Math.asin(Math.sin(2*Math.PI*p));data[start+i]+=v*volume*envelope;}}
  // 种子噪声合成小军鼓和踩镲，不依赖音频下载，不叠加常驻声源。
  let seed=343;
  function drum(kind,beat,volume){const start=Math.round(beat*step*rate),duration=kind==='kick'?.19:kind==='snare'?.12:.045,n=Math.round(duration*rate);let previous=0;for(let j=0;j<n&&start+j<length;j++){const t=j/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;let v;if(kind==='kick'){const phase=2*Math.PI*(46*t+100*(1-Math.exp(-t*34))/34);v=Math.sin(phase)*Math.exp(-t*23);}else if(kind==='snare')v=(noise*.78+Math.sin(2*Math.PI*185*t)*.22)*Math.exp(-t*38);else v=(noise-previous)*.5*Math.exp(-t*110);previous=noise;data[start+j]+=v*volume*Math.min(1,t/.001);}}
  for(let i=0;i<64;i++){
   const chord=chords[Math.floor(i/16)],pulse=i%8;
   note(melody[i],i,[.72,.42,.66,.45][i%4],.14,'pulse');
   note(chord[i%3]+12,i,.44,i%2?.065:.045,'triangle');
   if([0,3,4,6,7].includes(pulse))note(chord[pulse===3||pulse===7?2:0]-12,i,pulse===0?.82:.52,.14,'bass');
   if(i%2===0)drum('kick',i,.18);
   if(pulse===2||pulse===6)drum('snare',i,.095);
   drum('hat',i,i%2?.045:.025);
  }

  return buffer;
 }
 function start(ctx){if(source||muted)return;try{context=ctx;if(!gain){gain=ctx.createGain();gain.connect(ctx.destination);}if(!buffers.has(scene))buffers.set(scene,compose(ctx,scene));const voice=ctx.createBufferSource(),bus=ctx.createGain(),t=ctx.currentTime;voice.buffer=buffers.get(scene);voice.loop=true;voice.connect(bus);bus.connect(gain);bus.gain.setValueAtTime(0,t);bus.gain.linearRampToValueAtTime(1,t+.18);voice.onended=()=>{voice.disconnect();bus.disconnect();};source=voice;trackGain=bus;voice.start(t);playingTrack=scene;sync();}catch{source=null;}}
 function setScene(next){next=next==='level'?'level':'map';if(next===scene)return;scene=next;if(source){const old=source,bus=trackGain,t=context.currentTime;bus.gain.cancelScheduledValues(t);bus.gain.setValueAtTime(bus.gain.value,t);bus.gain.linearRampToValueAtTime(0,t+.16);old.stop(t+.18);source=null;trackGain=null;}if(context)start(context);}

 window.AdventureSound?.onUnlock(start);
 buttons.forEach(b=>b.addEventListener('click',()=>{muted=!muted;if(!source&&!muted&&context)start(context);sync();}));
 // Capture runs before a music-toggle click, including when music was previously muted.
 window.AdventureSound?.onUnlock(ctx=>{context=ctx;if(watchedContext!==ctx){watchedContext=ctx;ctx.addEventListener?.('statechange',sync);}sync();});
 mapMusicStart?.addEventListener('click',()=>{muted=false;paused=false;window.AdventureSound?.enable?.();sync();});
 sync();window.AdventureMusic={setScene,pause:value=>{paused=!!value;sync();}};
 // 自动播放权限允许时，进入地图即出声；否则保留地图内的一次点击入口。
 window.AdventureSound?.enable?.();
})();
