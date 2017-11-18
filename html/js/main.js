var app = {};
$( document ).ready(function() {
    var newTd = function(content) {
        // TODO: Escape content
        return $("<td>" + content + "</td>");
    }
    app.listAccounts = function() {
        $.ajax({
            url: "/app/listAccounts",
            success: function(data) {
                var table = $("#accounts"),
                    info = JSON.parse(data) || {},
                    queryResponse = info.QueryResponse || {},
                    accountsInfo = queryResponse.Account || [];

                table.empty();
                table.append($("<tr><th>Name</th><th>Account Type</th><th>Current Balance</th></tr>"));
                accountsInfo.forEach(function(account) {
                    var tr = $("<tr/>");
                    tr.append(newTd(account.Name));
                    tr.append(newTd(account.AccountType));
                    tr.append(newTd(account.CurrentBalance));
                    table.append(tr);
                });

            }
        })
    }

    app.newAccount = function() {
        var accountType = $( "#account-type option:checked").val(),
            accoutnName = $ ("#account-name").val();
        $.ajax({
            url: "/app/newAccount",
            method: "POST",
            data: {
            AccountType: accountType,
            Name: accoutnName
            },
            success: function(data) {
                alert("Account Created");
            }
        })
    }
});