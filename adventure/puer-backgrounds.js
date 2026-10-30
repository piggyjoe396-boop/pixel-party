/* 普洱三段像素背景。所有坐标为游戏逻辑像素，随相机视差滚动。 */
(()=>{
function draw(ctx,W,H,camera,scene){
 const floor=H-55;
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(floor+y),Math.ceil(w),Math.ceil(h));};
 const text=(s,x,y,size=11,c='#fff2cf')=>{ctx.fillStyle=c;ctx.font=`bold ${size}px monospace`;ctx.textAlign='center';ctx.fillText(s,Math.round(x),Math.round(floor+y));};
 const cloud=(x,y)=>{r(x,y,44,12,'#fff4df');r(x+8,y-8,26,8,'#fff4df');r(x+4,y+12,36,3,'#c3e4df');};
 const hill=(x,y,w,h,c)=>{for(let k=0;k<8;k++)r(x+k*w/16,y-k*h/8,w-k*w/8,h+k*h/8,c);};
 const tree=(x,y,s=1)=>{r(x-3*s,y-35*s,6*s,35*s,'#756145');r(x-21*s,y-50*s,42*s,22*s,'#397952');r(x-15*s,y-65*s,30*s,22*s,'#4a9160');r(x-9*s,y-72*s,18*s,15*s,'#75ac67');r(x-16*s,y-47*s,10*s,9*s,'#81b96c');};
 const roof=(x,y,w)=>{r(x-8,y,w+16,7,'#344f58');r(x-3,y-7,w+6,7,'#567078');r(x+6,y-13,w-12,6,'#78918b');for(let n=0;n<w;n+=12)r(x+n,y-5,2,9,'#a5b4a0');};
 const windows=(x,y,cols,rows,dx=18,dy=24)=>{for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){r(x+i*dx,y+j*dy,10,14,'#425966');r(x+i*dx+2,y+j*dy+2,6,7,'#9fced3');r(x+i*dx+5,y+j*dy+2,1,12,'#e0d6b8');}};
 const sign=(s,x,y,w)=>{r(x-2,y-2,w+4,23,'#c8a35d');r(x,y,w,19,'#324f4c');text(s,x+w/2,y+13,11);};
 ctx.save();ctx.fillStyle=scene==='puer-old-street'?'#f3cf98':scene==='puer-coffee'?'#b1ddd2':'#a9dce6';ctx.fillRect(0,0,W,H);
 // 远山、像素白云使用较慢的视差，保证操作层始终清楚。
 for(const [at,w,h]of [[-150,286,112],[178,219,85],[445,338,138],[841,260,96],[1148,352,121]]){const x=at-camera*.12;hill(x,-165,w,h,scene==='puer-old-street'?'#b7bd95':'#88b9a0');hill(x+75,-110,w*.7,h*.8,'#709b83');}
 for(let n=-1;n<8;n++)cloud(n*217-camera*.08,-335+(n%2)*40);
 r(0,-29,W,29,scene==='puer-old-street'?'#b9a486':'#a4bc81');
 if(scene==='puer-city'){
  const offset=camera*.68;
  for(const [x,w,h,c]of [[-120,84,98,'#b8bea9'],[130,75,122,'#abbda8'],[420,110,79,'#c3c7ae'],[630,91,142,'#b1b9a5']]){const bx=x-offset*.45;r(bx,-h-29,w,h,c);windows(bx+10,-h-16,Math.floor(w/22),Math.floor(h/26),22,24);}
  const x=18-offset;
  // 普洱站：层层抬升的茶褐色屋面、玻璃候车大厅与站前广场。
  r(x,-196,210,157,'#d7c6a5');r(x+12,-171,186,125,'#705e4e');
  for(let j=0;j<3;j++){r(x-9+j*17,-200-j*14,228-j*34,10,'#665343');r(x-5+j*17,-204-j*14,220-j*34,4,'#a69070');}
  for(let n=0;n<8;n++){r(x+19+n*22,-161,17,112,'#6f9f9d');r(x+20+n*22,-156,5,99,'#afd1c2');r(x+34+n*22,-164,4,119,'#d8c8a7');}
  r(x+72,-191,66,22,'#675343');text('普 洱 站',x+105,-176,14);text('PU’ER',x+105,-181+22,8,'#e7d8b4');
  r(x-13,-43,236,7,'#d0c6ac');r(x-19,-36,248,6,'#e7dfc6');
  const hx=292-offset;
  r(hx,-236,112,197,'#e6d6b9');r(hx+8,-249,96,13,'#d3b88b');r(hx+15,-257,82,8,'#b39772');windows(hx+12,-201,5,6,18,24);
  r(hx+5,-231,102,23,'#942f36');text('维也纳酒店',hx+56,-216,12,'#ffe5a6');r(hx+39,-72,35,33,'#685d51');r(hx+43,-69,27,30,'#91b9b3');r(hx+28,-79,56,7,'#c2a273');
  const tx=470-offset;sign('中国茶城 · 普洱',tx,-155,128);r(tx+9,-132,5,99,'#7d7053');r(tx+114,-132,5,99,'#7d7053');
  for(let n=-1;n<8;n++){const px=n*112-offset*.85;tree(px,-31,.65);r(px+40,-101,3,70,'#5e7771');r(px+40,-104,22,4,'#5e7771');r(px+56,-100,10,6,'#fff0b0');}
  // 站区之后进入城市绿地、跨河小桥与街角茶铺，各地标只出现一次。
  const sc=687-offset;r(sc,-58,76,25,'#c9ba95');r(sc+13,-68,50,10,'#d7caa3');r(sc+32,-115,12,47,'#809c72');r(sc+8,-126,35,14,'#6c946a');r(sc+38,-146,34,15,'#83a578');r(sc+31,-121,13,16,'#a6bd83');
  const river=889-offset;r(river,-42,167,14,'#89b8b0');for(let k=0;k<12;k++){const h=Math.round(Math.sin(k/11*Math.PI)*18);r(river+k*14,-48-h,14,5,'#cfbd96');r(river+k*14,-75-h,3,27,'#998e71');}
  const shop=1150-offset;r(shop,-130,133,96,'#c5b88d');r(shop-4,-139,141,10,'#6f8b73');r(shop+11,-100,111,64,'#839c87');r(shop+18,-57,98,7,'#ad946e');sign('茶香小铺',shop+19,-126,94);r(shop+27,-73,17,16,'#cbb58c');r(shop+74,-79,23,22,'#a48a64');
 }else if(scene==='puer-coffee'){
  const offset=camera*.55;
  for(let n=-2;n<12;n++){const x=n*197-camera*.22;for(let j=0;j<4;j++){r(x-j*12,-125+j*24,170+j*24,8,'#4c8a58');r(x-j*12,-117+j*24,170+j*24,4,'#8eb476');}}
  for(const n of [0]){const x=-offset;
   // 红砖绿瓦的咖啡品鉴小屋和山坳里的晾晒架。
   r(x+150,-173,154,135,'#ba7d58');for(let j=0;j<7;j++)r(x+152,-161+j*18,150,2,'#cd9b6c');roof(x+146,-174,162);windows(x+162,-151,3,2,24,28);r(x+249,-119,34,80,'#52695c');sign('普洱咖啡庄园',x+171,-95,112);
   r(x+331,-82,115,8,'#906649');r(x+335,-74,5,38,'#6d593f');r(x+437,-74,5,38,'#6d593f');r(x+335,-79,107,4,'#c19669');for(let k=0;k<16;k++)r(x+340+k*6,-82,3,3,k%2?'#a94b34':'#783e2a');
   // 可辨认的红色咖啡果，不作为可收集物。
   for(let k=0;k<5;k++){const cx=x+k*89;tree(cx,-29,.85);for(let j=0;j<6;j++)r(cx-13+(j%3)*10,-67+Math.floor(j/3)*13,4,4,'#ce5841');}
   r(x+90,-71,18,35,'#ceb58a');text('COFFEE',x+100,-50,6,'#5f4938');
  }
  // 品鉴屋、晒豆场之后接烘焙棚与露天咖啡桌，建筑各出现一次。
  const rx=540-offset;r(rx,-141,126,100,'#d2b688');roof(rx-2,-145,130);r(rx+13,-123,40,83,'#686f57');r(rx+76,-101,25,40,'#665847');r(rx+81,-115,15,14,'#82765a');r(rx+85,-137,6,22,'#9b9780');
  const tx=790-offset;for(const x of [tx,tx+119]){r(x,-62,71,6,'#d1b083');r(x+31,-56,7,25,'#7f7050');r(x-9,-49,24,5,'#9a8159');r(x+59,-49,24,5,'#9a8159');r(x+26,-71,8,9,'#f2e8c9');}tree(1055-offset,-30,1.4);tree(1188-offset,-30,.9);
 }else{
  const offset=camera*.62;
  // 有限的四间店铺：位置、宽高、门窗和用途均不同，不循环生成街屋。
  for(const [at,w,h,name,kind]of [[332,152,172,'老茶号',0],[552,126,204,'茶咖小院',1],[754,170,151,'豆汤米干',2],[1008,138,185,'竹编铺',3]]){const x=at-offset;
   r(x,-h-35,w,h,kind%2?'#cec1a0':'#dfcba7');roof(x,-h-36,w);r(x+9,-101,w-18,66,'#655d48');
   if(kind===1){windows(x+13,-h-18,4,2,25,28);r(x+12,-116,w-24,7,'#947855');}else{for(let k=0;k<Math.floor(w/27);k++){r(x+10+k*26,-h-20,17,38,'#74654e');r(x+15+k*26,-h-17,3,32,'#b6a079');}}
   sign(name,x+12,-133,w-24);for(let k=0;k<3;k++)r(x+14+k*(w-30)/3,-96,4,61,'#ab895b');r(x+2,-35,w-4,5,'#a18e6e');
   if(kind===0){r(x+32,-61,29,25,'#ad7f53');r(x+78,-69,23,33,'#8c7050');}if(kind===1){r(x+35,-70,50,5,'#b28b59');r(x+57,-65,5,29,'#866d49');r(x+48,-77,7,7,'#f2e4bf');}if(kind===2){r(x+25,-75,110,7,'#bba36f');r(x+39,-89,20,14,'#b5b4a0');r(x+90,-83,27,8,'#d9c7a1');}if(kind===3){for(let k=0;k<3;k++)r(x+19+k*35,-65-k*5,25,29+k*5,'#b89961');}
  }
  // 参考图的白灰砖招牌墙：立体灰字作底，暖光“思茅老街”为视觉锚点。
  const wallX=24-offset;
  r(wallX,-277,254,238,'#babfc1');roof(wallX-2,-279,258);
  for(let row=0;row<16;row++){r(wallX,-269+row*14,254,1,'#939d9f');for(let col=0;col<12;col++)r(wallX+col*24+(row%2)*12,-268+row*14,1,12,'#9ca5a6');}
  // 清除背景装饰字，只保留一次主招牌。
  r(wallX+9,-210,236,68,'#d9ccb0');r(wallX+14,-205,226,58,'#ebd9b3');r(wallX+20,-199,214,45,'#f5e5be');
  text('思 茅 老 街',wallX+127,-170,28,'#6e3629');text('SI MAO LAO JIE',wallX+127,-151,10,'#784b39');
  // 无字装饰：小盆栽、木凳与一只陶罐。
  tree(294-offset,-32,.55);r(287-offset,-47,16,16,'#ac8061');r(492-offset,-53,35,5,'#94754e');r(496-offset,-48,4,12,'#6b5943');r(519-offset,-48,4,12,'#6b5943');
  // 石板巷道与暖色门灯。
  for(let n=-1;n<32;n++){const x=n*52-offset;r(x,-29,47,2,'#d7c5a2');r(x+12,-17,48,2,'#988b73');}
 }
 ctx.restore();
}
window.PuerBackgrounds={draw};
})();
