
import Constants from "../../src/libs/constants.js";
import { expect } from '@esm-bundle/chai';
import ComponentValidator from "../util/ComponentValidator.js";

import { FormsEnvironment } from "../util/FormsEnvironment.js";
import suit from "../select_suite.json"  assert { type: "json" };

let model, block;
let formEnv = new FormsEnvironment();
let {adaptiveForm} =  formEnv.registrationForm();
let blockName = Constants.SELECT;


suit.forEach((testCase) => {
    describe(`${testCase.name} `, () => {

        beforeEach( async() => {
            [model, block] = await formEnv.getFieldView(adaptiveForm, testCase.fieldId);
            return;
        });
        
        it(`Model update verification -- ${testCase.name}`, () => {
            testCase?.model?.forEach((testSet) => {
                model.value = testSet.set;
                ComponentValidator.validateInputValue(model, blockName, block, testSet.expected, testCase.widget);
            });
        })
        
        it(`UI Update verification -- ${testCase.name}`, () => {
            testCase?.ui?.forEach((testSet) => {
                ComponentValidator.triggerValueChange(model, blockName, block, testSet.selectedIndex);
                ComponentValidator.validateInputValue(model, blockName, block, testSet.expected, testCase.widget);
            });
        })
    });
});