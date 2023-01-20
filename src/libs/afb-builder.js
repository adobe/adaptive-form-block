import * as defaultBuilder from './default-builder.js'; // eslint-disable-line import/no-cycle
import * as customerBuilder from '../customization/custom-builder.js'; // eslint-disable-line import/no-cycle

const result = { ...defaultBuilder, ...customerBuilder };
export default result;
