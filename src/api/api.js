import axios from './request';

let base = 'http://localhost:8080';//http://localhost:8080
export const baseUrl = base;

export const getPort = params => { return axios.get(`${base}/BeerManage/message/getIp`, { params: params }); };

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

//
export const getBannerList = params => { return axios.get(`${base}/BeerApp/home/all`, { params: params }); };//获取轮播图

// x-www-form-urlencoded
export const updateBannerList = params => { return axios.post(`${base}/BeerApp/home/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//更新轮播图

export const getCargoList = params => { return axios.get(`${base}/BeerApp/cargo/getAll`, { params: params }); };//获取所有商品

export const updateCargoList = params => { return axios.post(`${base}/BeerApp/cargo/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//修改商品

export const addCargoList = params => { return axios.post(`${base}/BeerApp/cargo/add.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//添加商品

export const getStandardList = params => { return axios.post(`${base}/BeerApp/spec/get.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取规格

export const delStandardList = params => { return axios.get(`${base}/BeerApp/spec/delete/${params}`) };//删除规格

export const editStandardList = params => { return axios.post(`${base}/BeerApp/spec/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//编辑规格

export const addStandardList = params => { return axios.post(`${base}/BeerApp/spec/add.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//添加规格

export const getOrderList = params => { return axios.post(`${base}/BeerApp/trade/get.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取所有订单

export const updateOrderList = params => { return axios.post(`${base}/BeerApp/trade/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//更新订单

export const refund = params => { return axios.post(`${base}/BeerApp/wx/refund.do?out_trade_no=${params["tradeId"]}&total_fee=${params["total_fee"]}`, { params: params }); };//确认退款

export const updateOrderManage = params => { return axios.get(`${base}/BeerManage/order/update.do`, { params: params }); };//更新订单

export const cancelOrder = params => { return axios.post(`${base}/BeerApp/trade/cancel.do?id=${params["tradeId"]}`, { params: params }, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//取消订单

export const getCargoByTypeList = params => { return axios.post(`${base}/BeerApp/cargoType/getList`, { params: params }, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取商品分类列表

export const addCargoByTypeList = params => { return axios.post(`${base}/BeerApp/cargoType/add.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//新增商品分类列表

export const updateCargoTypeList = params => { return axios.post(`${base}/BeerApp/cargoType/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//更新商品分类列表

// export const getEvaluateList = params => { return axios.post(`${base}/BeerApp/evaluate/get.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取评价

// export const delEvaluateList = params => { return axios.post(`${base}/BeerApp/evaluate/del.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//获取评价

export const getShopTime = params => { return axios.get(`${base}/BeerApp/shopTime/get.do`, { params: params }); };//获取营业时间

export const updateShopTime = params => { return axios.post(`${base}/BeerApp/shopTime/update.do`, params, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }) };//更新营业时间