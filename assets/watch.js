"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(i){return typeof i}:function(i){return i&&"function"==typeof Symbol&&i.constructor===Symbol&&i!==Symbol.prototype?"symbol":typeof i};(function(){function i(){i=function k(){},Cb.Symbol||(Cb.Symbol=o)}function o(Vb){return"jscomp_symbol_"+(Vb||"")+Db++}function s(){i();var Vb=Cb.Symbol.iterator;Vb||(Vb=Cb.Symbol.iterator=Cb.Symbol("iterator")),"function"!=typeof Array.prototype[Vb]&&Bb(Array.prototype,Vb,{configurable:!0,writable:!0,value:function value(){return $(this)}}),s=function l(){}}function $(Vb){var Wb=0;return _(function(){return Wb<Vb.length?{done:!1,value:Vb[Wb++]}:{done:!0}})}function _(Vb){return s(),Vb={next:Vb},Vb[Cb.Symbol.iterator]=function(){return this},Vb}function ga(Vb){s(),i(),s();var Wb=Vb[Symbol.iterator];return Wb?Wb.call(Vb):$(Vb)}function Ja(Vb){if(!(Vb instanceof Array)){Vb=ga(Vb);for(var Wb,Xb=[];!(Wb=Vb.next()).done;)Xb.push(Wb.value);Vb=Xb}return Vb}function La(Vb,Wb){if(Vb&&1==Vb.nodeType&&Wb){if("string"==typeof Wb||1==Wb.nodeType)return Vb==Wb||Ma(Vb,Wb);if("length"in Wb)for(var Yb,Xb=0;Yb=Wb[Xb];Xb++)if(Vb==Yb||Ma(Vb,Yb))return!0}return!1}function Ma(Vb,Wb){if("string"!=typeof Wb)return!1;if(Fb)return Fb.call(Vb,Wb);Wb=Vb.parentNode.querySelectorAll(Wb);for(var Yb,Xb=0;Yb=Wb[Xb];Xb++)if(Yb==Vb)return!0;return!1}function Na(Vb){for(var Wb=[];Vb&&Vb.parentNode&&1==Vb.parentNode.nodeType;)Vb=Vb.parentNode,Wb.push(Vb);return Wb}function Oa(Vb,Wb,Xb){function Yb(_b){var ac;if($b.composed&&"function"==typeof _b.composedPath)for(var dc,bc=_b.composedPath(),cc=0;dc=bc[cc];cc++)1==dc.nodeType&&La(dc,Wb)&&(ac=dc);else a:{if((ac=_b.target)&&1==ac.nodeType&&Wb)for(ac=[ac].concat(Na(ac)),bc=0;cc=ac[bc];bc++)if(La(cc,Wb)){ac=cc;break a}ac=void 0}ac&&Xb.call(ac,_b,ac)}var Zb=document,$b={composed:!0,B:!0},$b=void 0===$b?{}:$b;return Zb.addEventListener(Vb,Yb,$b.B),{j:function j(){Zb.removeEventListener(Vb,Yb,$b.B)}}}function Pa(Vb){var Wb={};if(!Vb||1!=Vb.nodeType)return Wb;if(Vb=Vb.attributes,!Vb.length)return{};for(var Yb,Xb=0;Yb=Vb[Xb];Xb++)Wb[Yb.name]=Yb.value;return Wb}function Qa(Vb){if(Vb=Vb&&"."!=Vb?Vb:location.href,Ib[Vb])return Ib[Vb];if(Hb.href=Vb,"."==Vb.charAt(0)||"/"==Vb.charAt(0))return Qa(Hb.href);var Wb="80"==Hb.port||"443"==Hb.port?"":Hb.port,Wb="0"==Wb?"":Wb,Xb=Hb.host.replace(Gb,"");return Ib[Vb]={hash:Hb.hash,host:Xb,hostname:Hb.hostname,href:Hb.href,origin:Hb.origin?Hb.origin:Hb.protocol+"//"+Xb,pathname:"/"==Hb.pathname.charAt(0)?Hb.pathname:"/"+Hb.pathname,port:Wb,protocol:Hb.protocol,search:Hb.search}}function Ra(Vb,Wb){var Xb=this;this.context=Vb,this.v=Wb,this.f=(this.c=/Task$/.test(Wb))?Vb.get(Wb):Vb[Wb],this.b=[],this.a=[],this.g=function(){for(var Zb=[],$b=0;$b<arguments.length;++$b)Zb[$b-0]=arguments[$b];return Xb.a[Xb.a.length-1].apply(null,[].concat(Ja(Zb)))},this.c?Vb.set(Wb,this.g):Vb[Wb]=this.g}function Sa(Vb,Wb,Xb){Vb=Va(Vb,Wb),Vb.b.push(Xb),Ua(Vb)}function Ta(Vb,Wb,Xb){Vb=Va(Vb,Wb),Xb=Vb.b.indexOf(Xb),-1<Xb&&(Vb.b.splice(Xb,1),0<Vb.b.length?Ua(Vb):Vb.j())}function Ua(Vb){Vb.a=[];for(var Wb,Yb,Xb=0;Wb=Vb.b[Xb];Xb++)Yb=Vb.a[Xb-1]||Vb.f.bind(Vb.context),Vb.a.push(Wb(Yb))}function Va(Vb,Wb){var Xb=Jb.filter(function(Yb){return Yb.context==Vb&&Yb.v==Wb})[0];return Xb||(Xb=new Ra(Vb,Wb),Jb.push(Xb)),Xb}function Wa(Vb,Wb,Xb,Yb,Zb,$b){if("function"==typeof Yb){var _b=Xb.get("buildHitTask");return{buildHitTask:function buildHitTask(ac){ac.set(Vb,null,!0),ac.set(Wb,null,!0),Yb(ac,Zb,$b),_b(ac)}}}return Lb({},Vb,Wb)}function Xa(Vb,Wb){var Xb=Pa(Vb),Yb={};return Object.keys(Xb).forEach(function(Zb){if(!Zb.indexOf(Wb)&&Zb!=Wb+"on"){var $b=Xb[Zb];"true"==$b&&($b=!0),"false"==$b&&($b=!1),Zb=_a(Zb.slice(Wb.length)),Yb[Zb]=$b}}),Yb}function Ya(Vb){var Wb;return function(){for(var Yb=[],Zb=0;Zb<arguments.length;++Zb)Yb[Zb-0]=arguments[Zb];clearTimeout(Wb),Wb=setTimeout(function(){return Vb.apply(null,[].concat(Ja(Yb)))},500)}}function Za(Vb){function Wb(){Xb||(Xb=!0,Vb())}var Xb=!1;return setTimeout(Wb,2E3),Wb}function $a(Vb,Wb){function Xb(){clearTimeout(Zb.timeout),Zb.send&&Ta(Vb,"send",Zb.send),delete Kb[Yb],Zb.A.forEach(function($b){return $b()})}var Yb=Vb.get("trackingId"),Zb=Kb[Yb]=Kb[Yb]||{};clearTimeout(Zb.timeout),Zb.timeout=setTimeout(Xb,0),Zb.A=Zb.A||[],Zb.A.push(Wb),Zb.send||(Zb.send=function($b){return function(){for(var ac=[],bc=0;bc<arguments.length;++bc)ac[bc-0]=arguments[bc];Xb(),$b.apply(null,[].concat(Ja(ac)))}},Sa(Vb,"send",Zb.send))}function _a(Vb){return Vb.replace(/[\-\_]+(\w?)/g,function(Wb,Xb){return Xb.toUpperCase()})}function ab(Vb,Wb){var Xb=window.GoogleAnalyticsObject||"ga";window[Xb]=window[Xb]||function(){for(var Zb=[],$b=0;$b<arguments.length;++$b)Zb[$b-0]=arguments[$b];(window[Xb].q=window[Xb].q||[]).push(Zb)},window.gaDevIds=window.gaDevIds||[],0>window.gaDevIds.indexOf("i5iSjo")&&window.gaDevIds.push("i5iSjo"),window[Xb]("provide",Vb,Wb),window.gaplugins=window.gaplugins||{},window.gaplugins[Vb.charAt(0).toUpperCase()+Vb.slice(1)]=Wb}function bb(Vb,Wb){Vb.set("&_av","2.4.1");var Xb=Vb.get("&_au"),Xb=parseInt(Xb||"0",16).toString(2);if(Xb.length<Ob)for(var Yb=Ob-Xb.length;Yb;)Xb="0"+Xb,Yb--;Wb=Ob-Wb,Xb=Xb.substr(0,Wb)+1+Xb.substr(Wb+1),Vb.set("&_au",parseInt(Xb||"0",2).toString(16))}function cb(Vb,Wb){bb(Vb,Nb.C),this.a=Lb({},Wb),this.g=Vb,this.b=this.a.stripQuery&&this.a.queryDimensionIndex?"dimension"+this.a.queryDimensionIndex:null,this.f=this.f.bind(this),this.c=this.c.bind(this),Sa(Vb,"get",this.f),Sa(Vb,"buildHitTask",this.c)}function db(Vb,Wb){var Xb=Qa(Wb.page||Wb.location),Yb=Xb.pathname;if(Vb.a.indexFilename){var Zb=Yb.split("/");Vb.a.indexFilename==Zb[Zb.length-1]&&(Zb[Zb.length-1]="",Yb=Zb.join("/"))}return"remove"==Vb.a.trailingSlash?Yb=Yb.replace(/\/+$/,""):"add"==Vb.a.trailingSlash&&(/\.\w+$/.test(Yb)||"/"==Yb.substr(-1)||(Yb+="/")),Yb={page:Yb+(Vb.a.stripQuery?eb(Vb,Xb.search):Xb.search)},Wb.location&&(Yb.location=Wb.location),Vb.b&&(Yb[Vb.b]=Xb.search.slice(1)||"(not set)"),"function"==typeof Vb.a.urlFieldsFilter?(Wb=Vb.a.urlFieldsFilter(Yb,Qa),Xb={page:Wb.page,location:Wb.location},Vb.b&&(Xb[Vb.b]=Wb[Vb.b]),Xb):Yb}function eb(Vb,Wb){if(Array.isArray(Vb.a.queryParamsWhitelist)){var Xb=[];return Wb.slice(1).split("&").forEach(function(Yb){var Zb=ga(Yb.split("="));Yb=Zb.next().value,Zb=Zb.next().value,-1<Vb.a.queryParamsWhitelist.indexOf(Yb)&&Zb&&Xb.push([Yb,Zb])}),Xb.length?"?"+Xb.map(function(Yb){return Yb.join("=")}).join("&"):""}return""}function fb(Vb,Wb){var Xb=this;if(bb(Vb,Nb.D),window.addEventListener){this.a=Lb({events:["click"],fieldsObj:{},attributePrefix:"ga-"},Wb),this.f=Vb,this.c=this.c.bind(this);var Yb="["+this.a.attributePrefix+"on]";this.b={},this.a.events.forEach(function(Zb){Xb.b[Zb]=Oa(Zb,Yb,Xb.c)})}}function gb(){this.a={}}function hb(Vb,Wb){(Vb.a.externalSet=Vb.a.externalSet||[]).push(Wb)}function ib(Vb,Wb){Wb=void 0===Wb?{}:Wb,this.a={},this.b=Vb,this.m=Wb,this.i=null}function jb(Vb,Wb,Xb){return Vb=["autotrack",Vb,Wb].join(":"),Pb[Vb]||(Pb[Vb]=new ib(Vb,Xb),Qb||(window.addEventListener("storage",mb),Qb=!0)),Pb[Vb]}function kb(){if(null!=Rb)return Rb;try{window.localStorage.setItem("autotrack","autotrack"),window.localStorage.removeItem("autotrack"),Rb=!0}catch(Vb){Rb=!1}return Rb}function lb(Vb){if(Vb.i={},kb())try{window.localStorage.removeItem(Vb.b)}catch(Wb){}}function mb(Vb){var Wb=Pb[Vb.key];if(Wb){var Xb=Lb({},Wb.m,nb(Vb.oldValue));Vb=Lb({},Wb.m,nb(Vb.newValue)),Wb.i=Vb,Wb.J("externalSet",Vb,Xb)}}function nb(Vb){var Wb={};if(Vb)try{Wb=JSON.parse(Vb)}catch(Xb){}return Wb}function ob(Vb,Wb,Xb){this.f=Vb,this.timeout=Wb||Tb,this.timeZone=Xb,this.b=this.b.bind(this),Sa(Vb,"sendHitTask",this.b);try{this.c=new Intl.DateTimeFormat("en-US",{timeZone:this.timeZone})}catch(Yb){}this.a=jb(Vb.get("trackingId"),"session",{hitTime:0,isExpired:!1}),this.a.get().id||this.a.set({id:Mb()})}function pb(Vb,Wb,Xb){var Yb=Vb.get("trackingId");return Sb[Yb]?Sb[Yb]:Sb[Yb]=new ob(Vb,Wb,Xb)}function qb(Vb){return Vb.a.get().id}function rb(Vb,Wb){bb(Vb,Nb.F),window.addEventListener&&(this.b=Lb({increaseThreshold:20,sessionTimeout:Tb,fieldsObj:{}},Wb),this.f=Vb,this.c=tb(this),this.g=Ya(this.g.bind(this)),this.l=this.l.bind(this),this.a=jb(Vb.get("trackingId"),"plugins/max-scroll-tracker"),this.h=pb(Vb,this.b.sessionTimeout,this.b.timeZone),Sa(Vb,"set",this.l),sb(this))}function sb(Vb){100>(Vb.a.get()[Vb.c]||0)&&window.addEventListener("scroll",Vb.g)}function tb(Vb){return Vb=Qa(Vb.f.get("page")||Vb.f.get("location")),Vb.pathname+Vb.search}function ub(Vb,Wb){var Xb=this;bb(Vb,Nb.G),window.addEventListener&&(this.a=Lb({events:["click"],linkSelector:"a, area",shouldTrackOutboundLink:this.shouldTrackOutboundLink,fieldsObj:{},attributePrefix:"ga-"},Wb),this.c=Vb,this.f=this.f.bind(this),this.b={},this.a.events.forEach(function(Yb){Xb.b[Yb]=Oa(Yb,Xb.a.linkSelector,Xb.f)}))}function vb(Vb,Wb){var Xb=this;bb(Vb,Nb.H),document.visibilityState&&(this.a=Lb({sessionTimeout:Tb,visibleThreshold:5E3,sendInitialPageview:!1,fieldsObj:{}},Wb),this.b=Vb,this.h=document.visibilityState,this.s=null,this.w=!1,this.l=this.l.bind(this),this.f=this.f.bind(this),this.o=this.o.bind(this),this.u=this.u.bind(this),this.c=jb(Vb.get("trackingId"),"plugins/page-visibility-tracker"),hb(this.c,this.u),this.g=pb(Vb,this.a.sessionTimeout,this.a.timeZone),Sa(Vb,"set",this.l),window.addEventListener("unload",this.o),document.addEventListener("visibilitychange",this.f),$a(this.b,function(){if("visible"==document.visibilityState)Xb.a.sendInitialPageview&&(yb(Xb,{K:!0}),Xb.w=!0),Xb.c.set({time:+new Date,state:"visible",pageId:Ub,sessionId:qb(Xb.g)});else if(Xb.a.sendInitialPageview&&Xb.a.pageLoadsMetricIndex){var Yb={},Yb=(Yb.transport="beacon",Yb.eventCategory="Page Visibility",Yb.eventAction="page load",Yb.eventLabel="(not set)",Yb["metric"+Xb.a.pageLoadsMetricIndex]=1,Yb.nonInteraction=!0,Yb);Xb.b.send("event",Wa(Yb,Xb.a.fieldsObj,Xb.b,Xb.a.hitFilter))}}))}function wb(Vb){var Wb=Vb.c.get();return"visible"==Vb.h&&"hidden"==Wb.state&&Wb.pageId!=Ub&&(Wb.state="visible",Wb.pageId=Ub,Vb.c.set(Wb)),Wb}function xb(Vb,Wb,Xb){Xb=(Xb?Xb:{}).hitTime;var Yb={hitTime:Xb},Yb=(Yb?Yb:{}).hitTime;(Wb=Wb.time?(Yb||+new Date)-Wb.time:0)&&Wb>=Vb.a.visibleThreshold&&(Wb=Math.round(Wb/1E3),Yb={transport:"beacon",nonInteraction:!0,eventCategory:"Page Visibility",eventAction:"track",eventValue:Wb,eventLabel:"(not set)"},Xb&&(Yb.queueTime=+new Date-Xb),Vb.a.visibleMetricIndex&&(Yb["metric"+Vb.a.visibleMetricIndex]=Wb),Vb.b.send("event",Wa(Yb,Vb.a.fieldsObj,Vb.b,Vb.a.hitFilter)))}function yb(Vb,Wb){var Xb=Wb?Wb:{};Wb=Xb.hitTime;var Xb=Xb.K,Yb={transport:"beacon"};Wb&&(Yb.queueTime=+new Date-Wb),Xb&&Vb.a.pageLoadsMetricIndex&&(Yb["metric"+Vb.a.pageLoadsMetricIndex]=1),Vb.b.send("pageview",Wa(Yb,Vb.a.fieldsObj,Vb.b,Vb.a.hitFilter))}function zb(Vb,Wb){bb(Vb,Nb.I),history.pushState&&window.addEventListener&&(this.a=Lb({shouldTrackUrlChange:this.shouldTrackUrlChange,trackReplaceState:!1,fieldsObj:{},hitFilter:null},Wb),this.g=Vb,this.h=location.pathname+location.search,this.c=this.c.bind(this),this.f=this.f.bind(this),this.b=this.b.bind(this),Sa(history,"pushState",this.c),Sa(history,"replaceState",this.f),window.addEventListener("popstate",this.b))}function Ab(Vb,Wb){setTimeout(function(){var Xb=Vb.h,Yb=location.pathname+location.search;Xb!=Yb&&Vb.a.shouldTrackUrlChange.call(Vb,Yb,Xb)&&(Vb.h=Yb,Vb.g.set({page:Yb,title:document.title}),(Wb||Vb.a.trackReplaceState)&&Vb.g.send("pageview",Wa({transport:"beacon"},Vb.a.fieldsObj,Vb.g,Vb.a.hitFilter)))},0)}var Bb="function"==typeof Object.defineProperties?Object.defineProperty:function(Vb,Wb,Xb){if(Xb.get||Xb.set)throw new TypeError("ES3 does not support getters and setters.");Vb!=Array.prototype&&Vb!=Object.prototype&&(Vb[Wb]=Xb.value)},Cb="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,Db=0,Eb=window.Element.prototype,Fb=Eb.matches||Eb.matchesSelector||Eb.webkitMatchesSelector||Eb.mozMatchesSelector||Eb.msMatchesSelector||Eb.oMatchesSelector,Gb=/:(80|443)$/,Hb=document.createElement("a"),Ib={},Jb=[];Ra.prototype.j=function(){var Vb=Jb.indexOf(this);-1<Vb&&(Jb.splice(Vb,1),this.c?this.context.set(this.v,this.f):this.context[this.v]=this.f)};var Kb={},Lb=Object.assign||function(Vb){for(var Xb=[],Yb=1;Yb<arguments.length;++Yb)Xb[Yb-1]=arguments[Yb];for(var Yb=0,Zb=Xb.length;Yb<Zb;Yb++){var _b,$b=Object(Xb[Yb]);for(_b in $b)Object.prototype.hasOwnProperty.call($b,_b)&&(Vb[_b]=$b[_b])}return Vb},Mb=function Vb(Wb){return Wb?(Wb^16*Math.random()>>Wb/4).toString(16):"10000000-1000-4000-8000-100000000000".replace(/[018]/g,Vb)},Nb={C:1,D:2,L:3,M:4,N:5,G:6,H:7,O:8,I:9,F:10},Ob=Object.keys(Nb).length;cb.prototype.f=function(Vb){var Wb=this;return function(Xb){if("page"==Xb||Xb==Wb.b){var Yb={location:Vb("location"),page:Vb("page")};return db(Wb,Yb)[Xb]}return Vb(Xb)}},cb.prototype.c=function(Vb){var Wb=this;return function(Xb){var Yb=db(Wb,{location:Xb.get("location"),page:Xb.get("page")});Xb.set(Yb,null,!0),Vb(Xb)}},cb.prototype.remove=function(){Ta(this.g,"get",this.f),Ta(this.g,"buildHitTask",this.c)},ab("cleanUrlTracker",cb),fb.prototype.c=function(Vb,Wb){var Xb=this.a.attributePrefix;if(!(0>Wb.getAttribute(Xb+"on").split(/\s*,\s*/).indexOf(Vb.type))){var Xb=Xa(Wb,Xb),Yb=Lb({},this.a.fieldsObj,Xb);this.f.send(Xb.hitType||"event",Wa({transport:"beacon"},Yb,this.f,this.a.hitFilter,Wb,Vb))}},fb.prototype.remove=function(){var Vb=this;Object.keys(this.b).forEach(function(Wb){Vb.b[Wb].j()})},ab("eventTracker",fb),gb.prototype.J=function(Vb){for(var Xb=[],Yb=1;Yb<arguments.length;++Yb)Xb[Yb-1]=arguments[Yb];(this.a[Vb]=this.a[Vb]||[]).forEach(function(Zb){return Zb.apply(null,[].concat(Ja(Xb)))})};var Rb,Pb={},Qb=!1;(function(Vb,Wb){function Xb(){}for(var Yb in Xb.prototype=Wb.prototype,Vb.P=Wb.prototype,Vb.prototype=new Xb,Vb.prototype.constructor=Vb,Wb)if(Object.defineProperties){var Zb=Object.getOwnPropertyDescriptor(Wb,Yb);Zb&&Object.defineProperty(Vb,Yb,Zb)}else Vb[Yb]=Wb[Yb]})(ib,gb),ib.prototype.get=function(){if(this.i)return this.i;if(kb())try{this.i=nb(window.localStorage.getItem(this.b))}catch(Vb){}return this.i=Lb({},this.m,this.i)},ib.prototype.set=function(Vb){if(this.i=Lb({},this.m,this.i,Vb),kb())try{var Wb=JSON.stringify(this.i);window.localStorage.setItem(this.b,Wb)}catch(Xb){}},ib.prototype.j=function(){delete Pb[this.b],Object.keys(Pb).length||(window.removeEventListener("storage",mb),Qb=!1)};var Sb={};ob.prototype.isExpired=function(Vb){if(Vb=void 0===Vb?qb(this):Vb,Vb!=qb(this))return!0;if(Vb=this.a.get(),Vb.isExpired)return!0;var Wb=Vb.hitTime;return Wb&&(Vb=new Date,Wb=new Date(Wb),Vb-Wb>6E4*this.timeout||this.c&&this.c.format(Vb)!=this.c.format(Wb))},ob.prototype.b=function(Vb){var Wb=this;return function(Xb){Vb(Xb);var Yb=Xb.get("sessionControl");Xb="start"==Yb||Wb.isExpired();var Yb="end"==Yb,Zb=Wb.a.get();Zb.hitTime=+new Date,Xb&&(Zb.isExpired=!1,Zb.id=Mb()),Yb&&(Zb.isExpired=!0),Wb.a.set(Zb)}},ob.prototype.j=function(){Ta(this.f,"sendHitTask",this.b),this.a.j(),delete Sb[this.f.get("trackingId")]};var Tb=30;rb.prototype.g=function(){var Vb=document.documentElement,Wb=document.body,Vb=Math.min(100,Math.max(0,Math.round(100*(window.pageYOffset/(Math.max(Vb.offsetHeight,Vb.scrollHeight,Wb.offsetHeight,Wb.scrollHeight)-window.innerHeight))))),Wb=qb(this.h);if(Wb!=this.a.get().sessionId&&(lb(this.a),this.a.set({sessionId:Wb})),this.h.isExpired(this.a.get().sessionId))lb(this.a);else if(Wb=this.a.get()[this.c]||0,Vb>Wb&&(100!=Vb&&100!=Wb||window.removeEventListener("scroll",this.g),Wb=Vb-Wb,100==Vb||Wb>=this.b.increaseThreshold)){var Xb={};this.a.set((Xb[this.c]=Vb,Xb.sessionId=qb(this.h),Xb)),Vb={transport:"beacon",eventCategory:"Max Scroll",eventAction:"increase",eventValue:Wb,eventLabel:Vb+"",nonInteraction:!0},this.b.maxScrollMetricIndex&&(Vb["metric"+this.b.maxScrollMetricIndex]=Wb),this.f.send("event",Wa(Vb,this.b.fieldsObj,this.f,this.b.hitFilter))}},rb.prototype.l=function(Vb){var Wb=this;return function(Xb,Yb){Vb(Xb,Yb);var Zb={};("object"==("undefined"==typeof Xb?"undefined":_typeof(Xb))&&null!==Xb?Xb:(Zb[Xb]=Yb,Zb)).page&&(Xb=Wb.c,Wb.c=tb(Wb),Wb.c!=Xb&&sb(Wb))}},rb.prototype.remove=function(){this.h.j(),window.removeEventListener("scroll",this.g),Ta(this.f,"set",this.l)},ab("maxScrollTracker",rb),ub.prototype.f=function(Vb,Wb){var Xb=this;if(this.a.shouldTrackOutboundLink(Wb,Qa)){var Yb=Wb.getAttribute("href")||Wb.getAttribute("xlink:href"),Zb=Qa(Yb),Zb={transport:"beacon",eventCategory:"Outbound Link",eventAction:Vb.type,eventLabel:Zb.href},$b=Lb({},this.a.fieldsObj,Xa(Wb,this.a.attributePrefix)),_b=Wa(Zb,$b,this.c,this.a.hitFilter,Wb,Vb);if(navigator.sendBeacon||"click"!=Vb.type||"_blank"==Wb.target||Vb.metaKey||Vb.ctrlKey||Vb.shiftKey||Vb.altKey||1<Vb.which)this.c.send("event",_b);else{var ac=function(){if(window.removeEventListener("click",ac),!Vb.defaultPrevented){Vb.preventDefault();var bc=_b.hitCallback;_b.hitCallback=Za(function(){"function"==typeof bc&&bc(),location.href=Yb})}Xb.c.send("event",_b)};window.addEventListener("click",ac)}}},ub.prototype.shouldTrackOutboundLink=function(Vb,Wb){return Vb=Vb.getAttribute("href")||Vb.getAttribute("xlink:href"),Wb=Wb(Vb),Wb.hostname!=location.hostname&&"http"==Wb.protocol.slice(0,4)},ub.prototype.remove=function(){var Vb=this;Object.keys(this.b).forEach(function(Wb){Vb.b[Wb].j()})},ab("outboundLinkTracker",ub);var Ub=Mb();vb.prototype.f=function(){var Vb=this;if("visible"==document.visibilityState||"hidden"==document.visibilityState){var Wb=wb(this),Xb={time:+new Date,state:document.visibilityState,pageId:Ub,sessionId:qb(this.g)};"visible"==document.visibilityState&&this.a.sendInitialPageview&&!this.w&&(yb(this),this.w=!0),"hidden"==document.visibilityState&&this.s&&clearTimeout(this.s),this.g.isExpired(Wb.sessionId)?(lb(this.c),"hidden"==this.h&&"visible"==document.visibilityState&&(clearTimeout(this.s),this.s=setTimeout(function(){Vb.c.set(Xb),yb(Vb,{hitTime:Xb.time})},this.a.visibleThreshold))):(Wb.pageId==Ub&&"visible"==Wb.state&&xb(this,Wb),this.c.set(Xb)),this.h=document.visibilityState}},vb.prototype.l=function(Vb){var Wb=this;return function(Xb,Yb){var Zb={},Zb="object"==("undefined"==typeof Xb?"undefined":_typeof(Xb))&&null!==Xb?Xb:(Zb[Xb]=Yb,Zb);Zb.page&&Zb.page!==Wb.b.get("page")&&"visible"==Wb.h&&Wb.f(),Vb(Xb,Yb)}},vb.prototype.u=function(Vb,Wb){Vb.time!=Wb.time&&(Wb.pageId!=Ub||"visible"!=Wb.state||this.g.isExpired(Wb.sessionId)||xb(this,Wb,{hitTime:Vb.time}))},vb.prototype.o=function(){"hidden"!=this.h&&this.f()},vb.prototype.remove=function(){this.c.j(),this.g.j(),Ta(this.b,"set",this.l),window.removeEventListener("unload",this.o),document.removeEventListener("visibilitychange",this.f)},ab("pageVisibilityTracker",vb),zb.prototype.c=function(Vb){var Wb=this;return function(){for(var Yb=[],Zb=0;Zb<arguments.length;++Zb)Yb[Zb-0]=arguments[Zb];Vb.apply(null,[].concat(Ja(Yb))),Ab(Wb,!0)}},zb.prototype.f=function(Vb){var Wb=this;return function(){for(var Yb=[],Zb=0;Zb<arguments.length;++Zb)Yb[Zb-0]=arguments[Zb];Vb.apply(null,[].concat(Ja(Yb))),Ab(Wb,!1)}},zb.prototype.b=function(){Ab(this,!0)},zb.prototype.shouldTrackUrlChange=function(Vb,Wb){return Vb&&Wb},zb.prototype.remove=function(){Ta(history,"pushState",this.c),Ta(history,"replaceState",this.f),window.removeEventListener("popstate",this.b)},ab("urlChangeTracker",zb)})();
/* global ga set by Shopify */

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (window.ShopifyAnalytics != undefined && window.ShopifyAnalytics.merchantGoogleAnalytics.toString().indexOf('UA-') === -1) {

  /**
   * Bump this when making backwards incompatible changes to the tracking
   * implementation. This allows you to create a segment or view filter
   * that isolates only data captured with the most recent tracking changes.
   */
  var TRACKING_VERSION = '1';

  /**
   * A default value for dimensions so unset values always are reported as
   * something. This is needed since Google Analytics will drop empty dimension
   * values in reports.
   */
  var NULL_VALUE = '(not set)';

  /**
   * A mapping between custom dimension names and their indexes.
   */
  var dimensions = {
    TRACKING_VERSION: 'dimension1',
    CLIENT_ID: 'dimension2',
    WINDOW_ID: 'dimension3',
    HIT_ID: 'dimension4',
    HIT_TIME: 'dimension5',
    HIT_TYPE: 'dimension6',
    HIT_SOURCE: 'dimension7',
    VISIBILITY_STATE: 'dimension8',
    URL_QUERY_PARAMS: 'dimension9'
  };

  /**
   * A mapping between custom metric names and their indexes.
   */
  var metrics = {
    RESPONSE_END_TIME: 'metric1',
    DOM_LOAD_TIME: 'metric2',
    WINDOW_LOAD_TIME: 'metric3',
    PAGE_VISIBLE: 'metric4',
    MAX_SCROLL_PERCENTAGE: 'metric5',
    PAGE_LOADS: 'metric6'
  };

  /**
   * Initializes all the analytics setup. Creates trackers and sets initial
   * values on the trackers.
   */
  var initWatch = function initWatch() {
    // Initialize the command queue in case analytics.js hasn't loaded yet.
    window.ga = window.ga || function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (ga.q = ga.q || []).push(args);
    };

    createTracker();
    trackErrors();
    trackCustomDimensions();
    requireAutotrackPlugins();
    sendNavigationTimingMetrics();
  };

  /**
   * Tracks a JavaScript error with optional fields object overrides.
   * This function is exported so it can be used in other parts of the codebase.
   * E.g.:
   *
   *    `fetch('/api.json').catch(trackError);`
   *
   * @param {(Error|Object)=} err
   * @param {Object=} fieldsObj
   */
  var trackError = function trackError() {
    var err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fieldsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    ga('send', 'event', Object.assign({
      eventCategory: 'Error',
      eventAction: err.name || '(no error name)',
      eventLabel: err.message + '\n' + (err.stack || '(no stack trace)'),
      nonInteraction: true
    }, fieldsObj));
  };

  /**
   * Creates the trackers and sets the default transport and tracking
   * version fields. In non-production environments it also logs hits.
   */
  var createTracker = function createTracker() {
    // ga('create', TRACKING_ID, 'auto');

    // Ensures all hits are sent via `navigator.sendBeacon()`.
    ga('set', 'transport', 'beacon');
  };

  /**
   * Tracks any errors that may have occured on the page prior to analytics being
   * initialized, then adds an event handler to track future errors.
   */
  var trackErrors = function trackErrors() {
    // Errors that have occurred prior to this script running are stored on
    // `window.__e.q`, as specified in `index.html`.
    var loadErrorEvents = window.__e && window.__e.q || [];

    var trackErrorEvent = function trackErrorEvent(event) {
      // Use a different eventCategory for uncaught errors.
      var fieldsObj = { eventCategory: 'Uncaught Error' };

      // Some browsers don't have an error property, so we fake it.
      var err = event.error || {
        message: event.message + ' (' + event.lineno + ':' + event.colno + ')'
      };

      trackError(err, fieldsObj);
    };

    // Replay any stored load error events.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = loadErrorEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var event = _step.value;

        trackErrorEvent(event);
      }

      // Add a new listener to track event immediately.
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    window.addEventListener('error', trackErrorEvent);
  };

  /**
   * Sets a default dimension value for all custom dimensions on all trackers.
   */
  var trackCustomDimensions = function trackCustomDimensions() {
    // Sets a default dimension value for all custom dimensions to ensure
    // that every dimension in every hit has *some* value. This is necessary
    // because Google Analytics will drop rows with empty dimension values
    // in your reports.
    Object.keys(dimensions).forEach(function (key) {
      ga('set', dimensions[key], NULL_VALUE);
    });

    // Adds tracking of dimensions known at page load time.
    ga(function (tracker) {
      var _tracker$set;

      tracker.set((_tracker$set = {}, _defineProperty(_tracker$set, dimensions.TRACKING_VERSION, TRACKING_VERSION), _defineProperty(_tracker$set, dimensions.CLIENT_ID, tracker.get('clientId')), _defineProperty(_tracker$set, dimensions.WINDOW_ID, uuid()), _tracker$set));
    });

    // Adds tracking to record each the type, time, uuid, and visibility state
    // of each hit immediately before it's sent.
    ga(function (tracker) {
      var originalBuildHitTask = tracker.get('buildHitTask');
      tracker.set('buildHitTask', function (model) {
        var qt = model.get('queueTime') || 0;
        model.set(dimensions.HIT_TIME, String(new Date() - qt), true);
        model.set(dimensions.HIT_ID, uuid(), true);
        model.set(dimensions.HIT_TYPE, model.get('hitType'), true);
        model.set(dimensions.VISIBILITY_STATE, document.visibilityState, true);

        originalBuildHitTask(model);
      });
    });
  };

  /**
   * Requires select autotrack plugins and initializes each one with its
   * respective configuration options.
   */
  var requireAutotrackPlugins = function requireAutotrackPlugins() {
    ga('require', 'cleanUrlTracker', {
      stripQuery: true,
      queryDimensionIndex: getDefinitionIndex(dimensions.URL_QUERY_PARAMS),
      trailingSlash: 'remove'
    });
    ga('require', 'maxScrollTracker', {
      sessionTimeout: 30,
      timeZone: 'Australia/Melbourne',
      maxScrollMetricIndex: getDefinitionIndex(metrics.MAX_SCROLL_PERCENTAGE)
    });
    ga('require', 'outboundLinkTracker', {
      events: ['click', 'contextmenu']
    });
    ga('require', 'pageVisibilityTracker', {
      sendInitialPageview: true,
      pageLoadsMetricIndex: getDefinitionIndex(metrics.PAGE_LOADS),
      visibleMetricIndex: getDefinitionIndex(metrics.PAGE_VISIBLE),
      timeZone: 'Australia/Melbourne',
      fieldsObj: _defineProperty({}, dimensions.HIT_SOURCE, 'pageVisibilityTracker')
    });
    ga('require', 'urlChangeTracker', {
      fieldsObj: _defineProperty({}, dimensions.HIT_SOURCE, 'urlChangeTracker')
    });
  };

  /**
   * Gets the DOM and window load times and sends them as custom metrics to
   * Google Analytics via an event hit.
   */
  var sendNavigationTimingMetrics = function sendNavigationTimingMetrics() {
    // Only track performance in supporting browsers.
    if (!(window.performance && window.performance.timing)) return;

    // If the window hasn't loaded, run this function after the `load` event.
    if (document.readyState != 'complete') {
      window.addEventListener('load', sendNavigationTimingMetrics);
      return;
    }

    var nt = performance.timing;
    var navStart = nt.navigationStart;

    var responseEnd = Math.round(nt.responseEnd - navStart);
    var domLoaded = Math.round(nt.domContentLoadedEventStart - navStart);
    var windowLoaded = Math.round(nt.loadEventStart - navStart);

    // In some edge cases browsers return very obviously incorrect NT values,
    // e.g. 0, negative, or future times. This validates values before sending.
    var allValuesAreValid = function allValuesAreValid() {
      for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        values[_key2] = arguments[_key2];
      }

      return values.every(function (value) {
        return value > 0 && value < 6e6;
      });
    };

    if (allValuesAreValid(responseEnd, domLoaded, windowLoaded)) {
      var _ga;

      ga('send', 'event', (_ga = {
        eventCategory: 'Navigation Timing',
        eventAction: 'track',
        eventLabel: NULL_VALUE,
        nonInteraction: true
      }, _defineProperty(_ga, metrics.RESPONSE_END_TIME, responseEnd), _defineProperty(_ga, metrics.DOM_LOAD_TIME, domLoaded), _defineProperty(_ga, metrics.WINDOW_LOAD_TIME, windowLoaded), _ga));
    }
  };

  /**
   * Accepts a custom dimension or metric and returns it's numerical index.
   * @param {string} definition The definition string (e.g. 'dimension1').
   * @return {number} The definition index.
   */
  var getDefinitionIndex = function getDefinitionIndex(definition) {
    return +/\d+$/.exec(definition)[0];
  };

  /**
   * Generates a UUID.
   * https://gist.github.com/jed/982883
   * @param {string|undefined=} a
   * @return {string}
   */
  var uuid = function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  };

  initWatch();
}
