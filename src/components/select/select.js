import { DefaultField } from "../defaultInput.js";
import { Click } from "../../afb-runtime.js";
import { getLabelValue, getTooltipValue, getViewId, isArrayType } from "../../lib-model.js";
import { getWidget, subscribe } from "../../lib-interaction.js";
import { Constants } from "../../constants.js";
import { defaultInputRender, renderField } from "../../lib-builder.js";

export class Select {

    blockName = Constants.SELECT;
    block;
    element;
    model;

    constructor(block, model) {
        this.block = block;
        this.model = model;
    }

    updateValue = (element, value) => {
        let isMultiSelect = isArrayType(this.model);
        if(this.element) {
            let select = getWidget(element);
            for(let index = 0; index< select?.options?.length; index++) {
                let option = select?.options?.[index];
                option.selected = (isMultiSelect && value?.includes(option.value)) 
                    || (value === option.value)
            }
        }
    }
    addListener = () => {
        getWidget(this.element)?.addEventListener('blur', (e) => {
            if(isArrayType(this.model)) {
                let valueArray = [];
                let select = getWidget(this.element);
                for(let index = 0; index< select?.options?.length; index++) {
                    let option = select?.options?.[index];
                    option.selected ? valueArray.push(option.value) : null;
                }
                this.model.value = valueArray;
            } else {
                this.model.value = e.target.value;
            }
        });
    }

    createInputHTML = (state) => {
        let select = defaultInputRender(state, this.blockName, "select");
        select.multiple = isArrayType(state);
        if(state.placeholder) {
           let option = this.createOption("", state.placeholder, true, true);
           select.appendChild(option);
        }
        this.createOptions(state, select);
        return select;
    }

    createOptions = (state, select) => {
        state?.enum?.forEach((enumVal, index) => {
            select.appendChild(this.createOption(enumVal, this.model?.enumNames?.[index], (enumVal == state.default), false));
        })
    }

    createOption = (enumValue, enumDisplayName, selected, disabled = false) => {
        let option = document.createElement("option");
        option.value = enumValue;
        option.disabled = disabled;
        option.textContent = enumDisplayName || enumValue;
        option.selected = selected;
        option.className = this.blockName + "__option";
        return option;
    }

    render() {
        this.element = renderField(this.model, this.blockName, this.createInputHTML)
        this.block.appendChild(this.element);
        this.addListener();
        subscribe(this.model, this.element, {value : this.updateValue});
    }
}

export default async function decorate(block, model) {
    let select = new Select(block, model);
    select.render();
}
