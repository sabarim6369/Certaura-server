const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const LabRoutes=require("./routes/labRoutes");
const AgentRoutes=require("./routes/AgentRoutes")
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);
app.use("/agent",AgentRoutes);
app.use("/lab",LabRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
