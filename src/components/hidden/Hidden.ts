import FormFieldBase from "../../models/FormFieldBase";

export default class Hidden extends FormFieldBase {

    static bemBlock = 'cmp-adaptiveform-hidden'
    static IS = "adaptiveFormHidden";

    getbemBlock(): string {
        return Hidden.bemBlock;
    }

    getIS() : string {
        return Hidden.IS;
    }
    getWidget(): HTMLInputElement | null {
        return this.elementWrapper.querySelector("input");
    }
    setElements() {

    }

    createInputHTML(): Element {
        let input = document.createElement("input");
        input.type = "hidden"
        input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
        input.name = this.getName();
        input.value = this.state.value ? this.state.value : null;
        input.placeholder = this.getPlaceHolder();
        input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '' );
        return input;
    }
}