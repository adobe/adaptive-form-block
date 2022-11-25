function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
var id = 0;
function _classPrivateFieldLooseKey(name) {
  return "__private_" + id++ + "_" + name;
}
function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }
  return receiver;
}

const Constants = {
  /**
   * namespsace of the data-attribute. Any data attribute will be prefixed with this name.
   * i.e. data-name would be data-{NS}-{ComponentClass}-name. Each component will have a different
   * component class
   */
  NS: "cmp",
  /**
   * @summary Form event to be triggered with a Form container is initialized
   *
   * @name  AF_FormContainerInitialised
   * @event
   * @property {object} event
   * @property {object} event.detail instance of FormContainer that is initialzied
   * @example
   * document.on("AF_FormContainerInitialised" , function(event) {
   *      var formContainer = event.detail;
   *      ...
   * }
   */
  FORM_CONTAINER_INITIALISED: "AF_FormContainerInitialised",
  /**
   * @summary Panel event to be triggered when a child view is added to panel view
   *
   * @name  AF_PanelChildAdded
   * @event
   * @property {object} event
   * @property {object} event.detail instance of child view that is added
   * @example
   * panel.element.on("AF_PanelChildAdded" , function(event) {
   *      var childView = event.detail;
   *      ...
   * }
   */
  PANEL_CHILD_ADDED: "AF_PanelChildAdded",
  /**
   * @summary Panel event to be triggered when a child view is removed from panel view
   *
   * @name  AF_PanelChildRemoved
   * @event
   * @property {object} event
   * @property {object} event.detail instance of child view that was removed
   * @example
   * panel.element.on("AF_PanelChildRemoved" , function(event) {
   *      var childView = event.detail;
   *      ...
   * }
   */
  PANEL_CHILD_REMOVED: "AF_PanelChildRemoved",
  /**
   * data attribute to store the form container path. In HTML it will be namespaced
   * data-{NS}-{ComponentClass}-adaptiveformcontainerPath
   */
  FORM_CONTAINER_DATA_ATTRIBUTE: "adaptiveformcontainerPath",
  /**
   * data attribute to be added on clickable element to repeat a repeatable panel
   */
  DATA_HOOK_ADD_INSTANCE: "data-cmp-hook-add-instance",
  /**
   * data attribute to be added on element to remove a repeatable panel
   */
  DATA_HOOK_REMOVE_INSTANCE: "data-cmp-hook-remove-instance",
  /**
   * data attribute to mark the dragged component valid or invalid.
   * value true for valid
   * value false for invalid
   */
  DATA_ATTRIBUTE_VALID: "data-cmp-valid",
  /**
   * data attribute to mark the dragged component enabled or disabled.
   * value true for enabled
   * value false for disabled
   */
  DATA_ATTRIBUTE_ENABLED: "data-cmp-enabled",
  /**
   * data attribute to mark the dragged component visible or invisible.
   * value true for visible
   * value false for invisible
   */
  DATA_ATTRIBUTE_VISIBLE: "data-cmp-visible",
  /**
   * data attribute to mark the dragged component active or inactive.
   * value true for active
   * value false for inactive
   */
  DATA_ATTRIBUTE_ACTIVE: "data-cmp-active",
  /**
   * aria attribute to mark the dragged component disabled.
   */
  ARIA_DISABLED: "aria-disabled",
  /**
   * aria attribute to mark the dragged component hidden.
   */
  ARIA_HIDDEN: "aria-hidden",
  /**
   * aria attribute to mark the dragged component invalid.
   */
  ARIA_INVALID: "aria-invalid",
  /**
   * aria attribute to mark the dragged component checked.
   */
  ARIA_CHECKED: "aria-checked",
  /**
   * aria attribute to mark component selected
   */
  ARIA_SELECTED: "aria-selected",
  /**
   * Event to trigger when GuideBridge Initialisation Begins
   */
  GUIDE_BRIDGE_INITIALIZE_START: "bridgeInitializeStart",
  HTML_ATTRS: {
    /**
     * attribute to mark the dragged component disabled.
     */
    DISABLED: "disabled",
    /**
     * attribute to mark the dragged component checked.
     */
    CHECKED: "checked"
  },
  TABINDEX: "tabindex",
  /**
   * Prefix path for all AF HTTP APIs
   */
  API_PATH_PREFIX: "/adobe/forms/af"
};

class FormField {
  constructor(params, model) {
    this.formContainer = void 0;
    this.element = void 0;
    this.active = void 0;
    this.id = void 0;
    this.parentView = void 0;
    this._model = void 0;
    this.state = void 0;
    this.options = void 0;
    this.formContainer = params.formContainer;
    this.id = params.id;
    this.element = params.element; //html element of field
    this.active = false;
    this.setModel(model);
  }
  setId(id) {
    this.id = id;
  }
  setParent(parentView) {
    this.parentView = parentView;
    if (this.parentView.addChild) {
      this.parentView.addChild(this);
    }
  }
  setActive() {
    if (!this.isActive()) {
      this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, "true");
    }
    if (this.parentView && this.parentView.setActive) {
      this.parentView.setActive();
    }
  }
  setInactive() {
    if (this.isActive()) {
      this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, "false");
    }
    if (this.parentView && this.parentView.setInactive) {
      this.parentView.setInactive();
    }
  }
  isActive() {
    return this.active;
  }
  getFormContainerPath() {
    var _this$options;
    return (_this$options = this.options) == null ? void 0 : _this$options["adaptiveformcontainerPath"];
  }
  getId() {
    return this.id;
  }
  setModel(model) {
    var _this$_model;
    if (typeof this._model === "undefined" || this._model === null) {
      this._model = model;
    } else {
      throw "Re-initializing model is not permitted";
    }
    this.state = (_this$_model = this._model) == null ? void 0 : _this$_model.getState();
  }
  /**
   * toggles the html element based on the property. If the property is false, then adds the data-attribute and
   * css class
   * @param property
   * @param dataAttribute
   * @param value
   */
  toggle(property, dataAttribute, value) {
    this.toggleAttribute(this.element, property, dataAttribute, value);
  }
  /**
   * Toggles the given @param element based on the property. If the property is false, then adds the data-attribute and
   * css class
   * @param element
   * @param property
   * @param dataAttribute
   * @param value
   */
  toggleAttribute(element, property, dataAttribute, value) {
    if (element) {
      if (property === false) {
        element.setAttribute(dataAttribute, value);
      } else {
        element.removeAttribute(dataAttribute);
      }
    }
  }
  /**
   * @return 'afs:layout' properties. Empty object if no layout property present
   */
  getLayoutProperties() {
    let layoutProperties = {};
    const state = this.state;
    if (state && state.properties && state.properties['afs:layout']) {
      layoutProperties = state.properties['afs:layout'];
    }
    return layoutProperties;
  }
  getModel() {
    return this._model;
  }
  subscribe() {
    throw "the field does not subscribe to the model";
  }
  isVisible() {
    var _this$state;
    return (this == null ? void 0 : (_this$state = this.state) == null ? void 0 : _this$state.visible) || true;
  }
  isEnabled() {
    var _this$state2;
    return (this == null ? void 0 : (_this$state2 = this.state) == null ? void 0 : _this$state2.enabled) || true;
  }
  isLabelVisible() {
    var _this$state3, _this$state3$label;
    return (this == null ? void 0 : (_this$state3 = this.state) == null ? void 0 : (_this$state3$label = _this$state3.label) == null ? void 0 : _this$state3$label.visible) || true;
  }
  getLabelValue() {
    var _this$state4, _this$state4$label;
    return (this == null ? void 0 : (_this$state4 = this.state) == null ? void 0 : (_this$state4$label = _this$state4.label) == null ? void 0 : _this$state4$label.value) || "";
  }
  getName() {
    var _this$state5;
    return (this == null ? void 0 : (_this$state5 = this.state) == null ? void 0 : _this$state5.name) || "";
  }
  isTooltipVisible() {
    return this.getTooltipValue() ? true : false;
  }
  getTooltipValue() {
    var _this$state6;
    return this == null ? void 0 : (_this$state6 = this.state) == null ? void 0 : _this$state6.tooltip;
  }
  getDescriptionValue() {
    var _this$state7;
    return (this == null ? void 0 : (_this$state7 = this.state) == null ? void 0 : _this$state7.description) || "";
  }
  getDefault() {
    var _this$state8;
    return (this == null ? void 0 : (_this$state8 = this.state) == null ? void 0 : _this$state8.default) || "";
  }
  isReadOnly() {
    var _this$state9;
    return (this == null ? void 0 : (_this$state9 = this.state) == null ? void 0 : _this$state9.readOnly) || false;
  }
  isRequired() {
    var _this$state10;
    return (this == null ? void 0 : (_this$state10 = this.state) == null ? void 0 : _this$state10.required) || false;
  }
  getPlaceHolder() {
    var _this$state11;
    return (this == null ? void 0 : (_this$state11 = this.state) == null ? void 0 : _this$state11.placeholder) || "";
  }
  getMinLength() {
    var _this$state12;
    return this == null ? void 0 : (_this$state12 = this.state) == null ? void 0 : _this$state12.minLength;
  }
  getMaxLength() {
    var _this$state13;
    return this == null ? void 0 : (_this$state13 = this.state) == null ? void 0 : _this$state13.maxLength;
  }
  getMinimum() {
    var _this$state14;
    return this == null ? void 0 : (_this$state14 = this.state) == null ? void 0 : _this$state14.minimum;
  }
  getMaximum() {
    var _this$state15;
    return this == null ? void 0 : (_this$state15 = this.state) == null ? void 0 : _this$state15.maximum;
  }
  getEnum() {
    var _this$state16;
    return (_this$state16 = this.state) == null ? void 0 : _this$state16.enum;
  }
  getEnumNames() {
    var _this$state17;
    return (_this$state17 = this.state) == null ? void 0 : _this$state17.enumNames;
  }
}
FormField.IS = "FormField";

class FormFieldBase extends FormField {
  constructor(params, model) {
    super(params, model);
    this.qm = void 0;
    this.widget = void 0;
    this.label = void 0;
    this.errorDiv = void 0;
    this.tooltip = void 0;
    this.description = void 0;
    this.element.className = this.getbemBlock();
  }
  /**
   * implementations should return the widget element that is used to capture the value from the user
   * It will be a input/textarea element
   * @returns
   */
  getWidget() {
    throw "method not implemented";
  }
  /**
   * implementations should return the element used to show the description of the field
   * @returns
   */
  getDescription() {
    throw "method not implemented";
  }
  /**
   * implementations should return the element used to show the label of the field
   * @returns
   */
  getLabel() {
    throw "method not implemented";
  }
  /**
   * implementations should return the element used to show the error on the field
   * @returns
   */
  getErrorDiv() {
    throw "method not implemented";
  }
  /**
   * implementation should return the tooltip / short description div
   */
  getTooltipDiv() {
    throw "method not implemented";
  }
  /**
   * Implementation should return the questionMark div
   */
  getQuestionMarkDiv() {
    throw "method not implemented";
  }
  setModel(model) {
    super.setModel(model);
    // No need to apply state as UI is build using current state.
    /*const state = this._model.getState();
    this._applyState(state); */
  }
  /**
   * Sets the focus on component's widget.
   */
  setFocus() {
    var _this$getWidget;
    (_this$getWidget = this.getWidget()) == null ? void 0 : _this$getWidget.focus();
  }
  /**
   * applies full state of the field to the HTML. Generally done just after the model is bound to the field
   * @param state
   * @private
   */
  _applyState(state) {
    if (state.value) {
      this._updateValue(state.value);
    }
    this._updateVisible(state.visible);
    this._updateEnabled(state.enabled);
    this._initializeHelpContent(state);
  }
  _initializeHelpContent(state) {
    // Initializing Hint ('?') and long description.
    this._showHideLongDescriptionDiv(false);
    if (this.getDescription()) {
      this._addHelpIconHandler(state);
    }
  }
  /**
   *
   * @param show If true then <div> containing tooltip(Short Description) will be shown else hidden
   * @private
   */
  _showHideTooltipDiv(show) {
    if (this.tooltip) {
      this.toggleAttribute(this.getTooltipDiv(), show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
    }
  }
  /**
   *
   * @param show If true then <div> containing description(Long Description) will be shown
   * @private
   */
  _showHideLongDescriptionDiv(show) {
    if (this.description) {
      this.toggleAttribute(this.description, show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
    }
  }
  _isTooltipAlwaysVisible() {
    return !!this.getLayoutProperties()['tooltipVisible'];
  }
  /**
   * updates html based on visible state
   * @param visible
   * @private
   */
  _updateVisible(visible) {
    this.toggle(visible, Constants.ARIA_HIDDEN, true);
    this.element.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible + "");
  }
  /**
   * udpates the html state based on enable state of the field
   * @param enabled
   * @private
   */
  _updateEnabled(enabled) {
    if (this.getWidget()) {
      this.toggle(enabled, Constants.ARIA_DISABLED, true);
      this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled + "");
      if (enabled === false) {
        var _this$getWidget2, _this$getWidget3;
        (_this$getWidget2 = this.getWidget()) == null ? void 0 : _this$getWidget2.setAttribute("disabled", "true");
        (_this$getWidget3 = this.getWidget()) == null ? void 0 : _this$getWidget3.setAttribute(Constants.ARIA_DISABLED, "true");
      } else {
        var _this$getWidget4, _this$getWidget5;
        (_this$getWidget4 = this.getWidget()) == null ? void 0 : _this$getWidget4.removeAttribute("disabled");
        (_this$getWidget5 = this.getWidget()) == null ? void 0 : _this$getWidget5.removeAttribute(Constants.ARIA_DISABLED);
      }
    }
  }
  _updateValid(valid, state) {
    if (this.errorDiv) {
      this.toggle(valid, Constants.ARIA_INVALID, true);
      this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid + "");
      if (typeof state.errorMessage !== "string" || state.errorMessage === "") {
        const errMessage = valid === true ? '' : 'Please fill in this field.';
        this.errorDiv.innerHTML = errMessage;
      }
    }
  }
  _updateErrorMessage(errorMessage, state) {
    if (this.errorDiv) {
      this.errorDiv.innerHTML = state.errorMessage;
    }
  }
  _updateValue(value) {
    let inputWidget = this.getWidget();
    if (inputWidget) {
      inputWidget.value = value;
    }
  }
  /**
   * Shows or Hides Description Based on click of '?' mark.
   * @private
   */
  _addHelpIconHandler(state) {
    const questionMarkDiv = this.qm,
      descriptionDiv = this.description,
      tooltipAlwaysVisible = this._isTooltipAlwaysVisible();
    const self = this;
    if (questionMarkDiv && descriptionDiv) {
      questionMarkDiv.addEventListener('click', e => {
        e.preventDefault();
        const longDescriptionVisibleAttribute = descriptionDiv.getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
        if (longDescriptionVisibleAttribute === 'false') {
          self._showHideLongDescriptionDiv(true);
          if (tooltipAlwaysVisible) {
            self._showHideTooltipDiv(false);
          }
        } else {
          self._showHideLongDescriptionDiv(false);
          if (tooltipAlwaysVisible) {
            self._showHideTooltipDiv(true);
          }
        }
      });
    }
  }
  getClass() {
    return this.constructor.IS;
  }
  subscribe() {
    var _this$_model;
    const changeHandlerName = propName => `_update${propName[0].toUpperCase() + propName.slice(1)}`;
    (_this$_model = this._model) == null ? void 0 : _this$_model.subscribe(action => {
      let state = action.target.getState();
      const changes = action.payload.changes;
      changes.forEach(change => {
        const fn = changeHandlerName(change.propertyName);
        //@ts-ignore
        if (typeof this[fn] === "function") {
          //items applicable for repeatable panel
          if ("items" === change.propertyName) {
            //@ts-ignore
            this[fn](change.prevValue, change.currentValue, state);
          } else {
            //@ts-ignore
            this[fn](change.currentValue, state);
          }
        } else {
          console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`);
        }
      });
    });
  }
  setElements() {
    this.widget = this.getWidget();
    this.description = this.getDescription();
    this.label = this.getLabel();
    this.errorDiv = this.getErrorDiv();
    this.qm = this.getQuestionMarkDiv();
    this.tooltip = this.getTooltipDiv();
  }
  getbemBlock() {
    throw "bemBlock not implemented";
  }
  getIS() {
    throw "IS is not implemented";
  }
  getId() {
    return this.getIS() + "-" + this.id;
  }
  addListener() {}
  render() {
    this.element.appendChild(this.createView());
    this.setElements();
    this.addListener();
    this.subscribe();
  }
  createView() {
    var _this$isVisible, _this$isEnabled;
    let div = document.createElement("div");
    div.id = this.getId();
    div.dataset.cmpVisible = (_this$isVisible = this.isVisible()) == null ? void 0 : _this$isVisible.toString();
    div.dataset.cmpEnabled = (_this$isEnabled = this.isEnabled()) == null ? void 0 : _this$isEnabled.toString();
    div.dataset.cmpAdaptiveformcontainerPath = this.getFormContainerPath();
    div.className = this.state.style;
    if (this.isLabelVisible()) {
      div.appendChild(this.createLabel());
    }
    let inputs = this.createInputHTML();
    if (inputs) {
      if (inputs instanceof Element) {
        div.appendChild(inputs);
      } else if (inputs instanceof Array) {
        inputs == null ? void 0 : inputs.forEach(input => {
          div.appendChild(input);
        });
      }
    }
    let desc = this.getDescriptionValue();
    if (desc) {
      div.appendChild(this.createLongDescHTML());
    }
    if (this.isTooltipVisible()) {
      div.appendChild(this.createQuestionMarkHTML());
      div.appendChild(this.createShortDescHTML());
    }
    div.appendChild(this.createErrorHTML());
    return div;
  }
  createInputHTML() {
    throw "getInputHTML is not implemented";
  }
  createLabel() {
    let label = document.createElement("label");
    label.id = this.getId() + "-label";
    label.htmlFor = this.getId();
    label.className = this.getbemBlock() + "__label";
    label.textContent = this.getLabelValue();
    return label;
  }
  createQuestionMarkHTML() {
    let button = document.createElement("button");
    button.className = this.getbemBlock() + "__questionmark cmp-adaptiveform__questionmark";
    return button;
  }
  createShortDescHTML() {
    let div = document.createElement("div");
    div.id = this.getId() + "-shortDescription";
    div.className = this.getbemBlock() + "__shortdescription cmp-adaptiveform__shortdescription";
    return div;
  }
  createLongDescHTML() {
    let div = document.createElement("div");
    div.setAttribute("aria-live", "polite");
    div.id = this.getId() + "-longDescription";
    div.className = this.getbemBlock() + "__longdescription cmp-adaptiveform__longdescription";
    let p = document.createElement("p");
    p.innerHTML = this.getDescriptionValue();
    div.append(p);
    return div;
  }
  createErrorHTML() {
    let div = document.createElement("div");
    div.id = this.getId() + "-errorMessage";
    div.className = this.getbemBlock() + "__errormessage";
    return div;
  }
  setDisabledAttribute(element) {
    element.disabled = !this.isEnabled();
  }
  setReadonlyAttribute(element) {
    element.disabled = this.isReadOnly();
  }
  setStringContraints(element) {
    var _this$state;
    let maxLength = this.getMaxLength();
    let minLength = this.getMinLength();
    if (minLength > 0) element.minLength = minLength;
    if (maxLength > 0) element.maxLength = maxLength;
    if (element instanceof HTMLInputElement) element.pattern = (_this$state = this.state) == null ? void 0 : _this$state.pattern;
  }
  setNumberConstraints(element) {
    let max = this.getMaximum();
    let min = this.getMinimum();
    if (max > 0) element.max = max == null ? void 0 : max.toString();
    if (min > 0) element.min = min == null ? void 0 : min.toString();
  }
}

class TextInput extends FormFieldBase {
  getWidget() {
    return this.element.querySelector(TextInput.selectors.widget);
  }
  getDescription() {
    return this.element.querySelector(TextInput.selectors.description);
  }
  getLabel() {
    return this.element.querySelector(TextInput.selectors.label);
  }
  getErrorDiv() {
    return this.element.querySelector(TextInput.selectors.errorDiv);
  }
  getTooltipDiv() {
    return this.element.querySelector(TextInput.selectors.tooltipDiv);
  }
  getQuestionMarkDiv() {
    return this.element.querySelector(TextInput.selectors.qm);
  }
  addListener() {
    var _this$getWidget, _this$getWidget2;
    (_this$getWidget = this.getWidget()) == null ? void 0 : _this$getWidget.addEventListener('blur', e => {
      this._model.value = e.target.value;
      this.setInactive();
    });
    (_this$getWidget2 = this.getWidget()) == null ? void 0 : _this$getWidget2.addEventListener('focus', e => {
      this.setActive();
    });
  }
  getbemBlock() {
    return TextInput.bemBlock;
  }
  getIS() {
    return TextInput.IS;
  }
  createInputHTML() {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "cmp-adaptiveform-textinput__widget";
    input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
    input.name = this.getName();
    input.value = this.state.value ? this.state.value : null;
    input.placeholder = this.getPlaceHolder();
    input.required = this.isRequired();
    input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '');
    this.setDisabledAttribute(input);
    this.setReadonlyAttribute(input);
    this.setStringContraints(input);
    return input;
  }
}
TextInput.NS = Constants.NS;
TextInput.IS = "adaptiveFormTextInput";
TextInput.bemBlock = 'cmp-adaptiveform-textinput';
TextInput.selectors = {
  self: "[data-" + TextInput.NS + '-is="' + TextInput.IS + '"]',
  widget: `.${TextInput.bemBlock}__widget`,
  label: `.${TextInput.bemBlock}__label`,
  description: `.${TextInput.bemBlock}__longdescription`,
  qm: `.${TextInput.bemBlock}__questionmark`,
  errorDiv: `.${TextInput.bemBlock}__errormessage`,
  tooltipDiv: `.${TextInput.bemBlock}__shortdescription`
};

class TextArea extends TextInput {
  createInputHTML() {
    let input = document.createElement("textarea");
    input.className = "cmp-adaptiveform-textarea__widget";
    input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
    input.name = this.getName();
    input.value = this.getDefault();
    input.placeholder = this.getPlaceHolder();
    input.required = this.isRequired();
    input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '');
    this.setDisabledAttribute(input);
    this.setReadonlyAttribute(input);
    this.setStringContraints(input);
    return input;
  }
}

var _checkIfEqual = /*#__PURE__*/_classPrivateFieldLooseKey("checkIfEqual");
class DropDown extends FormFieldBase {
  constructor(params, model) {
    super(params, model);
    Object.defineProperty(this, _checkIfEqual, {
      writable: true,
      value: function (value, optionValue, multiSelect) {
        if (multiSelect) {
          let isPresent = false;
          value.forEach(saveValue => {
            if (String(saveValue) === optionValue)
              // save value can be number and boolean also.
              isPresent = true;
          });
          return isPresent;
        }
        return String(value) === optionValue;
      }
    });
    this.qm = this.element.querySelector(DropDown.selectors.qm);
  }
  getWidget() {
    return this.element.querySelector(DropDown.selectors.widget);
  }
  getDescription() {
    return this.element.querySelector(DropDown.selectors.description);
  }
  getLabel() {
    return this.element.querySelector(DropDown.selectors.label);
  }
  getErrorDiv() {
    return this.element.querySelector(DropDown.selectors.errorDiv);
  }
  getQuestionMarkDiv() {
    return this.element.querySelector(DropDown.selectors.qm);
  }
  getTooltipDiv() {
    return this.element.querySelector(DropDown.selectors.tooltipDiv);
  }
  _updateValue(value) {
    let isMultiSelect = this._model.isArrayType();
    if (this.widget) {
      let select = this.widget;
      [select].forEach(option => {
        if (_classPrivateFieldLooseBase(this, _checkIfEqual)[_checkIfEqual](value, option.value, isMultiSelect)) {
          option.setAttribute('selected', 'selected');
        } else {
          option.removeAttribute('selected');
        }
      });
    }
  }
  addListener() {
    var _this$getWidget;
    (_this$getWidget = this.getWidget()) == null ? void 0 : _this$getWidget.addEventListener('blur', e => {
      if (this._model.isArrayType()) {
        let valueArray = [];
        let select = this.widget;
        [select].forEach(option => {
          if (option.selected) {
            valueArray.push(option.value);
          }
        });
        this._model.value = valueArray;
      } else {
        this._model.value = e.target.value;
      }
    });
  }
  getbemBlock() {
    return DropDown.bemBlock;
  }
  getIS() {
    return DropDown.IS;
  }
  createInputHTML() {
    var _this$state, _this$getEnum;
    let select = document.createElement("select");
    select.className = "cmp-adaptiveform-dropdown__widget";
    select.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
    select.name = this.getName();
    select.multiple = (_this$state = this.state) == null ? void 0 : _this$state.isMultiSelect;
    select.required = this.isRequired();
    select.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '');
    this.setDisabledAttribute(select);
    this.setReadonlyAttribute(select);
    let placeholder = this.getPlaceHolder();
    if (placeholder) {
      let option = this.createOptions("", this.getPlaceHolder(), true, true);
      select.appendChild(option);
    }
    (_this$getEnum = this.getEnum()) == null ? void 0 : _this$getEnum.forEach((enumVal, index) => {
      select.appendChild(this.createOptions(enumVal, this.getEnumNames()[index], enumVal == this.getDefault(), false));
    });
    return select;
  }
  createOptions(enumValue, enumDisplayName, selected, disabled = false) {
    let option = document.createElement("option");
    option.value = enumValue;
    option.disabled = disabled;
    option.textContent = enumDisplayName;
    option.selected = selected;
    option.className = "cmp-adaptiveform-dropdown__option";
    return option;
  }
}
DropDown.NS = Constants.NS;
DropDown.IS = "adaptiveFormDropDown";
DropDown.bemBlock = 'cmp-adaptiveform-dropdown';
DropDown.selectors = {
  self: "[data-" + DropDown.NS + '-is="' + DropDown.IS + '"]',
  widget: `.${DropDown.bemBlock}__widget`,
  options: `.${DropDown.bemBlock}__option`,
  label: `.${DropDown.bemBlock}__label`,
  description: `.${DropDown.bemBlock}__longdescription`,
  qm: `.${DropDown.bemBlock}__questionmark`,
  errorDiv: `.${DropDown.bemBlock}__errormessage`,
  tooltipDiv: `.${DropDown.bemBlock}__shortdescription`
};

console.time("script json-formula");
var t = {
    TYPE_NUMBER: 0,
    TYPE_ANY: 1,
    TYPE_STRING: 2,
    TYPE_ARRAY: 3,
    TYPE_OBJECT: 4,
    TYPE_BOOLEAN: 5,
    TYPE_EXPREF: 6,
    TYPE_NULL: 7,
    TYPE_ARRAY_NUMBER: 8,
    TYPE_ARRAY_STRING: 9,
    TYPE_CLASS: 10,
    TYPE_ARRAY_ARRAY: 11
  },
  e = {
    TOK_EOF: "EOF",
    TOK_UNQUOTEDIDENTIFIER: "UnquotedIdentifier",
    TOK_QUOTEDIDENTIFIER: "QuotedIdentifier",
    TOK_RBRACKET: "Rbracket",
    TOK_RPAREN: "Rparen",
    TOK_COMMA: "Comma",
    TOK_COLON: "Colon",
    TOK_CONCATENATE: "Concatenate",
    TOK_RBRACE: "Rbrace",
    TOK_NUMBER: "Number",
    TOK_CURRENT: "Current",
    TOK_GLOBAL: "Global",
    TOK_FIELD: "Field",
    TOK_EXPREF: "Expref",
    TOK_PIPE: "Pipe",
    TOK_OR: "Or",
    TOK_AND: "And",
    TOK_ADD: "Add",
    TOK_SUBTRACT: "Subtract",
    TOK_MULTIPLY: "Multiply",
    TOK_POWER: "Power",
    TOK_UNION: "Union",
    TOK_DIVIDE: "Divide",
    TOK_EQ: "EQ",
    TOK_GT: "GT",
    TOK_LT: "LT",
    TOK_GTE: "GTE",
    TOK_LTE: "LTE",
    TOK_NE: "NE",
    TOK_FLATTEN: "Flatten",
    TOK_STAR: "Star",
    TOK_FILTER: "Filter",
    TOK_DOT: "Dot",
    TOK_NOT: "Not",
    TOK_LBRACE: "Lbrace",
    TOK_LBRACKET: "Lbracket",
    TOK_LPAREN: "Lparen",
    TOK_LITERAL: "Literal"
  };
const {
    TYPE_NUMBER: r,
    TYPE_ANY: n,
    TYPE_STRING: s,
    TYPE_ARRAY: i,
    TYPE_OBJECT: u,
    TYPE_BOOLEAN: o,
    TYPE_EXPREF: c,
    TYPE_NULL: a,
    TYPE_ARRAY_NUMBER: l,
    TYPE_ARRAY_STRING: h,
    TYPE_CLASS: _,
    TYPE_ARRAY_ARRAY: p
  } = t,
  {
    TOK_EXPREF: T
  } = e,
  E = {
    [r]: "number",
    [n]: "any",
    [s]: "string",
    [i]: "array",
    [u]: "object",
    [o]: "boolean",
    [c]: "expression",
    [a]: "null",
    [l]: "Array<number>",
    [h]: "Array<string>",
    [_]: "class",
    [p]: "Array<array>"
  };
function f(t, e = !0) {
  if (null === t) return a;
  let n = t;
  if (e) {
    if ("function" != typeof t.valueOf) return u;
    n = t.valueOf.call(t);
  }
  switch (Object.prototype.toString.call(n)) {
    case "[object String]":
      return s;
    case "[object Number]":
      return r;
    case "[object Array]":
      return i;
    case "[object Boolean]":
      return o;
    case "[object Null]":
      return a;
    case "[object Object]":
      return n.jmespathType === T ? c : u;
    default:
      return u;
  }
}
function d(t) {
  return [f(t), f(t, !1)];
}
function y(t, e, c, T, f, g) {
  const O = t[0];
  if (-1 !== e.findIndex(t => t === n || O === t)) return c;
  let R = !1;
  if ((O === u || 1 === e.length && e[0] === _) && (R = !0), O === i && 1 === e.length && e[0] === u && (R = !0), e.includes(p)) {
    if (O === i && (c.forEach(t => {
      t instanceof Array || (R = !0);
    }), !R)) return c;
    R = !0;
  }
  if (R) throw new Error(`TypeError: ${T} expected argument to be type ${E[e[0]]} but received type ${E[O]} instead.`);
  let N = -1;
  if (O === i && e.includes(h) && e.includes(l) && (N = c.length > 0 && "string" == typeof c[0] ? h : l), -1 === N && [h, l, i].includes(O) && (N = e.find(t => [h, l, i].includes(t))), -1 === N && ([N] = e), N === n) return c;
  if (N === h || N === l || N === i) {
    if (N === i) return O === l || O === h ? c : null === c ? [] : [c];
    const _e2 = N === l ? r : s;
    if (O === i) {
      const _t2 = c.slice();
      for (let r = 0; r < _t2.length; r += 1) {
        const n = d(_t2[r]);
        _t2[r] = y(n, [_e2], _t2[r], T, f, g);
      }
      return _t2;
    }
    if ([r, s, a, o].includes(_e2)) return [y(t, [_e2], c, T, f, g)];
  } else {
    if (N === r) return [s, o, a].includes(O) ? f(c) : 0;
    if (N === s) return O === a || O === u ? "" : g(c);
    if (N === o) return !!c;
    if (N === u && t[1] === u) return c;
  }
  throw new Error("unhandled argument");
}
function g(t) {
  return null !== t && "[object Array]" === Object.prototype.toString.call(t);
}
function O(t) {
  return null !== t && "[object Object]" === Object.prototype.toString.call(t);
}
function R(t) {
  return null == t ? t : g(t) ? t.map(t => R(t)) : "function" != typeof t.valueOf ? t : t.valueOf();
}
function N(t, e) {
  const r = R(t),
    n = R(e);
  if (r === n) return !0;
  if (Object.prototype.toString.call(r) !== Object.prototype.toString.call(n)) return !1;
  if (!0 === g(r)) {
    if (r.length !== n.length) return !1;
    for (let _t3 = 0; _t3 < r.length; _t3 += 1) if (!1 === N(r[_t3], n[_t3])) return !1;
    return !0;
  }
  if (!0 === O(r)) {
    const _t4 = {};
    for (const _e3 in r) if (hasOwnProperty.call(r, _e3)) {
      if (!1 === N(r[_e3], n[_e3])) return !1;
      _t4[_e3] = !0;
    }
    for (const _e4 in n) if (hasOwnProperty.call(n, _e4) && !0 !== _t4[_e4]) return !1;
    return !0;
  }
  return !1;
}
const {
    TOK_CURRENT: P,
    TOK_GLOBAL: m,
    TOK_EXPREF: Y,
    TOK_PIPE: v,
    TOK_EQ: A,
    TOK_GT: K,
    TOK_LT: I,
    TOK_GTE: S,
    TOK_LTE: b,
    TOK_NE: x,
    TOK_FLATTEN: U
  } = e,
  {
    TYPE_STRING: M,
    TYPE_ARRAY_STRING: w,
    TYPE_ARRAY: L
  } = t;
function B(t) {
  if (null === t) return !0;
  const e = R(t);
  if ("" === e || !1 === e || null === e) return !0;
  if (g(e) && 0 === e.length) return !0;
  if (O(e)) {
    for (const _t5 in e) if (Object.prototype.hasOwnProperty.call(e, _t5)) return !1;
    return !0;
  }
  return !e;
}
class k {
  constructor(t, e, r, n, s, i) {
    this.runtime = t, this.globals = e, this.toNumber = r, this.toString = n, this.debug = s, this.language = i;
  }
  search(t, e) {
    return this.visit(t, e);
  }
  visit(t, e) {
    const r = t && {
      Field: (t, e) => {
        if (null !== e && (O(e) || g(e))) {
          let r = e[t.name];
          if ("function" == typeof r && (r = void 0), void 0 === r) {
            try {
              this.debug.push(`Failed to find: '${t.name}'`);
              const _r = Object.keys(e).map(t => `'${t}'`).toString();
              _r.length && this.debug.push(`Available fields: ${_r}`);
            } catch (t) {}
            return null;
          }
          return r;
        }
        return null;
      },
      Subexpression: (t, e) => {
        let r = this.visit(t.children[0], e);
        for (let _e5 = 1; _e5 < t.children.length; _e5 += 1) if (r = this.visit(t.children[1], r), null === r) return null;
        return r;
      },
      IndexExpression: (t, e) => {
        const r = this.visit(t.children[0], e);
        return this.visit(t.children[1], r);
      },
      Index: (t, e) => {
        if (g(e)) {
          let r = this.toNumber(this.visit(t.value, e));
          r < 0 && (r = e.length + r);
          const n = e[r];
          return void 0 === n ? (this.debug.push(`Index ${r} out of range`), null) : n;
        }
        if (O(e)) {
          const r = this.toString(this.visit(t.value, e)),
            n = e[r];
          return void 0 === n ? (this.debug.push(`Key ${r} does not exist`), null) : n;
        }
        return this.debug.push(`left side of index expression ${e} is not an array or object.`), null;
      },
      Slice: (t, e) => {
        if (!g(e)) return null;
        const r = t.children.slice(0).map(t => null != t ? this.toNumber(this.visit(t, e)) : null),
          n = this.computeSliceParams(e.length, r),
          [s, i, u] = n,
          o = [];
        if (u > 0) for (let _t6 = s; _t6 < i; _t6 += u) o.push(e[_t6]);else for (let _t7 = s; _t7 > i; _t7 += u) o.push(e[_t7]);
        return o;
      },
      Projection: (t, e) => {
        const r = this.visit(t.children[0], e);
        if (!g(r)) return null;
        const n = [];
        return r.forEach(e => {
          const r = this.visit(t.children[1], e);
          null !== r && n.push(r);
        }), n;
      },
      ValueProjection: (t, e) => {
        const r = this.visit(t.children[0], e);
        if (!O(R(r))) return null;
        const n = [];
        return Object.values(r).forEach(e => {
          const r = this.visit(t.children[1], e);
          null !== r && n.push(r);
        }), n;
      },
      FilterProjection: (t, e) => {
        const r = this.visit(t.children[0], e);
        if (!g(r)) return null;
        const n = r.filter(e => !B(this.visit(t.children[2], e))),
          s = [];
        return n.forEach(e => {
          const r = this.visit(t.children[1], e);
          null !== r && s.push(r);
        }), s;
      },
      Comparator: (t, e) => {
        const r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        if (t.name === A) return N(r, n);
        if (t.name === x) return !N(r, n);
        if (t.name === K) return r > n;
        if (t.name === S) return r >= n;
        if (t.name === I) return r < n;
        if (t.name === b) return r <= n;
        throw new Error(`Unknown comparator: ${t.name}`);
      },
      [U]: (t, e) => {
        const r = this.visit(t.children[0], e);
        if (!g(r)) return null;
        const n = [];
        return r.forEach(t => {
          g(t) ? n.push(...t) : n.push(t);
        }), n;
      },
      Identity: (t, e) => e,
      MultiSelectList: (t, e) => null === e ? null : t.children.map(t => this.visit(t, e)),
      MultiSelectHash: (t, e) => {
        if (null === e) return null;
        const r = {};
        return t.children.forEach(t => {
          r[t.name] = this.visit(t.value, e);
        }), r;
      },
      OrExpression: (t, e) => {
        let r = this.visit(t.children[0], e);
        return B(r) && (r = this.visit(t.children[1], e)), r;
      },
      AndExpression: (t, e) => {
        const r = this.visit(t.children[0], e);
        return !0 === B(r) ? r : this.visit(t.children[1], e);
      },
      AddExpression: (t, e) => {
        const r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return this.applyOperator(r, n, "+");
      },
      ConcatenateExpression: (t, e) => {
        let r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return r = y(d(r), [M, w], r, "concatenate", this.toNumber, this.toString), n = y(d(n), [M, w], n, "concatenate", this.toNumber, this.toString), this.applyOperator(r, n, "&");
      },
      UnionExpression: (t, e) => {
        let r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return r = y(d(r), [L], r, "union", this.toNumber, this.toString), n = y(d(n), [L], n, "union", this.toNumber, this.toString), r.concat(n);
      },
      SubtractExpression: (t, e) => {
        const r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return this.applyOperator(r, n, "-");
      },
      MultiplyExpression: (t, e) => {
        const r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return this.applyOperator(r, n, "*");
      },
      DivideExpression: (t, e) => {
        const r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return this.applyOperator(r, n, "/");
      },
      PowerExpression: (t, e) => {
        const r = this.visit(t.children[0], e),
          n = this.visit(t.children[1], e);
        return this.applyOperator(r, n, "^");
      },
      NotExpression: (t, e) => B(this.visit(t.children[0], e)),
      Literal: t => t.value,
      Number: t => t.value,
      [v]: (t, e) => {
        const r = this.visit(t.children[0], e);
        return this.visit(t.children[1], r);
      },
      [P]: (t, e) => e,
      [m]: t => {
        const e = this.globals[t.name];
        return void 0 === e ? null : e;
      },
      Function: (t, e) => {
        if ("if" === t.name) return this.runtime.callFunction(t.name, t.children, e, this, !1);
        const r = t.children.map(t => this.visit(t, e));
        return this.runtime.callFunction(t.name, r, e, this);
      },
      ExpressionReference: t => {
        const [e] = t.children;
        return e.jmespathType = Y, e;
      }
    }[t.type];
    if (!r) throw new Error(`Unknown/missing node type ${t && t.type || ""}`);
    return r(t, e);
  }
  computeSliceParams(t, e) {
    function r(t, e, r) {
      let n = e;
      return n < 0 ? (n += t, n < 0 && (n = r < 0 ? -1 : 0)) : n >= t && (n = r < 0 ? t - 1 : t), n;
    }
    let [n, s, i] = e;
    if (null === i) i = 1;else if (0 === i) {
      const _t8 = new Error("Invalid slice, step cannot be 0");
      throw _t8.name = "RuntimeError", _t8;
    }
    const u = i < 0;
    return n = null === n ? u ? t - 1 : 0 : r(t, n, i), s = null === s ? u ? -1 : t : r(t, s, i), [n, s, i];
  }
  applyOperator(t, e, r) {
    if (g(t) && g(e)) {
      const n = t.length < e.length ? t : e,
        s = Math.abs(t.length - e.length);
      n.length += s, n.fill(null, n.length - s);
      const i = [];
      for (let _n = 0; _n < t.length; _n += 1) i.push(this.applyOperator(t[_n], e[_n], r));
      return i;
    }
    if (g(t)) return t.map(t => this.applyOperator(t, e, r));
    if (g(e)) return e.map(e => this.applyOperator(t, e, r));
    if ("*" === r) return this.toNumber(t) * this.toNumber(e);
    if ("&" === r) return t + e;
    if ("+" === r) return this.toNumber(t) + this.toNumber(e);
    if ("-" === r) return this.toNumber(t) - this.toNumber(e);
    if ("/" === r) {
      const _r2 = t / e;
      return Number.isFinite(_r2) ? _r2 : null;
    }
    if ("^" === r) return t ** e;
    throw new Error(`Unknown operator: ${r}`);
  }
}
const {
    TOK_UNQUOTEDIDENTIFIER: C,
    TOK_QUOTEDIDENTIFIER: j,
    TOK_RBRACKET: D,
    TOK_RPAREN: G,
    TOK_COMMA: F,
    TOK_COLON: $,
    TOK_CONCATENATE: H,
    TOK_RBRACE: Q,
    TOK_NUMBER: J,
    TOK_CURRENT: q,
    TOK_GLOBAL: z,
    TOK_EXPREF: X,
    TOK_PIPE: V,
    TOK_OR: W,
    TOK_AND: Z,
    TOK_ADD: tt,
    TOK_SUBTRACT: et,
    TOK_MULTIPLY: rt,
    TOK_POWER: nt,
    TOK_DIVIDE: st,
    TOK_UNION: it,
    TOK_EQ: ut,
    TOK_GT: ot,
    TOK_LT: ct,
    TOK_GTE: at,
    TOK_LTE: lt,
    TOK_NE: ht,
    TOK_FLATTEN: _t,
    TOK_STAR: pt,
    TOK_FILTER: Tt,
    TOK_DOT: Et,
    TOK_NOT: ft,
    TOK_LBRACE: dt,
    TOK_LBRACKET: yt,
    TOK_LPAREN: gt,
    TOK_LITERAL: Ot
  } = e,
  Rt = {
    ".": Et,
    ",": F,
    ":": $,
    "{": dt,
    "}": Q,
    "]": D,
    "(": gt,
    ")": G,
    "@": q
  },
  Nt = {
    "<": !0,
    ">": !0,
    "=": !0,
    "!": !0
  },
  Pt = {
    " ": !0,
    "\t": !0,
    "\n": !0
  };
function mt(t, e) {
  return t >= "0" && t <= "9" || e && "-" === t || "." === t;
}
function Yt(t) {
  return t >= "a" && t <= "z" || t >= "A" && t <= "Z" || t >= "0" && t <= "9" || "_" === t;
}
function vt(t, e) {
  const r = t[e];
  return "$" === r ? t.length > e && Yt(t[e + 1]) : r >= "a" && r <= "z" || r >= "A" && r <= "Z" || "_" === r;
}
class At {
  constructor(t = [], e = []) {
    this._allowedGlobalNames = t, this.debug = e;
  }
  tokenize(t) {
    const e = [];
    let r, n, s;
    for (this._current = 0; this._current < t.length;) {
      const i = e.length ? e.slice(-1)[0].type : null;
      if (this._isGlobal(i, t, this._current)) e.push(this._consumeGlobal(t));else if (vt(t, this._current)) r = this._current, n = this._consumeUnquotedIdentifier(t), e.push({
        type: C,
        value: n,
        start: r
      });else if (void 0 !== Rt[t[this._current]]) e.push({
        type: Rt[t[this._current]],
        value: t[this._current],
        start: this._current
      }), this._current += 1;else if ("-" === t[this._current] && ![q, J, G, C, j, D].includes(i) || mt(t[this._current], !1)) s = this._consumeNumber(t), e.push(s);else if ("[" === t[this._current]) s = this._consumeLBracket(t), e.push(s);else if ('"' === t[this._current]) r = this._current, n = this._consumeQuotedIdentifier(t), e.push({
        type: j,
        value: n,
        start: r
      });else if ("'" === t[this._current]) r = this._current, n = this._consumeRawStringLiteral(t), e.push({
        type: Ot,
        value: n,
        start: r
      });else if ("`" === t[this._current]) {
        r = this._current;
        const _n2 = this._consumeLiteral(t);
        e.push({
          type: Ot,
          value: _n2,
          start: r
        });
      } else if (void 0 !== Nt[t[this._current]]) e.push(this._consumeOperator(t));else if (void 0 !== Pt[t[this._current]]) this._current += 1;else if ("&" === t[this._current]) r = this._current, this._current += 1, "&" === t[this._current] ? (this._current += 1, e.push({
        type: Z,
        value: "&&",
        start: r
      })) : e.push(i === F || i === gt ? {
        type: X,
        value: "&",
        start: r
      } : {
        type: H,
        value: "&",
        start: r
      });else if ("~" === t[this._current]) r = this._current, this._current += 1, e.push({
        type: it,
        value: "~",
        start: r
      });else if ("+" === t[this._current]) r = this._current, this._current += 1, e.push({
        type: tt,
        value: "+",
        start: r
      });else if ("-" === t[this._current]) r = this._current, this._current += 1, e.push({
        type: et,
        value: "-",
        start: r
      });else if ("*" === t[this._current]) {
        r = this._current, this._current += 1;
        const _t9 = e.length && e.slice(-1)[0].type;
        0 === e.length || [yt, Et, V, Z, W, F, $].includes(_t9) ? e.push({
          type: pt,
          value: "*",
          start: r
        }) : e.push({
          type: rt,
          value: "*",
          start: r
        });
      } else if ("/" === t[this._current]) r = this._current, this._current += 1, e.push({
        type: st,
        value: "/",
        start: r
      });else if ("^" === t[this._current]) r = this._current, this._current += 1, e.push({
        type: nt,
        value: "^",
        start: r
      });else {
        if ("|" !== t[this._current]) {
          const _e6 = new Error(`Unknown character:${t[this._current]}`);
          throw _e6.name = "LexerError", _e6;
        }
        r = this._current, this._current += 1, "|" === t[this._current] ? (this._current += 1, e.push({
          type: W,
          value: "||",
          start: r
        })) : e.push({
          type: V,
          value: "|",
          start: r
        });
      }
    }
    return e;
  }
  _consumeUnquotedIdentifier(t) {
    const e = this._current;
    for (this._current += 1; this._current < t.length && Yt(t[this._current]);) this._current += 1;
    return t.slice(e, this._current);
  }
  _consumeQuotedIdentifier(t) {
    const e = this._current;
    this._current += 1;
    const r = t.length;
    let n = !vt(t, e + 1);
    for (; '"' !== t[this._current] && this._current < r;) {
      let _e7 = this._current;
      Yt(t[_e7]) || (n = !0), _e7 += "\\" !== t[_e7] || "\\" !== t[_e7 + 1] && '"' !== t[_e7 + 1] ? 1 : 2, this._current = _e7;
    }
    this._current += 1;
    const s = t.slice(e, this._current);
    try {
      n && !s.includes(" ") || (this.debug.push(`Suspicious quotes: ${s}`), this.debug.push(`Did you intend a literal? '${s.replace(/"/g, "")}'?`));
    } catch (t) {}
    return JSON.parse(s);
  }
  _consumeRawStringLiteral(t) {
    const e = this._current;
    this._current += 1;
    const r = t.length;
    for (; "'" !== t[this._current] && this._current < r;) {
      let _e8 = this._current;
      _e8 += "\\" !== t[_e8] || "\\" !== t[_e8 + 1] && "'" !== t[_e8 + 1] ? 1 : 2, this._current = _e8;
    }
    return this._current += 1, t.slice(e + 1, this._current - 1).replaceAll("\\'", "'");
  }
  _consumeNumber(t) {
    const e = this._current;
    this._current += 1;
    const r = t.length;
    for (; mt(t[this._current], !1) && this._current < r;) this._current += 1;
    const n = t.slice(e, this._current);
    let s;
    return s = n.includes(".") ? parseFloat(n) : parseInt(n, 10), {
      type: J,
      value: s,
      start: e
    };
  }
  _consumeLBracket(t) {
    const e = this._current;
    return this._current += 1, "?" === t[this._current] ? (this._current += 1, {
      type: Tt,
      value: "[?",
      start: e
    }) : "]" === t[this._current] ? (this._current += 1, {
      type: _t,
      value: "[]",
      start: e
    }) : {
      type: yt,
      value: "[",
      start: e
    };
  }
  _isGlobal(t, e, r) {
    if (null !== t && t === Et) return !1;
    if ("$" !== e[r]) return !1;
    let n = r + 1;
    for (; n < e.length && Yt(e[n]);) n += 1;
    const s = e.slice(r, n);
    return this._allowedGlobalNames.includes(s);
  }
  _consumeGlobal(t) {
    const e = this._current;
    for (this._current += 1; this._current < t.length && Yt(t[this._current]);) this._current += 1;
    const r = t.slice(e, this._current);
    return {
      type: z,
      name: r,
      start: e
    };
  }
  _consumeOperator(t) {
    const e = this._current,
      r = t[e];
    return this._current += 1, "!" === r ? "=" === t[this._current] ? (this._current += 1, {
      type: ht,
      value: "!=",
      start: e
    }) : {
      type: ft,
      value: "!",
      start: e
    } : "<" === r ? "=" === t[this._current] ? (this._current += 1, {
      type: lt,
      value: "<=",
      start: e
    }) : {
      type: ct,
      value: "<",
      start: e
    } : ">" === r ? "=" === t[this._current] ? (this._current += 1, {
      type: at,
      value: ">=",
      start: e
    }) : {
      type: ot,
      value: ">",
      start: e
    } : "=" === t[this._current] ? (this._current += 1, {
      type: ut,
      value: "==",
      start: e
    }) : {
      type: ut,
      value: "=",
      start: e
    };
  }
  _consumeLiteral(t) {
    this._current += 1;
    const e = this._current,
      r = t.length;
    let n,
      s = !1;
    for (; (s || "`" !== t[this._current]) && this._current < r;) {
      let _e9 = this._current;
      s && "\\" === t[_e9] && '"' === t[_e9 + 1] ? _e9 += 2 : ('"' === t[_e9] && (s = !s), _e9 += s && "`" === t[_e9 + 1] ? 2 : "\\" !== t[_e9] || "\\" !== t[_e9 + 1] && "`" !== t[_e9 + 1] ? 1 : 2), this._current = _e9;
    }
    let i = t.slice(e, this._current).trimStart();
    return i = i.replaceAll("\\`", "`"), n = function (t) {
      if ("" === t) return !1;
      if ('[{"'.includes(t[0])) return !0;
      if (["true", "false", "null"].includes(t)) return !0;
      if (!"-0123456789".includes(t[0])) return !1;
      try {
        return JSON.parse(t), !0;
      } catch (t) {
        return !1;
      }
    }(i) ? JSON.parse(i) : JSON.parse(`"${i}"`), this._current += 1, n;
  }
}
const {
    TOK_LITERAL: Kt,
    TOK_COLON: It,
    TOK_EOF: St,
    TOK_UNQUOTEDIDENTIFIER: bt,
    TOK_QUOTEDIDENTIFIER: xt,
    TOK_RBRACKET: Ut,
    TOK_RPAREN: Mt,
    TOK_COMMA: wt,
    TOK_CONCATENATE: Lt,
    TOK_RBRACE: Bt,
    TOK_NUMBER: kt,
    TOK_CURRENT: Ct,
    TOK_GLOBAL: jt,
    TOK_FIELD: Dt,
    TOK_EXPREF: Gt,
    TOK_PIPE: Ft,
    TOK_OR: $t,
    TOK_AND: Ht,
    TOK_ADD: Qt,
    TOK_SUBTRACT: Jt,
    TOK_MULTIPLY: qt,
    TOK_POWER: zt,
    TOK_DIVIDE: Xt,
    TOK_UNION: Vt,
    TOK_EQ: Wt,
    TOK_GT: Zt,
    TOK_LT: te,
    TOK_GTE: ee,
    TOK_LTE: re,
    TOK_NE: ne,
    TOK_FLATTEN: se,
    TOK_STAR: ie,
    TOK_FILTER: ue,
    TOK_DOT: oe,
    TOK_NOT: ce,
    TOK_LBRACE: ae,
    TOK_LBRACKET: le,
    TOK_LPAREN: he
  } = e,
  _e = {
    [St]: 0,
    [bt]: 0,
    [xt]: 0,
    [Ut]: 0,
    [Mt]: 0,
    [wt]: 0,
    [Bt]: 0,
    [kt]: 0,
    [Ct]: 0,
    [jt]: 0,
    [Dt]: 0,
    [Gt]: 0,
    [Ft]: 1,
    [$t]: 2,
    [Ht]: 3,
    [Qt]: 6,
    [Jt]: 6,
    [Lt]: 7,
    [qt]: 7,
    [Xt]: 7,
    [zt]: 7,
    [Vt]: 7,
    [Wt]: 5,
    [Zt]: 5,
    [te]: 5,
    [ee]: 5,
    [re]: 5,
    [ne]: 5,
    [se]: 9,
    [ie]: 20,
    [ue]: 21,
    [oe]: 40,
    [ce]: 45,
    [ae]: 50,
    [le]: 55,
    [he]: 60
  };
class pe {
  constructor(t = []) {
    this._allowedGlobalNames = t;
  }
  parse(t, e) {
    this._loadTokens(t, e), this.index = 0;
    const r = this.expression(0);
    if (this._lookahead(0) !== St) {
      const _t10 = this._lookaheadToken(0),
        _e10 = new Error(`Unexpected token type: ${_t10.type}, value: ${_t10.value}`);
      throw _e10.name = "ParserError", _e10;
    }
    return r;
  }
  _loadTokens(t, e) {
    const r = new At(this._allowedGlobalNames, e).tokenize(t);
    r.push({
      type: St,
      value: "",
      start: t.length
    }), this.tokens = r;
  }
  expression(t) {
    const e = this._lookaheadToken(0);
    this._advance();
    let r = this.nud(e),
      n = this._lookahead(0);
    for (; t < _e[n];) this._advance(), r = this.led(n, r), n = this._lookahead(0);
    return r;
  }
  _lookahead(t) {
    return this.tokens[this.index + t].type;
  }
  _lookaheadToken(t) {
    return this.tokens[this.index + t];
  }
  _advance() {
    this.index += 1;
  }
  _getIndex() {
    return this.index;
  }
  _setIndex(t) {
    this.index = t;
  }
  nud(t) {
    let e, r, n, s, i;
    switch (t.type) {
      case Kt:
        return {
          type: "Literal",
          value: t.value
        };
      case kt:
        return {
          type: "Number",
          value: t.value
        };
      case bt:
        return {
          type: "Field",
          name: t.value
        };
      case xt:
        if (s = {
          type: "Field",
          name: t.value
        }, this._lookahead(0) === he) throw new Error("Quoted identifier not allowed for function names.");
        return s;
      case ce:
        return r = this.expression(_e.Not), {
          type: "NotExpression",
          children: [r]
        };
      case ie:
        return e = {
          type: "Identity"
        }, r = this._lookahead(0) === Ut ? {
          type: "Identity"
        } : this._parseProjectionRHS(_e.Star), {
          type: "ValueProjection",
          children: [e, r]
        };
      case ue:
        return this.led(t.type, {
          type: "Identity"
        });
      case ae:
        return this._parseMultiselectHash();
      case se:
        return e = {
          type: se,
          children: [{
            type: "Identity"
          }]
        }, r = this._parseProjectionRHS(_e.Flatten), {
          type: "Projection",
          children: [e, r]
        };
      case le:
        return this._lookahead(0) === ie && this._lookahead(1) === Ut ? (this._advance(), this._advance(), r = this._parseProjectionRHS(_e.Star), {
          type: "Projection",
          children: [{
            type: "Identity"
          }, r]
        }) : this._parseUnchainedIndexExpression();
      case Ct:
        return {
          type: Ct
        };
      case jt:
        return {
          type: jt,
          name: t.name
        };
      case Dt:
        return {
          type: Dt
        };
      case Gt:
        return n = this.expression(_e.Expref), {
          type: "ExpressionReference",
          children: [n]
        };
      case he:
        for (i = []; this._lookahead(0) !== Mt;) n = this.expression(0), i.push(n);
        return this._match(Mt), i[0];
      default:
        this._errorToken(t);
    }
  }
  led(t, e) {
    let r, n, s, i, u, o, c, a, l;
    switch (t) {
      case Lt:
        return n = this.expression(_e.Concatenate), {
          type: "ConcatenateExpression",
          children: [e, n]
        };
      case oe:
        return c = _e.Dot, this._lookahead(0) !== ie ? (n = this._parseDotRHS(c), {
          type: "Subexpression",
          children: [e, n]
        }) : (this._advance(), n = this._parseProjectionRHS(c), {
          type: "ValueProjection",
          children: [e, n]
        });
      case Ft:
        return n = this.expression(_e.Pipe), {
          type: Ft,
          children: [e, n]
        };
      case $t:
        return n = this.expression(_e.Or), {
          type: "OrExpression",
          children: [e, n]
        };
      case Ht:
        return n = this.expression(_e.And), {
          type: "AndExpression",
          children: [e, n]
        };
      case Qt:
        return n = this.expression(_e.Add), {
          type: "AddExpression",
          children: [e, n]
        };
      case Jt:
        return n = this.expression(_e.Subtract), {
          type: "SubtractExpression",
          children: [e, n]
        };
      case qt:
        return n = this.expression(_e.Multiply), {
          type: "MultiplyExpression",
          children: [e, n]
        };
      case Xt:
        return n = this.expression(_e.Divide), {
          type: "DivideExpression",
          children: [e, n]
        };
      case zt:
        return n = this.expression(_e.Power), {
          type: "PowerExpression",
          children: [e, n]
        };
      case Vt:
        return n = this.expression(_e.Power), {
          type: "UnionExpression",
          children: [e, n]
        };
      case he:
        for (s = e.name, i = []; this._lookahead(0) !== Mt;) u = this.expression(0), this._lookahead(0) === wt && this._match(wt), i.push(u);
        return this._match(Mt), o = {
          type: "Function",
          name: s,
          children: i
        }, o;
      case ue:
        return r = this.expression(0), this._match(Ut), n = this._lookahead(0) === se ? {
          type: "Identity"
        } : this._parseProjectionRHS(_e.Filter), {
          type: "FilterProjection",
          children: [e, n, r]
        };
      case se:
        return a = {
          type: se,
          children: [e]
        }, l = this._parseProjectionRHS(_e.Flatten), {
          type: "Projection",
          children: [a, l]
        };
      case Wt:
      case ne:
      case Zt:
      case ee:
      case te:
      case re:
        return this._parseComparator(e, t);
      case le:
        return this._lookahead(0) === ie && this._lookahead(1) === Ut ? (this._advance(), this._advance(), n = this._parseProjectionRHS(_e.Star), {
          type: "Projection",
          children: [e, n]
        }) : (n = this._parseChainedIndexExpression(), this._projectIfSlice(e, n));
      default:
        this._errorToken(this._lookaheadToken(0));
    }
  }
  _match(t) {
    if (this._lookahead(0) !== t) {
      const e = this._lookaheadToken(0),
        r = new Error(`Expected ${t}, got: ${e.type}`);
      throw r.name = "ParserError", r;
    }
    this._advance();
  }
  _errorToken(t) {
    const e = new Error(`Invalid token (${t.type}): "${t.value}"`);
    throw e.name = "ParserError", e;
  }
  _parseChainedIndexExpression() {
    const t = this._getIndex();
    if (this._lookahead(0) === It) return this._parseSliceExpression();
    const e = this.expression(0);
    return this._lookahead(0) === It ? (this._setIndex(t), this._parseSliceExpression()) : (this._match(Ut), {
      type: "Index",
      value: e
    });
  }
  _parseUnchainedIndexExpression() {
    const t = this._getIndex(),
      e = this._lookahead(0);
    if (e === It) {
      const _t11 = this._parseSliceExpression();
      return this._projectIfSlice({
        type: "Identity"
      }, _t11);
    }
    const r = this.expression(0),
      n = this._lookahead(0);
    if (n === wt) return this._setIndex(t), this._parseMultiselectList();
    if (n === It) {
      this._setIndex(t);
      const _e11 = this._parseSliceExpression();
      return this._projectIfSlice({
        type: "Identity"
      }, _e11);
    }
    return e === kt ? (this._match(Ut), {
      type: "Index",
      value: r
    }) : (this._setIndex(t), this._parseMultiselectList());
  }
  _projectIfSlice(t, e) {
    const r = {
      type: "IndexExpression",
      children: [t, e]
    };
    return "Slice" === e.type ? {
      type: "Projection",
      children: [r, this._parseProjectionRHS(_e.Star)]
    } : r;
  }
  _parseSliceExpression() {
    const t = [null, null, null];
    let e = 0,
      r = this._lookahead(0);
    for (; r !== Ut && e < 3;) {
      if (r === It && e < 2) e += 1, this._advance();else {
        t[e] = this.expression(0);
        const _r3 = this._lookahead(0);
        if (_r3 !== It && _r3 !== Ut) {
          const _t12 = new Error(`Syntax error, unexpected token: ${_r3.value}(${_r3.type})`);
          throw _t12.name = "Parsererror", _t12;
        }
      }
      r = this._lookahead(0);
    }
    return this._match(Ut), {
      type: "Slice",
      children: t
    };
  }
  _parseComparator(t, e) {
    return {
      type: "Comparator",
      name: e,
      children: [t, this.expression(_e[e])]
    };
  }
  _parseDotRHS(t) {
    const e = this._lookahead(0);
    return [bt, xt, ie].indexOf(e) >= 0 ? this.expression(t) : e === le ? (this._match(le), this._parseMultiselectList()) : e === ae ? (this._match(ae), this._parseMultiselectHash()) : void 0;
  }
  _parseProjectionRHS(t) {
    let e;
    if (_e[this._lookahead(0)] < 10) e = {
      type: "Identity"
    };else if (this._lookahead(0) === le) e = this.expression(t);else if (this._lookahead(0) === ue) e = this.expression(t);else {
      if (this._lookahead(0) !== oe) {
        const _t13 = this._lookaheadToken(0),
          _e12 = new Error(`Sytanx error, unexpected token: ${_t13.value}(${_t13.type})`);
        throw _e12.name = "ParserError", _e12;
      }
      this._match(oe), e = this._parseDotRHS(t);
    }
    return e;
  }
  _parseMultiselectList() {
    const t = [];
    for (; this._lookahead(0) !== Ut;) {
      const e = this.expression(0);
      if (t.push(e), this._lookahead(0) === wt && (this._match(wt), this._lookahead(0) === Ut)) throw new Error("Unexpected token Rbracket");
    }
    return this._match(Ut), {
      type: "MultiSelectList",
      children: t
    };
  }
  _parseMultiselectHash() {
    const t = [],
      e = [bt, xt];
    let r, n, s, i;
    if (this._lookahead(0) === Bt) return this._advance(), {
      type: "MultiSelectHash",
      children: []
    };
    for (;;) {
      if (r = this._lookaheadToken(0), e.indexOf(r.type) < 0) throw new Error(`Expecting an identifier token, got: ${r.type}`);
      if (n = r.value, this._advance(), this._match(It), s = this.expression(0), i = {
        type: "KeyValuePair",
        name: n,
        value: s
      }, t.push(i), this._lookahead(0) === wt) this._match(wt);else if (this._lookahead(0) === Bt) {
        this._match(Bt);
        break;
      }
    }
    return {
      type: "MultiSelectHash",
      children: t
    };
  }
}
function Te(t, e) {
  const r = 10 ** e;
  return Math.round(t * r) / r;
}
function Ee(e, r, n, s = []) {
  return {
    casefold: {
      _func: (t, e, n) => r(t[0]).toLocaleUpperCase(n.language).toLocaleLowerCase(n.language),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    and: {
      _func: t => {
        let r = !!e(t[0]);
        return t.slice(1).forEach(t => {
          r = r && !!e(t);
        }), r;
      },
      _signature: [{
        types: [t.TYPE_ANY],
        variadic: !0
      }]
    },
    deepScan: {
      _func: t => {
        const [e, r] = t,
          n = r.toString(),
          s = [];
        return null === e || function t(e) {
          Object.entries(e).forEach(([e, r]) => {
            e === n && s.push(r), "object" == typeof r && t(r);
          });
        }(e), s;
      },
      _signature: [{
        types: [t.TYPE_OBJECT, t.TYPE_ARRAY, t.TYPE_NULL]
      }, {
        types: [t.TYPE_STRING, t.TYPE_NUMBER]
      }]
    },
    or: {
      _func: t => {
        let r = !!e(t[0]);
        return t.slice(1).forEach(t => {
          r = r || !!e(t);
        }), r;
      },
      _signature: [{
        types: [t.TYPE_ANY],
        variadic: !0
      }]
    },
    not: {
      _func: t => !e(t[0]),
      _signature: [{
        types: [t.TYPE_ANY]
      }]
    },
    null: {
      _func: () => null,
      _signature: []
    },
    true: {
      _func: () => !0,
      _signature: []
    },
    false: {
      _func: () => !1,
      _signature: []
    },
    if: {
      _func: (t, r, n) => {
        const s = t[1],
          i = t[2],
          u = n.visit(t[0], r);
        return e(u) ? n.visit(s, r) : n.visit(i, r);
      },
      _signature: [{
        types: [t.TYPE_ANY]
      }, {
        types: [t.TYPE_ANY]
      }, {
        types: [t.TYPE_ANY]
      }]
    },
    substitute: {
      _func: t => {
        const e = r(t[0]),
          s = r(t[1]),
          i = r(t[2]);
        if (t.length <= 3) return e.replaceAll(s, i);
        const u = n(t[3]);
        if (u < 1) return e;
        let o = -1;
        for (let _t14 = 0; _t14 < u; _t14 += 1) {
          o += 1;
          const _t15 = e.slice(o).indexOf(s);
          if (-1 === _t15) return e;
          o += _t15;
        }
        return e.slice(0, o) + e.slice(o).replace(s, i);
      },
      _signature: [{
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }]
    },
    value: {
      _func: t => {
        const e = t[0] || {},
          r = t[1],
          n = e[r];
        if (void 0 === n) {
          s.push(`Failed to find: '${r}'`);
          const _t16 = Object.keys(e).map(t => `'${t}'`).toString();
          return _t16.length && s.push(`Available fields: ${_t16}`), null;
        }
        return n;
      },
      _signature: [{
        types: [t.TYPE_OBJECT, t.TYPE_ARRAY, t.TYPE_NULL]
      }, {
        types: [t.TYPE_STRING, t.TYPE_NUMBER]
      }]
    },
    lower: {
      _func: t => r(t[0]).toLowerCase(),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    upper: {
      _func: t => r(t[0]).toUpperCase(),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    exp: {
      _func: t => {
        const e = n(t[0]);
        return Math.exp(e);
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    power: {
      _func: t => n(t[0]) ** n(t[1]),
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    find: {
      _func: t => {
        const e = r(t[0]),
          s = r(t[1]),
          i = t.length > 2 ? n(t[2]) : 0,
          u = s.indexOf(e, i);
        return -1 === u ? null : u;
      },
      _signature: [{
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }]
    },
    left: {
      _func: t => {
        const e = t.length > 1 ? n(t[1]) : 1;
        return e < 0 ? null : t[0] instanceof Array ? t[0].slice(0, e) : r(t[0]).substr(0, e);
      },
      _signature: [{
        types: [t.TYPE_STRING, t.TYPE_ARRAY]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }]
    },
    right: {
      _func: t => {
        const e = t.length > 1 ? n(t[1]) : 1;
        if (e < 0) return null;
        if (t[0] instanceof Array) return 0 === e ? [] : t[0].slice(-1 * e);
        const s = r(t[0]);
        return s.substr(s.length - e, e);
      },
      _signature: [{
        types: [t.TYPE_STRING, t.TYPE_ARRAY]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }]
    },
    mid: {
      _func: t => {
        const e = n(t[1]),
          s = n(t[2]);
        return e < 0 ? null : t[0] instanceof Array ? t[0].slice(e, e + s) : r(t[0]).substr(e, s);
      },
      _signature: [{
        types: [t.TYPE_STRING, t.TYPE_ARRAY]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    mod: {
      _func: t => n(t[0]) % n(t[1]),
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    proper: {
      _func: t => r(t[0]).split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(" "),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    rept: {
      _func: t => {
        const e = r(t[0]),
          s = n(t[1]);
        return s < 0 ? null : e.repeat(s);
      },
      _signature: [{
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    replace: {
      _func: t => {
        const e = r(t[0]),
          s = n(t[1]),
          i = n(t[2]),
          u = r(t[3]);
        return s < 0 ? null : e.substr(0, s) + u + e.substr(s + i);
      },
      _signature: [{
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_STRING]
      }]
    },
    round: {
      _func: t => Te(n(t[0]), n(t[1])),
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    sqrt: {
      _func: t => {
        const e = Math.sqrt(n(t[0]));
        return Number.isNaN(e) ? null : e;
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    stdevp: {
      _func: t => {
        const e = t[0] || [];
        if (0 === e.length) return null;
        const r = e.map(t => n(t)),
          s = r.reduce((t, e) => t + e, 0) / e.length,
          i = r.reduce((t, e) => t + e * e, 0) / e.length,
          u = Math.sqrt(i - s * s);
        return Number.isNaN(u) ? null : u;
      },
      _signature: [{
        types: [t.TYPE_ARRAY_NUMBER]
      }]
    },
    stdev: {
      _func: t => {
        const e = t[0] || [];
        if (e.length <= 1) return null;
        const r = e.map(t => n(t)),
          s = r.reduce((t, e) => t + e, 0) / e.length,
          i = r.reduce((t, e) => t + e * e, 0),
          u = Math.sqrt((i - e.length * s * s) / (e.length - 1));
        return Number.isNaN(u) ? null : u;
      },
      _signature: [{
        types: [t.TYPE_ARRAY_NUMBER]
      }]
    },
    trim: {
      _func: t => r(t[0]).split(" ").filter(t => t).join(" "),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    trunc: {
      _func: t => {
        const e = n(t[0]),
          r = t.length > 1 ? n(t[1]) : 0;
        return (e >= 0 ? Math.floor : Math.ceil)(e * 10 ** r) / 10 ** r;
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }]
    },
    charCode: {
      _func: t => {
        const e = n(t[0]);
        return Number.isInteger(e) ? String.fromCharCode(e) : null;
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    codePoint: {
      _func: t => {
        const e = r(t[0]);
        return 0 === e.length ? null : e.codePointAt(0);
      },
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    datetime: {
      _func: t => {
        const e = n(t[0]),
          s = n(t[1]),
          i = n(t[2]),
          u = t.length > 3 ? n(t[3]) : 0,
          o = t.length > 4 ? n(t[4]) : 0,
          c = t.length > 5 ? n(t[5]) : 0,
          a = t.length > 6 ? n(t[6]) : 0,
          l = t.length > 7 ? r(t[7]) : null;
        let h = new Date(e, s - 1, i, u, o, c, a);
        return l && (h = function (t, e) {
          if (null === t) return null;
          let r = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds());
          return r += function (t, e) {
            const r = new Intl.DateTimeFormat("en-US", {
                timeZone: e,
                timeZoneName: "longOffset"
              }).format(t),
              n = /GMT([+\-−])?(\d{1,2}):?(\d{0,2})?/.exec(r);
            if (!n) return 0;
            const [s, i, u] = n.slice(1),
              o = 60 * (60 * (i || 0) + 1 * (u || 0)) * 1e3;
            return "-" === s ? -1 * o : o;
          }(t, e), new Date(r);
        }(h, l)), h.getTime() / 864e5;
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }, {
        types: [t.TYPE_STRING],
        optional: !0
      }]
    },
    datedif: {
      _func: t => {
        const e = n(t[0]),
          s = n(t[1]),
          i = r(t[2]).toLowerCase();
        if (s === e) return 0;
        if (s < e) return null;
        if ("d" === i) return Math.floor(s - e);
        const u = new Date(864e5 * e),
          o = new Date(864e5 * s),
          c = o.getFullYear() - u.getFullYear();
        let a = o.getMonth() - u.getMonth();
        const l = o.getDate() - u.getDate();
        if ("y" === i) {
          let _t17 = c;
          return a < 0 && (_t17 -= 1), 0 === a && l < 0 && (_t17 -= 1), _t17;
        }
        if ("m" === i) return 12 * c + a + (l < 0 ? -1 : 0);
        if ("ym" === i) return l < 0 && (a -= 1), a <= 0 && c > 0 ? 12 + a : a;
        if ("yd" === i) return l < 0 && (a -= 1), o.setFullYear(a < 0 ? u.getFullYear() + 1 : u.getFullYear()), Math.floor((o.getTime() - u.getTime()) / 864e5);
        throw new TypeError(`Unrecognized unit parameter "${i}" for datedif()`);
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_STRING]
      }]
    },
    eomonth: {
      _func: t => {
        const e = n(t[0]),
          r = n(t[1]),
          s = new Date(864e5 * e);
        return new Date(s.getFullYear(), s.getMonth() + r + 1, 0).getTime() / 864e5;
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    day: {
      _func: t => {
        const e = n(t[0]);
        return new Date(864e5 * e).getDate();
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    month: {
      _func: t => {
        const e = n(t[0]);
        return new Date(864e5 * e).getMonth() + 1;
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    year: {
      _func: t => {
        const e = n(t[0]);
        return new Date(864e5 * e).getFullYear();
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    time: {
      _func: t => {
        const e = (3600 * n(t[0]) + 60 * n(t[1]) + n(t[2])) / 86400;
        return e < 0 ? null : e - Math.floor(e);
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER]
      }]
    },
    hour: {
      _func: t => {
        const e = n(t[0]) % 1;
        if (e < 0) return null;
        const r = Te(24 * e, 14);
        return Math.floor(r % 24);
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    minute: {
      _func: t => {
        const e = n(t[0]) % 1;
        if (e < 0) return null;
        const r = Math.round(1440 * e, 10);
        return Math.floor(r % 60);
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    second: {
      _func: t => {
        const e = n(t[0]) % 1;
        if (e < 0) return null;
        const r = Te(86400 * e, 10);
        return Math.floor(r % 60);
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }]
    },
    now: {
      _func: () => Date.now() / 864e5,
      _signature: []
    },
    today: {
      _func: () => Math.floor(Date.now() / 864e5),
      _signature: []
    },
    weekday: {
      _func: t => {
        const e = n(t[0]),
          r = t.length > 1 ? n(t[1]) : 1,
          s = new Date(864e5 * e).getDay();
        switch (r) {
          case 1:
            return s + 1;
          case 2:
            return (s + 6) % 7 + 1;
          case 3:
            return (s + 6) % 7;
          default:
            return null;
        }
      },
      _signature: [{
        types: [t.TYPE_NUMBER]
      }, {
        types: [t.TYPE_NUMBER],
        optional: !0
      }]
    },
    entries: {
      _func: t => {
        const r = e(t[0]);
        return Object.entries(r);
      },
      _signature: [{
        types: [t.TYPE_NUMBER, t.TYPE_STRING, t.TYPE_ARRAY, t.TYPE_OBJECT, t.TYPE_BOOLEAN]
      }]
    },
    fromEntries: {
      _func: t => Object.fromEntries(t[0]),
      _signature: [{
        types: [t.TYPE_ARRAY_ARRAY]
      }]
    },
    split: {
      _func: t => {
        const e = r(t[0]),
          n = r(t[1]);
        return e.split(n);
      },
      _signature: [{
        types: [t.TYPE_STRING]
      }, {
        types: [t.TYPE_STRING]
      }]
    },
    unique: {
      _func: t => {
        const r = t[0].map(t => e(t));
        return t[0].filter((t, n) => r.indexOf(e(t)) === n);
      },
      _signature: [{
        types: [t.TYPE_ARRAY]
      }]
    },
    encodeUrlComponent: {
      _func: t => encodeURIComponent(t[0]),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    encodeUrl: {
      _func: t => encodeURI(t[0]),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    decodeUrlComponent: {
      _func: t => decodeURIComponent(t[0]),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    },
    decodeUrl: {
      _func: t => decodeURI(t[0]),
      _signature: [{
        types: [t.TYPE_STRING]
      }]
    }
  };
}
function fe(e, r, n, s, i, u, o) {
  const {
    TYPE_NUMBER: c,
    TYPE_ANY: a,
    TYPE_STRING: l,
    TYPE_ARRAY: h,
    TYPE_OBJECT: _,
    TYPE_BOOLEAN: p,
    TYPE_EXPREF: T,
    TYPE_NULL: E,
    TYPE_ARRAY_NUMBER: f,
    TYPE_ARRAY_STRING: d
  } = t;
  function y(t, r) {
    return n => {
      const s = e.visit(t, n);
      if (r.indexOf(i(s)) < 0) {
        const t = `TypeError: expected one of ${r}, received ${i(s)}`;
        throw new Error(t);
      }
      return s;
    };
  }
  return {
    abs: {
      _func: t => Math.abs(t[0]),
      _signature: [{
        types: [c]
      }]
    },
    avg: {
      _func: t => {
        let e = 0;
        const r = t[0];
        return r.forEach(t => {
          e += t;
        }), e / r.length;
      },
      _signature: [{
        types: [f]
      }]
    },
    ceil: {
      _func: t => Math.ceil(t[0]),
      _signature: [{
        types: [c]
      }]
    },
    contains: {
      _func: t => u(t[0]).indexOf(u(t[1])) >= 0,
      _signature: [{
        types: [l, h]
      }, {
        types: [a]
      }]
    },
    endsWith: {
      _func: t => {
        const e = u(t[0]),
          r = u(t[1]);
        return -1 !== e.indexOf(r, e.length - r.length);
      },
      _signature: [{
        types: [l]
      }, {
        types: [l]
      }]
    },
    floor: {
      _func: t => Math.floor(t[0]),
      _signature: [{
        types: [c]
      }]
    },
    length: {
      _func: t => {
        const e = u(t[0]);
        return r(e) ? Object.keys(e).length : n(e) ? e.length : o(e).length;
      },
      _signature: [{
        types: [l, h, _]
      }]
    },
    map: {
      _func: t => {
        const r = t[0];
        return t[1].map(t => e.visit(r, t));
      },
      _signature: [{
        types: [T]
      }, {
        types: [h]
      }]
    },
    reduce: {
      _func: t => {
        const r = t[0];
        return t[1].reduce((t, n, s, i) => e.visit(r, {
          accumulated: t,
          current: n,
          index: s,
          array: i
        }), 3 === t.length ? t[2] : null);
      },
      _signature: [{
        types: [T]
      }, {
        types: [h]
      }, {
        types: [a],
        optional: !0
      }]
    },
    max: {
      _func: t => {
        if (t[0].length > 0) {
          const e = i(t[0][0]);
          return t[0].reduce(e === c ? (t, e) => s(t) >= s(e) ? t : e : (t, e) => o(e).localeCompare(o(t)) < 0 ? t : e, t[0][0]);
        }
        return null;
      },
      _signature: [{
        types: [h, f, d]
      }]
    },
    merge: {
      _func: t => {
        const e = {};
        return t.forEach(t => {
          Object.entries(t).forEach(([t, r]) => {
            e[t] = r;
          });
        }), e;
      },
      _signature: [{
        types: [_],
        variadic: !0
      }]
    },
    maxBy: {
      _func: t => {
        const e = t[0],
          r = y(t[1], [c, l]);
        let n,
          s,
          i = -Infinity;
        return e.forEach(t => {
          s = r(t), s > i && (i = s, n = t);
        }), n;
      },
      _signature: [{
        types: [h]
      }, {
        types: [T]
      }]
    },
    sum: {
      _func: t => {
        let e = 0;
        return t[0].forEach(t => {
          e += 1 * t;
        }), e;
      },
      _signature: [{
        types: [f]
      }]
    },
    startsWith: {
      _func: t => u(t[0]).startsWith(u(t[1])),
      _signature: [{
        types: [l]
      }, {
        types: [l]
      }]
    },
    min: {
      _func: t => {
        if (t[0].length > 0) {
          if (i(t[0][0]) === c) return t[0].reduce((t, e) => s(t) <= s(e) ? t : e, t[0][0]);
          const e = t[0];
          let r = e[0];
          for (let _t18 = 1; _t18 < e.length; _t18 += 1) o(e[_t18]).localeCompare(o(r)) < 0 && (r = e[_t18]);
          return r;
        }
        return null;
      },
      _signature: [{
        types: [h, f, d]
      }]
    },
    minBy: {
      _func: t => {
        const e = t[0],
          r = y(t[1], [c, l]);
        let n,
          s,
          i = Infinity;
        return e.forEach(t => {
          s = r(t), s < i && (i = s, n = t);
        }), n;
      },
      _signature: [{
        types: [h]
      }, {
        types: [T]
      }]
    },
    type: {
      _func: t => ({
        [c]: "number",
        [l]: "string",
        [h]: "array",
        [_]: "object",
        [p]: "boolean",
        [T]: "expref",
        [E]: "null"
      })[i(t[0])],
      _signature: [{
        types: [a]
      }]
    },
    keys: {
      _func: t => null === t[0] ? [] : Object.keys(t[0]),
      _signature: [{
        types: [a]
      }]
    },
    values: {
      _func: t => {
        const e = u(t[0]);
        return null === e ? [] : Object.values(e);
      },
      _signature: [{
        types: [a]
      }]
    },
    sort: {
      _func: t => {
        const e = t[0].slice(0);
        if (e.length > 0) {
          const r = i(t[0][0]) === c ? s : o;
          e.sort((t, e) => {
            const n = r(t),
              s = r(e);
            return n < s ? -1 : n > s ? 1 : 0;
          });
        }
        return e;
      },
      _signature: [{
        types: [h, d, f]
      }]
    },
    sortBy: {
      _func: t => {
        const r = t[0].slice(0);
        if (0 === r.length) return r;
        const n = t[1],
          s = i(e.visit(n, r[0]));
        if ([c, l].indexOf(s) < 0) throw new Error("TypeError");
        const u = [];
        for (let _t19 = 0; _t19 < r.length; _t19 += 1) u.push([_t19, r[_t19]]);
        u.sort((t, r) => {
          const u = e.visit(n, t[1]),
            o = e.visit(n, r[1]);
          if (i(u) !== s) throw new Error(`TypeError: expected ${s}, received ${i(u)}`);
          if (i(o) !== s) throw new Error(`TypeError: expected ${s}, received ${i(o)}`);
          return u > o ? 1 : u < o ? -1 : t[0] - r[0];
        });
        for (let _t20 = 0; _t20 < u.length; _t20 += 1) [, r[_t20]] = u[_t20];
        return r;
      },
      _signature: [{
        types: [h]
      }, {
        types: [T]
      }]
    },
    join: {
      _func: t => t[1].join(t[0]),
      _signature: [{
        types: [l]
      }, {
        types: [d]
      }]
    },
    reverse: {
      _func: t => {
        const e = u(t[0]);
        if (i(e) === l) {
          let _t21 = "";
          for (let _r4 = e.length - 1; _r4 >= 0; _r4 -= 1) _t21 += e[_r4];
          return _t21;
        }
        const r = t[0].slice(0);
        return r.reverse(), r;
      },
      _signature: [{
        types: [l, h]
      }]
    },
    toArray: {
      _func: t => i(t[0]) === h ? t[0] : [t[0]],
      _signature: [{
        types: [a]
      }]
    },
    toString: {
      _func: t => i(t[0]) === l ? t[0] : JSON.stringify(t[0]),
      _signature: [{
        types: [a]
      }]
    },
    toNumber: {
      _func: t => {
        const e = i(t[0]);
        return e === c ? t[0] : e === l ? s(t[0]) : null;
      },
      _signature: [{
        types: [a]
      }]
    },
    notNull: {
      _func: t => t.find(t => i(t) !== E) || null,
      _signature: [{
        types: [a],
        variadic: !0
      }]
    },
    zip: {
      _func: t => {
        const e = t.reduce((t, e) => Math.min(t, e.length), t[0].length),
          r = new Array(e);
        for (let n = 0; n < e; n += 1) r[n] = [], t.forEach(t => {
          r[n].push(t[n]);
        });
        return r;
      },
      _signature: [{
        types: [h],
        variadic: !0
      }]
    }
  };
}
const {
  TYPE_CLASS: de,
  TYPE_ANY: ye
} = t;
var ge = new function () {
  let t;
  function e(t) {
    return null == t ? "" : t.toString();
  }
  class r {
    addFunctions(r, n = {}) {
      this.functionTable = _extends$1({}, fe(this._interpreter, O, g, t, f, R, e), Ee(R, e, t, r), n);
    }
    _validateArgs(r, n, s, i) {
      if (0 === s.length) return;
      let u;
      const o = s.filter(t => !t.optional).length;
      if (s[s.length - 1].variadic) {
        if (n.length < s.length) throw u = 1 === s.length ? " argument" : " arguments", new Error(`ArgumentError: ${r}() takes at least${s.length}${u} but received ${n.length}`);
      } else if (n.length < o || n.length > s.length) throw u = 1 === s.length ? " argument" : " arguments", new Error(`ArgumentError: ${r}() takes ${s.length}${u} but received ${n.length}`);
      if (!i) return;
      let c, a;
      const l = Math.min(s.length, n.length);
      for (let _i = 0; _i < l; _i += 1) c = s[_i].types, h = n[_i], _ = void 0, c.includes(de) && null !== (_ = h) && !Array.isArray(_) && "Object" !== _.constructor.name || c.includes(ye) || (a = d(n[_i]), n[_i] = y(a, c, n[_i], r, t, e));
      var h, _;
    }
    callFunction(t, e, r, n, s = !0) {
      if (!Object.prototype.hasOwnProperty.call(this.functionTable, t)) throw new Error(`Unknown function: ${t}()`);
      const i = this.functionTable[t];
      return this._validateArgs(t, e, i._signature, s), i._func.call(this, e, r, n);
    }
  }
  this.compile = function (t, e = [], r = []) {
    let n;
    try {
      n = new pe(e).parse(t, r);
    } catch (t) {
      throw r.push(t.toString()), t;
    }
    return n;
  }, this.search = function (n, s, i, u, o, c = [], a = "en-US") {
    const l = new r(u);
    l.debug = c, t = function (t, e = []) {
      return r => {
        const n = R(r);
        if (null === n) return null;
        if (n instanceof Array) return e.push("Converted array to zero"), 0;
        const s = typeof n;
        return "number" === s ? n : "string" === s ? t(n, e) : "boolean" === s ? n ? 1 : 0 : (e.push("Converted object to zero"), 0);
      };
    }(o || (t => {
      const e = +t;
      return Number.isNaN(e) ? 0 : e;
    }), c);
    const h = new k(l, i, t, e, c, a);
    l._interpreter = h, l.addFunctions(c, u);
    try {
      return h.search(n, s);
    } catch (t) {
      throw c.push(t.message || t.toString()), t;
    }
  }, this.strictDeepEqual = N;
}();
class Oe {
  constructor(t, e = {}, r = null, n = [], s = [], i = "en-US") {
    this.expression = t, this.customFunctions = e, this.stringToNumber = r, this.node = ge.compile(t, n, s), this.debug = s, this.language = i;
  }
  search(t, e) {
    return ge.search(this.node, t, e, _extends$1({}, this.customFunctions), this.stringToNumber, this.debug, this.language);
  }
}
console.timeEnd("script json-formula");

console.time("script af-core");
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Implementation of {@link IValidationError | Validation Error} interface
 */
class ValidationError {
  constructor(fieldName = '', errorMessages = []) {
    this.errorMessages = errorMessages;
    this.fieldName = fieldName;
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// const primitives = ['string', 'boolean', 'number'];
// const containers = ['object', 'array', 'number'];
const objToMap = o => new Map(Object.entries(o));
const stringViewTypes = objToMap({
  'date': 'date-input',
  'data-url': 'file-input',
  'binary': 'file-input'
});
const typeToViewTypes = objToMap({
  'number': 'number-input',
  'boolean': 'checkbox',
  'object': 'panel',
  'array': 'panel',
  'file': 'file-input',
  'file[]': 'file-input'
});
const arrayTypes = ['string[]', 'boolean[]', 'number[]', 'array'];
/**
 * Returns the default view type for a given form field object based on `adaptive form specification`
 * @param schema    schema item for which default view type is to found
 * @returns default view type
 */
const defaultFieldTypes = schema => {
  const type = schema.type || 'string';
  if ('enum' in schema) {
    const enums = schema.enum;
    if (enums.length > 2 || arrayTypes.indexOf(type) > -1) {
      return 'drop-down';
    } else {
      return 'checkbox';
    }
  }
  if (type === 'string' || type === 'string[]') {
    return stringViewTypes.get(schema.format) || 'text-input';
  }
  return typeToViewTypes.get(type) || 'text-input';
};

/**
 * Get the property value form the json
 * @param data      object as json
 * @param key       name of the key
 * @param def       default value
 * @typeParam P     type for the default value
 */
const getProperty = (data, key, def) => {
  if (key in data) {
    return data[key];
  } else if (!key.startsWith(':')) {
    const prefixedKey = `:${key}`;
    if (prefixedKey in data) {
      return data[prefixedKey];
    }
  }
  return def;
};
/**
 * Checks if the input item provided is a form file attachment field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form file attachment, `false` otherwise
 */
const isFile = function isFile(item) {
  return (item == null ? void 0 : item.type) === 'file' || (item == null ? void 0 : item.type) === 'file[]' || ((item == null ? void 0 : item.type) === 'string' || (item == null ? void 0 : item.type) === 'string[]') && ((item == null ? void 0 : item.format) === 'binary' || (item == null ? void 0 : item.format) === 'data-url');
};
/**
 * Checks if the input item provided is a form check box field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form check box, `false` otherwise
 */
const isCheckbox = function isCheckbox(item) {
  const fieldType = (item == null ? void 0 : item.fieldType) || defaultFieldTypes(item);
  return fieldType === 'checkbox';
};
/**
 * Checks if the input item provided is a form check box group field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form check box group, `false` otherwise
 */
const isCheckboxGroup = function isCheckboxGroup(item) {
  const fieldType = (item == null ? void 0 : item.fieldType) || defaultFieldTypes(item);
  return fieldType === 'checkbox-group';
};
/**
 * Checks if the input item provided is a date field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form check box group, `false` otherwise
 */
const isDateField = function isDateField(item) {
  const fieldType = (item == null ? void 0 : item.fieldType) || defaultFieldTypes(item);
  return fieldType === 'text-input' && (item == null ? void 0 : item.format) === 'date' || fieldType === 'date-input';
};
/**
 * Clones an object completely including any nested objects or arrays
 * @param obj
 * @param idGenerator
 * @private
 */
function deepClone(obj, idGenerator) {
  let result;
  if (obj instanceof Array) {
    result = [];
    result = obj.map(x => deepClone(x, idGenerator));
  } else if (typeof obj === 'object' && obj !== null) {
    result = {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = deepClone(value, idGenerator);
    });
  } else {
    result = obj;
  }
  //if idGenerator is specified, and id exists in the object
  if (idGenerator && result && result.id) {
    result.id = idGenerator();
  }
  return result;
}
/**
 * Prettifies obj as json string
 * @param obj object to prettify
 * @return json string
 */
const jsonString = obj => {
  return JSON.stringify(obj, null, 2);
};

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Implementation of generic event
 * @private
 */
class ActionImpl {
  //@ts-ignore

  constructor(payload, type, _metadata) {
    this._metadata = _metadata;
    this._payload = payload;
    this._type = type;
  }
  get type() {
    return this._type;
  }
  get payload() {
    return this._payload;
  }
  get metadata() {
    return this._metadata;
  }
  get target() {
    return this._target;
  }
  get isCustomEvent() {
    return false;
  }
  payloadToJson() {
    return this.payload;
  }
  toJson() {
    return {
      payload: this.payloadToJson(),
      type: this.type,
      isCustomEvent: this.isCustomEvent
    };
  }
  toString() {
    return JSON.stringify(this.toJson());
  }
}
/**
 * Implementation of `change` event. The change event is triggered on the field whenever the value of the field is changed
 */
class Change extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload, dispatch = false) {
    super(payload, 'change', {
      dispatch
    });
  }
  withAdditionalChange(change) {
    return new Change(this.payload.changes.concat(change.payload.changes), this.metadata);
  }
}
/**
 * Implementation of `invalid` event. The invalid event is triggered when a Field’s value becomes invalid after a change event or whenever its value property change
 */
class Invalid extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   */
  constructor(payload = {}) {
    super(payload, 'invalid', {});
  }
}
/**
 * Implementation of `valid` event. The valid event is triggered whenever the field’s valid state is changed from invalid to valid.
 */
class Valid extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   */
  constructor(payload = {}) {
    super(payload, 'valid', {});
  }
}
/**
 * Implementation of an ExecuteRule event.
 * @private
 */
class ExecuteRule extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload = {}, dispatch = false) {
    super(payload, 'executeRule', {
      dispatch
    });
  }
}
/**
 * Creates a change event
 * @param propertyName  name of the form field property
 * @param currentValue  current value
 * @param prevValue     previous value
 * @returns {@link Change} change event
 */
const propertyChange = (propertyName, currentValue, prevValue) => {
  return new Change({
    changes: [{
      propertyName,
      currentValue,
      prevValue
    }]
  });
};
/**
 * Implementation of `initialize` event. The event is triggered on all the fields when the form initialisation is complete
 */
class Initialize extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload, dispatch = false) {
    super(payload, 'initialize', {
      dispatch
    });
  }
}
/**
 * Implementation of `load` event. The event is when the form initialization is complete
 */
class FormLoad extends ActionImpl {
  /**
   * @constructor
   */
  constructor() {
    super({}, 'load', {
      dispatch: false
    });
  }
}
/**
 * Implementation of `click` event. The event is triggered when user clicks on an element.
 */
class Click extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload, dispatch = false) {
    super(payload, 'click', {
      dispatch
    });
  }
}
/**
 * Implementation of `blur` event. The event is triggered when the element loses focus.
 */
class Blur extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload, dispatch = false) {
    super(payload, 'blur', {
      dispatch
    });
  }
}
/**
 * Implementation of `ValidationComplete` event. The ValidationComplete event is triggered once validation is completed
 * on the form.
 *
 * An example of using this event,
 * ```
 * function onValidationComplete(event) {
 *	 const x = event.payload[0].id;
 *	 // do something with the invalid field
 * }
 * ```
 */
class ValidationComplete extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload (ie) list of {@link ValidationError | validation errors}
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload, dispatch = false) {
    super(payload, 'validationComplete', {
      dispatch
    });
  }
}
/**
 * Implementation of `submit` event. The submit event is triggered on the Form.
 * To trigger the submit event, submit function needs to be invoked or one can invoke dispatchEvent API.
 */
class Submit extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(payload, dispatch = false) {
    super(payload, 'submit', {
      dispatch
    });
  }
}
/**
 * Implementation of `fieldChanged` event. The field changed event is triggered on the field which it has changed.
 */
class FieldChanged extends ActionImpl {
  constructor(changes, field) {
    super({
      field,
      changes
    }, 'fieldChanged');
  }
}
/**
 * Implementation of `custom event`.
 */
class CustomEvent$1 extends ActionImpl {
  /**
   * @constructor
   * @param [eventName] name of the event
   * @param [payload] event payload
   * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
   */
  constructor(eventName, payload = {}, dispatch = false) {
    super(payload, eventName, {
      dispatch
    });
  }
  /**
   * Defines if the event is custom
   */
  get isCustomEvent() {
    return true;
  }
}
/**
 * Implementation of `addItem` event. The event is triggered on a panel to add a new instance of items inside it.
 */
class AddItem extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   */
  constructor(payload) {
    super(payload, 'addItem');
  }
}
/**
 * Implementation of `removeItem` event. The event is triggered on a panel to remove an instance of items inside it.
 */
class RemoveItem extends ActionImpl {
  /**
   * @constructor
   * @param [payload] event payload
   */
  constructor(payload) {
    super(payload, 'removeItem');
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @private
 */
class DataValue {
  constructor($_name, $_value, $_type = typeof $_value) {
    this.$_fields = [];
    this.$_name = $_name;
    this.$_value = $_value;
    this.$_type = $_type;
  }
  valueOf() {
    return this.$_value;
  }
  get $name() {
    return this.$_name;
  }
  get $value() {
    return this.$_value;
  }
  setValue(typedValue, originalValue, fromField) {
    this.$_value = typedValue;
    this.$_fields.forEach(x => {
      if (fromField !== x) {
        x.value = originalValue;
      }
    });
  }
  get $type() {
    return this.$_type;
  }
  $bindToField(field) {
    if (this.$_fields.indexOf(field) === -1) {
      this.$_fields.push(field);
    }
  }
  $convertToDataValue() {
    return this;
  }
  get $isDataGroup() {
    return false;
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const value = Symbol('NullValue');
class NullDataValueClass extends DataValue {
  constructor() {
    super('', value, 'null');
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValue() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  $bindToField() {}
  $length() {
    return 0;
  }
  $convertToDataValue() {
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  $addDataNode() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  $removeDataNode() {}
  $getDataNode() {
    return this;
  }
  $containsDataNode() {
    return false;
  }
}
//@ts-ignore
const NullDataValue = new NullDataValueClass();

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @private
 */
class DataGroup extends DataValue {
  createEntry(key, value) {
    const t = value instanceof Array ? 'array' : typeof value;
    if (typeof value === 'object' && value != null) {
      return new DataGroup(key, value, t);
    } else {
      return new DataValue(key, value, t);
    }
  }
  constructor(_name, _value, _type = typeof _value) {
    super(_name, _value, _type);
    if (_value instanceof Array) {
      this.$_items = _value.map((value, index) => {
        return this.createEntry(index, value);
      });
    } else {
      this.$_items = Object.fromEntries(Object.entries(_value).map(([key, value]) => {
        return [key, this.createEntry(key, value)];
      }));
    }
  }
  get $value() {
    if (this.$type === 'array') {
      return Object.values(this.$_items).filter(x => typeof x !== 'undefined').map(x => x.$value);
    } else {
      return Object.fromEntries(Object.values(this.$_items).filter(x => typeof x !== 'undefined').map(x => {
        return [x.$name, x.$value];
      }));
    }
  }
  get $length() {
    return Object.entries(this.$_items).length;
  }
  $convertToDataValue() {
    return new DataValue(this.$name, this.$value, this.$type);
  }
  $addDataNode(name, value, override = false) {
    if (value !== NullDataValue) {
      if (this.$type === 'array') {
        const index = name;
        if (!override) {
          this.$_items.splice(index, 0, value);
        } else {
          this.$_items[name] = value;
        }
      } else {
        this.$_items[name] = value;
      }
    }
  }
  $removeDataNode(name) {
    //@ts-ignore not calling delete
    this.$_items[name] = undefined;
  }
  $getDataNode(name) {
    if (this.$_items.hasOwnProperty(name)) {
      return this.$_items[name];
    }
  }
  $containsDataNode(name) {
    return this.$_items.hasOwnProperty(name) && typeof this.$_items[name] !== 'undefined';
  }
  get $isDataGroup() {
    return true;
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const TOK_DOT = 'DOT';
const TOK_IDENTIFIER = 'Identifier';
const TOK_GLOBAL = 'Global';
const TOK_BRACKET = 'bracket';
const TOK_NUMBER = 'Number';
const globalStartToken = '$';
const identifier = (value, start) => {
  return {
    type: TOK_IDENTIFIER,
    value,
    start
  };
};
const bracket = (value, start) => {
  return {
    type: TOK_BRACKET,
    value,
    start
  };
};
const global$ = () => {
  return {
    type: TOK_GLOBAL,
    start: 0,
    value: globalStartToken
  };
};
const isAlphaNum = function isAlphaNum(ch) {
  return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch === '_';
};
const isGlobal = (prev, stream, pos) => {
  // global tokens occur only at the start of an expression
  return prev === null && stream[pos] === globalStartToken;
};
const isIdentifier = (stream, pos) => {
  const ch = stream[pos];
  // $ is special -- it's allowed to be part of an identifier if it's the first character
  if (ch === '$') {
    return stream.length > pos && isAlphaNum(stream[pos + 1]);
  }
  // return whether character 'isAlpha'
  return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch === '_';
};
const isNum = ch => {
  return ch >= '0' && ch <= '9';
};
class Tokenizer {
  constructor(stream) {
    this._tokens = [];
    this._result_tokens = [];
    this.stream = stream;
    this._current = 0;
  }
  _consumeGlobal() {
    this._current += 1;
    return global$();
  }
  _consumeUnquotedIdentifier(stream) {
    const start = this._current;
    this._current += 1;
    while (this._current < stream.length && isAlphaNum(stream[this._current])) {
      this._current += 1;
    }
    return identifier(stream.slice(start, this._current), start);
  }
  _consumeQuotedIdentifier(stream) {
    const start = this._current;
    this._current += 1;
    const maxLength = stream.length;
    while (stream[this._current] !== '"' && this._current < maxLength) {
      // You can escape a double quote and you can escape an escape.
      let current = this._current;
      if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '"')) {
        current += 2;
      } else {
        current += 1;
      }
      this._current = current;
    }
    this._current += 1;
    return identifier(JSON.parse(stream.slice(start, this._current)), start);
  }
  _consumeNumber(stream) {
    const start = this._current;
    this._current += 1;
    const maxLength = stream.length;
    while (isNum(stream[this._current]) && this._current < maxLength) {
      this._current += 1;
    }
    const n = stream.slice(start, this._current);
    const value = parseInt(n, 10);
    return {
      type: TOK_NUMBER,
      value,
      start
    };
  }
  _consumeBracket(stream) {
    const start = this._current;
    this._current += 1;
    let value;
    if (isNum(stream[this._current])) {
      value = this._consumeNumber(stream).value;
    } else {
      throw new Error(`unexpected exception at position ${this._current}. Must be a character`);
    }
    if (this._current < this.stream.length && stream[this._current] !== ']') {
      throw new Error(`unexpected exception at position ${this._current}. Must be a character`);
    }
    this._current++;
    return bracket(value, start);
  }
  tokenize() {
    const stream = this.stream;
    while (this._current < stream.length) {
      const prev = this._tokens.length ? this._tokens.slice(-1)[0] : null;
      if (isGlobal(prev, stream, this._current)) {
        const token = this._consumeGlobal();
        this._tokens.push(token);
        this._result_tokens.push(token);
      } else if (isIdentifier(stream, this._current)) {
        const token = this._consumeUnquotedIdentifier(stream);
        this._tokens.push(token);
        this._result_tokens.push(token);
      } else if (stream[this._current] === '.' && prev != null && prev.type !== TOK_DOT) {
        this._tokens.push({
          type: TOK_DOT,
          value: '.',
          start: this._current
        });
        this._current += 1;
      } else if (stream[this._current] === '[') {
        // No need to increment this._current.  This happens
        // in _consumeLBracket
        const token = this._consumeBracket(stream);
        this._tokens.push(token);
        this._result_tokens.push(token);
      } else if (stream[this._current] === '"') {
        const token = this._consumeQuotedIdentifier(stream);
        this._tokens.push(token);
        this._result_tokens.push(token);
      } else {
        const p = Math.max(0, this._current - 2);
        const s = Math.min(this.stream.length, this._current + 2);
        throw new Error(`Exception at parsing stream ${this.stream.slice(p, s)}`);
      }
    }
    return this._result_tokens;
  }
}
const tokenize = stream => {
  return new Tokenizer(stream).tokenize();
};
const resolveData = (data, input, create) => {
  let tokens;
  if (typeof input === 'string') {
    tokens = tokenize(input);
  } else {
    tokens = input;
  }
  let result = data;
  let i = 0;
  const createIntermediateNode = (token, nextToken, create) => {
    return nextToken === null ? create : nextToken.type === TOK_BRACKET ? new DataGroup(token.value, [], 'array') : new DataGroup(token.value, {});
  };
  while (i < tokens.length && result != null) {
    const token = tokens[i];
    if (token.type === TOK_GLOBAL) {
      result = data;
    } else if (token.type === TOK_IDENTIFIER) {
      if (result instanceof DataGroup && result.$type === 'object') {
        //@ts-ignore
        if (result.$containsDataNode(token.value) && result.$getDataNode(token.value).$value !== null) {
          result = result.$getDataNode(token.value);
        } else if (create) {
          const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
          const toCreate = createIntermediateNode(token, nextToken, create);
          result.$addDataNode(token.value, toCreate);
          result = toCreate;
        } else {
          result = undefined;
        }
      } else {
        throw new Error(`Looking for ${token.value} in ${result.$value}`);
      }
    } else if (token.type === TOK_BRACKET) {
      if (result instanceof DataGroup && result.$type === 'array') {
        const index = token.value;
        if (index < result.$length) {
          //@ts-ignore
          result = result.$getDataNode(index);
        } else if (create) {
          const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
          const toCreate = createIntermediateNode(token, nextToken, create);
          result.$addDataNode(index, toCreate);
          result = toCreate;
        } else {
          result = undefined;
        }
      } else {
        throw new Error(`Looking for index ${token.value} in non array${result.$value}`);
      }
    }
    i += 1;
  }
  return result;
};

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __decorate$2 = function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines the properties that are editable. These properties can be modified during rule execution.
 */
const editableProperties = ['value', 'label', 'description', 'visible', 'enabled', 'readOnly', 'enum', 'enumNames', 'required', 'properties',
// 'enforceEnum', // not exposed for now
'exclusiveMinimum', 'exclusiveMaximum', 'maxLength', 'maximum', 'maxItems', 'minLength', 'minimum', 'minItems', 'step'
// 'placeholder' // not exposed for now.
];
/**
 * Defines props that are dynamic and can be changed at runtime.
 */
const dynamicProps = [...editableProperties, 'valid', 'index', 'activeChild'];
/**
 * Implementation of action with target
 * @private
 */
class ActionImplWithTarget {
  /**
   * @constructor
   * @param _action
   * @param _target
   * @private
   */
  constructor(_action, _target) {
    this._action = _action;
    this._target = _target;
  }
  get type() {
    return this._action.type;
  }
  get payload() {
    return this._action.payload;
  }
  get metadata() {
    return this._action.metadata;
  }
  get target() {
    return this._target;
  }
  get isCustomEvent() {
    return this._action.isCustomEvent;
  }
  get originalAction() {
    return this._action.originalAction;
  }
  toString() {
    return this._action.toString();
  }
}
const target = Symbol('target');
const qualifiedName = Symbol('qualifiedName');
function dependencyTracked() {
  return function (target, propertyKey, descriptor) {
    const get = descriptor.get;
    if (get != undefined) {
      descriptor.get = function () {
        // @ts-ignore
        this.ruleEngine.trackDependency(this);
        return get.call(this);
      };
    }
  };
}
/**
 * Defines a generic base class which all objects of form runtime model should extend from.
 * @typeparam T type of the form object which extends from {@link BaseJson | base type}
 */
class BaseNode {
  //@ts-ignore

  get isContainer() {
    return false;
  }
  /**
   * @constructor
   * @param params
   * @param _options
   * @private
   */
  constructor(params,
  //@ts_ignore
  _options) {
    this._callbacks = {};
    this._dependents = [];
    this._tokens = [];
    this._options = _options;
    //@ts-ignore
    this[qualifiedName] = null;
    this._jsonModel = _extends({}, params, {
      //@ts-ignore
      id: 'id' in params ? params.id : this.form.getUniqueId()
    });
  }
  setupRuleNode() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this._ruleNode = new Proxy(this.ruleNodeReference(), {
      get: (ruleNodeReference, prop) => {
        return self.getFromRule(ruleNodeReference, prop);
      }
    });
  }
  /**
   * @private
   */
  ruleNodeReference() {
    return this;
  }
  /**
   * @private
   */
  getRuleNode() {
    return this._ruleNode;
  }
  getFromRule(ruleNodeReference, prop) {
    if (prop === Symbol.toPrimitive || prop === 'valueOf' && !ruleNodeReference.hasOwnProperty('valueOf')) {
      return this.valueOf;
    } else if (prop === target) {
      return this;
    } else if (typeof prop === 'string') {
      //look for property
      if (prop.startsWith('$')) {
        prop = prop.substr(1);
        //@ts-ignore
        //@todo: create a list of properties that are allowed
        //@ts-ignore
        // return only non functional properties in this object
        if (typeof this[prop] !== 'function') {
          //@ts-ignore
          const retValue = this[prop];
          if (retValue instanceof BaseNode) {
            //$parent
            return retValue.getRuleNode();
          } else if (retValue instanceof Array) {
            //$items
            return retValue.map(r => r instanceof BaseNode ? r.getRuleNode() : r);
          } else {
            return retValue;
          }
        }
      } else {
        //look in the items
        if (ruleNodeReference.hasOwnProperty(prop)) {
          return ruleNodeReference[prop];
        } else if (typeof ruleNodeReference[prop] === 'function') {
          //todo : create allow list of functions
          //to support panel instanceof Array panel1.map(..)
          return ruleNodeReference[prop];
        }
      }
    }
  }
  get id() {
    return this._jsonModel.id;
  }
  get index() {
    return this.parent.indexOf(this);
  }
  get parent() {
    return this._options.parent;
  }
  get type() {
    return this._jsonModel.type;
  }
  get fieldType() {
    return this._jsonModel.fieldType || 'text-input';
  }
  get ':type'() {
    return this._jsonModel[':type'] || this.fieldType;
  }
  get name() {
    return this._jsonModel.name;
  }
  get description() {
    return this._jsonModel.description;
  }
  set description(d) {
    this._setProperty('description', d);
  }
  get dataRef() {
    return this._jsonModel.dataRef;
  }
  get visible() {
    return this._jsonModel.visible;
  }
  set visible(v) {
    if (v !== this._jsonModel.visible) {
      const changeAction = propertyChange('visible', v, this._jsonModel.visible);
      this._jsonModel.visible = v;
      this.notifyDependents(changeAction);
    }
  }
  get form() {
    return this._options.form;
  }
  get ruleEngine() {
    return this.form.ruleEngine;
  }
  get label() {
    return this._jsonModel.label;
  }
  set label(l) {
    if (l !== this._jsonModel.label) {
      const changeAction = propertyChange('label', l, this._jsonModel.label);
      this._jsonModel = _extends({}, this._jsonModel, {
        label: l
      });
      this.notifyDependents(changeAction);
    }
  }
  get uniqueItems() {
    return this._jsonModel.uniqueItems;
  }
  /**
   * Transparent form fields are meant only for creation of view. They are also not part of data
   */
  isTransparent() {
    var _this$parent;
    // named form fields are not transparent
    // @ts-ignore
    // handling array use-case as items of array can be unnamed
    const isNonTransparent = ((_this$parent = this.parent) == null ? void 0 : _this$parent._jsonModel.type) === 'array';
    return !this._jsonModel.name && !isNonTransparent;
  }
  getState() {
    return _extends({}, this._jsonModel, {
      ':type': this[':type']
    });
  }
  /**
   * @private
   */
  subscribe(callback, eventName = 'change') {
    this._callbacks[eventName] = this._callbacks[eventName] || [];
    this._callbacks[eventName].push(callback);
    //console.log(`subscription added : ${this._elem.id}, count : ${this._callbacks[eventName].length}`);
    return {
      unsubscribe: () => {
        this._callbacks[eventName] = this._callbacks[eventName].filter(x => x !== callback);
        //console.log(`subscription removed : ${this._elem.id}, count : ${this._callbacks[eventName].length}`);
      }
    };
  }
  /**
   * @private
   */
  _addDependent(dependent) {
    if (this._dependents.find(({
      node
    }) => node === dependent) === undefined) {
      const subscription = this.subscribe(change => {
        const changes = change.payload.changes;
        const propsToLook = [...dynamicProps, 'items'];
        // @ts-ignore
        const isPropChanged = changes.findIndex(x => {
          return propsToLook.indexOf(x.propertyName) > -1;
        }) > -1;
        if (isPropChanged) {
          dependent.dispatch(new ExecuteRule());
        }
      });
      this._dependents.push({
        node: dependent,
        subscription
      });
    }
  }
  /**
   * @private
   */
  removeDependent(dependent) {
    const index = this._dependents.findIndex(({
      node
    }) => node === dependent);
    if (index > -1) {
      this._dependents[index].subscription.unsubscribe();
      this._dependents.splice(index, 1);
    }
  }
  /**
   * @private
   */
  queueEvent(action) {
    const actionWithTarget = new ActionImplWithTarget(action, this);
    this.form.getEventQueue().queue(this, actionWithTarget, ['valid', 'invalid'].indexOf(actionWithTarget.type) > -1);
  }
  dispatch(action) {
    this.queueEvent(action);
    this.form.getEventQueue().runPendingQueue();
  }
  /**
   * @private
   */
  notifyDependents(action) {
    const handlers = this._callbacks[action.type] || [];
    handlers.forEach(x => {
      x(new ActionImplWithTarget(action, this));
    });
  }
  /**
   * @param prop
   * @param newValue
   * @private
   */
  _setProperty(prop, newValue, notify = true) {
    //@ts-ignore
    const oldValue = this._jsonModel[prop];
    let isValueSame = false;
    if (newValue !== null && oldValue !== null && typeof newValue === 'object' && typeof oldValue === 'object') {
      isValueSame = JSON.stringify(newValue) === JSON.stringify(oldValue);
    } else {
      // @ts-ignore
      isValueSame = oldValue === newValue;
    }
    if (!isValueSame) {
      //@ts-ignore
      this._jsonModel[prop] = newValue;
      const changeAction = propertyChange(prop, newValue, oldValue);
      if (notify) {
        this.notifyDependents(changeAction);
      }
      return changeAction.payload.changes;
    }
    return [];
  }
  /**
   * @private
   */
  _bindToDataModel(contextualDataModel) {
    if (this.id === '$form') {
      this._data = contextualDataModel;
      return;
    }
    const dataRef = this._jsonModel.dataRef;
    let _data,
      _parent = contextualDataModel,
      _key = '';
    if (dataRef === null) {
      // null data binding
      _data = NullDataValue;
    } else if (dataRef !== undefined) {
      // explicit data binding
      if (this._tokens.length === 0) {
        this._tokens = tokenize(dataRef);
      }
      let searchData = contextualDataModel;
      if (this._tokens[0].type === TOK_GLOBAL) {
        searchData = this.form.getDataNode();
      }
      if (typeof searchData !== 'undefined') {
        const name = this._tokens[this._tokens.length - 1].value;
        const create = this.defaultDataModel(name);
        _data = resolveData(searchData, this._tokens, create);
        // @ts-ignore
        _parent = resolveData(searchData, this._tokens.slice(0, -1));
        _key = name;
      }
    } else {
      // name data binding
      if (
      //@ts-ignore
      contextualDataModel !== NullDataValue) {
        _parent = contextualDataModel;
        const name = this._jsonModel.name || '';
        const key = contextualDataModel.$type === 'array' ? this.index : name;
        _key = key;
        if (key !== '') {
          const create = this.defaultDataModel(key);
          if (create !== undefined) {
            _data = contextualDataModel.$getDataNode(key);
            if (_data === undefined) {
              _data = create;
              contextualDataModel.$addDataNode(key, _data);
            }
          }
        } else {
          _data = undefined;
        }
      }
    }
    if (_data) {
      var _data3;
      //@ts-ignore
      if (!this.isContainer && _parent !== NullDataValue && _data !== NullDataValue) {
        var _data2;
        _data = (_data2 = _data) == null ? void 0 : _data2.$convertToDataValue();
        _parent.$addDataNode(_key, _data, true);
      }
      (_data3 = _data) == null ? void 0 : _data3.$bindToField(this);
      this._data = _data;
    }
  }
  /**
   * @private
   */
  getDataNode() {
    return this._data;
  }
  get properties() {
    return this._jsonModel.properties || {};
  }
  set properties(p) {
    this._setProperty('properties', _extends({}, p));
  }
  getNonTransparentParent() {
    let nonTransparentParent = this.parent;
    while (nonTransparentParent != null && nonTransparentParent.isTransparent()) {
      nonTransparentParent = nonTransparentParent.parent;
    }
    return nonTransparentParent;
  }
  /**
   * called after the node is inserted in the parent
   * @private
   */
  _initialize() {
    if (typeof this._data === 'undefined') {
      let dataNode,
        parent = this.parent;
      do {
        //@ts-ignore
        dataNode = parent.getDataNode();
        parent = parent.parent;
      } while (dataNode === undefined);
      this._bindToDataModel(dataNode);
    }
  }
  /**
   * Checks whether there are any updates in the properties. If there are applies them to the
   * json model as well.
   * @param propNames
   * @param updates
   * @private
   */
  _applyUpdates(propNames, updates) {
    return propNames.reduce((acc, propertyName) => {
      //@ts-ignore
      const currentValue = updates[propertyName];
      const changes = this._setProperty(propertyName, currentValue, false);
      if (changes.length > 0) {
        acc[propertyName] = changes[0];
      }
      return acc;
    }, {});
  }
  get qualifiedName() {
    if (this.isTransparent()) {
      return null;
    }
    // @ts-ignore
    if (this[qualifiedName] !== null) {
      // @ts-ignore
      return this[qualifiedName];
    }
    // use qualified name
    const parent = this.getNonTransparentParent();
    if (parent && parent.type === 'array') {
      //@ts-ignore
      this[qualifiedName] = `${parent.qualifiedName}[${this.index}]`;
    } else {
      //@ts-ignore
      this[qualifiedName] = `${parent.qualifiedName}.${this.name}`;
    }
    //@ts-ignore
    return this[qualifiedName];
  }
  focus() {
    if (this.parent) {
      this.parent.activeChild = this;
    }
  }
}
__decorate$2([dependencyTracked()], BaseNode.prototype, "index", null);
__decorate$2([dependencyTracked()], BaseNode.prototype, "description", null);
__decorate$2([dependencyTracked()], BaseNode.prototype, "visible", null);
__decorate$2([dependencyTracked()], BaseNode.prototype, "label", null);
__decorate$2([dependencyTracked()], BaseNode.prototype, "properties", null);

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Defines scriptable aspects (ie rules, events) of form runtime model. Any form runtime object which requires
 * execution of rules/events should extend from this class.
 */
class Scriptable extends BaseNode {
  constructor(...args) {
    super(...args);
    this._events = {};
    this._rules = {};
  }
  get rules() {
    return this._jsonModel.rules || {};
  }
  getCompiledRule(eName, rule) {
    if (!(eName in this._rules)) {
      const eString = rule || this.rules[eName];
      if (typeof eString === 'string' && eString.length > 0) {
        try {
          this._rules[eName] = this.ruleEngine.compileRule(eString);
        } catch (e) {
          this.form.logger.error(`Unable to compile rule \`"${eName}" : "${eString}"\` Exception : ${e}`);
        }
      } else {
        throw new Error(`only expression strings are supported. ${typeof eString} types are not supported`);
      }
    }
    return this._rules[eName];
  }
  getCompiledEvent(eName) {
    if (!(eName in this._events)) {
      var _this$_jsonModel$even;
      let eString = (_this$_jsonModel$even = this._jsonModel.events) == null ? void 0 : _this$_jsonModel$even[eName];
      if (typeof eString === 'string' && eString.length > 0) {
        eString = [eString];
      }
      if (typeof eString !== 'undefined' && eString.length > 0) {
        this._events[eName] = eString.map(x => {
          try {
            return this.ruleEngine.compileRule(x);
          } catch (e) {
            this.form.logger.error(`Unable to compile expression \`"${eName}" : "${eString}"\` Exception : ${e}`);
          }
          return null;
        }).filter(x => x !== null);
      }
    }
    return this._events[eName] || [];
  }
  applyUpdates(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      // @ts-ignore
      // the first check is to disable accessing this.value & this.items property
      // otherwise that will trigger dependency tracking
      if (key in editableProperties || key in this && typeof this[key] !== 'function') {
        try {
          // @ts-ignore
          this[key] = value;
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  executeAllRules(context) {
    const entries = Object.entries(this.rules);
    if (entries.length > 0) {
      const scope = this.getExpressionScope();
      entries.forEach(([prop, rule]) => {
        const node = this.getCompiledRule(prop, rule);
        if (node) {
          const newVal = this.ruleEngine.execute(node, scope, context, true);
          if (editableProperties.indexOf(prop) > -1) {
            //@ts-ignore
            this[prop] = newVal;
          } else {
            this.form.logger.warn(`${prop} is not a valid editable property.`);
          }
        }
      });
    }
  }
  getExpressionScope() {
    const parent = this.getNonTransparentParent();
    const target = {
      self: this.getRuleNode(),
      siblings: (parent == null ? void 0 : parent.ruleNodeReference()) || {}
    };
    const scope = new Proxy(target, {
      get: (target, prop) => {
        if (prop === Symbol.toStringTag) {
          return 'Object';
        }
        prop = prop;
        // The order of resolution is
        // 1. property
        // 2. sibling
        // 3. child
        if (prop.startsWith('$')) {
          //this returns children as well, so adding an explicit check for property name
          const retValue = target.self[prop];
          if (retValue instanceof BaseNode) {
            //$parent
            return retValue.getRuleNode();
          } else if (retValue instanceof Array) {
            //$items
            return retValue.map(r => r instanceof BaseNode ? r.getRuleNode() : r);
          } else {
            return retValue;
          }
        } else {
          if (prop in target.siblings) {
            return target.siblings[prop];
          } else {
            return target.self[prop];
          }
        }
      },
      has: (target, prop) => {
        prop = prop;
        const selfPropertyOrChild = target.self[prop];
        const sibling = target.siblings[prop];
        return typeof selfPropertyOrChild != 'undefined' || typeof sibling != 'undefined';
      }
    });
    return scope;
  }
  executeEvent(context, node) {
    let updates;
    if (node) {
      updates = this.ruleEngine.execute(node, this.getExpressionScope(), context);
    }
    if (typeof updates !== 'undefined' && updates != null) {
      this.applyUpdates(updates);
    }
  }
  /**
   * Executes the given rule
   * @param event
   * @param context
   * @private
   */
  executeRule(event, context) {
    if (typeof event.payload.ruleName === 'undefined') {
      this.executeAllRules(context);
    }
  }
  executeExpression(expr) {
    const ruleContext = {
      'form': this.form,
      '$form': this.form.getRuleNode(),
      '$field': this.getRuleNode(),
      'field': this
    };
    const node = this.ruleEngine.compileRule(expr);
    return this.ruleEngine.execute(node, this.getExpressionScope(), ruleContext);
  }
  /**
   * Executes the given action
   * @param action    {@link Action | event object}
   */
  executeAction(action) {
    const context = {
      'form': this.form,
      '$form': this.form.getRuleNode(),
      '$field': this.getRuleNode(),
      'field': this,
      '$event': {
        type: action.type,
        payload: action.payload,
        target: this.getRuleNode()
      }
    };
    const eventName = action.isCustomEvent ? `custom:${action.type}` : action.type;
    const funcName = action.isCustomEvent ? `custom_${action.type}` : action.type;
    const node = this.getCompiledEvent(eventName);
    //todo: apply all the updates at the end  or
    // not trigger the change event until the execution is finished
    node.forEach(n => this.executeEvent(context, n));
    // @ts-ignore
    if (funcName in this && typeof this[funcName] === 'function') {
      //@ts-ignore
      this[funcName](action, context);
    }
    this.notifyDependents(action);
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __decorate$1 = function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines a generic container class which any form container should extend from.
 * @typeparam T type of the node which extends {@link ContainerJson} and {@link RulesJson}
 */
class Container extends Scriptable {
  constructor(...args) {
    super(...args);
    this._children = [];
    this._itemTemplate = null;
    this._activeChild = null;
  }
  /**
   * @private
   */
  ruleNodeReference() {
    return this._childrenReference;
  }
  //todo : this should not be public
  get items() {
    return this._children;
  }
  get maxItems() {
    return this._jsonModel.maxItems;
  }
  set maxItems(m) {
    this._jsonModel.maxItems = m;
    const minItems = this._jsonModel.minItems || 1;
    const itemsLength = this._children.length;
    const items2Remove = Math.min(itemsLength - m, itemsLength - minItems);
    if (items2Remove > 0) {
      for (let i = 0; i < items2Remove; i++) {
        this.getDataNode().$removeDataNode(m + i);
        this._childrenReference.pop();
      }
      const elems = this._children.splice(m, items2Remove);
      this.notifyDependents(propertyChange('items', elems, null));
    }
  }
  get minItems() {
    return this._jsonModel.minItems;
  }
  /**
   * returns whether the items in the Panel can repeat or not
   */
  hasDynamicItems() {
    return this._itemTemplate != null;
  }
  get isContainer() {
    return true;
  }
  /**
   * Returns the current container state
   */
  getState() {
    return _extends({}, this._jsonModel, {
      ':type': this[':type'],
      items: this._children.map(x => {
        return _extends({}, x.getState());
      })
    });
  }
  _addChildToRuleNode(child, options) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const {
      parent = this
    } = options;
    //the child has not been added to the array, hence using the length as new index
    // this means unnamed panel inside repeatable named parent // this is an edge case, handling it gracefully
    // todo: rules don't work inside repeatable array
    const name = parent.type == 'array' ? parent._children.length + '' : child.name || '';
    if (name.length > 0) {
      Object.defineProperty(parent._childrenReference, name, {
        get: () => {
          if (child.isContainer && child.hasDynamicItems()) {
            self.ruleEngine.trackDependency(child); //accessing dynamic panel directly
          }

          if (self.hasDynamicItems()) {
            self.ruleEngine.trackDependency(self); //accessing a child of dynamic panel
            if (this._children[name] !== undefined) {
              // pop function calls this getter in order to return the item
              return this._children[name].getRuleNode();
            }
          } else {
            return child.getRuleNode();
          }
        },
        configurable: true,
        enumerable: true
      });
    }
  }
  _addChild(itemJson, index, cloneIds = false) {
    // get first non transparent parent
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let nonTransparentParent = this;
    while (nonTransparentParent != null && nonTransparentParent.isTransparent()) {
      // @ts-ignore
      nonTransparentParent = nonTransparentParent.parent;
    }
    if (typeof index !== 'number' || index > nonTransparentParent._children.length) {
      index = this._children.length;
    }
    const form = this.form;
    const itemTemplate = _extends({
      index
    }, deepClone(itemJson, cloneIds ? () => {
      return form.getUniqueId();
    } : undefined));
    //@ts-ignore
    const retVal = this._createChild(itemTemplate, {
      parent: this,
      index
    });
    this._addChildToRuleNode(retVal, {
      parent: nonTransparentParent
    });
    if (index === this._children.length) {
      this._children.push(retVal);
    } else {
      // @ts-ignore
      this._children.splice(index, 0, retVal);
    }
    return retVal;
  }
  indexOf(f) {
    return this._children.indexOf(f);
  }
  /**
   * @private
   */
  defaultDataModel(name) {
    const type = this._jsonModel.type || undefined;
    if (type === undefined) {
      return undefined;
    } else {
      const instance = type === 'array' ? [] : {};
      return new DataGroup(name, instance, type);
    }
  }
  /**
   * @private
   */
  _initialize() {
    super._initialize();
    const items = this._jsonModel.items;
    this._jsonModel.items = [];
    this._childrenReference = this._jsonModel.type == 'array' ? [] : {};
    if (this._jsonModel.type == 'array' && items.length === 1 && this.getDataNode() != null) {
      this._itemTemplate = deepClone(items[0]);
      if (typeof this._jsonModel.minItems !== 'number') {
        this._jsonModel.minItems = 0;
      }
      if (typeof this._jsonModel.maxItems !== 'number') {
        this._jsonModel.maxItems = -1;
      }
      if (typeof this._jsonModel.initialItems !== 'number') {
        this._jsonModel.initialItems = Math.max(1, this._jsonModel.minItems);
      }
      for (let i = 0; i < this._jsonModel.initialItems; i++) {
        //@ts-ignore
        const child = this._addChild(this._itemTemplate);
        child._initialize();
      }
    } else if (items.length > 0) {
      items.forEach(item => {
        const child = this._addChild(item);
        child._initialize();
      });
      this._jsonModel.minItems = this._children.length;
      this._jsonModel.maxItems = this._children.length;
      this._jsonModel.initialItems = this._children.length;
    }
    this.setupRuleNode();
  }
  /**
   * @private
   */
  addItem(action) {
    if (action.type === 'addItem' && this._itemTemplate != null) {
      //@ts-ignore
      if (this._jsonModel.maxItems === -1 || this._children.length < this._jsonModel.maxItems) {
        const dataNode = this.getDataNode();
        let index = action.payload;
        if (typeof index !== 'number' || index > this._children.length) {
          index = this._children.length;
        }
        const retVal = this._addChild(this._itemTemplate, action.payload, true);
        const _data = retVal.defaultDataModel(index);
        if (_data) {
          dataNode.$addDataNode(index, _data);
        }
        retVal._initialize();
        this.notifyDependents(propertyChange('items', retVal.getState, null));
        retVal.dispatch(new Initialize());
        retVal.dispatch(new ExecuteRule());
        for (let i = index + 1; i < this._children.length; i++) {
          this._children[i].dispatch(new ExecuteRule());
        }
      }
    }
  }
  /**
   * @private
   */
  removeItem(action) {
    if (action.type === 'removeItem' && this._itemTemplate != null) {
      if (this._children.length == 0) {
        //can't remove item if there isn't any
        return;
      }
      const index = typeof action.payload === 'number' ? action.payload : this._children.length - 1;
      const state = this._children[index].getState();
      //@ts-ignore
      if (this._children.length > this._jsonModel.minItems) {
        // clear child
        //remove field
        this._childrenReference.pop();
        this._children.splice(index, 1);
        this.getDataNode().$removeDataNode(index);
        for (let i = index; i < this._children.length; i++) {
          this._children[i].dispatch(new ExecuteRule());
        }
        this.notifyDependents(propertyChange('items', null, state));
      }
    }
  }
  /**
   * @private
   */
  queueEvent(action) {
    var _action$metadata;
    super.queueEvent(action);
    if ((_action$metadata = action.metadata) != null && _action$metadata.dispatch) {
      this.items.forEach(x => {
        //@ts-ignore
        x.queueEvent(action);
      });
    }
  }
  validate() {
    return this.items.flatMap(x => {
      return x.validate();
    }).filter(x => x.fieldName !== '');
  }
  /**
   * @private
   */
  dispatch(action) {
    super.dispatch(action);
  }
  /**
   * @private
   */
  importData(contextualDataModel) {
    this._bindToDataModel(contextualDataModel);
    const dataNode = this.getDataNode() || contextualDataModel;
    this.syncDataAndFormModel(dataNode);
  }
  /**
   * prefill the form with data on the given element
   * @param dataModel
   * @param contextualDataModel
   * @param operation
   * @private
   */
  syncDataAndFormModel(contextualDataModel) {
    if ((contextualDataModel == null ? void 0 : contextualDataModel.$type) === 'array' && this._itemTemplate != null) {
      const dataLength = contextualDataModel == null ? void 0 : contextualDataModel.$value.length;
      const itemsLength = this._children.length;
      const maxItems = this._jsonModel.maxItems === -1 ? dataLength : this._jsonModel.maxItems;
      const minItems = this._jsonModel.minItems;
      //@ts-ignore
      let items2Add = Math.min(dataLength - itemsLength, maxItems - itemsLength);
      //@ts-ignore
      const items2Remove = Math.min(itemsLength - dataLength, itemsLength - minItems);
      while (items2Add > 0) {
        items2Add--;
        const child = this._addChild(this._itemTemplate);
        child._initialize();
      }
      if (items2Remove > 0) {
        this._children.splice(dataLength, items2Remove);
        for (let i = 0; i < items2Remove; i++) {
          this._childrenReference.pop();
        }
      }
    }
    this._children.forEach(x => {
      x.importData(contextualDataModel);
    });
  }
  get activeChild() {
    return this._activeChild;
  }
  set activeChild(c) {
    if (c !== this._activeChild) {
      let activeChild = this._activeChild;
      while (activeChild instanceof Container) {
        const temp = activeChild.activeChild;
        activeChild.activeChild = null;
        activeChild = temp;
      }
      const change = propertyChange('activeChild', c, this._activeChild);
      this._activeChild = c;
      if (this.parent && c !== null) {
        this.parent.activeChild = this;
      }
      this._jsonModel.activeChild = c == null ? void 0 : c.id;
      this.notifyDependents(change);
    }
  }
}
__decorate$1([dependencyTracked()], Container.prototype, "maxItems", null);
__decorate$1([dependencyTracked()], Container.prototype, "minItems", null);
__decorate$1([dependencyTracked()], Container.prototype, "activeChild", null);

/**
 * Defines generic form object class which any form runtime model (like textbox, checkbox etc)
 * should extend from.
 * @typeparam T type of the node (for example, {@link MetaDataJson | form meta data}
 */
class Node {
  constructor(inputModel) {
    this._jsonModel = _extends({}, inputModel);
  }
  getP(key, def) {
    return getProperty(this._jsonModel, key, def);
  }
  get isContainer() {
    return false;
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Defines form metadata which implements {@link FormMetaDataModel | Form MetaData Model}
 */
class FormMetaData extends Node {
  get version() {
    return this.getP('version', '');
  }
  get locale() {
    return this.getP('locale', '');
  }
  get grammar() {
    return this.getP('grammar', '');
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Defines a file object which implements the {@link IFileObject | file object interface}
 */
class FileObject {
  constructor(init) {
    this.type = 'application/octet-stream';
    this.name = 'unknown';
    this.size = 0;
    Object.assign(this, init);
  }
  toJSON() {
    return {
      'name': this.name,
      'size': this.size,
      'type': this.type,
      'data': this.data.toString()
    };
  }
  equals(obj) {
    return this.data === obj.data && this.type === obj.type && this.name === obj.name && this.size === obj.size;
  }
}
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');
const fileSizeRegex = /^(\d*\.?\d+)(\\?(?=[KMGT])([KMGT])(?:i?B)?|B?)$/i;
/**
 * Utility to generate a random word from seed
 * @param l seed value
 * @returns random word
 */
const randomWord = l => {
  const ret = [];
  for (let i = 0; i <= l; i++) {
    const randIndex = Math.floor(Math.random() * chars.length);
    ret.push(chars[randIndex]);
  }
  return ret.join('');
};
/**
 * Returns the list of attachments with its data reference
 * @param input form model
 * @returns list of file attachments {@link FileObject} present in the form
 */
const getAttachments = input => {
  const items = input.items || [];
  return items == null ? void 0 : items.reduce((acc, item) => {
    let ret = null;
    if (item.isContainer) {
      ret = getAttachments(item);
    } else {
      if (isFile(item.getState())) {
        ret = {}; // @ts-ignore
        const name = item.name || '';
        const dataRef = item.dataRef != null ? item.dataRef : name.length > 0 ? item.name : undefined;
        //@ts-ignore
        if (item.value instanceof Array) {
          // @ts-ignore
          ret[item.id] = item.value.map(x => {
            return _extends({}, x, {
              'dataRef': dataRef
            });
          });
        } else if (item.value != null) {
          // @ts-ignore
          ret[item.id] = _extends({}, item.value, {
            'dataRef': dataRef
          });
        }
      }
    }
    return Object.assign(acc, ret);
  }, {});
};
/**
 * Converts file size in string to bytes based on IEC specification
 * @param str   file size
 * @returns file size as bytes (in kb) based on IEC specification
 */
const getFileSizeInBytes = str => {
  let retVal = 0;
  if (typeof str === 'string') {
    const matches = fileSizeRegex.exec(str.trim());
    if (matches != null) {
      retVal = sizeToBytes(parseFloat(matches[1]), (matches[2] || 'kb').toUpperCase());
    }
  }
  return retVal;
};
/**
 * Converts number to bytes based on the symbol as per IEC specification
 * @param size      size as number
 * @param symbol    symbol to use (for example, kb, mb, gb or tb)
 * @returns number as bytes based on the symbol
 */
const sizeToBytes = (size, symbol) => {
  const sizes = {
    'KB': 1,
    'MB': 2,
    'GB': 3,
    'TB': 4
  };
  // @ts-ignore
  const i = Math.pow(1024, sizes[symbol]);
  return Math.round(size * i);
};
/**
 * ID Generator
 * @param initial
 * @constructor
 * @private
 */
const IdGenerator = function* IdGenerator(initial = 50) {
  const initialize = function initialize() {
    const arr = [];
    for (let i = 0; i < initial; i++) {
      arr.push(randomWord(10));
    }
    return arr;
  };
  const passedIds = {};
  let ids = initialize();
  do {
    let x = ids.pop();
    while (x in passedIds) {
      if (ids.length === 0) {
        ids = initialize();
      }
      x = ids.pop();
    }
    passedIds[x] = true;
    yield ids.pop();
    if (ids.length === 0) {
      ids = initialize();
    }
  } while (ids.length > 0);
};
/**
 * Utility to extract {@link FileObject} from string or HTML File data type
 * @param file
 * @returns list of {@link FileObject}
 */
const extractFileInfo = file => {
  if (file !== null) {
    let retVal = null;
    if (file instanceof FileObject) {
      retVal = file;
    } else if (typeof File !== 'undefined' && file instanceof File) {
      // case: file object
      retVal = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: file
      };
    } else if (typeof file === 'string' && isDataUrl(file)) {
      // case: data URL
      const result = dataURItoBlob(file);
      if (result !== null) {
        const {
          blob,
          name
        } = result;
        retVal = {
          name: name,
          type: blob.type,
          size: blob.size,
          data: blob
        };
      }
    } else {
      var _jFile, _jFile2;
      // case: string as file object
      let jFile = file;
      try {
        jFile = JSON.parse(file);
        retVal = jFile;
      } catch (ex) {
        // do nothing
      }
      if (typeof ((_jFile = jFile) == null ? void 0 : _jFile.data) === 'string' && isDataUrl((_jFile2 = jFile) == null ? void 0 : _jFile2.data)) {
        var _jFile3;
        // case: data URL
        const result = dataURItoBlob((_jFile3 = jFile) == null ? void 0 : _jFile3.data);
        if (result !== null) {
          var _jFile4, _jFile5;
          const blob = result.blob;
          retVal = {
            name: (_jFile4 = jFile) == null ? void 0 : _jFile4.name,
            type: (_jFile5 = jFile) == null ? void 0 : _jFile5.type,
            size: blob.size,
            data: blob
          };
        }
      } else if (typeof jFile === 'string') {
        // case: data as external url
        const fileName = jFile.split('/').pop();
        retVal = {
          name: fileName,
          type: 'application/octet-stream',
          size: 0,
          data: jFile
        };
      } else if (typeof jFile === 'object') {
        var _jFile6, _jFile7, _jFile8, _jFile9;
        // todo: just added for ease of integration for the view layer
        retVal = {
          name: (_jFile6 = jFile) == null ? void 0 : _jFile6.name,
          type: (_jFile7 = jFile) == null ? void 0 : _jFile7.type,
          size: (_jFile8 = jFile) == null ? void 0 : _jFile8.size,
          data: (_jFile9 = jFile) == null ? void 0 : _jFile9.data
        };
      }
    }
    if (retVal !== null && retVal.data != null) {
      return new FileObject(retVal);
    }
    return null;
  } else {
    return null;
  }
};
/**
 * Utility to convert data URI to a `blob` object
 * @param dataURI uri to convert to blob
 * @returns `Blob` object for the data URI
 */
const dataURItoBlob = dataURI => {
  const regex = /^data:([a-z]+\/[a-z0-9-+.]+)?(?:;name=([^;]+))?(;base64)?,(.+)$/;
  const groups = regex.exec(dataURI);
  if (groups !== null) {
    const type = groups[1] || '';
    const name = groups[2] || 'unknown';
    const isBase64 = typeof groups[3] === 'string';
    if (isBase64) {
      const binary = atob(groups[4]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new window.Blob([new Uint8Array(array)], {
        type
      });
      return {
        name,
        blob
      };
    } else {
      const blob = new window.Blob([groups[4]], {
        type
      });
      return {
        name,
        blob
      };
    }
  } else {
    return null;
  }
};

/**
 * Defines generic utilities to validate form runtime model based on the constraints defined
 * as per `adaptive form specification`
 */
// issue with import
//import {FieldJson, isFileObject} from '../types';
const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const dataUrlRegex = /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysInMonth = (leapYear, month) => {
  if (leapYear && month == 2) {
    return 29;
  }
  return days[month - 1];
};
const isLeapYear = year => {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
};
const isDataUrl = str => {
  return dataUrlRegex.exec(str.trim()) != null;
};
/**
 * Checks whether inputVal is valid number value or not
 *
 * ```
 * const x = checkNumber('12')
 * ```
 * would return
 * ```
 * {
 *     value : 12,
 *     valid : true
 * }
 * ```
 * @param inputVal input value
 * @returns {@link ValidationResult | Validation result}
 */
const checkNumber = inputVal => {
  let value = parseFloat(inputVal);
  const valid = !isNaN(value);
  if (!valid) {
    value = inputVal;
  }
  return {
    value,
    valid
  };
};
const checkInteger = inputVal => {
  let value = parseFloat(inputVal);
  const valid = !isNaN(value) && Math.round(value) === value;
  if (!valid) {
    value = inputVal;
  }
  return {
    value,
    valid
  };
};
/**
 * Wraps a non-null value and not an array value into an array
 * @param inputVal input value
 * @returns wraps the input value into an array
 */
const toArray = inputVal => {
  if (inputVal != null && !(inputVal instanceof Array)) {
    return [inputVal];
  }
  return inputVal;
};
/**
 * Checks whether inputVal is valid boolean value or not
 *
 * ```
 * const x = checkBool('false')
 * ```
 * would return
 * ```
 * {
 *     value : false,
 *     valid : true
 * }
 * ```
 * @param inputVal input value
 * @returns {@link ValidationResult | Validation result}
 */
const checkBool = inputVal => {
  const valid = typeof inputVal === 'boolean' || inputVal === 'true' || inputVal === 'false';
  const value = typeof inputVal === 'boolean' ? inputVal : valid ? inputVal === 'true' : inputVal;
  return {
    valid,
    value
  };
};
/**
 *
 * @param inputVal
 */
const checkFile = inputVal => {
  const value = extractFileInfo(inputVal);
  const valid = value !== null;
  return {
    value: valid ? value : inputVal,
    valid
  };
};
/**
 * validates whether the mediaType is one present in the accepts list
 * @param mediaType
 * @param accepts
 */
const matchMediaType = (mediaType, accepts) => {
  return !mediaType || accepts.some(accept => {
    const trimmedAccept = accept.trim();
    const prefixAccept = trimmedAccept.split('/')[0];
    const suffixAccept = trimmedAccept.split('.')[1];
    return trimmedAccept.includes('*') && mediaType.startsWith(prefixAccept) || trimmedAccept.includes('.') && mediaType.endsWith(suffixAccept) || trimmedAccept === mediaType;
  });
};
/**
 * Validates an array of values using a validator function.
 * @param inputVal
 * @param validatorFn
 * @return an array containing two arrays, the first one with all the valid values and the second one with one invalid
 * value (if there is).
 */
const partitionArray = (inputVal, validatorFn) => {
  const value = toArray(inputVal);
  if (value == null) {
    return [[], [value]];
  }
  return value.reduce((acc, x) => {
    if (acc[1].length == 0) {
      const r = validatorFn(x);
      const index = r.valid ? 0 : 1;
      acc[index].push(r.value);
    }
    return acc;
  }, [[], []]);
};
const ValidConstraints = {
  date: ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'format'],
  string: ['minLength', 'maxLength', 'pattern'],
  number: ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
  array: ['minItems', 'maxItems', 'uniqueItems'],
  file: ['accept', 'maxFileSize']
};
/**
 * Implementation of all constraints defined by `adaptive form specification`
 */
const Constraints = {
  /**
   * Implementation of type constraint
   * @param constraint    `type` property of the form object
   * @param inputVal      value of the form object
   * @return {@link ValidationResult | validation result}
   */
  type: (constraint, inputVal) => {
    let value = inputVal;
    if (inputVal == undefined) {
      return {
        valid: true,
        value: inputVal
      };
    }
    let valid = true,
      res;
    switch (constraint) {
      case 'string':
        valid = true;
        value = inputVal.toString();
        break;
      case 'string[]':
        value = toArray(inputVal);
        break;
      case 'number':
        res = checkNumber(inputVal);
        value = res.value;
        valid = res.valid;
        break;
      case 'boolean':
        res = checkBool(inputVal);
        valid = res.valid;
        value = res.value;
        break;
      case 'integer':
        res = checkInteger(inputVal);
        valid = res.valid;
        value = res.value;
        break;
      case 'integer[]':
        res = partitionArray(inputVal, checkInteger);
        valid = res[1].length === 0;
        value = valid ? res[0] : inputVal;
        break;
      case 'file':
        // for file types only, we support setting value via an array
        res = checkFile(inputVal instanceof Array ? inputVal[0] : inputVal);
        valid = res.valid;
        value = res.value;
        break;
      case 'file[]':
        res = partitionArray(inputVal, checkFile);
        valid = res[1].length === 0;
        value = valid ? res[0] : inputVal;
        break;
      case 'number[]':
        res = partitionArray(inputVal, checkNumber);
        valid = res[1].length === 0;
        value = valid ? res[0] : inputVal;
        break;
      case 'boolean[]':
        res = partitionArray(inputVal, checkBool);
        valid = res[1].length === 0;
        value = valid ? res[0] : inputVal;
        break;
    }
    return {
      valid,
      value
    };
  },
  /**
   * Implementation of format constraint
   * @param constraint    `format` property of the form object
   * @param input         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  format: (constraint, input) => {
    let valid = true;
    const value = input;
    if (input === null) {
      return {
        value,
        valid
      };
    }
    let res;
    switch (constraint) {
      case 'date':
        res = dateRegex.exec((input || '').trim());
        if (res != null) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [match, year, month, date] = res;
          const [nMonth, nDate] = [+month, +date];
          const leapYear = isLeapYear(+year);
          valid = nMonth >= 1 && nMonth <= 12 && nDate >= 1 && nDate <= daysInMonth(leapYear, nMonth);
        } else {
          valid = false;
        }
        break;
      case 'data-url':
        // todo: input is of type file, do we need this format ? since value is always of type file object
        //res = dataUrlRegex.exec(input.trim());
        //valid = res != null;
        valid = true;
        break;
    }
    return {
      valid,
      value
    };
  },
  //todo : add support for date
  /**
   * Implementation of minimum constraint
   * @param constraint    `minimum` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  minimum: (constraint, value) => {
    return {
      valid: value >= constraint,
      value
    };
  },
  //todo : add support for date
  /**
   * Implementation of maximum constraint
   * @param constraint    `maximum` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  maximum: (constraint, value) => {
    return {
      valid: value <= constraint,
      value
    };
  },
  /**
   * Implementation of exclusiveMinimum constraint
   * @param constraint    `minimum` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  exclusiveMinimum: (constraint, value) => {
    return {
      valid: value > constraint,
      value
    };
  },
  //todo : add support for date
  /**
   * Implementation of exclusiveMaximum constraint
   * @param constraint    `maximum` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  exclusiveMaximum: (constraint, value) => {
    return {
      valid: value < constraint,
      value
    };
  },
  /**
   * Implementation of the minItems constraint
   * @param constraint `minItems` constraint from object
   * @param value value of the form object
   */
  minItems: (constraint, value) => {
    return {
      valid: value instanceof Array && value.length >= constraint,
      value
    };
  },
  /**
   * Implementation of the maxItems constraint
   * @param constraint `maxItems` constraint from object
   * @param value value of the form object
   */
  maxItems: (constraint, value) => {
    return {
      valid: value instanceof Array && value.length <= constraint,
      value
    };
  },
  /**
   * Implementation of the uniqueItems constraint
   * @param constraint `uniqueItems` constraint from object
   * @param value value of the form object
   */
  uniqueItems: (constraint, value) => {
    return {
      valid: !constraint || value instanceof Array && value.length === new Set(value).size,
      value
    };
  },
  /**
   * Implementation of minLength constraint
   * @param constraint    `minLength` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  minLength: (constraint, value) => {
    return _extends({}, Constraints.minimum(constraint, typeof value === 'string' ? value.length : 0), {
      value
    });
  },
  /**
   * Implementation of maxLength constraint
   * @param constraint    `maxLength` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  maxLength: (constraint, value) => {
    return _extends({}, Constraints.maximum(constraint, typeof value === 'string' ? value.length : 0), {
      value
    });
  },
  /**
   * Implementation of pattern constraint
   * @param constraint    `pattern` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  pattern: (constraint, value) => {
    let regex;
    if (typeof constraint === 'string') {
      regex = new RegExp(constraint);
    } else {
      regex = constraint;
    }
    return {
      valid: regex.test(value),
      value
    };
  },
  /**
   * Implementation of required constraint
   * @param constraint    `required` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  required: (constraint, value) => {
    const valid = constraint ? value != null && value !== '' : true;
    return {
      valid,
      value
    };
  },
  /**
   * Implementation of enum constraint
   * @param constraint    `enum` property of the form object
   * @param value         value of the form object
   * @return {@link ValidationResult | validation result}
   */
  enum: (constraint, value) => {
    return {
      valid: constraint.indexOf(value) > -1,
      value
    };
  },
  /**
   *
   * @param constraint
   * @param value
   */
  accept: (constraint, value) => {
    if (!constraint || constraint.length === 0 || value === null || value === undefined) {
      return {
        valid: true,
        value
      };
    }
    const tempValue = value instanceof Array ? value : [value];
    const invalidFile = tempValue.some(file => !matchMediaType(file.type, constraint));
    return {
      valid: !invalidFile,
      value
    };
  },
  /**
   * @param constraint
   * @param value
   */
  maxFileSize: (constraint, value) => {
    const sizeLimit = typeof constraint === 'string' ? getFileSizeInBytes(constraint) : constraint;
    return {
      valid: !(value instanceof FileObject) || value.size <= sizeLimit,
      value
    };
  }
};

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __decorate = function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines a form object field which implements {@link FieldModel | field model} interface
 */
class Field extends Scriptable {
  /**
   * @param params
   * @param _options
   * @private
   */
  constructor(params, _options) {
    super(params, _options);
    this._ruleNodeReference = [];
    this._applyDefaults();
    this.queueEvent(new Initialize());
    this.queueEvent(new ExecuteRule());
  }
  /**
   * @private
   */
  _initialize() {
    super._initialize();
    this.setupRuleNode();
  }
  ruleNodeReference() {
    var _this$type;
    if ((_this$type = this.type) != null && _this$type.endsWith('[]')) {
      this._ruleNodeReference = [];
    } else {
      this._ruleNodeReference = this;
    }
    return this._ruleNodeReference;
  }
  _getDefaults() {
    return {
      readOnly: false,
      enabled: true,
      visible: true,
      type: this._getFallbackType()
    };
  }
  /**
   * Returns the fallback type to be used for this field, in case type is not defined. Otherwise returns
   * undefined
   * @protected
   */
  _getFallbackType() {
    const type = this._jsonModel.type;
    if (typeof type !== 'string') {
      const _enum = this.enum;
      return _enum && _enum.length > 0 ? typeof _enum[0] : 'string';
    }
  }
  _applyDefaults() {
    Object.entries(this._getDefaults()).map(([key, value]) => {
      //@ts-ignore
      if (this._jsonModel[key] === undefined && value !== undefined) {
        //@ts-ignore
        this._jsonModel[key] = value;
      }
    });
    const value = this._jsonModel.value;
    if (value === undefined) {
      const typedRes = Constraints.type(this.getInternalType() || 'string', this._jsonModel.default);
      this._jsonModel.value = typedRes.value;
    }
    if (this._jsonModel.fieldType === undefined) {
      //@ts-ignore
      if (this._jsonModel.viewType) {
        //@ts-ignore
        if (this._jsonModel.viewType.startsWith('custom:')) {
          this.form.logger.error('viewType property has been removed. For custom types, use :type property');
        } else {
          this.form.logger.error('viewType property has been removed. Use fieldType property');
        }
        //@ts-ignore
        this._jsonModel.fieldType = this._jsonModel.viewType;
      } else {
        this._jsonModel.fieldType = defaultFieldTypes(this._jsonModel);
      }
    }
    if (this._jsonModel.enum === undefined) {
      const type = this._jsonModel.type;
      if (type === 'boolean') {
        this._jsonModel.enum = [true, false];
      }
    }
    if (typeof this._jsonModel.step !== 'number' || this._jsonModel.type !== 'number') {
      this._jsonModel.step = undefined;
    }
  }
  get editFormat() {
    return this._jsonModel.editFormat;
  }
  get displayFormat() {
    return this._jsonModel.displayFormat;
  }
  get placeholder() {
    return this._jsonModel.placeholder;
  }
  get readOnly() {
    return this._jsonModel.readOnly;
  }
  set readOnly(e) {
    this._setProperty('readOnly', e);
  }
  get language() {
    //todo: add this in the specification and take it as a property
    return Intl.DateTimeFormat().resolvedOptions().locale;
  }
  get enabled() {
    return this._jsonModel.enabled;
  }
  set enabled(e) {
    this._setProperty('enabled', e);
  }
  get valid() {
    return this._jsonModel.valid;
  }
  get emptyValue() {
    if (this._jsonModel.emptyValue === 'null') {
      return null;
    } else if (this._jsonModel.emptyValue === '' && this.type === 'string') {
      return '';
    } else {
      return undefined;
    }
  }
  get enum() {
    return this._jsonModel.enum;
  }
  set enum(e) {
    this._setProperty('enum', e);
  }
  get enumNames() {
    return this._jsonModel.enumNames;
  }
  set enumNames(e) {
    this._setProperty('enumNames', e);
  }
  get required() {
    return this._jsonModel.required || false;
  }
  set required(r) {
    this._setProperty('required', r);
  }
  get maximum() {
    return this._jsonModel.maximum;
  }
  set maximum(m) {
    this._setProperty('maximum', m);
  }
  get minimum() {
    return this._jsonModel.minimum;
  }
  set minimum(m) {
    this._setProperty('minimum', m);
  }
  /**
   * returns whether the value is empty. Empty value is either a '', undefined or null
   * @private
   */
  isEmpty() {
    return this._jsonModel.value === undefined || this._jsonModel.value === null || this._jsonModel.value === '';
  }
  get editValue() {
    const format = this.editFormat;
    if (this.format == 'date' && this.value != null && this.valid !== false) {
      return formatDate(new Date(this.value), this.language, format);
    } else {
      return this.value;
    }
  }
  get displayValue() {
    const format = this.displayFormat;
    if (this.format == 'date' && this.value != null && this.valid !== false) {
      return formatDate(new Date(this.value), this.language, format);
    } else {
      return this.value;
    }
  }
  getDataNodeValue(typedValue) {
    return this.isEmpty() ? this.emptyValue : typedValue;
  }
  get value() {
    if (this._jsonModel.value === undefined) {
      return null;
    } else {
      return this._jsonModel.value;
    }
  }
  set value(v) {
    const Constraints = this._getConstraintObject();
    const typeRes = Constraints.type(this.getInternalType() || 'string', v);
    const changes = this._setProperty('value', typeRes.value, false);
    let uniqueRes = {
      valid: true
    };
    if (changes.length > 0) {
      this._updateRuleNodeReference(typeRes.value);
      const dataNode = this.getDataNode();
      if (typeof dataNode !== 'undefined') {
        dataNode.setValue(this.getDataNodeValue(this._jsonModel.value), this._jsonModel.value, this);
      }
      if (this.parent.uniqueItems && this.parent.type === 'array') {
        // @ts-ignore
        uniqueRes = Constraints.uniqueItems(this.parent.uniqueItems, this.parent.getDataNode().$value);
      }
      let updates;
      if (typeRes.valid && uniqueRes.valid) {
        updates = this.evaluateConstraints();
      } else {
        const _changes = {
          'valid': typeRes.valid && uniqueRes.valid,
          'errorMessage': typeRes.valid && uniqueRes.valid ? '' : this.getErrorMessage('type')
        };
        updates = this._applyUpdates(['valid', 'errorMessage'], _changes);
      }
      if (updates.valid) {
        this.triggerValidationEvent(updates);
      }
      const changeAction = new Change({
        changes: changes.concat(Object.values(updates))
      });
      this.dispatch(changeAction);
    }
  }
  _updateRuleNodeReference(value) {
    var _this$type2;
    if ((_this$type2 = this.type) != null && _this$type2.endsWith('[]')) {
      if (value != null) {
        value.forEach((val, index) => {
          this._ruleNodeReference[index] = val;
        });
        while (value.length !== this._ruleNodeReference.length) {
          this._ruleNodeReference.pop();
        }
      } else {
        while (this._ruleNodeReference.length !== 0) {
          this._ruleNodeReference.pop();
        }
      }
    }
  }
  getInternalType() {
    return this.type;
  }
  valueOf() {
    // @ts-ignore
    const obj = this[target];
    const actualField = obj === undefined ? this : obj;
    actualField.ruleEngine.trackDependency(actualField);
    return actualField._jsonModel.value || null;
  }
  toString() {
    var _actualField$_jsonMod;
    // @ts-ignore
    const obj = this[target];
    const actualField = obj === undefined ? this : obj;
    return ((_actualField$_jsonMod = actualField._jsonModel.value) == null ? void 0 : _actualField$_jsonMod.toString()) || '';
  }
  /**
   * Returns the error message for a given constraint
   * @param constraint
   */
  getErrorMessage(constraint) {
    var _this$_jsonModel$cons;
    return ((_this$_jsonModel$cons = this._jsonModel.constraintMessages) == null ? void 0 : _this$_jsonModel$cons[constraint]) || '';
  }
  /**
   *
   * @private
   */
  _getConstraintObject() {
    return Constraints;
  }
  /**
   * returns whether the field is array type or not
   * @private
   */
  isArrayType() {
    return this.type ? this.type.indexOf('[]') > -1 : false;
  }
  /**
   *
   * @param value
   * @param constraints
   * @private
   */
  checkEnum(value, constraints) {
    if (this._jsonModel.enforceEnum === true && value != null) {
      const fn = constraints.enum;
      if (value instanceof Array && this.isArrayType()) {
        return value.every(x => fn(this.enum || [], x).valid);
      } else {
        return fn(this.enum || [], value).valid;
      }
    }
    return true;
  }
  /**
   * checks whether the value can be achieved by stepping the min/default value by the step constraint.
   * Basically to find a integer solution for n in the equation
   * initialValue + n * step = value
   * @param constraints
   * @private
   */
  checkStep() {
    const value = this._jsonModel.value;
    if (typeof this._jsonModel.step === 'number') {
      const initialValue = this._jsonModel.minimum || this._jsonModel.default || 0;
      return (value - initialValue) % this._jsonModel.step === 0;
    }
    return true;
  }
  /**
   * checks whether the validation expression returns a boolean value or not
   * @private
   */
  checkValidationExpression() {
    if (typeof this._jsonModel.validationExpression === 'string') {
      return this.executeExpression(this._jsonModel.validationExpression);
    }
    return true;
  }
  /**
   * Returns the applicable constraints for a given type
   * @private
   */
  getConstraints() {
    switch (this.type) {
      case 'string':
        switch (this.format) {
          case 'date':
            return ValidConstraints.date;
          case 'binary':
            return ValidConstraints.file;
          case 'data-url':
            return ValidConstraints.file;
          default:
            return ValidConstraints.string;
        }
      case 'file':
        return ValidConstraints.file;
      case 'number':
      case 'integer':
        return ValidConstraints.number;
    }
    if (this.isArrayType()) {
      return ValidConstraints.array;
    }
    return [];
  }
  /**
   * returns the format constraint
   */
  get format() {
    return this._jsonModel.format || '';
  }
  /**
   * @private
   */
  evaluateConstraints() {
    let constraint = 'type';
    const elem = this._jsonModel;
    const value = this._jsonModel.value;
    const Constraints = this._getConstraintObject();
    const supportedConstraints = this.getConstraints();
    let valid = true;
    if (valid) {
      valid = Constraints.required(this.required, value).valid && (this.isArrayType() && this.required ? value.length > 0 : true);
      constraint = 'required';
    }
    if (valid && value != this.emptyValue) {
      const invalidConstraint = supportedConstraints.find(key => {
        if (key in elem) {
          // @ts-ignore
          const restriction = elem[key];
          // @ts-ignore
          const fn = Constraints[key];
          if (value instanceof Array && this.isArrayType()) {
            if (ValidConstraints.array.indexOf(key) !== -1) {
              return !fn(restriction, value).valid;
            } else {
              return value.some(x => !fn(restriction, x).valid);
            }
          } else if (typeof fn === 'function') {
            return !fn(restriction, value).valid;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      if (invalidConstraint != null) {
        valid = false;
        constraint = invalidConstraint;
      } else {
        valid = this.checkEnum(value, Constraints);
        constraint = 'enum';
        if (valid && this.type === 'number') {
          valid = this.checkStep();
          constraint = 'step';
        }
        if (valid) {
          valid = this.checkValidationExpression();
          constraint = 'validationExpression';
        }
      }
    }
    if (!valid) {
      //@ts-ignore
      this.form.logger.log(`${constraint} constraint evaluation failed ${this[constraint]}. Received ${this._jsonModel.value}`);
    }
    const changes = {
      'valid': valid,
      'errorMessage': valid ? '' : this.getErrorMessage(constraint)
    };
    return this._applyUpdates(['valid', 'errorMessage'], changes);
  }
  triggerValidationEvent(changes) {
    if (changes.valid) {
      if (this.valid) {
        this.dispatch(new Valid());
      } else {
        this.dispatch(new Invalid());
      }
    }
  }
  /**
   * Validates the current form object
   */
  validate() {
    const changes = this.evaluateConstraints();
    if (changes.valid) {
      this.triggerValidationEvent(changes);
      this.notifyDependents(new Change({
        changes: Object.values(changes)
      }));
    }
    return this.valid ? [] : [new ValidationError(this.id, [this._jsonModel.errorMessage])];
  }
  importData(contextualDataModel) {
    this._bindToDataModel(contextualDataModel);
    const dataNode = this.getDataNode();
    // only if the value has changed, queue change event
    if (dataNode !== undefined && dataNode !== NullDataValue && dataNode.$value !== this._jsonModel.value) {
      const changeAction = propertyChange('value', dataNode.$value, this._jsonModel.value);
      this._jsonModel.value = dataNode.$value;
      this.queueEvent(changeAction);
    }
  }
  /**
   * @param name
   * @private
   */
  defaultDataModel(name) {
    return new DataValue(name, this.getDataNodeValue(this._jsonModel.value), this.type || 'string');
  }
  getState() {
    return _extends({}, super.getState(), {
      editValue: this.editValue,
      displayValue: this.displayValue
    });
  }
}
__decorate([dependencyTracked()], Field.prototype, "readOnly", null);
__decorate([dependencyTracked()], Field.prototype, "enabled", null);
__decorate([dependencyTracked()], Field.prototype, "valid", null);
__decorate([dependencyTracked()], Field.prototype, "enum", null);
__decorate([dependencyTracked()], Field.prototype, "enumNames", null);
__decorate([dependencyTracked()], Field.prototype, "required", null);
__decorate([dependencyTracked()], Field.prototype, "value", null);
function addNameToDataURL(dataURL, name) {
  return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}
function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}
async function processFile(file) {
  const {
    name,
    size,
    type
  } = file;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileObj = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(new FileObject({
        // @ts-ignore
        data: addNameToDataURL(event.target.result, name),
        type,
        name,
        size
      }));
    };
    reader.readAsDataURL(file.data);
  });
  return fileObj;
}
/**
 * Implementation of FileUpload runtime model which extends from {@link Field | field}
 */
class FileUpload extends Field {
  //private _files: FileObject[];
  _getDefaults() {
    return _extends({}, super._getDefaults(), {
      accept: ['audio/*', 'video/*', 'image/*', 'text/*', 'application/pdf'],
      maxFileSize: '2MB',
      type: 'file'
    });
  }
  /**
   * Returns the max file size in bytes as per IEC specification
   */
  get maxFileSize() {
    return getFileSizeInBytes(this._jsonModel.maxFileSize);
  }
  /**
   * Returns the list of mime types which file attachment can accept
   */
  get accept() {
    return this._jsonModel.accept;
  }
  /**
   * Checks whether there are any updates in the properties
   * @param propNames
   * @param updates
   * @private
   */
  _applyUpdates(propNames, updates) {
    return propNames.reduce((acc, propertyName) => {
      //@ts-ignore
      const prevValue = this._jsonModel[propertyName];
      const currentValue = updates[propertyName];
      if (currentValue !== prevValue) {
        acc[propertyName] = {
          propertyName,
          currentValue,
          prevValue
        };
        if (prevValue instanceof FileObject && typeof currentValue === 'object' && propertyName === 'value') {
          // @ts-ignore
          this._jsonModel[propertyName] = new FileObject(_extends({}, prevValue, {
            'data': currentValue.data
          }));
        } else {
          // @ts-ignore
          this._jsonModel[propertyName] = currentValue;
        }
      }
      return acc;
    }, {});
  }
  getInternalType() {
    var _this$type;
    return (_this$type = this.type) != null && _this$type.endsWith('[]') ? 'file[]' : 'file';
  }
  getDataNodeValue(typedValue) {
    let dataNodeValue = typedValue;
    if (dataNodeValue != null) {
      if (this.type === 'string') {
        var _dataNodeValue$data;
        dataNodeValue = (_dataNodeValue$data = dataNodeValue.data) == null ? void 0 : _dataNodeValue$data.toString();
      } else if (this.type === 'string[]') {
        dataNodeValue = dataNodeValue instanceof Array ? dataNodeValue : [dataNodeValue];
        dataNodeValue = dataNodeValue.map(_ => {
          var _$data;
          return _ == null ? void 0 : (_$data = _.data) == null ? void 0 : _$data.toString();
        });
      }
    }
    return dataNodeValue;
  }
  async _serialize() {
    const val = this._jsonModel.value;
    if (val === undefined) {
      return null;
    }
    // @ts-ignore
    const filesInfo = await processFiles(val instanceof Array ? val : [val]);
    return filesInfo;
  }
  importData(dataModel) {
    this._bindToDataModel(dataModel);
    const dataNode = this.getDataNode();
    if (dataNode !== undefined) {
      const value = dataNode == null ? void 0 : dataNode.$value;
      // only if not undefined, proceed further
      if (value != null) {
        const res = Constraints.type(this.getInternalType(), value);
        if (!res.valid) {
          this.form.logger.error(`unable to bind ${this.name} to data`);
        }
        // is this needed ?
        this.form.getEventQueue().queue(this, propertyChange('value', res.value, this._jsonModel.value));
        this._jsonModel.value = res.value;
      } else {
        this._jsonModel.value = null;
      }
    }
  }
}

/**
 * @param offValue
 * @private
 */
const requiredConstraint = offValue => (constraint, value) => {
  const valid = Constraints.required(constraint, value).valid && (!constraint || value != offValue);
  return {
    valid,
    value
  };
};
/**
 * Implementation of check box runtime model which extends from {@link Field | field} model
 */
class Checkbox extends Field {
  offValue() {
    const opts = this.enum;
    return opts.length > 1 ? opts[1] : null;
  }
  /**
   * @private
   */
  _getConstraintObject() {
    const baseConstraints = _extends({}, super._getConstraintObject());
    baseConstraints.required = requiredConstraint(this.offValue());
    return baseConstraints;
  }
  _getDefaults() {
    return _extends({}, super._getDefaults(), {
      enforceEnum: true
    });
  }
  /**
   * Returns the `enum` constraints from the json
   */
  get enum() {
    return this._jsonModel.enum || [];
  }
}

/**
 * Implementation of CheckBoxGroup runtime model which extends from {@link Field | field}
 */
class CheckboxGroup extends Field {
  /**
   * @param params
   * @param _options
   * @private
   */
  constructor(params, _options) {
    super(params, _options);
  }
  /**
   * converts the fallback type, if required, to an array. Since checkbox-group has an array type
   * @protected
   */
  _getFallbackType() {
    const fallbackType = super._getFallbackType();
    if (typeof fallbackType === 'string') {
      return `${fallbackType}[]`;
    }
  }
  _getDefaults() {
    return _extends({}, super._getDefaults(), {
      enforceEnum: true,
      enum: []
    });
  }
}

/*
 *
 *  * Copyright 2022 Adobe, Inc.
 *  *
 *  * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
class DateField extends Field {
  _applyDefaults() {
    super._applyDefaults();
    const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
    if (!this._jsonModel.editFormat) {
      this._jsonModel.editFormat = 'short';
    }
    if (!this._jsonModel.displayFormat) {
      this._jsonModel.displayFormat = this._jsonModel.editFormat;
    }
    if (!this._jsonModel.placeholder) {
      this._jsonModel.placeholder = getSkeleton(this._jsonModel.editFormat, locale);
    }
    if (!this._jsonModel.description) {
      this._jsonModel.description = `To enter today's date use ${formatDate(new Date(), locale, this._jsonModel.editFormat)}`;
    }
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Creates a child model inside the given parent
 * @param child
 * @param options
 * @private
 */
const createChild = (child, options) => {
  let retVal;
  if ('items' in child) {
    retVal = new Fieldset(child, options);
  } else {
    if (isFile(child) || child.fieldType === 'file-input') {
      // @ts-ignore
      retVal = new FileUpload(child, options);
    } else if (isCheckbox(child)) {
      retVal = new Checkbox(child, options);
    } else if (isCheckboxGroup(child)) {
      retVal = new CheckboxGroup(child, options);
    } else if (isDateField(child)) {
      retVal = new DateField(child, options);
    } else {
      retVal = new Field(child, options);
    }
  }
  options.form.fieldAdded(retVal);
  return retVal;
};
const defaults = {
  visible: true
};
/**
 * Defines a field set class which extends from {@link Container | container}
 */
class Fieldset extends Container {
  /**
   * @param params
   * @param _options
   * @private
   */
  constructor(params, _options) {
    super(params, _options);
    this._applyDefaults();
    this.queueEvent(new Initialize());
    this.queueEvent(new ExecuteRule());
  }
  _applyDefaults() {
    Object.entries(defaults).map(([key, value]) => {
      //@ts-ignore
      if (this._jsonModel[key] === undefined) {
        //@ts-ignore
        this._jsonModel[key] = value;
      }
    });
    if (this._jsonModel.dataRef && this._jsonModel.type === undefined) {
      this._jsonModel.type = 'object';
    }
  }
  get type() {
    const ret = super.type;
    if (ret === 'array' || ret === 'object') {
      return ret;
    }
    return undefined;
  }
  // @ts-ignore
  _createChild(child, options) {
    const {
      parent = this
    } = options;
    return createChild(child, {
      form: this.form,
      parent: parent
    });
  }
  get items() {
    return super.items;
  }
  get value() {
    return null;
  }
  get fieldType() {
    return 'panel';
  }
  get enabled() {
    return this._jsonModel.enabled;
  }
  set enabled(e) {
    this._setProperty('enabled', e);
  }
}
const levels = {
  off: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};
/**
 * @private
 */
class Logger {
  debug(msg) {
    this.log(msg, 'debug');
  }
  info(msg) {
    this.log(msg, 'info');
  }
  warn(msg) {
    this.log(msg, 'warn');
  }
  error(msg) {
    this.log(msg, 'error');
  }
  log(msg, level) {
    if (this.logLevel !== 0 && this.logLevel <= levels[level]) {
      console[level](msg);
    }
  }
  constructor(logLevel = 'off') {
    this.logLevel = levels[logLevel];
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Implementation of event node
 * @private
 */
class EventNode {
  constructor(_node, _event) {
    this._node = _node;
    this._event = _event;
  }
  get node() {
    return this._node;
  }
  get event() {
    return this._event;
  }
  isEqual(that) {
    return that !== null && that !== undefined && this._node == that._node && this._event.type == that._event.type;
  }
  toString() {
    return this._node.id + '__' + this.event.type;
  }
  valueOf() {
    return this.toString();
  }
}
/**
 * Implementation of event queue. When a user event, like change or click, is captured the expression to be evaluated
 * must be put in an Event Queue and then evaluated.
 * @private
 */
class EventQueue {
  constructor(logger = new Logger('off')) {
    this._isProcessing = false;
    this._pendingEvents = [];
    this.logger = logger;
    this._runningEventCount = {};
  }
  get length() {
    return this._pendingEvents.length;
  }
  get isProcessing() {
    return this._isProcessing;
  }
  isQueued(node, event) {
    const evntNode = new EventNode(node, event);
    return this._pendingEvents.find(x => evntNode.isEqual(x)) !== undefined;
  }
  queue(node, events, priority = false) {
    if (!node || !events) {
      return;
    }
    if (!(events instanceof Array)) {
      events = [events];
    }
    events.forEach(e => {
      const evntNode = new EventNode(node, e);
      const counter = this._runningEventCount[evntNode.valueOf()] || 0;
      if (counter < EventQueue.MAX_EVENT_CYCLE_COUNT) {
        this.logger.info(`Queued event : ${e.type} node: ${node.id} - ${node.name}`);
        //console.log(`Event Details ${e.toString()}`)
        if (priority) {
          const index = this._isProcessing ? 1 : 0;
          this._pendingEvents.splice(index, 0, evntNode);
        } else {
          this._pendingEvents.push(evntNode);
        }
        this._runningEventCount[evntNode.valueOf()] = counter + 1;
      } else {
        this.logger.info(`Skipped queueing event : ${e.type} node: ${node.id} - ${node.name} with count=${counter}`);
      }
    });
  }
  runPendingQueue() {
    if (this._isProcessing) {
      return;
    }
    this._isProcessing = true;
    while (this._pendingEvents.length > 0) {
      const e = this._pendingEvents[0];
      this.logger.info(`Dequeued event : ${e.event.type} node: ${e.node.id} - ${e.node.name}`);
      //console.log(`Event Details ${e.event.toString()}`);
      e.node.executeAction(e.event);
      this._pendingEvents.shift();
    }
    this._runningEventCount = {};
    this._isProcessing = false;
  }
}
EventQueue.MAX_EVENT_CYCLE_COUNT = 10;

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const request$1 = (url, data = null, options = {}) => {
  const opts = _extends({}, defaultRequestOptions, options);
  return fetch(url, _extends({}, opts, {
    body: data
  })).then(response => {
    var _response$headers$get;
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response != null && (_response$headers$get = response.headers.get('Content-Type')) != null && _response$headers$get.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  });
};
const defaultRequestOptions = {
  method: 'GET'
};
const getCustomEventName = name => {
  const eName = name;
  if (eName.length > 0 && eName.startsWith('custom:')) {
    return eName.substring('custom:'.length);
  }
  return eName;
};
/**
 * Implementation of generic request API. This API can be used to make external web request
 * @param context                   expression execution context(consists of current form, current field, current event)
 * @param uri                       request URI
 * @param httpVerb                  http verb (for example, GET or POST)
 * @param payload                   request payload
 * @param success                   success handler
 * @param error                     error handler
 * @param headers                   headers
 * @private
 */
const request = async (context, uri, httpVerb, payload, success, error, headers) => {
  const endpoint = uri;
  const requestOptions = {
    method: httpVerb
  };
  let result;
  let inputPayload;
  try {
    if (payload && payload instanceof FileObject && payload.data instanceof File) {
      // todo: have to implement array type
      const formData = new FormData();
      formData.append(payload.name, payload.data);
      inputPayload = formData;
    } else if (payload instanceof FormData) {
      inputPayload = payload;
    } else if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
      var _requestOptions$heade;
      const headerNames = Object.keys(headers);
      if (headerNames.length > 0) {
        requestOptions.headers = _extends({}, headers, headerNames.indexOf('Content-Type') === -1 ? {
          'Content-Type': 'application/json'
        } : {});
      } else {
        requestOptions.headers = {
          'Content-Type': 'application/json'
        };
      }
      const contentType = (requestOptions == null ? void 0 : (_requestOptions$heade = requestOptions.headers) == null ? void 0 : _requestOptions$heade['Content-Type']) || 'application/json';
      if (contentType === 'application/json') {
        inputPayload = JSON.stringify(payload);
      } else if (contentType.indexOf('multipart/form-data') > -1) {
        inputPayload = multipartFormData(payload);
      } else if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        inputPayload = urlEncoded(payload);
      }
    }
    result = await request$1(endpoint, inputPayload, requestOptions);
  } catch (e) {
    //todo: define error payload
    context.form.logger.error('Error invoking a rest API');
    const _eName = getCustomEventName(error);
    context.form.dispatch(new CustomEvent$1(_eName, {}, true));
    return;
  }
  const eName = getCustomEventName(success);
  context.form.dispatch(new CustomEvent$1(eName, result, true));
};
const urlEncoded = data => {
  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null && typeof value === 'object') {
      formData.append(key, jsonString(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
/**
 * Create multi part form data using form data and form attachments
 * @param data              form data
 * @param attachments       form events
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multipartFormData = (data, attachments) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null && typeof value === 'object') {
      formData.append(key, jsonString(value));
    } else {
      formData.append(key, value);
    }
  });
  const addAttachmentToFormData = (objValue, formData) => {
    if ((objValue == null ? void 0 : objValue.data) instanceof File) {
      let attIdentifier = `${objValue == null ? void 0 : objValue.dataRef}/${objValue == null ? void 0 : objValue.name}`;
      if (!attIdentifier.startsWith('/')) {
        attIdentifier = `/${attIdentifier}`;
      }
      formData.append(attIdentifier, objValue.data);
    }
  };
  if (attachments) {
    // @ts-ignore
    Object.keys(attachments).reduce((acc, curr) => {
      const objValue = attachments[curr];
      if (objValue && objValue instanceof Array) {
        return [...acc, ...objValue.map(x => addAttachmentToFormData(x, formData))];
      } else {
        return [...acc, addAttachmentToFormData(objValue, formData)];
      }
    }, []);
  }
  return formData;
};
const submit = async (context, success, error, submitAs = 'application/json', input_data = null) => {
  const endpoint = context.form.action;
  let data = input_data;
  if (typeof data != 'object' || data == null) {
    data = context.form.exportData();
  }
  // todo: have to implement sending of attachments here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const attachments = getAttachments(context.form);
  let submitContentType = submitAs;
  let formData;
  if (Object.keys(attachments).length > 0 || submitAs === 'multipart/form-data') {
    formData = multipartFormData({
      'data': data
    }, attachments);
    submitContentType = 'multipart/form-data';
  } else {
    formData = {
      'data': data
    };
  }
  // submitContentType = submitAs;
  // note: don't send multipart/form-data let browser decide on the content type
  await request(context, endpoint, 'POST', formData, success, error, {
    'Content-Type': submitContentType
  });
};
/**
 * Helper function to create an action
 * @param name          name of the event
 * @param payload       event payload
 * @param dispatch      true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
 * @private
 */
const createAction = (name, payload = {}) => {
  switch (name) {
    case 'change':
      return new Change(payload);
    case 'submit':
      return new Submit(payload);
    case 'click':
      return new Click(payload);
    case 'addItem':
      return new AddItem(payload);
    case 'removeItem':
      return new RemoveItem(payload);
    default:
      console.error('invalid action');
  }
};
/**
 * Implementation of function runtime
 * @private
 */
class FunctionRuntimeImpl {
  constructor() {
    this.customFunctions = {};
  }
  registerFunctions(functions) {
    Object.entries(functions).forEach(([name, funcDef]) => {
      let finalFunction = funcDef;
      if (typeof funcDef === 'function') {
        finalFunction = {
          _func: args => {
            // eslint-disable-next-line @typescript-eslint/ban-types
            return funcDef(...args);
          },
          _signature: []
        };
      }
      if (!finalFunction.hasOwnProperty('_func')) {
        console.warn(`Unable to register function with name ${name}.`);
        return;
      }
      this.customFunctions[name] = finalFunction;
    });
  }
  unregisterFunctions(...names) {
    names.forEach(name => {
      if (name in this.customFunctions) {
        delete this.customFunctions[name];
      }
    });
  }
  getFunctions() {
    // todo: remove these once json-formula exposes a way to call them from custom functions
    function isArray(obj) {
      if (obj !== null) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      }
      return false;
    }
    function valueOf(a) {
      if (a === null || a === undefined) {
        return a;
      }
      if (isArray(a)) {
        return a.map(i => valueOf(i));
      }
      return a.valueOf();
    }
    function toString(a) {
      if (a === null || a === undefined) {
        return '';
      }
      return a.toString();
    }
    const defaultFunctions = {
      validate: {
        _func: (args, data, interpreter) => {
          const element = args[0];
          let validation;
          if (typeof element === 'string' || typeof element === 'undefined') {
            validation = interpreter.globals.form.validate();
          } else {
            validation = interpreter.globals.form.getElement(element.$id).validate();
          }
          if (Array.isArray(validation) && validation.length) {
            interpreter.globals.form.logger.error('Form Validation Error');
          }
          return validation;
        },
        _signature: []
      },
      setFocus: {
        _func: (args, data, interpreter) => {
          const element = args[0];
          try {
            const field = interpreter.globals.form.getElement(element.$id);
            interpreter.globals.form.setFocus(field);
          } catch (e) {
            interpreter.globals.form.logger.error('Invalid argument passed in setFocus. An element is expected');
          }
        },
        _signature: []
      },
      getData: {
        _func: (args, data, interpreter) => {
          // deprecated. left for backward compatability.
          interpreter.globals.form.logger.warn('The `getData` function is depricated. Use `exportData` instead.');
          return interpreter.globals.form.exportData();
        },
        _signature: []
      },
      exportData: {
        _func: (args, data, interpreter) => {
          return interpreter.globals.form.exportData();
        },
        _signature: []
      },
      importData: {
        _func: (args, data, interpreter) => {
          const inputData = args[0];
          if (typeof inputData === 'object' && inputData !== null) {
            interpreter.globals.form.importData(inputData);
          }
          return {};
        },
        _signature: []
      },
      submitForm: {
        _func: (args, data, interpreter) => {
          // success: string, error: string, submit_as: 'json' | 'multipart' = 'json', data: any = null
          const success = toString(args[0]);
          const error = toString(args[1]);
          const submit_as = args.length > 2 ? toString(args[2]) : 'application/json';
          const submit_data = args.length > 3 ? valueOf(args[3]) : null;
          interpreter.globals.form.dispatch(new Submit({
            success,
            error,
            submit_as,
            data: submit_data
          }));
          return {};
        },
        _signature: []
      },
      // todo: only supports application/json for now
      request: {
        _func: (args, data, interpreter) => {
          const uri = toString(args[0]);
          const httpVerb = toString(args[1]);
          const payload = valueOf(args[2]);
          let success,
            error,
            headers = {};
          if (typeof args[3] === 'string') {
            interpreter.globals.form.logger.warn('This usage of request is deprecated. Please see the documentation and update');
            success = valueOf(args[3]);
            error = valueOf(args[4]);
          } else {
            headers = valueOf(args[3]);
            success = valueOf(args[4]);
            error = valueOf(args[5]);
          }
          request(interpreter.globals, uri, httpVerb, payload, success, error, headers);
          return {};
        },
        _signature: []
      },
      /**
       *
       * @name dispatchEvent
       * @param [element] element on which to trigger the event. If not defined the event will be triggered on entire form
       * @param eventName name of the event to trigger
       * @param payload payload to pass in the event
       */
      dispatchEvent: {
        _func: (args, data, interpreter) => {
          const element = args[0];
          let eventName = valueOf(args[1]);
          let payload = args.length > 2 ? valueOf(args[2]) : undefined;
          let dispatch = false;
          if (typeof element === 'string') {
            payload = eventName;
            eventName = element;
            dispatch = true;
          }
          let event;
          if (eventName.startsWith('custom:')) {
            event = new CustomEvent$1(eventName.substring('custom:'.length), payload, dispatch);
          } else {
            event = createAction(eventName, payload);
          }
          if (event != null) {
            if (typeof element === 'string') {
              interpreter.globals.form.dispatch(event);
            } else {
              interpreter.globals.form.getElement(element.$id).dispatch(event);
            }
          }
          return {};
        },
        _signature: []
      }
    };
    return _extends({}, defaultFunctions, this.customFunctions);
  }
}
const FunctionRuntime = new FunctionRuntimeImpl();

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Defines `form model` which implements {@link FormModel | form model}
 */
class Form extends Container {
  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @param n
   * @param _ruleEngine
   * @param _eventQueue
   * @param logLevel
   * @private
   */
  constructor(n, _ruleEngine, _eventQueue = new EventQueue(), logLevel = 'off') {
    //@ts-ignore
    super(n, {});
    this._fields = {};
    this._invalidFields = [];
    this.dataRefRegex = /("[^"]+?"|[^.]+?)(?:\.|$)/g;
    this._ruleEngine = _ruleEngine;
    this._eventQueue = _eventQueue;
    this._logger = new Logger(logLevel);
    this.queueEvent(new Initialize());
    this.queueEvent(new ExecuteRule());
    this._ids = IdGenerator();
    this._bindToDataModel(new DataGroup('$form', {}));
    this._initialize();
    this.queueEvent(new FormLoad());
  }
  get logger() {
    return this._logger;
  }
  get metaData() {
    const metaData = this._jsonModel.metadata || {};
    return new FormMetaData(metaData);
  }
  get action() {
    return this._jsonModel.action;
  }
  _createChild(child) {
    return createChild(child, {
      form: this,
      parent: this
    });
  }
  importData(dataModel) {
    this._bindToDataModel(new DataGroup('$form', dataModel));
    this.syncDataAndFormModel(this.getDataNode());
    this._eventQueue.runPendingQueue();
  }
  exportData() {
    var _this$getDataNode;
    return (_this$getDataNode = this.getDataNode()) == null ? void 0 : _this$getDataNode.$value;
  }
  setFocus(field) {
    const parent = field.parent;
    const currentField = field;
    while (parent != null && parent.activeChild != currentField) {
      parent.activeChild = currentField;
    }
  }
  /**
   * Returns the current state of the form
   *
   * To access the form data and attachments, one needs to use the `data` and `attachments` property.
   * For example,
   * ```
   * const data = form.getState().data
   * const attachments = form.getState().attachments
   * ```
   */
  getState() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const res = super.getState();
    res.id = '$form';
    Object.defineProperty(res, 'data', {
      get: function () {
        return self.exportData();
      }
    });
    Object.defineProperty(res, 'attachments', {
      get: function () {
        return getAttachments(self);
      }
    });
    return res;
  }
  get type() {
    return 'object';
  }
  isTransparent() {
    return false;
  }
  get form() {
    return this;
  }
  get ruleEngine() {
    return this._ruleEngine;
  }
  getUniqueId() {
    if (this._ids == null) {
      return '';
    }
    return this._ids.next().value;
  }
  /**
   * @param field
   * @private
   */
  fieldAdded(field) {
    this._fields[field.id] = field;
    field.subscribe(action => {
      if (this._invalidFields.indexOf(action.target.id) === -1) {
        this._invalidFields.push(action.target.id);
      }
    }, 'invalid');
    field.subscribe(action => {
      const index = this._invalidFields.indexOf(action.target.id);
      if (index > -1) {
        this._invalidFields.splice(index, 1);
      }
    }, 'valid');
    field.subscribe(action => {
      //@ts-ignore
      const field = action.target.getState();
      if (field) {
        const fieldChangedAction = new FieldChanged(action.payload.changes, field);
        this.dispatch(fieldChangedAction);
      }
    });
  }
  validate() {
    const validationErrors = super.validate();
    // trigger event on form so that user's can customize their application
    this.dispatch(new ValidationComplete(validationErrors));
    return validationErrors;
  }
  /**
   * Checks if the given form is valid or not
   * @returns `true`, if form is valid, `false` otherwise
   */
  isValid() {
    return this._invalidFields.length === 0;
  }
  /**
   * @param field
   * @private
   */
  dispatch(action) {
    if (action.type === 'submit') {
      super.queueEvent(action);
      this._eventQueue.runPendingQueue();
    } else {
      super.dispatch(action);
    }
  }
  /**
   * @param action
   * @private
   */
  executeAction(action) {
    if (action.type !== 'submit' || this._invalidFields.length === 0) {
      super.executeAction(action);
    }
  }
  /**
   * @param action
   * @param context
   * @private
   */
  submit(action, context) {
    // if no errors, only then submit
    if (this.validate().length === 0) {
      const payload = (action == null ? void 0 : action.payload) || {};
      submit(context, payload == null ? void 0 : payload.success, payload == null ? void 0 : payload.error, payload == null ? void 0 : payload.submit_as, payload == null ? void 0 : payload.data);
    }
  }
  getElement(id) {
    if (id == this.id) {
      return this;
    }
    return this._fields[id];
  }
  get qualifiedName() {
    return '$form';
  }
  /**
   * @private
   */
  getEventQueue() {
    return this._eventQueue;
  }
  get name() {
    return '$form';
  }
  get value() {
    return null;
  }
  get id() {
    return '$form';
  }
  get title() {
    return this._jsonModel.title || '';
  }
}

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Implementation of rule engine
 * @private
 */
class RuleEngine {
  constructor() {
    this._globalNames = ['$form', '$field', '$event'];
  }
  compileRule(rule) {
    const customFunctions = FunctionRuntime.getFunctions();
    return new Oe(rule, customFunctions, undefined, this._globalNames);
  }
  execute(node, data, globals, useValueOf = false) {
    const oldContext = this._context;
    this._context = globals;
    let res = undefined;
    try {
      node.debug = []; // clean previous debug info
      res = node.search(data, globals);
    } catch (err) {
      var _this$_context, _this$_context$form, _this$_context$form$l;
      (_this$_context = this._context) == null ? void 0 : (_this$_context$form = _this$_context.form) == null ? void 0 : (_this$_context$form$l = _this$_context$form.logger) == null ? void 0 : _this$_context$form$l.error(err);
    }
    for (const debugInfo of node.debug) {
      var _this$_context2, _this$_context2$form, _this$_context2$form$;
      (_this$_context2 = this._context) == null ? void 0 : (_this$_context2$form = _this$_context2.form) == null ? void 0 : (_this$_context2$form$ = _this$_context2$form.logger) == null ? void 0 : _this$_context2$form$.debug(debugInfo);
    }
    let finalRes = res;
    if (useValueOf) {
      if (typeof res === 'object' && res !== null) {
        finalRes = Object.getPrototypeOf(res).valueOf.call(res);
      }
    }
    this._context = oldContext;
    return finalRes;
  }
  /**
   * Listen to subscriber for
   * @param subscriber
   */
  trackDependency(subscriber) {
    if (this._context && this._context.field !== undefined && this._context.field !== subscriber) {
      subscriber._addDependent(this._context.field);
    }
  }
}

/**
 * Creates form instance using form model definition as per `adaptive form specification`
 * @param formModel form model definition
 * @param callback a callback that recieves the FormModel instance that gets executed before any event in the Form
 * is executed
 * @param logLevel Logging Level for the form. Setting it off will disable the logging
 * @param fModel existing form model, this is additional optimization to prevent creation of form instance
 * @returns {@link FormModel | form model}
 */
const createFormInstance = (formModel, callback, logLevel = 'error', fModel = undefined) => {
  try {
    let f = fModel;
    if (f == null) {
      f = new Form(_extends({}, formModel), new RuleEngine(), new EventQueue(new Logger(logLevel)), logLevel);
    }
    const formData = formModel == null ? void 0 : formModel.data;
    if (formData) {
      f.importData(formData);
    }
    if (typeof callback === 'function') {
      callback(f);
    }
    // Once the field or panel is initialized, execute the initialization script
    // this means initialization happens after prefill and restore
    // Before execution of calcExp, visibleExp, enabledExp, validate, options, navigationChange, we execute init script
    //f.queueEvent(new Initialize(undefined, true));
    //f.queueEvent(new ExecuteRule(undefined, true));
    f.getEventQueue().runPendingQueue();
    return f;
  } catch (e) {
    console.error(`Unable to create an instance of the Form ${e}`);
    throw new Error(e);
  }
};
console.timeEnd("script af-core");

const Actions = {
  Click,
  Change,
  Submit,
  Blur,
  AddItem,
  RemoveItem
};

class Button extends FormFieldBase {
  /**
   * Each FormField has a data attribute class that is prefixed along with the global namespace to
   * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
   * data-{NS}-{IS}-x=""
   * @type {string}
   */

  getQuestionMarkDiv() {
    return null;
  }
  getLabel() {
    return null;
  }
  getWidget() {
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
    var _this$getWidget;
    (_this$getWidget = this.getWidget()) == null ? void 0 : _this$getWidget.addEventListener("click", () => {
      this._model.dispatch(new Actions.Click());
    });
  }
  getbemBlock() {
    return Button.bemBlock;
  }
  getIS() {
    return Button.IS;
  }
  // TODO - Icon part of spec?
  createView() {
    let button = document.createElement("button");
    button.type = "button";
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
Button.NS = Constants.NS;
Button.IS = "adaptiveFormButton";
Button.bemBlock = 'cmp-adaptiveform-button';
Button.selectors = {
  self: "[data-" + Button.NS + '-is="' + Button.IS + '"]'
};

var _widget = /*#__PURE__*/_classPrivateFieldLooseKey("widget");
var _model = /*#__PURE__*/_classPrivateFieldLooseKey("model");
var _options = /*#__PURE__*/_classPrivateFieldLooseKey("options");
var _defaultOptions = /*#__PURE__*/_classPrivateFieldLooseKey("defaultOptions");
var _matchArray = /*#__PURE__*/_classPrivateFieldLooseKey("matchArray");
var _regex = /*#__PURE__*/_classPrivateFieldLooseKey("regex");
var _processedValue = /*#__PURE__*/_classPrivateFieldLooseKey("processedValue");
var _engRegex = /*#__PURE__*/_classPrivateFieldLooseKey("engRegex");
var _writtenInLocale = /*#__PURE__*/_classPrivateFieldLooseKey("writtenInLocale");
var _previousCompositionVal = /*#__PURE__*/_classPrivateFieldLooseKey("previousCompositionVal");
var _toLatinForm = /*#__PURE__*/_classPrivateFieldLooseKey("toLatinForm");
var _attachEventHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("attachEventHandlers");
var _attachCompositionEventHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("attachCompositionEventHandlers");
var _getDigits = /*#__PURE__*/_classPrivateFieldLooseKey("getDigits");
var _escape = /*#__PURE__*/_classPrivateFieldLooseKey("escape");
var _compositionUpdateCallback = /*#__PURE__*/_classPrivateFieldLooseKey("compositionUpdateCallback");
var _handleKeyInput = /*#__PURE__*/_classPrivateFieldLooseKey("handleKeyInput");
var _handleKeyDown = /*#__PURE__*/_classPrivateFieldLooseKey("handleKeyDown");
var _isValidChar = /*#__PURE__*/_classPrivateFieldLooseKey("isValidChar");
var _handleKeyPress = /*#__PURE__*/_classPrivateFieldLooseKey("handleKeyPress");
var _handlePaste = /*#__PURE__*/_classPrivateFieldLooseKey("handlePaste");
var _handleCut = /*#__PURE__*/_classPrivateFieldLooseKey("handleCut");
var _convertValueToLocale = /*#__PURE__*/_classPrivateFieldLooseKey("convertValueToLocale");
var _convertValueFromLocale = /*#__PURE__*/_classPrivateFieldLooseKey("convertValueFromLocale");
var _isValueSame = /*#__PURE__*/_classPrivateFieldLooseKey("isValueSame");
/**
 * This class is responsible for interacting with the numeric input widget. It implements edit/display format
 * for numeric input, along with the following features
 * - Convert's input type number to text to support display/edit format (for example `$` symbol)
 * - One cannot type or paste alphabets in the html input element
 */
class NumericInputWidget {
  // passed by reference

  //TODO: to support writing in different locales \d should be replaced by [0-9] for different locales

  constructor(_widget2, model) {
    Object.defineProperty(this, _isValueSame, {
      value: _isValueSame2
    });
    Object.defineProperty(this, _convertValueFromLocale, {
      value: _convertValueFromLocale2
    });
    Object.defineProperty(this, _convertValueToLocale, {
      value: _convertValueToLocale2
    });
    Object.defineProperty(this, _handleCut, {
      value: _handleCut2
    });
    Object.defineProperty(this, _handlePaste, {
      value: _handlePaste2
    });
    Object.defineProperty(this, _handleKeyPress, {
      value: _handleKeyPress2
    });
    Object.defineProperty(this, _isValidChar, {
      value: _isValidChar2
    });
    Object.defineProperty(this, _handleKeyDown, {
      value: _handleKeyDown2
    });
    Object.defineProperty(this, _handleKeyInput, {
      value: _handleKeyInput2
    });
    Object.defineProperty(this, _compositionUpdateCallback, {
      value: _compositionUpdateCallback2
    });
    Object.defineProperty(this, _escape, {
      value: _escape2
    });
    Object.defineProperty(this, _getDigits, {
      value: _getDigits2
    });
    Object.defineProperty(this, _attachCompositionEventHandlers, {
      value: _attachCompositionEventHandlers2
    });
    Object.defineProperty(this, _attachEventHandlers, {
      value: _attachEventHandlers2
    });
    Object.defineProperty(this, _toLatinForm, {
      value: _toLatinForm2
    });
    Object.defineProperty(this, _widget, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _model, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _defaultOptions, {
      writable: true,
      value: {
        value: null,
        curValue: null,
        pos: 0,
        lengthLimitVisible: true,
        zero: "0",
        decimal: ".",
        minus: "-"
      }
    });
    Object.defineProperty(this, _matchArray, {
      writable: true,
      value: {
        "integer": "^[+-]?{digits}*$",
        "decimal": "^[+-]?{digits}{leading}({decimal}{digits}{fraction})?$",
        "float": "^[+-]?{digits}*({decimal}{digits}*)?$"
      }
    });
    Object.defineProperty(this, _regex, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _processedValue, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _engRegex, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _writtenInLocale, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _previousCompositionVal, {
      writable: true,
      value: ""
    });
    // initialize the widget and model
    _classPrivateFieldLooseBase(this, _widget)[_widget] = _widget2;
    _classPrivateFieldLooseBase(this, _model)[_model] = model;
    // initialize options for backward compatibility
    _classPrivateFieldLooseBase(this, _options)[_options] = Object.assign({}, _classPrivateFieldLooseBase(this, _defaultOptions)[_defaultOptions], _classPrivateFieldLooseBase(this, _model)[_model]._jsonModel);
    let matchStr = _classPrivateFieldLooseBase(this, _matchArray)[_matchArray][_classPrivateFieldLooseBase(this, _options)[_options].dataType];
    if (matchStr) {
      let ld = _classPrivateFieldLooseBase(this, _options)[_options].leadDigits,
        fd = _classPrivateFieldLooseBase(this, _options)[_options].fracDigits,
        ldstr = ld && ld !== -1 ? "{0," + ld + "}" : "*",
        fdstr = fd && fd !== -1 ? "{0," + fd + "}" : "*",
        _matchStr = _matchStr.replace("{leading}", ldstr).replace("{fraction}", fdstr),
        localeStr = _matchStr.replace(/{digits}/g, _classPrivateFieldLooseBase(this, _getDigits)[_getDigits]()).replace("{decimal}", _classPrivateFieldLooseBase(this, _escape)[_escape](_classPrivateFieldLooseBase(this, _options)[_options].decimal)),
        engStr = _matchStr.replace(/{digits}/g, "[0-9]").replace("{decimal}", "\\.");
      _classPrivateFieldLooseBase(this, _processedValue)[_processedValue] = !(_classPrivateFieldLooseBase(this, _getDigits)[_getDigits]() === "[0123456789]" && _classPrivateFieldLooseBase(this, _options)[_options].decimal === ".");
      _classPrivateFieldLooseBase(this, _regex)[_regex] = new RegExp(localeStr, "g");
      _classPrivateFieldLooseBase(this, _engRegex)[_engRegex] = new RegExp(engStr, "g");
    }
    // change the input type to text for patterns
    _classPrivateFieldLooseBase(this, _widget)[_widget].setAttribute("type", "text");
    _classPrivateFieldLooseBase(this, _attachEventHandlers)[_attachEventHandlers](_widget2);
  }
  getValue(value) {
    // we support full width, half width and locale specific numbers
    value = _classPrivateFieldLooseBase(this, _toLatinForm)[_toLatinForm](value);
    if (value.length > 0 && _classPrivateFieldLooseBase(this, _processedValue)[_processedValue] && !value.match(_classPrivateFieldLooseBase(this, _engRegex)[_engRegex])) {
      _classPrivateFieldLooseBase(this, _writtenInLocale)[_writtenInLocale] = true;
      value = _classPrivateFieldLooseBase(this, _convertValueFromLocale)[_convertValueFromLocale](value);
    } else {
      _classPrivateFieldLooseBase(this, _writtenInLocale)[_writtenInLocale] = false;
    }
    if (value && value.length >= _classPrivateFieldLooseBase(this, _options)[_options].combCells) value = value.slice(0, _classPrivateFieldLooseBase(this, _options)[_options].combCells);
    _classPrivateFieldLooseBase(this, _previousCompositionVal)[_previousCompositionVal] = value;
    return value;
  }
  trigger(event, detail) {
    if (!_classPrivateFieldLooseBase(this, _widget)[_widget]) {
      return this;
    }
    const eventName = event.split('.')[0];
    const isNativeEvent = typeof document.body[`on${eventName}`] !== 'undefined';
    if (isNativeEvent) {
      _classPrivateFieldLooseBase(this, _widget)[_widget].dispatchEvent(new Event(eventName));
      return this;
    }
    const customEvent = new CustomEvent(eventName, {
      detail: detail || null
    });
    _classPrivateFieldLooseBase(this, _widget)[_widget].dispatchEvent(customEvent);
    return this;
  }
  getHTMLSupportedAttr(domElement, attr) {
    try {
      return domElement[attr];
    } catch (err) {
      return undefined;
    }
  }
  isNonPrintableKey(key) {
    return key // In IE, event.key returns words instead of actual characters for some keys.
    && !['MozPrintableKey', 'Divide', 'Multiply', 'Subtract', 'Add', 'Enter', 'Decimal', 'Spacebar', 'Del'].includes(key) && key.length !== 1;
  }
  setValue(value) {
    // if the value is same, don't do anything
    if (!_classPrivateFieldLooseBase(this, _isValueSame)[_isValueSame]()) {
      if (value && _classPrivateFieldLooseBase(this, _writtenInLocale)[_writtenInLocale]) {
        _classPrivateFieldLooseBase(this, _widget)[_widget].value = _classPrivateFieldLooseBase(this, _convertValueToLocale)[_convertValueToLocale](value);
      } else {
        _classPrivateFieldLooseBase(this, _widget)[_widget].value = _classPrivateFieldLooseBase(this, _model)[_model].value;
      }
    }
  }
}
function _toLatinForm2(halfOrFullWidthStr) {
  // refer http://www.fileformat.info/info/unicode/block/halfwidth_and_fullwidth_forms/utf8test.htm
  return halfOrFullWidthStr.replace(/[\uff00-\uffef]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
}
function _attachEventHandlers2(widget, model) {
  widget.addEventListener('keydown', e => {
    _classPrivateFieldLooseBase(this, _handleKeyDown)[_handleKeyDown](e);
  });
  widget.addEventListener('keypress', e => {
    _classPrivateFieldLooseBase(this, _handleKeyPress)[_handleKeyPress](e);
  });
  widget.addEventListener('paste', e => {
    _classPrivateFieldLooseBase(this, _handlePaste)[_handlePaste](e);
  });
  widget.addEventListener('cut', e => {
    _classPrivateFieldLooseBase(this, _handleCut)[_handleCut](e);
  });
  widget.addEventListener('blur', e => {
    _classPrivateFieldLooseBase(this, _model)[_model].value = this.getValue(e.target.value);
  });
  // IME specific handling, to handle japanese languages max limit
  _classPrivateFieldLooseBase(this, _attachCompositionEventHandlers)[_attachCompositionEventHandlers](widget);
}
function _attachCompositionEventHandlers2(widget) {
  let hasCompositionJustEnded = false; // Used to swallow keyup event related to compositionend
  // IME specific handling, to handle japanese languages max limit
  // since enter can also be invoked during composing, a special handling is done here
  let that = this,
    changeCaratPosition = function changeCaratPosition() {
      // change the carat selection position to further limit input of characters
      let range = window.getSelection();
      range.selectAllChildren(widget);
      range.collapseToEnd();
    };
  widget.addEventListener('keyup', function (event) {
    if ( /*isComposing || */hasCompositionJustEnded) {
      if (_classPrivateFieldLooseBase(that, _compositionUpdateCallback)[_compositionUpdateCallback](event)) {
        changeCaratPosition();
      }
      // IME composing fires keydown/keyup events
      hasCompositionJustEnded = false;
    }
  });
  widget.addEventListener('compositionstart', function (event) {
  });
  widget.addEventListener("compositionupdate", function (event) {
    // event.originalEvent.data refers to the actual content
    if (_classPrivateFieldLooseBase(that, _compositionUpdateCallback)[_compositionUpdateCallback](event)) {
      changeCaratPosition();
    }
  });
  widget.addEventListener("compositionend", function (event) {
    // some browsers (IE, Firefox, Safari) send a keyup event after
    //  compositionend, some (Chrome, Edge) don't. This is to swallow
    // the next keyup event, unless a keydown event happens first
    hasCompositionJustEnded = true;
  });
  widget.addEventListener("keydown", function (event) {
    // Safari on OS X may send a keydown of 229 after compositionend
    if (event.which !== 229) {
      hasCompositionJustEnded = false;
    }
  });
}
function _getDigits2() {
  let zeroCode = _classPrivateFieldLooseBase(this, _options)[_options].zero.charCodeAt(0),
    digits = "";
  for (let i = 0; i < 10; i++) {
    digits += String.fromCharCode(zeroCode + i);
  }
  return "[" + digits + "]";
}
function _escape2(str) {
  return str.replace(".", "\\.");
}
function _compositionUpdateCallback2(event) {
  let that = this;
  let flag = false;
  let leadDigits = _classPrivateFieldLooseBase(that, _options)[_options].leadDigits;
  let fracDigits = _classPrivateFieldLooseBase(that, _options)[_options].fracDigits;
  // we don't check use-case where just fracDigits is set since in case of composition update, the value to update is not known
  if (leadDigits !== -1) {
    let val = _classPrivateFieldLooseBase(this, _widget)[_widget].value;
    if (event.type === "compositionupdate" && event.originalEvent.data) {
      val = val + event.originalEvent.data.substr(event.originalEvent.data.length - 1);
    }
    // can't use the existing regex (since current regex checks for english digits), rather doing leadDigit compare
    let totalLength = leadDigits + (fracDigits !== -1 ? fracDigits + _classPrivateFieldLooseBase(that, _options)[_options].decimal.length : 0);
    if (val.indexOf(_classPrivateFieldLooseBase(that, _options)[_options].decimal) === -1) {
      totalLength = leadDigits;
    }
    let latinVal = _classPrivateFieldLooseBase(this, _toLatinForm)[_toLatinForm](val);
    // match both since we support full width, half width and locale specific input
    let match = latinVal.match(_classPrivateFieldLooseBase(that, _regex)[_regex]) || latinVal.match(_classPrivateFieldLooseBase(this, _engRegex)[_engRegex]);
    flag = !match;
    if (match === null) {
      // entered invalid character, revert to previous value
      _classPrivateFieldLooseBase(that, _widget)[_widget].value = _classPrivateFieldLooseBase(that, _previousCompositionVal)[_previousCompositionVal];
      flag = true;
    } else if (flag) {
      // if max reached
      let newVal = val.substr(0, totalLength);
      _classPrivateFieldLooseBase(that, _widget)[_widget].value = newVal;
      _classPrivateFieldLooseBase(that, _previousCompositionVal)[_previousCompositionVal] = newVal;
      flag = true;
    } else {
      _classPrivateFieldLooseBase(that, _previousCompositionVal)[_previousCompositionVal] = val;
    }
  }
  return flag;
}
function _handleKeyInput2(event, character, code) {
  if (event.ctrlKey && !['paste', 'cut'].includes(event.type)) {
    return true;
  }
  _classPrivateFieldLooseBase(this, _handleKeyDown)[_handleKeyDown](arguments);
  _classPrivateFieldLooseBase(this, _options)[_options].lengthLimitVisible = true;
  let val = _classPrivateFieldLooseBase(this, _widget)[_widget].value,
    // if selectionStart attribute isn't supported then its value will be undefined
    selectionStart = this.getHTMLSupportedAttr(_classPrivateFieldLooseBase(this, _widget)[_widget], "selectionStart") || 0,
    isSelectionAttrSupported = !(selectionStart === undefined || selectionStart === null),
    selectionEnd = this.getHTMLSupportedAttr(_classPrivateFieldLooseBase(this, _widget)[_widget], "selectionEnd") || 0,
    combCells = parseInt(_classPrivateFieldLooseBase(this, _options)[_options].combCells) || 0,
    current,
    change = character;
  if (combCells > 0) {
    change = character.substr(0, combCells - val.length + selectionEnd - selectionStart);
  }

  // CQ-4245407 : selectionStart and selectionEnd attributes aren't supported in case of input type = number
  // it is used for providing native HTML5 implementation for numeric field, so no further processing is required
  // As it is specific to AF and AF doesn't support change event on each keypress, so this change should be fine
  if (!isSelectionAttrSupported) {
    return true;
  }
  current = val.substr(0, selectionStart) + change + val.substr(selectionEnd);
  // done to handle support for both full width, half width or mixed input in number field
  let latinCurrentValue = _classPrivateFieldLooseBase(this, _toLatinForm)[_toLatinForm](current);
  if (!(_classPrivateFieldLooseBase(this, _regex)[_regex] == null || latinCurrentValue.match(_classPrivateFieldLooseBase(this, _regex)[_regex]) || latinCurrentValue.match(_classPrivateFieldLooseBase(this, _engRegex)[_engRegex]))) {
    event.preventDefault();
    return false;
  }
  if (!['keydown', 'cut'].includes(event.type) && combCells && (val.length >= combCells || current.length > combCells) && selectionStart === selectionEnd) {
    event.preventDefault();
    return false;
  }
  _classPrivateFieldLooseBase(this, _options)[_options].curValue = val;
  _classPrivateFieldLooseBase(this, _previousCompositionVal)[_previousCompositionVal] = val;
  _classPrivateFieldLooseBase(this, _options)[_options].pos = selectionStart;
}
function _handleKeyDown2(event) {
  if (event) {
    let code = event.charCode || event.which || event.keyCode || 0;
    if (code === 8 || code === 46)
      // backspace and del
      _classPrivateFieldLooseBase(this, _handleKeyInput)[_handleKeyInput](event, "", code);else if (code === 32) {
      // suppress space
      event.preventDefault();
      return false;
    }
  }
}
function _isValidChar2(character) {
  character = _classPrivateFieldLooseBase(this, _toLatinForm)[_toLatinForm](character);
  let lastSingleDigitChar = String.fromCharCode(_classPrivateFieldLooseBase(this, _options)[_options].zero.charCodeAt(0) + 9);
  // we only full width, half width and also locale specific if customer has overlayed the i18n file
  return character >= "0" && character <= "9" || character >= _classPrivateFieldLooseBase(this, _options)[_options].zero && character <= lastSingleDigitChar || character === _classPrivateFieldLooseBase(this, _options)[_options].decimal || character === _classPrivateFieldLooseBase(this, _options)[_options].minus;
}
function _handleKeyPress2(event) {
  if (event) {
    let code = event.charCode || event.which || event.keyCode || 0,
      character = String.fromCharCode(code);
    if (this.isNonPrintableKey(event.key)) {
      // mozilla also generates a keypress, along with keydown
      return true; // for all keys, so only handling printable keys in keypress
    }

    if (_classPrivateFieldLooseBase(this, _isValidChar)[_isValidChar](character)) _classPrivateFieldLooseBase(this, _handleKeyInput)[_handleKeyInput](event, character, code);else if (!event.ctrlKey) {
      event.preventDefault();
      return false;
    }
  }
}
function _handlePaste2(event) {
  if (event) {
    // get the contents
    let pastedChar = undefined;
    if (window.clipboardData && window.clipboardData.getData) {
      // IE
      pastedChar = window.clipboardData.getData('Text');
    } else if ((event.originalEvent || event).clipboardData && (event.originalEvent || event).clipboardData.getData) {
      pastedChar = (event.originalEvent || event).clipboardData.getData('text/plain');
    }
    if (pastedChar) {
      let allPastedCharsValid = pastedChar.split('').every(function (character) {
        return _classPrivateFieldLooseBase(this, _isValidChar)[_isValidChar](character);
      }, this);
      if (allPastedCharsValid) {
        // during paste we support both half width, full width and locale specific numbers
        pastedChar = _classPrivateFieldLooseBase(this, _toLatinForm)[_toLatinForm](pastedChar);
        _classPrivateFieldLooseBase(this, _handleKeyInput)[_handleKeyInput](event, pastedChar, 0);
      } else if (!event.ctrlKey) {
        event.preventDefault();
        return false;
      }
    }
  }
}
function _handleCut2(event) {
  if (event) {
    _classPrivateFieldLooseBase(this, _handleKeyInput)[_handleKeyInput](event, "", 0);
  }
}
function _convertValueToLocale2(val) {
  let zeroCode = _classPrivateFieldLooseBase(this, _options)[_options].zero.charCodeAt(0);
  return val.map(function (c) {
    if (c === ".") {
      return _classPrivateFieldLooseBase(this, _options)[_options].decimal;
    } else if (c === "-") {
      return _classPrivateFieldLooseBase(this, _options)[_options].minus;
    } else {
      return String.fromCharCode(parseInt(c) + zeroCode);
    }
  }, this).join("");
}
function _convertValueFromLocale2(val) {
  val = _classPrivateFieldLooseBase(this, _toLatinForm)[_toLatinForm](val);
  let zeroCode = _classPrivateFieldLooseBase(this, _options)[_options].zero.charCodeAt(0);
  return val.map(function (c) {
    if (c === _classPrivateFieldLooseBase(this, _options)[_options].decimal) {
      return ".";
    } else if (c === _classPrivateFieldLooseBase(this, _options)[_options].minus) {
      return "-";
    } else {
      return (c.charCodeAt(0) - zeroCode).toString();
    }
  }, this).join("");
}
function _isValueSame2() {
  return _classPrivateFieldLooseBase(this, _model)[_model].value === null && _classPrivateFieldLooseBase(this, _widget)[_widget].value === "" || _classPrivateFieldLooseBase(this, _model)[_model].value === _classPrivateFieldLooseBase(this, _widget)[_widget].value;
}

class NumberInput extends FormFieldBase {
  constructor(...args) {
    super(...args);
    this.widgetObject = void 0;
  }
  getClass() {
    return NumberInput.IS;
  }
  getWidget() {
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
  _updateValue(value) {
    if (this.widgetObject == null && (this._model._jsonModel.editFormat || this._model._jsonModel.displayFormat)) {
      this.widgetObject = new NumericInputWidget(this.getWidget(), this._model);
    }
    if (this.widgetObject) {
      this.widgetObject.setValue(value);
    } else {
      super._updateValue(value);
    }
  }
  addListener() {
    var _this$_model, _this$_model$_jsonMod, _this$_model2, _this$_model2$_jsonMo;
    // only initialize if patterns are set
    if ((_this$_model = this._model) != null && (_this$_model$_jsonMod = _this$_model._jsonModel) != null && _this$_model$_jsonMod.editFormat || (_this$_model2 = this._model) != null && (_this$_model2$_jsonMo = _this$_model2._jsonModel) != null && _this$_model2$_jsonMo.displayFormat) {
      if (this.widgetObject == null) {
        this.widgetObject = new NumericInputWidget(this.getWidget(), this._model);
      }
    } else {
      var _this$getWidget;
      (_this$getWidget = this.getWidget()) == null ? void 0 : _this$getWidget.addEventListener('blur', e => {
        this._model.value = e.target.value;
      });
    }
  }
  getbemBlock() {
    return NumberInput.bemBlock;
  }
  getIS() {
    return NumberInput.IS;
  }
  createInputHTML() {
    let input = document.createElement("input");
    input.className = "cmp-adaptiveform-numberinput__widget";
    input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
    input.type = "number";
    input.name = this.getName();
    input.value = this.getDefault();
    input.placeholder = this.getPlaceHolder();
    input.required = this.isRequired();
    input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '');
    this.setDisabledAttribute(input);
    this.setReadonlyAttribute(input);
    this.setNumberConstraints(input);
    return input;
  }
}
NumberInput.NS = Constants.NS;
NumberInput.IS = "adaptiveFormNumberInput";
NumberInput.bemBlock = 'cmp-adaptiveform-numberinput';
NumberInput.selectors = {
  self: "[data-" + NumberInput.NS + '-is="' + NumberInput.IS + '"]',
  widget: `.${NumberInput.bemBlock}__widget`,
  label: `.${NumberInput.bemBlock}__label`,
  description: `.${NumberInput.bemBlock}__longdescription`,
  errorDiv: `.${NumberInput.bemBlock}__errormessage`,
  qm: `.${NumberInput.bemBlock}__questionmark`,
  tooltipDiv: `.${NumberInput.bemBlock}__shortdescription`
};

class RadioButton extends FormFieldBase {
  constructor(params, model) {
    super(params, model);
    this.qm = this.element.querySelector(RadioButton.selectors.qm);
  }
  getWidget() {
    return this.element.querySelector(RadioButton.selectors.widget);
  }
  getWidgets() {
    return this.element.querySelectorAll(RadioButton.selectors.widget);
  }
  getDescription() {
    return this.element.querySelector(RadioButton.selectors.description);
  }
  getLabel() {
    return this.element.querySelector(RadioButton.selectors.label);
  }
  getQuestionMarkDiv() {
    return this.element.querySelector(RadioButton.selectors.qm);
  }
  getTooltipDiv() {
    return this.element.querySelector(RadioButton.selectors.tooltipDiv);
  }
  getErrorDiv() {
    return this.element.querySelector(RadioButton.selectors.errorDiv);
  }
  _updateValue(modelValue) {
    if (modelValue != null) {
      this.getWidgets().forEach(widget => {
        if (widget.value != null && modelValue.toString() == widget.value.toString()) {
          widget.checked = true;
          widget.setAttribute(Constants.HTML_ATTRS.CHECKED, Constants.HTML_ATTRS.CHECKED);
          widget.setAttribute(Constants.ARIA_CHECKED, true + "");
        } else {
          widget.checked = false;
          widget.removeAttribute(Constants.HTML_ATTRS.CHECKED);
          widget.setAttribute(Constants.ARIA_CHECKED, false + "");
        }
      }, this);
    }
  }
  _updateEnabled(enabled) {
    this.toggle(enabled, Constants.ARIA_DISABLED, true);
    this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled + "");
    let widgets = this.getWidgets();
    widgets == null ? void 0 : widgets.forEach(widget => {
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
    this.getWidgets().forEach(widget => {
      widget.addEventListener('change', e => {
        this._model.value = e.target.value;
      });
    });
  }
  getbemBlock() {
    return RadioButton.bemBlock;
  }
  getIS() {
    return RadioButton.IS;
  }
  createInputHTML() {
    var _this$getEnum;
    let inputs = [];
    (_this$getEnum = this.getEnum()) == null ? void 0 : _this$getEnum.forEach((enumVal, index) => {
      var _this$getEnumNames;
      inputs.push(this.createRadioButton(this, enumVal, (_this$getEnumNames = this.getEnumNames()) == null ? void 0 : _this$getEnumNames[index], index));
    });
    return inputs;
  }
  createRadioButton(radioButton, enumValue, enumDisplayName, index) {
    let div = document.createElement("div");
    div.className = "cmp-adaptiveform-radiobutton__option " + radioButton.getLayoutProperties().orientation;
    let label = document.createElement("label");
    label.className = "cmp-adaptiveform-radiobutton__option__label";
    label.title = radioButton.getTooltipValue();
    label.setAttribute("aria-label", enumDisplayName);
    label.setAttribute("aria-describedby", "_desc");
    let input = document.createElement("input");
    input.type = "radio";
    input.name = radioButton.getName();
    input.className = "cmp-adaptiveform-radiobutton__option__widget";
    input.id = radioButton.getId() + "_" + index + "__widget";
    input.value = enumValue;
    input.checked = enumValue == this.getDefault();
    input.setAttribute("aria-describedby", "_desc");
    this.setDisabledAttribute(input);
    let span = document.createElement("span");
    span.textContent = enumDisplayName;
    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(label);
    return div;
  }
}
RadioButton.NS = Constants.NS;
RadioButton.IS = "adaptiveFormRadioButton";
RadioButton.bemBlock = 'cmp-adaptiveform-radiobutton';
RadioButton.selectors = {
  self: "[data-" + RadioButton.NS + '-is="' + RadioButton.IS + '"]',
  widget: `.${RadioButton.bemBlock}__option__widget`,
  label: `.${RadioButton.bemBlock}__label`,
  description: `.${RadioButton.bemBlock}__longdescription`,
  qm: `.${RadioButton.bemBlock}__questionmark`,
  errorDiv: `.${RadioButton.bemBlock}__errormessage`,
  tooltipDiv: `.${RadioButton.bemBlock}__shortdescription`
};

class Text extends FormFieldBase {
  getWidget() {
    return null;
  }
  getDescription() {
    return null;
  }
  getLabel() {
    return null;
  }
  getErrorDiv() {
    return null;
  }
  getTooltipDiv() {
    return null;
  }
  getQuestionMarkDiv() {
    return null;
  }
  getClass() {
    return Text.IS;
  }
  setFocus() {
    this.setActive();
  }
  getbemBlock() {
    return Text.bemBlock;
  }
  getIS() {
    return Text.IS;
  }
  createView() {
    let div = document.createElement("div");
    div.id = this.getId();
    div.className = "cmp-adaptiveform-text";
    div.dataset.cmpVisible = this.isVisible.toString();
    div.dataset.cmpAdaptiveformcontainerPath = this.getFormContainerPath();
    div.dataset.cmIs = this.getIS();
    let child = document.createElement("div");
    child.className = "cmp-adaptiveform-text__widget";
    child.tabIndex = 0;
    child.textContent = this.state.value;
    return div;
  }
}
Text.NS = Constants.NS;
Text.IS = "adaptiveFormText";
Text.bemBlock = 'cmp-adaptiveform-text';
Text.selectors = {
  self: "[data-" + Text.NS + '-is="' + Text.IS + '"]'
};

class SliderInput extends FormFieldBase {
  getWidget() {
    return this.element.querySelector(SliderInput.selectors.widget);
  }
  getDescription() {
    return this.element.querySelector(SliderInput.selectors.description);
  }
  getLabel() {
    return this.element.querySelector(SliderInput.selectors.label);
  }
  getDisplayLabel() {
    return this.element.querySelector(SliderInput.selectors.labelValue);
  }
  getErrorDiv() {
    return this.element.querySelector(SliderInput.selectors.errorDiv);
  }
  getTooltipDiv() {
    return this.element.querySelector(SliderInput.selectors.tooltipDiv);
  }
  getQuestionMarkDiv() {
    return this.element.querySelector(SliderInput.selectors.qm);
  }
  addListener() {
    var _this$getWidget, _this$getWidget2;
    (_this$getWidget = this.getWidget()) == null ? void 0 : _this$getWidget.addEventListener('change', e => {
      this._model.value = e.target.value;
      this.setInactive();
      let labelValueEl = this.getDisplayLabel();
      if (labelValueEl) labelValueEl.textContent = "\t\t\t" + e.target.value;
    });
    (_this$getWidget2 = this.getWidget()) == null ? void 0 : _this$getWidget2.addEventListener('focus', e => {
      this.setActive();
    });
  }
  getbemBlock() {
    return SliderInput.bemBlock;
  }
  getIS() {
    return SliderInput.IS;
  }
  createInputHTML() {
    var _this$getMinLength, _this$getMaxLength;
    let label = document.createElement("label");
    label.className = "cmp-adaptiveform-sliderinput__label__value";
    label.textContent = "\t\t\t" + this.getDefault();
    let input = document.createElement("input");
    input.className = "cmp-adaptiveform-sliderinput__widget";
    input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
    input.type = "range";
    input.name = this.getName();
    input.value = this.getDefault();
    input.step = this.state.step;
    input.placeholder = this.getPlaceHolder();
    input.required = this.isRequired();
    input.min = (_this$getMinLength = this.getMinLength()) == null ? void 0 : _this$getMinLength.toString();
    input.max = (_this$getMaxLength = this.getMaxLength()) == null ? void 0 : _this$getMaxLength.toString();
    input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '');
    this.setDisabledAttribute(input);
    this.setReadonlyAttribute(input);
    this.setNumberConstraints(input);
    return [label, input];
  }
}
SliderInput.NS = Constants.NS;
SliderInput.IS = "adaptiveFormSliderInput";
SliderInput.bemBlock = 'cmp-adaptiveform-sliderinput';
SliderInput.selectors = {
  self: "[data-" + SliderInput.NS + '-is="' + SliderInput.IS + '"]',
  widget: `.${SliderInput.bemBlock}__widget`,
  label: `.${SliderInput.bemBlock}__label`,
  labelValue: `.${SliderInput.bemBlock}__label__value`,
  description: `.${SliderInput.bemBlock}__longdescription`,
  qm: `.${SliderInput.bemBlock}__questionmark`,
  errorDiv: `.${SliderInput.bemBlock}__errormessage`,
  tooltipDiv: `.${SliderInput.bemBlock}__shortdescription`
};

class EmailInput extends TextInput {
  createInputHTML() {
    let input = document.createElement("input");
    input.className = "cmp-adaptiveform-textinput__widget";
    input.title = this.isTooltipVisible() ? this.getTooltipValue() : '';
    input.type = "email";
    input.name = this.getName();
    input.value = this.getDefault();
    input.placeholder = this.getPlaceHolder();
    input.required = this.isRequired();
    input.setAttribute("aria-label", this.isLabelVisible() ? this.getLabelValue() : '');
    this.setDisabledAttribute(input);
    this.setReadonlyAttribute(input);
    this.setStringContraints(input);
    return input;
  }
}

class CheckBoxGroup extends FormFieldBase {
  constructor(params, model) {
    super(params, model);
    this.widgetLabel = void 0;
    this.qm = this.element.querySelector(CheckBoxGroup.selectors.qm);
    this.widgetLabel = this.element.querySelector(CheckBoxGroup.selectors.widgetLabel);
  }
  getWidget() {
    return this.element.querySelector(CheckBoxGroup.selectors.widget);
  }
  getWidgets() {
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
    let widgets = this.getWidgets();
    if (widgets.length == 1) {
      this._model.value = widgets[0].checked;
    } else {
      let value = [];
      widgets == null ? void 0 : widgets.forEach(widget => {
        if (widget.checked) {
          value.push(widget.value);
        }
      }, this);
      this._model.value = value;
    }
  }
  _updateEnabled(enabled) {
    this.toggle(enabled, Constants.ARIA_DISABLED, true);
    this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled + "");
    let widgets = this.getWidgets();
    widgets == null ? void 0 : widgets.forEach(widget => {
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
    let widgets = this.getWidgets();
    widgets.forEach(widget => {
      widget.addEventListener('change', e => {
        this._updateModelValue();
      });
    });
  }
  getbemBlock() {
    return CheckBoxGroup.bemBlock;
  }
  getIS() {
    return CheckBoxGroup.IS;
  }
  createInputHTML() {
    var _this$getEnum;
    let div = document.createElement("div");
    div.className = "cmp-adaptiveform-checkboxgroup__widget";
    (_this$getEnum = this.getEnum()) == null ? void 0 : _this$getEnum.forEach((enumVal, index, enums) => {
      var _this$getEnumNames;
      div.appendChild(this.createCheckboxHTML(this, enumVal, ((_this$getEnumNames = this.getEnumNames()) == null ? void 0 : _this$getEnumNames[index]) || enumVal, index, enums == null ? void 0 : enums.length));
    });
    return div;
  }
  createCheckboxHTML(checkbox, enumValue, enumDisplayName, index, size) {
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
    input.name = size > 1 ? checkbox.getName() : checkbox.getLabelValue();
    input.checked = enumValue == checkbox.getDefault();
    input.setAttribute("aria-describedby", "_desc");
    this.setDisabledAttribute(input);
    let span = document.createElement("span");
    span.textContent = this.getEnum().length > 1 ? enumDisplayName : checkbox.getLabelValue();
    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(label);
    return div;
  }
  createLabel() {
    var _this$getEnum2;
    let label = document.createElement("label");
    label.id = this.getId() + "-label";
    label.htmlFor = this.getId();
    label.className = this.getbemBlock() + "__label";
    label.textContent = this.getLabelValue();
    label.hidden = this.isLabelVisible() && ((_this$getEnum2 = this.getEnum()) == null ? void 0 : _this$getEnum2.length) == 1;
    return label;
  }
}
CheckBoxGroup.NS = Constants.NS;
CheckBoxGroup.IS = "adaptiveFormCheckBoxGroup";
CheckBoxGroup.bemBlock = 'cmp-adaptiveform-checkboxgroup';
CheckBoxGroup.checkboxBemBlock = 'cmp-adaptiveform-checkbox';
CheckBoxGroup.selectors = {
  self: "[data-" + CheckBoxGroup.NS + '-is="' + CheckBoxGroup.IS + '"]',
  widgets: `.${CheckBoxGroup.bemBlock}__widgets`,
  widget: `.${CheckBoxGroup.checkboxBemBlock}__widget`,
  widgetLabel: `.${CheckBoxGroup.checkboxBemBlock}__label`,
  label: `.${CheckBoxGroup.bemBlock}__label`,
  description: `.${CheckBoxGroup.bemBlock}__longdescription`,
  qm: `.${CheckBoxGroup.bemBlock}__questionmark`,
  errorDiv: `.${CheckBoxGroup.bemBlock}__errormessage`,
  tooltipDiv: `.${CheckBoxGroup.bemBlock}__shortdescription`
};

var _element = /*#__PURE__*/_classPrivateFieldLooseKey("element");
class FormContainer {
  constructor(_params) {
    this._model = void 0;
    this._path = void 0;
    this._deferredParents = void 0;
    Object.defineProperty(this, _element, {
      writable: true,
      value: void 0
    });
    this.renderChildrens = (form, state) => {
      console.time("Rendering childrens");
      let items = state == null ? void 0 : state.items;
      if (items && items.length > 0) {
        items.forEach((field, index) => {
          form.append(this.getRender(field, index));
        });
      }
      console.timeEnd("Rendering childrens");
    };
    this.getRender = (field, index) => {
      const fieldWrapper = document.createElement('div');
      try {
        let fieldViewModel;
        let fieldModel = this.getModel(field.id);
        let params = {
          element: fieldWrapper,
          id: field.id
        };
        switch (field == null ? void 0 : field.fieldType) {
          case "checkbox":
            fieldViewModel = new CheckBoxGroup(params, fieldModel);
            break;
          case "email":
            fieldViewModel = new EmailInput(params, fieldModel);
            break;
          case "slider":
            fieldViewModel = new SliderInput(params, fieldModel);
            break;
          case "plain-text":
            fieldViewModel = new Text(params, fieldModel);
            break;
          case "radio":
            fieldViewModel = new RadioButton(params, fieldModel);
            break;
          case "number":
            fieldViewModel = new NumberInput(params, fieldModel);
            break;
          case "button":
            fieldViewModel = new Button(params, fieldModel);
            break;
          case "select":
            fieldViewModel = new DropDown(params, fieldModel);
            break;
          case "text-area":
            fieldViewModel = new TextArea(params, fieldModel);
            break;
          default:
            fieldViewModel = new TextInput(params, fieldModel);
        }
        if (fieldViewModel) {
          fieldViewModel.render();
        }
      } catch (error) {
        console.error("Unexpected error ", error);
      }
      return fieldWrapper;
    };
    this._model = createFormInstance(_params == null ? void 0 : _params._formJson, null);
    this._path = _params._path;
    this._deferredParents = {};
  }
  getModel(id) {
    var _this$_model;
    return id ? (_this$_model = this._model) == null ? void 0 : _this$_model.getElement(id) : this._model;
  }
  getPath() {
    return this._path;
  }
  render(placeholder) {
    var _this$_model2;
    const form = document.createElement('form');
    form.className = "cmp-adaptiveform-container cmp-container";
    _classPrivateFieldLooseBase(this, _element)[_element] = form;
    let state = (_this$_model2 = this._model) == null ? void 0 : _this$_model2.getState();
    this.renderChildrens(form, state);
    placeholder.replaceWith(form);
    return form;
  }
}

const PROPERTY = "property";
const PROPERTY_RULES = "rules.properties";
var _initFormDef = /*#__PURE__*/_classPrivateFieldLooseKey("initFormDef");
var _initField = /*#__PURE__*/_classPrivateFieldLooseKey("initField");
var _handleProperites = /*#__PURE__*/_classPrivateFieldLooseKey("handleProperites");
var _transformPropertyRules = /*#__PURE__*/_classPrivateFieldLooseKey("transformPropertyRules");
var _handleField = /*#__PURE__*/_classPrivateFieldLooseKey("handleField");
var _transformFieldType = /*#__PURE__*/_classPrivateFieldLooseKey("transformFieldType");
var _transformFieldNames = /*#__PURE__*/_classPrivateFieldLooseKey("transformFieldNames");
var _transformFlatToHierarchy = /*#__PURE__*/_classPrivateFieldLooseKey("transformFlatToHierarchy");
var _handleCheckbox = /*#__PURE__*/_classPrivateFieldLooseKey("handleCheckbox");
var _handleMultiValues = /*#__PURE__*/_classPrivateFieldLooseKey("handleMultiValues");
var _handleFranklinSpecialCases = /*#__PURE__*/_classPrivateFieldLooseKey("handleFranklinSpecialCases");
var _isProperty = /*#__PURE__*/_classPrivateFieldLooseKey("isProperty");
class ExcelToFormModel {
  constructor() {
    Object.defineProperty(this, _isProperty, {
      value: _isProperty2
    });
    Object.defineProperty(this, _handleFranklinSpecialCases, {
      value: _handleFranklinSpecialCases2
    });
    Object.defineProperty(this, _handleMultiValues, {
      value: _handleMultiValues2
    });
    Object.defineProperty(this, _handleCheckbox, {
      value: _handleCheckbox2
    });
    Object.defineProperty(this, _transformFlatToHierarchy, {
      value: _transformFlatToHierarchy2
    });
    Object.defineProperty(this, _transformFieldNames, {
      value: _transformFieldNames2
    });
    Object.defineProperty(this, _transformFieldType, {
      value: _transformFieldType2
    });
    Object.defineProperty(this, _handleField, {
      value: _handleField2
    });
    Object.defineProperty(this, _transformPropertyRules, {
      value: _transformPropertyRules2
    });
    Object.defineProperty(this, _handleProperites, {
      value: _handleProperites2
    });
    Object.defineProperty(this, _initField, {
      value: _initField2
    });
    Object.defineProperty(this, _initFormDef, {
      value: _initFormDef2
    });
    this.fieldPropertyMapping = {
      "Default": "default",
      "MaxLength": "maxLength",
      "MinLength": "minLength",
      "Maximum": "maximum",
      "Minimum": "minimum",
      "Step": "step",
      "Pattern": "pattern",
      "Value": "value",
      "Placeholder": "placeholder",
      "Field": "name",
      "ReadOnly": "readOnly",
      "Description": "description",
      "Type": "fieldType",
      "Label": "label.value",
      "Mandatory": "required",
      "Options": "enum"
    };
  }
  async _getForm(formPath) {
    if (!formPath) {
      throw new Error("formPath is required");
    }
    const resp = await fetch(formPath);
    const json = await resp.json();
    return json;
  }
  async getFormModel(formPath) {
    if (formPath) {
      console.time("Get Excel JSON");
      let exData = await this._getForm(formPath);
      console.timeEnd("Get Excel JSON");
      return this.transform(exData, formPath);
    }
  }
  transform(exData, formPath) {
    if (!exData || !exData.data) {
      throw new Error("Unable to retrieve the form details from " + formPath);
    }
    const formDef = _classPrivateFieldLooseBase(this, _initFormDef)[_initFormDef](formPath);
    let currentPanel = formDef;
    exData.data.forEach(item => {
      let source = Object.fromEntries(Object.entries(item).filter(([_, v]) => v != null && v != ""));
      let field = _extends$1({}, source, _classPrivateFieldLooseBase(this, _initField)[_initField]());
      _classPrivateFieldLooseBase(this, _transformFieldNames)[_transformFieldNames](field);
      if (_classPrivateFieldLooseBase(this, _isProperty)[_isProperty](field)) {
        _classPrivateFieldLooseBase(this, _handleProperites)[_handleProperites](formDef, field);
      } else {
        currentPanel.items.push(_classPrivateFieldLooseBase(this, _handleField)[_handleField](field));
      }
    });
    _classPrivateFieldLooseBase(this, _transformPropertyRules)[_transformPropertyRules](formDef);
    return {
      formDef: formDef,
      excelData: exData
    };
  }
}
function _initFormDef2(formPath) {
  return {
    adaptiveform: "0.10.0",
    metadata: {
      grammar: "json-formula-1.0.0",
      version: "1.0.0"
    },
    properties: {},
    rules: {},
    items: [],
    action: formPath == null ? void 0 : formPath.split('.json')[0]
  };
}
function _initField2() {
  return {
    constraintMessages: {
      required: "Please fill in this field."
    }
  };
}
function _handleProperites2(formDef, item) {
  formDef.properties[item.name] = item.default;
  if (item.hasOwnProperty(PROPERTY_RULES)) {
    if (!formDef.rules.properties) {
      formDef.rules.properties = [];
    }
    formDef.rules.properties.push(`{${item.name}: ${item[PROPERTY_RULES]}}`);
  }
}
function _transformPropertyRules2(formDef) {
  if (formDef.rules.properties) {
    let properites = "merge($properties";
    formDef.rules.properties.forEach(rule => {
      properites = properites + "," + rule;
    });
    properites += ")";
    formDef.rules.properties = properites;
  }
}
function _handleField2(field) {
  _classPrivateFieldLooseBase(this, _transformFieldType)[_transformFieldType](field);
  _classPrivateFieldLooseBase(this, _transformFlatToHierarchy)[_transformFlatToHierarchy](field);
  _classPrivateFieldLooseBase(this, _handleMultiValues)[_handleMultiValues](field, "enum");
  _classPrivateFieldLooseBase(this, _handleMultiValues)[_handleMultiValues](field, "enumNames");
  _classPrivateFieldLooseBase(this, _handleFranklinSpecialCases)[_handleFranklinSpecialCases](field);
  _classPrivateFieldLooseBase(this, _handleCheckbox)[_handleCheckbox](field);
  return field;
}
function _transformFieldType2(field) {
  if (ExcelToFormModel.fieldMapping.has(field.fieldType)) {
    field.fieldType = ExcelToFormModel.fieldMapping.get(field.fieldType);
  }
}
function _transformFieldNames2(item) {
  Object.keys(this.fieldPropertyMapping).forEach(key => {
    if (item[key]) {
      item[this.fieldPropertyMapping[key]] = item[key];
      delete item[key];
    }
  });
}
function _transformFlatToHierarchy2(item) {
  Object.keys(item).forEach(key => {
    if (key.includes(".")) {
      let temp = item;
      key.split('.').map((k, i, values) => {
        temp = temp[k] = i == values.length - 1 ? item[key] : temp[k] != null ? temp[k] : {};
      });
      delete item[key];
    }
  });
}
function _handleCheckbox2(field) {
  if ((field == null ? void 0 : field.fieldType) == "checkbox" && (!field.enum || field.enum.length == 0)) {
    field.enum = ["on"];
  }
}
function _handleMultiValues2(item, key) {
  let values;
  if (item && item[key]) {
    values = item[key].split(",").map(value => value.trim());
    item[key] = values;
  }
}
function _handleFranklinSpecialCases2(item) {
  //Franklin Mandatory uses x for true.
  item.required = item.required == "x" || item.required == "true";
}
function _isProperty2(item) {
  return item && item.fieldType == PROPERTY;
}
ExcelToFormModel.fieldMapping = new Map([["text-input", "text"], ["number-input", "number"], ["date-input", "datetime-local"], ["file-input", "file"], ["drop-down", "select"], ["radio-group", ""], ["checkbox-group", ""], ["plain-text", "plain-text"], ["checkbox", "checkbox"], ["multiline-input", "text-area"], ["panel", "panel"], ["submit", "button"]]);

let createFormContainer = async formLink => {
  if (formLink && formLink != null && formLink.href) {
    let url = formLink.href;
    console.log("Loading & Converting excel form to Crispr Form");
    console.time('Json Transformation (including Get)');
    const transform = new ExcelToFormModel();
    const convertedData = await transform.getFormModel(url);
    console.timeEnd('Json Transformation (including Get)');
    console.log(convertedData);
    console.log("Creating Form Container");
    console.time('Form Model Instance Creation');
    let formContainer = new FormContainer({
      _formJson: convertedData == null ? void 0 : convertedData.formDef,
      _path: url
    });
    console.timeEnd('Form Model Instance Creation');
    //@ts-ignore
    window.guideContainer = formContainer;
    console.time('Form Rendition');
    formContainer.render(formLink);
    console.timeEnd('Form Rendition');
  }
};
async function decorate(block) {
  const formLink = block == null ? void 0 : block.querySelector('a[href$=".json"]');
  if (formLink && formLink != null && formLink.href) {
    await createFormContainer(formLink);
  }
}

export { decorate as default };
