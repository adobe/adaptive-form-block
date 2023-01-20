import { createLabel as cl } from '../libs/default-builder.js'; // eslint-disable-line import/no-cycle

/**
 * Example of overriding to inlcude start
 * @param {*} state
 * @param {*} bemBlock
 * @returns
 */
export const createLabel = (state, bemBlock) => {
    const label = cl(state, bemBlock);
    if (label) {
        label.textContent = state?.required ? `${label?.textContent} *` : label?.textContent;
    }
    return label;
};
