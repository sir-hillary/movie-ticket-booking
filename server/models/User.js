import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    image: {type: String, required: false, default: ""},
}, { timestamps: true });

export default mongoose.model('User', userSchema);

