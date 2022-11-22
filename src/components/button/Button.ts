import { Constants } from "../../util/constants";
import FormFieldBase from "../../models/FormFieldBase";
import { Actions } from "../../util/actions";


export default class Button extends FormFieldBase {

    static NS = Constants.NS;
    /**
     * Each FormField has a data attribute class that is prefixed along with the global namespace to
     * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
     * data-{NS}-{IS}-x=""
     * @type {string}
     */
    static IS = "adaptiveFormButton";
    static bemBlock = 'cmp-adaptiveform-button';
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]'
    };

    getQuestionMarkDiv() {
        return null;
    }

    getLabel() {
        return null;
    }

    getWidget(): HTMLInputElement |null {
        return this.element.querySelector(".cmp-button");
    }

    /**
     * Return the description element.
     * @returns {HTMLElement}
     */
    getDescription() {
        return null;
    }

    getErrorDiv() {
        return null;
    }

    getTooltipDiv() {
        return null;
    }

    addListener() {
        this.getWidget()?.addEventListener("click", () => {
            this._model.dispatch(new Actions.Click())
        });
    }

    getbemBlock(): string {
        return Button.bemBlock;
    }
    getIS() : string {
        return Button.IS;
    }

    // TODO - Icon part of spec?
    createView(): Element {

        let button = document.createElement("button");
        button.type = "button"
        button.id = this.getId();
        button.className = "cmp-button";
        button.title = this.getTooltipValue();
        button.dataset.cmpVisible = this.isVisible().toString();
        button.dataset.cmpEnabled = this.isEnabled().toString();
        button.dataset.cmpAdaptiveformcontainerPath = this.getFormContainerPath();
        button.dataset.cmpIs = "adaptiveFormButton";
        button.setAttribute("aria-label", this.getLabelValue());

        let span = document.createElement("span");
        span.className = "cmp-button__text";
        span.textContent = this.getLabelValue();

        button.appendChild(span);
        return button;
    }
}
