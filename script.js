const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const viewButtons=[...document.querySelectorAll('[data-view-choice]')];
const views=[...document.querySelectorAll('[data-view-panel]')];
const notice=document.querySelector('.notice');
let noticeTimer;
function announce(message){notice.textContent=message;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),2400);}
viewButtons.forEach(button=>button.addEventListener('click',()=>{
  const viewId=button.dataset.viewChoice;
  viewButtons.forEach(item=>{const active=item===button;item.classList.toggle('is-current',active);item.setAttribute('aria-pressed',String(active));});
  views.forEach(view=>{const active=view.dataset.viewPanel===viewId;view.hidden=!active;view.classList.toggle('is-visible',active);});
  document.body.dataset.view=viewId;
  window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});
  const heading=document.querySelector(`[data-view-panel="${viewId}"] h1`);
  if(heading){heading.setAttribute('tabindex','-1');setTimeout(()=>heading.focus({preventScroll:true}),reduceMotion?0:250);}
  const labels={ritual:'Ritual: página editorial',caderno:'Caderno: narrativa do processo',escolha:'Escolha: comparador de aulas'};
  announce(`${labels[viewId]} selecionada.`);
  revealWithin(document.querySelector(`[data-view-panel="${viewId}"]`));
}));

const courseData={
  single:{title:'Experiência',price:'R$ 190',copy:'Você modela uma peça em uma aula de 2h e escolhe a cor. Argila, ferramentas, esmalte e duas queimas estão incluídos; a esmaltação é feita pelo ateliê.',message:'Oi! Quero consultar as próximas datas da Experiência de cerâmica.'},
  complete:{title:'Experiência completa',price:'R$ 300',copy:'Você modela na primeira aula e retorna em outro encontro de 2h para aprender a esmaltar e pintar a sua própria peça.',message:'Oi! Quero conhecer a Experiência completa e consultar as datas.'},
  monthly:{title:'Mensalidade',price:'R$ 500',copy:'São 4 aulas por mês. Argila e primeira queima estão incluídas; segunda queima e esmaltes são cobrados à parte. O valor da experiência é abatido da mensalidade.',message:'Oi! Quero saber como funciona a mensalidade e consultar os próximos dias.'}
};
document.querySelectorAll('[data-course]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-course]').forEach(item=>{const selected=item===button;item.classList.toggle('chosen',selected);item.setAttribute('aria-pressed',String(selected));item.querySelector('.course-check').textContent=selected?'Selecionada ✓':'Selecionar';});
  const item=courseData[button.dataset.course];
  document.querySelector('#summary-title').textContent=item.title;
  document.querySelector('#summary-price').textContent=item.price;
  document.querySelector('#summary-copy').textContent=item.copy;
  document.querySelector('#summary-cta').href=`https://wa.me/5512991176565?text=${encodeURIComponent(item.message)}`;
  announce(`${item.title} selecionada.`);
}));

let observer;
function revealWithin(root){
  if(!root)return;
  const items=[...root.querySelectorAll('.ritual-intro,.ritual-card,.ritual-process,.ritual-end,.caderno-opening,.caderno-note,.caderno-spread,.caderno-membership,.caderno-colophon,.escolha-intro,.course-option,.course-summary,.escolha-note')];
  items.forEach((item,index)=>{item.classList.add('reveal');item.style.transitionDelay=`${Math.min(index%3,2)*70}ms`;if(reduceMotion){item.classList.add('in-view');return;}observer?.observe(item);});
}
if('IntersectionObserver'in window&&!reduceMotion){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});}
document.querySelectorAll('[data-view-panel]').forEach(revealWithin);
