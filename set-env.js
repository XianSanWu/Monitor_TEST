// set-env.js
const fs = require('fs');
const path = require('path');

const env = process.argv[2]; // 取得傳入參數 dev/test/prod
const validEnvs = ['dev', 'test', 'prod'];

if (!validEnvs.includes(env)) {
  console.error(`❌ 請指定環境變數（${validEnvs.join(', ')}）`);
  process.exit(1);
}

// 處理 config.json
const configSourceFile = path.join(__dirname, 'public', 'assets', 'configs', `config.${env}.json`);
const configDestFile = path.join(__dirname, 'public', 'assets', 'configs', 'config.json');

if (!fs.existsSync(configSourceFile)) {
  console.error(`❌ 找不到來源 config 檔案：${configSourceFile}`);
  process.exit(1);
}

fs.copyFileSync(configSourceFile, configDestFile);
console.log(`✅ 成功套用 config 設定：${env}`);

// 處理 index.html
const htmlSourceFile = path.join(__dirname, 'src', `index.${env}.html`);
const htmlDestFile = path.join(__dirname, 'src', 'index.html');

if (!fs.existsSync(htmlSourceFile)) {
  console.error(`❌ 找不到來源 index.html 檔案：${htmlSourceFile}`);
  process.exit(1);
}

fs.copyFileSync(htmlSourceFile, htmlDestFile);
console.log(`✅ 成功套用 index.html：${env}`);
