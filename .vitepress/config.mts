import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: '前端知识库',
    description: '从入门到入土 - 前端学习笔记',
    lang: 'zh-CN',
    
    // 内容源目录
    srcDir: 'docs',
    
    // 静态资源目录（相对于 srcDir，即 docs/static）
    publicDir: 'static',
    
    // 输出目录（GitHub Pages 用）
    outDir: '.vitepress/dist',
    
    // 清理 URL（去掉 .html 后缀）
    cleanUrls: false,
    
    // 忽略死链接（迁移期间）
    ignoreDeadLinks: true,
    
    // 最后更新时间
    lastUpdated: true,
    
    // 主题配置
    themeConfig: {
      // 站点 logo
      // logo: '/static/img/logo.svg',
      
      // 顶部导航
      nav: [
        { text: '首页', link: '/' },
        { text: 'GitHub', link: 'https://github.com/suilang/fe-started-to-buried' },
        { text: '掘金', link: 'https://juejin.cn/user/536217407721965/posts' },
      ],
      
      // 三级折叠侧边栏
      sidebar: {
        '/': [
          {
            text: '介绍',
            link: '/'
          }
        ],
        
        '/Javascript/': [
          {
            text: 'Javascript',
            collapsed: false,
            items: [
              { text: '变量提升', link: '/Javascript/bian-liang-ti-sheng' },
              { text: 'JavaScript 类型', link: '/Javascript/js-type' },
              { text: '双等', link: '/Javascript/shuang-deng' },
              { text: '函数式编程', link: '/Javascript/han-shu-shi-bian-cheng' },
              { text: 'this', link: '/Javascript/this' },
              { text: '词法作用域及作用域链', link: '/Javascript/ci-fa-zuo-yong-yu-ji-zuo-yong-yu-lian' },
              { text: '闭包', link: '/Javascript/bi-bao' },
              { text: '事件机制', link: '/Javascript/shi-jian-ji-zhi' },
              { text: 'Promise', link: '/Javascript/Promise' },
              { text: '防抖与节流', link: '/Javascript/debounce-throttle' },
              { text: '继承与原型', link: '/Javascript/ji-cheng-yu-yuan-xing' },
              { text: 'Object与Map', link: '/Javascript/object-map' }
            ]
          }
        ],
        
        '/HTML/': [
          {
            text: 'HTML',
            collapsed: false,
            items: [
              { text: 'HTML 基础', link: '/HTML/' },
              { text: '语义化', link: '/HTML/yu-yi-hua' },
              { text: 'head 标签', link: '/HTML/head' },
              { text: '元素', link: '/HTML/element' },
              { text: 'CSS', link: '/HTML/css' }
            ]
          }
        ],
        
        '/CSS/': [
          {
            text: 'CSS',
            collapsed: false,
            items: [
              { text: 'CSS 基础', link: '/CSS/' },
              { text: '创建 CSS', link: '/CSS/create-css' },
              { text: 'position', link: '/CSS/position' },
              { text: 'CSS 布局', link: '/CSS/css-bu-ju' },
              { text: 'CSS 百分比', link: '/CSS/css-bai-fen-bi' },
              { text: 'Sass vs Less', link: '/CSS/SassVsLess' }
            ]
          }
        ],
        
        '/Browser/': [
          {
            text: '浏览器',
            collapsed: false,
            items: [
              { text: '网络连接', link: '/Browser/network-connect' },
              { text: 'Selection', link: '/Browser/Selection' },
              { text: 'Referer', link: '/Browser/referer' },
              { text: 'LocalStorage', link: '/Browser/localstorage' }
            ]
          }
        ],
        
        '/Engineering/': [
          {
            text: '工程化',
            collapsed: false,
            items: [
              { text: '介绍', link: '/Engineering/' },
              { text: '模块化', link: '/Engineering/Module' },
              { text: 'Yarn错误帮助', link: '/Yarn/' }
            ]
          }
        ],
        
        '/Git/': [
          {
            text: 'Git',
            collapsed: false,
            items: [
              { text: '起步', link: '/Git/01-起步' },
              { text: 'Git基础', link: '/Git/02-Git基础' },
              { text: 'Git分支', link: '/Git/03-Git分支' },
              { text: '服务器与分布式', link: '/Git/04-服务器与分布式' }
            ]
          }
        ],
        
        '/Security/': [
          {
            text: '安全',
            collapsed: false,
            items: [
              { text: '前端安全与认证', link: '/Security/' },
              { text: 'JWT和OAuth2认证', link: '/Security/jwt-and-oauth2-authentication' },
              { text: 'Web前端安全指南', link: '/Security/web-frontend-security-guide' }
            ]
          }
        ]
      },
      
      // 社交链接
      socialLinks: [
        { icon: 'github', link: 'https://github.com/suilang/fe-started-to-buried' }
      ],
      
      // 搜索
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索',
              buttonAriaLabel: '搜索'
            },
            modal: {
              noResultsText: '没有找到结果',
              resetButtonTitle: '清除查询条件',
              footer: {
                selectText: '选择',
                navigateText: '切换'
              }
            }
          }
        }
      },
      
      // 页脚
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2024 FE STARTED TO BURIED'
      },
      
      // 编辑链接
      editLink: {
        pattern: 'https://github.com/suilang/fe-started-to-buried/edit/main/:path',
        text: '在 GitHub 上编辑此页'
      },
      
      // 大纲（右侧目录）
      outline: {
        level: [2, 3],
        label: '页面导航'
      },
      
      // 文档页脚导航
      docFooter: {
        prev: '上一页',
        next: '下一页'
      }
    },
    
    // Markdown 配置
    markdown: {
      // 代码块行号
      lineNumbers: true,
    },
    
    // Mermaid 插件配置
    mermaid: {
      // 可自定义 Mermaid 主题，参考：https://mermaid.js.org/config/configuration.html
    },
    
    // Mermaid 插件 - 让 Mermaid 在构建时也能工作
    mermaidPlugin: {
      class: 'mermaid'
    }
  })
)