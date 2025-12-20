import { get, post, put, deletes } from './request'

const HttpManager = {
  // =======================> 认证 API
  // 登录
  loginIn: (params) => post('auth/login', params),
  // 注册
  SignUp: (params) => post('auth/register', params),
  // 忘记密码
  forgotPassword: (params) => post('auth/forgot-password', params),
  // 更新邮箱
  updateEmail: (params) => post('auth/new_email', params),
  // 更新密码
  updatePassword: (params) => post('auth/new-password', params),
  // 登出
  logout: () => post('users/logout'),

  // =======================> 用户 API
  // 获取用户资料
  getUserProfile: () => get('users/profile'),
  // 更新用户资料
  updateUserProfile: (params) => put('users/profile', params),
  // 获取审核状态
  getUserStatus: () => get('users/status'),
  // 获取个人收藏
  getUserCollection: () => get('users/collection'),
  // 取消收藏
  removeCollection: (resourceType, resourceId) =>
    deletes(`users/collection/${resourceType}/${resourceId}/`),
  // 获取个人提交
  getUserSubmissions: () => get('users/summit'),
  // 管理个人发帖状态
  updateResourceStatus: (resourceType, resourceId, params) =>
    put(`users/status/${resourceType}/${resourceId}/statu`, params),

  // =======================> 工具 API
  getTools: (params) => get('tools/profile', params),
  searchTools: (params) => get('tools/search', params),
  getToolDetail: (resourceId, resourceType) => get(`tools/${resourceId}`, { resourceType }),
  submitTool: (params) => post('tools/submit', params),
  addToolView: (resourceId) => post(`tools/${resourceId}/views`),
  toggleToolCollection: (resourceId, resourceType) => post(`tools/${resourceId}/collections`, { resourceType }),
  removeToolCollection: (resourceId, resourceType) => deletes(`tools/${resourceId}/collections`, { resourceType }),
  // addToolComment: (resourceId, resourceType, params) => post(`tools/${resourceId}/comments`, { resourceType, ...params }),
  // deleteToolComment: (resourceId) => deletes(`tools/${resourceId}/comments`),
  addToolCommentReply: (resourceId, commentId, resourceType, params) =>
    post(`tools/${resourceId}/comments/${commentId}/reply`, { resourceType, ...params }),
  deleteToolCommentReply: (resourceId, commentId) =>
    deletes(`tools/${resourceId}/comments/${commentId}/reply`),
  toggleToolLike: (resourceId) => post(`tools/${resourceId}/like`),
  removeToolLike: (resourceId) => deletes(`tools/${resourceId}/like`),
  // 新增
  getToolComments: (toolId) => get(`tools/${toolId}/comments`), // 获取工具所有评论
  addToolComment: (toolId, params) => post(`tools/${toolId}/comments`, params), // 发表评论，需要修改，应该还要传用户Id
  deleteToolComment: (toolId, commentId) => deletes(`tools/${toolId}/comments/${commentId}`), // 删除评论
  toggleCommentLike: (toolId, commentId) => post(`tools/${toolId}/comments/${commentId}/like`), // 点赞/取消点赞评论

  // =======================> 课程 API
  getCourses: (params) => get('courses/profile', params),
  searchCourses: (params) => get('courses/search', params),
  getCourseDetail: (courseId, resourceType) => get(`courses/${courseId}`, { resourceType }),
  uploadCourseResource: (courseId, resourceType, params) =>
    post(`courses/${courseId}/upload`, { resourceType, ...params }),
  downloadTextbook: (courseId, textbookId) =>
    get(`courses/${courseId}/textbooks/${textbookId}/download`),
  addCourseComment: (courseId, params) => post(`courses/${courseId}/comments`, params),
  deleteCourseComment: (courseId) => deletes(`courses/${courseId}/comments`),
  addCourseCommentReply: (courseId, commentId, params) =>
    post(`courses/${courseId}/comments/${commentId}/reply`, params),
  deleteCourseCommentReply: (courseId, commentId) =>
    deletes(`courses/${courseId}/comments/${commentId}/reply`),
  addCourseView: (courseId) => post(`courses/${courseId}/view`),
  toggleCourseCollection: (courseId) => post(`courses/${courseId}/collected`),
  removeCourseCollection: (courseId) => deletes(`courses/${courseId}/collected`),
  toggleCourseLike: (courseId) => post(`courses/${courseId}/like`),
  removeCourseLike: (courseId) => deletes(`courses/${courseId}/like`),

  // =======================> 项目 API
  getProjects: (params) => get('projects/profile', params),
  searchProjects: (params) => get('projects/search', params),
  getProjectDetail: (projectId) => get(`projects/${projectId}`),
  submitProject: (params) => post('projects/upload', params),
  updateProject: (projectId, params) => put(`projects/${projectId}`, params),
  toggleProjectLike: (projectId) => post(`projects/${projectId}/like`),
  removeProjectLike: (projectId) => deletes(`projects/${projectId}/like`),
  addProjectComment: (projectId, params) => post(`projects/${projectId}/comments`, params),
  deleteProjectComment: (projectId) => deletes(`projects/${projectId}/comments`),
  addProjectCommentReply: (projectId, commentId, params) =>
    post(`projects/${projectId}/comments/${commentId}/reply`, params),
  deleteProjectCommentReply: (projectId, commentId) =>
    deletes(`projects/${projectId}/comments/${commentId}/reply`),
  addProjectView: (projectId) => post(`projects/${projectId}/view`),
  toggleProjectCollection: (projectId) => post(`projects/${projectId}/collected`),
  removeProjectCollection: (projectId) => deletes(`projects/${projectId}/collected`),

  // =======================> 管理员 API
  getPendingReviews: (params) => get('admin/pending', params),
  reviewItem: (itemId, params) => get(`admin/review/${itemId}`, params)
}

export { HttpManager }
