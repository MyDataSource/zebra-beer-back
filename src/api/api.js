import axios from './request';

let base = 'http://localhost:3000';//http://localhost:8080

export const getPort = params => { return axios.get(`${base}/BeerManage/message/getIp`, { params: params }); };

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//
export const getBannerList = params => { return axios.get(`${base}/BeerApp/home/all`, { params: params }); };//获取轮播图

// x-www-form-urlencoded
export const updateBannerList = params => { return axios.post(`${base}/BeerApp/home/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//更新轮播图

export const getCargoList = params => { return axios.get(`${base}/BeerApp/cargo/getAll`, { params: params }); };//获取所有商品

export const updateCargoList = params => { return axios.post(`${base}/BeerApp/cargo/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//修改商品

export const addCargoList = params => { return axios.post(`${base}/BeerApp/cargo/add.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//添加商品

export const getStandardList = params => { return axios.post(`${base}/BeerApp/spec/get.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取所有规格

export const getOrderList = params => { return axios.post(`${base}/BeerApp/order/get.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取所有订单