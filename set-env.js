// set-env.js
const fs = require('fs');
const path = require('path');

const env = process.argv[2]; // 取得傳入參數 dev/test/prod
const validEnvs = ['dev', 'test', 'prod'];

if (!validEnvs.includes(env)) {
  console.error(`❌ 請指定環境變數（${validEnvs.join(', ')}）`);
  process.exit(1);
}

const baseDir = path.join(__dirname, 'public', 'assets', 'configs');
const sourceFile = path.join(baseDir, `config.${env}.json`);
const destFile = path.join(baseDir, 'config.json');

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ 找不到來源檔案：${sourceFile}`);
  process.exit(1);
}

fs.copyFileSync(sourceFile, destFile);
console.log(`✅ 成功套用環境設定：${env}`);
