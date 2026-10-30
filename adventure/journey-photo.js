/* 回忆合照使用本关实际角色PNG；不重新生成、变形或替换人物。 */
(()=>{
 const cache=new Map();
 function load(asset){const src=asset.src;if(!cache.has(src))cache.set(src,new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{const fallback=new Image();fallback.onload=()=>resolve(fallback);fallback.onerror=()=>resolve(null);fallback.src=window.PixelArt.get('hero',asset.color);};im.src=src||window.PixelArt.get('hero',asset.color);}));return cache.get(src);}
 function spec(level,hero){return {city:level.name,scene:level.photoScene,people:[hero,...level.friends],caption:level.name+' · 我们的合照'};}
 function create(level,hero){
  const data=spec(level,hero),canvas=document.createElement('canvas');canvas.width=960;canvas.height=720;canvas.className='journey-photo';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',data.caption+'，最后登场的莎与'+level.friends.length+'位终点伙伴');canvas.dataset.city=data.city;canvas.dataset.people=String(data.people.length);canvas.dataset.hero=hero.src;
  const ctx=canvas.getContext('2d');
  function base(){ctx.setTransform(1.5,0,0,1.5,0,0);ctx.imageSmoothingEnabled=false;const painter=data.scene.startsWith('banna')?window.BannaBackgrounds:data.scene.startsWith('puer')?window.PuerBackgrounds:window.KunmingBackgrounds;painter.draw(ctx,640,480,0,data.scene);ctx.fillStyle='#a29878';ctx.fillRect(0,393,640,87);ctx.fillStyle='#c5b795';ctx.fillRect(0,393,640,5);for(let i=0;i<12;i++){ctx.fillStyle='#b1a485';ctx.fillRect(i*59,442,49,2);}ctx.fillStyle='#233f4e';ctx.fillRect(17,17,606,42);ctx.fillStyle='#ffe4b0';ctx.textAlign='center';ctx.font='bold 19px monospace';ctx.fillText(data.city+' · 此刻我们在一起',320,45);}
  function finish(){ctx.fillStyle='#eee0ba';ctx.fillRect(0,470,640,10);ctx.fillRect(0,0,8,480);ctx.fillRect(632,0,8,480);ctx.fillStyle='#f7e8c4';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('343云南之旅 · 把笑容和风景一起带走',320,461);}
  base();finish();
  canvas.photoReady=Promise.all(data.people.map(load)).then(images=>{
   base();const count=images.length,gap=530/count;
   images.forEach((im,i)=>{if(!im)return;const asset=data.people[i],f=asset.frame||[0,0,im.naturalWidth,im.naturalHeight],maxH=i===0&&asset.premium?203:181,maxW=gap+18,scale=Math.min(maxW/f[2],maxH/f[3]),w=f[2]*scale,h=f[3]*scale,x=55+gap*(i+.5)-w/2,y=424-h;ctx.fillStyle='#5e74686b';ctx.fillRect(x+w*.12,422,w*.76,5);ctx.drawImage(im,...f,x,y,w,h);});
   finish();canvas.dataset.ready='true';return canvas;
  });return canvas;
 }
 window.JourneyPhoto={create,spec};
})();
