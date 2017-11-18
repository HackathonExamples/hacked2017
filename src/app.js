var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    rp = require("request-promise"),
    path = require("path"),
    oauthSignature = require("oauth-signature"),
    config = require(path.join(__dirname, "..", "config", "secrets.json")),
    router = express.Router(),
    app = express(),
    PORT = 10000,
    client_id = config.client_id,
    client_secret = config.client_secret,
    httpServer;

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false,
    limit: "1mb"
}));
app.use(bodyParser.json({
    limit: "1mb"
}));
app.use("/html", express.static(path.join(__dirname, "..", "/html")));

app.use("/app", router);

// Endpoint which will be called after OAuth login
router.get("/redirect", function(req, res) {
    var url = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        authHeader = "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64");
 
    console.log("Exchange code for token by calling OAuth endpoint");
    rp({
        url: url,
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: authHeader, 
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: "http://localhost:10000/app/redirect"
        }
    }).then(function(resp) {
        var response = JSON.parse(resp);
        console.log("Received token from OAuth, now settings cookies on client");
        // This should be secure and https
        res.cookie("access_token", response.access_token, {httpOnly: true});
        res.cookie("realmId", req.query.realmId);

        // Redirect to the main application page
        res.redirect("/html/main.html");
    });

});

// Endpoint used by application to list accounts for current session
router.get("/listAccounts", function(req, res) {
    var url = "https://sandbox-quickbooks.api.intuit.com/v3/company/" + req.cookies.realmId + "/query";
    rp({
        url: url,
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + req.cookies.access_token
        },
        qs: {
            query: "select * from account"
        }
    }).then(function(resp) {
        res.send(resp).end();
    }, function(err) {
        console.log(err.response.body);
        res.status(err.statusCode).end();
    });
});

// Endpoint used by application to create new accounts
router.post("/newAccount", function(req, res) {
    var url = "https://sandbox-quickbooks.api.intuit.com/v3/company/" +req.cookies.realmId + "/account";
    console.log("Creating new account");
    rp({
        url: url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.cookies.access_token
        },
        body: JSON.stringify(req.body)
    }).then(function(resp) {
        res.send(resp).end();
    }, function(err) {
        console.log(err.response.body);
        res.status(err.statusCode).end();
    });
});

httpServer = http.createServer(app);

httpServer.listen(PORT, "127.0.0.1");