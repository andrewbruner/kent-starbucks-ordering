/**
 * @typedef {object} Item
 * @property {string} description
 * @property {number} uom
 * @property {number} par
 * @property {number|null} boh
 * @property {number|null} enRoute
 * @property {number|null} order
 */

/** 
 * @typedef {object} Data 
 * @property {object} state
 * @property {string} state.stage
 * @property {string|null} state.distributor
 * @property {Item[]|null} items
 */

/**
 * @callback Callback
 * @param {Event} event
 * @param {{ [key]: * }} [options]
 */

const types = {};

export default types;
