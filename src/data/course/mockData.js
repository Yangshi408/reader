// 模拟课程数据
export const mockCourses = [
  {
    id: 1,
    name: 'Vue.js 3.0 从入门到实战',
    description: '全面学习Vue.js 3.0新特性，掌握现代前端开发技能',
    fullDescription: '本课程从Vue.js 3.0基础语法讲起，涵盖Composition API、Vue Router、Vuex、TypeScript集成等实战内容，通过多个真实项目案例帮助学员快速掌握Vue.js开发技能。',
    cover: 'https://via.placeholder.com/400x225/4CAF50/FFFFFF?text=Vue.js',
    url: 'https://course.example.com/vue3',
    category: '前端开发',
    level: '中级',
    type: '视频课程',
    duration: '32小时',
    durationHours: 32,
    chapters: 16,
    rating: 4.8,
    students: 12345,
    views: 45678,
    stars: 567,
    isFree: false,
    price: 299,
    tags: ['vue', 'javascript', 'frontend', 'intermediate'],
    teacherId: 1,
    teacherName: '张三',
    teacherTitle: '前端架构师',
    teacherAvatar: 'https://via.placeholder.com/100/4CAF50/FFFFFF?text=张',
    teacherExperience: '10年开发经验',
    teacherBio: '资深前端工程师，精通Vue.js、React等前端框架，曾主导多个大型项目的前端架构设计。',
    syllabus: [
      { id: 1, title: 'Vue.js 3.0 基础入门', duration: '2小时', type: '视频' },
      { id: 2, title: 'Composition API 详解', duration: '3小时', type: '视频' },
      { id: 3, title: 'Vue Router 路由管理', duration: '2.5小时', type: '视频' },
      { id: 4, title: '状态管理 Vuex/Pinia', duration: '3小时', type: '视频' },
      { id: 5, title: 'TypeScript 集成实战', duration: '2小时', type: '实战' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    lastUpdated: '3个月前'
  },
  {
    id: 2,
    name: 'Python 数据分析实战',
    description: '使用Python进行数据处理、分析和可视化',
    fullDescription: '本课程将教授如何使用Python进行数据分析，涵盖NumPy、Pandas、Matplotlib等核心库的使用，通过真实数据集案例让学员掌握数据分析全流程。',
    cover: 'https://via.placeholder.com/400x225/2196F3/FFFFFF?text=Python',
    url: 'https://course.example.com/python-data',
    category: '数据科学',
    level: '初级',
    type: '图文教程',
    duration: '24小时',
    durationHours: 24,
    chapters: 12,
    rating: 4.7,
    students: 9876,
    views: 34567,
    stars: 432,
    isFree: true,
    price: 0,
    tags: ['python', 'data', 'beginner', 'free'],
    teacherId: 2,
    teacherName: '李四',
    teacherTitle: '数据科学家',
    teacherAvatar: 'https://via.placeholder.com/100/2196F3/FFFFFF?text=李',
    teacherExperience: '8年数据分析经验',
    teacherBio: '资深数据科学家，擅长Python数据分析和机器学习，曾为多家企业提供数据分析解决方案。',
    syllabus: [
      { id: 1, title: 'Python数据分析基础', duration: '2小时', type: '图文' },
      { id: 2, title: 'NumPy数组计算', duration: '3小时', type: '图文' },
      { id: 3, title: 'Pandas数据处理', duration: '4小时', type: '图文' },
      { id: 4, title: '数据可视化', duration: '3小时', type: '实战' }
    ],
    createdAt: '2024-02-20T14:30:00Z',
    lastUpdated: '2个月前'
  }
]

// 模拟评论数据
export const mockComments = [
  {
    id: 1,
    courseId: 1,
    userId: 101,
    username: '小明同学',
    nickname: '前端爱好者',
    avatar: 'https://via.placeholder.com/100/FF9800/FFFFFF?text=明',
    content: '课程内容很全面，老师讲解得很详细，收获很大！',
    rating: 5,
    likes: 24,
    isLiked: false,
    createdAt: '2024-03-15T09:30:00Z'
  },
  {
    id: 2,
    courseId: 1,
    userId: 102,
    username: '代码大师',
    nickname: null,
    avatar: 'https://via.placeholder.com/100/9C27B0/FFFFFF?text=码',
    content: '实战项目很有价值，学到了很多实际开发技巧。',
    rating: 4,
    likes: 18,
    isLiked: true,
    createdAt: '2024-03-10T14:20:00Z'
  }
]

export const getCoursesByCategory = (category) => {
  return mockCourses.filter(course => course.category === category)
}

export const getCourseById = (id) => {
  return mockCourses.find(course => course.id === parseInt(id))
}

export const getCommentsByCourseId = (courseId) => {
  return mockComments.filter(comment => comment.courseId === parseInt(courseId))
}

export const addMockComment = (courseId, content) => {
  const newComment = {
    id: Date.now(),
    courseId: parseInt(courseId),
    userId: 999,
    username: '当前用户',
    avatar: 'https://via.placeholder.com/100/4CAF50/FFFFFF?text=我',
    content,
    rating: 5,
    likes: 0,
    isLiked: false,
    createdAt: new Date().toISOString()
  }
  mockComments.unshift(newComment)
  return newComment
}
