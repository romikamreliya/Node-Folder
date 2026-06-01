const BaseDTO = require("../../common/base/base-dto");
class UserRequestDto extends BaseDTO {

    static createFromRequest(req) {
        const { name, email, phone, password, status, notes } = req.body || {};
        const dto = {};
        dto.name = name;
        dto.email = email;
        dto.phone = phone;
        dto.password = password;
        dto.status = status ?? "active";
        dto.notes = notes ?? "";
        return dto;
    }

    static updateFromRequest(req) {
        const { id, name, email, phone, notes } = req.body || {};
        const dto = {id};
        if (name !== undefined) dto.name = name;
        if (email !== undefined) dto.email = email;
        if (phone !== undefined) dto.phone = phone;
        if (notes !== undefined) dto.notes = notes;
        return dto;
    }

    static deleteFromRequest(req) {
        const { id } = req.body || {};
        return { id };
    }

    static filterFromRequest(req) {
        const { name } = req.body || {};
        return { 
            name:  typeof name === "string" ? name.trim() : "",
            ...this.extractPagination(req.body)
        };
    }

}

module.exports = UserRequestDto;