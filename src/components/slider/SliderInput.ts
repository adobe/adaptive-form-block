import { Constants } from "../../util/constants";
import FormFieldBase from "../../models/FormFieldBase";

export default class SliderInput extends FormFieldBase {

    static NS = Constants.NS;
    static IS = "adaptiveFormSliderInput";
    static bemBlock = 'cmp-adaptiveform-sliderinput'
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widget: `.${SliderInput.bemBlock}__widget`,
        label: `.${SliderInput.bemBlock}__label`,
        description: `.${SliderInput.bemBlock}__longdescription`,
        qm: `.${SliderInput.bemBlock}__questionmark`,
        errorDiv: `.${SliderInput.bemBlock}__errormessage`,
        tooltipDiv: `.${SliderInput.bemBlock}__shortdescription`
    };

    getWidget(): HTMLInputElement | null {
        return this.element.querySelector(SliderInput.selectors.widget);
    }

    getDescription(): Element | null {
        return this.element.querySelector(SliderInput.selectors.description);
    }

    getLabel(): Element | null {
        return this.element.querySelector(SliderInput.selectors.label);
    }

    getErrorDiv(): Element | null {
        return this.element.querySelector(SliderInput.selectors.errorDiv);
    }

    getTooltipDiv(): Element | null {
        return this.element.querySelector(SliderInput.selectors.tooltipDiv);
    }

    getQuestionMarkDiv(): Element | null {
        return this.element.querySelector(SliderInput.selectors.qm);
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
        return SliderInput.bemBlock;
    }
    
    getIS() : string {
        return SliderInput.IS;
    }
    
    createInputHTML(): Element {
        let input = document.createElement("input");
        input.className = "cmp-adaptiveform-sliderInput__widget";
        input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
        input.type = "range";
        input.name = this.getName();
        input.value = this.getDefault();
        input.step= this.state.step;
        input.placeholder = this.getPlaceHolder();
        input.required = this.isRequired();
        input.min = this.getMinLength()?.toString();
        input.max = this.getMaxLength()?.toString();
        input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '' );
        this.setDisabledAttribute(input);
        this.setReadonlyAttribute(input);
        this.setNumberConstraints(input);
        return input;
   }
}
