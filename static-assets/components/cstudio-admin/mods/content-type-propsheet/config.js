CStudioAdminConsole.Tool.ContentTypes.PropertyType.Config = CStudioAdminConsole.Tool.ContentTypes.PropertyType.Config||  function(fieldName, containerEl)  {
        this.fieldName = fieldName;
        this.containerEl = containerEl;
        return this;
    }

YAHOO.extend(CStudioAdminConsole.Tool.ContentTypes.PropertyType.Config, CStudioAdminConsole.Tool.ContentTypes.PropertyType, {
    render: function(value, updateFn, fName, itemId, contentType) {
        var _self = this;
        var containerEl = this.containerEl;
        var valueEl = document.createElement("input");
        YAHOO.util.Dom.addClass(valueEl, "content-type-property-sheet-property-value");
        containerEl.appendChild(valueEl);
        valueEl.value = value;
        valueEl.fieldName = this.fieldName;
        this.updateFn = updateFn;

        // don't let the user type anything
        YAHOO.util.Event.on(valueEl, 'keydown', function(evt) { YAHOO.util.Event.stopEvent(evt); }, valueEl);

        YAHOO.util.Event.on(valueEl, 'focus', function(evt) { _self.showTemplateEdit(); }, valueEl);

        if(updateFn) {
            var updateFieldFn = function(event, el) {

            };

            YAHOO.util.Event.on(valueEl, 'change', updateFieldFn, valueEl);
        }

        this.valueEl = valueEl;
        this.contentType = contentType;
    },

    getValue: function() {
        return this.valueEl.value;
    },

    showTemplateEdit: function() {
        var _self = this;
        if(this.controlsContainerEl) {
            this.controlsContainerEl.style.display = "inline";
        }
        else {
            var controlsContainerEl = document.createElement("div");
            YAHOO.util.Dom.addClass(controlsContainerEl, "options");

            var editEl = document.createElement("div");
            YAHOO.util.Dom.addClass(editEl, "edit");

            controlsContainerEl.appendChild(editEl);

            this.containerEl.appendChild(controlsContainerEl);

            this.controlsContainerEl = controlsContainerEl;

            editEl.onclick = function() {
                var contentType = _self.contentType,
                    path = '/config/studio/content-types' + contentType + '/config.xml';

                CStudioAuthoring.Operations.openTemplateEditor
                (path, "default", { success: function() {}, failure: function() {}});

            };

        }
    }
});

CStudioAuthoring.Module.moduleLoaded("cstudio-console-tools-content-types-proptype-config", CStudioAdminConsole.Tool.ContentTypes.PropertyType.Config);