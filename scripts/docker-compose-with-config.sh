#!/bin/bash

# 设置默认环境
ENV=${1:-dev}

echo "使用 .config/${ENV}.yaml 配置启动 Docker Compose..."

# 使用Node.js脚本加载配置并启动docker-compose
node scripts/load-config.js $ENV docker-compose up -d

echo "Docker Compose 已启动，使用 ${ENV} 环境配置" 