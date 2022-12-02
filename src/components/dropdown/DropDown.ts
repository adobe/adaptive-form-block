import { Constants } from "../../util/constants";
import FormFieldBase from "../../models/FormFieldBase";

export default class DropDown extends FormFieldBase {

    static NS = Constants.NS;
    static IS = "adaptiveFormDropDown";
    static bemBlock = 'cmp-adaptiveform-dropdown';
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widget: `.${DropDown.bemBlock}__widget`,
        options: `.${DropDown.bemBlock}__option`,
        label: `.${DropDown.bemBlock}__label`,
        description: `.${DropDown.bemBlock}__longdescription`,
        qm: `.${DropDown.bemBlock}__questionmark`,
        errorDiv: `.${DropDown.bemBlock}__errormessage`,
        tooltipDiv: `.${DropDown.bemBlock}__shortdescription`
    };

    constructor(params: any, model: any) {
        super(params, model);
        this.qm = this.element.querySelector(DropDown.selectors.qm);
    }

    getWidget(): HTMLInputElement | null {
        return this.element.querySelector(DropDown.selectors.widget);
    }

    getDescription(): Element | null {
        return this.element.querySelector(DropDown.selectors.description);
    }

    getLabel(): HTMLLabelElement | null {
        return this.element.querySelector(DropDown.selectors.label);
    }

    getErrorDiv(): Element | null {
        return this.element.querySelector(DropDown.selectors.errorDiv);
    }

    getQuestionMarkDiv(): Element | null {
        return this.element.querySelector(DropDown.selectors.qm);
    }

    getTooltipDiv(): Element | null {
        return this.element.querySelector(DropDown.selectors.tooltipDiv);
    }

     #checkIfEqual = function(value: Array<string>, optionValue:string, multiSelect: boolean) {
        if(multiSelect) {
            let isPresent = false;
            value.forEach((saveValue: string) => {
                if(String(saveValue) === optionValue)  // save value can be number and boolean also.
                    isPresent = true;
            })
            return isPresent;
        }
        return String(value) === optionValue;
    }

    _updateValue(value: any) {
        let isMultiSelect = this.isArrayType();
        if(this.widget) {
            let select: HTMLSelectElement =  (this.widget as unknown) as HTMLSelectElement;
            [select].forEach((option) => {
                if(this.#checkIfEqual(value, option.value, isMultiSelect)) {
                    option.setAttribute('selected', 'selected')
                } else {
                    option.removeAttribute('selected');
                }
        });
        }
    }

    addListener() {
        this.getWidget()?.addEventListener('blur', (e:any) => {
            if(this.isArrayType()) {
                let valueArray:Array<any> = [];
                let select: HTMLSelectElement =  (this.widget as unknown) as HTMLSelectElement;
                [select].forEach((option: any) => {
                    if(option.selected) {
                        valueArray.push(option.value);
                    }
                });
                this._model.value = valueArray;
            } else {
                this._model.value = e.target.value;
            }
        });
    }

    getbemBlock(): string {
        return DropDown.bemBlock;
    }
    
    getIS() : string {
        return DropDown.IS;
    }

    createInputHTML(): Element {
        let select = document.createElement("select");
        select.className = "cmp-adaptiveform-dropdown__widget";
        select.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
        select.name = this.getName();
        select.multiple = this.isArrayType();
        select.required = this.isRequired();
        select.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '')
        this.setDisabledAttribute(select);
        this.setReadonlyAttribute(select);

        let placeholder = this.getPlaceHolder();
        if(placeholder) {
           let option = this.createOptions("", this.getPlaceHolder(), true, true);
           select.appendChild(option);
        }
        this.state?.enum?.forEach((enumVal:string, index: number) => {
            select.appendChild(this.createOptions(enumVal, this.state?.enumNames?.[index], (enumVal == this.getDefault()), false));
        })
        return select;
    }

    createOptions(enumValue:any, enumDisplayName: string | undefined, selected:boolean, disabled: boolean = false): Element {
        let option = document.createElement("option");
        option.value = enumValue;
        option.disabled = disabled;
        option.textContent = enumDisplayName || enumValue;
        option.selected = selected;
        option.className = "cmp-adaptiveform-dropdown__option";
        return option;
    }
}