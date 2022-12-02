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
        labelValue: `.${SliderInput.bemBlock}__label__value`,
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

    getLabel(): HTMLLabelElement | null {
        return this.element.querySelector(SliderInput.selectors.label);
    }

    getDisplayLabel(): Element | null {
        return this.element.querySelector(SliderInput.selectors.labelValue);
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
        this.getWidget()?.addEventListener('change', (e:any) => {
            this._model.value = e.target.value;
            this.setInactive();
            let labelValueEl = this.getDisplayLabel();
            if(labelValueEl) 
                labelValueEl.textContent =  "\t\t\t" + e.target.value;
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
    
    createInputHTML(): Array<Element> {
        let label = document.createElement("label");
        label.className = "cmp-adaptiveform-sliderinput__label__value"
        label.textContent = "\t\t\t" + this.getDefault();

        let input = document.createElement("input");
        input.className = "cmp-adaptiveform-sliderinput__widget";
        input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
        input.type = "range";
        input.name = this.getName();
        input.value = this.getDefault();
        input.step = "" + (this.state.step);
        input.placeholder = this.getPlaceHolder();
        input.required = this.isRequired();
        input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '' );
        this.setDisabledAttribute(input);
        this.setReadonlyAttribute(input);
        this.setNumberConstraints(input);
        return [label, input];
   }
}
