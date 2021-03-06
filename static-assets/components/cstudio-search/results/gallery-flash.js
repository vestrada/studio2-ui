CStudioSearch.ResultRenderer.GalleryFlash = {
	render: function(contentTO) {
		var mediaTag = "";
		var path = contentTO.item.uri;
		
		mediaTag = "<div class='flash-banner-wrapper' style='margin-bottom: 5px;display:inline;'><span style='display:none;'>Flash is not installed</span><input type='hidden' value='" +
					CStudioAuthoringContext.previewAppBaseUri+path + "'/>" +
					"</div>";
				
		var url = contentTO.item.uri;
		var urlNewWindow =  true;
		var urlLinkElement = "";

		if(url != "null") {
			var targetWindow = (urlNewWindow == "null" || urlNewWindow == "false") ? "_self" : "_blank";			
			urlLinkElement = "<div class='cstudio-search-description'><a href='" + CStudioAuthoringContext.previewAppBaseUri + url + "' target='" +targetWindow+ "'>" + url + "</a></div>";	
		}

		return CStudioSearch.renderCommonResultWrapper(contentTO,  
			"<span class='cstudio-search-component-title-nopreview'>"+
			contentTO.item.internalName+
			(contentTO.item.newFile?"*":"")+"</span>" +
			"<span class='cstudio-search-download-additional' style='margin-left:0px;'>"+
			" | Gallery Flash" + 
			"</span>" + 
			"<div class='cstudio-search-description'>"+
			urlLinkElement +
			"<div>"+
				"<span class='cstudio-search-download-additional'>"+
					"Created: " + CStudioAuthoring.Utils.formatDateFromStringNullToEmpty(contentTO.item.eventDate, "simpleformat")+			
				"</span><br />"+
				"<span class='cstudio-search-download-additional'>Edited "+ 
					CStudioAuthoring.Utils.formatDateFromString(contentTO.item.eventDate, "simpleformat") + " by " + 
					CStudioAuthoring.Utils.getAuthorFullNameFromContentTOItem(contentTO.item) +
				"</span>"+
			"</div>" +			
			"<div class='cstudio-search-description'>"+mediaTag+"</div>"
			);
	}, 
	
	_self: this,
	
	hideMagnifyIcon : function(img,isFlash) {
		if( img.height <= 150 ){
			img.nextElementSibling.style.display = "none";
			if(isFlash){
				img.previousSibling.previousSibling.style.display = "none";
				img.previousSibling.previousSibling.previousSibling.firstChild.height = img.height;
				img.previousSibling.previousSibling.previousSibling.firstChild.width = img.width;
			}
			
		} else {
			var oldHeight = img.height;
			var oldWidth = img.width;
			img.height = 150;
			if(isFlash){
				img.nextSibling.nextSibling.value = oldHeight+"|"+oldWidth;
				img.previousSibling.previousSibling.previousSibling.firstChild.height = 150;
				img.previousSibling.previousSibling.previousSibling.firstChild.width = img.width;
			}			
		}		 		
	}
};

// register renderer
CStudioSearch.resultRenderers["swf"] = CStudioSearch.ResultRenderer.GalleryFlash;
CStudioAuthoring.Module.moduleLoaded("search-result-gallery-flash", CStudioSearch.resultRenderers["swf"]);

