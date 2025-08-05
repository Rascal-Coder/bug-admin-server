#!/usr/bin/env node

const fs = require('fs');
const { parse } = require('yaml');
const path = require('path');

// 读取YAML配置文件
function loadYamlConfig(env = 'dev') {
  const configPath = path.join(__dirname, '..', '.config', `${env}.yaml`);

  if (!fs.existsSync(configPath)) {
    console.error(`配置文件不存在: ${configPath}`);
    process.exit(1);
  }

  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return parse(fileContents);
  } catch (error) {
    console.error(`读取配置文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 将YAML配置转换为环境变量
function yamlToEnvVars(config, prefix = '') {
  const envVars = {};

  for (const [key, value] of Object.entries(config)) {
    const fullKey = prefix
      ? `${prefix}_${key.toUpperCase()}`
      : key.toUpperCase();

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(envVars, yamlToEnvVars(value, fullKey));
    } else {
      envVars[fullKey] = value;
    }
  }

  return envVars;
}

// 设置环境变量
function setEnvVars(envVars) {
  for (const [key, value] of Object.entries(envVars)) {
    process.env[key] = String(value);
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'dev';

  console.log(`加载 ${environment} 环境配置...`);

  const config = loadYamlConfig(environment);
  const envVars = yamlToEnvVars(config);

  // 设置环境变量
  setEnvVars(envVars);

  console.log('环境变量已设置:');
  for (const [key, value] of Object.entries(envVars)) {
    console.log(`  ${key}=${value}`);
  }

  // 如果有额外的命令参数，执行它
  const remainingArgs = args.slice(1);
  if (remainingArgs.length > 0) {
    const { spawn } = require('child_process');
    const child = spawn(remainingArgs[0], remainingArgs.slice(1), {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('exit', (code) => {
      process.exit(code);
    });
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadYamlConfig, yamlToEnvVars, setEnvVars };
