 import { FieldJson, FieldModel, State } from "@aemforms/af-core";
import {Constants} from "../util/constants";
 
 export default class FormField {
    
    formContainer: any;
    elementWrapper: HTMLDivElement;
    element: HTMLDivElement;
    active: boolean;
    id: string;
 
    parentView: any;
    _model:FieldModel;
    state:State<FieldJson>;
    options?:{ [key: string]: any }

    static IS = "FormField";
    
     constructor(params: any, model: FieldModel) {
         this.formContainer = params.formContainer;
         this.id = params.id;
         this.element = document.createElement("div");
         this.elementWrapper = params.element; //html element of field
         this.active = false;
         this._model = model;
         this.state = this._model?.getState();
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
        return this?.state?.visible == true;
     }

     isEnabled(): boolean {
        return this?.state?.enabled == true || this?.state?.enabled == undefined;
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
        return this.getTooltipValue() ? true : false;
     }

     getTooltipValue(): string {
        //@ts-ignore
        return this?.state?.tooltip;
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

    isArrayType() {
        return this.state.type == "array";
    }
 } 