function AdvectionFilter(t,e){var i=new PIXI.Matrix;t.renderable=!1,PIXI.AbstractFilter.call(this,["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec4 aColor;","uniform mat3 projectionMatrix;","uniform mat3 otherMatrix;","varying vec2 vMapCoord;","varying vec2 vTextureCoord;","varying vec4 vColor;","void main(void)","{","gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","vTextureCoord = aTextureCoord;","vMapCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;","vColor = vec4(aColor.rgb * aColor.a, aColor.a);","}"].join("\n"),fragmentSource,{uUVSampler:{type:"sampler2D",value:t.texture},otherMatrix:{type:"mat3",value:i.toArray(!0)},scale:{type:"v2",value:{x:0,y:0}},flipv:{type:"bool",value:e.flipv},upwind:{type:"bool",value:e.upwind},decay:{type:"1f",value:e.decay}}),this.maskSprite=t,this.maskMatrix=i;var n=_.get(e,"scale",10);this.scale=new PIXI.Point(n,n);var o=_.get(e,"flipv",!1);this.flipv=o;var a=_.get(e,"decay",1);this.decay=a}!function(t,e){"object"==typeof exports?module.exports=e(t,t.document):"function"==typeof define&&define.amd?define(function(){return e(t,t.document)}):t.Sketch=e(t,t.document)}(this,function(t,e){"use strict";function i(t){return"[object Array]"==Object.prototype.toString.call(t)}function n(t){return"function"==typeof t}function o(t){return"number"==typeof t}function a(t){return"string"==typeof t}function s(t){return _[t]||String.fromCharCode(t)}function r(t,e,i){for(var n in e)!i&&n in t||(t[n]=e[n]);return t}function c(t,e){return function(){t.apply(e,arguments)}}function l(t){var e={};for(var i in t)n(t[i])?e[i]=c(t[i],t):e[i]=t[i];return e}function d(t){function e(e){n(e)&&e.apply(t,[].splice.call(arguments,1))}function i(t){for(A=0;A<tt.length;A++)N=tt[A],a(N)?L[(t?"add":"remove")+"EventListener"].call(L,N,S,!1):n(N)?S=N:L=N}function o(){E(P),P=M(o),q||(e(t.setup),q=n(t.setup)),Z||(e(t.resize),Z=n(t.resize)),t.running&&!G&&(t.dt=(O=+new Date)-t.now,t.millis+=t.dt,t.now=O,e(t.update),Y&&(t.retina&&(t.save(),t.scale(Q,Q)),t.autoclear&&t.clear()),e(t.draw),Y&&t.retina&&t.restore()),G=++G%t.interval}function c(){L=K?t.style:t.canvas,D=K?"px":"",z=t.width||t.element.width,W=t.height||t.element.height,t.fullscreen&&(W=t.height=x.innerHeight,z=t.width=x.innerWidth),t.retina&&Y&&Q&&(L.style.height=W+"px",L.style.width=z+"px",z*=Q,W*=Q),L.height!==W&&(L.height=W+D),L.width!==z&&(L.width=z+D),q&&e(t.resize)}function d(t,e){return V=e.getBoundingClientRect(),t.x=t.pageX-V.left-(x.scrollX||x.pageXOffset),t.y=t.pageY-V.top-(x.scrollY||x.pageYOffset),t.x*=e.width/V.width,t.y*=e.height/V.height,t}function u(e,i){return d(e,t.element),i=i||{},i.ox=i.x||e.x,i.oy=i.y||e.y,i.x=e.x,i.y=e.y,i.dx=i.x-i.ox,i.dy=i.y-i.oy,i}function h(t){if(t.preventDefault(),B=l(t),B.originalEvent=t,B.touches)for(H.length=B.touches.length,A=0;A<B.touches.length;A++)H[A]=u(B.touches[A],H[A]);else H.length=0,H[0]=u(B,J);return r(J,H[0],!0),B}function p(i){for(i=h(i),R=(X=tt.indexOf(F=i.type))-1,t.dragging=!!/down|start/.test(F)||!/up|end/.test(F)&&t.dragging;R;)a(tt[R])?e(t[tt[R--]],i):a(tt[X])?e(t[tt[X++]],i):R=0}function m(i){U=i.keyCode,j="keyup"==i.type,et[U]=et[s(U)]=!j,e(t[i.type],i)}function f(i){t.autopause&&("blur"==i.type?k:v)(),e(t[i.type],i)}function v(){t.now=+new Date,t.running=!0}function k(){t.running=!1}function T(){(t.running?k:v)()}function C(){Y&&t.clearRect(0,0,t.width,t.height)}function $(){I=t.element.parentNode,A=b.indexOf(t),I&&I.removeChild(t.element),~A&&b.splice(A,1),i(!1),k()}var P,S,L,I,V,A,D,O,N,B,F,U,j,R,X,z,W,G=0,H=[],Z=!1,q=!1,Q=x.devicePixelRatio||1,K=t.type==y,Y=t.type==g,J={x:0,y:0,ox:0,oy:0,dx:0,dy:0},tt=[t.element,p,"mousedown","touchstart",p,"mousemove","touchmove",p,"mouseup","touchend",p,"click",p,"mouseout",p,"mouseover",w,m,"keydown","keyup",x,f,"focus","blur",c,"resize"],et={};for(U in _)et[_[U]]=!1;return r(t,{touches:H,mouse:J,keys:et,dragging:!1,running:!1,millis:0,now:NaN,dt:NaN,destroy:$,toggle:T,clear:C,start:v,stop:k}),b.push(t),t.autostart&&v(),i(!0),c(),o(),t}for(var u,h,p="E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min".split(" "),m="__hasSketch",f=Math,g="canvas",v="webgl",y="dom",w=e,x=t,b=[],k={fullscreen:!0,autostart:!0,autoclear:!0,autopause:!0,container:w.body,interval:1,globals:!0,retina:!1,type:g},_={8:"BACKSPACE",9:"TAB",13:"ENTER",16:"SHIFT",27:"ESCAPE",32:"SPACE",37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN"},T={CANVAS:g,WEB_GL:v,WEBGL:v,DOM:y,instances:b,install:function(t){if(!t[m]){for(var e=0;e<p.length;e++)t[p[e]]=f[p[e]];r(t,{TWO_PI:2*f.PI,HALF_PI:f.PI/2,QUATER_PI:f.PI/4,random:function(t,e){return i(t)?t[~~(f.random()*t.length)]:(o(e)||(e=t||1,t=0),t+f.random()*(e-t))},lerp:function(t,e,i){return t+i*(e-t)},map:function(t,e,i,n,o){return(t-e)/(i-e)*(o-n)+n}}),t[m]=!0}},create:function(t){return t=r(t||{},k),t.globals&&T.install(self),u=t.element=t.element||w.createElement(t.type===y?"div":"canvas"),h=t.context=t.context||function(){switch(t.type){case g:return u.getContext("2d",t);case v:return u.getContext("webgl",t)||u.getContext("experimental-webgl",t);case y:return u.canvas=u}}(),t.exists||(t.container||w.body).appendChild(u),T.augment(h,t)},augment:function(t,e){return e=r(e||{},k),e.element=t.canvas||t,e.element.className+=" sketch",r(t,e,!0),d(t)}},C=["ms","moz","webkit","o"],$=self,P=0,S="AnimationFrame",L="request"+S,I="cancel"+S,M=$[L],E=$[I],V=0;V<C.length&&!M;V++)M=$[C[V]+"Request"+S],E=$[C[V]+"Cancel"+S];return $[L]=M=M||function(t){var e=+new Date,i=f.max(0,16-(e-P)),n=setTimeout(function(){t(e+i)},i);return P=e+i,n},$[I]=E=E||function(t){clearTimeout(t)},T}),L.CanvasOverlay=L.Layer.extend({options:{opacity:1,id:"",interactive:!1,crossOrigin:!1},initialize:function(t,e){"use strict";t?this._bounds=L.latLngBounds(t):this._bounds=null,this._zoomAnimated=!0,L.setOptions(this,e)},onAdd:function(){"use strict";this._canvas||(this._initCanvas(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(L.DomUtil.addClass(this._canvas,"leaflet-interactive"),this.addInteractiveTarget(this._canvas)),this.getPane().appendChild(this._canvas),this._reset()},onRemove:function(){"use strict";L.DomUtil.remove(this._canvas),this.options.interactive&&this.removeInteractiveTarget(this._canvas)},setOpacity:function(t){"use strict";return this.options.opacity=t,this._canvas&&this._updateOpacity(),this},setStyle:function(t){"use strict";return t.opacity&&this.setOpacity(t.opacity),this},bringToFront:function(){"use strict";return this._map&&L.DomUtil.toFront(this._canvas),this},bringToBack:function(){"use strict";return this._map&&L.DomUtil.toBack(this._canvas),this},setBounds:function(t){"use strict";return this._bounds=t,this._map&&this._reset(),this},getEvents:function(){"use strict";var t={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},getBounds:function(){"use strict";return this._bounds},getElement:function(){"use strict";return this._canvas},_initCanvas:function(){"use strict";var t;t=this.options.el?this._canvas=this.options.el:this.options.id?this._canvas=document.getElementById(this.options.id):this._canvas=L.DomUtil.create("canvas","leaflet-canvas-layer "+(this._zoomAnimated?"leaflet-zoom-animated":"")),t.onselectstart=L.Util.falseFn,t.onmousemove=L.Util.falseFn,t.onload=L.bind(this.fire,this,"load"),this.options.crossOrigin&&(t.crossOrigin="")},_animateZoom:function(t){"use strict";var e=this._map.getZoomScale(t.zoom),i=this._latLngBoundsToNewLayerBounds(this._bounds,t.zoom,t.center).min;L.DomUtil.setTransform(this._canvas,i,e)},_latLngBoundsToNewLayerBounds:function(t,e,i){"use strict";var n=this._map._getNewPixelOrigin(i,e);return L.bounds([this._map.project(t.getSouthWest(),e)._subtract(n),this._map.project(t.getNorthWest(),e)._subtract(n),this._map.project(t.getSouthEast(),e)._subtract(n),this._map.project(t.getNorthEast(),e)._subtract(n)])},_reset:function(){"use strict";var t=this._canvas,e=new L.Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),i=e.getSize();L.DomUtil.setPosition(t,e.min),t.width=this.options.width,t.height=this.options.height,t.style.width=i.x+"px",t.style.height=i.y+"px"},_updateOpacity:function(){"use strict";L.DomUtil.setOpacity(this._canvas,this.options.opacity)}}),L.canvasOverlay=function(t,e){"use strict";return new L.CanvasOverlay(t,e)};var bus=new Vue;!function(){"use strict";Vue.component("map-controls",{template:"#map-controls-template",props:{map:{type:Object}},data:function(){return{locked:!0}},watch:{locked:"lockedChanged"},mounted:function(){var t=this;$("#lockmap").on("switchChange.bootstrapSwitch",function(){$("#lockmap").is(":checked")?t.locked=!0:t.locked=!1})},methods:{lockedChanged:function(t,e){e?this.lockMap():this.unlockMap()},lockMap:function(){var t=this.map;t.dragging.disable(),t.touchZoom.disable(),t.doubleClickZoom.disable(),t.scrollWheelZoom.disable(),t.tap&&t.tap.disable(),$("#lockmap").bootstrapSwitch("state",!0,!0),$("#mapban").removeClass("hide")},unlockMap:function(){var t=this.map;t.dragging.enable(),t.touchZoom.enable(),t.doubleClickZoom.enable(),t.scrollWheelZoom.enable(),t.tap&&t.tap.enable(),$("#lockmap").bootstrapSwitch("state",!1,!0),$("#mapban").addClass("hide")}}}),Vue.component("toggle-controls",{template:"#toggle-controls-template",props:{sketch:{type:CanvasRenderingContext2D}},mounted:function(){var t=this,e=L.Control.extend({options:{position:"topright"},onAdd:function(){var e=t.$el,i=$('<a id="drawtoggle"></a>');i.append($('<span class="fa-stack"><i class="fa fa-paint-brush fa-stack-1x"></i><i id="drawingban" class="hide fa fa-ban fa-stack-2x"></i></span>')),i.on("click",function(){return sketch=this.sketch,this.sketch?(sketch.painting=!sketch.painting,void(sketch.painting?($("#drawing").addClass("crosshair"),$("#drawingban").addClass("hide")):($("#drawing").removeClass("crosshair"),$("#drawingban").removeClass("hide")))):void console.warn("no sketch available in",this)}),$(e).append(i);var n=$('<a id="maptoggle"></a>');return n.append($('<span class="fa-stack"><i class="fa fa-map-o fa-stack-1x"></i><i id="mapban" class="fa hide fa-ban fa-stack-2x></i></span>')),n.on("click",function(){_.has(this.$refs,"locked")?app.$refs.mapControls.locked=!app.$refs.mapControls.locked:console.warn("no mapControls available")}),$(e).append(n),e}});this.$drawToggle=new e({})},methods:{deferredMountedTo:function(t){var e=this;this.$drawToggle.addTo(t),_.forEach(this.$children,function(t){t.deferredMountedTo(e.$drawToggle)})}}}),Vue.component("side-bar",{template:"<div></div>",mounted:function(){this.$sidebar=L.control.sidebar("sidebar")},methods:{deferredMountedTo:function(t){var e=this;this.$sidebar.addTo(t),_.forEach(this.$children,function(t){t.deferredMountedTo(e.$sidebar)})}}}),Vue.component("canvas-layer",{template:"#canvas-layer-template",props:{model:{type:Object}},watch:{bounds:function(){this.setBounds()}},mounted:function(){var t=this.bounds;this.$drawingLayer=L.canvasOverlay(t,{el:this.$el,width:1024,height:1024})},computed:{bounds:{get:function(){var t=L.latLngBounds(L.latLng(0,0),L.latLng(1,1));if(_.has(this,"model.extent")){var e=this.model,i=L.latLng(e.extent.sw[0],e.extent.sw[1]),n=L.latLng(e.extent.ne[0],e.extent.ne[1]);t=L.latLngBounds(i,n)}return t},cache:!1}},methods:{deferredMountedTo:function(t){var e=this;this.$drawingLayer.addTo(t),_.forEach(this.$children,function(t){t.deferredMountedTo(e.$drawingLayer)})},setBounds:function(){this.$drawingLayer.setBounds(this.bounds)}}})}();var fragmentSource=["precision mediump float;","varying vec2 vMapCoord;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float decay;","uniform vec2 scale;","uniform bool flipv;","uniform bool upwind;","uniform sampler2D uPreviousImageSampler;","uniform sampler2D uUVSampler;","void main(void)","{","vec4 map =  texture2D(uUVSampler, vMapCoord);","float extrascale = 1.0;","map -= 0.5;","map.xy *= (scale * extrascale);","if (flipv) {","map.y = - map.y;","}","vec2 lookup = vec2(vTextureCoord.x - map.x, vTextureCoord.y - map.y);","if (upwind) {"," vec4 vUpwind = texture2D(uUVSampler, vec2(vMapCoord.x - map.x, vMapCoord.y - map.y ));"," vUpwind -= 0.5;"," if (flipv) {","  vUpwind.y = - vUpwind.y;"," }"," vUpwind.xy *= scale * extrascale;"," /* overwrite lookup with upwind */"," lookup = vec2(vTextureCoord.x - 0.5*(map.x + vUpwind.x), vTextureCoord.y - 0.5* (map.y + vUpwind.y));","}","/* stop rendering if masked */","vec4 color = texture2D(uPreviousImageSampler, lookup);","color = vec4(color.rgb * decay, color.a * decay); ","gl_FragColor = color;","if (map.z > 0.0) {","gl_FragColor *= 0.0;","}","}"].join("\n");AdvectionFilter.prototype=Object.create(PIXI.AbstractFilter.prototype),AdvectionFilter.prototype.constructor=AdvectionFilter,AdvectionFilter.prototype.applyFilter=function(t,e,i){var n=t.filterManager;n.calculateMappedMatrix(e.frame,this.maskSprite,this.maskMatrix),this.uniforms.otherMatrix.value=this.maskMatrix.toArray(!0),this.uniforms.scale.value.x=this.scale.x*(1/e.frame.width),this.uniforms.scale.value.y=this.scale.y*(1/e.frame.height),this.uniforms.flipv.value=this.flipv,this.uniforms.decay.value=this.decay;var o=this.getShader(t);n.applyFilter(o,e,i)},Object.defineProperties(AdvectionFilter.prototype,{map:{get:function(){return this.uniforms.uUVSampler.value},set:function(t){this.uniforms.uUVSampler.value=t}}});var sketch;!function(){"use strict";Vue.component("drawing-controls",{template:"#drawing-controls-template",props:["sketch"],data:function(){return{}}}),Vue.component("drawing-canvas",{template:"<div>drawing</div>",data:function(){return{canvas:null,sketch:null}},mounted:function(){var t=this;this.addDrawing(),this.$nextTick(function(){bus.$emit("drawing-canvas-created",t),bus.$on("model-selected",t.clear)})},methods:{clear:function(){console.log("clearing 2d"),this.sketch.clear()},deferredMountedTo:function(t){console.log("generating painting in layer",t),this.canvas=t._canvas,this.addDrawing()},addDrawing:function(){sketch=Sketch.create({element:this.canvas,container:null,autoclear:!1,fullscreen:!1,exists:!0,palette:["black","green"],radius:3,painting:!1,hasDragged:!0,setup:function(){},update:function(){},keydown:function(t){bus.$emit("drawing-keydown",t,this)},mouseup:function(){},mousedown:function(){this.hasDragged=!1},mousemove:function(){this.hasDragged=!0},click:function(t){console.log("click",this,t),this.fillStyle=this.palette[Math.floor(Math.random()*this.palette.length)],this.beginPath();var e=t.x,i=t.y;console.log(e,i);var n=1;this.arc(e,i,n,0,2*Math.PI),this.fill(),bus.$emit("drawing-click",this)},touchmove:function(){if(this.painting||this.keys.SHIFT){for(var t,e=this.touches.length-1;e>=0;e--)t=this.touches[e],this.lineCap="round",this.lineJoin="round",this.strokeStyle=this.palette[Math.floor(Math.random()*this.palette.length)],this.lineWidth=this.radius,this.beginPath(),this.moveTo(t.ox,t.oy),this.lineTo(t.x,t.y),this.stroke();bus.$emit("drawing-touchmove",this)}}}),console.log("Setting sketch to",sketch),Vue.set(this,"sketch",sketch),this.$nextTick(function(){bus.$emit("sketch-created",sketch)})}}}),$(function(){$("#images a.thumbnail").click(function(t){var e=$(t.currentTarget).find("img").attr("src"),i=new Image;i.onload=function(){sketch.drawImage(i,0,0)},i.src=e,t.preventDefault()})})}(),function(){"use strict";Vue.component("model-details",{template:"#model-details-template",props:["model"],data:function(){return{}}}),Vue.component("models-overview",{template:"#models-overview-template",data:function(){return{models:[]}},mounted:function(){var t=this;fetch("data/models.json").then(function(t){return t.json()}).then(function(e){t.models=e.models;var i=_.first(_.filter(t.models,["id",t.$root.settings.model]));_.isNil(i)&&(i=_.first(t.models)),t.selectModel(i)})["catch"](function(t){console.log("parsing failed",t)})},methods:{selectModel:function(t){var e=new CustomEvent("model-selected",{detail:t});document.dispatchEvent(e),bus.$emit("model-selected",t)}}})}(),function(){"use strict";function t(t,e,i,n){this.model=t,this.canvas=e,this.uv=n,this.width=e.width,this.height=e.height,this.canvasIcon=$("#canvas-icon")[0],this.drawDot(),this.icon="images/bar.png",this.particleAlpha=.8,this.tailLength=0,this.replace=!0,this.particles=[],this.sprites=new PIXI.ParticleContainer(0,{scale:!0,position:!0,rotation:!0,uvs:!0,alpha:!0}),i.addChild(this.sprites),this.counter=0,this.iconTexture=null}t.prototype.drawElipse=function(){var t=this.canvasIcon.getContext("2d");t.clearRect(0,0,10,10),t.fillStyle="rgba(200, 220, 240, 0.8)",t.strokeStyle="rgba(255, 255, 255, 0.8)",t.strokeWidth="rgba(255, 255, 255)",t.beginPath(),t.ellipse(5,5,2,2,0,0,2*Math.PI),t.fill(),this.iconTexture&&this.iconTexture.update()},t.prototype.drawDot=function(){var t=this.canvasIcon.getContext("2d");t.clearRect(0,0,10,10),t.fillStyle="rgba(255, 255, 255, 1.0)",t.beginPath(),t.arc(5,5,1,0,2*Math.PI),t.fill(),this.iconTexture&&this.iconTexture.update()},t.prototype.create=function(){this.iconTexture=PIXI.Texture.fromCanvas(this.canvasIcon);var t=new PIXI.Sprite(this.iconTexture);return t.anchor.set(.5),t.alpha=this.particleAlpha,t.x=Math.random()*this.width,t.y=Math.random()*this.height,t.tail=[],t},t.prototype.clear=function(){this.particles=[],this.sprites.removeChildren()},t.prototype.culling=function(t){for(var e=this.particles.length,i=t,n=e-1;n>=i;n--)_.pullAt(this.particles,n),this.sprites.removeChildAt(n);for(var o=0;o<i-e;o++){var a=this.create();this.particles.push(a),this.sprites.addChild(a)}},t.prototype.step=function(){var t=this;if(this.particles.length&&!this.uv.paused&&!this.uv.ended){var e=$("#drawing")[0],i=e.getContext("2d");i.strokeStyle="rgba(255, 255, 255, 0.1)";var n=$("#uvhidden")[0],o=n.getContext("2d"),a=n.width,s=n.height;o.drawImage(this.uv,0,0,a,s);var r=o.getImageData(0,0,a,s);_.each(this.particles,function(e){var n=4*(Math.round(s-e.position.y)*a+Math.round(e.position.x)),o=r.data[n+0]/255-.5,c=r.data[n+1]/255-.5;c*=t.model.flipv?-1:1;var l=r.data[n+2]/255>.5;l=l||Math.abs(o)+Math.abs(c)===0,e.position.x=e.position.x+o*t.model.scale,e.position.y=e.position.y+c*t.model.scale,l=l||e.position.x>a,l=l||e.position.x<0,l=l||e.position.y>s,l=l||e.position.y<0,l=l||isNaN(e.position.x),l=l||isNaN(e.position.y);var d=Math.atan2(c,o)-.5*Math.PI,u=d-e.rotation,h=.1;if(Math.abs(u)>h&&(u=u>0?h:-h),e.rotation+=u,l&&(_.pull(t.particles,e),t.sprites.removeChild(e),t.replace)){var p=t.create();t.particles.push(p),t.sprites.addChild(p)}if(t.particles.length<300){if(t.counter%10===0)for(e.tail.push(_.clone(e.position));e.tail.length>t.tailLength;)e.tail.shift();if(e.tail.length>0){i.beginPath(),i.moveTo(e.tail[0].x,e.tail[0].y);for(var m=1;m<e.tail.length;m++)i.lineTo(e.tail[m].x,e.tail[m].y);i.stroke()}}},this),this.counter++}},Vue.component("particle-component",{template:"#particle-component-template",props:["model","sketch","pipeline"],data:function(){return{}},mounted:function(){bus.$on("model-selected",this.resetParticles)},watch:{"model.uv":"resetParticles",sketch:"resetParticles",pipeline:"resetParticles"},methods:{resetParticles:function(){if(_.isNil(this.model))return void console.warn("no model, no particles",this.model);if(_.isNil(this.sketch))return void console.warn("no canvas, no particles",this.sketch);if(_.isNil(this.pipeline))return void console.warn("no pipeline, no particles",this.pipeline);var e=$("#uv-"+this.model.uv.tag)[0];this.model.particles=new t(this.model,this.sketch.element,this.pipeline,e)},addParticles:function(){if(console.log("adding particles"),!_.isNil(this.model.particles)){var t=this.model.particles;t.culling(t.particles.length+50)}},removeParticles:function(){this.model.particles.culling(0)}}})}(),function(){"use strict";Vue.component("uv-source",{template:"#uv-source-template",props:{model:{type:Object,required:!1}},data:function(){return{loaded:!1}},mounted:function(){},watch:{uv:function(t){var e=this.video;e.src=t.src,e.height=t.height,e.width=t.width,e.load(),console.log("firing video-loaded"),bus.$emit("video-loaded",e)}},computed:{tag:{get:function(){return _.get(this,"model.uv.tag","video")},cache:!1},uv:{get:function(){return this.model?this.model.uv:null},cache:!1},video:{get:function(){return document.getElementById("uv-video")},cache:!1},img:{get:function(){return document.getElementById("uv-img")},cache:!1}},methods:{modelUpdate:function(){var t=this;return this.loaded=!1,console.log("tick tock",this.model),"video"!==this.model.uv.tag?void console.log("no video model",this.model.uv):(console.log("new video",this.video),this.video.load(),this.video.currentTime=this.video.currentTime,this.video.bind("loadeddata",function(){console.log("video loaded"),t.loaded=!0,Vue.set(t.model,"duration",t.video.duration)}),void this.video.bind("timeupdate",function(){Vue.set(t.model,"currentTime",t.video.currentTime)}))}}}),Vue.component("model-canvas",{template:"<div>model</div>",props:{model:{type:Object,required:!1},sketch:{type:CanvasRenderingContext2D,required:!1}},data:function(){return{state:"STOPPED",drawingTexture:null,videoElement:null,videoSprite:null,stage:null,renderer:null,renderTextureFrom:null,renderTextureTo:null,pipeline:null}},mounted:function(){var t=this;bus.$on("video-loaded",function(t){console.log("got new video event",t),this.video=t}.bind(this)),Vue.nextTick(function(){console.info("mounted next",t,t.canvas),bus.$on("model-selected",t.clear3d)})},computed:{width:{get:function(){return _.get(this,"canvas.width")}},height:{get:function(){return _.get(this,"canvas.height")}},drawing:{get:function(){return _.get(this,"sketch")},cache:!1},video:{get:function(){return this.videoElement},set:function(t){console.log("new video",t,"creating new sprite"),this.videoElement=t;var e=PIXI.Texture.fromVideo(t),i=new PIXI.Sprite(e);i.width=this.width,i.height=this.height,this.videoSprite=i},cache:!1}},watch:{"model.uv":function(){var t=this;console.log("new model in",this.model.uv),this.$nextTick(function(){t.setFilter(),t.startAnimate()})},drawing:function(t){console.info("Drawing changed to",t),t&&(console.log("Drawing changed, generating textures for",t),this.setDrawing(t))}},methods:{clear3d:function(){_.isNil(this.renderTextureFrom)||(console.log("clearing 3d"),this.renderTextureFrom.clear())},deferredMountedTo:function(t){console.log("Generating model canvas in layer",t),this.canvas=t._canvas,this.createRenderer()},createRenderer:function(){console.log("creating new canvas context",this);var t=new PIXI.WebGLRenderer(this.width,this.height,{view:this.canvas,transparent:!0,clearBeforeRender:!1,preserveDrawingBuffer:!1}),e=new PIXI.Container,i=new PIXI.Container;Vue.set(this,"pipeline",i),Vue.set(this,"stage",e),Vue.set(this,"renderer",t)},setDrawing:function(t){if(t){console.info("setting drawing to",t);var e=t,i=PIXI.Texture.fromCanvas(t.element),n=new PIXI.Sprite(i);this.drawingContext=e,this.drawingSprite=n,this.drawingTexture=i}},setFilter:function(){var t=this;if(!this.pipeline)return void console.warn("no pipeline yet");if(console.log("setting filter to",this.pipeline),!this.model)return void console.warn("no model yet");if(console.log("setting filter for model",this.model),!this.videoSprite)return void console.warn("no videosprite yet");console.log("setting filter for videoSprite",this.videoSprite);var e=this.videoSprite,i=this.model,n=this.renderer,o=this.width,a=this.height;this.stage.addChild(this.pipeline),this.pipeline.addChild(this.drawingSprite);var s=new AdvectionFilter(e,{scale:i.scale,flipv:i.flipv,decay:i.decay,upwind:!1});this.stage.addChild(e),this.pipeline.filters=[s];var r=new PIXI.RenderTexture(n,o,a),c=new PIXI.Sprite(r),l=new PIXI.RenderTexture(n,o,a);this.renderTextureFrom=r,this.renderTextureTo=l,this.renderSpriteFrom=c,this.pipeline.addChild(c),this.pipeline.addChild(this.drawingSprite),this.$nextTick(function(){bus.$emit("pipeline-created",t.pipeline)})},stopAnimage:function(){this.state="STOPPED"},startAnimate:function(){function t(){if("STOPPED"!==u){if(requestAnimationFrame(t),e.readyState<e.HAVE_ENOUGH_DATA)return void console.debug("video does not have enough data");i.scale.y=-1,n.update(),o.render(l),a.render(l,null,!0),$("#cleardrawing").is(":checked")&&d.clearRect(0,0,h.width,h.height),r.texture=a;var p=s;s=a,a=p,a.clear(),_.isNil(c.particles)||(c.particles.step(),c.particles.particles.length>500&&s.clear())}}if(!this.drawingTexture)return this.state="STOPPED",void console.warn("Starting animation but drawingTexture is",this.drawingTexture);if(!this.video)return this.state="STOPPED",void console.warn("Starting animation but video is",this.video);if(!this.videoSprite)return this.state="STOPPED",void console.warn("Starting animation but videoSprite is",this.videoSprite);this.state="STARTED";var e=this.video,i=this.videoSprite,n=this.drawingTexture,o=this.renderer,a=this.renderTextureTo,s=this.renderTextureFrom,r=this.renderSpriteFrom,c=this.model,l=this.stage,d=this.drawingContext,u=this.state,h=this.drawing;t.bind(this)(),$("#clear3d").click(this.clear3d)}}})}(),function(){"use strict";function t(){var t=[];d3.selectAll("circle.active").each(function(e){var i=d3.rgb(255*e.rgb[0],255*e.rgb[1],255*e.rgb[2]);t.push(i)}),_.isNil(sketch)||(sketch.palette=t)}Vue.component("painting-palettes",{template:"#paintings-template",data:function(){return{paintings:[]}},mounted:function(){var t=this;fetch("data/paintings.json").then(function(t){return t.json()}).then(function(e){t.paintings=e,t.select(t.paintings[0])})},methods:{select:function(t){bus.$emit("palette-selected",t.palette)}}}),Vue.component("palette-chart",{template:"#palette-chart-template",data:function(){return{}},props:{palette:{type:Array,"default":function(){return[]}}},mounted:function(){this.$watch("palette",function(){this.updateChart()})},methods:{updateChart:function(){var e=300,i=200,n=d3.select("#palette").select("svg"),o=n.select("g");n.attr("width",e).attr("height",i);var a=d3.scaleLinear().range([0,e]).domain([-.1,1.1]).nice(),s=d3.scaleLinear().range([i,0]).domain([-.1,1.1]).nice();o.selectAll("circle").remove(),o.selectAll("circle").data(this.palette).enter().append("circle").attr("cx",function(t){return a(t.x)}).attr("cy",function(t){return s(t.y)}).attr("r",10).style("fill",function(t){return d3.rgb(255*t.rgb[0],255*t.rgb[1],255*t.rgb[2])}).on("click",function(){d3.select(this).classed("active",!d3.select(this).classed("active")),t()}),o.selectAll("circle").classed("active",!0),t()}}}),document.addEventListener("model-loaded",function(){t()})}(),function(){"use strict";Vue.component("key-bindings",{template:"#key-bindings-template",data:function(){var t=this,e=this.$root;return{keyBindings:[{key:"p",description:"Particles",method:function(){_.has(e,"$refs.particleComponent.addParticles")&&e.$refs.particleComponent.addParticles()},arguments:{}},{key:"c",method:function(){t.clear()},description:"Clear canvas",arguments:{}},{key:"q",description:"Quiver like plot",method:function(t,e){_.isNil(e)||_.each(_.range(0,100),function(){var t=1024*Math.random(),i=1024*Math.random();e.strokeStyle="white",e.beginPath(),e.arc(t,i,1,0,2*Math.PI),e.closePath(),e.stroke()})}},{key:"g",description:"Grid plot",method:function(t,e){_.isNil(e)||_.each(_.range(0,1024,Math.pow(2,7)),function(t){e.strokeStyle="black",e.beginPath(),e.moveTo(t,0),e.lineTo(t,1024),e.closePath(),e.stroke(),e.beginPath(),e.moveTo(0,t),e.lineTo(1024,t),e.closePath(),e.stroke()})}}]}},mounted:function(){window.addEventListener("keyup",this.keyUp),bus.$on("drawing-keydown",this.drawingKey)},methods:{drawingKey:function(t,e){var i=_.first(_.filter(this.keyBindings,["key",t.key]));_.isNil(i)||i.method(t,e)},keyUp:function(t){var e=_.first(_.filter(this.keyBindings,["key",t.key]));_.isNil(e)||e.method(e.arguments)},clear:function(){var t=this.$root;t.$refs.particleComponent.removeParticles(),_.has(t.$refs,"drawingCanvas")&&(t.$refs.drawingCanvas.clear(),console.warn("Expected drawingCanvas on",t.$refs)),_.has(t.$refs,"modelCanvas")&&(t.$refs.modelCanvas.clear3d(),console.warn("Expected modelCanvas on",t.$refs))}}})}(),function(){"use strict";Vue.component("story-container",{template:"#story-container-template",data:function(){return{storyUrl:"data/stories/ecomare.json",story:null}},mounted:function(){var t=this,e=new ScrollMagic.Controller({container:this.$el}),i=this.$root;fetch(this.storyUrl).then(function(t){return t.json()}).then(function(n){Vue.set(t,"story",n),t.$nextTick(function(){var o=t.$el.getElementsByClassName("story-item");console.log("story elements",o,o.length),_.each(o,function(t,o){var a=n[o],s=new ScrollMagic.Scene({triggerElement:t,duration:t.clientHeight}).addTo(e).on("enter",function(){_.has(a,"latlng")&&i.map.setView(a.latlng,a.zoom)}).addIndicators();console.log("add scene",s)});var a=Array.from(t.$el.getElementsByClassName("jssor-slider-container"));_.map(a,function(t){var e=new $JssorSlider$(t.id,{$AutoPlay:!0});return e})})})}})}(),function(){"use strict";Vue.component("chart-container",{template:"#chart-container-template",props:["model"],data:function(){return{url:"data/timeseries/dcsm.json",chart:null}},mounted:function(){console.log("create chart in ",this.$el,"for",this.model),this.$nextTick(function(){var t={top:10,right:10,bottom:20,left:10},e=this.$el.clientWidth-t.left-t.right,i=this.$el.clientHeight-t.top-t.bottom,n=d3.scaleTime().range([0,e]),o=d3.scaleLinear().range([0,e]),a=d3.scaleLinear().range([i,0]),s=d3.scaleLinear().range([i,0]),r=d3.select(this.$el).append("svg");r.attr("width",e+t.left+t.right).attr("height",i+t.top+t.bottom).append("g").attr("transform","translate("+t.left+","+t.top+")"),d3.json(this.url,function(t){var e=t[0],o=e.data;n.domain(d3.extent(o,function(t){return d3.isoParse(t.date)})),s.domain(d3.extent(o,function(t){return t.s1}));var a=d3.line().x(function(t){return n(d3.isoParse(t.date))}).y(function(t){return s(t.s1)});r.datum(o).append("path").attr("class","line waterlevel").attr("d",a),r.append("g").attr("class","axis axis--x").attr("transform","translate(0,"+i+")").call(d3.axisBottom(n)),r.append("g").attr("class","axis axis--y").call(d3.axisLeft(s)).append("text").attr("class","axis-title").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end")});var c=[{x:this.progress,y:0},{x:this.progress,y:1}],l=d3.line().x(function(t){return o(t.x)}).y(function(t){return a(t.y)}),d=r.datum(c).append("path").attr("class","line").attr("d",l);this.chart={pathProgress:d,lineProgress:l,xLinear:o,xTime:n,y:a,svg:r}})},watch:{progress:function(t){var e=[{x:t,y:0},{x:t,y:1}];this.chart.pathProgress.datum(e).attr("d",this.chart.lineProgress)}},computed:{progress:{cache:!1,get:function(){if(!_.has(this.model,"currentTime"))return 0;var t=this.model.currentTime/this.model.duration;return t}}}})}();var app;!function(){"use strict";function t(){for(var t,e=/\+/g,i=/([^&=]+)=?([^&]*)/g,n=function(t){return decodeURIComponent(t.replace(e," "))},o=window.location.search.substring(1),a={};null!==(t=i.exec(o));){var s=n(t[2]),r=null;r="true"===s||"false"!==s&&s,a[n(t[1])]=r}return a}$(document).ready(function(){Vue.component("v-map",Vue2Leaflet.Map),Vue.component("v-tilelayer",Vue2Leaflet.TileLayer),$("#template-container").load("templates/templates.html",function(){app=new Vue({el:"#app",mounted:function(){this.$nextTick(function(){$('input[type="checkbox"]').bootstrapSwitch()})},data:function(){var e=t(),i={settings:{sidebar:!0,story:!1,chart:!1,model:null},palette:[],pipeline:null,model:null,map:null,sketch:null};return _.assign(i.settings,e),i},methods:{}}),bus.$on("model-selected",function(t){Vue.set(app,"model",t),Vue.nextTick(function(){console.log("uv source",app.$refs.uvSource.model);var e=L.latLng(t.extent.sw[0],t.extent.sw[1]),i=L.latLng(t.extent.ne[0],t.extent.ne[1]),n=L.latLngBounds(e,i);_.has(app.$refs,"map")?(console.info("fitting bounds",n,app.$refs.map),app.$refs.map.setBounds(n)):console.warn("fitBounds missing",app.$refs,app,n);
})}),bus.$on("palette-selected",function(t){Vue.set(app,"palette",t)}),bus.$on("model-layer-added",function(){}),bus.$on("sketch-created",function(t){Vue.set(app,"sketch",t)}),bus.$on("pipeline-created",function(t){Vue.set(app,"pipeline",t)})})})}();