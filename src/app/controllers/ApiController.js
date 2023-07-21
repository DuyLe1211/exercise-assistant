import Pose from '../models/Pose.js';

class ApiController {
    // [POST] /api
    async getId(req, res) {
        let id = req.query.id;
        let pose = await Pose.find({_id: id});
        return res.json(pose);
    }
}

export default new ApiController;