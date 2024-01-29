var express=require('express');
var bodyparser=require('body-parser');
var multer=require('multer');
var path=require('path');
var mongoose=require('mongoose');
var ejs=require('ejs');
var app=express();
app.set('view engine','ejs');
app.set('./views','views');
var options={
    root:path.join(__dirname)
};
app.use(bodyparser.urlencoded());
app.use(express.static('imguploading'));
app.use(express.raw());
//mongoose connection

mongoose.connect("mongodb+srv://test:JUsbjVWeZLxsA8U7@cluster0.innzwio.mongodb.net/photos")
.then(()=>{
    console.log("database is connected successfully!!");
})
.catch((err)=>{
    console.log("err:"+err);
});
//storage part
var ds=multer.memoryStorage({
    destination:'imguploading',
    filename:(req,file,cb)=>{
        cb(null,file.originalname);

    }
});
var upload=multer({
    storage:ds
});
// img-schema
var imgschema=new mongoose.Schema({
    name:{
        type:String,required:true
    },
    image:{
        type:Buffer,required:true
    }
})
//database access
var images=mongoose.model('images',imgschema);
//get file
app.get('/add',(req,res)=>{
    res.sendFile("ph.html",options);
});
app.post('/upload',upload.single("image"),(req,res)=>{
   console.log(req.file);
   var mm=req.file.mimetype;
   var  Images=new images({
    name:req.body.name,
    image:req.file.buffer,
   })
   var buff=req.file.buffer.toString('base64');
   Images.save()
   .then(()=>{
    res.send(`<html><body><h1>Hiiiiii</h1><img src="data:image/${mm};base64,${buff}"</body></html>`);
    console.log('data uploaded successfully !!');
   })
   .catch((err)=>{
      console.log('uploading,err:'+err);
   })
});
app.get('/getimages',async(req,res)=>{
    const data= await images.find();
    res.render('phto',{userdata:data});

});
app.listen(9846,()=>{
    console.log('server is running port number 9846');
})