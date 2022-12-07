import { FieldJson, FieldModel } from "@aemforms/af-core"
import FormFieldBase from "../../src/models/FormFieldBase"

export default class ComponentValidator {

    validateWidget = (fieldView:FormFieldBase, model: FieldModel, visible:boolean = true, enabled:boolean = true ) => {
        let widget = fieldView.element;
        expect(widget).not.toBeNull()
        expect(widget?.className).toEqual(fieldView.getbemBlock())
        expect(widget?.id).toEqual(fieldView.getIS()+"-"+fieldView.id)
        expect(widget?.dataset.cmpVisible).toEqual(visible+"")
        expect(widget?.dataset.cmpEnabled).toEqual(enabled+"")
        expect(widget?.dataset.cmpIs).toEqual(fieldView.getIS())
        expect(widget?.dataset.cmpAdaptiveformcontainerPath).toEqual("undefined");
        if(!visible) {
            expect(widget?.getAttribute("aria-hidden")).toBeTruthy()
        }
        this.validateErrorWidget(fieldView, model, "")
    }

    validateLabel = (fieldView:FormFieldBase, model: FieldModel) =>{
        let label = fieldView.getLabel()
        expect(label).not.toBeNull()
        expect(label?.id).toEqual(fieldView.getIS()+"-"+fieldView.id+"-label");
        expect(label?.htmlFor).toEqual(fieldView.getIS()+"-"+fieldView.id);
        expect(label?.textContent).toEqual(model.label?.value);
        expect(label?.className).toEqual(fieldView.getbemBlock()+"__label");
    }

    validateInput = (fieldView:FormFieldBase, model: FieldModel, type: string) =>{
        let input = fieldView.getWidget();
        expect(input).not.toBeNull()
        expect(input?.type).toEqual(type);
        //expect(input?.title).toEqual(model.tooltip);
        expect(input?.name).toEqual(model.name);
        expect(input?.className).toEqual(fieldView.getbemBlock()+"__widget");
        expect(input?.placeholder).toEqual(model.placeholder);
        expect(input?.getAttribute("aria-label")).toEqual(model?.label?.value)
        if(model.getState().minLength) {
            expect(input?.minLength).toEqual(model.getState().minLength);
        }
        if(model.required) {
            expect(input?.hasAttribute("required")).toBeTruthy();
        } else {
            expect(input?.hasAttribute("required")).toBeFalsy();
        }
    }

    validateInputValue = (fieldView:FormFieldBase, model: FieldModel, expected: string) => {
        let input = fieldView.getWidget();
        expect(input).not.toBeNull()
        expect(input?.value).toEqual(expected);
        expect(input?.value).toEqual(model.value+"");
        this.validateErrorWidget(fieldView, model, "");
    }

    validateErrorWidget = (fieldView:FormFieldBase, model: FieldModel, message: string) => {
        let widget = fieldView.getErrorDiv();
        expect(widget).not.toBeNull()
        expect(widget?.id).toEqual(fieldView.getIS()+"-"+fieldView.id+"-errorMessage");
        expect(widget?.className).toEqual(fieldView.getbemBlock() +"__errormessage");
        expect(widget?.textContent).toEqual(message);
    }

    validateConstraint = (fieldView:FormFieldBase, model: FieldModel, value:any, msg: string = "") => {
        this.triggerValueChange(fieldView, model, value);
        this.validateErrorWidget(fieldView, model, msg);
    }

    triggerValueChange = (fieldView:FormFieldBase, model: FieldModel, value: string) => {
        let input = fieldView.widget;
        expect(input).not.toBeNull()
        if(input) {
            var evt = new Event("blur");
            input.value = value;
            input.dispatchEvent(evt);
        }
    }
}