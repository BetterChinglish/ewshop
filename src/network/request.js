// 通用请求

import axios from "axios";



export function request(config) {

    const instance = axios.create({
        baseURL: "https://api.shop.eduwork.cn",
        timeout: 5000
    })

    // 请求拦截
    instance.interceptors.request.use(config => {   //在发送请求前应该做什么
        // 如果有一个接口需要认证才可以访问,就在这统一设置

        // 直接放行
        return config;

    }, err => { // 对请求错误做些什么

    })


    // 响应拦截
    instance.interceptors.response.use(res => {     // 对响应数据做些什么

        console.log(res);
        return res.data ? res.data : res;
    }, err => {     // 对响应错误做些什么

        // 如果有需要授权才可以访问的接口, 统一去login授权



        // 如果有错误, 在这里处理, 显示错误信息





    })


    return instance(config)


}