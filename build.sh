# 脚本的第一个参数是环境
env=$1

echo "构建开始，环境：${env}"

if [ ${env} == 'dev' ]; then
  # 开发
elif [ ${env} == 'test' ]; then
  # 测试
elif [ ${env} == 'stage' ]; then
  # 预发布
elif [ ${env} == 'prod' ]; then
  # 生产
fi

# 安装依赖
npm install
# 打包
npm run build:$env
