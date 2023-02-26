import { request } from "./request";
// 省市县数据
export function addressData(pid) {
    return request({
        url: `/api/city?pid=${pid}`,
        method: 'get',
    })
}
// 添加地址
export function addAddress(params) {
    return request({
        url: '/api/address',
        method: 'post',
        params
        // name	        是	string	收货人姓名
        // address	    是	string	详细地址
        // phone	    是	string	收货手机
        // province	    是	string	省份
        // city	        是	string	城市
        // county	    是	string	区县
        // is_default	否	int	是否默认， 值为1是默认， 不传就不设置默认
    })
}

// 编辑地址(修改地址)
export function editAddress(id, params) {
    return request({
        url: `/api/address/${id}`,
        method: 'put',
        params
        // name	        是	string	收货人姓名
        // address	    是	string	详细地址
        // phone	    是	string	收货手机
        // province	    是	string	省份
        // city	        是	string	城市
        // county	    是	string	区县
        // is_default	否	int	是否默认， 值为1是默认， 不传就不设置默认

        // 状态码 204 请求成功
        // 状态码 422 参数异常
    })
}

// 删除地址
export function deleteAddress(id) {
    return request({
        url: `/api/address/${id}`,
        method: 'DELETE',
    })
    // 状态码 204 请求成功
}

// 地址列表
export function getAddressList() {
    return request({
        url: '/api/address',
        method: 'get',
    })
}

// 地址详情
export function getAddressDetail(id) {
    return request({
        url: `/api/address/${id}`,
        method: 'get',
    })
    // {状态码 200 请求成功
    //     "data": [
    //         {
    //             "id": 1,
    //             "name": "小明",
    //             "province": "四川省",
    //             "city": "阿坝藏族羌族自治州",
    //             "county": "茂县",
    //             "address": "某某小区",
    //             "phone": "13222222222",
    //             "is_default": 0,
    //             "created_at": "2020-12-23T06:58:50.000000Z",
    //             "updated_at": "2020-12-23T06:58:50.000000Z"
    // }
        

}
