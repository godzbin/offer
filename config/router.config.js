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
        path: '/trend',
        name: 'trend',
        icon: 'data',
        routes: [
          {
            path: '/trend/info',
            name: 'info',
            icon: 'info',
            component: './Experiment/Info',
          },
          {
            path: '/trend/analysis',
            name: 'analysis',
            icon: 'trend',
            component: './Experiment/ExperimentCurve',
          },
          {
            path: '/trend/monitor',
            name: 'monitor',
            icon: 'function',
            component: './Dashboard/Monitor',
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
      {
        path: '/settings',
        name: 'settings',
        icon: 'settings',
        routes: [
          {
            path: '/settings/connectNetwork',
            name: 'connectNetwork',
            icon: 'wifi',
            component: './ChangeNetwork/connectNetwork',
          },
          {
            path: '/settings/changeNetwork',
            name: 'changeNetwork',
            icon: 'changeWifi',
            component: './ChangeNetwork/index',
          },
          {
            path: '/settings/workplace2',
            name: 'workplace2',
            icon: 'identification',
            component: './Dashboard/Workplace',
          }
        ]
      },
    ],
  },
];
