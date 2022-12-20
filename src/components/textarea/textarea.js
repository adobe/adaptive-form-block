

import { defaultInputRender, renderField, setDisabledAttribute, setReadonlyAttribute, setStringContraints } from "../../lib-builder.js";
import { subscribe } from "../../lib-interaction.js";
import { getLabelValue, getTooltipValue, isLabelVisible, isTooltipVisible } from "../../lib-model.js";
import { DefaultField } from "../defaultInput.js";

export class TextArea extends DefaultField {

     blockName = 'cmp-adaptiveform-textinput'
     
    /**
     * @param {any} state FieldJson
     * @param {string} bemBlock 
     * 
     * @return {Element}
     */
    createInputHTML = () => {
          return defaultInputRender(this.model?.getState(), this.blockName, "textarea");
     }

    render() {
          this.element = renderField(this.model, this.blockName, this.createInputHTML)
          this.block.appendChild(this.element);
          this.addListener();
          subscribe(this.model, this.element);
     }
}
export default async function decorate(block, model) {
    let textinput = new TextArea(block, model);
    textinput.render();
}
