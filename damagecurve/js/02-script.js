(function(){const upd=r=>{const mn=+r.min||0,mx=+(r.max||100);r.style.setProperty('--v',((r.value-mn)/(mx-mn)*100)+'%');};
document.querySelectorAll('input[type=range]').forEach(r=>{upd(r);r.addEventListener('input',()=>upd(r));});
new MutationObserver(()=>document.querySelectorAll('input[type=range]').forEach(upd)).observe(document.body,{subtree:true,attributes:true,attributeFilter:['value']});
document.addEventListener('change',()=>document.querySelectorAll('input[type=range]').forEach(upd));})();
