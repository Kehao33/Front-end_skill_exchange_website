import React from 'react'
import {
  Select
} from 'antd'
const {
  Option
} = Select

const OPTIONS = [
  '前端动态',
  '数据结构与算法',
  '资源分享',
  'Node.js',
  'React.js',
  'Vue.js',
  'Angular.js',
  'javascript',
  'jQuery',
  'webpack',
  'npm',
  'sass',
  'less',
  'Express',
  'egg.js',
  'yarn',
  'typescript',
  'css',
  'css3',
  'html',
  'html5',
  'ES6',
]

const artClass_OPTIONS = [{
    value: '前端动态',
    label: '前端动态',
    children: [{
        value: 'html',
        label: 'html',
      },
      {
        value: 'Node.js',
        label: 'Node.js',
      },
      {
        value: 'React.js',
        label: 'React.js',
      },
      {
        value: 'Vue.js',
        label: 'Vue.js',
      },
      {
        value: 'Angular.js',
        label: 'Angular.js',
      },
      {
        value: 'javascript',
        label: 'javascript',
      },
      {
        value: 'jQuery',
        label: 'jQuery',
      },
      {
        value: '性能优化',
        label: '性能优化',
      },
      {
        value: '移动开发',
        label: '移动开发',
      },

      {
        value: 'webpack',
        label: 'webpack',
      },
      {
        value: 'sass',
        label: 'sass',
      },
      {
        value: 'less',
        label: 'less',
      },
      {
        value: 'Express',
        label: 'Express',
      },
      {
        value: 'egg.js',
        label: 'egg.js',
      },
      {
        value: 'typescript',
        label: 'typescript',
      },
      {
        value: 'css',
        label: 'css',
      },
      {
        value: 'css3',
        label: 'css3',
      },
      {
        value: 'yarn',
        label: 'yarn',
      },
      {
        value: 'es5+',
        label: 'es5+',
      },
      {
        value: '其他',
        label: '其他',
      },
    ],
  },
  {
    value: '资源共享',
    label: '资源共享',
    children: [{
        value: '视频教程',
        label: '视频教程',
      },
      {
        value: '电子书籍',
        label: '电子书籍',
      },
      {
        value: '好用软件',
        label: '好用软件',
      },
      {
        value: '其他资源',
        label: '其他资源',
      },
    ],
  },
  {
    value: '数据结构&算法',
    label: '数据结构&算法',
    children: [{
        value: '数据结构',
        label: '数据结构',
      },
      {
        value: '算法',
        label: '算法',
      },
      {
        value: '其他',
        label: '其他',
      },
    ],
  },
]

const optionsChilren = []
for (let i = 0; i < OPTIONS.length; i++) {
  optionsChilren.push( <
    Option key = {
      i
    }
    value = {
      OPTIONS[i]
    } > {
      OPTIONS[i]
    } <
    /Option>
  )
}



// footer的配置

const footerOptions = {
  // 推荐学习
  recommend_Opt: [{
      href: 'https://cn.vuejs.org/',
      name: 'Vue.js'
    },
    {
      href: 'https://reactjs.org',
      name: 'React.js'
    },
    {
      href: 'https://juejin.im/',
      name: '掘金社区'
    },
    {
      href: 'https://www.runoob.com/',
      name: '菜鸟教程'
    }
  ],
  // 常用工具
  commonTool_Opt: [{
      href: 'https://github.com/',
      name: 'GitHub'
    },
    {
      href: 'https://ant.design/index-cn',
      name: 'Ant Design'
    },
    {
      href: 'https://www.npmjs.com/',
      name: 'npmJS'
    },
    {
      href: 'https://stackoverflow.com/',
      name: 'StackOverflow'
    },
  ],
  // 直击招聘
  jobOffer_Opt: [{
      href: 'https://www.nowcoder.com/',
      name: '牛客网'
    },
    {
      href: 'https://www.lagou.com/',
      name: '拉钩网'
    },
    {
      href: 'https://landing.zhaopin.com/',
      name: '智能招聘'
    },
  ],
  // 基于NodeJS后台
  back_Opt: [{
      href: 'https://www.expressjs.com.cn/',
      name: 'Express'
    },
    {
      href: 'https://www.koajs.com.cn/',
      name: 'Koa'
    },
    {
      href: 'https://eggjs.org/zh-cn/',
      name: 'EggJS'
    },
  ]
}


export {
  OPTIONS,
  artClass_OPTIONS,
  optionsChilren,
  footerOptions
}