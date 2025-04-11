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

    type === "number"
      ? ((propObj.minimum = options.minimum),
        (propObj.maximum = options.maximum))
      : type === "string"
      ? ((propObj.minLength = options.minLength),
        (propObj.maxLength = options.maxLength))
      : null;

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
