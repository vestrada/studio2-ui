(function(a){a.widget("ui.sortable",a.extend({},a.ui.mouse,{_init:function(){var b=this.options;
this.containerCache={};
this.element.addClass("ui-sortable");
this.refresh();
this.floating=this.items.length?(/left|right/).test(this.items[0].item.css("float")):false;
this.offset=this.element.offset();
this._mouseInit()
},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
this._mouseDestroy();
for(var b=this.items.length-1;
b>=0;
b--){this.items[b].item.removeData("sortable-item")
}},_mouseCapture:function(e,f){if(this.reverting){return false
}if(this.options.disabled||this.options.type=="static"){return false
}this._refreshItems(e);
var d=null,c=this,b=a(e.target).parents().each(function(){if(a.data(this,"sortable-item")==c){d=a(this);
return false
}});
if(a.data(e.target,"sortable-item")==c){d=a(e.target)
}if(!d){return false
}if(this.options.handle&&!f){var g=false;
a(this.options.handle,d).find("*").andSelf().each(function(){if(this==e.target){g=true
}});
if(!g){return false
}}this.currentItem=d;
this._removeCurrentsFromItems();
return true
},_mouseStart:function(e,f,b){var g=this.options,c=this;
this.currentContainer=this;
this.refreshPositions();
this.helper=this._createHelper(e);
this._cacheHelperProportions();
this._cacheMargins();
this.scrollParent=this.helper.scrollParent();
this.offset=this.currentItem.offset();
this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};
this.helper.css("position","absolute");
this.cssPosition=this.helper.css("position");
a.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this._generatePosition(e);
this.originalPageX=e.pageX;
this.originalPageY=e.pageY;
if(g.cursorAt){this._adjustOffsetFromHelper(g.cursorAt)
}this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
if(this.helper[0]!=this.currentItem[0]){this.currentItem.hide()
}this._createPlaceholder();
if(g.containment){this._setContainment()
}if(g.cursor){if(a("body").css("cursor")){this._storedCursor=a("body").css("cursor")
}a("body").css("cursor",g.cursor)
}if(g.opacity){if(this.helper.css("opacity")){this._storedOpacity=this.helper.css("opacity")
}this.helper.css("opacity",g.opacity)
}if(g.zIndex){if(this.helper.css("zIndex")){this._storedZIndex=this.helper.css("zIndex")
}this.helper.css("zIndex",g.zIndex)
}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){this.overflowOffset=this.scrollParent.offset()
}this._trigger("start",e,this._uiHash());
if(!this._preserveHelperProportions){this._cacheHelperProportions()
}if(!b){for(var d=this.containers.length-1;
d>=0;
d--){this.containers[d]._trigger("activate",e,c._uiHash(this))
}}if(a.ui.ddmanager){a.ui.ddmanager.current=this
}if(a.ui.ddmanager&&!g.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,e)
}this.dragging=true;
this.helper.addClass("ui-sortable-helper");
this._mouseDrag(e);
return true
},_mouseDrag:function(f){this.position=this._generatePosition(f);
this.positionAbs=this._convertPositionTo("absolute");
if(!this.lastPositionAbs){this.lastPositionAbs=this.positionAbs
}if(this.options.scroll){var g=this.options,b=false;
if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if((this.overflowOffset.top+this.scrollParent[0].offsetHeight)-f.pageY<g.scrollSensitivity){this.scrollParent[0].scrollTop=b=this.scrollParent[0].scrollTop+g.scrollSpeed
}else{if(f.pageY-this.overflowOffset.top<g.scrollSensitivity){this.scrollParent[0].scrollTop=b=this.scrollParent[0].scrollTop-g.scrollSpeed
}}if((this.overflowOffset.left+this.scrollParent[0].offsetWidth)-f.pageX<g.scrollSensitivity){this.scrollParent[0].scrollLeft=b=this.scrollParent[0].scrollLeft+g.scrollSpeed
}else{if(f.pageX-this.overflowOffset.left<g.scrollSensitivity){this.scrollParent[0].scrollLeft=b=this.scrollParent[0].scrollLeft-g.scrollSpeed
}}}else{if(f.pageY-a(document).scrollTop()<g.scrollSensitivity){b=a(document).scrollTop(a(document).scrollTop()-g.scrollSpeed)
}else{if(a(window).height()-(f.pageY-a(document).scrollTop())<g.scrollSensitivity){b=a(document).scrollTop(a(document).scrollTop()+g.scrollSpeed)
}}if(f.pageX-a(document).scrollLeft()<g.scrollSensitivity){b=a(document).scrollLeft(a(document).scrollLeft()-g.scrollSpeed)
}else{if(a(window).width()-(f.pageX-a(document).scrollLeft())<g.scrollSensitivity){b=a(document).scrollLeft(a(document).scrollLeft()+g.scrollSpeed)
}}}if(b!==false&&a.ui.ddmanager&&!g.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,f)
}}this.positionAbs=this._convertPositionTo("absolute");
if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"
}for(var d=this.items.length-1;
d>=0;
d--){var e=this.items[d],c=e.item[0],h=this._intersectsWithPointer(e);
if(!h){continue
}if(c!=this.currentItem[0]&&this.placeholder[h==1?"next":"prev"]()[0]!=c&&!a.ui.contains(this.placeholder[0],c)&&(this.options.type=="semi-dynamic"?!a.ui.contains(this.element[0],c):true)){this.direction=h==1?"down":"up";
if(this.options.tolerance=="pointer"||this._intersectsWithSides(e)){this._rearrange(f,e)
}else{break
}this._trigger("change",f,this._uiHash());
break
}}this._contactContainers(f);
if(a.ui.ddmanager){a.ui.ddmanager.drag(this,f)
}this._trigger("sort",f,this._uiHash());
this.lastPositionAbs=this.positionAbs;
return false
},_mouseStop:function(c,d){if(!c){return
}if(a.ui.ddmanager&&!this.options.dropBehaviour){a.ui.ddmanager.drop(this,c)
}if(this.options.revert){var b=this;
var e=b.placeholder.offset();
b.reverting=true;
a(this.helper).animate({left:e.left-this.offset.parent.left-b.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:e.top-this.offset.parent.top-b.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){b._clear(c)
})
}else{this._clear(c,d)
}return false
},cancel:function(){var b=this;
if(this.dragging){this._mouseUp();
if(this.options.helper=="original"){this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
}else{this.currentItem.show()
}for(var c=this.containers.length-1;
c>=0;
c--){this.containers[c]._trigger("deactivate",null,b._uiHash(this));
if(this.containers[c].containerCache.over){this.containers[c]._trigger("out",null,b._uiHash(this));
this.containers[c].containerCache.over=0
}}}if(this.placeholder[0].parentNode){this.placeholder[0].parentNode.removeChild(this.placeholder[0])
}if(this.options.helper!="original"&&this.helper&&this.helper[0].parentNode){this.helper.remove()
}a.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});
if(this.domPosition.prev){a(this.domPosition.prev).after(this.currentItem)
}else{a(this.domPosition.parent).prepend(this.currentItem)
}return true
},serialize:function(d){var b=this._getItemsAsjQuery(d&&d.connected);
var c=[];
d=d||{};
a(b).each(function(){var e=(a(d.item||this).attr(d.attribute||"id")||"").match(d.expression||(/(.+)[-=_](.+)/));
if(e){c.push((d.key||e[1]+"[]")+"="+(d.key&&d.expression?e[1]:e[2]))
}});
return c.join("&")
},toArray:function(d){var b=this._getItemsAsjQuery(d&&d.connected);
var c=[];
d=d||{};
b.each(function(){c.push(a(d.item||this).attr(d.attribute||"id")||"")
});
return c
},_intersectsWith:function(m){var e=this.positionAbs.left,d=e+this.helperProportions.width,k=this.positionAbs.top,j=k+this.helperProportions.height;
var f=m.left,c=f+m.width,n=m.top,i=n+m.height;
var o=this.offset.click.top,h=this.offset.click.left;
var g=(k+o)>n&&(k+o)<i&&(e+h)>f&&(e+h)<c;
if(this.options.tolerance=="pointer"||this.options.forcePointerForContainers||(this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>m[this.floating?"width":"height"])){return g
}else{return(f<e+(this.helperProportions.width/2)&&d-(this.helperProportions.width/2)<c&&n<k+(this.helperProportions.height/2)&&j-(this.helperProportions.height/2)<i)
}},_intersectsWithPointer:function(d){var e=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,d.top,d.height),c=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,d.left,d.width),g=e&&c,b=this._getDragVerticalDirection(),f=this._getDragHorizontalDirection();
if(!g){return false
}return this.floating?(((f&&f=="right")||b=="down")?2:1):(b&&(b=="down"?2:1))
},_intersectsWithSides:function(e){var c=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,e.top+(e.height/2),e.height),d=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,e.left+(e.width/2),e.width),b=this._getDragVerticalDirection(),f=this._getDragHorizontalDirection();
if(this.floating&&f){return((f=="right"&&d)||(f=="left"&&!d))
}else{return b&&((b=="down"&&c)||(b=="up"&&!c))
}},_getDragVerticalDirection:function(){var b=this.positionAbs.top-this.lastPositionAbs.top;
return b!=0&&(b>0?"down":"up")
},_getDragHorizontalDirection:function(){var b=this.positionAbs.left-this.lastPositionAbs.left;
return b!=0&&(b>0?"right":"left")
},refresh:function(b){this._refreshItems(b);
this.refreshPositions()
},_connectWith:function(){var b=this.options;
return b.connectWith.constructor==String?[b.connectWith]:b.connectWith
},_getItemsAsjQuery:function(b){var l=this;
var g=[];
var e=[];
var h=this._connectWith();
if(h&&b){for(var d=h.length-1;
d>=0;
d--){var k=a(h[d]);
for(var c=k.length-1;
c>=0;
c--){var f=a.data(k[c],"sortable");
if(f&&f!=this&&!f.options.disabled){e.push([a.isFunction(f.options.items)?f.options.items.call(f.element):a(f.options.items,f.element).not(".ui-sortable-helper"),f])
}}}}e.push([a.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):a(this.options.items,this.element).not(".ui-sortable-helper"),this]);
for(var d=e.length-1;
d>=0;
d--){e[d][0].each(function(){g.push(this)
})
}return a(g)
},_removeCurrentsFromItems:function(){var d=this.currentItem.find(":data(sortable-item)");
for(var c=0;
c<this.items.length;
c++){for(var b=0;
b<d.length;
b++){if(d[b]==this.items[c].item[0]){this.items.splice(c,1)
}}}},_refreshItems:function(b){this.items=[];
this.containers=[this];
var h=this.items;
var p=this;
var f=[[a.isFunction(this.options.items)?this.options.items.call(this.element[0],b,{item:this.currentItem}):a(this.options.items,this.element),this]];
var l=this._connectWith();
if(l){for(var e=l.length-1;
e>=0;
e--){var m=a(l[e]);
for(var d=m.length-1;
d>=0;
d--){var g=a.data(m[d],"sortable");
if(g&&g!=this&&!g.options.disabled){f.push([a.isFunction(g.options.items)?g.options.items.call(g.element[0],b,{item:this.currentItem}):a(g.options.items,g.element),g]);
this.containers.push(g)
}}}}for(var e=f.length-1;
e>=0;
e--){var k=f[e][1];
var c=f[e][0];
for(var d=0,n=c.length;
d<n;
d++){var o=a(c[d]);
o.data("sortable-item",k);
h.push({item:o,instance:k,width:0,height:0,left:0,top:0})
}}},refreshPositions:function(b){if(this.offsetParent&&this.helper){this.offset.parent=this._getParentOffset()
}for(var d=this.items.length-1;
d>=0;
d--){var e=this.items[d];
if(e.instance!=this.currentContainer&&this.currentContainer&&e.item[0]!=this.currentItem[0]){continue
}var c=this.options.toleranceElement?a(this.options.toleranceElement,e.item):e.item;
if(!b){e.width=c.outerWidth();
e.height=c.outerHeight()
}var f=c.offset();
e.left=f.left;
e.top=f.top
}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this)
}else{for(var d=this.containers.length-1;
d>=0;
d--){var f=this.containers[d].element.offset();
this.containers[d].containerCache.left=f.left;
this.containers[d].containerCache.top=f.top;
this.containers[d].containerCache.width=this.containers[d].element.outerWidth();
this.containers[d].containerCache.height=this.containers[d].element.outerHeight()
}}},_createPlaceholder:function(d){var b=d||this,e=b.options;
if(!e.placeholder||e.placeholder.constructor==String){var c=e.placeholder;
e.placeholder={element:function(){var f=a(document.createElement(b.currentItem[0].nodeName)).addClass(c||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
if(!c){f.style.visibility="hidden"
}return f
},update:function(f,g){if(c&&!e.forcePlaceholderSize){return
}if(!g.height()){g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10))
}if(!g.width()){g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10))
}}}
}b.placeholder=a(e.placeholder.element.call(b.element,b.currentItem));
b.currentItem.after(b.placeholder);
e.placeholder.update(b,b.placeholder)
},_contactContainers:function(d){for(var c=this.containers.length-1;
c>=0;
c--){if(this._intersectsWith(this.containers[c].containerCache)){if(!this.containers[c].containerCache.over){if(this.currentContainer!=this.containers[c]){var h=10000;
var g=null;
var e=this.positionAbs[this.containers[c].floating?"left":"top"];
for(var b=this.items.length-1;
b>=0;
b--){if(!a.ui.contains(this.containers[c].element[0],this.items[b].item[0])){continue
}var f=this.items[b][this.containers[c].floating?"left":"top"];
if(Math.abs(f-e)<h){h=Math.abs(f-e);
g=this.items[b]
}}if(!g&&!this.options.dropOnEmpty){continue
}this.currentContainer=this.containers[c];
g?this._rearrange(d,g,null,true):this._rearrange(d,null,this.containers[c].element,true);
this._trigger("change",d,this._uiHash());
this.containers[c]._trigger("change",d,this._uiHash(this));
this.options.placeholder.update(this.currentContainer,this.placeholder)
}this.containers[c]._trigger("over",d,this._uiHash(this));
this.containers[c].containerCache.over=1
}}else{if(this.containers[c].containerCache.over){this.containers[c]._trigger("out",d,this._uiHash(this));
this.containers[c].containerCache.over=0
}}}},_createHelper:function(c){var d=this.options;
var b=a.isFunction(d.helper)?a(d.helper.apply(this.element[0],[c,this.currentItem])):(d.helper=="clone"?this.currentItem.clone():this.currentItem);
if(!b.parents("body").length){a(d.appendTo!="parent"?d.appendTo:this.currentItem[0].parentNode)[0].appendChild(b[0])
}if(b[0]==this.currentItem[0]){this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}
}if(b[0].style.width==""||d.forceHelperSize){b.width(this.currentItem.width())
}if(b[0].style.height==""||d.forceHelperSize){b.height(this.currentItem.height())
}return b
},_adjustOffsetFromHelper:function(b){if(b.left!=undefined){this.offset.click.left=b.left+this.margins.left
}if(b.right!=undefined){this.offset.click.left=this.helperProportions.width-b.right+this.margins.left
}if(b.top!=undefined){this.offset.click.top=b.top+this.margins.top
}if(b.bottom!=undefined){this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top
}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var b=this.offsetParent.offset();
if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])){b.left+=this.scrollParent.scrollLeft();
b.top+=this.scrollParent.scrollTop()
}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)){b={top:0,left:0}
}return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var b=this.currentItem.position();
return{top:b.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:b.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}
}else{return{top:0,left:0}
}},_cacheMargins:function(){this.margins={left:(parseInt(this.currentItem.css("marginLeft"),10)||0),top:(parseInt(this.currentItem.css("marginTop"),10)||0)}
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}
},_setContainment:function(){var e=this.options;
if(e.containment=="parent"){e.containment=this.helper[0].parentNode
}if(e.containment=="document"||e.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,a(e.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a(e.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]
}if(!(/^(document|window|parent)$/).test(e.containment)){var c=a(e.containment)[0];
var d=a(e.containment).offset();
var b=(a(c).css("overflow")!="hidden");
this.containment=[d.left+(parseInt(a(c).css("borderLeftWidth"),10)||0)+(parseInt(a(c).css("paddingLeft"),10)||0)-this.margins.left,d.top+(parseInt(a(c).css("borderTopWidth"),10)||0)+(parseInt(a(c).css("paddingTop"),10)||0)-this.margins.top,d.left+(b?Math.max(c.scrollWidth,c.offsetWidth):c.offsetWidth)-(parseInt(a(c).css("borderLeftWidth"),10)||0)-(parseInt(a(c).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,d.top+(b?Math.max(c.scrollHeight,c.offsetHeight):c.offsetHeight)-(parseInt(a(c).css("borderTopWidth"),10)||0)-(parseInt(a(c).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]
}},_convertPositionTo:function(f,h){if(!h){h=this.position
}var c=f=="absolute"?1:-1;
var e=this.options,b=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=(/(html|body)/i).test(b[0].tagName);
return{top:(h.top+this.offset.relative.top*c+this.offset.parent.top*c-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(g?0:b.scrollTop()))*c)),left:(h.left+this.offset.relative.left*c+this.offset.parent.left*c-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:b.scrollLeft())*c))}
},_generatePosition:function(e){var h=this.options,b=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,i=(/(html|body)/i).test(b[0].tagName);
if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0])){this.offset.relative=this._getRelativeOffset()
}var d=e.pageX;
var c=e.pageY;
if(this.originalPosition){if(this.containment){if(e.pageX-this.offset.click.left<this.containment[0]){d=this.containment[0]+this.offset.click.left
}if(e.pageY-this.offset.click.top<this.containment[1]){c=this.containment[1]+this.offset.click.top
}if(e.pageX-this.offset.click.left>this.containment[2]){d=this.containment[2]+this.offset.click.left
}if(e.pageY-this.offset.click.top>this.containment[3]){c=this.containment[3]+this.offset.click.top
}}if(h.grid){var g=this.originalPageY+Math.round((c-this.originalPageY)/h.grid[1])*h.grid[1];
c=this.containment?(!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:(!(g-this.offset.click.top<this.containment[1])?g-h.grid[1]:g+h.grid[1])):g;
var f=this.originalPageX+Math.round((d-this.originalPageX)/h.grid[0])*h.grid[0];
d=this.containment?(!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:(!(f-this.offset.click.left<this.containment[0])?f-h.grid[0]:f+h.grid[0])):f
}}return{top:(c-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(i?0:b.scrollTop())))),left:(d-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:b.scrollLeft())))}
},_rearrange:function(g,f,c,e){c?c[0].appendChild(this.placeholder[0]):f.item[0].parentNode.insertBefore(this.placeholder[0],(this.direction=="down"?f.item[0]:f.item[0].nextSibling));
this.counter=this.counter?++this.counter:1;
var d=this,b=this.counter;
window.setTimeout(function(){if(b==d.counter){d.refreshPositions(!e)
}},0)
},_clear:function(d,e){this.reverting=false;
var f=[],b=this;
if(!this._noFinalSort&&this.currentItem[0].parentNode){this.placeholder.before(this.currentItem)
}this._noFinalSort=null;
if(this.helper[0]==this.currentItem[0]){for(var c in this._storedCSS){if(this._storedCSS[c]=="auto"||this._storedCSS[c]=="static"){this._storedCSS[c]=""
}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
}else{this.currentItem.show()
}if(this.fromOutside&&!e){f.push(function(g){this._trigger("receive",g,this._uiHash(this.fromOutside))
})
}if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!e){f.push(function(g){this._trigger("update",g,this._uiHash())
})
}if(!a.ui.contains(this.element[0],this.currentItem[0])){if(!e){f.push(function(g){this._trigger("remove",g,this._uiHash())
})
}for(var c=this.containers.length-1;
c>=0;
c--){if(a.ui.contains(this.containers[c].element[0],this.currentItem[0])&&!e){f.push((function(g){return function(h){g._trigger("receive",h,this._uiHash(this))
}
}).call(this,this.containers[c]));
f.push((function(g){return function(h){g._trigger("update",h,this._uiHash(this))
}
}).call(this,this.containers[c]))
}}}for(var c=this.containers.length-1;
c>=0;
c--){if(!e){f.push((function(g){return function(h){g._trigger("deactivate",h,this._uiHash(this))
}
}).call(this,this.containers[c]))
}if(this.containers[c].containerCache.over){f.push((function(g){return function(h){g._trigger("out",h,this._uiHash(this))
}
}).call(this,this.containers[c]));
this.containers[c].containerCache.over=0
}}if(this._storedCursor){a("body").css("cursor",this._storedCursor)
}if(this._storedOpacity){this.helper.css("opacity",this._storedOpacity)
}if(this._storedZIndex){this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex)
}this.dragging=false;
if(this.cancelHelperRemoval){if(!e){this._trigger("beforeStop",d,this._uiHash());
for(var c=0;
c<f.length;
c++){f[c].call(this,d)
}this._trigger("stop",d,this._uiHash())
}return false
}if(!e){this._trigger("beforeStop",d,this._uiHash())
}this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
if(this.helper[0]!=this.currentItem[0]){this.helper.remove()
}this.helper=null;
if(!e){for(var c=0;
c<f.length;
c++){f[c].call(this,d)
}this._trigger("stop",d,this._uiHash())
}this.fromOutside=false;
return true
},_trigger:function(){if(a.widget.prototype._trigger.apply(this,arguments)===false){this.cancel()
}},_uiHash:function(c){var b=c||this;
return{helper:b.helper,placeholder:b.placeholder||a([]),position:b.position,absolutePosition:b.positionAbs,offset:b.positionAbs,item:b.currentItem,sender:c?c.element:null}
}}));
a.extend(a.ui.sortable,{getter:"serialize toArray",version:"1.7.2",eventPrefix:"sort",defaults:{appendTo:"parent",axis:false,cancel:":input,option",connectWith:false,containment:false,cursor:"auto",cursorAt:false,delay:0,distance:1,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000}})
})(jQuery);