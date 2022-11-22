import TextInput from "../components/textinput/TextInput";
import FormFieldBase from "./FormFieldBase";

import TextArea from "../components/textarea/TextArea";
import DropDown from "../components/dropdown/DropDown";
import Button from "../components/button/Button";
import NumberInput from "../components/number/NumberInput";
import RadioButton from "../components/radiobutton/RadioButton";
import Text from "../components/text/Text";
import SliderInput from "../components/slider/SliderInput";
import EmailInput from "../components/email/EmailInput";
import CheckBoxGroup from "../components/checkbox/CheckBoxGroup";
import { createFormInstance } from "../core/afcore";

export default class FormContainer {

    _model: any;
    _path: string;
    _deferredParents: any;
    #element?: HTMLFormElement;

     constructor(params: any) {
        this._model = createFormInstance(params?._formJson, null);
         this._path = params._path;
         this._deferredParents = {};
     }
 
     getModel(id: string) {
         return id ? this._model?.getElement(id) : this._model;
     }
 
     getPath() {
         return this._path;
     }

    render(placeholder: Element) {
        const form = document.createElement('form');
        form.className = "cmp-adaptiveform-container cmp-container";
        this.#element = form;

        let state = this._model?.getState();
        this.renderChildrens(form, state);
        placeholder.replaceWith(form);
        return form;
    }

    renderChildrens = (form: Element, state:any) => {
        console.time("Rendering childrens")
        let items : Array<any> = state?.items;
        let view = [];
        view.length = items.length;
        if(items && items.length>0) {
            items.forEach((field ,index) => {
                form.append(this.getRender(field, index));
            })
        }   
        console.timeEnd("Rendering childrens")
    }
    getRender = (field:any, index:number): Element => {
        const fieldWrapper = document.createElement('div');
        try {
            let fieldViewModel: FormFieldBase;
            let fieldModel = this.getModel(field.id);
            let params = {
                element: fieldWrapper,
                id: field.id
            }
            switch (field?.fieldType) {
                case "checkbox":
                    fieldViewModel = new CheckBoxGroup(params, fieldModel);
                    break;
                case "email":
                    fieldViewModel = new EmailInput(params, fieldModel);
                    break;
                case "slider":
                    fieldViewModel = new SliderInput(params, fieldModel);
                    break;
                case "plain-text":
                    fieldViewModel = new Text(params, fieldModel);
                    break;
                case "radio":
                    fieldViewModel = new RadioButton(params, fieldModel);
                    break;
                case "number":
                    fieldViewModel = new NumberInput(params, fieldModel);
                    break;
                case "button":
                    fieldViewModel = new Button(params, fieldModel);
                    break;
                case "select":
                    fieldViewModel = new DropDown(params, fieldModel);
                    break;
                case "text-area": 
                    fieldViewModel = new TextArea(params, fieldModel);
                    break;
                default:
                    fieldViewModel = new TextInput(params, fieldModel)
            }
            if(fieldViewModel) {
                fieldViewModel.render();
            }
        } catch (error) {
            console.error("Unexpected error ", error);
        }
        return fieldWrapper;
    }

 }