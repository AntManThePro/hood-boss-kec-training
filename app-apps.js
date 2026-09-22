
const APPS = [
  {id:"academy",name:"Hood Boss Academy",label:"TECH - TRAINING",host:"Netlify",kind:"app",aud:"tech",url:"https://hbacademy.netlify.app/",blurb:"Main field academy - L1-L4"},
  {id:"playbook",name:"Field Tech Playbook",label:"TECH - ON THE JOB",host:"Vercel",kind:"app",aud:"tech",url:"https://hood-boss-field-playbook-4001xvgm9-antmanthepros-projects.vercel.app/",blurb:"Photos, defects, white glove, leave-the-job gate"},
  {id:"mtpguide",name:"MyTechPix Guide",label:"TECH - PHOTOS",host:"Netlify",kind:"app",aud:"tech",url:"https://mytechpix-guide-for-techs.netlify.app/",blurb:"How to shoot Blue / Green / Red on the phone"},
  {id:"q10",name:"HB-Q10 Field Proof",label:"TECH - STANDARD",host:"Netlify",kind:"app",aud:"tech",url:"https://hb-cect-orientation.netlify.app/",blurb:"What the photos have to prove"},
  {id:"safety",name:"KEC Safety Meeting",label:"TECH - SAFETY",host:"Netlify",kind:"app",aud:"tech",url:"https://hood-boss-monthly-meeting.netlify.app/",blurb:"General safety meeting plate"},
  {id:"mtp",name:"My Tech Pix app",label:"TECH - PLATFORM",host:"Company",kind:"ref",aud:"tech",url:"https://mytechpix.com/kec-app/",blurb:"Live photo portal used on jobs"},
  {id:"fp",name:"FieldPulse",label:"TECH - PLATFORM",host:"Company",kind:"ref",aud:"tech",url:"https://www.fieldpulse.com/",blurb:"Work orders and checkout"},
  {id:"nfpa",name:"NFPA 96",label:"TECH - CODE",host:"Official",kind:"off",aud:"tech",url:"https://www.nfpa.org/product/nfpa-96-standard/p0096code",blurb:"Ventilation control standard"},
  {id:"osha",name:"OSHA",label:"TECH - SAFETY",host:"Official",kind:"off",aud:"tech",url:"https://www.osha.gov/",blurb:"Ladder, PPE, electrical baseline"},
  {id:"tlos",name:"Team Lead OS",label:"MGR - LEAD",host:"Netlify",kind:"app",aud:"mgr",url:"https://hb-team-lead-os.netlify.app/",blurb:"Best lead system - selection + field gates"},
  {id:"tlprep",name:"Team Lead Path",label:"MGR - LEAD PREP",host:"Netlify",kind:"app",aud:"mgr",url:"https://hb-team-leader.netlify.app/",blurb:"Tech-to-lead prep path"},
  {id:"brief",name:"Lead Briefing",label:"MGR - BRIEFING",host:"Netlify",kind:"app",aud:"mgr",url:"https://team-lead-path.netlify.app/",blurb:"Watch the standard, capture answers"},
  {id:"qa",name:"QA Brain",label:"MGR - QA",host:"GitHub Pages",kind:"app",aud:"mgr",url:"https://antmanthepro.github.io/HBQAbrain/",blurb:"10-agent job review mesh"},
  {id:"cycle",name:"Cycle Gate",label:"MGR - NEW TECH",host:"GitHub Pages",kind:"app",aud:"mgr",url:"https://antmanthepro.github.io/hb-cycle-gate/",blurb:"Week 1/2/4 + monthly gates"},
  {id:"follow",name:"Follow-up OS",label:"MGR - CALLBACKS",host:"Netlify",kind:"app",aud:"mgr",url:"https://hb-followups.netlify.app/",blurb:"Callback / follow-up tracker"},
  {id:"score",name:"Scorecard",label:"MGR - NUMBERS",host:"GitHub Pages",kind:"app",aud:"mgr",url:"https://antmanthepro.github.io/scorecard-dashboard/",blurb:"Crew revenue / labor board"},
  {id:"ready",name:"Recruiting Hub",label:"MGR - HIRE",host:"Netlify",kind:"app",aud:"mgr",url:"https://hood-boss-kec-recruiting-hub.netlify.app/",blurb:"30-second KEC pitch site"},
  {id:"shield",name:"KEC SHIELD v2",label:"MGR ONLY - TWC",host:"Netlify",kind:"app",aud:"mgr",url:"https://kecshield.netlify.app/",blurb:"Incident / TWC defense vault"},
  {id:"github",name:"All GitHub repos",label:"MGR - SOURCE",host:"GitHub",kind:"app",aud:"mgr",url:"https://github.com/AntManThePro?tab=repositories",blurb:"34 public repos - source of truth"}
];
const APP_BY = Object.fromEntries(APPS.map(a=>[a.id,a]));
state.audience = "tech"; try{ if(sessionStorage.getItem("hb-kec-mgr")==="1") state.audience="mgr"; }catch(_){}
function isMgr(){ return state.audience === "mgr"; }
function visibleApps(){ return APPS.filter(a => isMgr() ? true : a.aud !== "mgr"); }
function allowedId(id){ const a=APP_BY[id]; if(!a) return false; return isMgr() || a.aud !== "mgr"; }
const MODULE_APPS = {
  orientation:["academy","q10","nfpa"], shop:["playbook","safety","osha"], arrival:["playbook","mtpguide","mtp","academy"],
  cleaning:["playbook","academy"], "fan-roof":["playbook","osha"], mytechpix:["playbook","mtpguide","mtp","q10"],
  deficiencies:["playbook","mtp"], closeout:["playbook","fp","mtp"], quiz:["academy","q10"], signoff:["academy"],
  "route-ownership":["playbook","fp"], "advanced-readiness":["playbook"], "system-cleaning":["playbook","academy"],
  "roof-special":["playbook","osha"], "proof-discipline":["mtp","playbook","q10"], "callback-prevention":["playbook","mtp"],
  "field-judgment":["playbook","osha"], "self-audit":["playbook","mtp"], "route-plan":["playbook"],
  "lead-readiness":["playbook","osha"], "site-brief":["playbook","mtp"], "crew-control":["playbook"],
  "quality-gates":["playbook","mtp"], "lead-docs":["mtp","fp"], "lead-escalation":["playbook"], operations:["fp"],
  "qa-intake":["mtp","q10"], "photo-audit":["playbook","mtp","q10"], "cleaning-audit":["playbook","academy"],
  "deficiency-audit":["playbook","mtp"], "property-safety":["osha","playbook"], integrity:["q10","mtp"],
  scoring:["q10"], "qa-coaching":["academy"], "field-validation":["academy","playbook"]
};
const PATH_APPS = { "new-tech":["academy","playbook","mtpguide"], "experienced-tech":["playbook","mtp"], "team-lead":["playbook","mtp"], "qa-inspector":["playbook","mtp","q10"] };
const PATH_APPS_MGR = { "new-tech":["cycle","ready"], "experienced-tech":["qa","follow"], "team-lead":["tlos","qa"], "qa-inspector":["qa","score","cycle"] };
const SECTION_HINTS = [
  {re:/photo|mytechpix|blue|green|red|gallery|evidence/i, ids:["playbook","mtp"]},
  {re:/deficien|access panel/i, ids:["playbook","mtp"]},
  {re:/fan|roof|ladder|hinge/i, ids:["playbook","osha"]},
  {re:/quiz|sign-off|sign off|knowledge/i, ids:["academy"]},
  {re:/score|pass \/ fail|automatic fail/i, ids:["q10"]},
  {re:/fieldpulse|revenue|checkout/i, ids:["fp"]}
];
function appChip(id){
  const a=APP_BY[id]; if(!a || !allowedId(id)) return "";
  const cls=a.kind==="ref"?"ref":a.kind==="off"?"off":(a.aud==="mgr"?"mgr":"");
  return '<a class="chip '+cls+'" href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer"><i class="dot"></i>'+esc(a.name)+'</a>';
}
function relatedHTML(mid){
  let ids=[...new Set([...(MODULE_APPS[mid]||[]), ...(PATH_APPS[activePath]||[])])];
  if(isMgr()) ids=[...ids, ...((PATH_APPS_MGR[activePath]||[]))];
  ids=ids.filter(allowedId);
  if(!ids.length) return "";
  const mine=ids.filter(id=>APP_BY[id]&&APP_BY[id].kind==="app");
  const refs=ids.filter(id=>APP_BY[id]&&APP_BY[id].kind!=="app");
  return '<div class="rel"><div class="rel-label">'+(isMgr()?"TECH + MANAGER TOOLS":"TECH TOOLS")+'</div>'+mine.map(appChip).join("")+(refs.length?'<div class="rel-label">JOB PLATFORM / STANDARD</div>':'')+refs.map(appChip).join("")+'</div>';
}
function sectionHintHTML(title){
  const ids=[];
  SECTION_HINTS.forEach(h=>{ if(h.re.test(title||"")) h.ids.forEach(id=>{if(!ids.includes(id) && allowedId(id)) ids.push(id)}) });
  if(!ids.length) return "";
  return '<div class="sec-links">'+ids.slice(0,4).map(appChip).join("")+'</div>';
}
function renderAppDrop(){
  const host=document.getElementById("appList");
  if(!host) return;
  const groups=isMgr()?[["TECH APPS","app","tech"],["MANAGER ONLY","app","mgr"],["JOB PLATFORMS","ref"],["STANDARDS","off"]]:[["TECH APPS","app","tech"],["JOB PLATFORMS","ref"],["STANDARDS","off"]];
  host.innerHTML=groups.map(([label,kind,aud])=>{
    const items=visibleApps().filter(a=>a.kind===kind && (!aud || a.aud===aud));
    if(!items.length) return "";
    return '<div class="dd-group">'+label+'</div>'+items.map(a=>'<a class="dd-item" data-filter="'+esc(a.name+' '+a.blurb)+'" href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer"><strong>'+esc(a.name)+'</strong><small>'+esc(a.label||'')+' - '+esc(a.blurb)+'</small></a>').join("");
  }).join("");
  const av=document.getElementById("audVal");
  if(av) av.textContent=isMgr()?"Manager":"Technician";
}
function renderHeroHub(){
  const host=document.getElementById("heroHub");
  if(!host) return;
  const featured=isMgr()?["academy","tlos","qa","shield","follow","ready"]:["academy","playbook","mtpguide","safety"];
  host.innerHTML=featured.filter(id=>APP_BY[id] && allowedId(id)).map(id=>{
    const a=APP_BY[id];
    return '<a href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer"><b>'+esc(a.name)+'</b><span>'+esc(a.blurb)+'</span></a>';
  }).join("");
}
const MGR_CODE="BOSS96";
function closeGate(){ const g=document.getElementById("mgrGate"); if(g) g.classList.remove("open"); const err=document.getElementById("mgrErr"); if(err) err.textContent=""; }
function toggleAudience(e){
  if(e) e.stopPropagation();
  if(isMgr()){
    state.audience="tech"; try{sessionStorage.removeItem("hb-kec-mgr")}catch(_){}
    activePath=defaultPathId(); activeModule=(TRAINING[activePath]&&TRAINING[activePath].modules&&TRAINING[activePath].modules[0]&&TRAINING[activePath].modules[0].id)||null;
    save(); renderAll(); toast("Back to Level 1 - Technician"); return;
  }
  const g=document.getElementById("mgrGate"); if(g){ g.classList.add("open"); const i=document.getElementById("mgrPass"); if(i){i.value=""; i.focus();} }
}
function unlockManager(e){
  if(e) e.preventDefault();
  const val=(document.getElementById("mgrPass")||{}).value||"";
  const err=document.getElementById("mgrErr");
  if(val.trim()!==MGR_CODE){ if(err) err.textContent="Wrong code. Stay on technician view."; return; }
  state.audience="mgr"; try{sessionStorage.setItem("hb-kec-mgr","1")}catch(_){}
  closeGate(); save(); renderAll(); toast("Manager tools unlocked this session");
}
function copyStack(){
  const rows=visibleApps().map(a=>a.label+'\t'+a.name+'\t'+a.host+'\t'+a.url);
  const text=["LABEL\tNAME\tHOST\tURL"].concat(rows).join("\n");
  const done=function(){ closeMenus(); toast("Tool URLs copied"); };
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text,done);}); }
  else fallbackCopy(text,done);
}
function fallbackCopy(text,done){ const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy")}catch(_){} ta.remove(); done(); }
function renderAll(){
  renderPathDrop(); renderModuleDrop(); renderModulesNav(); renderMain(); updateStats(); renderAppDrop(); renderHeroHub();
  const side=document.querySelector(".sidebar");
  if(side && matchMedia("(max-width:980px)").matches && !side.dataset.ready){
    side.classList.add("rail-shut"); side.dataset.ready="1";
    const b=document.getElementById("railToggle"); if(b) b.textContent="Modules";
  }
}
function bootFX(){
  const c=document.getElementById("fx"); if(!c || !c.getContext) return;
  const x=c.getContext("2d");
  const pts=Array.from({length:48},function(){return {x:Math.random(),y:Math.random(),v:(.15+Math.random()*.35)*.0004,a:Math.random()*Math.PI*2};});
  function resize(){c.width=innerWidth;c.height=innerHeight}
  addEventListener("resize",resize,{passive:true}); resize();
  (function loop(){ x.clearRect(0,0,c.width,c.height); pts.forEach(function(p){ p.a+=0.002; p.x=(p.x+Math.cos(p.a)*p.v+1)%1; p.y=(p.y+Math.sin(p.a)*p.v+1)%1; x.fillStyle="rgba(0,255,135,.22)"; x.fillRect(p.x*c.width,p.y*c.height,1.4,1.4); }); requestAnimationFrame(loop); })();
}
document.addEventListener("click",function(e){ if(!e.target.closest || !e.target.closest(".dd")) closeMenus(); });
document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeMenus(); });
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){renderAll();bootFX();},{once:true});
else {renderAll();bootFX();}
