//this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

//The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.

// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.

// Once the update goes through, show the customer the total cost of their purchase.

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



// con.query("SELECT * FROM products", function(err, res){
// });

// replacements in querys SELECT * FROM songs WHERE genre=?, ["Dance"], <-- replaces question mark.
// console.log(query.sql);

// CRUD (CREATE, READ, UPDATE, DELETE) -- DATABASE STUFF!

// call database function
// ----------------------
// connnectDatabase();

// call order function.
// ----------------------
