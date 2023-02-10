import { request } from "./request";

export function getCategory() {
    return request({
        url: '/api/goods',
       
    });
}

// 分类页面获取商品
export function getCategoryGoods(order='price',cid=0, page=1) {
    return request({
        url: '/api/goods?category_id' + cid + '&page=' + page + '&' + order + '=1',
    });
}