import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
// import Table from './views/nav1/Table.vue'
// import Form from './views/nav1/Form.vue'
// import user from './views/nav1/user.vue'
// import echarts from './views/charts/echarts.vue'

import banner from './views/image-manage/banner.vue'
import cargo from './views/cargo-manage/cargo.vue'
import order from './views/order-manage/order.vue'
import standard from './views/standard-manage/standard.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航一',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         // { path: '/table', component: Table, name: 'Table' },
    //         // { path: '/form', component: Form, name: 'Form' },
    //         // { path: '/user', component: user, name: '列表' },
    //         { path: '/echarts', component: echarts, name: '图表' },
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '商品管理',
        iconCls: 'el-icon-s-goods',//图标样式class
        children: [
            { path: '/cargo', component: cargo, name: '商品管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '图片管理',
        iconCls: 'el-icon-picture',//图标样式class
        children: [
            { path: '/banner', component: banner, name: '首页轮播图' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'el-icon-s-order',//图标样式class
        children: [
            { path: '/order', component: order, name: '订单管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '规格管理',
        iconCls: 'el-icon-s-grid',//图标样式class
        children: [
            { path: '/standard', component: standard, name: '规格管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;