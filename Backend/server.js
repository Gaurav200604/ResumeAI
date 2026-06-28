require('dotenv').config();

const app = require('./src/app.js');
const connectDB = require('./src/config/database');
// const invokeGeminiAi = require('./src/services/ai.service.js');



connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);

})
