// store/courseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCoursesStore = defineStore('courses', () => {
  // 状态
  const coursesList = ref([])
  const categories = ref(['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'])
  const userInfo = ref(null)
  const isAuthenticated = ref(false)
  const activeFilters = ref({
    sort: '最新',
    tags: [],
    levels: [],
    types: [],
    categories: []
  })
  const searchResults = ref([])
  const tags = ref([])

  // 初始化模拟数据
  const initializeMockData = () => {
    // 初始化标签数据
    tags.value = [
      { id: 'general', name: '通用', color: 'bg-gray-100 text-gray-700' },
      { id: 'beginner', name: '入门', color: 'bg-green-100 text-green-700' },
      { id: 'intermediate', name: '中级', color: 'bg-blue-100 text-blue-700' },
      { id: 'advanced', name: '高级', color: 'bg-purple-100 text-purple-700' },
      { id: 'frontend', name: '前端', color: 'bg-yellow-100 text-yellow-700' },
      { id: 'backend', name: '后端', color: 'bg-red-100 text-red-700' },
      { id: 'algorithm', name: '算法', color: 'bg-pink-100 text-pink-700' },
      { id: 'database', name: '数据库', color: 'bg-indigo-100 text-indigo-700' },
      { id: 'framework', name: '框架', color: 'bg-teal-100 text-teal-700' },
      { id: 'mobile', name: '移动端', color: 'bg-cyan-100 text-cyan-700' }
    ]

    // 初始化课程数据
    coursesList.value = [
      // 大一上课程
      {
        id: 1,
        name: '计算机导论',
        description: '计算机科学基础入门课程，介绍计算机系统的基本概念和工作原理',
        semester: '大一上',
        cover: '/course-covers/computer-intro.jpg',
        level: '入门',
        type: '视频课程',
        duration: '32学时',
        rating: 4.8,
        views: 1250,
        students: 320,
        isFree: true,
        price: 0,
        teacherName: '张教授',
        teacherAvatar: '/avatars/teacher1.jpg',
        teacherTitle: '计算机学院教授',
        tags: ['general', 'beginner'],
        chapters: 12,
        durationHours: 32,
        lastUpdated: '2024-09',
        url: 'https://www.example.com/courses/1',
        fullDescription: '本课程系统介绍计算机科学的基本概念，包括计算机硬件、软件、网络和算法等基础知识。适合零基础学生入门学习。',
        createdAt: '2024-01-15T08:00:00Z'
      },
      {
        id: 2,
        name: 'C语言程序设计',
        description: '学习C语言基础语法和程序设计思想，培养编程能力',
        semester: '大一上',
        cover: '/course-covers/c-programming.jpg',
        level: '初级',
        type: '视频课程',
        duration: '48学时',
        rating: 4.9,
        views: 2150,
        students: 450,
        isFree: true,
        price: 0,
        teacherName: '李老师',
        teacherAvatar: '/avatars/teacher2.jpg',
        teacherTitle: '软件工程讲师',
        tags: ['beginner', 'algorithm'],
        chapters: 16,
        durationHours: 48,
        lastUpdated: '2024-08',
        url: 'https://www.example.com/courses/2',
        fullDescription: '从零开始学习C语言，掌握变量、控制结构、函数、数组、指针等核心概念，通过大量实践案例培养编程思维。',
        createdAt: '2024-01-10T08:00:00Z'
      },
      {
        id: 3,
        name: '大学数学',
        description: '高等数学基础知识，为后续专业课程打下数学基础',
        semester: '大一上',
        cover: '/course-covers/math.jpg',
        level: '入门',
        type: '图文教程',
        duration: '64学时',
        rating: 4.7,
        views: 1800,
        students: 380,
        isFree: true,
        price: 0,
        teacherName: '王教授',
        teacherAvatar: '/avatars/teacher3.jpg',
        teacherTitle: '数学系主任',
        tags: ['general', 'algorithm'],
        chapters: 20,
        durationHours: 64,
        lastUpdated: '2024-07',
        url: 'https://www.example.com/courses/3',
        fullDescription: '系统学习微积分、线性代数等数学基础知识，强调数学在计算机科学中的应用。',
        createdAt: '2024-01-05T08:00:00Z'
      },

      // 大一下课程
      {
        id: 4,
        name: '数据结构与算法',
        description: '学习常用数据结构和算法设计思想',
        semester: '大一下',
        cover: '/course-covers/data-structure.jpg',
        level: '中级',
        type: '视频课程',
        duration: '48学时',
        rating: 4.9,
        views: 3200,
        students: 520,
        isFree: false,
        price: 299,
        teacherName: '赵教授',
        teacherAvatar: '/avatars/teacher4.jpg',
        teacherTitle: '算法专家',
        tags: ['algorithm', 'intermediate'],
        chapters: 18,
        durationHours: 48,
        lastUpdated: '2024-06',
        url: 'https://www.example.com/courses/4',
        fullDescription: '深入讲解线性表、树、图等数据结构，以及排序、查找、动态规划等经典算法。',
        createdAt: '2024-02-15T08:00:00Z'
      },
      {
        id: 5,
        name: 'Java程序设计',
        description: '面向对象编程入门，掌握Java核心技术',
        semester: '大一下',
        cover: '/course-covers/java.jpg',
        level: '初级',
        type: '直播课',
        duration: '56学时',
        rating: 4.8,
        views: 1950,
        students: 420,
        isFree: false,
        price: 199,
        teacherName: '周老师',
        teacherAvatar: '/avatars/teacher5.jpg',
        teacherTitle: 'Java开发专家',
        tags: ['backend', 'beginner'],
        chapters: 20,
        durationHours: 56,
        lastUpdated: '2024-05',
        url: 'https://www.example.com/courses/5',
        fullDescription: '从基础语法到面向对象思想，再到集合框架和IO操作，全面掌握Java编程。',
        createdAt: '2024-02-10T08:00:00Z'
      },

      // 大二上课程
      {
        id: 6,
        name: 'Web前端开发',
        description: 'HTML5、CSS3、JavaScript及前端框架学习',
        semester: '大二上',
        cover: '/course-covers/web-frontend.jpg',
        level: '中级',
        type: '视频课程',
        duration: '60学时',
        rating: 4.9,
        views: 2800,
        students: 480,
        isFree: false,
        price: 399,
        teacherName: '陈老师',
        teacherAvatar: '/avatars/teacher6.jpg',
        teacherTitle: '前端架构师',
        tags: ['frontend', 'framework', 'intermediate'],
        chapters: 22,
        durationHours: 60,
        lastUpdated: '2024-04',
        url: 'https://www.example.com/courses/6',
        fullDescription: '从基础HTML/CSS到现代JavaScript，再到React/Vue等主流框架，一站式掌握前端开发。',
        createdAt: '2024-03-15T08:00:00Z'
      },
      {
        id: 7,
        name: '数据库系统',
        description: '关系型数据库设计与SQL语言',
        semester: '大二上',
        cover: '/course-covers/database.jpg',
        level: '中级',
        type: '图文教程',
        duration: '48学时',
        rating: 4.7,
        views: 1650,
        students: 350,
        isFree: true,
        price: 0,
        teacherName: '吴教授',
        teacherAvatar: '/avatars/teacher7.jpg',
        teacherTitle: '数据库专家',
        tags: ['database', 'backend'],
        chapters: 16,
        durationHours: 48,
        lastUpdated: '2024-03',
        url: 'https://www.example.com/courses/7',
        fullDescription: '系统学习数据库设计范式、SQL语言、索引优化、事务处理等核心知识。',
        createdAt: '2024-03-10T08:00:00Z'
      },

      // 大二下课程
      {
        id: 8,
        name: '操作系统',
        description: '深入理解操作系统原理与内核机制',
        semester: '大二下',
        cover: '/course-covers/os.jpg',
        level: '高级',
        type: '视频课程',
        duration: '64学时',
        rating: 4.8,
        views: 2100,
        students: 390,
        isFree: false,
        price: 499,
        teacherName: '郑教授',
        teacherAvatar: '/avatars/teacher8.jpg',
        teacherTitle: '系统架构师',
        tags: ['general', 'advanced'],
        chapters: 24,
        durationHours: 64,
        lastUpdated: '2024-02',
        url: 'https://www.example.com/courses/8',
        fullDescription: '从进程管理、内存管理到文件系统和设备管理，全面掌握操作系统核心原理。',
        createdAt: '2024-04-15T08:00:00Z'
      },
      {
        id: 9,
        name: 'Python数据分析',
        description: '使用Python进行数据处理和分析',
        semester: '大二下',
        cover: '/course-covers/python-data.jpg',
        level: '中级',
        type: '专栏',
        duration: '40学时',
        rating: 4.9,
        views: 2450,
        students: 460,
        isFree: false,
        price: 299,
        teacherName: '孙老师',
        teacherAvatar: '/avatars/teacher9.jpg',
        teacherTitle: '数据分析师',
        tags: ['algorithm', 'intermediate'],
        chapters: 15,
        durationHours: 40,
        lastUpdated: '2024-01',
        url: 'https://www.example.com/courses/9',
        fullDescription: '学习NumPy、Pandas、Matplotlib等Python数据分析库，掌握数据清洗、分析和可视化技能。',
        createdAt: '2024-04-10T08:00:00Z'
      },

      // 大三上课程
      {
        id: 10,
        name: '机器学习基础',
        description: '入门机器学习算法与实践应用',
        semester: '大三上',
        cover: '/course-covers/ml.jpg',
        level: '高级',
        type: '直播课',
        duration: '72学时',
        rating: 4.9,
        views: 3300,
        students: 550,
        isFree: false,
        price: 699,
        teacherName: '钱教授',
        teacherAvatar: '/avatars/teacher10.jpg',
        teacherTitle: 'AI研究员',
        tags: ['algorithm', 'advanced'],
        chapters: 26,
        durationHours: 72,
        lastUpdated: '2023-12',
        url: 'https://www.example.com/courses/10',
        fullDescription: '从监督学习到无监督学习，从传统算法到深度学习基础，全面入门机器学习。',
        createdAt: '2024-05-15T08:00:00Z'
      },
      {
        id: 11,
        name: '移动应用开发',
        description: 'Flutter跨平台移动应用开发',
        semester: '大三上',
        cover: '/course-covers/mobile.jpg',
        level: '中级',
        type: '视频课程',
        duration: '56学时',
        rating: 4.8,
        views: 1950,
        students: 410,
        isFree: false,
        price: 399,
        teacherName: '冯老师',
        teacherAvatar: '/avatars/teacher11.jpg',
        teacherTitle: '移动开发专家',
        tags: ['mobile', 'framework'],
        chapters: 20,
        durationHours: 56,
        lastUpdated: '2023-11',
        url: 'https://www.example.com/courses/11',
        fullDescription: '使用Flutter开发iOS和Android应用，掌握Dart语言和现代移动开发技术。',
        createdAt: '2024-05-10T08:00:00Z'
      },

      // 大三下课程
      {
        id: 12,
        name: '分布式系统',
        description: '大型分布式系统架构设计与实现',
        semester: '大三下',
        cover: '/course-covers/distributed.jpg',
        level: '高级',
        type: '专栏',
        duration: '80学时',
        rating: 4.9,
        views: 1800,
        students: 320,
        isFree: false,
        price: 899,
        teacherName: '杨教授',
        teacherAvatar: '/avatars/teacher12.jpg',
        teacherTitle: '系统架构总监',
        tags: ['backend', 'advanced'],
        chapters: 30,
        durationHours: 80,
        lastUpdated: '2023-10',
        url: 'https://www.example.com/courses/12',
        fullDescription: '深入讲解分布式一致性、CAP理论、微服务架构、消息队列等核心概念。',
        createdAt: '2024-06-15T08:00:00Z'
      }
    ]

    // 初始化用户收藏和评论数据
    initializeMockUserData()
  }

  // 初始化用户相关模拟数据
  const initializeMockUserData = () => {
    // 模拟用户收藏数据
    if (!userInfo.value) {
      userInfo.value = {
        id: 1001,
        username: 'student',
        nickname: '小明同学',
        avatar: '/avatars/default-student.jpg',
        role: 'student',
        email: 'student@example.com'
      }
      isAuthenticated.value = true
    }
  }

  // 修改 fetchCourses 方法
  const fetchCourses = async (forceRefresh = false) => {
    try {
      // 如果是强制刷新或数据为空，使用模拟数据
      if (forceRefresh || coursesList.value.length === 0) {
        initializeMockData()
      }

      // 如果有API调用，可以在这里添加
      // const response = await HttpManager.getCourses(params)
      // coursesList.value = response.data

      return coursesList.value
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      // 如果API失败，使用模拟数据作为回退
      if (coursesList.value.length === 0) {
        initializeMockData()
      }
      return coursesList.value
    }
  }

  // 修改 getCourseDetail 方法
  const getCourseDetail = async (id) => {
    try {
      // 如果有API调用，可以在这里添加
      // const response = await HttpManager.getCourseDetail(id)
      // return response.data

      // 从模拟数据中查找
      const course = coursesList.value.find(c => c.id === parseInt(id))
      if (course) {
        // 添加课程大纲模拟数据
        course.syllabus = generateMockSyllabus()

        // 添加讲师详细信息
        course.teacherBio = generateTeacherBio(course.teacherName)
        course.teacherExperience = `${Math.floor(Math.random() * 10) + 5}年教学经验`

        return course
      }
      throw new Error('Course not found')
    } catch (error) {
      console.error('Failed to fetch course detail:', error)
      throw error
    }
  }

  // 生成模拟课程大纲
  const generateMockSyllabus = () => {
    const chapters = []
    const chapterTitles = [
      '课程介绍与环境搭建',
      '基础概念讲解',
      '核心知识点学习',
      '实践案例分析',
      '项目实战演练',
      '常见问题解答',
      '进阶拓展内容',
      '课程总结与展望'
    ]

    for (let i = 0; i < 8; i++) {
      chapters.push({
        id: i + 1,
        title: chapterTitles[i],
        duration: `${Math.floor(Math.random() * 4) + 1}小时`,
        type: i % 3 === 0 ? '视频' : (i % 3 === 1 ? '图文' : '练习'),
        description: i % 2 === 0 ? '本章节重点讲解核心知识点和实际应用' : null
      })
    }

    return chapters
  }

  // 生成模拟讲师简介
  const generateTeacherBio = (name) => {
    const bios = [
      `${name}老师拥有丰富的教学经验和行业实践，曾在多家知名企业担任技术顾问，培养了数千名优秀学员。`,
      `${name}教授专注于计算机科学教育领域多年，出版多部教材，其课程以深入浅出、注重实践而广受好评。`,
      `${name}老师是业界知名的技术专家，拥有多项专利和技术成果，致力于将前沿技术带给广大学员。`,
      `${name}讲师教学风格生动有趣，善于将复杂概念转化为易于理解的知识点，深受学生喜爱。`
    ]

    return bios[Math.floor(Math.random() * bios.length)]
  }

  // 模拟搜索课程
  const searchCourses = async (query) => {
    try {
      // 如果有API调用，可以在这里添加
      // const response = await HttpManager.searchCourses({ keyword: query })
      // searchResults.value = response.data

      // 在模拟数据中搜索
      const results = coursesList.value.filter(course =>
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )

      searchResults.value = results
      return results
    } catch (error) {
      console.error('Search courses error:', error)
      searchResults.value = []
      return []
    }
  }

  // 模拟增加课程浏览量
  const addCourseView = (courseId) => {
    const course = coursesList.value.find(c => c.id === courseId)
    if (course) {
      course.views++
    }
  }

  // 其他方法保持不变
  const toggleSort = (sort) => {
    activeFilters.value.sort = sort
  }

  const toggleTag = (tagId) => {
    const index = activeFilters.value.tags.indexOf(tagId)
    if (index === -1) {
      activeFilters.value.tags.push(tagId)
    } else {
      activeFilters.value.tags.splice(index, 1)
    }
  }

  const toggleLevel = (level) => {
    const index = activeFilters.value.levels.indexOf(level)
    if (index === -1) {
      activeFilters.value.levels.push(level)
    } else {
      activeFilters.value.levels.splice(index, 1)
    }
  }

  const toggleType = (type) => {
    const index = activeFilters.value.types.indexOf(type)
    if (index === -1) {
      activeFilters.value.types.push(type)
    } else {
      activeFilters.value.types.splice(index, 1)
    }
  }

  const toggleCategory = (category) => {
    const index = activeFilters.value.categories.indexOf(category)
    if (index === -1) {
      activeFilters.value.categories.push(category)
    } else {
      activeFilters.value.categories.splice(index, 1)
    }
  }

  const clearTags = () => {
    activeFilters.value.tags = []
  }

  const logout = async () => {
    try {
      // 如果有API调用，可以在这里添加
      // await HttpManager.logout()
      userInfo.value = null
      isAuthenticated.value = false
      return true
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // 模拟分析课程URL（用于一键填写）
  const analyzeCourseUrl = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: '从URL分析出的课程名称',
          description: '通过AI分析，这是一门高质量的计算机科学课程，适合大学生学习。',
          cover: '/course-covers/analyzed.jpg',
          teacherName: 'AI分析讲师',
          teacherTitle: '课程主讲人'
        })
      }, 1500)
    })
  }

  // 模拟提交课程
  const submitCourse = async (courseData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 生成新的课程ID
        const newId = Math.max(...coursesList.value.map(c => c.id), 0) + 1;

        // 创建完整的课程对象
        const newCourse = {
          id: newId,
          name: courseData.name,
          description: courseData.description,
          semester: courseData.semester, // 注意：这里是semester，不是category
          cover: courseData.cover || '/course-covers/default.jpg',
          level: courseData.level,
          type: courseData.type,
          duration: courseData.duration || `${courseData.syllabus?.length || 8}学时`,
          rating: 4.5, // 默认评分
          views: 0,
          students: 0,
          isFree: courseData.isFree,
          price: courseData.price || 0,
          teacherName: courseData.teacherName,
          teacherAvatar: '/avatars/default-teacher.jpg',
          teacherTitle: courseData.teacherTitle,
          tags: courseData.tags || [],
          chapters: courseData.syllabus?.length || 0,
          durationHours: courseData.durationHours || courseData.syllabus?.length || 8,
          lastUpdated: new Date().toISOString().slice(0, 7).replace('-', ''), // 格式: 202412
          url: courseData.url,
          fullDescription: courseData.fullDescription,
          createdAt: new Date().toISOString(),
          syllabus: courseData.syllabus || generateMockSyllabus(), // 使用传入的大纲或生成默认
          teacherBio: generateTeacherBio(courseData.teacherName),
          teacherExperience: `${Math.floor(Math.random() * 5) + 1}年教学经验`
        };

        // 将新课程添加到课程列表
        coursesList.value.unshift(newCourse); // 添加到开头

        resolve({
          code: 200,
          message: '课程提交成功',
          data: newCourse
        });
      }, 1000);
    });
  }

  // 初始化时加载数据
  initializeMockData()

  return {
    // 状态
    coursesList,
    categories,
    userInfo,
    isAuthenticated,
    activeFilters,
    searchResults,
    tags,

    // 方法
    fetchCourses,
    getCourseDetail,
    searchCourses,
    addCourseView,
    toggleSort,
    toggleTag,
    toggleLevel,
    toggleType,
    toggleCategory,
    clearTags,
    logout,
    analyzeCourseUrl,
    submitCourse
  }
})
