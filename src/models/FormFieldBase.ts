 import {Constants} from "../util/constants";
 import FormField from './FormField';
 
 export default class FormFieldBase extends FormField {
 
    qm?: Element | null
    widget?: HTMLInputElement | null
    label?: Element | null
    errorDiv?: Element | null
    tooltip?: Element | null
    description?: Element | null

     constructor(params: any, model: any) {
         super(params, model);
         this.element.className = this.getbemBlock();
         this.widget = this.getWidget();
         this.description = this.getDescription();
         this.label = this.getLabel();
         this.errorDiv = this.getErrorDiv();
         this.qm = this.getQuestionMarkDiv();
         this.tooltip = this.getTooltipDiv()
     }
 
     /**
      * implementations should return the widget element that is used to capture the value from the user
      * It will be a input/textarea element
      * @returns
      */
     getWidget(): HTMLInputElement | null {
         throw "method not implemented";
     }
 
     /**
      * implementations should return the element used to show the description of the field
      * @returns
      */
     getDescription(): Element | null {
         throw "method not implemented";
     }
 
     /**
      * implementations should return the element used to show the label of the field
      * @returns
      */
     getLabel(): Element | null {
         throw "method not implemented";
     }
 
     /**
      * implementations should return the element used to show the error on the field
      * @returns
      */
     getErrorDiv(): Element | null {
         throw "method not implemented";
     }
 
     /**
      * implementation should return the tooltip / short description div
      */
     getTooltipDiv(): Element | null {
         throw "method not implemented";
     }
 
     /**
      * Implementation should return the questionMark div
      */
     getQuestionMarkDiv(): Element | null {
         throw "method not implemented";
     }
 
     setModel(model:any) {
         super.setModel(model);
         // No need to apply state as UI is build using current state.
         /*const state = this._model.getState();
         this._applyState(state); */
     }
 
     /**
      * Sets the focus on component's widget.
      */
     setFocus() {
         this.getWidget()?.focus();
     }
 
     /**
      * applies full state of the field to the HTML. Generally done just after the model is bound to the field
      * @param state
      * @private
      */
     _applyState(state:any) {
         if (state.value) {
             this._updateValue(state.value);
         }
         this._updateVisible(state.visible)
         this._updateEnabled(state.enabled)
         this._initializeHelpContent(state);
     }
 
     _initializeHelpContent(state:any) {
         // Initializing Hint ('?') and long description.
         this._showHideLongDescriptionDiv(false);
         if (this.getDescription()) {
             this._addHelpIconHandler(state);
         }
     }
 
     /**
      *
      * @param show If true then <div> containing tooltip(Short Description) will be shown else hidden
      * @private
      */
     _showHideTooltipDiv(show: boolean) {
         if (this.tooltip) {
             this.toggleAttribute(this.getTooltipDiv(), show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
         }
     }
 
     /**
      *
      * @param show If true then <div> containing description(Long Description) will be shown
      * @private
      */
     _showHideLongDescriptionDiv(show: boolean) {
         if (this.description) {
             this.toggleAttribute(this.description, show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
         }
     }
 
     _isTooltipAlwaysVisible() {
         return !!this.getLayoutProperties()['tooltipVisible'];
     }
 
     /**
      * updates html based on visible state
      * @param visible
      * @private
      */
     _updateVisible(visible:boolean) {
         this.toggle(visible, Constants.ARIA_HIDDEN, true);
         this.element.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible+"");
     }
 
     /**
      * udpates the html state based on enable state of the field
      * @param enabled
      * @private
      */
     _updateEnabled(enabled:boolean) {
         if (this.getWidget()) {
             this.toggle(enabled, Constants.ARIA_DISABLED, true);
             this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled+"");
             if (enabled === false) {
                 this.getWidget()?.setAttribute("disabled", "true");
                 this.getWidget()?.setAttribute(Constants.ARIA_DISABLED, "true");
             } else {
                 this.getWidget()?.removeAttribute("disabled");
                 this.getWidget()?.removeAttribute(Constants.ARIA_DISABLED);
             }
         }
     }
 
     _updateValid(valid: boolean, state: any) {
         if (this.errorDiv) {
             this.toggle(valid, Constants.ARIA_INVALID, true);
             this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid+"");
             if (typeof state.errorMessage !== "string" || state.errorMessage === "") {
                 const errMessage = valid === true ? '' : 'There is an error in the field';
                 this.errorDiv.innerHTML = errMessage;
             }
         }
     }
 
     _updateErrorMessage(errorMessage: string, state: any) {
         if (this.errorDiv) {
             this.errorDiv.innerHTML = state.errorMessage;
         }
     }
 
     _updateValue(value: any) {
        let inputWidget = this.getWidget();
         if (inputWidget) {
            inputWidget.value = value;
         }
     }
 
     /**
      * Shows or Hides Description Based on click of '?' mark.
      * @private
      */
     _addHelpIconHandler(state:any) {
         const questionMarkDiv = this.qm,
             descriptionDiv = this.description,
             tooltipAlwaysVisible = this._isTooltipAlwaysVisible();
         const self = this;
         if (questionMarkDiv && descriptionDiv) {
             questionMarkDiv.addEventListener('click', (e) => {
                 e.preventDefault();
                 const longDescriptionVisibleAttribute = descriptionDiv.getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
                 if (longDescriptionVisibleAttribute === 'false') {
                     self._showHideLongDescriptionDiv(true);
                     if (tooltipAlwaysVisible) {
                         self._showHideTooltipDiv(false);
                     }
                 } else {
                     self._showHideLongDescriptionDiv(false);
                     if (tooltipAlwaysVisible) {
                         self._showHideTooltipDiv(true);
                     }
                 }
             });
         }
     }
 
     getClass() {
         return (<typeof FormFieldBase> this.constructor).IS;
     }
 
     subscribe() {
         const changeHandlerName = (propName:string) => `_update${propName[0].toUpperCase() + propName.slice(1)}`
         this._model?.subscribe((action:any) => {
             let state = action.target.getState();
             const changes = action.payload.changes;
             changes.forEach((change:any) => {
                 const fn = changeHandlerName(change.propertyName);
                 //@ts-ignore
                 if (typeof this[fn] === "function") {
                     //items applicable for repeatable panel
                     if ("items" === change.propertyName) {
                        //@ts-ignore
                         this[fn](change.prevValue, change.currentValue, state);
                     } else {
                        //@ts-ignore
                         this[fn](change.currentValue, state);
                     }
                 } else {
                     console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                 }
             })
         });
     }

    

    getbemBlock(): string {
        throw "bemBlock not implemented";
    }

    getIS() : string {
        throw "IS is not implemented"
    }

    getId(): string {
        return this.getIS() +"-"+this.id
    }

    addListener() {

    }

    render() {
        this.element.appendChild(this.createView());
        if(this.fullVersion) {
            this.addListener();
            this.subscribe();
        }
    }

    createView(): Element {

        let div = document.createElement("div");
        div.id = this.getId();
        div.dataset.cmpVisible = this.isVisible()?.toString();
        div.dataset.cmpEnabled = this.isEnabled()?.toString();
        div.dataset.cmpAdaptiveformcontainerPath = this.getFormContainerPath();

        if(this.isLabelVisible()) {
            div.appendChild(this.createLabel());
        }
        let inputs = this.createInputHTML();
        if(inputs) {
            if(inputs instanceof Element) {
                div.appendChild(inputs);
            } else if(inputs instanceof Array<Element>) {
                inputs?.forEach((input) => {
                    div.appendChild(input);
                })
            }
        }
        
        let desc = this.getDescriptionValue();
        if(desc) {
            div.appendChild(this.createQuestionMarkHTML());
            div.appendChild(this.createLongDescHTML());
        }
        if(this.isShortDescVisible()) {
            div.appendChild(this.createShortDescHTML());
        }

        div.appendChild(this.createErrorHTML());
        return div;
    }
    
    createInputHTML(): Element | Array<Element> {
        throw "getInputHTML is not implemented";
    }

    createLabel(): Element {
        let label = document.createElement("label");
        label.id = this.getId()+"-label";
        label.htmlFor = this.getId();
        label.className = this.getbemBlock() + "__label";
        label.textContent = this.getLabelValue();
        return label;
    }

    createQuestionMarkHTML(): Element  {
        let button = document.createElement("button");
        button.className = this.getbemBlock() + "__questionmark";
        return button;
    }

    createShortDescHTML(): Element {
        let div = document.createElement("div");
        div.id = this.getId()+"-shortDescription";
        div.className = this.getbemBlock() + "__shortdescription";
        return div;
    }

    createLongDescHTML(): Element {
        let div = document.createElement("div");
        div.setAttribute("aria-live", "polite");
        div.id = this.getId()+"-longDescription";
        div.className = this.getbemBlock() + "__longdescription";
        return div;
    }

    createErrorHTML(): Element {
        let div = document.createElement("div");
        div.id = this.getId()+"-errorMessage";
        div.className = this.getbemBlock() + "__errormessage";
        return div;
    }

    setDisabledAttribute(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
        element.disabled = !this.isEnabled();
    }

    setReadonlyAttribute(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
        element.disabled = this.isReadOnly();
    }

    setStringContraints(element : HTMLInputElement | HTMLTextAreaElement) {
        let maxLength = this.getMaxLength();
        let minLength = this.getMinLength();
        if(minLength > 0) element.minLength = minLength
        if(minLength > 0) element.maxLength = maxLength
        if(element instanceof HTMLInputElement) element.pattern = this.state?.pattern;
    }

    setNumberConstraints(element: HTMLInputElement) {
        let max = this.getMaximum();
        let min = this.getMinimum();
        if(max > 0) element.max = max?.toString();
        if(min > 0) element.min = min?.toString();
    }
 }
 