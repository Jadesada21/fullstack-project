import mongoose from "mongoose";

const connectDb = async (url: string) => {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(url)
        console.log('mongodb is running')
    } catch (err) {
        console.error("MongoDb Connection Error", err)
    }
}
export default connectDb