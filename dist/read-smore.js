var e={blockClassName:"read-smore",wordsCount:70,charsCount:150,moreText:"Read More",lessText:"Read Less",isInline:!1};function n(n,r){r=Object.assign({},e,r);var t={originalContentArr:[],truncatedContentArr:[]};return{init:function(){for(var e=0,a=n.length;e<a;++e)o=e,void 0,void 0,void 0,void 0,l=function(e,n,r){void 0===r&&(r=!1);var t=function(e){return e.replace(/(^\s*)|(\s*$)/gi,"")}(e);return r?t.split("").slice(0,n).join("")+"...":t.split(/\s+/).slice(0,n).join(" ")+"..."}(c=(s=n[e]).innerHTML,i=s.dataset.readSmoreChars||s.dataset.readSmoreWords||r.wordsCount,!!s.dataset.readSmoreChars),d=c.length,t.originalContentArr.push(c),t.truncatedContentArr.push(l),i<d&&(s.innerHTML=t.truncatedContentArr[o],function(e){var a=document.createElement("span");a.className=r.blockClassName+"__link-wrap",a.innerHTML="<a id="+r.blockClassName+"_"+e+"\n                             class="+r.blockClassName+'__link\n                             style="cursor:pointer;">\n                             '+r.moreText+"\n                          </a>",n[e].after(a),function(e){document.querySelector("#"+r.blockClassName+"_"+e).addEventListener("click",function(a){n[e].classList.toggle("is-expanded");var s=a.currentTarget;"true"!==s.dataset.clicked?(n[e].innerHTML=t.originalContentArr[e],s.innerHTML=r.lessText,s.dataset.clicked=!0):(n[e].innerHTML=t.truncatedContentArr[e],s.innerHTML=r.moreText,s.dataset.clicked=!1)})}(e)}(o));var s,o,i,c,l,d}}}n.options=e,module.exports=n;
//# sourceMappingURL=read-smore.js.map