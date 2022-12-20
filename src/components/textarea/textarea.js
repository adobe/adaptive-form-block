

import { renderField, setDisabledAttribute, setReadonlyAttribute, setStringContraints } from "../../lib-builder.js";
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
    createInputHTML(state, bemBlock) {
          let input = document.createElement("textarea");
          input.className = `${bemBlock}__widget`;
          input.title = isTooltipVisible(state) ? getTooltipValue(state) : '';
          input.name = state.name || "";
          input.value = state?.default || "";
          input.placeholder = state?.placeholder || "";
          input.required = state.required === true;
          input.setAttribute("aria-label", isLabelVisible(state) ? getLabelValue(state) : '' );

          setDisabledAttribute(state, input);
          setReadonlyAttribute(state, input);
          setStringContraints(state, input);
          return input;
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
