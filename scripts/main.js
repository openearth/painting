function AdvectionFilter(e,t){var n=new PIXI.Matrix;e.renderable=!1,PIXI.AbstractFilter.call(this,["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec4 aColor;","uniform mat3 projectionMatrix;","uniform mat3 otherMatrix;","varying vec2 vMapCoord;","varying vec2 vTextureCoord;","varying vec4 vColor;","void main(void)","{","gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","vTextureCoord = aTextureCoord;","vMapCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;","vColor = vec4(aColor.rgb * aColor.a, aColor.a);","}"].join("\n"),fragmentSource,{uUVSampler:{type:"sampler2D",value:e.texture},otherMatrix:{type:"mat3",value:n.toArray(!0)},scale:{type:"v2",value:{x:0,y:0}},flipv:{type:"bool",value:t.flipv},upwind:{type:"bool",value:t.upwind},decay:{type:"1f",value:t.decay}}),this.maskSprite=e,this.maskMatrix=n;var i=_.get(t,"scale",10);this.scale=new PIXI.Point(i,i);var o=_.get(t,"flipv",!1);this.flipv=o;var a=_.get(t,"decay",1);this.decay=a}!function(e,t){"object"==typeof exports?module.exports=t(e,e.document):"function"==typeof define&&define.amd?define(function(){return t(e,e.document)}):e.Sketch=t(e,e.document)}(this,function(e,t){"use strict";function n(e){return"[object Array]"==Object.prototype.toString.call(e)}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function a(e){return"string"==typeof e}function r(e){return T[e]||String.fromCharCode(e)}function s(e,t,n){for(var i in t)!n&&i in e||(e[i]=t[i]);return e}function l(e,t){return function(){e.apply(t,arguments)}}function c(e){var t={};for(var n in e)i(e[n])?t[n]=l(e[n],e):t[n]=e[n];return t}function d(e){function t(t){i(t)&&t.apply(e,[].splice.call(arguments,1))}function n(e){for(E=0;E<ee.length;E++)O=ee[E],a(O)?I[(e?"add":"remove")+"EventListener"].call(I,O,_,!1):i(O)?_=O:I=O}function o(){A(S),S=M(o),Z||(t(e.setup),Z=i(e.setup)),H||(t(e.resize),H=i(e.resize)),e.running&&!G&&(e.dt=(F=+new Date)-e.now,e.millis+=e.dt,e.now=F,t(e.update),Y&&(e.retina&&(e.save(),e.scale(Q,Q)),e.autoclear&&e.clear()),t(e.draw),Y&&e.retina&&e.restore()),G=++G%e.interval}function l(){I=K?e.style:e.canvas,D=K?"px":"",q=e.width||e.element.width,z=e.height||e.element.height,e.fullscreen&&(z=e.height=x.innerHeight,q=e.width=x.innerWidth),e.retina&&Y&&Q&&(I.style.height=z+"px",I.style.width=q+"px",q*=Q,z*=Q),I.height!==z&&(I.height=z+D),I.width!==q&&(I.width=q+D),Z&&t(e.resize)}function d(e,t){return V=t.getBoundingClientRect(),e.x=e.pageX-V.left-(x.scrollX||x.pageXOffset),e.y=e.pageY-V.top-(x.scrollY||x.pageYOffset),e.x*=t.width/V.width,e.y*=t.height/V.height,e}function u(t,n){return d(t,e.element),n=n||{},n.ox=n.x||t.x,n.oy=n.y||t.y,n.x=t.x,n.y=t.y,n.dx=n.x-n.ox,n.dy=n.y-n.oy,n}function h(e){if(e.preventDefault(),N=c(e),N.originalEvent=e,N.touches)for(W.length=N.touches.length,E=0;E<N.touches.length;E++)W[E]=u(N.touches[E],W[E]);else W.length=0,W[0]=u(N,J);return s(J,W[0],!0),N}function p(n){for(n=h(n),R=(X=ee.indexOf(U=n.type))-1,e.dragging=!!/down|start/.test(U)||!/up|end/.test(U)&&e.dragging;R;)a(ee[R])?t(e[ee[R--]],n):a(ee[X])?t(e[ee[X++]],n):R=0}function m(n){B=n.keyCode,j="keyup"==n.type,te[B]=te[r(B)]=!j,t(e[n.type],n)}function f(n){e.autopause&&("blur"==n.type?k:v)(),t(e[n.type],n)}function v(){e.now=+new Date,e.running=!0}function k(){e.running=!1}function $(){(e.running?k:v)()}function C(){Y&&e.clearRect(0,0,e.width,e.height)}function P(){L=e.element.parentNode,E=b.indexOf(e),L&&L.removeChild(e.element),~E&&b.splice(E,1),n(!1),k()}var S,_,I,L,V,E,D,F,O,N,U,B,j,R,X,q,z,G=0,W=[],H=!1,Z=!1,Q=x.devicePixelRatio||1,K=e.type==y,Y=e.type==g,J={x:0,y:0,ox:0,oy:0,dx:0,dy:0},ee=[e.element,p,"mousedown","touchstart",p,"mousemove","touchmove",p,"mouseup","touchend",p,"click",p,"mouseout",p,"mouseover",w,m,"keydown","keyup",x,f,"focus","blur",l,"resize"],te={};for(B in T)te[T[B]]=!1;return s(e,{touches:W,mouse:J,keys:te,dragging:!1,running:!1,millis:0,now:NaN,dt:NaN,destroy:P,toggle:$,clear:C,start:v,stop:k}),b.push(e),e.autostart&&v(),n(!0),l(),o(),e}for(var u,h,p="E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min".split(" "),m="__hasSketch",f=Math,g="canvas",v="webgl",y="dom",w=t,x=e,b=[],k={fullscreen:!0,autostart:!0,autoclear:!0,autopause:!0,container:w.body,interval:1,globals:!0,retina:!1,type:g},T={8:"BACKSPACE",9:"TAB",13:"ENTER",16:"SHIFT",27:"ESCAPE",32:"SPACE",37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN"},$={CANVAS:g,WEB_GL:v,WEBGL:v,DOM:y,instances:b,install:function(e){if(!e[m]){for(var t=0;t<p.length;t++)e[p[t]]=f[p[t]];s(e,{TWO_PI:2*f.PI,HALF_PI:f.PI/2,QUATER_PI:f.PI/4,random:function(e,t){return n(e)?e[~~(f.random()*e.length)]:(o(t)||(t=e||1,e=0),e+f.random()*(t-e))},lerp:function(e,t,n){return e+n*(t-e)},map:function(e,t,n,i,o){return(e-t)/(n-t)*(o-i)+i}}),e[m]=!0}},create:function(e){return e=s(e||{},k),e.globals&&$.install(self),u=e.element=e.element||w.createElement(e.type===y?"div":"canvas"),h=e.context=e.context||function(){switch(e.type){case g:return u.getContext("2d",e);case v:return u.getContext("webgl",e)||u.getContext("experimental-webgl",e);case y:return u.canvas=u}}(),e.exists||(e.container||w.body).appendChild(u),$.augment(h,e)},augment:function(e,t){return t=s(t||{},k),t.element=e.canvas||e,t.element.className+=" sketch",s(e,t,!0),d(e)}},C=["ms","moz","webkit","o"],P=self,S=0,_="AnimationFrame",I="request"+_,L="cancel"+_,M=P[I],A=P[L],V=0;V<C.length&&!M;V++)M=P[C[V]+"Request"+_],A=P[C[V]+"Cancel"+_];return P[I]=M=M||function(e){var t=+new Date,n=f.max(0,16-(t-S)),i=setTimeout(function(){e(t+n)},n);return S=t+n,i},P[L]=A=A||function(e){clearTimeout(e)},$}),L.CanvasOverlay=L.ImageOverlay.extend({options:{opacity:1,id:"",interactive:!0,crossOrigin:!1},initialize:function(e,t){"use strict";e?this._bounds=L.latLngBounds(e):this._bounds=null,L.setOptions(this,t)},_initImage:function(){"use strict";var e;e=this.options.el?this._image=this.options.el:this.options.id?this._image=document.getElementById(this.options.id):this._image=L.DomUtil.create("canvas","leaflet-image-layer "+(this._zoomAnimated?"leaflet-zoom-animated":"")),e.onselectstart=L.Util.falseFn,e.onmousemove=L.Util.falseFn,e.onload=L.bind(this.fire,this,"load"),this.options.crossOrigin&&(e.crossOrigin="")},_reset:function(){"use strict";L.ImageOverlay.prototype._reset.call(this);var e=this._image;e.width=this.options.width,e.height=this.options.height}}),L.canvasOverlay=function(e,t){"use strict";return new L.CanvasOverlay(e,t)};var bus=new Vue;!function(){"use strict";Vue.component("map-controls",{template:"#map-controls-template",props:{map:{type:Object}},data:function(){return{locked:!0}},watch:{locked:"lockedChanged"},mounted:function(){var e=this;$("#lockmap").on("switchChange.bootstrapSwitch",function(){$("#lockmap").is(":checked")?e.locked=!0:e.locked=!1})},methods:{lockedChanged:function(e,t){t?this.lockMap():this.unlockMap()},lockMap:function(){var e=this.map;e.dragging.disable(),e.touchZoom.disable(),e.doubleClickZoom.disable(),e.scrollWheelZoom.disable(),e.tap&&e.tap.disable(),$("#lockmap").bootstrapSwitch("state",!0,!0),$("#mapban").removeClass("hide")},unlockMap:function(){var e=this.map;e.dragging.enable(),e.touchZoom.enable(),e.doubleClickZoom.enable(),e.scrollWheelZoom.enable(),e.tap&&e.tap.enable(),$("#lockmap").bootstrapSwitch("state",!1,!0),$("#mapban").addClass("hide")}}}),Vue.component("toggle-controls",{template:"#toggle-controls-template",props:{sketch:{type:CanvasRenderingContext2D}},mounted:function(){var e=this,t=L.Control.extend({options:{position:"topright"},onAdd:function(){var t=e.$el,n=$('<a id="drawtoggle"></a>');n.append($('<span class="fa-stack"><i class="fa fa-paint-brush fa-stack-1x"></i><i id="drawingban" class="hide fa fa-ban fa-stack-2x"></i></span>')),n.on("click",function(){return sketch=this.sketch,this.sketch?(sketch.painting=!sketch.painting,void(sketch.painting?($("#drawing").addClass("crosshair"),$("#drawingban").addClass("hide")):($("#drawing").removeClass("crosshair"),$("#drawingban").removeClass("hide")))):void console.warn("no sketch available in",this)}),$(t).append(n);var i=$('<a id="maptoggle"></a>');return i.append($('<span class="fa-stack"><i class="fa fa-map-o fa-stack-1x"></i><i id="mapban" class="fa hide fa-ban fa-stack-2x></i></span>')),i.on("click",function(){_.has(this.$refs,"locked")?app.$refs.mapControls.locked=!app.$refs.mapControls.locked:console.warn("no mapControls available")}),$(t).append(i),t}});this.$drawToggle=new t({})},methods:{deferredMountedTo:function(e){var t=this;this.$drawToggle.addTo(e),_.forEach(this.$children,function(e){e.deferredMountedTo(t.$drawToggle)})}}}),Vue.component("side-bar",{template:"<div></div>",mounted:function(){this.$sidebar=L.control.sidebar("sidebar")},methods:{deferredMountedTo:function(e){var t=this;this.$sidebar.addTo(e),_.forEach(this.$children,function(e){e.deferredMountedTo(t.$sidebar)})}}}),Vue.component("canvas-layer",{template:"#canvas-layer-template",props:{model:{type:Object}},watch:{bounds:function(){this.setBounds()}},mounted:function(){var e=this.bounds;this.$drawingLayer=L.canvasOverlay(e,{el:this.$el,width:1024,height:1024})},computed:{bounds:{get:function(){var e=L.latLngBounds(L.latLng(0,0),L.latLng(1,1));if(_.has(this,"model.extent")){var t=this.model,n=L.latLng(t.extent.sw[0],t.extent.sw[1]),i=L.latLng(t.extent.ne[0],t.extent.ne[1]);e=L.latLngBounds(n,i)}return e},cache:!1}},methods:{deferredMountedTo:function(e){var t=this;this.$drawingLayer.addTo(e),_.forEach(this.$children,function(e){e.deferredMountedTo(t.$drawingLayer)})},setBounds:function(){this.$drawingLayer.setBounds(this.bounds)}}})}();var fragmentSource=["precision mediump float;","varying vec2 vMapCoord;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float decay;","uniform vec2 scale;","uniform bool flipv;","uniform bool upwind;","uniform sampler2D uPreviousImageSampler;","uniform sampler2D uUVSampler;","void main(void)","{","vec4 map =  texture2D(uUVSampler, vMapCoord);","float extrascale = 1.0;","map -= 0.5;","map.xy *= (scale * extrascale);","if (flipv) {","map.y = - map.y;","}","vec2 lookup = vec2(vTextureCoord.x - map.x, vTextureCoord.y - map.y);","if (upwind) {"," vec4 vUpwind = texture2D(uUVSampler, vec2(vMapCoord.x - map.x, vMapCoord.y - map.y ));"," vUpwind -= 0.5;"," if (flipv) {","  vUpwind.y = - vUpwind.y;"," }"," vUpwind.xy *= scale * extrascale;"," /* overwrite lookup with upwind */"," lookup = vec2(vTextureCoord.x - 0.5*(map.x + vUpwind.x), vTextureCoord.y - 0.5* (map.y + vUpwind.y));","}","/* stop rendering if masked */","vec4 color = texture2D(uPreviousImageSampler, lookup);","color = vec4(color.rgb * decay, color.a * decay); ","gl_FragColor = color;","if (map.z > 0.0) {","gl_FragColor *= 0.0;","}","}"].join("\n");AdvectionFilter.prototype=Object.create(PIXI.AbstractFilter.prototype),AdvectionFilter.prototype.constructor=AdvectionFilter,AdvectionFilter.prototype.applyFilter=function(e,t,n){var i=e.filterManager;i.calculateMappedMatrix(t.frame,this.maskSprite,this.maskMatrix),this.uniforms.otherMatrix.value=this.maskMatrix.toArray(!0),this.uniforms.scale.value.x=this.scale.x*(1/t.frame.width),this.uniforms.scale.value.y=this.scale.y*(1/t.frame.height),this.uniforms.flipv.value=this.flipv,this.uniforms.decay.value=this.decay;var o=this.getShader(e);i.applyFilter(o,t,n)},Object.defineProperties(AdvectionFilter.prototype,{map:{get:function(){return this.uniforms.uUVSampler.value},set:function(e){this.uniforms.uUVSampler.value=e}}});var sketch;!function(){"use strict";Vue.component("drawing-controls",{template:"#drawing-controls-template",props:["sketch"],data:function(){return{}}}),Vue.component("drawing-canvas",{template:"<div></div>",data:function(){return{canvas:null,sketch:null}},mounted:function(){var e=this;this.addDrawing(),this.$nextTick(function(){bus.$emit("drawing-canvas-created",e),bus.$on("model-selected",e.clear)})},methods:{clear:function(){console.log("clearing 2d"),this.sketch.clear()},deferredMountedTo:function(e){console.log("generating painting in layer",e),this.canvas=e._image,this.addDrawing()},addDrawing:function(){sketch=Sketch.create({element:this.canvas,container:null,autoclear:!1,fullscreen:!1,exists:!0,palette:["black","green"],radius:3,painting:!1,hasDragged:!0,setup:function(){},update:function(){},keydown:function(e){bus.$emit("drawing-keydown",e,this)},mouseup:function(){},mousedown:function(){this.hasDragged=!1},mousemove:function(){this.hasDragged=!0},click:function(e){console.log("click",this,e),this.fillStyle=this.palette[Math.floor(Math.random()*this.palette.length)],this.beginPath();var t=e.x,n=e.y;console.log(t,n);var i=1;this.arc(t,n,i,0,2*Math.PI),this.fill(),bus.$emit("drawing-click",this)},touchmove:function(){if(this.painting||this.keys.SHIFT){for(var e,t=this.touches.length-1;t>=0;t--)e=this.touches[t],this.lineCap="round",this.lineJoin="round",this.strokeStyle=this.palette[Math.floor(Math.random()*this.palette.length)],this.lineWidth=this.radius,this.beginPath(),this.moveTo(e.ox,e.oy),this.lineTo(e.x,e.y),this.stroke();bus.$emit("drawing-touchmove",this)}}}),console.log("Setting sketch to",sketch),Vue.set(this,"sketch",sketch),this.$nextTick(function(){bus.$emit("sketch-created",sketch)})}}}),$(function(){$("#images a.thumbnail").click(function(e){var t=$(e.currentTarget).find("img").attr("src"),n=new Image;n.onload=function(){sketch.drawImage(n,0,0)},n.src=t,e.preventDefault()})})}(),function(){"use strict";Vue.component("model-details",{template:"#model-details-template",props:["model"],data:function(){return{}}}),Vue.component("models-overview",{template:"#models-overview-template",data:function(){return{models:[]}},mounted:function(){var e=this;fetch("data/models.json").then(function(e){return e.json()}).then(function(t){e.models=t.models;var n=_.first(_.filter(e.models,["id",e.$root.settings.model]));_.isNil(n)&&(n=_.first(e.models)),e.selectModel(n)})["catch"](function(e){console.log("parsing failed",e)})},methods:{selectModel:function(e){var t=new CustomEvent("model-selected",{detail:e});document.dispatchEvent(t),bus.$emit("model-selected",e)}}})}(),function(){"use strict";function e(e,t,n){this.model=e,this.canvas=t,this.uv=n,this.width=t.width,this.height=t.height,this.particleAlpha=.8,this.replace=!0,this.particles=[],this.counter=0,this.offScreen=document.createElement("canvas"),this.offScreen.width=this.canvas.width,this.offScreen.height=this.canvas.height}e.prototype.startAnimate=function(){function e(){requestAnimationFrame(e.bind(this)),i=Date.now(),t=i-o,t<a||this.particles.length&&(this.step(60/n),this.render(),o=i-t%a)}var t,n=15,i=Date.now(),o=Date.now(),a=1e3/n;e.bind(this)()},e.prototype.create=function(){var e=new PIXI.Sprite;return e.anchor.set(.5),e.alpha=this.particleAlpha,e.x=Math.random()*this.width,e.y=Math.random()*this.height,e},e.prototype.clear=function(){this.particles=[]},e.prototype.culling=function(e){for(var t=this.particles.length,n=e,i=t-1;i>=n;i--)_.pullAt(this.particles,i),this.sprites.removeChildAt(i);for(var o=0;o<n-t;o++){var a=this.create();this.particles.push(a)}},e.prototype.step=function(e){var t=this;if(this.particles.length&&!this.uv.paused&&!this.uv.ended){var n=$("#uv-hidden")[0],i=n.getContext("2d"),o=n.width,a=n.height,r=i.getImageData(0,0,o,a);_.each(this.particles,function(n){var i=4*(Math.round(a-n.position.y)*o+Math.round(n.position.x)),s=r.data[i+0]/255-.5,l=r.data[i+1]/255-.5;l*=t.model.flipv?-1:1;var c=r.data[i+2]/255>.5;c=c||Math.abs(s)+Math.abs(l)===0,n.position.x=n.position.x+s*t.model.scale*e,n.position.y=n.position.y+l*t.model.scale*e,c=c||n.position.x>o,c=c||n.position.x<0,c=c||n.position.y>a-1,c=c||n.position.y<10,c=c||isNaN(n.position.x),c=c||isNaN(n.position.y);var d=Math.atan2(l,s)-.5*Math.PI,u=d-n.rotation,h=.1;if(Math.abs(u)>h&&(u=u>0?h:-h),n.rotation+=u,c&&(_.pull(t.particles,n),t.replace)){var p=t.create();t.particles.push(p)}},this),this.counter++}},e.prototype.render=function(){var e=this.canvas.getContext("2d"),t=this.canvas.width,n=this.canvas.height,i=2.1,o=this.offScreen.getContext("2d");o.clearRect(0,0,t,n),o.globalAlpha=.95,o.drawImage(this.canvas,0,0),e.clearRect(0,0,t,n),e.drawImage(this.offScreen,0,0),e.globalCompositingOperation="lighten",e.fillStyle="rgba(255, 91, 126, 0.3)",e.beginPath(),_.each(this.particles,function(t){e.moveTo(t.x,t.y),e.arc(t.x,t.y,i,0,2*Math.PI)}),e.closePath(),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.6)",e.beginPath(),_.each(this.particles,function(t){e.moveTo(t.x,t.y),e.arc(t.x,t.y,i/2,0,2*Math.PI)}),e.closePath(),e.fill()},Vue.component("particle-component",{template:"#particle-component-template",props:["model"],data:function(){return{particles:null,pipeline:null,stage:null,renderer:null,canvas:null}},mounted:function(){bus.$on("model-selected",this.resetParticles)},watch:{"model.uv":"resetParticles",pipeline:"resetParticles"},computed:{width:{get:function(){return _.get(this,"canvas.width")}},height:{get:function(){return _.get(this,"canvas.height")}}},methods:{deferredMountedTo:function(t){if(console.log("Generating particle canvas in layer",t),this.canvas=t._image,_.isNil(this.model))return void console.warn("No model yet, deferring creation of particles");var n=$("#uv-"+this.model.uv.tag)[0];this.particles=new e(this.model,this.canvas,n),this.particles.startAnimate()},resetParticles:function(){if(_.isNil(this.model))return void console.warn("no model, no particles",this.model);var t=$("#uv-"+this.model.uv.tag)[0];this.particles=new e(this.model,this.canvas,t),this.particles.startAnimate()},addParticles:function(){return console.log("adding particles"),_.isNil(this.model)?void console.warn("Cannot add particles, no model"):_.isNil(this.particles)?void console.warn("Cannot add particles, no particles object"):void this.particles.culling(this.particles.particles.length+50)},removeParticles:function(){this.model.particles.culling(0)}}})}(),function(){"use strict";Vue.component("uv-source",{template:"#uv-source-template",props:{model:{type:Object,required:!1}},data:function(){return{loaded:!1}},mounted:function(){function e(){if(requestAnimationFrame(e.bind(this)),i=Date.now(),t=i-o,this.video&&this.uvctx){var n=this.video.width,r=this.video.height;this.uvctx.drawImage(this.video,0,0,n,r),o=i-t%a}}var t,n=10,i=Date.now(),o=Date.now(),a=1e3/n;e.bind(this)()},watch:{uv:function(e){var t=this.video;t.src=e.src,t.height=e.height,t.width=e.width,t.load(),console.log("firing video-loaded"),bus.$emit("video-loaded",t)}},computed:{tag:{get:function(){return _.get(this,"model.uv.tag","video")},cache:!1},uv:{get:function(){return this.model?this.model.uv:null},cache:!1},video:{get:function(){return document.getElementById("uv-video")},cache:!1},uvctx:{get:function(){var e=document.getElementById("uv-hidden");return _.isNil(e)?null:e.getContext("2d")},cache:!1},img:{get:function(){return document.getElementById("uv-img")},cache:!1}},methods:{modelUpdate:function(){var e=this;return this.loaded=!1,console.log("tick tock",this.model),"video"!==this.model.uv.tag?void console.log("no video model",this.model.uv):(console.log("new video",this.video),this.video.load(),this.video.currentTime=this.video.currentTime,this.video.bind("loadeddata",function(){console.log("video loaded"),e.loaded=!0,Vue.set(e.model,"duration",e.video.duration)}),void this.video.bind("timeupdate",function(){Vue.set(e.model,"currentTime",e.video.currentTime)}))}}}),Vue.component("model-canvas",{template:"<div>model</div>",props:{model:{type:Object,required:!1},sketch:{type:CanvasRenderingContext2D,required:!1}},data:function(){return{state:"STOPPED",drawingTexture:null,videoElement:null,videoSprite:null,stage:null,renderer:null,renderTextureFrom:null,renderTextureTo:null,pipeline:null,advectionFilter:null}},mounted:function(){var e=this;bus.$on("video-loaded",function(e){console.log("got new video event",e),this.video=e}.bind(this)),Vue.nextTick(function(){console.info("mounted next",e,e.canvas),bus.$on("model-selected",e.clear3d)})},computed:{width:{get:function(){return _.get(this,"canvas.width")}},height:{get:function(){return _.get(this,"canvas.height")}},drawing:{get:function(){return _.get(this,"sketch")},cache:!1},video:{get:function(){return this.videoElement},set:function(e){console.log("new video",e,"creating new sprite"),this.videoElement=e;var t=PIXI.Texture.fromVideo(e),n=new PIXI.Sprite(t);n.width=this.width,n.height=this.height,this.videoSprite=n},cache:!1}},watch:{"model.uv":function(){var e=this;console.log("new model in",this.model.uv),this.$nextTick(function(){e.createFilter(),e.startAnimate(),e.updateUniforms(e.model)})},drawing:function(e){console.info("Drawing changed to",e),e&&(console.log("Drawing changed, generating textures for",e),this.createDrawingTexture(e))}},methods:{clear3d:function(){_.isNil(this.renderTextureFrom)||(console.log("clearing 3d"),this.renderTextureFrom.clear(),this.renderTextureTo.clear())},deferredMountedTo:function(e){console.log("Generating model canvas in layer",e),this.canvas=e._image,this.createRenderer()},createRenderer:function(){console.log("creating new canvas context",this);var e=new PIXI.WebGLRenderer(this.width,this.height,{view:this.canvas,transparent:!0,clearBeforeRender:!1,preserveDrawingBuffer:!1}),t=new PIXI.Container,n=new PIXI.Container;Vue.set(this,"pipeline",n),Vue.set(this,"stage",t),Vue.set(this,"renderer",e)},createDrawingTexture:function(e){if(e){console.info("setting drawing to",e);var t=e,n=PIXI.Texture.fromCanvas(e.element),i=new PIXI.Sprite(n);this.drawingContext=t,this.drawingSprite=i,this.drawingTexture=n}},updateUniforms:function(e){this.advectionFilter&&(this.advectionFilter.uniforms.scale.value.x=e.scale,this.advectionFilter.uniforms.scale.value.y=e.scale,this.advectionFilter.uniforms.flipv.value=e.flipv,this.advectionFilter.uniforms.decay.value=e.decay)},createFilter:function(){var e=this;if(!_.isNil(this.renderTextureFrom))return void console.warn("filter already set");if(!this.pipeline)return void console.warn("no pipeline yet");if(console.log("setting filter to",this.pipeline),!this.model)return void console.warn("no model yet");if(console.log("setting filter for model",this.model),!this.videoSprite)return void console.warn("no videosprite yet");console.log("setting filter for videoSprite",this.videoSprite);var t=this.videoSprite,n=this.model,i=this.renderer,o=this.width,a=this.height;this.stage.addChild(this.pipeline),this.pipeline.addChild(this.drawingSprite),this.advectionFilter=new AdvectionFilter(t,{scale:n.scale,flipv:n.flipv,decay:n.decay,upwind:!1}),this.stage.addChild(t),this.pipeline.filters=[this.advectionFilter];var r=new PIXI.RenderTexture(i,o,a),s=new PIXI.Sprite(r),l=new PIXI.RenderTexture(i,o,a);this.renderTextureFrom=r,this.renderTextureTo=l,this.renderSpriteFrom=s,this.pipeline.addChild(s),this.pipeline.addChild(this.drawingSprite),this.$nextTick(function(){bus.$emit("pipeline-created",e.pipeline)})},stopAnimage:function(){this.state="STOPPED"},startAnimate:function(){function e(){if("STOPPED"!==d){if(requestAnimationFrame(e.bind(this)),t.readyState<t.HAVE_ENOUGH_DATA)return void console.debug("video does not have enough data");n.scale.y=-1,i.update(),o.render(l),a.render(l,null,!0),$("#cleardrawing").is(":checked")&&c.clearRect(0,0,u.width,u.height),s.texture=a;var h=r;r=a,a=h,a.clear()}}if(!this.drawingTexture)return this.state="STOPPED",void console.warn("Starting animation but drawingTexture is",this.drawingTexture);if(!this.video)return this.state="STOPPED",void console.warn("Starting animation but video is",this.video);if(!this.videoSprite)return this.state="STOPPED",void console.warn("Starting animation but videoSprite is",this.videoSprite);this.state="STARTED";var t=this.video,n=this.videoSprite,i=this.drawingTexture,o=this.renderer,a=this.renderTextureTo,r=this.renderTextureFrom,s=this.renderSpriteFrom,l=this.stage,c=this.drawingContext,d=this.state,u=this.drawing;e.bind(this)(),$("#clear3d").click(this.clear3d)}}})}(),function(){"use strict";function e(){var e=[];d3.selectAll("circle.active").each(function(t){var n=d3.rgb(255*t.rgb[0],255*t.rgb[1],255*t.rgb[2]);e.push(n)}),_.isNil(sketch)||(sketch.palette=e)}Vue.component("painting-palettes",{template:"#paintings-template",data:function(){return{paintings:[]}},mounted:function(){var e=this;fetch("data/paintings.json").then(function(e){return e.json()}).then(function(t){e.paintings=t,e.select(e.paintings[0])})},methods:{select:function(e){bus.$emit("palette-selected",e.palette)}}}),Vue.component("palette-chart",{template:"#palette-chart-template",data:function(){return{}},props:{palette:{type:Array,"default":function(){return[]}}},mounted:function(){this.$watch("palette",function(){this.updateChart()})},methods:{updateChart:function(){var t=300,n=200,i=d3.select("#palette").select("svg"),o=i.select("g");i.attr("width",t).attr("height",n);var a=d3.scaleLinear().range([0,t]).domain([-.1,1.1]).nice(),r=d3.scaleLinear().range([n,0]).domain([-.1,1.1]).nice();o.selectAll("circle").remove(),o.selectAll("circle").data(this.palette).enter().append("circle").attr("cx",function(e){return a(e.x)}).attr("cy",function(e){return r(e.y)}).attr("r",10).style("fill",function(e){return d3.rgb(255*e.rgb[0],255*e.rgb[1],255*e.rgb[2])}).on("click",function(){d3.select(this).classed("active",!d3.select(this).classed("active")),e()}),o.selectAll("circle").classed("active",!0),e()}}}),document.addEventListener("model-loaded",function(){e()})}(),function(){"use strict";Vue.component("key-bindings",{template:"#key-bindings-template",data:function(){var e=this,t=this.$root;return{keyBindings:[{key:"p",description:"Particles",method:function(){_.has(t,"$refs.particleComponent.addParticles")&&t.$refs.particleComponent.addParticles()},arguments:{}},{key:"c",method:function(){e.clear()},description:"Clear canvas",arguments:{}},{key:"q",description:"Quiver like plot",method:function(e,t){_.isNil(t)||_.each(_.range(0,100),function(){var e=1024*Math.random(),n=1024*Math.random();t.strokeStyle="white",t.beginPath(),t.arc(e,n,1,0,2*Math.PI),t.closePath(),t.stroke()})}},{key:"g",description:"Grid plot",method:function(e,t){_.isNil(t)||_.each(_.range(0,1024,Math.pow(2,7)),function(e){t.strokeStyle="black",t.beginPath(),t.moveTo(e,0),t.lineTo(e,1024),t.closePath(),t.stroke(),t.beginPath(),t.moveTo(0,e),t.lineTo(1024,e),t.closePath(),t.stroke()})}}]}},mounted:function(){window.addEventListener("keyup",this.keyUp),bus.$on("drawing-keydown",this.drawingKey)},methods:{drawingKey:function(e,t){var n=_.first(_.filter(this.keyBindings,["key",e.key]));_.isNil(n)||n.method(e,t)},keyUp:function(e){var t=_.first(_.filter(this.keyBindings,["key",e.key]));_.isNil(t)||t.method(t.arguments)},clear:function(){var e=this.$root;e.$refs.particleComponent.removeParticles(),_.has(e.$refs,"drawingCanvas")&&(e.$refs.drawingCanvas.clear(),console.warn("Expected drawingCanvas on",e.$refs)),_.has(e.$refs,"modelCanvas")&&(e.$refs.modelCanvas.clear3d(),console.warn("Expected modelCanvas on",e.$refs))}}})}(),function(){"use strict";Vue.component("story-container",{template:"#story-container-template",data:function(){return{storyUrl:"data/stories/ecomare.json",story:null}},mounted:function(){var e=this,t=new ScrollMagic.Controller({container:this.$el}),n=this.$root;fetch(this.storyUrl).then(function(e){return e.json()}).then(function(i){Vue.set(e,"story",i),e.$nextTick(function(){var o=e.$el.getElementsByClassName("story-item");console.log("story elements",o,o.length),_.each(o,function(e,o){var a=i[o],r=new ScrollMagic.Scene({triggerElement:e,duration:e.clientHeight}).addTo(t).on("enter",function(){_.has(a,"latlng")&&n.map.setView(a.latlng,a.zoom)}).addIndicators();console.log("add scene",r)});var a=Array.from(e.$el.getElementsByClassName("jssor-slider-container"));_.map(a,function(e){var t=new $JssorSlider$(e.id,{$AutoPlay:!0});return t})})})}})}(),function(){"use strict";Vue.component("chart-container",{template:"#chart-container-template",props:["model"],data:function(){return{url:"data/timeseries/dcsm.json",chart:null}},mounted:function(){console.log("create chart in ",this.$el,"for",this.model),this.$nextTick(function(){var e={top:10,right:10,bottom:20,left:10},t=this.$el.clientWidth-e.left-e.right,n=this.$el.clientHeight-e.top-e.bottom,i=d3.scaleTime().range([0,t]),o=d3.scaleLinear().range([0,t]),a=d3.scaleLinear().range([n,0]),r=d3.scaleLinear().range([n,0]),s=d3.select(this.$el).append("svg");s.attr("width",t+e.left+e.right).attr("height",n+e.top+e.bottom).append("g").attr("transform","translate("+e.left+","+e.top+")"),d3.json(this.url,function(e){var t=e[0],o=t.data;i.domain(d3.extent(o,function(e){return d3.isoParse(e.date)})),r.domain(d3.extent(o,function(e){return e.s1}));var a=d3.line().x(function(e){return i(d3.isoParse(e.date))}).y(function(e){return r(e.s1)});s.datum(o).append("path").attr("class","line waterlevel").attr("d",a),s.append("g").attr("class","axis axis--x").attr("transform","translate(0,"+n+")").call(d3.axisBottom(i)),s.append("g").attr("class","axis axis--y").call(d3.axisLeft(r)).append("text").attr("class","axis-title").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end")});var l=[{x:this.progress,y:0},{x:this.progress,y:1}],c=d3.line().x(function(e){return o(e.x)}).y(function(e){return a(e.y)}),d=s.datum(l).append("path").attr("class","line").attr("d",c);this.chart={pathProgress:d,lineProgress:c,xLinear:o,xTime:i,y:a,svg:s}})},watch:{progress:function(e){var t=[{x:e,y:0},{x:e,y:1}];this.chart.pathProgress.datum(t).attr("d",this.chart.lineProgress)}},computed:{progress:{cache:!1,get:function(){if(!_.has(this.model,"currentTime"))return 0;var e=this.model.currentTime/this.model.duration;return e}}}})}();var app;!function(){"use strict";function e(){for(var e,t=/\+/g,n=/([^&=]+)=?([^&]*)/g,i=function(e){return decodeURIComponent(e.replace(t," "))},o=window.location.search.substring(1),a={};null!==(e=n.exec(o));){var r=i(e[2]),s=null;s="true"===r||"false"!==r&&r,a[i(e[1])]=s}return a}$(document).ready(function(){Vue.component("v-map",Vue2Leaflet.Map),Vue.component("v-tilelayer",Vue2Leaflet.TileLayer),$("#template-container").load("templates/templates.html",function(){app=new Vue({el:"#app",mounted:function(){this.$nextTick(function(){$('input[type="checkbox"]').bootstrapSwitch()})},data:function(){var t=e(),n={settings:{sidebar:!0,story:!1,chart:!1,model:null},palette:[],pipeline:null,model:null,map:null,sketch:null};return _.assign(n.settings,t),n},methods:{}}),bus.$on("model-selected",function(e){Vue.set(app,"model",e),Vue.nextTick(function(){console.log("uv source",app.$refs.uvSource.model);var t=L.latLng(e.extent.sw[0],e.extent.sw[1]),n=L.latLng(e.extent.ne[0],e.extent.ne[1]),i=L.latLngBounds(t,n);_.has(app.$refs,"map")?(console.info("fitting bounds",i,app.$refs.map),app.$refs.map.setBounds(i)):console.warn("fitBounds missing",app.$refs,app,i)})}),bus.$on("palette-selected",function(e){Vue.set(app,"palette",e)}),bus.$on("model-layer-added",function(){}),bus.$on("sketch-created",function(e){Vue.set(app,"sketch",e)}),bus.$on("pipeline-created",function(e){Vue.set(app,"pipeline",e)})})})}();