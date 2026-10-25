(() => {
 'use strict';
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const particles=document.getElementById('particles');
 for(let i=0;i<38;i++){
  const p=document.createElement('span');p.className='particle';
  p.style.cssText=`--x:${Math.random()*100}%;--y:${Math.random()*100}%;--size:${Math.random()*3+1}px;--duration:${5+Math.random()*8}s;--delay:${-Math.random()*12}s`;particles.append(p);
 }
 const diamonds=document.getElementById('diamonds');
 if(diamonds) for(let i=0;i<(reduced?12:58);i++){
  const d=document.createElement('span');d.className='glitter';
  d.style.cssText=`--x:${Math.random()*96}%;--size:${5+Math.random()*18}px;--duration:${(reduced?32:14)+Math.random()*15}s;--twinkle:${1.8+Math.random()*3.5}s;--sway:${(Math.random()-.5)*100}px;--delay:${-Math.random()*28}s`;
  d.innerHTML='<svg viewBox="0 0 40 40" fill="none"><path d="M20 1C22 15 25 18 39 20C25 22 22 25 20 39C18 25 15 22 1 20C15 18 18 15 20 1Z" fill="currentColor"/><circle cx="20" cy="20" r="3" fill="white"/></svg>';
  diamonds.append(d);
 }
 const button=document.getElementById('reveal');
 if(button) button.addEventListener('click',()=>{
  if(button.disabled)return;button.disabled=true;document.body.classList.add('leaving');
  setTimeout(()=>{window.location.href='celebration.html'},reduced?0:780);
 });
 window.addEventListener('pageshow',e=>{if(e.persisted && button){document.body.classList.remove('leaving');button.disabled=false;}});
 if(document.body.classList.contains('celebration')){
  const colors=['#d7a8ff','#ffadd6','#ffe0a3','#ffffff','#ba9aff'];
  const fire=(options={})=>{
   const count=reduced?Math.min(options.particleCount||12,14):options.particleCount||40;
   if(typeof window.confetti==='function'){
    window.confetti({colors,disableForReducedMotion:false,zIndex:50,...options,particleCount:count,...(reduced?{startVelocity:12,spread:55,scalar:.65,ticks:100}:{})});
    return;
   }
   // A dependency-free fallback keeps the celebration working offline and if
   // the optional canvas library is blocked or still downloading.
   for(let i=0;i<count;i++){
    const bit=document.createElement('i');bit.className='confetti-bit';bit.setAttribute('aria-hidden','true');
    const x=(options.origin?.x??.5)*100,y=(options.origin?.y??.4)*100;
    bit.style.cssText=`left:${x}vw;top:${y}vh;background:${colors[i%colors.length]};--dx:${(Math.random()-.5)*(reduced?160:850)}px;--dy:${-(40+Math.random()*(reduced?40:240))}px;--end-y:${50+Math.random()*60}vh;--spin:${Math.random()*1080-540}deg;--life:${reduced?2:3+Math.random()*2}s;border-radius:${i%3===0?'50%':'1px'}`;
    document.body.append(bit);setTimeout(()=>bit.remove(),5500);
   }
  };
  let rain,later;
  const celebrate=()=>{
   clearInterval(rain);clearTimeout(later);
   fire({particleCount:150,spread:115,startVelocity:48,origin:{x:.5,y:.4},ticks:260});
   later=setTimeout(()=>{fire({particleCount:60,angle:60,spread:70,origin:{x:0,y:.65}});fire({particleCount:60,angle:120,spread:70,origin:{x:1,y:.65}})},400);
   let count=0;rain=setInterval(()=>{
    if(document.hidden)return;
    fire({particleCount:++count<12?5:2,startVelocity:0,gravity:.32,spread:160,ticks:260,scalar:.7,origin:{x:Math.random(),y:-.05}});
    if(count>22)clearInterval(rain);
   },450);
  };
  celebrate();
  window.addEventListener('pageshow',e=>{if(e.persisted)celebrate()});
  window.addEventListener('pagehide',()=>{clearInterval(rain);clearTimeout(later);if(typeof window.confetti==='function')window.confetti.reset()});
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced){
   document.querySelectorAll('.photo-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`rotateX(${-y*10}deg) rotateY(${x*12}deg) scale(1.045)`});
    card.addEventListener('pointerleave',()=>{card.style.transform=''});
   });
  }
 }
})();
