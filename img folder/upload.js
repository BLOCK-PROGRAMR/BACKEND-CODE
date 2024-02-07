var express=require("express");
const app=express();
var mongoose=require("mongoose");
var bodyparser=require("body-parser");
var multer=require("multer");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }))
app.use(express.static("imgfolder"));
var path=require("path");
var options={
    root:path.join(__dirname)
}
mongoose.connect("mongodb+srv://test:JUsbjVWeZLxsA8U7@cluster0.innzwio.mongodb.net/buffer")
.then(function(){
    console.log("Database is connected !");
})
.catch(function(err){
    console.log("Database connection error"+err);
});
var ds=multer.memoryStorage({
    destination:"uploads",
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
var upload=multer({
    storage:ds
});
const imgschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
type:Buffer,
required:true
    
    }
});
var buffimg=mongoose.model("buffimg",imgschema);
app.get('/',async(req,res)=>{
res.sendFile("index.html",options);
})
app.post("/upload",upload.single("image"),async function(req,res){
    try{
    // const  file=req.file;
     console.log(req.file)
     var mm=req.file.mimetype;
     var image=await new buffimg({
    name:req.body.name,
    image:req.file.buffer
     });
     console.log('data is:',image)

  const buff = req.file.buffer.toString('base64');
//var buff=req.file.buffer
     await image.save()
     .then( function(){
    console.log("data saved!");   
          
//<img src="data:image/{contentType};base64,{base64EncodedData}">
//<img src="data:image/jpeg;base64,<?= $base64EncodedImageData ?>">
res.send(`<html><body><h1>Hiiiiii</h1><img src="data:image/${mm};base64,${buff}"</body></html>`);
        // res.send("Okkk")
    })
    .catch(function(err){
        console.log("error on data saving "+err);
    });
    }
    catch(err){
        console.log("error on upload image method!"+err);
        }

})
app.get('/getimg', async (req, res) => {
    const data = await buffimg.find();
   //console.log(data[1].image)
console.log(data.length);
    var n=data.length-1;
if(data[n]){
  var i=data[n];
  var mm=i.mimetype;
  var buff=i.image.toString("base64");
res.send(`<html><body><h1>Hiiiiii</h1><img src="data:image/${mm};base64,${buff}" style="border-radius:60px"/></body></html>`);
}
  else
  {
    console.log("no images");
  }
});

app.listen(5123,function(req,res){
    console.log("server is running!");
})