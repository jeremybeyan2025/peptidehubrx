// PeptideHubRx — Oura-style motion: reveals, parallax, menu
(function(){
  var menuBtn=document.getElementById('menuBtn'), menu=document.getElementById('menu');
  if(menuBtn&&menu){menuBtn.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
  });}

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  var layers=document.querySelectorAll('[data-parallax]');
  var ticking=false;
  function update(){
    var y=window.scrollY;
    layers.forEach(function(el){
      var r=el.parentElement.getBoundingClientRect();
      var speed=parseFloat(el.getAttribute('data-parallax'))||0.1;
      var offset=(r.top - window.innerHeight/2)*speed;
      el.style.translate='0 '+offset.toFixed(1)+'px';
    });
    ticking=false;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ requestAnimationFrame(update); ticking=true; } },{passive:true});
  update();
})();
