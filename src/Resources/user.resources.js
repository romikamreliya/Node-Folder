class UserResources {
    constructor() {
        this.user = {
            id:"",
            name : "",
            email: "",
            phone: "",
            is_active : false,
        }
    }

    fulldetails = (data = {}) => {
        return {
            id : data.id ?? this.user.id,
            name : data.name ?? this.user.name,
            email : data.email ?? this.user.email,
            phone : data.phone ?? this.user.phone,
            is_active : data.is_active ?? this.user.is_active,
        }
    }

    list = (data) => {
        return data?.map(item => this.fulldetails(item));
    }

}

module.exports = new UserResources();