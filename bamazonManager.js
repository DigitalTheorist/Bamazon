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

managerView();

function managerView (){
inquirer.prompt([
  {
    type: "list",
    name: "managerChoice",
    message: "What would you like to do?",
    choices: ["View products for sale.", "View low inventory.", "Add to inventory.", "Add new product.", "I'm done for now."]
  }
]).then(function(answers){
    if (answers.managerChoice === 'View products for sale.') {
      viewProducts();
    } else if (answers.managerChoice === 'View low inventory.') {
      lowInventory();
    } else if (answers.managerChoice === 'Add to inventory.') {
      addInventory();
    } else if (answers.managerChoice === 'Add new product.'){
      addProduct();
    } else {
      return
    }
});
};

function viewProducts (){
  con.query("SELECT * FROM products", function(err, res) { // res (result) is the database IE: res[i].id
    if (err) throw err;
    console.log(res);
  });
};

function lowInventory (){
  console.log("These items have 5 or fewer products in stock.")
  con.query("SELECT * FROM products WHERE stock_quantity < 6", function(err, res){
    if (err) throw err;
    console.log(res);
  });
};

function addInventory (){
 inquirer.prompt([
   {
     name: "id",
     message: "Select product by id."
   },
   {
     name: "quantity",
     message: "select quantity of product to add."
   }
 ]).then(function(answers){
   console.log(answers);
    var stockQuery = con.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [answers.quantity, answers.id], function(err, res) {
        if (err) throw err;
         }); // stockQuery endtag
       }); // then function endtag
};

function addProduct(){

};
