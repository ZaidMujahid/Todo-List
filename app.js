const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
const itemsSchema = {
  name : String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to your todo-list!"
});
const item2 = new Item({
  name: "Press + button to add new item"
});
const item3 = new Item({
  name: "<<-- Press this to delete an item"
});

const defaultItems = [item1, item2, item3];
app.get("/", function(req, res) {
  
  const day = date.getDate();
  
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err); 
        } else {
          console.log("Successfully saved items to db");
        }
      });
    }else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    }else{
      console.log("successfully deleted the item!");
      res.redirect("/")
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
