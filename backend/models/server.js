const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const vendors = [
  { id:1, name:"Fresh Bazaar", distance:"1.2 km"},
  { id:2, name:"Vijay Mart", distance:"800 m"}
];

app.get("/vendors",(req,res)=>{
   res.json(vendors);
});

app.listen(5000,()=>{
   console.log("Server running on port 5000");
});