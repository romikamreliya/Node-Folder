class commonConst{
    
    defaultPageLimit = 10;
    defaultLanguage = "en"

    userType = {
        admin: "Admin",
        user: "User",
        publisher: "Publisher",
    };
    statusCode = {
        success: 200,
        error: 500,
    }
    tokenType = {
        api:"api",
        web:"web"
    }
}

module.exports = new commonConst();
