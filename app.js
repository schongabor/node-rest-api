//jshint esversion:6
////////////////////////////////////////////////SERVER SETUP////////////////////////////////////////////////
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

////////////////////////////////////////////////DATABASE SETUP////////////////////////////////////////////////
mongoose.connect("mongodb+srv://username:password@cluster0-ul9ti.mongodb.net/nameOfDB?retryWrites=true&w=majority", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////////CHAINED ROUTING CRUD////////////////////////////////////////
///////////////////////////////////requests targeting all articles//////////////////////////////////

app.route("/articles")

////////////////////////////////////////////////READ////////////////////////////////////////////////
.get(function(request, response){
    //Article.find({_id: articleID}function(err, foundArticles){
    Article.find(function(err, foundArticles){
        if(!err){
            response.send(foundArticles);
        } else{
            response.send(err);
        }
    });
})

////////////////////////////////////////////////CREATE////////////////////////////////////////////////
.post(function(request, response){
    const newArticle = new Article({
        title: request.body.title,
        content: request.body.content
    });

    newArticle.save(function(err){
        if(!err){
            response.send("Succesfully added a new item.");
        } else {
            response.send(err);
        }
    });
})

////////////////////////////////////////////////DELETE////////////////////////////////////////////////
.delete(function(request, response){
    //Article.deleteMany({_id: someID}, function(request, response){
    Article.deleteMany(function(err){
        if(!err){
            response.send("Succesfully delet all articles.");
        } else{
            response.send(err);
        }
    });
});


///////////////////////////////////requests targeting a specific article//////////////////////////////////
app.route("/articles/:articleTitle")

////////////////////////////////////////////////READ////////////////////////////////////////////////
.get(function(request, response){
    Article.findOne({title: request.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            response.send(foundArticle);
        }else{
            response.send("No articles matching that title was found.");
        }
    });
})

////////////////////////////////////////////////UPDATE (OVERWRITE)////////////////////////////////////////////////
.put(function(request, response){
    Article.update(
        {title: request.params.articleTitle}, //condition to find object
        {title: request.body.title, content: request.body.content}, //what to update
        {overwrite: true}, //if true, it will replace the whole document
        function(err){
            if(!err){
                response.send("Succesfully updated article.");
            }
        }
    );
})

////////////////////////////////////////////////UPDATE////////////////////////////////////////////////
.patch(function(request, response){
    Article.update(
        {title: request.params.articleTitle}, //condition to find object
        {$set: request.body}, //gives the whole body object (from body-parser) and it will update the changes
        function(err){
            if(!err){
                response.send("Succesfully updated article.");
            } else {
                response.send(err);
            }
        }
    );
})

////////////////////////////////////////////////DELETE ONLY ONE////////////////////////////////////////////////
.delete(function(request, response){
    Article.deleteOne(
        {title: request.params.articleTitle},
        function(err){
            if(!err){
                response.send("Succesfully deleted the corresponding article.");
            }else{
                response.send(err);
            }
        }
    );
});



////////////////////////////////////////////////SERVER START////////////////////////////////////////////////
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

