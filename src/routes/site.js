import express from 'express';
const router = express.Router();
import SiteController from '../app/controllers/SiteController.js';

router.get('/', SiteController.home);
router.get('/das', SiteController.das);
router.get('/doc', SiteController.doc);

export default router;