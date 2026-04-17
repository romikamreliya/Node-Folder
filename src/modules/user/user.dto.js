class UserRequestDto {

    static createFromRequest(req) {
        const { name, email, phone, password, status, notes } = req.body || {};
        const dto = {};
        dto.name = name;
        dto.email = email;
        dto.phone = phone;
        dto.password = password;
        dto.status = status;
        dto.notes = notes;
        return dto;
    }

    static updateFromRequest(req) {
        const { id, name, email, phone, notes } = req.body || {};
        const dto = {id};
        if (name) dto.name = name;
        if (email) dto.email = email;
        if (phone) dto.phone = phone;
        if (notes) dto.notes = notes;
        return dto;
    }

    static deleteFromRequest(req) {
        const { id } = req.body || {};
        return { id };
    }

    static filterFromRequest(req) {
        const { name } = req.query || {};
        return { 
            name:  typeof name === "string" ? name.trim() : ""
        };
    }

}

module.exports = UserRequestDto;