import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('开始添加示例数据...');

  const profile = await prisma.profile.create({
    data: {
      name: '张三',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '+86 138-0000-0000',
      location: '北京市朝阳区',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      summary: '5年以上前端开发经验，精通React、Vue、Next.js等现代前端框架。擅长构建高性能、可扩展的Web应用。热爱开源，积极参与技术社区。',
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      website: 'https://yourwebsite.com',
      blog: 'https://yourblog.com',
      skills: [
        { name: 'React', level: 5, category: '前端' },
        { name: 'Next.js', level: 5, category: '前端' },
        { name: 'TypeScript', level: 5, category: '前端' },
        { name: 'Vue.js', level: 4, category: '前端' },
        { name: 'Node.js', level: 4, category: '后端' },
        { name: 'PostgreSQL', level: 4, category: '数据库' },
        { name: 'MongoDB', level: 3, category: '数据库' },
        { name: 'Git', level: 5, category: '工具' },
        { name: 'Docker', level: 4, category: '工具' },
        { name: 'AWS', level: 3, category: '工具' },
      ],
      experiences: [
        {
          id: '1',
          company: '某科技有限公司',
          position: '高级前端工程师',
          startDate: '2021-06',
          endDate: null,
          current: true,
          description: '负责公司核心产品的前端架构设计与开发，带领团队完成多个重要项目。',
          achievements: [
            '主导重构核心业务系统，性能提升40%',
            '建立前端代码规范和最佳实践，提升团队协作效率',
            '引入自动化测试，代码覆盖率达到80%以上',
          ],
          technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
        },
        {
          id: '2',
          company: '互联网公司',
          position: '前端工程师',
          startDate: '2019-03',
          endDate: '2021-05',
          current: false,
          description: '参与多个Web应用的开发，主要负责前端功能实现与性能优化。',
          achievements: [
            '开发并维护公司主要产品的前端应用',
            '优化页面加载速度，首屏渲染时间减少50%',
            '参与技术分享，提升团队整体技术水平',
          ],
          technologies: ['Vue.js', 'JavaScript', 'Webpack', 'Element UI'],
        },
      ],
      education: [
        {
          id: '1',
          school: '某大学',
          degree: '本科',
          major: '计算机科学与技术',
          startDate: '2015-09',
          endDate: '2019-06',
          gpa: '3.7/4.0',
          description: '主修课程：数据结构、算法、操作系统、计算机网络、数据库原理',
        },
      ],
      projects: [
        {
          id: '1',
          name: '企业级管理系统',
          description: '为大型企业开发的综合管理系统，包含人力资源、财务、项目管理等多个模块。',
          role: '前端技术负责人',
          startDate: '2022-01',
          endDate: '2023-06',
          technologies: ['React', 'TypeScript', 'Ant Design', 'Redux', 'React Query'],
          url: 'https://example.com/project1',
          github: 'https://github.com/yourusername/project1',
          highlights: [
            '设计并实现了灵活的权限管理系统',
            '开发了可复用的组件库，提高开发效率30%',
            '实现了实时数据同步功能，用户体验显著提升',
          ],
        },
        {
          id: '2',
          name: '电商平台',
          description: 'B2C电商平台，包含商品展示、购物车、订单管理、支付等完整功能。',
          role: '核心开发者',
          startDate: '2020-06',
          endDate: '2021-12',
          technologies: ['Vue.js', 'Vuex', 'Element UI', 'Nuxt.js'],
          highlights: [
            '实现了商品推荐算法的前端展示',
            '优化了购物流程，转化率提升25%',
            '支持多种支付方式集成',
          ],
        },
      ],
      certifications: [
        {
          id: '1',
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          date: '2022-08',
          url: 'https://aws.amazon.com/certification/',
        },
      ],
      languages: [
        { name: '中文', level: '母语' },
        { name: '英语', level: '流利' },
      ],
    },
  });

  console.log('示例数据添加成功！', profile);
}

main()
  .catch((e) => {
    console.error('错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
