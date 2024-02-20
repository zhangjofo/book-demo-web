import axios from 'axios'
import qs from 'qs'
import {rootUrl, baseUrl} from './env'

export default async (url = '', data = {}, type = '') => {
  axios.defaults.withCredentials = true // 允许携带session，否则会出现session不同的问题
  axios.defaults.timeout = 10000 // 设置超时为10秒
  // Add a request interceptor
  axios.interceptors.request.use(function (config) {
    // 判断是否存在token，如果存在将每个页面header都添加token
    if (localStorage.getItem('token')) {
      config.headers.common['token'] = localStorage.getItem('token')
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
  })

  type = type.toUpperCase()
  url = baseUrl + url

  if (type === 'GET') {
    return axios.get(url, {params: data}).then(res => {
      return res.data
    }).catch(error => {
      console.log('####error:' + JSON.stringify(error))
      if (error.config.timeout) {
        return error
      }
      if (error.response.data.status === 500) {
        window.sessionStorage.removeItem('menuItems')
        window.location.href = '/#/login'
      }
      if (error.response.data.status === 400) {
        return error.response.data
      }
    })
  }

  if (type === '') {
    return axios.post(url, qs.stringify(data)).then(res => {
      return res.data
    }).catch(error => {
      console.log('###error:' + error)
      if (error.config.timeout) {
        console.log('timeout：' + JSON.stringify(error))
        return error
      }
      if (error.response.data.status === 400) {
        return error.response.data
      }
    })
  }
  if (type === 'POST') {
    return axios.post(url, data).then(res => {
      return res.data
    }).catch(error => {
      console.log('###error:' + JSON.stringify(error))
      if(error){
        console.log('@@@###data:' + JSON.stringify(data))
      }
      if (error.config.timeout) {
        return error
      }
      if (error.response.data.status === 400) {
        return error.response.data
      }
    })
  }
  if (type === 'PUT') {
    return axios.put(url, data).then(res => {
      if (res.data === 'TIMEOUT') {
        window.location.href = rootUrl + 'login'
      } else {
        return res.data
      }
    }).catch(err => {
      console.log('###error:' + JSON.stringify(err))
    })
  }
  if (type === 'DELETE') {
    return axios.delete(url, data).then(res => {
      if (res.data === 'TIMEOUT') {
        window.location.href = rootUrl + 'login'
      } else {
        return res.data
      }
    }).catch(err => {
      console.log('###error:' + JSON.stringify(err))
    })
  }
}
