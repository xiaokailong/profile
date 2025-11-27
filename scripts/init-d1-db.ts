/**
 * 使用 wrangler CLI 初始化 D1 数据库
 * 这是推荐的方式，不需要 API Token
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const DATABASE_ID = '4bb29d0b-79f9-4cb9-8f99-ea0a82810bf8';

// 创建表的 SQL
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

// 插入数据的 SQL
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

function runCommand(command: string, description: string) {
  console.log(`\n${description}...`);
  try {
    // 设置环境变量以忽略 SSL 证书验证（如果需要）
    const env = { ...process.env };
    if (process.platform === 'win32') {
      env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      env,
    });
    console.log(output);
    console.log(`✅ ${description}完成`);
    return true;
  } catch (error: any) {
    console.error(`❌ ${description}失败:`, error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
    return false;
  }
}

async function initDatabase() {
  console.log('🚀 开始使用 wrangler 初始化 D1 数据库...');
  console.log(`📊 数据库 ID: ${DATABASE_ID}\n`);

  // 创建表
  const createSuccess = runCommand(
    `npx wrangler d1 execute ${DATABASE_ID} --command "${createTableSQL.replace(/\n/g, ' ')}"`,
    '📝 创建 Profile 表'
  );

  if (!createSuccess) {
    console.error('\n❌ 创建表失败，终止初始化');
    process.exit(1);
  }

  // 插入数据
  const insertSuccess = runCommand(
    `npx wrangler d1 execute ${DATABASE_ID} --command "${insertDataSQL.replace(/\n/g, ' ')}"`,
    '📝 插入默认数据'
  );

  if (!insertSuccess) {
    console.error('\n❌ 插入数据失败');
    process.exit(1);
  }

  // 验证数据
  console.log('\n🔍 验证数据...');
  runCommand(
    `npx wrangler d1 execute ${DATABASE_ID} --command "SELECT id, name, nameEn, title FROM Profile LIMIT 5;"`,
    '查询已插入的数据'
  );

  console.log('\n🎉 数据库初始化完成！');
  console.log('\n可以访问以下链接查看简历：');
  console.log('https://velen-profile.pages.dev/profile/default-profile-001');
}

initDatabase();
