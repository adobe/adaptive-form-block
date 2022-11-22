 import {Constants} from "../util/constants.js";
 
 export default class FormField {
    
    formContainer: any;
    element: Element;
    active: boolean;
    id: string;
 
    parentView: any;
    _model:any;
    state:any;
    options?:{ [key: string]: any }
    fullVersion:boolean = false;

    static IS = "FormField";
    
     constructor(params: any, model: any) {
         this.formContainer = params.formContainer;
         this.id = params.id;
         this.element = params.element; //html element of field
         this.active = false;
         this.setModel(model);
     }
 
     setId(id:string) {
         this.id = id;
     }
 
     setParent(parentView: any) {
         this.parentView = parentView;
         if (this.parentView.addChild) {
             this.parentView.addChild(this);
         }
     }
 
     setActive() {
         if (!this.isActive()) {
             this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, "true");
         }
         if (this.parentView && this.parentView.setActive) {
             this.parentView.setActive();
         }
     }
 
     setInactive() {
         if (this.isActive()) {
             this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, "false");
         }
         if (this.parentView && this.parentView.setInactive) {
             this.parentView.setInactive();
         }
     }
 
     isActive() {
         return this.active;
     }
 
     getFormContainerPath(): string {
         return this.options?.["adaptiveformcontainerPath"];
     }
 
     getId() {
         return this.id;
     }
 
     setModel(model:any) {
         if (typeof this._model === "undefined" || this._model === null) {
             this._model = model;
         } else {
             throw "Re-initializing model is not permitted"
         }


         if (typeof this._model?.getState === 'function') {
            this.state = this._model?.getState();
            this.fullVersion = true;
          } else {
            this.state = this._model;
          }
     }
 
     /**
      * toggles the html element based on the property. If the property is false, then adds the data-attribute and
      * css class
      * @param property
      * @param dataAttribute
      * @param value
      */
     toggle(property:boolean, dataAttribute:any, value:any) {
        this.toggleAttribute(this.element, property, dataAttribute, value);
     }
 
     /**
      * Toggles the given @param element based on the property. If the property is false, then adds the data-attribute and
      * css class
      * @param element
      * @param property
      * @param dataAttribute
      * @param value
      */
     toggleAttribute(element: Element| null, property: boolean, dataAttribute: any, value:any) {
         if (element) {
             if (property === false) {
                 element.setAttribute(dataAttribute, value);
             } else {
                 element.removeAttribute(dataAttribute);
             }
         }
     }
 
     /**
      * @return 'afs:layout' properties. Empty object if no layout property present
      */
     getLayoutProperties(): any {
         let layoutProperties = {};
         const state = this.state;
         if (state && state.properties && state.properties['afs:layout']) {
             layoutProperties =  state.properties['afs:layout'];
         }
         return layoutProperties;
     }
 
     getModel() {
         return this._model;
     }
 
     subscribe() {
         throw "the field does not subscribe to the model"
     }

     isVisible(): boolean {
        return this?.state?.visible || true;
     }

     isEnabled(): boolean {
        return this?.state?.enabled || true;
     }

     isLabelVisible(): boolean {
        return this?.state?.label?.visible || true;
     }

     getLabelValue(): string {
        return this?.state?.label?.value || "";
     }

     getName(): string {
        return this?.state?.name|| "";
     }

     isTooltipVisible(): boolean {
        return false // TBD - Missing in Spec
     }

     getTooltipValue(): string {
        return ""; // TBD - Missing in Spec
     }

     isShortDescVisible(): boolean {
        return false // TBD - Missing in Spec
     }

     getShortDescValue(): string {
        return ""; // TBD - Missing in Spec
     }

     getDescriptionValue(): string {
        return this?.state?.description|| "";
     }

     getDefault(): string {
        return this?.state?.default || "";
     }

     isReadOnly(): boolean {
        return this?.state?.readOnly || false;
     }

     isRequired(): boolean {
        return this?.state?.required || false;
     }

     getPlaceHolder(): string {
        return this?.state?.placeholder || "";
     }

     getMinLength(): number {
        return this?.state?.minLength ;
     }

     getMaxLength(): number {
        return this?.state?.maxLength;
     }

     getMinimum(): number {
        return this?.state?.minimum ;
     }

     getMaximum(): number {
        return this?.state?.maximum;
     }

    getEnum() {
        return this.state?.enum;
    }

    getEnumNames() {
        return this.state?.enumNames;
    }
 } 