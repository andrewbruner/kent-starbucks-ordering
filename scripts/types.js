/**
 * Object of orderable item
 * @typedef {Object} Item
 * @property {string} description
 * @property {number} uom
 * @property {number} par
 * @property {number} [boh]
 * @property {number} [enRoute]
 * @property {number} [order]
 */

/** 
 * Object of sessionStorage data
 * @typedef {Object} Data 
 * @property {{stage: string, distributor: string}} state
 * @property {Item[]} [cdc]
 * @property {Item[]} [rdc]
 */

const types = {};

export default types;
