import express from 'express';
const router = express.Router();
import ApiController from '../app/controllers/ApiController.js';

router.get('/', ApiController.getId);

export default router;