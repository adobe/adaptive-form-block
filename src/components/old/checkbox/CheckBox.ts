import FormFieldBase from "../../models/FormFieldBase";
import { Constants } from "../../util/constants";

export default class CheckBox extends FormFieldBase {

    static NS = Constants.NS;
    static IS = "adaptiveFormCheckBox";
    static bemBlock = 'cmp-adaptiveform-checkBox'
    static checkboxBemBlock = 'cmp-adaptiveform-checkbox'
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widgets: `.${CheckBox.bemBlock}__widgets`,
        widget: `.${CheckBox.checkboxBemBlock}__widget`,
        widgetLabel: `.${CheckBox.checkboxBemBlock}__label`,
        label: `.${CheckBox.bemBlock}__label`,
        description: `.${CheckBox.bemBlock}__longdescription`,
        qm: `.${CheckBox.bemBlock}__questionmark`,
        errorDiv: `.${CheckBox.bemBlock}__errormessage`,
        tooltipDiv: `.${CheckBox.bemBlock}__shortdescription`
    };

    widgetLabel;

    constructor(params: any, model: any) {
        super(params, model);
        this.qm = this.element.querySelector(CheckBox.selectors.qm)
        this.widgetLabel = this.element.querySelector(CheckBox.selectors.widgetLabel)

    }

    getWidget() : HTMLInputElement | null {
        return this.element.querySelector(CheckBox.selectors.widget);
    }

    getWidgets(): NodeListOf<HTMLInputElement>  {
        return this.element.querySelectorAll(CheckBox.selectors.widget);
    }

    getDescription() {
        return this.element.querySelector(CheckBox.selectors.description);
    }

    getLabel(): HTMLLabelElement | null {
        return this.element.querySelector(CheckBox.selectors.label);
    }

    getErrorDiv() {
        return this.element.querySelector(CheckBox.selectors.errorDiv);
    }

    getQuestionMarkDiv() {
        return this.element.querySelector(CheckBox.selectors.qm);
    }

    getTooltipDiv() {
        return this.element.querySelector(CheckBox.selectors.tooltipDiv);
    }

    _updateModelValue() {
        let widget = this.getWidget();
        if(widget?.checked) {
            this._model.value = this._model.enum?.[0] || true;
        } else {
            this._model.value = this._model.enum?.[1]
        }
    }

    addListener() {
        this.getWidget()?.addEventListener('change', (e) => {
            this._updateModelValue()
        })
    }

    getbemBlock(): string {
        return CheckBox.bemBlock;
    }

    getIS() : string {
        return CheckBox.IS;
    }

    createInputHTML(): Element {
        let div = document.createElement("div");
        div.className = "cmp-adaptiveform-checkbox-item " + this.getName();

        let label = document.createElement("label");
        label.className = "cmp-adaptiveform-checkbox__label";
        label.title = this.getTooltipValue();
        label.htmlFor = this.getId();
        label.setAttribute("aria-label", this.getLabelValue());

        let input = document.createElement("input");
        input.className = "cmp-adaptiveform-checkbox__widget";
        input.type = "checkbox";
        input.value = this.state?.enum?.[0] || undefined
        input.name = this.getLabelValue();
        input.checked = this.state.enum?.[0] == this.getDefault() ;
        input.setAttribute("aria-describedby", "_desc");

        this.setDisabledAttribute(input);

        label.appendChild(input);

        let span = document.createElement("span");
        span.textContent = this.getLabelValue()

        label.appendChild(input);
        label.appendChild(span);

        div.appendChild(label);

        return div;
    }

    createLabel(): Element | null {
        return null;
    }
}