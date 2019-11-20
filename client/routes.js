import {Router} from '/vendors/@vanillarouter/router-module/dist/index.js'

const routes = [
    {path: '/', element: 'selection-form'},
    {path: '/who-brings-what', element: 'who-brings-what'}
];

export default Router.appRouter(routes);


