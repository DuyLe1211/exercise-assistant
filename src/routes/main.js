import * as siteRouter from './site.js';
import * as appRouter from './app.js';
import * as apiRouter from './api.js';

function route(app) {
    app.use('/', siteRouter.default)
    app.use('/app', appRouter.default)
    app.use('/api', apiRouter.default)
}

export default route;