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
    this.ajv.addKeyword("email", {
      type: "string",
      error: {message: "Email is Wrong"},
      validate: (schema, data) => {
        return (schema && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,8}$/.test(data));
      },
    });
  };

  schemaGenerator = (schemaData) => {
    return {
      type: "object",
      properties: schemaData,
      required: Object.keys(schemaData),
      additionalProperties: false,
    };
  };

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

    return propObj;
  };

  ajvChack = (schema) => {
    return this.ajv.compile(this.schemaGenerator(schema));
  };
}

module.exports = new Validation();
