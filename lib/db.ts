
import mongoose from "mongoose";

const connectToDB = async () => {
    if (mongoose.connections[0].readyState) {   
        console.log("Already connected to DB");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: "testing"
        });
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to DB:", error);
    }
};

export default connectToDB;