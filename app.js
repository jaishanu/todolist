//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const date = require(__dirname + "/date.js");
var workItems=[];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://jaishanu:JANUunaj2410@cluster0.cqqnm.mongodb.net/todolist2",{useNewUrlParser:true});
const modelschema1={
  name:String
};
const worklist=mongoose.model("worklist",modelschema1);
const name1=new worklist({
  name:"eat"
});
const name2=new worklist({
  name:"walk"
});
const name3=new worklist({
  name:"watch"
});
var namelist=[name1,name2,name3];
const day = date.getDate();
app.get("/", function(req, res) {
  worklist.find({},function(err,r){
    if(!r){
    worklist.insertMany(namelist,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("done");
      }
    });}
    res.render("list", {date: day,listTitle:"home", newListItems: r});
  });


});
app.post("/delete",function(req,res){
  if(req.body.listdelete=="home"){
  worklist.findByIdAndRemove(req.body.checkbox,function(err,r){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });
  }
  else{
    alllist.findOne({listname:req.body.listdelete},function(err,r){
      if(err){
        console.log(err);
      }
      else{
        const name6=r.listitems;
        name6.forEach(function(ditem){
          if(ditem._id==req.body.checkbox){
            ditem.remove();
          }
        });
        r.save();
            res.redirect("/"+req.body.listdelete);
      }
    });
  }
});
app.post("/", function(req, res){
  const item = req.body.newItem;

    const name4=new worklist({
      name:item
    });
 if(req.body.list=="home"){
    name4.save();;
    res.redirect("/");}
    else{
      alllist.findOne({listname:req.body.list},function(err,r){
        if(err){
          console.log(err);
        }
        else{
          r.listitems.push(name4);
          r.save();
          res.redirect("/"+req.body.list);
        }
      });
    }
});
const modelschema2={
  listname:String,
  listitems:[modelschema1]
}
const alllist=mongoose.model("alllist",modelschema2);

app.get("/:customlist", function(req,res){
  alllist.findOne({listname:req.params.customlist},function(err,r){
    if(!err){
      if(!r){
        const list1=new alllist({
          listname:req.params.customlist,                       //db.collection_zz.drop()
          listitems:namelist});
        list1.save();
        res.redirect("/"+req.params.customlist);
      }
      else{
        res.render("list.ejs",{date:day,listTitle: r.listname, newListItems: r.listitems});
      }
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
