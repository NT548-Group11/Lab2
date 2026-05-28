const {default: mongoose} = require('mongoose');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected`);
    } catch(error){
        console.error(`MongoDB connection error`);
        throw error;
    }
}
module.exports = dbConnect;