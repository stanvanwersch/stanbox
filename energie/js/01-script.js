(function(){
  function getPreferredTheme(){
    try{
      var saved = localStorage.getItem('dgbc-weii-theme');
      if(saved === 'dark' || saved === 'light') return saved;
    }catch(e){}
    return 'light';
  }
  document.documentElement.setAttribute('data-theme', getPreferredTheme());
  window.toggleTheme = function(){
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('dgbc-weii-theme', next); }catch(e){}
  };
})();
