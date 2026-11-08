
const CITIES=["Edina","Minnetonka","Eden Prairie","Plymouth","Bloomington","Lakeville","Burnsville","Prior Lake","Wayzata","Chanhassen","St. Louis Park","Eagan","Shakopee","Savage","Maple Grove","Apple Valley","Rosemount","Chaska","Victoria","Excelsior","Shorewood","Orono","Medina","Golden Valley","Hopkins","Richfield","Mendota Heights","Inver Grove Heights","Farmington","Minneapolis","St. Paul","Woodbury","North Oaks","White Bear Lake","Stillwater","Shoreview","Deephaven","Greenwood","Minnetonka Beach","Tonka Bay","Woodland","Mound","Minnetrista","Spring Park","Long Lake","Sunfish Lake","West St. Paul","Roseville","Arden Hills","Vadnais Heights","Mahtomedi","Lake Elmo","Cottage Grove","Oakdale","Maplewood","New Brighton","Carver","Hastings"];
const sorted=[...CITIES].sort((a,b)=>a.localeCompare(b));
const ul=document.getElementById('cities'), dl=document.getElementById('city-list');
if(dl)sorted.forEach(c=>{const o=document.createElement('option');o.value=c;dl.appendChild(o);});
const norm=s=>s.toLowerCase().replace(/saint/g,'st').replace(/\./g,'').trim();
const q=document.getElementById('city-q'), out=document.getElementById('city-out');
q.addEventListener('input',()=>{
  const v=norm(q.value);
  ul.querySelectorAll('li').forEach(li=>li.classList.toggle('hit',v.length>1&&norm(li.dataset.c).includes(v)));
  out.className='';
  if(v.length<2){out.textContent='';return;}
  const exact=sorted.find(c=>norm(c)===v);
  if(exact){out.textContent='Yes, we serve '+exact+'.';out.className='yes';}
  else{const m=sorted.filter(c=>norm(c).includes(v));out.textContent=m.length?(m.length<=4?'We serve '+m.join(', ')+'.':m.length+' matching cities.'):'Not on our list yet. Call and we’ll check.';if(m.length)out.className='yes';}
});

(()=>{
  const reduce=true; // motion effects turned off
  if(reduce||!('IntersectionObserver' in window))return;
  const groups=[
    ['.sec-head',''],['.cred','stagger'],['.ticket','rv-zoom'],
    ['.svc','stagger'],['.prob','stagger'],['.job','stagger'],['.step','stagger'],
    ['.about-photo','rv-left'],['.about-copy','rv-right'],['.city-check',''],['.key-cities li','stagger'],['.all-btn',''],
    ['.faq-list details','stagger'],['.contact-grid > div:first-child','rv-left'],['.lead-card','rv-right']
  ];
  const vh=window.innerHeight;
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
  groups.forEach(([sel,mods])=>{
    document.querySelectorAll(sel).forEach((el)=>{
      if(el.getBoundingClientRect().top<vh)return;           // already on screen: leave visible
      el.classList.add('rv');
      mods.split(' ').filter(m=>m&&m!=='stagger').forEach(m=>el.classList.add(m));
      if(mods.includes('stagger')){const sib=[...el.parentElement.children].indexOf(el);el.style.setProperty('--d',(sib*0.12)+'s');}
      io.observe(el);
    });
  });
  setTimeout(()=>document.querySelectorAll('.rv:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<vh&&r.bottom>0)el.classList.add('in');}),1500);
})();
(()=>{const cf=document.getElementById('call-float'),hero=document.querySelector('.hero');const u=()=>cf.classList.toggle('show',hero.getBoundingClientRect().bottom<0);u();addEventListener('scroll',u,{passive:true});})();
(()=>{const h=document.querySelector('header.top');const on=()=>h.classList.toggle('scrolled',window.scrollY>8);on();addEventListener('scroll',on,{passive:true});})();


// ---- service areas toggle ----
(()=>{const b=document.getElementById('all-btn'),l=document.getElementById('cities');
 b.addEventListener('click',()=>{const open=l.hidden;l.hidden=!open;b.setAttribute('aria-expanded',open);b.firstChild.textContent=open?'Show fewer cities ':'View all 58 service areas ';});})();

// ---- depth & scroll effects ----
(()=>{
  const reduce=true; // motion effects turned off
  const fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  const root=document.documentElement,bar=document.getElementById('sp-bar');
  const stage=document.querySelector('.hero-stage'),h1=document.querySelector('.hero h1');
  const track=document.querySelector('.bw-track'),probs=document.querySelector('.problems');
  const aboutImg=document.querySelector('.about-photo img'),about=document.querySelector('.about-photo');
  let ticking=false;
  function frame(){
    ticking=false;const y=scrollY,vh=innerHeight,max=root.scrollHeight-vh;
    bar.style.setProperty('--sp',max>0?Math.min(1,y/max):0);
    if(reduce)return;
    if(stage&&y<vh*1.2){stage.style.setProperty('--hp',(y*0.12)+'px');h1.style.setProperty('--tp',(y*-0.06)+'px');}
    if(probs&&track){const pr=probs.getBoundingClientRect();if(pr.bottom>0&&pr.top<vh)track.style.setProperty('--bw',(-(vh-pr.top)*0.45)+'px');}
    if(about){const ar=about.getBoundingClientRect();if(ar.bottom>0&&ar.top<vh)aboutImg.style.setProperty('--ap',(((ar.top+ar.height/2)-vh/2)*-0.08)+'px');}
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame);}},{passive:true});
  addEventListener('resize',frame);frame();
  if(reduce)return;

  // hero tilt follows the pointer
  if(fine&&stage){const hero=document.querySelector('.hero');
    hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,yy=(e.clientY-r.top)/r.height-.5;
      stage.style.setProperty('--hy',(x*14)+'deg');stage.style.setProperty('--hx',(yy*-10)+'deg');});
    hero.addEventListener('mouseleave',()=>{stage.style.setProperty('--hy','0deg');stage.style.setProperty('--hx','0deg');});
  }

  // tilt cards
  if(fine){document.querySelectorAll('.svc,.prob,.ticket,.cred').forEach(c=>{
    c.classList.add('tilt');const g=document.createElement('span');g.className='glare';c.appendChild(g);
    const max=c.classList.contains('ticket')?7:10;
    c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.setProperty('--ry',((x-.5)*max)+'deg');c.style.setProperty('--rx',((.5-y)*max)+'deg');c.style.setProperty('--gx',(x*100)+'%');c.style.setProperty('--gy',(y*100)+'%');
      c.classList.remove('untilt');c.classList.add('tilting');});
    c.addEventListener('mouseleave',()=>{c.classList.remove('tilting');c.classList.add('untilt');});
  });}

  // price counts up when the offer comes into view
  const price=document.querySelector('.price b');
  if(price&&'IntersectionObserver' in window){const end=179;let done=false;
    const io=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;const t0=performance.now();
      const step=n=>{const k=Math.min(1,(n-t0)/1200),v=Math.round(end*(1-Math.pow(1-k,3)));price.textContent='$'+v;if(k<1)requestAnimationFrame(step);};
      price.textContent='$0';requestAnimationFrame(step);io.disconnect();}},{threshold:.6});
    if(price.getBoundingClientRect().top>innerHeight)io.observe(price);}
})();

// ---- touch: scroll-linked 3D on cards ----
(()=>{
  const reduce=true; // motion effects turned off
  const fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(reduce||fine)return;
  const els=[...document.querySelectorAll('.svc,.prob,.job,.cred,.ticket,.step,.lead-card')];
  els.forEach(e=>e.classList.add('s3d'));
  let tk=false;
  const f=()=>{tk=false;const vh=innerHeight;
    els.forEach(e=>{const r=e.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
      const c=(r.top+r.height/2-vh/2)/vh;               // -0.5 (top) .. 0.5 (bottom)
      const k=Math.max(-1,Math.min(1,c*1.6));
      e.style.rotate='x '+(k*-9).toFixed(2)+'deg';
      e.style.scale=(1-Math.abs(k)*.06).toFixed(3);});};
  addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(f);}},{passive:true});f();
})();
// ---- work gallery: filter + lightbox ----
(()=>{
  const btns=document.querySelectorAll('.wf'),jobs=document.querySelectorAll('.job[data-cat]');
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
    jobs.forEach(j=>{const show=b.dataset.f==='all'||j.dataset.cat===b.dataset.f;j.classList.toggle('hide',!show);if(show)j.classList.add('in');});
  }));
  const lb=document.getElementById('lightbox'),li=document.getElementById('lb-img'),lc=document.getElementById('lb-cap');let last=null;
  const close=()=>{lb.hidden=true;document.body.style.overflow='';if(last)last.focus();};
  jobs.forEach(j=>j.querySelector('.imgbox').addEventListener('click',e=>{
    last=e.currentTarget;const im=j.querySelector('img');li.src=im.dataset.full||im.currentSrc||im.src;li.alt=im.alt;
    lc.textContent=j.querySelector('h3').textContent+' · '+j.querySelector('.tag').textContent;
    lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.lb-close').focus();
  }));
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-close'))close();});
  lb.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
// ---- Leads ----
// To receive leads by email: create a free form at formspree.io (or web3forms.com),
// then paste its endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
const LEAD_ENDPOINT = "";
const digits=s=>(s||'').replace(/\D/g,'');
async function sendLead(data){
  if(!LEAD_ENDPOINT) return 'preview';
  const r=await fetch(LEAD_ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!r.ok) throw new Error('send failed');
  return 'sent';
}
function mark(el,bad){el.setAttribute('aria-invalid',bad?'true':'false');const e=el.parentElement.querySelector('.err');if(e)e.hidden=!bad;return bad;}
const form=document.getElementById('quote');
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const el=form.elements, msg=document.getElementById('sent'); msg.hidden=true;
  if(el._gotcha.value)return;
  let bad=false;
  bad=mark(el.name,!el.name.value.trim())||bad;
  bad=mark(el.phone,digits(el.phone.value).length<10)||bad;
  bad=mark(el.email,!!el.email.value.trim()&&!/^\S+@\S+\.\S+$/.test(el.email.value.trim()))||bad;
  bad=mark(el.city,!el.city.value.trim())||bad;
  if(bad){form.querySelector('[aria-invalid="true"]').focus();return;}
  const data={name:el.name.value.trim(),phone:el.phone.value.trim(),email:el.email.value.trim(),city:el.city.value.trim(),
    service:form.querySelector('input[name="service"]:checked').value,best_time:form.querySelector('input[name="time"]:checked').value,
    message:el.message.value.trim(),source:'Website – full form'};
  const btn=document.getElementById('lead-submit');btn.disabled=true;btn.textContent='Sending…';
  try{
    const res=await sendLead(data);
    form.hidden=true;const d=document.getElementById('lead-done');d.hidden=false;
    document.getElementById('done-text').textContent='Thanks, '+data.name.split(' ')[0]+'. We’ll call '+data.phone+' shortly about: '+data.service+'.';
    document.getElementById('done-note').textContent=res==='preview'?'Preview mode: this form isn’t connected to an inbox yet, so nothing was sent.':'Need us sooner? Call (952) 395-3235.';
  }catch(err){
    msg.hidden=false;msg.textContent='We couldn’t send your request. Please call us at (952) 395-3235.';
    btn.disabled=false;btn.textContent='Get my free quote';
  }
});
const quick=document.getElementById('quick');
quick.addEventListener('submit',async e=>{
  e.preventDefault();
  const el=quick.elements,m=document.getElementById('quick-msg');
  const badName=!el.name.value.trim(),badPhone=digits(el.phone.value).length<10;
  el.name.setAttribute('aria-invalid',badName);el.phone.setAttribute('aria-invalid',badPhone);
  if(badName||badPhone){m.hidden=false;m.textContent=badName?'Please add your name.':'Please add a 10-digit phone number.';(badName?el.name:el.phone).focus();return;}
  const data={name:el.name.value.trim(),phone:el.phone.value.trim(),service:el.service.value,source:'Website – quick bar'};
  try{
    const res=await sendLead(data);
    m.hidden=false;m.textContent='Thanks, '+data.name.split(' ')[0]+'! We’ll call '+data.phone+' shortly.'+(res==='preview'?' (Preview mode: not connected to an inbox yet.)':'');
    quick.querySelectorAll('input,select,button').forEach(x=>x.disabled=true);
  }catch(err){m.hidden=false;m.textContent='We couldn’t send that. Please call (952) 395-3235.';}
});

// ---- Besty the chimney chatbot ----
(()=>{
  const $=id=>document.getElementById(id);
  const fab=$('cb-fab'),panel=$('cb-panel'),log=$('cb-log'),quick=$('cb-quick'),form=$('cb-form'),inp=$('cb-in'),teaser=$('cb-teaser');
  const PHONE='(952) 395-3235',TEL='tel:+19523953235';
  const ss={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}}};
  let started=false,flow=null,lead={},transcript=[];
  const MAIN=['Get a free quote','Prices','Do you serve my city?','Services','Talk to a person'];
  function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function add(text,who){const d=document.createElement('div');d.className='cb-msg '+who;d.innerHTML=who==='me'?esc(text):text;log.appendChild(d);log.scrollTop=log.scrollHeight;transcript.push((who==='me'?'Visitor: ':'Besty: ')+d.textContent);}
  function chips(list){quick.innerHTML='';(list||[]).forEach(l=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.onclick=()=>handle(l);quick.appendChild(b);});}
  function say(text,list,delay){const t=document.createElement('div');t.className='cb-msg bot';t.innerHTML='<span class="cb-typing"><i></i><i></i><i></i></span>';log.appendChild(t);log.scrollTop=log.scrollHeight;chips([]);
    setTimeout(()=>{t.remove();add(text,'bot');chips(list);},delay??Math.min(1100,400+text.length*6));}
  function open(){panel.hidden=false;fab.setAttribute('aria-expanded','true');teaser.hidden=true;ss.set('cb-seen','1');
    if(!started){started=true;say("Hi there! 👋 I'm Besty from Best Chimney Services."+(window.BCS_CITY?"\nWe work in <b>"+esc(window.BCS_CITY)+"</b> every week.":"")+"\nI can answer quick questions or get you a free quote. What can I help with?",MAIN,500);}
    setTimeout(()=>inp.focus(),300);}
  function close(){panel.hidden=true;fab.setAttribute('aria-expanded','false');fab.focus();}
  fab.onclick=()=>panel.hidden?open():close();$('cb-x').onclick=close;
  panel.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  document.querySelectorAll('[data-open-chat]').forEach(b=>b.onclick=open);
  $('cb-tx').onclick=e=>{e.stopPropagation();teaser.hidden=true;ss.set('cb-seen','1');};
  teaser.onclick=open;
  if(!ss.get('cb-seen'))setTimeout(()=>{if(panel.hidden)teaser.hidden=false;},7000);

  const A={
    price:"Our fall special is <b>$179 for a sweep + Level 1 inspection</b> (through Dec 31). Repairs are quoted <b>in writing</b> after we inspect, so you know the price before any work starts.",
    services:"We do it all: sweeping & cleaning, inspections (Level 1–3, camera scans), masonry & tuckpointing, leak repair & waterproofing, crowns, caps & chase covers, rebuilds, liners, and gas fireplace service.",
    smell:"A campfire smell is usually creosote buildup, and creosote is flammable. A cleaning + inspection before your next fire is the safe move.",
    smoke:"Smoke coming into the room usually means a blocked flue, heavy creosote or a cap problem. Please don't use the fireplace until it's checked.",
    leak:"Water or stains near the fireplace usually point to the crown, cap or flashing. We find the source and fix it so it holds up to Minnesota winters.",
    often:"The national standard (NFPA 211) is an inspection once a year, and a cleaning when buildup reaches about 1/8 inch.",
    mess:"No mess. We use drop cloths, seal the fireplace opening and run a HEPA vacuum the whole time.",
    winter:"Yes, we work all year. Cleanings and inspections any time; masonry is scheduled on days warm enough for mortar to cure.",
    license:"Yes, we're licensed in Minnesota: <b>#BC788528</b>.",
    levels:"Level 1 checks everything you can see and reach. Level 2 adds a camera scan inside the flue, recommended when you buy or sell a home or after a chimney fire.",
    gas:"Yes, we service gas fireplaces: pilot lights, igniters, thermocouples, valves, gas logs and inserts.",
    person:`Of course! Call or text the crew at <a href="${TEL}">${PHONE}</a>. Or leave your number here and we'll call you back shortly.`
  };
  const R=[[/(price|cost|how much|\$|cheap|expensive|special|deal|quote price)/i,'price'],[/(service|what do you do|offer)/i,'services'],[/(smell|odor|stink)/i,'smell'],[/(smoke|smoky)/i,'smoke'],[/(leak|water|wet|stain|drip|rain)/i,'leak'],[/(how often|every year|annual)/i,'often'],[/(mess|clean up|dirty|dust)/i,'mess'],[/(winter|cold|snow|season)/i,'winter'],[/(licen|insur|certif)/i,'license'],[/(level ?[123]|camera|video)/i,'levels'],[/(gas|pilot|insert|log)/i,'gas'],[/(person|human|call|phone|talk|speak|number)/i,'person']];
  const cities=(typeof CITIES!=='undefined'?CITIES:[]);
  const n=s=>s.toLowerCase().replace(/saint/g,'st').replace(/[.,]/g,'').trim();
  function cityIn(s){const v=n(s);return cities.find(c=>v.includes(n(c)));}

  function startLead(){flow='name';lead={};say("Great, let's get you a free quote! 🧹\nWhat's your name?",[]);}
  function step(text){
    if(flow==='name'){lead.name=text.trim();flow='phone';return say(`Nice to meet you, ${esc(lead.name.split(' ')[0])}! What's the best phone number to reach you?`,[]);}
    if(flow==='phone'){if(digits(text).length<10)return say("Hmm, that doesn't look like a full number. Could you send all 10 digits?",[]);lead.phone=text.trim();flow='city';return say("Got it. Which city is the house in?",['Burnsville','Edina','Eden Prairie','Lakeville','Other']);}
    if(flow==='city'){lead.city=text.trim();flow='issue';const c=cityIn(text);return say((c?`${c} is in our service area. 👍\n`:'')+"Last one: what's going on with the chimney or fireplace?",['Need a cleaning','Inspection','Leak / water','Damaged brick','Gas fireplace','Not sure']);}
    if(flow==='issue'){lead.message=text.trim();flow=null;send();return;}
  }
  async function send(){
    say("Sending this to the crew…",[],500);
    const data={name:lead.name,phone:lead.phone,city:lead.city,service:lead.message,message:lead.message,source:'Website – chatbot',transcript:transcript.join('\n')};
    try{const res=await sendLead(data);
      setTimeout(()=>say(`All set, ${esc(lead.name.split(' ')[0])}! ✅ The crew will call <b>${esc(lead.phone)}</b> shortly.`+(res==='preview'?'\n<small>(Preview: not connected to an inbox yet.)</small>':'')+`\nNeed us sooner? <a href="${TEL}">${PHONE}</a>`,['Prices','Services']),900);
    }catch(e){setTimeout(()=>say(`Sorry, that didn't go through. Please call <a href="${TEL}">${PHONE}</a> and we'll take care of you.`,MAIN),900);}
  }
  function handle(text){
    text=(text||'').trim();if(!text)return;add(text,'me');inp.value='';
    if(flow)return step(text);
    if(/^(get a free quote|quote|book|schedule|appointment|estimate|come out)/i.test(text)||/(book|schedule|appointment|estimate|quote)/i.test(text))return startLead();
    if(/do you serve my city\?/i.test(text))return say("Type your city and I'll check. We cover 58 cities around Burnsville and the Twin Cities.",['Burnsville','Minneapolis','St. Paul','Edina']);
    const c=cityIn(text);if(c)return say(`Yes! We serve <b>${c}</b>. Want a free quote?`,['Get a free quote','Prices']);
    if(/^(other|not sure)$/i.test(text))return say("No problem. Tell me a bit more, or I can get you a free quote.",['Get a free quote','Talk to a person']);
    if(/^(hi|hey|hello|yo|good (morning|afternoon|evening))\b/i.test(text))return say("Hi! 😊 How can I help with your chimney today?",MAIN);
    if(/(thank|thx|great|awesome|perfect)/i.test(text))return say("Anytime! Anything else I can help with?",['Get a free quote','Prices']);
    for(const [re,k] of R)if(re.test(text))return say(A[k],k==='person'?['Get a free quote']:['Get a free quote','Talk to a person']);
    say("Good question! The crew can answer that best. Want me to take your number so they can call you?",['Get a free quote','Talk to a person']);
  }
  form.addEventListener('submit',e=>{e.preventDefault();handle(inp.value);});
})();

// ---- visitor's city (approximate, from IP); default stays Burnsville ----
(()=>{
  const el=document.getElementById('city-rot');if(!el||el.dataset.fixed)return;
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROT=['Burnsville','Edina','Eden Prairie','Minnetonka','Lakeville','Bloomington','Eagan','Apple Valley','Prior Lake','Plymouth','Wayzata','Minneapolis','St. Paul','Woodbury'];
  const norm=s=>(s||'').toLowerCase().replace(/^saint /,'st ').replace(/[.]/g,'').trim();
  const list=(typeof CITIES!=='undefined'?CITIES:ROT);
  let i=0,timer=null,locked=false;
  function show(name){
    if(reduce){el.textContent=name;return;}
    el.classList.add('out');
    setTimeout(()=>{el.textContent=name;el.classList.remove('out');el.classList.add('pre');void el.offsetWidth;el.classList.remove('pre');},280);
  }
  function lock(city){
    locked=true;clearInterval(timer);show(city);
    document.querySelectorAll('.city-name').forEach(n=>n.textContent=city);
    const fc=document.getElementById('f-city');if(fc&&!fc.value)fc.value=city;
    try{sessionStorage.setItem('bcs-city',city)}catch(e){}
    window.BCS_CITY=city;
  }
  let saved=null;try{saved=sessionStorage.getItem('bcs-city')}catch(e){}
  if(saved)return lock(saved);
  const match=c=>list.find(x=>norm(x)===norm(c));
  const ctrl=new AbortController();setTimeout(()=>ctrl.abort(),2500);
  fetch('https://ipapi.co/json/',{signal:ctrl.signal}).then(r=>r.json()).then(d=>{
    if(d&&d.region_code==='MN'){const c=match(d.city);if(c)lock(c);}
  }).catch(()=>{});
})();
