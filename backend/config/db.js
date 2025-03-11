const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongodbURI)
        console.log('MongoDB CONNECTED')
    } catch (error) {
        console.error('MongoDB CONNECTION ERROR:', error);
        process.exit(1);
    }
}

module.exports = connectDB