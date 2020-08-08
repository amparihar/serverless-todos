const jwt = require("jsonwebtoken");

module.exports = (event) => {
    var authToken = event.authorizationToken,
        authTokenArr = authToken.split(" ") || [],
        bearer = authTokenArr[0] || "",
        token = authTokenArr[1] || "";
    
    if (authHeaderArr.length !== 2 || bearer.toLowerCase() !== "bearer" || token.length === 0){
        return null;
    }
    var decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    if (decodedToken && decodedToken.uid && decodedToken.uid.length > 0){
        return decodedToken.uid;
    }
    return null;


    



}