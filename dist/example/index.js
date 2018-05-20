!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.selectise=t():e.selectise=t()}(window,function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=331)}({330:function(e,t,n){"use strict";var i,o=(i=n(91))&&i.__esModule?i:{default:i};n(336);var s=document.getElementById("example-select");new o.default(s,{onSelect:function(e){var t=e.selectionContent,n=e.selectionValue,i=e.selectionIndex;console.log("Selection made. Content: "+t+"; Value: "+n+"; Index: "+i)}})},331:function(e,t,n){e.exports=n(330)},336:function(e,t){},91:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){function e(t,n){var i=n.onSelect,o=n.setOptionContentToTitle,r=void 0!==o&&o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),s.call(this),this.state={currentIndex:null,isOpen:!1,selectionValue:null},this.data={callbacks:{onSelect:i},settings:{setOptionContentToTitle:r},ui:{elements:{nativeSelect:t,selectise:null,trigger:null,options:null},cssClasses:{selectise:"selectise",trigger:"selectise-trigger",options:"selectise-options",option:"selectise-option"}}},this._init()}return i(e,[{key:"_init",value:function(){this._buildComponentMarkup(),this._setupEvents()}},{key:"_copyAttributes",value:function(e,t){Array.prototype.forEach.call(e.attributes,function(e){var n="value"===e.name?"data-value":e.name,i=e.value;t.setAttribute(n,i)})}},{key:"_replaceNativeSelectWithCustomSelect",value:function(e,t){e.parentNode.insertBefore(t,e),e.parentNode.removeChild(e)}}]),e}(),s=function(){var e=this;this._buildComponentMarkup=function(){var t=e.data.ui,n=t.cssClasses,i=t.elements,o=e.data.settings.setOptionContentToTitle,s=i.nativeSelect.getAttribute("tabindex");i.selectise=document.createElement("div"),i.selectise.classList.add(n.selectise),e._copyAttributes(i.nativeSelect,i.selectise),i.trigger=document.createElement("div"),i.trigger.classList.add(n.trigger),i.trigger.setAttribute("tabindex",s),i.trigger.setAttribute("role","Selected value"),i.selectise.appendChild(i.trigger),i.options=document.createElement("div"),i.options.classList.add(n.options),i.selectise.appendChild(i.options);var r=i.nativeSelect.children;Array.prototype.forEach.call(r,function(t){var r=document.createElement("div");r.innerHTML=t.innerHTML,e._copyAttributes(t,r),r.classList.add(n.option),o&&r.setAttribute("title",r.innerHTML),r.setAttribute("tabindex",s),i.options.appendChild(r)}),i.trigger.innerHTML=i.options.children[0].innerHTML,e._replaceNativeSelectWithCustomSelect(i.nativeSelect,i.selectise)},this._setupEvents=function(){var t=e.data.ui.elements;t.trigger.addEventListener("click",e.toggleDropdown),t.selectise.addEventListener("keydown",e._handleKeyDownTrigger),t.options.addEventListener("click",e._handleSelectOption)},this._handleSelectOption=function(t){var n=t.target,i=e.data,o=i.callbacks.onSelect,s=i.ui,r=s.cssClasses,l=s.elements;if(n.classList.contains(r.option)){var a=n.innerHTML,c=n.dataset.value,u=Array.prototype.indexOf.call(n.parentNode.childNodes,n);l.trigger.innerHTML=a,e.state.selectionValue=c,e.state.currentIndex=u,l.trigger.setAttribute("title",a),e.closeDropdown(),o&&o({selectionContent:a,selectionValue:c,selectionIndex:u})}},this._handleKeyDownTrigger=function(t){var n=e.data.ui.elements.options.childNodes.length,i=e.state,o=i.isOpen,s=i.currentIndex,r=(t=t||window.event).keyCode;if(o)if(40===r||38===r)40===r?null===e.state.currentIndex?e.state.currentIndex=0:e.state.currentIndex<n-1&&e.state.currentIndex++:e.state.currentIndex>0&&e.state.currentIndex--,e._setIndexHover(s);else if(13===r){var l=e.state.currentIndex;null!==l?e.setSelectedIndex(l):e.closeDropdown()}else 27===r&&(e.closeDropdown(),t.stopPropagation());else 13===r&&(e.toggleDropdown(),e._setIndexHover())},this._setIndexHover=function(t){var n=e.data.ui.elements.options,i=n.childNodes,o=i.length;r(t)&&i[t].classList.remove("hover");var s=e.state.currentIndex;function r(e){return null!==e&&e>=0&&e<o}r(s)&&(i[s].focus(),null===t&&window.setTimeout(function(){n.scrollTop=0},50))},this.toggleDropdown=function(){var t=e.data.ui.elements;e.state.isOpen=!e.state.isOpen,t.selectise.classList.toggle("open")},this.closeDropdown=function(){var t=e.data.ui.elements;e.state.isOpen=!1,t.selectise.classList.remove("open"),t.trigger.focus()},this.getSelectionValue=function(){return e.state.selectionValue},this.setSelectedIndex=function(t){var n=e.data.ui.elements;e._handleSelectOption({target:n.options.children[t]})}};t.default=o}})});