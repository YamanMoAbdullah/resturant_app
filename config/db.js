const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.development.local' });

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.dburl);
        console.log("MongoDB Connected...");
    }   
    catch(err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    }
};

module.exports = connectDb;
