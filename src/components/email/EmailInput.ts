import TextInput from "../textinput/TextInput";



export default class EmailInput extends TextInput {

     createInputHTML(): Element {
          let input = document.createElement("input");
          input.className = "cmp-adaptiveform-textinput__widget";
          input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
          input.type = "email";
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
