(function(){
  function apply(){
    try{
      var vv=window.visualViewport;
      var h=vv?Math.round(vv.height+(vv.offsetTop||0)):window.innerHeight;
      var px=h+'px';
      document.documentElement.style.height=px;
      document.documentElement.style.minHeight=px;
      if(document.body){document.body.style.height=px;document.body.style.minHeight=px;}
      var wrap=document.getElementById('wrap');
      if(wrap){wrap.style.position='fixed';wrap.style.top='0';wrap.style.left='0';wrap.style.right='0';wrap.style.bottom='0';wrap.style.height=px;wrap.style.minHeight=px;}
      var menu=document.getElementById('menu');
      if(menu){menu.style.bottom='0';menu.style.minHeight=px;menu.style.paddingBottom=Math.max(12,(window.visualViewport?0:0))+Math.max(12, (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab'))||0))+'px';}
      try{window.scrollTo(0,0);}catch(e){}
    }catch(e){}
  }
  function boot(){
    apply();
    try{
      if(window.visualViewport){
        window.visualViewport.addEventListener('resize',apply);
        window.visualViewport.addEventListener('scroll',apply);
      }
      window.addEventListener('orientationchange',function(){setTimeout(apply,250);});
      window.addEventListener('resize',apply);
    }catch(e){}
    setInterval(apply,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
