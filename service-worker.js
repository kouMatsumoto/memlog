(()=>{"use strict";var e={923:()=>{try{self["workbox:core:5.1.4"]&&_()}catch(e){}}},t={};function n(s){var r=t[s];if(void 0!==r)return r.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,n),o.exports}(()=>{n(923);Error;new Set;"undefined"!==typeof registration&&registration.scope;class e{constructor(e,t,{onupgradeneeded:n,onversionchange:s}={}){this._db=null,this._name=e,this._version=t,this._onupgradeneeded=n,this._onversionchange=s||(()=>this.close())}get db(){return this._db}async open(){if(!this._db)return this._db=await new Promise(((e,t)=>{let n=!1;setTimeout((()=>{n=!0,t(new Error("The open request was blocked and timed out"))}),this.OPEN_TIMEOUT);const s=indexedDB.open(this._name,this._version);s.onerror=()=>t(s.error),s.onupgradeneeded=e=>{n?(s.transaction.abort(),s.result.close()):"function"===typeof this._onupgradeneeded&&this._onupgradeneeded(e)},s.onsuccess=()=>{const t=s.result;n?t.close():(t.onversionchange=this._onversionchange.bind(this),e(t))}})),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,n){return await this.getAllMatching(e,{query:t,count:n})}async getAllKeys(e,t,n){return(await this.getAllMatching(e,{query:t,count:n,includeKeys:!0})).map((e=>e.key))}async getAllMatching(e,{index:t,query:n=null,direction:s="next",count:r,includeKeys:o=!1}={}){return await this.transaction([e],"readonly",((a,i)=>{const c=a.objectStore(e),l=t?c.index(t):c,d=[],u=l.openCursor(n,s);u.onsuccess=()=>{const e=u.result;e?(d.push(o?e:e.value),r&&d.length>=r?i(d):e.continue()):i(d)}}))}async transaction(e,t,n){return await this.open(),await new Promise(((s,r)=>{const o=this._db.transaction(e,t);o.onabort=()=>r(o.error),o.oncomplete=()=>s(),n(o,(e=>s(e)))}))}async _call(e,t,n,...s){return await this.transaction([t],n,((n,r)=>{const o=n.objectStore(t),a=o[e].apply(o,s);a.onsuccess=()=>r(a.result)}))}close(){this._db&&(this._db.close(),this._db=null)}}e.prototype.OPEN_TIMEOUT=2e3;const t={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[n,r]of Object.entries(t))for(const t of r)t in IDBObjectStore.prototype&&(e.prototype[t]=async function(e,...s){return await this._call(t,e,n,...s)});[{'revision':'251e60c17d4b4e7da27941b150d7a567','url':'/memlog/index.html'},{'revision':null,'url':'/memlog/static/css/main.1a7488ce.css'},{'revision':null,'url':'/memlog/static/js/377.81b25707.chunk.js'},{'revision':null,'url':'/memlog/static/js/main.e428e09a.js'}];self.addEventListener("activate",(()=>self.clients.claim())),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}));const s=(e,...t)=>{self.clients.matchAll().then((n=>{n.forEach((n=>n.postMessage({type:"log",data:{message:e,data:t}})))}))};setInterval((()=>{self.clients.matchAll().then((e=>{e.forEach((e=>e.postMessage({type:"ping",data:Date.now()})))}))}),2e4),setImmediate((()=>{s("worker setup")})),self.addEventListener("fetch",(e=>{s("onfetch",e.request.method,e.request.url);const t=new URL(e.request.url);"POST"===e.request.method&&"/bookmark"===t.pathname&&e.respondWith((async()=>{const n=await e.request.formData();return s("formdata",n.entries()),Response.redirect(t,303)})())}))})()})();
//# sourceMappingURL=service-worker.js.map