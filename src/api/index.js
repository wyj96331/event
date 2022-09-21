// 这里封装的是具体的借口请求方法
// import store from '@/store' // 引入store对象
import request from '@/utils/request' // 引入自定义axios函数
/**
 * 注册接口
 * @param {*} param0 {username:用户名，password:密码}
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 {username:用户名，password:密码}
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}

/**
 * 获取-侧边栏菜单数据
 * @returns Promise对象
 */
export const getMenusAPI = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 * 更新-用户进本资料
 * @param {*} param0{ id:用户id, email：用户邮箱, nickname：用户昵称, username:用户名, user_pic:用户头像}
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, email, nickname, username, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      username,
      user_pic
    }

  })
}

/**
 * 更新->用户头像
 * @param {*} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 更新->修改密码
 * @param {*} param0{ old_pwd:旧密码, new_pwd:新密码, re_pwd:确认密码}
 * @returns Promise 对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加文章分类
 * @param {*} param0{ cate_name:文章分类名字, cate_alias:文章分类别名 }
 * @returns Promise 对象
 */
export const addArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新-文章分类
 * @param {*} param0 {id:文章id, cate_name:文章分类名字, cate_alias:文章分类别名 }
 * @returns Promise 对象
 */
export const updataArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除->文章分类
 * @param {*} id {id:文章id}
 * @returns Promise对象
 */
export const deleteArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}
/**
 * 发布文章
 * @param {*} fd 表单数据对象
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd // 参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象, 传递的请求体会设置Content-Type: form-data与后端对应
  })
}

/**
 * 获取-文章列表
 * @param {*} param0{ pagenum:当前页码数, pagesize:当前页面需要的数据条数, cate_id:文章分类id, state:文章状态}
 * @returns Promise对象
 */
export const getArtcleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取-文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArtcleDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章
 * @param {*} id文章id
 * @returns Promise对象
 */
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
