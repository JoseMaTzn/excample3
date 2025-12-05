const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

app.use(express.urlencoded({ extended: true })); //forms

require("dotenv").config()   

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   email:String,
   password:String, 
   userType:String
})
const User = new mongoose.model("users", userSchema)

app.get("/", async (req, res) => {     
    console.log("DEBUG: User on the / endpoint")   
    return res.render("home.ejs")
})

app.get("/page2", (req,res)=>{
    console.log("DEBUG: User on page2/ endpoint")   
    return res.send(`<p>Welcome to page 2</p><a href="/">Go Home</a>`)
})


app.post("/create-account", async (req,res)=>{
    console.log("DEBUG: User on the /create-account endpoint")
    console.log("DEBUG: What is in the form?")
    console.log(req.body)

    // create a user
    const userAdded = await User.create({
           email:req.body.txtEmail,
           password:req.body.txtPassword,
           userType: req.body.selUserType
    })

    return res.send(`User created! ${userAdded._id}.  <a href="/">Go home!</a>`)   
})

async function startServer() {    
        
    try {    
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++")
        console.log("++++ ATTEMPTING TO CONNECT!!!! +++++ ")
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++")        

        await mongoose.connect(process.env.MONGODB_URI)

        console.log("SUCCESS connecting to MONGO database")
        console.log("STARTING Express web server")        
        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }
    catch (err) {        
        console.log("ERROR: connecting to MONGO database")
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}

startServer()