const TRACKS={coco:'assets/music/coco.ogg?v=3f30193a3dd4',benson:'assets/music/benson.ogg?v=3f30193a3dd4'};

export class AudioEngine {
  constructor(){
    this.enabled=true;this.phase='meadow';this.paused=false;this.started=false;this.skin=null;
    this.music=new Audio();this.music.id='background-music';this.music.preload='none';this.music.loop=true;
    this.music.setAttribute('aria-hidden','true');
    if(typeof document!=='undefined')document.body.append(this.music);
  }
  setSkin(skin,reset=false){
    const next=skin==='benson'?'benson':'coco';
    if(this.skin!==next){this.music.pause();this.skin=next;this.music.dataset.skin=next;this.music.src=TRACKS[next];this.music.load();}
    else if(reset)this.music.currentTime=0;
    this.syncPlayback().catch(()=>{});
  }
  async start(){
    if(!this.skin)this.setSkin('coco');
    this.started=true;
    const playback=this.syncPlayback();
    if(!this.ctx){
      const Context=window.AudioContext||window.webkitAudioContext;
      if(Context){this.ctx=new Context();this.master=this.ctx.createGain();this.master.gain.value=.16;this.master.connect(this.ctx.destination);}
    }
    const contextReady=this.ctx?.state==='suspended'?this.ctx.resume():Promise.resolve();
    await Promise.all([playback,contextReady]);this.volume();
  }
  syncPlayback(){
    if(!this.started||!this.enabled||this.paused){this.music.pause();return Promise.resolve();}
    if(!this.music.paused)return Promise.resolve();
    return Promise.resolve(this.music.play()).catch(error=>{if(error.name!=='AbortError')throw error;});
  }
  volume(){
    this.music.muted=!this.enabled;
    if(this.ctx)this.master.gain.setTargetAtTime(!this.enabled||this.paused?0:.16,this.ctx.currentTime,.04);
  }
  setPhase(phase){this.phase=phase;}
  // Keep the supplied recording unchanged across chapters and dialogue.
  duck(){}
  fade(){}
  pause(yes){this.paused=yes;this.volume();this.syncPlayback().catch(()=>{});}
  toggle(){this.enabled=!this.enabled;this.volume();this.start().catch(()=>{});return this.enabled;}
  note(midi,time,duration=1,gain=.1,type='sine'){
    if(!this.ctx)return;
    const osc=this.ctx.createOscillator(),g=this.ctx.createGain();osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
    g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(gain,time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);
    osc.connect(g);g.connect(this.master);osc.start(time);osc.stop(time+duration+.02);osc.onended=()=>{osc.disconnect();g.disconnect();};
  }
  effect(kind){
    if(!this.ctx||!this.enabled||this.paused)return;
    const t=this.ctx.currentTime;
    if(kind==='collect'){this.note(79,t,.25,.25);this.note(84,t+.07,.35,.2);}
    if(kind==='jump')this.note(67,t,.12,.08,'triangle');
    if(kind==='bark'){this.note(47,t,.09,.25,'triangle');this.note(51,t+.1,.1,.2,'triangle');}
    if(kind==='bossHit'){this.note(72,t,.25,.15);this.note(76,t+.1,.3,.15);}
    if(kind==='bump')this.note(43,t,.16,.1,'triangle');
  }
}
