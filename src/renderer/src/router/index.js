import { createRouter, createWebHashHistory } from 'vue-router'

// 使用Vite的import.meta.glob动态导入components目录下的所有.vue文件
const componentFiles = import.meta.glob('../components/*.vue')

// 特殊处理根路径，加载index.vue组件
const rootRoute = {
  path: '/',
  name: 'Index',
  component: () => import('../components/index.vue')
}

// 使用Vite的import.meta.glob动态导入user_runtime目录下的所有.vue文件
const userComponentFiles = import.meta.glob('../user_runtime/*.vue')

// 创建/user/*下的路由
const userRoutes = Object.keys(userComponentFiles).map((path) => {
  // 从文件路径中提取组件名
  const componentName = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
  // 使用组件名生成路由路径
  const routePath = `/user/${componentName.toLowerCase()}`

  // 创建路由对象
  return {
    path: routePath,
    name: componentName,
    component: userComponentFiles[path] // 动态导入组件
  }
})

// 合并/user/*下的路由和components目录下的路由
const routes = [
  ...userRoutes,
  ...Object.keys(componentFiles)
    .map((path) => {
      // 从文件路径中提取组件名
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
      // 排除index.vue，因为它已经被特殊处理了
      if (componentName.toLowerCase() === 'index') return null

      // 使用组件名生成路由路径
      const routePath = `/${componentName.toLowerCase()}`

      // 创建路由对象
      return {
        path: routePath,
        name: componentName,
        component: componentFiles[path] // 动态导入组件
      }
    })
    .filter((route) => route)
] // 过滤掉null值

// 将根路径路由添加到路由数组的最前面
routes.unshift(rootRoute)

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
