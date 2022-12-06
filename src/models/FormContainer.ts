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
import { createFormInstance } from "../core/afcore.js";
import { FieldModel, FormModel } from "@aemforms/af-core";
import Hidden from "../components/hidden/Hidden";

export default class FormContainer {

    _model: FormModel;
    _path: string;
    _deferredParents: any;
    #element?: HTMLFormElement;

     constructor(params: any) {
        this._model = createFormInstance(params?._formJson, null);
         this._path = params._path;
         this._deferredParents = {};
     }
 
     getModel(id: string) : FieldModel {
         return this._model?.getElement(id) as FieldModel;
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
            let fieldView: FormFieldBase;
            let fieldModel = this.getModel(field.id);
            let params = {
                element: fieldWrapper,
                id: field.id
            }
            switch (field?.fieldType) {
                case "checkbox":
                    fieldView = new CheckBoxGroup(params, fieldModel);
                    break;
                case "email":
                    fieldView = new EmailInput(params, fieldModel);
                    break;
                case "slider":
                    fieldView = new SliderInput(params, fieldModel);
                    break;
                case "plain-text":
                    fieldView = new Text(params, fieldModel);
                    break;
                case "radio":
                    fieldView = new RadioButton(params, fieldModel);
                    break;
                case "number":
                    fieldView = new NumberInput(params, fieldModel);
                    break;
                case "button":
                    fieldView = new Button(params, fieldModel);
                    break;
                case "select":
                    fieldView = new DropDown(params, fieldModel);
                    break;
                case "text-area": 
                    fieldView = new TextArea(params, fieldModel);
                    break;
                case 'hidden':
                    fieldView = new Hidden(params, fieldModel)
                    break;
                default:
                    fieldView = new TextInput(params, fieldModel)
            }
            if(fieldView) {
                fieldView.render();
                this.loadCustomComponent(fieldModel, fieldView);
            }
        } catch (error) {
            console.error("Unexpected error ", error);
        }
        return fieldWrapper;
    }

    loadCustomComponent = async (fieldModel:FieldModel, fieldView: FormFieldBase) => {
        if(fieldModel && fieldView && fieldModel[":type"] != fieldModel.fieldType) {
            fieldView.elementWrapper.setAttribute("data-block-name", fieldModel[":type"]);
            this.loadBlock(fieldView.elementWrapper, fieldModel, fieldView);
        }
    }

    loadBlock = async(block: Element, fieldModel:FieldModel, fieldView: FormFieldBase) => {
        const status = block.getAttribute('data-block-status');
        if (status !== 'loading' && status !== 'loaded') {
          block.setAttribute('data-block-status', 'loading');
          const blockName = block.getAttribute('data-block-name');
          try {
            const cssLoaded = new Promise((resolve) => {
              this.loadCSS(`/blocks/${blockName}/${blockName}.css`, resolve);
            });
            const decorationComplete = new Promise((resolve) => {
              (async () => {
                try {
                  const mod = await import(`/blocks/${blockName}/${blockName}.js`);
                  if (mod.default) {
                    fieldView.customWidget = mod.default;
                    await mod.default(block, fieldModel, fieldModel.getState());
                  }
                } catch (error) {
                  // eslint-disable-next-line no-console
                  console.log(`failed to load module for ${blockName}`, error);
                }
                resolve(true);
              })();
            });
            await Promise.all([cssLoaded, decorationComplete]);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`failed to load block ${blockName}`, error);
          }
          block.setAttribute('data-block-status', 'loaded');
        }
      }

    loadCSS(href: string, callback: Function) {
        if (!document.querySelector(`head > link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', href);
            if (typeof callback === 'function') {
            link.onload = (e) => callback(e.type);
            link.onerror = (e) => callback(e);
            }
            document.head.appendChild(link);
        } else if (typeof callback === 'function') {
            callback('noop');
        }
    }

 }