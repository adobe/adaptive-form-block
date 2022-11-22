import FormFieldBase from "../../models/FormFieldBase";
import { Constants } from "../../util/constants";
import NumericInputWidget from "./NumericInputWidget";

export default class NumberInput extends FormFieldBase {

    widgetObject?: NumericInputWidget
    static NS = Constants.NS;
    static IS = "adaptiveFormNumberInput";
    static bemBlock = 'cmp-adaptiveform-numberinput';
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widget: `.${NumberInput.bemBlock}__widget`,
        label: `.${NumberInput.bemBlock}__label`,
        description: `.${NumberInput.bemBlock}__longdescription`,
        errorDiv: `.${NumberInput.bemBlock}__errormessage`,
        qm: `.${NumberInput.bemBlock}__questionmark`,
        tooltipDiv: `.${NumberInput.bemBlock}__shortdescription`
    };

    getClass() {
        return NumberInput.IS;
    }

    getWidget(): HTMLInputElement | null {
        return this.element.querySelector(NumberInput.selectors.widget);
    }

    getDescription() {
        return this.element.querySelector(NumberInput.selectors.description);
    }

    getLabel() {
        return this.element.querySelector(NumberInput.selectors.label);
    }

    getErrorDiv() {
        return this.element.querySelector(NumberInput.selectors.errorDiv);
    }

    getTooltipDiv() {
        return this.element.querySelector(NumberInput.selectors.tooltipDiv);
    }

    getQuestionMarkDiv() {
        return this.element.querySelector(NumberInput.selectors.qm);
    }

    _updateValue(value: number) {
        if (this.widgetObject == null && (this._model._jsonModel.editFormat || this._model._jsonModel.displayFormat)) {
            this.widgetObject = new NumericInputWidget(this.getWidget(), this._model)
        }
        if (this.widgetObject) {
            this.widgetObject.setValue(value);
        } else {
            super._updateValue(value);
        }
    }

    addListener() {
        // only initialize if patterns are set
        if (this._model?._jsonModel?.editFormat || this._model?._jsonModel?.displayFormat) {
            if (this.widgetObject == null) {
                this.widgetObject = new NumericInputWidget(this.getWidget(), this._model)
            }
        } else {
            this.getWidget()?.addEventListener('blur', (e: any) => {
                this._model.value = e.target.value;
            })
        }
    }

    getbemBlock(): string {
        return NumberInput.bemBlock;
    }

    getIS() : string {
        return NumberInput.IS;
    }

    createInputHTML(): Element {
        let input = document.createElement("input");
        input.className = "cmp-adaptiveform-numberinput__widget";
        input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
        input.type = "number";
        input.name = this.getName();
        input.value = this.getDefault();
        input.placeholder = this.getPlaceHolder();
        input.required = this.isRequired();

        input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '' );
        this.setDisabledAttribute(input);
        this.setReadonlyAttribute(input);
        this.setNumberConstraints(input);

        return input;
   }
}