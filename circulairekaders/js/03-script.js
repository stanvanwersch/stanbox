(function(){if(window.betaToggle)return;
var T={nl:['Deze tool is nog in ontwikkeling.','Heb je feedback of ideeën? Mail naar','Feedback Circular HVAC Framework'],en:['This tool is still in development.','Have feedback or ideas? Email','Feedback Circular HVAC Framework']},M=[['Stan Vanwersch','DGBC','s.vanwersch@dgbc.nl'],['Sasja van Andel','TU Delft','S.M.vanAndel-1@tudelft.nl']],open=null;
function close(){if(!open)return;var p=open.querySelector('.betapop');if(p)p.remove();var b=open.querySelector('button');if(b)b.setAttribute('aria-expanded','false');open=null;}
window.betaToggle=function(b){var w=b.parentNode;if(!w.classList.contains('betaw')){w=document.createElement('span');w.className='betaw';b.parentNode.insertBefore(w,b);w.appendChild(b);}if(open===w){close();return;}close();
var lb=w.parentNode.querySelector('.lang,#lang,#cv-lang'),l=lb&&lb.textContent.trim().toLowerCase()==='nl'?'en':'nl',t=T[l];
var p=document.createElement('div');p.className='betapop';p.setAttribute('role','dialog');
p.innerHTML='<p>'+t[0]+'</p><p>'+t[1]+'</p>'+M.map(function(m){return '<p class="betac">'+m[0]+' ('+m[1]+')<br><a href="mailto:'+m[2]+'?subject='+encodeURIComponent(t[2])+'">'+m[2]+'</a></p>';}).join('');
w.appendChild(p);var r=p.getBoundingClientRect();if(r.left<12){p.style.right='auto';p.style.left=(12-w.getBoundingClientRect().left)+'px';}b.setAttribute('aria-expanded','true');open=w;};
document.addEventListener('pointerdown',function(e){if(open&&e.composedPath().indexOf(open)<0)close();},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});})();
