//http请求封装

import axios from "axios";
import { showNotify } from 'vant';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const request = axios.create({
     baseURL: 'http://8929vutr0406.vicp.fun/api',
    // timeout: 30 * 1000, //请求超时时间：30秒
    withCredentials: false // 表示跨域请求时是否需要使用凭证
});

// 请求拦截器
request.interceptors.request.use(
    config => { //配置信息处理
        return config;
    },
    error => { //错误处理
        console.log(error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use((res) => { // 请求成功的回调函数
    return res.data;
}, (err) => { // 请求失败的回调函数
   let url = err.config.baseURL + err.config.url + JSON.stringify(err.config.params);
    if (err.response.status) {
        switch (err.response.status) {
            case 401:
              showNotify({ type: 'primary', message: '资源没有访问权限!' });
                break;
            case 404:
                            showNotify({ type: 'primary', message: url + "接口不存在，请检查接口地址是否正确!"});

                break;
            case 500:
                            showNotify({ type: 'primary', message: url + "内部服务器错误，请联系管理员！!" });

                break;
            default:
                return Promise.reject(err.data);
        }
    } else if (JSON.stringify(err).indexOf("timeout") > -1) {
              showNotify({ type: 'danger', message: '接口超时，请检查代理是否正确或者后端服务是否正常启动!' });

    } else {
                    showNotify({ type: 'danger', message: '遇到跨域错误，请设置代理或者修改后端允许跨域访问!' });


    }
    return Promise.reject('fail');
});

export default request;


//post请求
export function ysnpostArry(url, data) {
    if (data) {
        return request({
            url,
            method: 'POST',
            data: data
        })
    } else {
        return request({
            url,
            method: 'POST'
        })
    }
}

//post请求
export function ysnpost(url, data) {

    if (data) {
        return request({
            url,
            method: 'POST',
            data
        })
    } else {
        return request({
            url,
            method: 'POST'
        })
    }
}
export function ysnpostByJson(url, data) {
   
    if (data) {
        return request({
            url,
            method: 'POST',
             header: { "Content-Type": 'application/json' },
            data
        })
    } else {
        return request({
            url,
            method: 'POST',
            header: { "Content-Type": 'application/json' },
        })
    }
} 

//post请求
export function ysnpostTable(url, data) {       
    if (data) {
        return request({
            url,
            method: 'POST',
            data
        })
    } else {
        return request({
            url,
            method: 'POST'
        })
    }
}

//post请求
export function ysnSave(url, data) {
    if (data) {
        return request({
            url,
            method: 'POST',
            data
        })
    } else {
        return request({
            url,
            method: 'POST'
        })
    }
}

//post请求
export function ysnUpfile(url, data) {
    if (data) {
        return request({
            url,
            method: 'POST',
            headers: { "Content-Type": "multipart/form-data" },
            data
        })
    } else {
        return request({
            url,
            method: 'POST',
            headers: { "Content-Type": "multipart/form-data" },
        })
    }
}


//post请求
export function ysnposts(url, params) {
    return request({
        url,
        method: 'POST',
        params
    })
}

//post请求
export function ysnDelete(url, params) {
    return request({
        url,
        method: 'POST',
        params
    })
}


//get请求
export function ysnget(url, params) {
    return request({
        url,
        method: 'GET',
        params
    })
}