const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// 读取YAML配置文件
function readYamlConfig(configPath) {
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error(`Error reading config file ${configPath}:`, error);
    return null;
  }
}

// 将YAML配置转换为环境变量格式
function yamlToEnvVars(config, prefix = '') {
  const envVars = {};

  for (const [key, value] of Object.entries(config)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(envVars, yamlToEnvVars(value, fullKey));
    } else {
      envVars[fullKey] = value;
    }
  }

  return envVars;
}

// 生成环境变量文件
function generateEnvFile(configPath, outputPath) {
  const config = readYamlConfig(configPath);
  if (!config) return;

  const envVars = yamlToEnvVars(config);
  let envContent = '';

  for (const [key, value] of Object.entries(envVars)) {
    envContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(outputPath, envContent);
  console.log(`Generated ${outputPath} from ${configPath}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'dev';

  const configPath = path.join(
    __dirname,
    '..',
    '.config',
    `${environment}.yaml`,
  );
  const outputPath = path.join(__dirname, '..', `env.${environment}`);

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  generateEnvFile(configPath, outputPath);
}

if (require.main === module) {
  main();
}

module.exports = { readYamlConfig, yamlToEnvVars, generateEnvFile };
