import {GROUND} from './model.js?v=3f30193a3dd4';
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
function path(c,color,draw,stroke=null,width=1){c.beginPath();draw(c);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.lineJoin='round';c.stroke();}}
function round(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
export function dog(c,x,y,{skin='coco',scale=1,face=1,frame=0,kind='normal',blink=false,alpha=1,sit=false}={}){
  c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(face*scale,scale);c.translate(-80,-100);
  const golden=skin==='coco',fur=golden?'#edbe68':'#414d52',dark=golden?'#d5a054':'#344047',light=golden?'#f9dc9f':'#f4f3df',outline=kind==='shadow'?'#373340':null;
  const sw=outline?5:0,ink='#343d3c';
  // The silhouette uses exactly the same path geometry as the selected puppy.
  const f=col=>kind==='silhouette'?'#35333f':col;
  const limb=(xx,yy,len,col)=>round(c,xx,yy,12,len,6,f(col));
  const stride=Math.sin(frame)*7;
  path(c,f(dark),q=>{q.moveTo(45,65);q.bezierCurveTo(14,75,14,44,7,39);q.bezierCurveTo(5,69,15,91,46,81);q.closePath();},outline,sw);
  if(!golden)path(c,f(light),q=>{q.moveTo(10,48);q.quadraticCurveTo(6,42,7,39);q.quadraticCurveTo(4,62,16,73);q.lineTo(23,65);q.closePath();});
  limb(45,73+stride*.3,26-stride*.3,dark);limb(91,71-stride*.3,28+stride*.3,dark);
  path(c,f(fur),q=>{q.moveTo(40,57);q.bezierCurveTo(55,42,87,44,104,58);q.bezierCurveTo(119,70,108,88,87,87);q.lineTo(48,86);q.bezierCurveTo(33,83,32,66,40,57);q.closePath();},outline,sw);
  if(!golden)path(c,f(light),q=>{q.moveTo(89,56);q.quadraticCurveTo(105,59,110,72);q.lineTo(103,88);q.lineTo(88,84);q.lineTo(92,76);q.lineTo(82,71);q.closePath();});
  limb(53,74-stride*.25,26+stride*.25,fur);limb(99,71+stride*.25,29-stride*.25,golden?fur:light);
  if(!golden){round(c,43,92+stride*.2,15,8,4,f(light));round(c,52,92-stride*.2,15,8,4,f(light));}
  if(!golden)path(c,f(fur),q=>{q.moveTo(97,28);q.lineTo(100,6);q.lineTo(113,20);q.lineTo(125,8);q.lineTo(129,34);q.closePath();},outline,sw);
  path(c,f(fur),q=>{q.moveTo(91,26);q.bezierCurveTo(101,14,122,14,130,29);q.lineTo(135,43);q.bezierCurveTo(156,42,157,57,140,61);q.lineTo(124,66);q.bezierCurveTo(107,68,96,59,92,47);q.closePath();},outline,sw);
  if(!golden){path(c,f(light),q=>{q.moveTo(112,19);q.lineTo(118,20);q.lineTo(122,42);q.quadraticCurveTo(143,43,149,49);q.quadraticCurveTo(149,61,128,64);q.lineTo(119,55);q.lineTo(113,37);q.closePath();});}
  else{oval(c,136,52,17,10,f(light));path(c,f(dark),q=>{q.moveTo(98,24);q.bezierCurveTo(81,22,81,50,91,61);q.bezierCurveTo(100,67,105,51,105,37);q.quadraticCurveTo(105,25,98,24);},outline,sw);}
  if(kind!=='silhouette'){
    if(blink){c.strokeStyle=ink;c.lineWidth=2.5;c.beginPath();c.moveTo(119,36);c.lineTo(126,36);c.stroke();}else{oval(c,122,35,3.2,4,ink);oval(c,123,34,1,1,'#fff9e6');}
    oval(c,150,47,5.2,3.7,ink);c.strokeStyle=ink;c.lineWidth=1.6;c.beginPath();c.moveTo(139,54);c.quadraticCurveTo(134,60,130,55);c.stroke();oval(c,136,60,3.4,4.5,'#e6a18d');
    if(golden)oval(c,122,47,4,2.2,'#e5aa6f');
  }
  c.restore();
}
function mouse(c,x,y,t,stun=false){c.save();c.translate(x,y);c.scale(1,stun?.65:1);c.strokeStyle='#a99499';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(-15,-7);c.bezierCurveTo(-39,-20,-47,5,-34,1);c.stroke();oval(c,-4,-12,22,15,'#a19da2');oval(c,10,-16,14,12,'#aaa5aa');oval(c,6,-30,9,9,'#aaa5aa');oval(c,6,-30,5,5,'#d9b5b3');oval(c,22,-13,3.5,2.5,'#6c6771');oval(c,14,-20,2,2.5,'#3f4143');oval(c,-14,-1,5,3,'#8e8890');oval(c,9,-1,5,3,'#8e8890');if(stun){c.fillStyle='#f6d67f';c.font='15px sans-serif';c.fillText('✦',-8,-45);}c.restore();}
export function tart(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);path(c,'#c7904e',q=>{q.moveTo(-18,-3);q.lineTo(-13,10);q.quadraticCurveTo(0,17,13,10);q.lineTo(18,-3);q.closePath();});oval(c,0,-3,19,10,'#e9b762');oval(c,0,-4,14,7,'#f6df8c');oval(c,5,-5,3,1.5,'#cf9150');oval(c,-5,-2,2,1,'#d6a25b');c.restore();}
function cloud(c,x,y,s,col='#eff9e9'){c.save();c.translate(x,y);c.scale(s,s);path(c,col,q=>{q.moveTo(0,25);q.bezierCurveTo(4,2,18,2,24,16);q.bezierCurveTo(32,-11,46,-9,49,12);q.bezierCurveTo(58,-18,74,-9,72,14);q.bezierCurveTo(86,1,95,13,100,25);q.closePath();});c.restore();}
function tree(c,x,y,s,palette){c.save();c.translate(x,y);c.scale(s,s);path(c,palette.trunk,q=>{q.moveTo(-12,0);q.lineTo(-8,-230);q.lineTo(7,-230);q.lineTo(14,0);q.closePath();});for(let i=0;i<7;i++){const a=(i/7)*TAU;c.save();c.translate(Math.cos(a)*38,-235+Math.sin(a)*34);c.rotate(a);oval(c,0,0,48,21,i%2?palette.leaf:palette.leaf2);c.restore();}oval(c,0,-235,42,45,palette.leaf);c.restore();}
function flower(c,x,y,col){c.strokeStyle='#77946c';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+2,y-19);c.stroke();for(let j=0;j<5;j++){const a=j*TAU/5;oval(c,x+2+Math.cos(a)*5,y-21+Math.sin(a)*5,4,4,col);}oval(c,x+2,y-21,2.5,2.5,'#e9b968');}
const palettes={meadow:{sky:'#a4deda',hill:'#c7dbc0',back:'#93c6b6',ground:'#c4d1ad',top:'#8fad79',deep:'#879e8b',trunk:'#818270',leaf:'#98b567',leaf2:'#adc77e',water:'#87c9c7'},dusk:{sky:'#becbd4',hill:'#d1cbd3',back:'#a2b4bd',ground:'#bdc8b0',top:'#879d83',deep:'#8a999b',trunk:'#898486',leaf:'#9ba89c',leaf2:'#b4bca7',water:'#9cbac4'},boss:{sky:'#c6b8cc',hill:'#d9cdd4',back:'#aaa9bb',ground:'#c0bcb8',top:'#9aa693',deep:'#93959f',trunk:'#8c8394',leaf:'#a1a3aa',leaf2:'#bdbaa9',water:'#a4b7c9'},embrace:{sky:'#f1e8cd',hill:'#e3e6cc',back:'#c3d3be',ground:'#d9ddbb',top:'#a6bd8b',deep:'#a6b5a0',trunk:'#aca17e',leaf:'#bac78d',leaf2:'#ced5a0',water:'#b9d7cb'}};
export class Renderer {
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.backgrounds={};this.white=0;this.mode='menu';this.viewWidth=1280;this.resize();this.makeBackgrounds();}
  resize(){const r=this.canvas.parentElement.getBoundingClientRect();this.viewWidth=Math.round(720*r.width/r.height);this.canvas.width=this.viewWidth;this.canvas.height=720;}
  makeBackgrounds(){for(const [key,p] of Object.entries(palettes)){const b=document.createElement('canvas');b.width=1920;b.height=720;const c=b.getContext('2d');c.fillStyle=p.sky;c.fillRect(0,0,1920,720);oval(c,1320,160,62,62,key==='boss'?'#e6d8d9':'#f4e8bb');cloud(c,120,110,1.1);cloud(c,690,70,.7);cloud(c,1130,190,.9);cloud(c,1630,70,1);path(c,p.hill,q=>{q.moveTo(0,470);q.bezierCurveTo(220,230,430,290,650,440);q.bezierCurveTo(900,250,1100,300,1300,430);q.bezierCurveTo(1600,230,1760,350,1920,390);q.lineTo(1920,720);q.lineTo(0,720);q.closePath();});path(c,p.back,q=>{q.moveTo(0,520);q.bezierCurveTo(330,370,410,470,600,500);q.bezierCurveTo(900,360,1020,410,1300,480);q.bezierCurveTo(1510,390,1700,370,1920,480);q.lineTo(1920,720);q.lineTo(0,720);q.closePath();});c.fillStyle=p.water;c.fillRect(0,550,1920,170);for(let i=0;i<15;i++){c.strokeStyle='#e9f5de55';c.lineWidth=2;c.beginPath();c.moveTo(i*150+20,590+(i%3)*30);c.lineTo(i*150+80,590+(i%3)*30);c.stroke();}tree(c,140,550,.95,p);tree(c,750,550,.6,p);tree(c,1550,550,1.15,p);this.backgrounds[key]=b;}}
  ground(c,g,cam,p){const x=g.x-cam;if(x>this.viewWidth+60||x+g.w<-60)return;const elevated=g.y<GROUND;round(c,x,g.y,g.w,g.h,elevated?12:30,p.deep);round(c,x+3,g.y-7,g.w-6,elevated?16:25,12,p.top);if(!elevated){path(c,p.ground,q=>{q.moveTo(x+18,g.y+18);q.quadraticCurveTo(x+g.w*.4,g.y+28,x+g.w-20,g.y+17);q.lineTo(x+g.w-35,g.y+70);q.quadraticCurveTo(x+g.w*.5,g.y+83,x+28,g.y+68);q.closePath();});for(let i=0;i<g.w/100;i++){const xx=x+50+i*103;if(xx>0&&xx<this.viewWidth)flower(c,xx,g.y+8,i%2?'#fff3cb':'#eab296');}}}
  draw(m,time=0,{menu=false,skin='coco',unlocked=false,white=0}={}){
    const c=this.ctx,W=this.viewWidth,key=menu?'meadow':m.level,p=palettes[key]||palettes.meadow;c.clearRect(0,0,W,720);
    const cam=menu?0:m.camera,bg=this.backgrounds[key]||this.backgrounds.meadow;const off=((cam*.16)%640);c.drawImage(bg,-off,0);if(W>1920-off)c.drawImage(bg,1920-off,0);
    if(menu){this.ground(c,{x:0,y:GROUND,w:W,h:220},0,p);tree(c,W*.83,GROUND,.95,p);dog(c,W*.78,GROUND,{skin,scale:1.8,frame:0,blink:time%4>.0&&time%4<.15});tart(c,W*.65,GROUND-15,1.2);for(let i=0;i<3;i++)flower(c,W*.91+i*22,GROUND+10,'#f5dfaa');return;}
    for(const g of m.map.platforms)this.ground(c,g,cam,p);
    if(['meadow','dusk'].includes(m.level)){
      for(const t of m.map.tarts)if(!t.taken&&t.x-cam>-30&&t.x-cam<W+30){oval(c,t.x-cam,t.y+18,15,3,'#657b6118');tart(c,t.x-cam,t.y+Math.sin(time*2+t.x)*3,.9);}
      for(const mm of m.map.mice)if(mm.x-cam>-50&&mm.x-cam<W+50)mouse(c,mm.x-cam,mm.y,time,mm.stun>0);
      const sx=m.level==='meadow'?Math.max(110,m.player.x-410):Math.min(m.map.width-150,m.player.x+650);dog(c,sx-cam,GROUND,{skin:m.skin,kind:'silhouette',scale:1.05,alpha:m.level==='meadow'?.65:.8});
      const ex=m.map.width-185;round(c,ex-cam-3,GROUND-110,7,110,3,'#899277');path(c,'#f4edd2',q=>{q.moveTo(ex-cam+4,GROUND-113);q.lineTo(ex-cam+74,GROUND-102);q.lineTo(ex-cam+4,GROUND-72);q.closePath();});c.fillStyle='#8ba27a';c.font='22px sans-serif';c.fillText('→',ex-cam+18,GROUND-87);
      const remain=m.map.tarts.filter(t=>!t.taken);if(remain.length&&m.player.x>4500){c.fillStyle='#5c7366';c.font='17px Microsoft YaHei';c.textAlign='center';c.fillText('← 还有蛋挞在小路上',W*.5,390);c.textAlign='left';}
    }
    const b=m.boss;if(m.level==='dusk'&&b.reveal)dog(c,b.x-cam,b.y,{skin:m.skin,kind:'shadow',face:-1,scale:1.18});
    if(['boss','embrace'].includes(m.level)){
      const alpha=m.merge?Math.max(0,1-m.merge):(m.level==='boss'&&b.hp<=0?0:1);dog(c,b.x-cam,b.y,{skin:m.skin,kind:'shadow',face:-1,scale:1.25,alpha:alpha*(b.hit>0?.65:1),blink:time%5<.13});
      if(m.level==='boss'){for(let i=0;i<3;i++){oval(c,b.x-cam-27+i*27,b.y-150,7,7,i<b.hp?'#76677f':'#fff2db66');}if(b.clock>2.5){c.strokeStyle='#7d718c';c.lineWidth=2;c.beginPath();c.ellipse(b.x-cam,GROUND,60+(b.clock-2.5)*25,11,0,0,TAU);c.stroke();}for(const w of m.waves){c.strokeStyle='#8e8299';c.lineWidth=7;c.beginPath();c.arc(w.x-cam,w.y,28,Math.PI,0);c.stroke();}for(const s of m.shots)tart(c,s.x-cam,s.y,.8);}
      if(m.level==='embrace'&&!m.merge){const mark=Math.abs(m.player.x-b.x)<200;c.fillStyle=mark?'#ac805d':'#9b9d7d';c.font='19px Microsoft YaHei';c.textAlign='center';c.fillText(mark?'E · 听听它的心声':'慢慢靠近它 →',Math.min(W-150,b.x-cam),GROUND-155);c.textAlign='left';}
    }
    const pl=m.player,walk=Math.abs(pl.vx)>0&&pl.ground;const y=pl.y+(walk?Math.sin(time*15)*2.5:Math.sin(time*2)*1.1);oval(c,pl.x-cam,pl.y+2,43,7,'#60715f1a');dog(c,pl.x-cam,y,{skin:m.skin,face:pl.face,frame:walk?time*15:0,scale:1.18,blink:time%4<.12,alpha:pl.inv>0&&Math.floor(time*12)%2?.5:1});
    if(pl.bark>.6&&m.level!=='boss'&&m.level!=='embrace'){c.fillStyle='#fff9e7';c.beginPath();c.ellipse(pl.x-cam+pl.face*85,pl.y-95,24,17,0,0,TAU);c.fill();c.fillStyle='#b9895e';c.font='15px Microsoft YaHei';c.textAlign='center';c.fillText('汪',pl.x-cam+pl.face*85,pl.y-90);c.textAlign='left';}
    for(const f of m.particles){c.globalAlpha=Math.max(0,f.life/.7);oval(c,f.x-cam,f.y,3,3,f.color);}c.globalAlpha=1;
    if(m.merge){const glow=c.createRadialGradient(pl.x-cam,pl.y-40,0,pl.x-cam,pl.y-40,250);glow.addColorStop(0,'#fff4bfaa');glow.addColorStop(1,'#fff4bf00');c.fillStyle=glow;c.fillRect(0,0,W,720);}
    if(white>0){c.fillStyle=`rgba(249,248,238,${white})`;c.fillRect(0,0,W,720);}
  }
  portrait(canvas,skin,kind='normal'){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);dog(c,canvas.width*.45,canvas.height*.92,{skin,scale:canvas.width/160,kind});}
}
