export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/trend/info' },
      {
        path: '/settings',
        name: 'settings',
        icon: 'settings',
      },
      {
        path: '/trend',
        name: 'trend',
        icon: 'data',
        routes: [
          {
            path: '/trend/info',
            name: 'info',
            icon: 'info',
            component: './Experiment/ExperimentCurve',
          },
          {
            path: '/trend/analysis',
            name: 'analysis',
            icon: 'trend',
            component: './Dashboard/Analysis',
          },
          {
            path: '/trend/monitor',
            name: 'monitor',
            icon: 'function',
            component: './Dashboard/Monitor',
          },
          {
            path: '/trend/workplace',
            name: 'workplace',
            icon: 'wifi',
            component: './Dashboard/Workplace',
          },
          {
            path: '/trend/workplace1',
            name: 'workplace1',
            icon: 'changeWifi',
            component: './Dashboard/Workplace',
          },
          {
            path: '/trend/workplace2',
            name: 'workplace2',
            icon: 'identification',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        path: '/record',
        name: 'record',
        icon: 'record',
      },
      {
        path: '/admin',
        name: 'admin',
        icon: 'admin',
      },
    ],
  },
];
