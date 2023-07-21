import Pose from '../models/Pose.js';

class AppController {
    // [GET] /app
    async app(req, res) {
        let poses = await Pose.find({});
        return res.render('app', { poses:poses });
    }

    // [POST] /app
    async postRequest(req, res) {
        let reqBody = req.body;
        let poseList = reqBody.pose;
        let set = reqBody.set, rep = reqBody.rep, free = reqBody.time;

        return res.render('start', {layout: 'blank', data: poseList, set: set, rep: rep, free: free});
    }
}

export default new AppController;