const express = require('express');
const bodyParser = require('body-parser');
const path = require('path-posix');
const ejs = require('ejs');
const lodash = require('lodash');
const mongoose = require('mongoose');

const app = express();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/dailyJournalDB');
}

const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String
});

const dailyPost = mongoose.model('dailyPost', postSchema);

path.resolve(__dirname,'foo');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];

dailyPost.find( {}, function(err, docs) {
  if(err) {
    console.log("error in finding daily posts!!");
  } else {
    docs.forEach( function(element) {
      posts.push(element);
    });
  }
});

app.get("/" , function (req, res) {

  res.render('home', {
    posts: posts
  });

});

app.get("/about", function (req, res) {

  res.render('about', {

    about: aboutContent

  } );

});

app.get("/contact", function (req, res) {

  res.render('contact', {

    contact: contactContent

  } );

});

app.get("/compose", function (req, res) {

  res.render('compose',{
    
  });

});

app.post("/compose", function (req, res) {
  
  const postDetails = {
    postTitle: req.body.title,
    postContent: req.body.content
  };

  const post = new dailyPost({
    postTitle: postDetails.postTitle,
    postContent: postDetails.postContent
  });

  post.save( function(err) {
   if(!err) {
      posts.push(postDetails);
      res.redirect('/');
   }
  });

});

app.get("/posts/:random", function (req, res) {
  
  let random = req.params.random;
  random = lodash.lowerCase(random);
  let found = "false";
  
  posts.forEach( function ( element) {
  
    let title = element.postTitle;
    title = lodash.lowerCase(title);
  
    if(title === random) {
      found = "true";
       res.render('post', {
         postTitle: title,
         postContent: element.postContent
       });
    }
  });

  if(found === "false") {
    res.send("Not found!!");
  }

});

app.listen(3000, function () {

  console.log("server is running");

});