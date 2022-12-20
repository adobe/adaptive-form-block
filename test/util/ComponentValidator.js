import { expect } from '@esm-bundle/chai';
import { Constants } from '../../src/constants';
import { getWidget } from '../../src/lib-builder';
import { getErrorWidget } from '../../src/lib-interaction';
import { isLabelVisible } from '../../src/lib-model';

export default class ComponentValidator {

    static validateInput = (state, blockName, input) =>{
        expect(input).not.to.null;
        expect(input?.title).to.equal(state.tooltip || "");
        expect(input?.name).to.equal(state.name);
        expect(input?.className).to.equal(blockName+"__widget");
        expect(input?.placeholder).to.equal(state.placeholder);
        expect(input?.getAttribute("aria-label")).to.equal(state?.label?.value)
        if(state.getState().minLength) {
            expect(input?.minLength).to.equal(state.getState().minLength);
        }
        if(state.required) {
            expect(input?.hasAttribute("required")).to.be.true;
        } else {
            expect(input?.hasAttribute("required")).to.be.false;
        }
        if(input instanceof HTMLInputElement) {
            expect(input?.type).to.equal(state.fieldType);
        }
    }

    static validateLabel = (state, blockName, label) =>{
        if(isLabelVisible(state)) {
            expect(label).not.to.null
            expect(label?.id).to.equal(blockName+"-"+state.id+"-label");
            expect(label?.htmlFor).to.equal(blockName+"-"+state.id);
            expect(label?.textContent).to.equal(state.label?.value);
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
            expect(button?.title).to.equal(state?.tooltip);
        } else {
            expect(button).to.undefined
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
            expect(array.join(",")).to.equal(model.value.join(","));
        } else if(input.type == "checkbox") {
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
        let input = getWidget(block);
        expect(input).not.to.null
        if(["select-one", "select-multiple"].includes(input.type)) {
            var evt = new Event("blur");
            input.selectedIndex = value;
        } else if(input.type == "checkbox") {
            var evt = new Event("change");
            input.checked = value;
        }
        else {
            var evt = new Event("blur");
            input.value = value;
        }
        input.dispatchEvent(evt);
    }
}