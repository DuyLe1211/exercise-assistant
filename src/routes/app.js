import express from 'express';
const router = express.Router();
import AppController from '../app/controllers/AppController.js';

router.get('/', AppController.app);
router.post('/', AppController.postRequest);

export default router;