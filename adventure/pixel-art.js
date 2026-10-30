/* 内置像素占位资源：src 留空时使用。之后只需改 config.js 的 src。 */
window.PixelArt=(()=>{
const svg=(w,h,s)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`);
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
function sprite(rows,colors){let s='';rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(colors[c])s+=r(x,y,1,1,colors[c]);}));return svg(rows[0].length,rows.length,s);}
function get(kind,color='#e44632',n=0){
if(kind==='hero')return sprite(['.....rrrrr......','....rrrrrrrrr...','....hhhssks.....','...hshsssksss...','...hshhsssksss..','....hsssskkkk...','.....sssssss....','....rrbrrbrr....','...rrrbrrbrrr...','..rrrrbbbbrrrr..','..ssrbybbybrss..','..sssbbbbbbsss..','....bbbbbbbb....','....bbb..bbb....','...hhh....hhh...','..hhhh....hhhh..'],{r:color,h:'#71381e',s:'#ffc490',k:'#352820',b:'#2868c9',y:'#ffdc49'});
if(kind==='monster')return sprite(['.....hhhhhh.....','...hhhhhhhhhh...','..hhhhhhhhhhhh..','.hhwwhhhhwwhhh..','hhhwkhhhhwkhhhhh','hhhhhhhhhhhhhhhh','hhhhkkkkkkhhhhhh','...ssssssssss...','...ssssssssss...','..kkkk....kkkk..','.kkkkk....kkkkk.'],{h:color==='#9b79bb'?'#a65829':color,w:'#fff2d0',k:'#40291c',s:'#f2b976'});
if(kind==='mushroom')return sprite(['.....rrrrrr.....','...rrrrwwrrrr...','..rrrrwwwwrrrr..','.rrwwrrwwrrwwrr.','rrwwwwrrrrwwwwrr','rrwwwwrrrrwwwwrr','rrrrrrrrrrrrrrrr','...ssssssssss...','....skssksss....','....ssssssss....','.....ssssss.....'],{r:'#eb4031',w:'#fff8df',s:'#ffcc8a',k:'#332b27'});
if(kind==='coin')return sprite(['...yyyy...','..ywwwwy..','.ywwyywwy.','.ywwyywwy.','.ywwyywwy.','.ywwyywwy.','..ywwwwy..','...yyyy...'],{y:'#d58d0b',w:'#ffdf45'});
if(kind==='station'){let s=r(8,0,112,8,'#e44830')+r(0,8,128,16,'#b83224')+r(8,24,8,72,'#934d24')+r(112,24,8,72,'#934d24')+r(0,68,128,12,'#f6c373')+r(8,80,112,16,'#b87838')+r(44,2,40,16,'#ffe2a0')+'<text x="64" y="13" font-size="7" text-anchor="middle" font-family="monospace" fill="#7b341c">TICKETS</text>';for(let x=16;x<112;x+=16)s+=r(x,84,12,2,'#8e552c');return svg(128,96,s);}
if(kind==='destination'){
let s=r(4,54,56,5,'#193829');
if(n%3===0){
// 西双版纳：棕榈与金色傣族寺塔。
s+=r(4,52,55,4,'#71bd42')+r(11,25,5,28,'#a86731')+r(12,29,2,20,'#dfaa57');
for(const [x,y,w,h]of [[3,18,13,4],[0,22,10,4],[8,14,14,4],[17,18,12,4],[22,22,10,4],[15,10,4,9],[4,26,5,3],[26,26,5,3]])s+=r(x,y,w,h,'#37a04a');
s+=r(41,3,3,8,'#ffe398')+r(38,10,9,5,'#ffd455')+r(35,15,15,5,'#e7aa32')+r(32,20,21,5,'#ffd455')+r(29,25,27,5,'#d99727')+r(26,30,33,5,'#ffe07a')+r(30,35,25,16,'#f6bd4c')+r(27,50,31,4,'#c5822c')+r(24,54,37,3,'#e9b84a')+r(39,39,7,12,'#7e4029')+r(32,37,3,11,'#ffe7a5')+r(50,37,3,11,'#ffe7a5');
}else if(n%3===1){
// 普洱：茶芽、茶汤和白瓷茶杯。
s+=r(6,54,50,4,'#b48a4c')+r(9,32,30,4,'#fff0c4')+r(12,36,25,15,'#e5e8c9')+r(15,51,19,3,'#a9c6a3')+r(37,36,9,3,'#fff0c4')+r(43,39,3,8,'#fff0c4')+r(37,47,9,3,'#fff0c4')+r(13,33,22,4,'#678e39')+r(16,34,15,2,'#bad274')+r(16,19,3,9,'#b9d9b6')+r(19,13,3,7,'#b9d9b6')+r(27,16,3,10,'#b9d9b6');
s+=r(45,15,3,18,'#79ad50')+r(39,10,8,5,'#a6d65d')+r(35,6,8,5,'#62ad45')+r(47,9,9,5,'#a5d568')+r(53,5,6,5,'#6ab54b')+r(35,19,10,5,'#4c9c42')+r(31,16,7,4,'#74bd51')+r(48,21,9,5,'#7bc354')+r(54,17,6,5,'#a7d76d');
}else{
// 昆明：花城鲜花，一束彩色像素花。
s+=r(29,25,4,27,'#498c41')+r(22,27,4,10,'#63a94c')+r(25,36,4,14,'#498c41')+r(40,25,4,12,'#6aaf4d')+r(36,35,4,16,'#498c41')+r(18,36,10,4,'#80ba57')+r(39,39,10,4,'#80ba57');
for(const [x,y,petal,shade]of [[17,23,'#fa87b1','#d94c83'],[44,21,'#ffdb66','#e5a83d'],[31,12,'#ff806f','#df4d55'],[31,32,'#c7a1ed','#9671c2']]){s+=r(x-4,y-10,8,6,petal)+r(x-10,y-4,6,8,petal)+r(x+4,y-4,6,8,shade)+r(x-4,y+4,8,6,shade)+r(x-6,y-6,12,12,petal)+r(x-3,y-3,6,6,'#fff0a1')+r(x-1,y-1,3,3,'#d4a03c');}
s+=r(20,43,28,5,'#f3d49d')+r(23,48,22,5,'#dca4ad')+r(26,53,16,5,'#c57f98')+r(30,48,5,10,'#f7e4bd')+r(26,49,15,3,'#f7e4bd');
}return svg(64,64,s);
}
if(kind==='map'){let s=r(0,0,390,430,'#58a83d');for(let x=0;x<390;x+=30)for(let y=0;y<430;y+=30)s+=r(x+5,y+10,4,3,'#73bd50');s+=r(12,50,55,100,'#3686d7')+r(22,40,35,120,'#3686d7')+r(26,65,26,3,'#8ecded')+r(15,115,35,3,'#8ecded');for(const [x,y]of [[310,340],[330,110],[35,370],[205,45]])s+=r(x,y,22,30,'#236e32')+r(x-5,y+8,32,12,'#287c32')+r(x+8,y+28,6,12,'#854e26');return svg(390,430,s);}
if(kind==='background'||kind==='gallery'){const sky=['#6eafff','#29357c','#f9ae65'][n%3],hill=['#3cb64c','#425ca1','#5d9f4b'][n%3];let s=r(0,0,390,520,sky);for(const [x,y]of [[20,95],[210,160],[95,255]]){s+=r(x,y,64,16,'#fff8e5')+r(x+10,y-8,44,32,'#fff8e5')+r(x+22,y-16,20,40,'#fff8e5');}for(const [x,y]of [[-40,400],[160,430],[290,385]]){s+=r(x,y,120,120,hill)+r(x+16,y-16,88,32,hill)+r(x+32,y-32,56,32,hill)+r(x+48,y-48,24,32,hill);}if(n%3===1){s=r(0,0,390,520,'#17224b');for(let x=0;x<390;x+=32){s+=r(x,0,30,18,'#3c548d')+r(x+8,18,15,10,'#33477a');}for(let x=0;x<390;x+=78)s+=r(x,405,55,115,'#29396c')+r(x+10,390,35,15,'#29396c');}return svg(390,520,s);}
return get('hero',color,n);
}return {get};})();
