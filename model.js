export const SAVE_KEY='little-paw-dream-v1';
export const GROUND=548;
export function loadProfile(storage){try{const p=JSON.parse(storage.getItem(SAVE_KEY)||'{}');return {unlocked:!!p.unlocked,completed:Number(p.completed)||0,run:p.run||null};}catch{return{unlocked:false,completed:0,run:null};}}
export function writeProfile(storage,p){try{storage.setItem(SAVE_KEY,JSON.stringify(p));return true;}catch{return false;}}
export function completeProfile(profile,skin){return {...profile,unlocked:profile.unlocked||skin==='coco',completed:profile.completed+1,run:null};}
export function makeLevel(kind){
  if(kind==='boss'||kind==='embrace')return {width:1280,platforms:[{x:0,y:GROUND,w:1280,h:200}],tarts:[],mice:[]};
  const second=kind==='dusk';
  const platforms=[{x:0,y:GROUND,w:820,h:200},{x:940,y:GROUND,w:840,h:200},{x:1910,y:GROUND,w:820,h:200},{x:2860,y:GROUND,w:940,h:200},{x:3910,y:GROUND,w:900,h:200}];
  const ledges=[{x:470,y:455,w:200,h:26},{x:1360,y:452,w:190,h:26},{x:2310,y:455,w:200,h:26},{x:3250,y:452,w:200,h:26},{x:4260,y:455,w:210,h:26}];
  const xs=[350,565,1120,1455,2080,2405,3060,3345,4040,4360];
  const tarts=xs.map((x,i)=>({x,y:i%2?ledges[(i-1)/2].y-29:GROUND-29,taken:false}));
  const mice=(second?[690,1210,1680,2150,2650,3170,3630,4210]:[710,1530,2570,3490]).map((x,i)=>({x,home:x,y:GROUND,dir:i%2?1:-1,flee:0,stun:0}));
  return {width:4800,platforms:[...platforms,...ledges],tarts,mice};
}
export class Model {
  constructor(skin='coco',level='meadow'){this.skin=skin;this.events=[];this.total=0;this.chapterTotals={meadow:0,dusk:0};this.time=0;this.marks={};this.setLevel(level);}
  setLevel(kind){this.level=kind;this.map=makeLevel(kind);this.player={x:kind==='embrace'?220:130,y:GROUND,vx:0,vy:0,face:1,ground:true,coyote:.12,jumpBuffer:0,bark:0,inv:0};this.camera=0;this.checkpoint=130;this.boss={x:970,y:GROUND,hp:3,clock:0,cycle:0,hit:0,reveal:kind==='embrace',closeness:0};this.shots=[];this.waves=[];this.particles=[];this.levelDone=false;this.merge=0;this.events=[];}
  emit(type,data={}){this.events.push({type,...data});}
  drain(){return this.events.splice(0);}
  count(){return this.map.tarts.filter(t=>t.taken).length;}
  act(action){const p=this.player;if(action==='jump')p.jumpBuffer=.16;
    if(action==='bark'&&p.bark<=0){p.bark=.9;
      if(this.level==='embrace'){this.emit('gentle');return;}
      this.emit('bark');
      if(this.level==='boss'){this.shots.push({x:p.x+p.face*45,y:p.y-45,vx:p.face*560});return;}
      for(const m of this.map.mice)if(Math.abs(m.x-p.x)<190&&Math.abs(m.y-p.y)<100){m.stun=3;m.flee=1;this.emit('mouse');}
    }
  }
  step(dt,input={}){
    this.time+=dt;const p=this.player;const oldY=p.y;
    p.bark=Math.max(0,p.bark-dt);p.inv=Math.max(0,p.inv-dt);p.coyote=p.ground?.12:Math.max(0,p.coyote-dt);p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
    p.vx=((input.right?1:0)-(input.left?1:0))*185;
    if(this.merge>0){p.vx=0;this.merge=Math.min(1,this.merge+dt*.35);}
    if(p.vx)p.face=Math.sign(p.vx);
    if(p.jumpBuffer>0&&p.coyote>0){p.vy=-630;p.ground=false;p.coyote=0;p.jumpBuffer=0;this.emit('jump');}
    p.x=Math.max(38,Math.min(this.map.width-55,p.x+p.vx*dt));p.vy+=1450*dt;p.y+=p.vy*dt;p.ground=false;
    for(const g of this.map.platforms)if(p.vy>=0&&oldY<=g.y+3&&p.y>=g.y&&p.x+24>g.x&&p.x-24<g.x+g.w){p.y=g.y;p.vy=0;p.ground=true;}
    if(p.ground&&p.y===GROUND&&this.map.platforms.some(g=>g.y===GROUND&&p.x>g.x+45&&p.x<g.x+g.w-55))this.checkpoint=p.x;
    if(p.y>800){p.x=this.checkpoint;p.y=GROUND-50;p.vy=0;p.inv=1.5;this.emit('retry');}
    const vw=this.viewWidth||1280;this.camera+=((Math.max(0,Math.min(this.map.width-vw,p.x-vw*.34)))-this.camera)*Math.min(1,dt*5);
    for(const t of this.map.tarts)if(!t.taken&&Math.abs(t.x-p.x)<43&&Math.abs(t.y-(p.y-40))<65){t.taken=true;this.total++;this.chapterTotals[this.level]=this.count();this.emit('collect',{x:t.x,y:t.y});}
    for(const m of this.map.mice){m.stun=Math.max(0,m.stun-dt);if(m.flee>0){m.x+=Math.sign(m.x-p.x||1)*120*dt;m.flee-=dt;continue;}if(m.stun>0)continue;m.x+=m.dir*(this.level==='dusk'?49:35)*dt;if(Math.abs(m.x-m.home)>70)m.dir*=-1;
      if(Math.abs(m.x-p.x)<43&&Math.abs(p.y-GROUND)<38&&p.inv<=0){p.inv=1.5;p.vy=-235;p.x=Math.max(40,p.x-45);this.emit('bump');}}
    if(['meadow','dusk'].includes(this.level)){
      if(p.x>2000&&!this.marks[this.level+'Memory']){this.marks[this.level+'Memory']=true;this.emit('memory');}
      if(p.x>4530&&!this.levelDone){if(this.count()>=10){this.levelDone=true;this.emit('levelEnd');}else if(!this.exitTip||this.time-this.exitTip>6){this.exitTip=this.time;this.emit('needTarts',{missing:10-this.count()});}}
    }
    if(this.level==='boss')this.stepBoss(dt);
    for(const f of this.particles){f.life-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=70*dt;}this.particles=this.particles.filter(f=>f.life>0);
  }
  stepBoss(dt){const b=this.boss,p=this.player;b.clock+=dt;b.hit=Math.max(0,b.hit-dt);
    if(b.hp<=0)return;
    if(b.clock>3.4){b.clock=0;b.cycle++;this.waves.push({x:b.x-40,y:GROUND,vx:-170});this.emit('wave');}
    this.shots=this.shots.filter(s=>{s.x+=s.vx*dt;if(Math.abs(s.x-b.x)<65&&Math.abs(s.y-(b.y-40))<105){if(b.hit<=0){b.hp--;b.hit=.9;this.emit('bossHit');if(b.hp===0)this.emit('bossDefeated');}return false;}return s.x>0&&s.x<1280;});
    this.waves=this.waves.filter(w=>{w.x+=w.vx*dt;if(Math.abs(w.x-p.x)<35&&p.y>GROUND-60&&p.inv<=0){p.inv=1.6;p.vy=-240;p.x=Math.max(45,p.x-30);this.emit('bump');}return w.x>-80;});
  }
  burst(x,y,color='#f3cf7d'){for(let i=0;i<10;i++){const a=i*Math.PI/5;this.particles.push({x,y,vx:Math.cos(a)*70,vy:Math.sin(a)*65-30,life:.7,color});}}
  snapshot(){return {skin:this.skin,level:this.level,total:this.total,chapterTotals:{...this.chapterTotals},taken:this.map.tarts.map(t=>t.taken),x:this.player.x,marks:{...this.marks}};}
  static restore(s){const m=new Model(s.skin,s.level);m.total=Number(s.total)||0;m.chapterTotals=s.chapterTotals||{meadow:0,dusk:0};m.marks=s.marks||{};m.map.tarts.forEach((t,i)=>t.taken=!!s.taken?.[i]);m.player.x=Math.max(80,Math.min(m.map.width-90,Number(s.x)||130));const floors=m.map.platforms.filter(g=>g.y===GROUND);if(!floors.some(g=>m.player.x>g.x+35&&m.player.x<g.x+g.w-35)){const prev=floors.filter(g=>g.x<m.player.x).at(-1)||floors[0];m.player.x=Math.min(prev.x+prev.w-65,Math.max(prev.x+65,m.player.x));}m.player.y=GROUND-100;m.checkpoint=m.player.x;m.camera=Math.max(0,Math.min(m.map.width-1280,m.player.x-410));return m;}
}
