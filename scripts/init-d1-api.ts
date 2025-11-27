/**
 * 通过 Cloudflare API 初始化 D1 数据库
 * 需要设置环境变量：
 * - CLOUDFLARE_ACCOUNT_ID: Cloudflare 账户 ID
 * - CLOUDFLARE_API_TOKEN: Cloudflare API Token
 */

import fetch from 'node-fetch';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = '4bb29d0b-79f9-4cb9-8f99-ea0a82810bf8';

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('❌ 请设置环境变量 CLOUDFLARE_ACCOUNT_ID 和 CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

const createTableSQL = `
CREATE TABLE IF NOT EXISTS Profile (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nameEn TEXT,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  summary TEXT NOT NULL,
  avatar TEXT,
  skills TEXT NOT NULL,
  experiences TEXT NOT NULL,
  education TEXT NOT NULL,
  projects TEXT NOT NULL,
  certifications TEXT NOT NULL,
  languages TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const insertDataSQL = `
INSERT INTO Profile (id, name, nameEn, title, email, phone, location, summary, skills, experiences, education, projects, certifications, languages)
VALUES (
  'default-profile-001',
  '张三',
  'Zhang San',
  '全栈开发工程师',
  'zhangsan@example.com',
  '+86 138-0000-0000',
  '中国·北京',
  '拥有5年以上全栈开发经验，精通React、Node.js等技术栈',
  '["JavaScript","TypeScript","React","Next.js","Node.js","PostgreSQL"]',
  '[{"company":"ABC科技公司","position":"高级前端工程师","startDate":"2021-01-01T00:00:00.000Z","endDate":null,"description":"负责公司核心产品的前端架构设计和开发","achievements":["主导重构了产品前端架构，提升50%性能","带领5人团队完成多个重要项目"]}]',
  '[{"school":"某某大学","degree":"学士","major":"计算机科学与技术","startDate":"2015-09-01T00:00:00.000Z","endDate":"2019-06-30T00:00:00.000Z","gpa":"3.8"}]',
  '[{"name":"个人简历管理系统","description":"基于Next.js的在线简历管理平台","technologies":["Next.js","React","TypeScript","Ant Design"],"url":"https://github.com/example/profile","highlights":["支持多用户管理","PDF导出功能","响应式设计"]}]',
  '[{"name":"AWS认证解决方案架构师","issuer":"Amazon Web Services","date":"2022-06-01T00:00:00.000Z","credentialId":"AWS-12345"}]',
  '[{"language":"中文","proficiency":"母语"},{"language":"英语","proficiency":"流利"}]'
);
`;

async function initDatabase() {
  try {
    console.log('🚀 开始初始化 D1 数据库...');

    // 创建表
    console.log('📝 创建 Profile 表...');
    const createResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: createTableSQL,
        }),
      }
    );

    const createResult: any = await createResponse.json();
    if (!createResult.success) {
      throw new Error(`创建表失败: ${JSON.stringify(createResult.errors)}`);
    }
    console.log('✅ Profile 表创建成功');

    // 插入数据
    console.log('📝 插入默认数据...');
    const insertResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: insertDataSQL,
        }),
      }
    );

    const insertResult: any = await insertResponse.json();
    if (!insertResult.success) {
      throw new Error(`插入数据失败: ${JSON.stringify(insertResult.errors)}`);
    }
    console.log('✅ 默认数据插入成功');

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n可以访问以下链接查看简历：');
    console.log('https://velen-profile.pages.dev/profile/default-profile-001');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
