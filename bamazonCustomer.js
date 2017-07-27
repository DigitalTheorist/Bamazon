
var inquirer = require('inquirer');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bamazon"});

con.connect(function(err) {
  if (err)
    throw err;
  console.log("Connected as ID " + con.threadID);
});

// Prints to terminal all data in database.
con.query("SELECT * FROM products", function(err, res) { // res (result) is the database IE: res[i].id
  if (err)
    throw err;
      console.log(res);
    orderProduct();
});

function orderProduct() {
  console.log("order your products based on product id from table above.");
  inquirer.prompt([
    {
      name: "product",
      message: "Enter the product id of the product you'd like to order."
    }, {
      name: "quantity",
      message: "How many units would you like to order?"
    }
  ]).then(function(answers) {

    // make modular function(S)???
    var quantityQuery
    var priceQuery

    var stockQuery = con.query('SELECT stock_quantity, price FROM products WHERE id = ?;', [answers.product], function(err, res) {
        if (err) throw err;
        priceQuery = (res[0].price);
        // console.log(priceQuery + " priceQuery")
        quantityQuery = (res[0].stock_quantity);
        // console.log(quantityQuery);

        var newQuantity = quantityQuery - answers.quantity;

          if (quantityQuery >= answers.quantity) {

            con.query('UPDATE products SET ? WHERE ?', //SET = column
              [{
              stock_quantity: newQuantity,
              },
              {
              id: answers.product
              }],
              function(err, res) {
                if (err) throw err;
                var totalPrice = answers.quantity * quantityQuery;
                console.log("The total price of your order will be $" + totalPrice + ".00");
                console.log("Your order has been placed.");
                totalPrice = 0;
                }); // query endtag
                } else {
                console.log("Insufficient stock quantity.");
                };
      });
  });
}; // orderProduct endtag
