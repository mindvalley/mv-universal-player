import{V as v}from"./vue.esm-baa9794d.js";const g=""+new URL("svg-defs-4eaeb910.svg",import.meta.url).href,p={options:{},ssr:function(s,r){var t=s.data,e=t.attrs,o=e.symbol,l=e.size,a=this.getAttributes(l);a&&(t.attrs=Object.assign({},t.attrs,a)),l&&delete t.attrs.size,o&&delete t.attrs.symbol;var n=t.class,i=t.staticClass||"";i+=n?Object.keys(n).join(" "):"",this.hasClass(i)||(t.staticClass=t.staticClass?t.staticClass+" "+this.options.class:this.options.class);var u=s.context.$createElement("use",{attrs:{href:this.getHref(o)}});Array.isArray(s.children)?s.children.push(u):s.children=[u]},install:function(s,r){r===void 0&&(r={}),this.options.class=r.class||"icon",this.options.url=r.url===void 0?"/assets/svg/sprite.svg":r.url;var t=this;s.directive("svg",{bind:function(e,o,l){var a=o.value||l.data.attrs.symbol,n=l.data.attrs&&l.data.attrs.size,i=t.getAttributes(n);i&&(e.setAttribute("viewBox",i.viewBox),e.setAttribute("width",i.width),e.setAttribute("height",i.height)),a&&e.removeAttribute("symbol"),n&&e.removeAttribute("size");var u=e.getAttribute("class");if(t.hasClass(u)||e.setAttribute("class",u?u+" "+t.options.class:t.options.class),!e||e.querySelector("use")===null){var c=document.createElementNS("http://www.w3.org/2000/svg","use"),h=t.getHref(a);c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",h),c.setAttribute("href",h),e.appendChild(c)}},update:function(e,o,l){var a=t.getHref(o.value||l.data.attrs.symbol),n=e&&e.querySelector("use");if(n){if(n.getAttribute("href")===a)return!1;var i=document.createElementNS("http://www.w3.org/2000/svg","use");i.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a),i.setAttribute("href",a),e.replaceChild(i,n)}}})},getAttributes:function(s){if(!s)return null;var r=s.toString().replace(/( |, |,)/g," ").split(" "),t=r.length;if(t===3||t>4)return console.warn('[vue-svg-sprite] size: "'+s+'" is not valid'),null;var e=[];e[0]=t<4?0:r[0],e[1]=t<4?0:r[1];var o=e[2]=t<4?r[0]:r[2];return{height:e[3]=r[t-1],viewBox:e.join(" "),width:o}},hasClass:function(s){var r=this.options.class;return!!s&&s.split(" ").some(function(t){var e=t.split(/(-|_)/)[0];return e.indexOf(r)!==-1&&e.length===r.length})},getHref:function(s){return this.options.url===""?"#"+s:this.options.url+"#"+s}};v.use(p,{url:g});const f={parameters:{actions:{argTypesRegex:"^[A-Z]*.*"},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}}};export{f as default};
//# sourceMappingURL=preview-05020fe8.js.map