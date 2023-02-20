import { request } from './request';

// 添加购物车
export function addCart(data) {
    return request({
        url: '/api/carts',
        method: 'post',
        data,
    })
}


// 修改购物车数量
export function modifyCart(id, data) {
    return request({
        url: `/api/carts/${id}`,
        method: 'put',

        // num: '', 填修改为的数量
        data,
    })
}
// 商品是否选择
export function checkedCart(data) {
    return request({
        url: '/api/carts/checked',
        method: 'patch',
        data,   // cart_ids: Array
    })
}
// 获取购物车列表
export function getCartData(data='') {
    return request({
        url: '/api/carts?' + data,
        method: 'get',
    })
}

// 删除购物车
export function deleteCartItem(id) {
    return request({
        url: `/api/carts/${id}`,
        method: 'delete',
    })
}