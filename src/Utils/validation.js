const Ajv = require("ajv");

class Validation {
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      useDefaults: true,
    });
    this.customkey();
  }

  customkey = () => {
    this.ajv.addKeyword("email", {
      type: "string",
      error: {message: "Email is Wrong"},
      validate: (schema, data) => {
        return (schema && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,8}$/.test(data));
      },
    });
  };

  schemaganretor = (schemadata) => {
    return {
      type: "object",
      properties: schemadata,
      required: Object.keys(schemadata),
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

  ajvchack = (schema) => {
    return this.ajv.compile(this.schemaganretor(schema));
  };
}

module.exports = new Validation();
