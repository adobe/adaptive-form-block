import Constants from "../../src/libs/constants.js";
import { expect } from '@esm-bundle/chai';
import ComponentValidator from "../util/ComponentValidator.js";

import { FormsEnvironment } from "../util/FormsEnvironment.js";
import suit from "../panel_suite.json"  assert { type: "json" };

let model, block;
let formEnv = new FormsEnvironment();
let {adaptiveForm} =  formEnv.registrationForm();
let blockName = Constants.PANEL;

suit.forEach((testCase) => {
    describe(`${testCase.name} `, () => {

        beforeEach( async() => {
            window.adaptiveform = adaptiveForm;
            [model, block] = await formEnv.getFieldView(adaptiveForm, testCase.fieldId);
            return;
        });

        it(`Validate Panel Markup`, () => {
            let widgetWrapper = block.querySelector(testCase.element);
            ComponentValidator.validateWidget(model, blockName, widgetWrapper, true, false);
            expect(widgetWrapper.querySelector(`.${blockName}__label`)).not.to.null;
        });

        it("Validate Dynamic Hide/show", async() => {
            model.visible = false;
            ComponentValidator.validateWidget(model, blockName, block.querySelector(testCase.element), false, false);
            model.visible = true;
        });

        it('Validate Panel Items', async () => {
            let panel = block.querySelector(`${testCase.element}`);
            expect(panel.children.length).to.be.equal(testCase.items.length + 1); // 1 for widget

            for(let i = 0; i < testCase.items.length; i++) {
                let item = testCase.items[i];
                const fieldBlock = (await formEnv.getFieldView(adaptiveForm, item.fieldId))[1];
                const itemBlock = panel.querySelector(`[id$=${item.fieldId}]`);

                expect(fieldBlock.innerHTML).to.be.equal(itemBlock.outerHTML);
            }
        })
    });
});