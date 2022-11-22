import TextInput from "../textinput/TextInput";



export default class TextArea extends TextInput {

    createInputHTML(): Element {
          let input = document.createElement("textarea");
          input.className = "cmp-adaptiveform-textarea__widget";
          input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
          input.name = this.getName();
          input.value = this.getDefault();
          input.placeholder = this.getPlaceHolder();
          input.required = this.isRequired();
          input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '' );

          this.setDisabledAttribute(input);
          this.setReadonlyAttribute(input);
          this.setStringContraints(input);
          return input;
     }
}
