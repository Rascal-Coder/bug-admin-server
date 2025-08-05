# Docker Compose 配置使用说明

本项目支持使用 `.config/` 目录下的 YAML 配置文件来管理 Docker Compose 的环境变量。

## 配置文件结构

```
.config/
├── default.yaml    # 默认配置
├── dev.yaml        # 开发环境配置
└── prod.yaml       # 生产环境配置
```

## 使用方法

### 方法1：使用 npm 脚本（推荐）

```bash
# 使用开发环境配置启动
npm run docker:dev

# 使用生产环境配置启动
npm run docker:prod

# 停止服务
npm run docker:down

# 查看日志
npm run docker:logs
```

### 方法2：使用脚本直接启动

```bash
# 使用开发环境配置
node scripts/load-config.js dev docker-compose up -d

# 使用生产环境配置
node scripts/load-config.js prod docker-compose up -d
```

### 方法3：使用 shell 脚本

```bash
# 使用开发环境配置
./scripts/docker-compose-with-config.sh dev

# 使用生产环境配置
./scripts/docker-compose-with-config.sh prod
```

### 方法4：使用 docker-compose override 文件

```bash
# 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 生产环境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 配置映射

YAML 配置文件中的配置会自动映射为环境变量：

```yaml
# .config/dev.yaml
MYSQL_CONFIG:
  host: "localhost"
  port: 3306
  username: "root"
  password: "root"
  database: "bug-admin"

REDIS_CONFIG:
  host: "localhost"
  port: 6379
  password: "root"
```

会被转换为：

```bash
MYSQL_CONFIG_HOST=localhost
MYSQL_CONFIG_PORT=3306
MYSQL_CONFIG_USERNAME=root
MYSQL_CONFIG_PASSWORD=root
MYSQL_CONFIG_DATABASE=bug-admin
REDIS_CONFIG_HOST=localhost
REDIS_CONFIG_PORT=6379
REDIS_CONFIG_PASSWORD=root
```

## 环境变量映射

Docker Compose 中使用以下环境变量：

- `DB_HOST` ← `MYSQL_CONFIG.host`
- `DB_PORT` ← `MYSQL_CONFIG.port`
- `DB_USERNAME` ← `MYSQL_CONFIG.username`
- `DB_PASSWORD` ← `MYSQL_CONFIG.password`
- `DB_DATABASE` ← `MYSQL_CONFIG.database`
- `REDIS_HOST` ← `REDIS_CONFIG.host`
- `REDIS_PORT` ← `REDIS_CONFIG.port`
- `REDIS_PASSWORD` ← `REDIS_CONFIG.password`
- `APP_PORT` ← `SERVER_CONFIG.port`

## 注意事项

1. 确保已安装 `js-yaml` 依赖：`npm install js-yaml`
2. 配置文件路径为 `.config/{环境名}.yaml`
3. 支持的环境：`dev`、`prod`
4. 如果环境变量未设置，会使用默认值 