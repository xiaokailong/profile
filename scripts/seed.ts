import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 删除现有数据
  await prisma.profile.deleteMany();

  // 插入初始 mock 数据
  const profile = await prisma.profile.create({
    data: {
      name: '张三',
      nameEn: 'Zhang San',
      title: '全栈开发工程师',
      email: 'zhangsan@example.com',
      phone: '+86 138-0000-0000',
      location: '北京市',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      summary: '5年全栈开发经验，精通React、Node.js等现代Web技术栈，热衷于技术分享和开源贡献。',
      github: 'https://github.com/zhangsan',
      linkedin: 'https://linkedin.com/in/zhangsan',
      website: 'https://zhangsan.dev',
      blog: 'https://blog.zhangsan.dev',
      skills: JSON.stringify([
        { name: 'React', level: 90, category: '前端框架' },
        { name: 'Next.js', level: 85, category: '前端框架' },
        { name: 'TypeScript', level: 88, category: '编程语言' },
        { name: 'Node.js', level: 82, category: '后端' },
        { name: 'Python', level: 75, category: '编程语言' },
        { name: 'Docker', level: 70, category: 'DevOps' },
      ]),
      experiences: JSON.stringify([
        {
          company: '某互联网公司',
          position: '高级前端工程师',
          startDate: '2021-03',
          endDate: null,
          current: true,
          description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。',
          achievements: [
            '重构了核心业务系统，性能提升40%',
            '建立了完善的组件库和设计系统',
            '指导初级工程师，提升团队整体技术水平',
          ],
        },
        {
          company: '某科技公司',
          position: '前端工程师',
          startDate: '2019-07',
          endDate: '2021-02',
          current: false,
          description: '参与多个B端产品的开发，积累了丰富的前端工程化经验。',
          achievements: [
            '开发了数据可视化平台',
            '优化了首屏加载时间，从3s降到1s',
          ],
        },
      ]),
      education: JSON.stringify([
        {
          school: '某985大学',
          degree: '本科',
          major: '计算机科学与技术',
          startDate: '2015-09',
          endDate: '2019-06',
          description: 'GPA: 3.8/4.0，获得多次奖学金',
        },
      ]),
      projects: JSON.stringify([
        {
          name: '企业管理系统',
          role: '技术负责人',
          startDate: '2022-01',
          endDate: '2022-12',
          description: '为中小企业提供的一站式管理解决方案',
          technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
          achievements: [
            '支持10万+用户同时在线',
            '获得客户好评，续约率达90%',
          ],
          url: 'https://example.com/project1',
        },
        {
          name: '开源组件库',
          role: '核心贡献者',
          startDate: '2020-06',
          endDate: null,
          description: '基于React的企业级UI组件库',
          technologies: ['React', 'TypeScript', 'Storybook'],
          achievements: [
            'GitHub Star 5k+',
            'NPM周下载量10k+',
          ],
          url: 'https://github.com/example/ui-library',
        },
      ]),
      certifications: JSON.stringify([
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', date: '2022-05' },
        { name: 'PMP项目管理专业人士', issuer: 'PMI', date: '2021-08' },
      ]),
      languages: JSON.stringify([
        { name: '中文', level: '母语' },
        { name: '英语', level: 'CET-6' },
      ]),
    },
  });

  console.log('✅ 初始数据插入成功！');
  console.log('📋 简历 ID:', profile.id);
  console.log('👤 姓名:', profile.name, `(${profile.nameEn})`);
  console.log('\n访问地址:');
  console.log('- 查看简历: http://localhost:3000/profile/' + profile.id);
  console.log('- 编辑简历: http://localhost:3000/edit/' + profile.id);
  console.log('- 首页默认显示: http://localhost:3000/');
}

main()
  .catch((e) => {
    console.error('❌ 数据插入失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
