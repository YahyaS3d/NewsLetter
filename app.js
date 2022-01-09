//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");
const { response } = require("express");
const app = express();
app.use(express.static("public"));//provide the access to css files via server          
app.use(bodyParser.urlencoded({extended:true}));//provide the access to parameters from the html page:"with given name"

app.get("/",(req,res) =>{
res.sendFile(__dirname+"/signup.html");
});

app.post("/",(req,res)=>{
const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;
const data = {
    members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
            FNAME: firstName,
            LNAME: lastName
            }
        }
    ]
};
const jsonData = JSON.stringify(data);
const url = "https://us20.api.mailchimp.com/3.0/lists/fd85f42bc4"; //X = the number after the us in my API key + after the lists/ we must include list ID
const options = {
    method:"POST",
    headers:{
        "Authorization":"Yahya c18875c7162ee5cd59c51de6a3afe8fb-us20"
    },
}; 
const request = https.request(url, options, (response)=>{
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }else{
        res.sendFile(__dirname + "/failure.html");
    }
response.on("data", (data)=>{
console.log(JSON.parse(data));
});
});



request.write(jsonData);
request.end();
});
app.post("/failure", (req,res)=>{
res.redirect("/");
});

//process.env.PORT: display in heroku
app.listen(process.env.PORT || 3000, () => {
console.log("Server is running on port 3000");
});
