import mongoose from 'mongoose';

const WhatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    date: {type: Date, default: Date.now},
    received: Boolean
});

export default mongoose.model('messagecontents', WhatsappSchema);