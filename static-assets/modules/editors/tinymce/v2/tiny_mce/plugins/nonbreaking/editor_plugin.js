(function(){tinymce2.create("tinymce2.plugins.Nonbreaking",{init:function(a,b){var c=this;c.editor=a;a.addCommand("mceNonBreaking",function(){a.execCommand("mceInsertContent",false,(a.plugins.visualchars&&a.plugins.visualchars.state)?'<span data-mce-bogus="1" class="mceItemHidden mceItemNbsp">&nbsp;</span>':"&nbsp;")});a.addButton("nonbreaking",{title:"nonbreaking.nonbreaking_desc",cmd:"mceNonBreaking"});if(a.getParam("nonbreaking_force_tab")){a.onKeyDown.add(function(d,f){if(f.keyCode==9){f.preventDefault();d.execCommand("mceNonBreaking");d.execCommand("mceNonBreaking");d.execCommand("mceNonBreaking")}})}},getInfo:function(){return{longname:"Nonbreaking space",author:"Moxiecode Systems AB",authorurl:"http://tinymce2.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/tinymce2:Plugins/nonbreaking",version:tinymce2.majorVersion+"."+tinymce2.minorVersion}}});tinymce2.PluginManager.add("nonbreaking",tinymce2.plugins.Nonbreaking)})();