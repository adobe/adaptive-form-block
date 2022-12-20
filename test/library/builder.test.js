

import { expect } from '@esm-bundle/chai';
import { Constants } from '../../src/libs/constants.js';

import {createErrorHTML, createLabel, createLongDescHTML, createQuestionMarkHTML, createWidgetWrapper, defaultInputRender, renderField} from "../../src/libs/afb-builder.js";
import { getErrorWidget } from '../../src/libs/afb-interaction.js';
import ComponentValidator from '../util/ComponentValidator.js';

import { FormsEnvironment } from "../util/FormsEnvironment.js";

let formEnv = new FormsEnvironment();
let {adaptiveForm, firstNameId} =  formEnv.registrationForm();
let model;
let blockName = Constants.TEXT_INPUT;

beforeEach(() => {
  model = adaptiveForm.getModel(firstNameId);
});


describe('Form Builder (Markup) test suit', () => {

    it('Input type Markup ', () => {
        let input = defaultInputRender(model?.getState(), blockName);
        ComponentValidator.validateInput(model, blockName, input)
    });

    it('Label Markup ', () => {
      let label = createLabel(model?.getState(), blockName);
      ComponentValidator.validateLabel(model, blockName, label)
    });

    it('Label Markup with visible false', () => {
      model.label.visible = false;
      let label = createLabel(model?.getState(), blockName);
      ComponentValidator.validateLabel(model, blockName, label)
      model.label.visible = true;
    });

    it('Long desc Markup ', () => {
      model.description = "Testing";
      let div = createLongDescHTML(model?.getState(), blockName);
      ComponentValidator.validateLongDesc(model, blockName, div)
      model.description = "";
    });

    it('Long desc Markup with blank ', () => {
      let div = createLongDescHTML(model?.getState(), blockName);
      ComponentValidator.validateLongDesc(model, blockName, div)
    });

    it('Short (QM) desc Markup ', () => {
      let state = model?.getState();
      state.tooltip = "Testing";
      let button = createQuestionMarkHTML(state, blockName);
      ComponentValidator.validateQM(state, blockName, button)
      state.tooltip = "";
    });

    it('Short (QM) desc Markup with blank ', () => {
      let state = model?.getState();
      let button = createQuestionMarkHTML(state, blockName);
      ComponentValidator.validateQM(state, blockName, button)
    });

    it('Error Markup with blank ', () => {
      let div = createErrorHTML(model?.getState(), blockName);
      ComponentValidator.validateErrorWidget(model, blockName, div, "")
    });

    it('Widget Markup', () => {
      let div = createWidgetWrapper(model?.getState(), blockName);
      ComponentValidator.validateWidget(model, blockName, div, true, true)
    });

    it('Widget Markup', () => {
      let div = createWidgetWrapper(model?.getState(), blockName);
      ComponentValidator.validateWidget(model, blockName, div, true, true)
    });

    it('Render Field', () => {
      let div = renderField(model, blockName);
      ComponentValidator.validateWidget(model, blockName, div, true, true)
      ComponentValidator.validateLabel(model, blockName, div.querySelector("label"))
      ComponentValidator.validateInput(model, blockName, div.querySelector("input"))
      ComponentValidator.validateErrorWidget(model, blockName, div.querySelector("div"), "")
    });

    it('Render Field with desc, tooltip', () => {
      model.description = "Test";
      let div = renderField(model, blockName);
      ComponentValidator.validateWidget(model, blockName, div, true, true)
      ComponentValidator.validateLabel(model, blockName, div.querySelector("label"))
      ComponentValidator.validateInput(model, blockName, div.querySelector("input"))
      ComponentValidator.validateLongDesc(model, blockName, div.querySelectorAll("div")[0], "")
      ComponentValidator.validateErrorWidget(model, blockName, getErrorWidget(div), "")
      model.description = "";
    });

});