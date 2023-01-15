import { expect } from '@esm-bundle/chai';
import { Constants } from '../../src/libs/constants';
import * as builder from '../../src/libs/afb-builder';
import { getErrorWidget } from '../../src/libs/afb-interaction';
import { isLabelVisible } from '../../src/libs/afb-model';

export default class ComponentValidator {

    static validateInput = (state, blockName, input) =>{
        expect(input).not.to.null;
        expect(input?.title).to.equal(state.tooltip || "");
        expect(input?.name).to.equal(state.name);
        if(state.fieldType == "radio-group") {
            expect(input?.className).to.equal(blockName+"__option__widget");
        } else {
            expect(input?.className).to.equal(blockName+"__widget");
            expect(input?.getAttribute("aria-label")).to.equal(state?.label?.value)
        }
        expect(input?.placeholder).to.equal(state.placeholder);
        if(state.getState().minLength) {
            expect(input?.minLength).to.equal(state.getState().minLength);
        }
        if(state.required) {
            expect(input?.hasAttribute("required")).to.be.true;
        } else {
            expect(input?.hasAttribute("required")).to.be.false;
        }
        if(state.fieldType == "checkbox-group") {
            expect(input?.type).to.equal("checkbox");
        } else if(state.fieldType == "radio-group") {
            expect(input?.type).to.equal("radio");
        } else if(input instanceof HTMLInputElement) {
            expect(input?.type).to.equal(state.fieldType);
        }
    }

    static validateLabel = (state, blockName, label) =>{
        if(isLabelVisible(state)) {
            expect(label).not.to.null
            expect(label?.id).to.equal(blockName+"-"+state.id+"-label");
            expect(label?.htmlFor).to.equal(blockName+"-"+state.id);
            if(state.fieldType == "radio") {
                expect(label?.textContent).to.equal(state.label?.value);
            } else {
                expect(label?.textContent).to.equal(state.required ? state.label?.value + " *" : state.label?.value);
            }
            expect(label?.className).to.equal(blockName+"__label");
        } else {
            expect(label).to.undefined
        }
    }

    static validateErrorWidget = (state, blockName, widget, message) => {
        expect(widget).not.to.null
        expect(widget?.id).to.equal(blockName+"-"+state.id+"-" + Constants.ERROR_MESSAGE);
        expect(widget?.className).to.equal(blockName +"__" + Constants.ERROR_MESSAGE);
        expect(widget?.textContent).to.equal(message);
    }

    static validateLongDesc = (state, blockName, div) =>{
        if(state?.description) {
            expect(div).not.to.null
            expect(div?.id).to.equal(blockName+"-"+state.id+"-" + Constants.LONG_DESC);
            expect(div?.className).to.equal(blockName + `__${Constants.LONG_DESC} ${Constants.ADAPTIVE_FORM_LONG_DESC}`);
            let p = div.querySelector("p");
            expect(p).not.to.null
            expect(p?.innerHTML).to.equal(state?.description);
        } else {
            expect(div).to.undefined
        }
    }

    static validateQM = (state, blockName, button) =>{
        if(state?.tooltip) {
            expect(button).not.to.null
            expect(button?.className).to.equal(blockName + `__${Constants.QM} ${Constants.ADAPTIVE_FORM_QM}`);
            expect(button?.dataset.text).to.equal(state?.tooltip);
        } else {
            expect(button).to.undefined
        }
    }

    static validateQMEvents = (state, blockName, qm) =>{
        if(state?.tooltip) {
            document.body.append(qm);
            qm.dispatchEvent(new Event('mouseenter'));

            let tooltip = document.querySelector(`.${blockName}__${Constants.TOOLTIP}`);
            this.validateTooltip(state, blockName, tooltip);

            qm.dispatchEvent(new Event('mouseleave'));
            expect(tooltip.parentElement).to.null;
            qm.remove();
        } else {
            expect(button).to.undefined
        }
    }

    static validateTooltip = (state, blockName, tooltip) => {
        if(tooltip) {
            expect(tooltip).not.to.null;
            expect(tooltip?.className).to.contains(blockName + `__${Constants.TOOLTIP} ${Constants.ADAPTIVE_FORM_TOOLTIP}`);
            expect(tooltip?.textContent).to.equal(state?.tooltip);
        } else {
            expect(tooltip).to.undefined
        }
    }
    
    static validateWidget = (state, blockName, widget, visible = true, enabled = true ) => {
        expect(widget).not.to.null;
        expect(widget?.className).to.equal(blockName)
        expect(widget?.id).to.equal(blockName+"-"+state.id)
        expect(widget?.dataset.cmpVisible).to.equal(visible+"")
        expect(widget?.dataset.cmpEnabled).to.equal(enabled+"")
        expect(widget?.dataset.cmpIs).to.equal(blockName)
        if(!visible) {
            expect(widget?.getAttribute("aria-hidden")).to.equal("true")
        }
    }

    static validateInputValue = (model, blockName, block, expected, tag= "input") => {
        let input = block.querySelector(tag);
        expect(input).not.to.null
        if(input.type == "select-multiple") {
            let array = []
            for (const option of input?.options) {
                if(option.selected) {
                    array.push(option.value);
                }
            }
            expect(array.join(",")).to.equal(model.value?.join(","));
        } else if(model.fieldType == "radio-group") {
            let checkedValue;
            let widget = block.querySelectorAll(tag);
            for (const option of widget) {
                if(option.checked) {
                    checkedValue = (option.value);
                    break;
                }
            }
            expect(checkedValue).to.equal(expected);
        } else if(model.fieldType == "checkbox-group") {
            let array = []
            let widget = block.querySelectorAll(tag);
            for (const option of widget) {
                if(option.checked) {
                    array.push(option.value);
                }
            }
            expect(array.join(",")).to.equal(model.value?.join(","));
        } else if(input.type == "checkbox" || input.type == "radio") {
            expect(input?.checked).to.equal(expected);
        } else {
            expect(input?.value).to.equal(expected);
            expect(input?.value).to.equal(model.value+"");
        }
        this.validateErrorWidget(model, blockName, getErrorWidget(block), "");
    }

    static validateConstraint = (model, blockName, block, value, msg = "") => {
        this.triggerValueChange(model, blockName, block, value);
        this.validateErrorWidget(model, blockName, getErrorWidget(block), msg);
    }

    static triggerValueChange = (model, blockName, block, value) => {
        let input = builder?.default?.getWidget(block);
        expect(input).not.to.null
        if(["select-one", "select-multiple"].includes(input.type)) {
            var evt = new Event("blur");
            input.selectedIndex = value;
        } else if(input.type == "checkbox") {
            var evt = new Event("change");
            input.checked = value;
        } else if(input.type == "radio") {
            let widget = block.querySelectorAll("input");
            for (const option of widget) {
                if(option.value == value) {
                    input = option;
                    break;
                }
            }
            var evt = new Event("change");
            input.checked = value;
        } 
        else {
            var evt = new Event("blur");
            input.value = value;
        }
        input.dispatchEvent(evt);
    }

    static setValue = (adaptiveForm, formEl, fieldId, blockName, value) => {
        let model = adaptiveForm.getModel(fieldId);
        let widget = formEl.querySelector("#"+blockName+"-"+fieldId);
        expect(model).not.to.null;
        expect(widget).not.to.null;
        ComponentValidator.validateConstraint(model, blockName, widget, value)
    }
}