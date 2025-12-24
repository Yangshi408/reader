import axios from 'axios'
import { BASE_URL } from './config'
import router from '../router'
import { ElMessage } from 'element-plus'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 根据环境设置基础URL
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = BASE_URL
} else {
  axios.defaults.baseURL = BASE_URL
}

// 请求拦截器 - 添加token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute
            }
          })
          break
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error('网络错误')
      }
    }
    return Promise.reject(error)
  }
)

export function get (url, params = {}, responseType = 'json') {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      responseType
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    // 将对象数据转换为URLSearchParams
    const params = new URLSearchParams()
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          params.append(key, item)
        })
      } else {
        params.append(key, data[key])
      }
    }

    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

export function deletes (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams()
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          params.append(key, item)
        })
      } else {
        params.append(key, data[key])
      }
    }

    axios.put(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
