import mongoose from 'mongoose';

const dBConnection = async () =>{
    try {
        const { MONGO_USERNAME:mongoUserName, MONGO_PASSWORD:mongoPassword } = process.env;
        const options = {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true, useFindAndModify:false };
        const connection = await mongoose.connect(`mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0-mbclo.gcp.mongodb.net/employeePortal?retryWrites=true&w=majority`, options);
        console.log(`Mongo Db connected to ${connection.connection.host}`)  
    } catch (error) {
        console.log(error.message)
    }   
}

export default dBConnection;