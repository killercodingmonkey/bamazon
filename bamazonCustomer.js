var mysql = require("mysql");
var inquirer = require("inquirer")

var dataB =[]
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayGoods()
});

function displayGoods() {
    var query = connection.query("SELECT * FROM products ", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
            
        }
        
        ask(res)
    });
}
function ask(pass) {
    inquirer
        .prompt([
            {
                name: "ask",
                message: "Please select the number of the item you would like to purchase",
                validate: function (value) {
                    if ((value) !== NaN) {
                        return true;
                    }
                    return false;
                }
            },
            {

                name: "amount",
                message: "Please input the quantity of the product you would like",
                validate: function (value) {
                    if ((value) !== NaN) {
                        return true;
                    }
                    return false;
                }
            }])
        .then(function (answers) {
            
            if (pass[answers.ask-1].stock_quantity < parseInt(answers.amount)) {
                console.log("Insufficient quantity!")
            }
            else {
                var newIn = pass[answers.ask-1].stock_quantity - answers.amount
                var totalCost = pass[answers.ask-1].price*parseInt(answers.amount)
                subtract(newIn, answers.ask, totalCost)
                
            }
        })
}
function subtract(pass, again,more){
    console.log("you made it")
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: pass
          },
          {
            item_id: again
          }
        ],
        function(err, res) {
          console.log(res.affectedRows + " products updated!\n");
          total(more)
        })
        function total(pass) {
            console.log( "Your total comes to "+pass)
            connection.end()
            
        }
}
