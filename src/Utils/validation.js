const Ajv = require("ajv");

class Validation {
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      useDefaults: true,
    });
    this.customKey();
  }

  customKey = () => {
    this.ajv.addKeyword({
      keyword: "customEmail",
      type: "string",
      error: { message: "Email is Wrong" },
      validate: (schema, data) => {
        if (!schema || !data) return true;
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,8}$/.test(data);
      },
    });
    this.ajv.addKeyword({
      keyword: "customPhone",
      type: "string",
      validate: function (schema, data) {
        if (!schema || !data) return true;
        return /^\+?[0-9]{7,15}$/.test(data); // e.g., +12345678900
      },
      error: { message: "Phone Number is Wrong" },
    });
    this.ajv.addKeyword({
      keyword: "customWebsite",
      type: "string",
      validate: function (schema, data) {
        if (!schema || !data) return true;
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/.test(data);
      },
      error: { message: "Website URL is Wrong" },
    });
  };

  schemaGenerator = (schemaData, options) => {
    return {
      type: "object",
      properties: schemaData,
      required: options.required || Object.keys(schemaData),
      allOf: options.allOf,
      additionalProperties: false,
    };
  };

  /**
   * Creates a schema property object.
   * 
   * @param { "number" | "string" | "array" | "object"} type - The type of the property ("number", "string", "array", "object").
   * @param {PropOptions} [options={}] - Additional property constraints.
   * @returns {Object} Schema-like property object.
   * 
   * @typedef {Object} PropOptions
   * @property {number} [minimum] - Minimum value (for numbers).
   * @property {number} [maximum] - Maximum value (for numbers).
   * @property {number} [minLength] - Minimum length (for strings).
   * @property {number} [maxLength] - Maximum length (for strings).
   * @property {number} [minItems] - Minimum items (for arrays).
   * @property {number} [maxItems] - Maximum items (for arrays).
   * @property {boolean} [uniqueItems] - Whether array items must be unique.
   * @property {Object|Array} [items] - Schema for array items.
   * @property {number} [minProperties] - Minimum properties (for objects).
   * @property {number} [maxProperties] - Maximum properties (for objects).
   * @property {Object} [properties] - Schema for object properties.
   * @property {string} [pattern] - Regex pattern (for strings).
   * @property {Array} [enum] - Allowed values.
   * @property {"customEmail" | "customPhone" | "customWebsite" } [format] - Special format flag (e.g. "email", "date").
   * @property {boolean} [required] - Whether field is required.
   */
  prop = (type, options = {}) => {
    const propObj = { type };

    type.includes("number")
      ? (
        (propObj.minimum = options.minimum),
        (propObj.maximum = options.maximum)
      )
      : type.includes("string")
        ? (
          (propObj.minLength = options.minLength),
          (propObj.maxLength = options.maxLength)
        )
        : type.includes("array")
          ? (
            (propObj.minItems = options.minItems),
            (propObj.maxItems = options.maxItems),
            (propObj.uniqueItems = options.uniqueItems),
            (propObj.items = options.items)
          )
          : type.includes("object")
            ? (
              (propObj.minProperties = options.minProperties),
              (propObj.maxProperties = options.maxProperties),
              (propObj.properties = options.properties)
            )
            : null;

    options.pattern !== undefined && (propObj.pattern = options.pattern);
    options.enum !== undefined && (propObj.enum = options.enum);
    options.default !== undefined && (propObj.default = options.default);
    options.format !== undefined && (propObj[options.format] = true);
    options.required !== undefined && (propObj.required = options.required);

    return propObj;
  };

  ajvChack = (schema, options = {}) => {
    return this.ajv.compile(this.schemaGenerator(schema, options));
  };
}

module.exports = new Validation();
