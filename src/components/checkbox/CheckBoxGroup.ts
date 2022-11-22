import FormFieldBase from "../../models/FormFieldBase";
import { Constants } from "../../util/constants";

export default class CheckBoxGroup extends FormFieldBase {

    static NS = Constants.NS;
    static IS = "adaptiveFormCheckBoxGroup";
    static bemBlock = 'cmp-adaptiveform-checkboxgroup'
    static checkboxBemBlock = 'cmp-adaptiveform-checkbox'
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widgets: `.${CheckBoxGroup.bemBlock}__widgets`,
        widget: `.${CheckBoxGroup.checkboxBemBlock}__widget`,
        widgetLabel: `.${CheckBoxGroup.checkboxBemBlock}__label`,
        label: `.${CheckBoxGroup.bemBlock}__label`,
        description: `.${CheckBoxGroup.bemBlock}__longdescription`,
        qm: `.${CheckBoxGroup.bemBlock}__questionmark`,
        errorDiv: `.${CheckBoxGroup.bemBlock}__errormessage`,
        tooltipDiv: `.${CheckBoxGroup.bemBlock}__shortdescription`
    };

    widgetLabel;

    constructor(params: any, model: any) {
        super(params, model);
        this.qm = this.element.querySelector(CheckBoxGroup.selectors.qm)
        this.widgetLabel = this.element.querySelector(CheckBoxGroup.selectors.widgetLabel)

    }

    getWidget() : HTMLInputElement | null {
        return this.element.querySelector(CheckBoxGroup.selectors.widget);
    }

    getWidgets(): NodeListOf<HTMLInputElement>  {
        return this.element.querySelectorAll(CheckBoxGroup.selectors.widget);
    }

    getDescription() {
        return this.element.querySelector(CheckBoxGroup.selectors.description);
    }

    getLabel() {
        return this.element.querySelector(CheckBoxGroup.selectors.label);
    }

    getErrorDiv() {
        return this.element.querySelector(CheckBoxGroup.selectors.errorDiv);
    }

    getQuestionMarkDiv() {
        return this.element.querySelector(CheckBoxGroup.selectors.qm);
    }

    getTooltipDiv() {
        return this.element.querySelector(CheckBoxGroup.selectors.tooltipDiv);
    }

    _updateModelValue() {
        let value: Array<any> = []
        let widgets = this.getWidgets();
        widgets?.forEach(widget => {
            if (widget.checked) {
                value.push(widget.value)
            }
        }, this)
        this._model.value = value
    }

    _updateEnabled(enabled: boolean) {
        this.toggle(enabled, Constants.ARIA_DISABLED, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED,  enabled + "");
        let widgets = this.getWidgets();
        widgets?.forEach(widget => {
            if (enabled === false) {
                widget.setAttribute(Constants.HTML_ATTRS.DISABLED, true + "");
                widget.setAttribute(Constants.ARIA_DISABLED, true + "");
            } else {
                widget.removeAttribute(Constants.HTML_ATTRS.DISABLED);
                widget.removeAttribute(Constants.ARIA_DISABLED);
            }
        });
    }

    addListener() {
        let widgets = this.getWidgets()
        widgets.forEach(widget => {
            let self = widget
            widget.addEventListener('change', (e) => {
                this._updateModelValue()
            })
        })
    }

    getbemBlock(): string {
        return CheckBoxGroup.bemBlock;
    }

    getIS() : string {
        return CheckBoxGroup.IS;
    }

    createInputHTML(): Element {
        let div = document.createElement("div");
        div.className = "cmp-adaptiveform-checkboxgroup__widget";
        this.getEnum()?.forEach((enumVal:string, index: number, enums: Array<any>) => {
            div.appendChild(this.createCheckboxHTML(this, enumVal,(this.getEnumNames()?.[index] || enumVal), index, enums?.length))
        })
        return div;
    }

    createCheckboxHTML(checkbox: CheckBoxGroup, enumValue: string, enumDisplayName: string, index: number, size: number) : Element {

        let div = document.createElement("div");
        div.className = "cmp-adaptiveform-checkboxgroup-item " + checkbox.getName() + " " + checkbox.getLayoutProperties().orientation;

        let label = document.createElement("label");
        label.className = "cmp-adaptiveform-checkbox__label";
        label.title = checkbox.getTooltipValue();
        label.htmlFor = checkbox.id + '_' + index + "__widget";
        label.setAttribute("aria-label", enumDisplayName);

        let input = document.createElement("input");
        input.className = "cmp-adaptiveform-checkbox__widget";
        input.type = "checkbox";
        input.id = label.htmlFor;
        input.value = enumValue.toString();
        input.name = size > 1 ? checkbox.getName(): checkbox.getLabelValue();
        input.checked = enumValue == checkbox.getDefault() ;
        input.setAttribute("aria-describedby", "_desc");

        this.setDisabledAttribute(input);

        let span = document.createElement("span");
        span.textContent = this.getEnum().length > 1 ? enumDisplayName : checkbox.getLabelValue();

        label.appendChild(input);
        label.appendChild(span);

        div.appendChild(label);

        return div;
    }

    createLabel(): Element {
        let label = document.createElement("label");
        label.id = this.getId()+"-label";
        label.htmlFor = this.getId();
        label.className = this.getbemBlock() + "__label";
        label.textContent = this.getLabelValue();
        label.hidden = this.isLabelVisible() && this.getEnum()?.length == 1;
        return label;
    }



}