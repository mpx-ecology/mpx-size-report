(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{L9jI:function(e,t,n){"use strict";e.exports="/__open-stack-frame-in-editor"},Y7cU:function(e,t,n){"use strict";n("tJVT"),n("q1tI");var o="undefined"!==typeof navigator&&navigator.userAgent.toLowerCase().indexOf("firefox")>0;function r(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on".concat(t),(function(){n(window.event)}))}function i(e,t){for(var n=t.slice(0,t.length-1),o=0;o<n.length;o++)n[o]=e[n[o].toLowerCase()];return n}function a(e){"string"!==typeof e&&(e=""),e=e.replace(/\s/g,"");for(var t=e.split(","),n=t.lastIndexOf("");n>=0;)t[n-1]+=",",t.splice(n,1),n=t.lastIndexOf("");return t}function c(e,t){for(var n=e.length>=t.length?e:t,o=e.length>=t.length?t:e,r=!0,i=0;i<n.length;i++)-1===o.indexOf(n[i])&&(r=!1);return r}for(var f={backspace:8,tab:9,clear:12,enter:13,return:13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,delete:46,ins:45,insert:45,home:36,end:35,pageup:33,pagedown:34,capslock:20,"\u21ea":20,",":188,".":190,"/":191,"`":192,"-":o?173:189,"=":o?61:187,";":o?59:186,"'":222,"[":219,"]":221,"\\":220},s={"\u21e7":16,shift:16,"\u2325":18,alt:18,option:18,"\u2303":17,ctrl:17,control:17,"\u2318":91,cmd:91,command:91},l={16:"shiftKey",18:"altKey",17:"ctrlKey",91:"metaKey",shiftKey:16,ctrlKey:17,altKey:18,metaKey:91},p={16:!1,18:!1,17:!1,91:!1},y={},d=1;d<20;d++)f["f".concat(d)]=111+d;var u=[],h="all",w=[],v=function(e){return f[e.toLowerCase()]||s[e.toLowerCase()]||e.toUpperCase().charCodeAt(0)};function g(e){h=e||"all"}function k(){return h||"all"}function m(){return u.slice(0)}function O(e){var t=e.target||e.srcElement,n=t.tagName,o=!0;return!t.isContentEditable&&("INPUT"!==n&&"TEXTAREA"!==n&&"SELECT"!==n||t.readOnly)||(o=!1),o}function K(e){return"string"===typeof e&&(e=v(e)),-1!==u.indexOf(e)}function b(e,t){var n,o;for(var r in e||(e=k()),y)if(Object.prototype.hasOwnProperty.call(y,r))for(n=y[r],o=0;o<n.length;)n[o].scope===e?n.splice(o,1):o++;k()===e&&g(t||"all")}function x(e){var t=e.keyCode||e.which||e.charCode,n=u.indexOf(t);if(n>=0&&u.splice(n,1),e.key&&"meta"===e.key.toLowerCase()&&u.splice(0,u.length),93!==t&&224!==t||(t=91),t in p)for(var o in p[t]=!1,s)s[o]===t&&(A[o]=!1)}function C(e){if(e){if(Array.isArray(e))e.forEach((function(e){e.key&&E(e)}));else if("object"===typeof e)e.key&&E(e);else if("string"===typeof e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];var r=n[0],i=n[1];"function"===typeof r&&(i=r,r=""),E({key:e,scope:r,method:i,splitKey:"+"})}}else Object.keys(y).forEach((function(e){return delete y[e]}))}var E=function(e){var t=e.key,n=e.scope,o=e.method,r=e.splitKey,f=void 0===r?"+":r,l=a(t);l.forEach((function(e){var t=e.split(f),r=t.length,a=t[r-1],l="*"===a?"*":v(a);if(y[l]){n||(n=k());var p=r>1?i(s,t):[];y[l]=y[l].map((function(e){var t=!o||e.method===o;return t&&e.scope===n&&c(e.mods,p)?{}:e}))}}))};function j(e,t,n){var o;if(t.scope===n||"all"===t.scope){for(var r in o=t.mods.length>0,p)Object.prototype.hasOwnProperty.call(p,r)&&(!p[r]&&t.mods.indexOf(+r)>-1||p[r]&&-1===t.mods.indexOf(+r))&&(o=!1);(0!==t.mods.length||p[16]||p[18]||p[17]||p[91])&&!o&&"*"!==t.shortcut||!1===t.method(e,t)&&(e.preventDefault?e.preventDefault():e.returnValue=!1,e.stopPropagation&&e.stopPropagation(),e.cancelBubble&&(e.cancelBubble=!0))}}function L(e){var t=y["*"],n=e.keyCode||e.which||e.charCode;if(A.filter.call(this,e)){if(93!==n&&224!==n||(n=91),-1===u.indexOf(n)&&229!==n&&u.push(n),["ctrlKey","altKey","shiftKey","metaKey"].forEach((function(t){var n=l[t];e[t]&&-1===u.indexOf(n)?u.push(n):!e[t]&&u.indexOf(n)>-1?u.splice(u.indexOf(n),1):"metaKey"===t&&e[t]&&3===u.length&&(e.ctrlKey||e.shiftKey||e.altKey||(u=u.slice(u.indexOf(n))))})),n in p){for(var o in p[n]=!0,s)s[o]===n&&(A[o]=!0);if(!t)return}for(var r in p)Object.prototype.hasOwnProperty.call(p,r)&&(p[r]=e[l[r]]);e.getModifierState&&(!e.altKey||e.ctrlKey)&&e.getModifierState("AltGraph")&&(-1===u.indexOf(17)&&u.push(17),-1===u.indexOf(18)&&u.push(18),p[17]=!0,p[18]=!0);var i=k();if(t)for(var a=0;a<t.length;a++)t[a].scope===i&&("keydown"===e.type&&t[a].keydown||"keyup"===e.type&&t[a].keyup)&&j(e,t[a],i);if(n in y)for(var c=0;c<y[n].length;c++)if(("keydown"===e.type&&y[n][c].keydown||"keyup"===e.type&&y[n][c].keyup)&&y[n][c].key){for(var f=y[n][c],d=f.splitKey,h=f.key.split(d),w=[],g=0;g<h.length;g++)w.push(v(h[g]));w.sort().join("")===u.sort().join("")&&j(e,f,i)}}}function P(e){return w.indexOf(e)>-1}function A(e,t,n){u=[];var o=a(e),c=[],f="all",l=document,p=0,d=!1,h=!0,g="+";for(void 0===n&&"function"===typeof t&&(n=t),"[object Object]"===Object.prototype.toString.call(t)&&(t.scope&&(f=t.scope),t.element&&(l=t.element),t.keyup&&(d=t.keyup),void 0!==t.keydown&&(h=t.keydown),"string"===typeof t.splitKey&&(g=t.splitKey)),"string"===typeof t&&(f=t);p<o.length;p++)e=o[p].split(g),c=[],e.length>1&&(c=i(s,e)),e=e[e.length-1],e="*"===e?"*":v(e),e in y||(y[e]=[]),y[e].push({keyup:d,keydown:h,scope:f,mods:c,shortcut:o[p],method:n,key:o[p],splitKey:g});"undefined"!==typeof l&&!P(l)&&window&&(w.push(l),r(l,"keydown",(function(e){L(e)})),r(window,"focus",(function(){u=[]})),r(l,"keyup",(function(e){L(e),x(e)})))}var S={setScope:g,getScope:k,deleteScope:b,getPressedKeyCodes:m,isPressed:K,filter:O,unbind:C};for(var I in S)Object.prototype.hasOwnProperty.call(S,I)&&(A[I]=S[I]);if("undefined"!==typeof window){var T=window.hotkeys;A.noConflict=function(e){return e&&window.hotkeys===A&&(window.hotkeys=T),A},window.hotkeys=A}new Set;n("33yf"),n("L9jI"),n("cr+I"),n("Qw5x");n("fWQN"),n("mtLc")}}]);