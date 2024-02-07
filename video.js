var express=require('express');
var multer=require('multer');
var bodyparser=require("body-parser");
var mongoose=require('mongoose');
var path=require('path');
var ejs=require('ejs');
var options={
    root:path.join(__dirname)
}
const app=express();
app.set('view engine','ejs');
app.set("./views","views");

app.use(bodyparser.urlencoded());
app.use(express.static('uploads'));
app.use(bodyparser.json());
app.use(express.raw());
mongoose.connect("mongodb+srv://test:JUsbjVWeZLxsA8U7@cluster0.innzwio.mongodb.net/mp3")
.then(()=>{
    console.log("database  is connected is successlly!!");
})
.catch((err)=>{
  console.log("database is connected error:"+err)
});
var ds=multer.memoryStorage();
 var videoupload=multer({storage:ds});
 const videoschema=new mongoose.Schema({
    name:{type:String,required:true},
    video:{type:Buffer,required:true},
 });
 const video=mongoose.model('video',videoschema);
 app.post("/video-upload",videoupload.single('videos'),async(req,res)=>{
    try{
        const Video=new video({
            name:req.body.name,
            video:req.file.buffer,
        });
      
        await Video.save()
        .then(()=>{
            console.log("video uploaded successfully");

            var buff=Video.video.toString("base64");
            res.send(`<html><body><h1>Hiiiiii</h1><video controls>
            <source src=data:video/mp4;base64,${buff}>" type="video/mp4">  
        </video></body></html>`);
        })
        .catch((err)=>{
            console.log("error on video uploading"+err);
            res.send("video not uploaded");
        })
    }
    catch(err){
       console.log(err);
       res.status(500).json({message:"error uploading"});
    }
    
 });
 app.get("/getvideo",async(req,res)=>{
    try{
        res.sendFile("videoupload.html",options);
    }
    catch(err){
        console.log("error get video uploading");
    }
 });
 app.get("/displayvideo",async(req,res)=>{
    try{
       const data=await video.find();
       console.log(data.name);
   res.render("vdo",{data});
    }  
    catch(err){
        console.log("errror while fetching!!!"+err);
    }
 });
 //audio files
var ds=multer.memoryStorage();
 var audioupload=multer({storage:ds});
 const audioschema=new mongoose.Schema({
    name:{type:String,required:true},
    audio:{type:Buffer,required:true},
 });
 const nithinmp3=mongoose.model('nithinmp3',audioschema);
 app.post("/audio-upload",audioupload.single('audio'),async(req,res)=>{
    var add=new nithinmp3({
        name:req.body.name,
        audio:req.file.buffer,
    })
    await add.save()
    .then(()=>{
        console.log("audio will be saved!!");
        var buff=add.audio.toString("base64");
        //console.log(buff)
            res.send(`<html><body><h1>Hiiiiii</h1><audio controls>
            <source src=data:audio/mp3;base64,${buff}>" type="audio/mp3">  
        </audio></body></html>`);
     
    })
    .catch((err)=>{
          console.log("audio not saved while uploading!!!");
          res.send(err+"while saving");
    });

 });

 app.get("/sendaudio",(req,res)=>{
    try{
        res.sendFile("audioupload.html",options);
    }
    catch(err){
        console.log("error while enter the data!!");
    };

 });
app.get("/get-audio",async(req,res)=>{
    var data= await nithinmp3.find({});
    for(let i=0;i<data.length;i++){
        console.log(data.name);
    }
    res.render("ado",{data});
})
 app.listen(2342,(req,res)=>{
    console.log("server is running port number 2342")
 });
