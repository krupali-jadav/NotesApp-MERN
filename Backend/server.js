const express = require('express');
const cors = require('cors');
require("dotenv").config();

const connectDb = require("./config/db")
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app= express();

//connect database
connectDb();
app.use(cors());
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/notes",noteRoutes)

app.get("/",(req,res)=>{
    res.send("notebook")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
