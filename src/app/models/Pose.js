import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PoseSchema = new Schema({
    name: String,
    require: String,
    condition: Array,
    start: Number,
    stop: Number,
    type: String,
    left: Array,
    right: Array
});

const Pose = mongoose.model('Pose', PoseSchema);
export default Pose;