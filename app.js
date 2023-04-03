
const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const dishcheme = new Schema({dishName: String, dishWeight: Number,dishCuisine: String}, {versionKey: false});
const Dish = mongoose.model("Dish", dishcheme);
 
app.use(express.static(__dirname + "/public"));
 
mongoose.connect("mongodb://localhost:27017/restaurantdb", { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
  
  app.get("/api/dishes", function(req, res){
    Dish.find({})
        .then(dishes => {
            res.send(dishes);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
 
app.get("/api/dishes/:id", function(req, res){
        
    const id = req.params.id;
    Dish.findOne({ _id: id })
    .then(foundDish => {
    console.log('Dish found:', foundDish);
    // handle the found dish
    res.send(foundDish);
  })
  .catch(error => {
    console.error('Error finding dish:', error);
    // handle the error
    res.sendStatus(500);
  });
});
    
app.post("/api/dishes", jsonParser, function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
        
    const dishName = req.body.dishName;
    const dishWeight = req.body.dishWeight;
    const dishCuisine = req.body.dishCuisine;
    const dish = new Dish({dishName: dishName, dishWeight:dishWeight ,dishCuisine:dishCuisine});
        
dish.save()
  .then(savedDish => {
    console.log('Dish saved:', savedDish);
    // handle the saved dish
  })
  .catch(error => {
    console.error('Error saving dish:', error);
    // handle the error
  });
});
     
app.delete("/api/dishes/:id", function(req, res){
         
    const id = req.params.id;
    Dish.findByIdAndDelete(id).then(dish=>{
        res.send(dish);
    })
    .catch(err=>{
        return console.log(err);
    });
});
    
app.put("/api/dishes", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const dishName = req.body.dishName;
    const dishWeight = req.body.dishWeight;
    const dishCuisine = req.body.dishCuisine;
    const newdish = { dishName: dishName, dishWeight:dishWeight ,dishCuisine:dishCuisine };
  
    Dish.findOneAndUpdate({_id: id}, newdish, {new: true})
    .then(dish=>{
        res.send(dish);
    })
    .catch(err=>{
        return console.log(err); 
    });
});

