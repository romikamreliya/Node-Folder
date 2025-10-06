class commonConst{
    
    pageLimit = 10;
    commandLen = "en"

    userType = {
        admin: "Admin",
        user: "User",
        publisher: "Publisher",
    };
    resCode = {
        success: 200,
        error: 500,
    }
    tokenType = {
        api:"api",
        web:"web"
    }
}

module.exports = commonConst;
