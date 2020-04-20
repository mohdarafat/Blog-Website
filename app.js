 var express=require('express'),
bodyparser=require('body-parser'),
methodOverride = require('method-override');
mongoose= require('mongoose'),
app =express();


mongoose.connect("mongodb://localhost/blog");

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

var blogSchema = new mongoose.Schema({
    title:  String,
    
    image :String,
    body:   String,
    created:{type:Date,default:Date.now}
    
  });

  
var blog=mongoose.model("blog",blogSchema);

app.get("/",function(req,res){
  res.redirect('/blogs');
});

app.get("/blogs",function(req,res){
  blog.find({},function(err,blogs){
  if(err){
    console.log("error");
  }else{
    res.render("index",{blogs:blogs});
  }
  
 });

});
  app.get("/blogs/new",function(req,res){

    res.render("new");
  });
  //for redirect
  app.post("/blogs",function(req,res){
    
    blog.create(req.body.blog,function(err,newblog){
   if(err)
   {
     res.render("new");

   }else{
     res.redirect("/blogs");
   }
    
    });

  });
 // for show
 app.get("/blogs/:id", function(req,res){
   blog.findById(req.params.id,function(err,foundblog){
     if(err)
     {
       res.redirect("blogs");
     }else{
       res.render("show",{blog : foundblog});
     }
   })
 });
 //for edit route

 app.get("/blogs/:id/edit",function(req,res){
   blog.findById(req.params.id,function(err,foundblog){
    if(err){
       res.redirect("/blogs")
     }else{
       res.render("edit", {blog:foundblog});
     }

    })
 })
//for update route

app.put("/blogs/:id",function(req,res){
  blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
    if(err){
      res.redirect('/blogs');
    }else{
      res.redirect('/blogs/' + req.params.id);
    }
  });
});


//for delete route
app.delete("/blogs/:id",function(req,res){
  blog.findByIdAndRemove(req.params.id,function(err){
  if(err){
    res.redirect("/blogs");
  }else{
    res.redirect("/blogs");
  }

  });
});







app.listen(70,function(){
    console.log('its working');
});