import { Constants } from "../../util/constants";
import FormFieldBase from "../../models/FormFieldBase";

export default class TextInput extends FormFieldBase {

    static NS = Constants.NS;
    static IS = "adaptiveFormTextInput";
    static bemBlock = 'cmp-adaptiveform-textinput'
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widget: `.${TextInput.bemBlock}__widget`,
        label: `.${TextInput.bemBlock}__label`,
        description: `.${TextInput.bemBlock}__longdescription`,
        qm: `.${TextInput.bemBlock}__questionmark`,
        errorDiv: `.${TextInput.bemBlock}__errormessage`,
        tooltipDiv: `.${TextInput.bemBlock}__shortdescription`
    };

    getWidget(): HTMLInputElement | null {
        return this.element.querySelector(TextInput.selectors.widget);
    }

    getDescription(): Element | null {
        return this.element.querySelector(TextInput.selectors.description);
    }

    getLabel(): Element | null {
        return this.element.querySelector(TextInput.selectors.label);
    }

    getErrorDiv(): Element | null {
        return this.element.querySelector(TextInput.selectors.errorDiv);
    }

    getTooltipDiv(): Element | null {
        return this.element.querySelector(TextInput.selectors.tooltipDiv);
    }

    getQuestionMarkDiv(): Element | null {
        return this.element.querySelector(TextInput.selectors.qm);
    }

    addListener() {
        this.getWidget()?.addEventListener('blur', (e:any) => {
            this._model.value = e.target.value;
            this.setInactive();
        });
        this.getWidget()?.addEventListener('focus', (e) => {
            this.setActive();
        });
    }

    getbemBlock(): string {
        return TextInput.bemBlock;
    }
    
    getIS() : string {
        return TextInput.IS;
    }

    createInputHTML(): Element {
        let input = document.createElement("input");
        input.type="text"
        input.className = "cmp-adaptiveform-textinput__widget";
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
