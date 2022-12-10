import axios from "axios";

export function request(config) {
    const instance = axios.create({
        baseURL: 'https://api.shop.eduwork.cn',
        timeout: 5000,


    })

    // 请求拦截
    instance.interceptors.request.use(config => { 
        // 接口认证才可以访问, 在此统一设置


        // 直接放行
        return config;

    }, err => { 

    })


    // 响应拦截
    instance.interceptors.response.use(res => { 

        // 直接放行
        return res.data ? res.data : res;

    }, err => { 
        // 响应有错误在此处理, 显示错误信息

        // 授权才可以访问的接口, 统一跳转登录以授权


    })

    return instance(config);


}