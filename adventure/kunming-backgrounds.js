/* 昆明有限路线景观，不循环平铺建筑。 */
(()=>{
function draw(ctx,W,H,camera,scene){
 const floor=H-55,stage=['kunming-lake','kunming-flowers','kunming-garden'].indexOf(scene),off=camera*.58;
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(floor+y),w,h);};
 const text=(s,x,y,c='#fff0c9',size=12)=>{ctx.fillStyle=c;ctx.textAlign='center';ctx.font=`bold ${size}px monospace`;ctx.fillText(s,x,floor+y);};
 const flower=(x,y,c,scale=1)=>{r(x,y,2*scale,18*scale,'#559364');r(x-6*scale,y-4*scale,14*scale,5*scale,c);r(x-2*scale,y-8*scale,6*scale,14*scale,c);r(x,y-2*scale,2*scale,2*scale,'#f9d779');};
 const tree=(x,y,size=1)=>{r(x,y-80*size,7*size,80*size,'#8c8060');r(x-28*size,y-94*size,62*size,30*size,'#7b9c76');r(x-17*size,y-115*size,41*size,28*size,'#97b48a');};
 const roof=(x,y,w,c='#6e8d85')=>{r(x-9,y,w+18,8,c);r(x,y-8,w,8,c);r(x+15,y-16,w-30,8,c);};
 ctx.save();ctx.fillStyle=['#b3dfe7','#d8e1cf','#eddbb5'][stage];ctx.fillRect(0,0,W,H);
 for(const [x,y,w]of [[-100,-348,46],[168,-315,37],[415,-367,62],[720,-329,48],[1060,-356,53]]){r(x-camera*.08,y,w,11,'#fff3dc');r(x+8-camera*.08,y-7,w-16,8,'#fff3dc');}
 for(const [at,w,h]of [[-90,280,95],[140,330,120],[488,225,86],[810,310,111],[1130,290,99]]){const x=at-camera*.13;for(let k=0;k<8;k++)r(x+k*13,-120-k*h/8,w-k*26,130+k*h/8,'#9bb7a0');}
 if(stage===0){
  // 参考滇池照片：粉橙晚霞、蓝灰远山、低矮城市天际线和有风的湖面。
  const horizon=Math.round(H*.59),sky=['#eec5b2','#edc1ae','#e6b6ab','#d5b0af','#b6aab0','#98a9b3'];
  for(let j=0;j<sky.length;j++){ctx.fillStyle=sky[j];ctx.fillRect(0,j*horizon/sky.length,W,Math.ceil(horizon/sky.length)+1);}
  for(const [at,y,w,h,c]of [[-80,48,230,9,'#efc9b8'],[205,79,180,7,'#dfbbb2'],[468,119,247,8,'#e8b5a9'],[789,45,192,13,'#efc6b1'],[1024,135,225,9,'#ceaeb1'],[1300,94,165,7,'#e3b3aa']]){ctx.fillStyle=c;ctx.fillRect(at-camera*.09,y,w,h);}
  const ridge=[[0,31],[64,49],[128,36],[192,62],[256,48],[320,31],[384,37],[448,57],[512,46],[576,65],[640,43],[704,36],[768,48],[832,26],[896,39],[960,53],[1024,33],[1088,24],[1152,44],[1216,35],[1280,22]];
  for(let k=0;k<ridge.length-1;k++){const [at,h]=ridge[k],next=ridge[k+1][1],x=at-camera*.13;for(let j=0;j<8;j++){ctx.fillStyle='#638596';ctx.fillRect(x+j*8,horizon-h-(next-h)*j/8,9,h+(next-h)*j/8+12);}}
  for(const [at,w,h]of [[27,52,20],[115,21,28],[173,65,16],[311,29,23],[406,48,17],[571,22,31],[622,74,22],[841,37,18],[962,56,26],[1100,28,14]]){const x=at-camera*.23;ctx.fillStyle='#a6b1ae';ctx.fillRect(x,horizon-h+12,w,h);ctx.fillStyle='#c3c3b4';for(let j=5;j<w;j+=9)ctx.fillRect(x+j,horizon-h+15,2,h-4);}
  ctx.fillStyle='#73918e';ctx.fillRect(0,horizon+21,W,H-horizon-21);
  for(let row=0;row<12;row++){const y=horizon+29+row*13;for(let k=0;k<16;k++){const x=k*91+(row%3)*31-camera*(.18+row*.025),w=16+(k*13+row*7)%38;ctx.fillStyle=['#abb8ac','#5f817d','#cad0b9','#8ca398'][(k+row)%4];ctx.fillRect(x,y,w,2+Math.floor(row/4));ctx.fillRect(x+7,y-2,w/2,2);}}
  // 白色沿湖栈道只延伸通过一段，之后是芦苇、停船、观景长椅与花坡。
  const bx=26-off;r(bx,-101,245,5,'#e3d8bd');r(bx,-128,245,3,'#d9dfcd');for(let k=0;k<11;k++)r(bx+k*24,-128,3,28,'#c8d4c5');
  const reed=349-off;for(let j=0;j<8;j++){r(reed+j*10,-69-j%3*8,2,40+j%3*8,'#647d62');r(reed+j*10-5,-70-j%3*8,6,3,'#9da27b');}
  const boat=535-off;r(boat,-74,91,5,'#8b8a75');r(boat+10,-69,71,6,'#b7a886');r(boat+20,-64,51,4,'#6f8275');r(boat+37,-91,4,17,'#bcb99a');
  const bench=747-off;r(bench,-67,83,7,'#a99374');r(bench,-92,83,6,'#c0ac89');r(bench+8,-86,4,19,'#8c8068');r(bench+69,-86,4,19,'#8c8068');r(bench+10,-60,5,31,'#777968');r(bench+67,-60,5,31,'#777968');
  for(const [at,y,col]of [[953,-45,'#d4a5a5'],[984,-53,'#e8c496'],[1030,-42,'#cca7b7'],[1076,-59,'#e4b99e'],[1149,-46,'#d2a8ac']])flower(at-off,y,col);
  const sign=110-off;r(sign,-75,3,45,'#a59575');r(sign-32,-91,68,20,'#526e6e');text('滇池晚霞',sign+2,-77,'#f4dfc1',10);

 }else if(stage===1){
  // 花卉市场：高挑钢架天棚、采光窗、灯具与各不相同的花摊。
  r(0,-H,W,H-28,'#c7d0bb');r(0,-H,W,H-300,'#dae2d4');
  const line=(x1,y1,x2,y2,c,width=3)=>{const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/4);for(let k=0;k<=n;k++)r(x1+(x2-x1)*k/n,y1+(y2-y1)*k/n,width,width,c);};
  for(let n=-1;n<11;n++){const x=n*145-off*.5;r(x,-H+35,104,32,'#e7f3dd');r(x+4,-H+39,96,24,'#b7d8d8');r(x+47,-H+35,4,32,'#a2afa0');line(x,-H+90,x+145,-H+90,'#a0a995',4);line(x,-H+90,x+72,-H+165,'#f2e9cf');line(x+72,-H+165,x+145,-H+90,'#f2e9cf');line(x,-H+90,x+145,-H+165,'#a1a995');r(x,-H+166,145,4,'#f1e9cd');}
  // 层层钢梁与斜撑延伸到展厅中部，保留花摊前景的清晰轮廓。
  for(let row=0;row<3;row++){const y=-H+180+row*55;for(let n=-1;n<11;n++){const x=n*126-off*(.35+row*.08);r(x,y,126,3,'#d4d4b9');line(x,y,x+63,y+49,'#a6ad96',3);line(x+63,y+49,x+126,y,'#e4dfc2',3);r(x+61,y+2,3,46,'#c9cbb0');}}
  for(const [at,y]of [[89,-255],[390,-279],[698,-252],[1003,-271]]){const x=at-off;r(x,y-57,2,50,'#969c89');r(x-9,y-7,20,4,'#a4aca0');r(x-15,y-3,32,7,'#f5e4b6');r(x-10,y+4,22,3,'#fff3cd');}
  const display=(at,w,h,c)=>{const x=at-off;r(x,-h-28,w,h,c);r(x+5,-h-22,w-10,5,'#c4c7ac');r(x,-61,w,7,'#a6a88c');return x;};
  let dx=display(6,177,109,'#809a89');for(let k=0;k<6;k++){r(dx+8+k*27,-56,21,28,'#b5bb9d');flower(dx+18+k*27,-87-k%3*9,['#db8fa5','#e6c96e','#c4a5cc'][k%3],1.2);}
  // 高低错落的盆栽展示架。
  dx=298-off;for(let row=0;row<3;row++){r(dx+row*14,-62-row*34,147-row*20,5,'#baa77d');for(let k=0;k<4-row;k++){r(dx+row*14+k*32+5,-81-row*34,22,19,'#b69b7d');flower(dx+row*14+k*32+15,-100-row*34,['#d896b0','#e5ce90','#baa2c5'][row]);}}
  // 包装工作台，有纸筒、丝带和一大束鲜花。
  dx=541-off;r(dx,-77,148,9,'#b2a17d');r(dx+8,-68,7,39,'#7b8d77');r(dx+132,-68,7,39,'#7b8d77');for(let k=0;k<4;k++)r(dx+10+k*14,-96,9,19,'#e8dcc2');r(dx+83,-112,36,34,'#e3d9bc');for(let k=0;k<3;k++)flower(dx+86+k*14,-130-k%2*8,'#d6a2b6');r(dx+56,-83,14,6,'#9eae96');
  // 绿植角与种苗推架。
  dx=799-off;for(const [x,h,w]of [[0,50,24],[39,78,32],[95,42,19],[131,61,27]]){r(dx+x,-51,w,23,'#ad9b76');r(dx+x+w/2,-51-h,3,h,'#6d8c69');r(dx+x-7,-52-h,w+14,15,'#8ca783');r(dx+x,-65-h,w,15,'#9cb58d');}

  const signX=33-off;r(signX,-246,2,24,'#919d87');r(signX+194,-246,2,24,'#919d87');r(signX,-222,196,37,'#708957');r(signX+5,-217,186,27,'#849b61');text('昆明 · 花卉市场',signX+98,-199,'#f8edd0',14);flower(signX+17,-201,'#fff2c9',.6);
  const sx=573-off;r(sx,-207,134,27,'#b7bca0');text('鲜花与春天',sx+67,-188,'#496b55');
  // 末段从花桶与包装纸经过搬运推车和绿植区，整段不重复同一个摊位。
  const cart=1040-off;r(cart,-70,74,5,'#b0a988');r(cart+5,-65,4,35,'#7c8f7d');r(cart+65,-65,4,35,'#7c8f7d');r(cart+11,-34,9,7,'#526e62');r(cart+56,-34,9,7,'#526e62');for(let k=0;k<3;k++){r(cart+7+k*22,-91,18,21,'#a6ac84');flower(cart+15+k*22,-110,['#d5a8bd','#e2c990','#dfa5a3'][k]);}

 }else{
  const x=24-off;r(x,-190,174,154,'#d9cba4');r(x+20,-125,134,90,'#759384');r(x+35,-111,104,76,'#a8b5a0');roof(x-6,-194,186);roof(x+21,-139,130);text('昆明 · 春城',x+87,-162,'#5d7061',16);
  const px=337-off;r(px,-101,87,64,'#c4b28a');roof(px-10,-107,107,'#938e76');r(px+6,-98,5,62,'#8a7c64');r(px+75,-98,5,62,'#8a7c64');r(px+17,-55,53,5,'#ab9877');
  const fx=540-off;for(let j=0;j<3;j++){r(fx+j*13,-59-j*13,130-j*26,12,'#a89b76');for(let k=0;k<5-j;k++)flower(fx+10+j*13+k*22,-74-j*13,['#dca5b6','#e1c682','#c6a4c3'][j]);}
  tree(790-off,-28,1.3);const tx=944-off;r(tx,-64,76,6,'#b49c78');r(tx+34,-58,6,29,'#8a8168');r(tx+16,-74,9,10,'#eee2bd');r(tx+51,-74,9,10,'#eee2bd');tree(1138-off,-28,.85);
 }
 r(0,-28,W,28,'#a8b88a');ctx.restore();
}
window.KunmingBackgrounds={draw};
})();
