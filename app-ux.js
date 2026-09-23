(function(){
  function list(){ return (typeof modules==="function") ? modules() : []; }
  function signoffMod(){ return list().filter(function(m){ return m.signoff; })[0] || null; }
  function workMods(){ return list().filter(function(m){ return !m.signoff; }); }
  function signoffReady(){
    var work = workMods();
    if(!work.length) return false;
    return work.every(function(m){ return moduleDone(m.id); });
  }
  function missingNames(){
    return workMods().filter(function(m){ return !moduleDone(m.id); }).map(function(m){ return m.title; });
  }
  function pathPct(){
    var all = list();
    if(!all.length) return 0;
    var done = all.filter(function(m){ return moduleDone(m.id); }).length;
    return Math.round(done / all.length * 100);
  }
  function modulePct(){
    var m = (typeof moduleData==="function") ? moduleData() : null;
    if(!m || m.quiz || m.signoff) return 0;
    var saved = getChecks(m.id);
    var total = (m.sections||[]).reduce(function(a,s){ return a + ((s[2]||[]).length); }, 0);
    if(!total) return 0;
    var n = 0;
    Object.keys(saved).forEach(function(k){ if(saved[k]===true) n++; });
    return Math.round(n / total * 100);
  }
  function paintBar(){
    var pp = pathPct();
    var mp = modulePct();
    var fill = document.getElementById("pathFill");
    var lab = document.getElementById("pathPctLab");
    var sub = document.getElementById("pathPctSub");
    var p = (typeof pathData==="function") ? pathData() : null;
    if(fill) fill.style.width = pp + "%";
    if(lab) lab.textContent = pp + "%";
    if(sub) sub.textContent = (p ? (p.level + " " + p.name) : "PATH") + "  ·  module " + mp + "%";
    var marks = document.querySelectorAll(".pmark");
    for(var i=0;i<marks.length;i++){
      var v = Number(marks[i].getAttribute("data-v"));
      marks[i].classList.toggle("hit", pp >= v);
    }
  }
  function burst(n, big){
    var c = document.getElementById("burst");
    if(!c || !c.getContext) return;
    var x = c.getContext("2d");
    c.width = innerWidth; c.height = innerHeight;
    var bits = [];
    for(var i=0;i<n;i++){
      bits.push({
        x: innerWidth/2 + (Math.random()-0.5)*80,
        y: innerHeight/2 + (Math.random()-0.5)*40,
        vx: (Math.random()-0.5) * (big ? 18 : 8),
        vy: -Math.random() * (big ? 16 : 7) - 2,
        life: 1,
        s: big ? (3+Math.random()*5) : (2+Math.random()*3),
        col: ["#00ff87","#60efff","#ffcc00","#ff0080","#ffffff"][i%5]
      });
    }
    var t0 = Date.now();
    (function tick(){
      var dt = 0.016;
      x.clearRect(0,0,c.width,c.height);
      var alive = false;
      bits.forEach(function(b){
        b.vy += 18*dt; b.x += b.vx; b.y += b.vy; b.life -= big ? 0.012 : 0.02;
        if(b.life<=0) return;
        alive = true;
        x.globalAlpha = Math.max(0,b.life);
        x.fillStyle = b.col;
        x.fillRect(b.x, b.y, b.s, b.s);
      });
      x.globalAlpha = 1;
      if(alive && Date.now()-t0 < 2600) requestAnimationFrame(tick);
      else x.clearRect(0,0,c.width,c.height);
    })();
  }
  function showMark(title, sub, cls, big){
    var fx = document.getElementById("markFX");
    var t = document.getElementById("markTitle");
    var s = document.getElementById("markSub");
    if(!fx) return;
    if(t) t.textContent = title;
    if(s) s.textContent = sub;
    fx.className = "markfx show " + (cls||"");
    burst(big ? 140 : 36, !!big);
    clearTimeout(showMark._t);
    showMark._t = setTimeout(function(){ fx.className = "markfx"; }, big ? 2800 : 1600);
  }
  function checkMarks(){
    state.seenMarks = state.seenMarks || {};
    var key = (activePath||"path") + ":pct";
    var pct = pathPct();
    var steps = [
      {v:25, title:"QUARTER MARK", sub:"25% of this path is locked in.", cls:"m25"},
      {v:50, title:"HALFWAY", sub:"50%. Keep the standard.", cls:"m50"},
      {v:75, title:"THREE QUARTERS", sub:"75%. Finish clean.", cls:"m75"},
      {v:100, title:"PATH COMPLETE", sub:"100%. That is the standard.", cls:"m100"}
    ];
    var last = state.seenMarks[key] || 0;
    for(var i=0;i<steps.length;i++){
      if(pct >= steps[i].v && last < steps[i].v){
        showMark(steps[i].title, steps[i].sub, steps[i].cls, steps[i].v===100);
        state.seenMarks[key] = steps[i].v;
        if(typeof save==="function") save();
      }
    }
    if(pct < last){ state.seenMarks[key] = pct < 25 ? 0 : pct < 50 ? 25 : pct < 75 ? 50 : 75; }
  }
  function paintLockedCert(){
    var host = document.getElementById("main");
    if(!host) return;
    var miss = missingNames();
    var next = workMods().filter(function(m){ return !moduleDone(m.id); })[0];
    host.innerHTML =
      '<section class="cert">'+ 
        '<div class="cert-kicker">LOCKED UNTIL THE END</div>'+
        '<h2>Certificate waits</h2>'+
        '<p class="cert-line">Sign-off is the last step on this path.</p>'+
        '<p class="cert-sub">Finish every module and pass the quiz first.</p>'+
        '<p class="cert-path">'+(miss.length? (miss.length+" left") : "")+'</p>'+
        '<div class="note" style="text-align:left">Still open: '+esc(miss.slice(0,4).join(" · "))+(miss.length>4?" …":"")+'</div>'+
        (next?'<div class="footer-actions"><button class="btn primary" id="goNextWork">Go to '+esc(next.title)+'</button></div>':'')+
        '<div class="cert-foot">The certificate only prints after the work is done.</div>'+
      '</section>';
    var b = host.querySelector("#goNextWork");
    if(b && next) b.onclick = function(){ selectModule(next.id); };
  }
  function paintCert(){
    var m = moduleData();
    if(!m || !m.signoff) return;
    if(!signoffReady()){ paintLockedCert(); return; }
    var host = document.getElementById("main");
    if(!host) return;
    var saved = getChecks(m.id);
    var f = saved.fields || {};
    var p = pathData() || {level:"LEVEL 1", name:"New Technician"};
    var done = saved.signoff;
    host.innerHTML =
      '<section class="cert '+(done?"signed":"")+'">'+ 
        '<div class="cert-kicker">NEXUS · HOOD BOSS · FINAL STEP</div>'+
        '<h2>Certificate of Participation</h2>'+
        '<p class="cert-line">This certifies participation in</p>'+
        '<p class="cert-path">'+esc(p.level)+'<br>'+esc(p.name)+'</p>'+
        '<p class="cert-sub">Kitchen Exhaust Cleaning field training · company record only</p>'+
        '<div class="cert-fields">'+
          '<label><span>Technician</span><input id="signTech" class="text-input" value="'+esc(f.tech||"")+'"></label>'+
          '<label><span>Supervisor</span><input id="signSupervisor" class="text-input" value="'+esc(f.supervisor||"")+'"></label>'+
          '<label><span>Date</span><input id="signDate" class="text-input" type="date" value="'+esc(f.date||new Date().toISOString().slice(0,10))+'"></label>'+
        '</div>'+
        (done?'<div class="cert-stamp">RECORDED</div>':'')+
        '<div class="footer-actions"><button class="btn primary" id="signBtn">'+(done?"Update Certificate":"Sign Certificate")+'</button></div>'+
        '<div class="cert-foot">DoubleA · AntManThePro · NExtended Xperimental USers</div>'+
      '</section>';
    var btn = host.querySelector("#signBtn");
    if(btn) btn.onclick = function(){
      saved.fields = {
        tech: (host.querySelector("#signTech")||{}).value||"",
        supervisor: (host.querySelector("#signSupervisor")||{}).value||"",
        date: (host.querySelector("#signDate")||{}).value||""
      };
      saved.signoff = true;
      state.progress[moduleKey(m.id)] = saved;
      save();
      renderAll();
      showMark("SIGNED", "Participation recorded on this device.", "m100", true);
    };
  }
  var _update = typeof updateStats==="function" ? updateStats : function(){};
  updateStats = function(){ _update(); paintBar(); checkMarks(); };
  var _renderMain = typeof renderMain==="function" ? renderMain : function(){};
  renderMain = function(){
    _renderMain();
    var m = moduleData();
    if(m && m.signoff) paintCert();
  };
  var _select = typeof selectModule==="function" ? selectModule : function(){};
  selectModule = function(mid){
    var target = list().filter(function(m){ return m.id===mid; })[0];
    if(target && target.signoff && !signoffReady()){
      _select(mid);
      paintLockedCert();
      if(typeof toast==="function") toast("Certificate is last. Finish the modules and quiz first.");
      return;
    }
    _select(mid);
  };
  var _drop = typeof renderModuleDrop==="function" ? renderModuleDrop : function(){};
  renderModuleDrop = function(){
    _drop();
    var host = document.getElementById("modList");
    if(!host) return;
    var so = signoffMod();
    if(!so) return;
    var ready = signoffReady();
    host.querySelectorAll(".dd-item").forEach(function(btn){
      var oc = btn.getAttribute("onclick")||"";
      if(oc.indexOf(so.id)===-1) return;
      btn.innerHTML = (ready ? "END  " : "LOCKED  ") + (so.title||"Sign-Off");
    });
  };
  renderModulesNav = function(){
    var host = document.getElementById("moduleList");
    if(host) host.innerHTML = "";
  };
  window.selectModule = selectModule;
  window.renderModuleDrop = renderModuleDrop;
  window.renderModulesNav = renderModulesNav;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", paintBar);
  else paintBar();
})();
