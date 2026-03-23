const ajvUtils = require("../utils/ajv.utils");

class userValidationSchemas {
  static ajv = ajvUtils;

  static columns = {
    id: this.ajv.prop("number", {minimum: 1}),
    name: this.ajv.prop("string", {minLength: 2, maxLength: 100}),
    email: this.ajv.prop("string", {format: "customEmail"}),
    phone: this.ajv.prop("string", {format: "customPhone"}),
    password: this.ajv.prop("string", {minLength: 8, maxLength: 255}),
    status: this.ajv.prop("string", {enum: ["active", "inactive"]}),
    notes: this.ajv.prop("string", {maxLength: 1000}),
    updated_at: this.ajv.prop("string", {format: "date-time"}),
    created_at: this.ajv.prop("string", {format: "date-time"}),
  }

  static userCreateSchema() {
    return {
      fields: {
        name: this.columns.name,
        email: this.columns.email,
        phone: this.columns.phone,
        password: this.columns.password,
        status: this.columns.status,
        notes: this.columns.notes
      },
      options : {
        required: ["name", "email", "phone", "password"]
      }
    };
  }

  static userUpdateSchema() {
    return {
      fields: {
        id: this.columns.id,
        name: this.columns.name,
        email: this.columns.email,
        phone: this.columns.phone,
        notes: this.columns.notes
      },
      options : {
        required: ["id"]
      }
    };
  }

  static userIdSchema() {
    return {
      fields: {
        id: this.columns.id
      },
      options : {
        required: ["id"]
      }
    };
  }

  static ajvFunSchema() {
    return {
      fields: {
        type: this.ajv.prop("string", { title: "User Type", minLength: 2 }),
        name: this.ajv.prop("string", { title: "Name", minLength: 2 }),
        email: this.ajv.prop("string", { title: "user email", format: "customEmail" }),
        email_two: this.ajv.prop("string", { title: "Email Two", format: "customEmail" }),
        phone: this.ajv.prop("string", { title: "Phone", format: "customPhone" }),
        website: this.ajv.prop("string", { title: "Website", format: "customWebsite" }),
        demoTemp: this.ajv.prop("string", { title: "Name" }),
        array: this.ajv.prop("array", {
          title: "User List",
          items: this.ajv.prop("object", {
            title: "User List Array",
            properties: {
              name: this.ajv.prop("string", { title: "User List Name", minLength: 2 }),
              email: this.ajv.prop(["string", "null"], { title: "User List Email", format: "customEmail" })
            },
            minProperties: 2,
            required: ["name", "email"]
          }),
          minItems: 2,
          uniqueItems: true
        }),
        object: this.ajv.prop("object", {
          title: "User Object",
          properties: {
            name: this.ajv.prop("string"),
            email: this.ajv.prop(["string", "null"], { format: "customEmail" }),
            newTemp: this.ajv.prop(["string", "null"])
          },
          minProperties: 2,
          required: ["name"]
        })
      },
      options : {
        required: ["type", "name", "email", "array", "object", "email_two"],
        allOf: [
          {
            if: {
              properties: { type: { const: "admin" } }
            },
            then: {
              required: ["demoTemp"],
              properties: {
                demoTemp: this.ajv.prop("string", { minLength: 2 })
              }
            }
          }
        ]
      }
    };
  }

  static filterSchema() {
    return {
      fields: {
        name: this.ajv.prop("string", { title: "Name", minLength: 2 }),
        id: this.ajv.prop("number", { title: "ID", minimum: 1 }),
        range: this.ajv.prop("object", {
          title: "Range",
          properties: {
            start: this.ajv.prop("string", { title: "Start Date", format: "customDate" }),
            end: this.ajv.prop("string", { title: "End Date", format: "customDate" })
          },
          required: ["start", "end"]
        })
      },
      options : {
        required: ["name", "id"]
      }
    };
  }

  static allSchemas = {
    userCreate: this.userCreateSchema(),
    userUpdate: this.userUpdateSchema(),
    userId: this.userIdSchema(),
    ajvFunSchema: this.ajvFunSchema(),
    filterSchema: this.filterSchema()
  }

  /**
   * Validate data against a schema
   * @param {Object} data - Data to validate
   * @param {keyof typeof this.allSchemas} schemaName - Name of schema to validate against
   * @returns {Object} { isValid: boolean, errors: Array, validate: Function }
   */
  static validate(data, schemaName) {
    const schema = this.allSchemas[schemaName];
    if (!schema) {
      throw new Error(`Schema '${schemaName}' not found in UserValidationSchemas. Available schemas: ${Object.keys(this.allSchemas).join(", ")}`);
    }
    const validate = this.ajv.ajvCheck(schema.fields, schema.options);
    return {
      isValid: validate(data),
      errors: validate.errors,
      validate
    };
  }

}

module.exports = userValidationSchemas;
