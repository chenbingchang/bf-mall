# 脚本的第一个参数是环境
env=$1

echo "构建开始，环境：${env}"

if [ ${env} == 'dev' ]; then
  # 开发
  echo 开发
elif [ ${env} == 'test' ]; then
  # 测试
  echo 测试
elif [ ${env} == 'stage' ]; then
  # 预发布
  echo 预发布
elif [ ${env} == 'prod' ]; then
  # 生产
  echo 生产
fi

echo $PATH
# 查看node版本
node --version
npm --version
#/bin/bash build.sh dev
npm config set registry https://registry.npm.taobao.org
# 查看淘宝镜像是否设置成功
npm config get registry
# 安装依赖
npm install
# contos7中sass-loader有些问题，主要还是linux环境的原因，需要通过以下方法：
# 方法1、npm rebuild node-sass 通过重构node-sass，但是会从一个国外的网站下载一个东西，第一次较慢，后面正常
# 方法2、npm install --save-dev sass fibers 这个方法比较快，因为下载用了淘宝的镜像
 npm rebuild node-sass
# npm install --save-dev sass fibers
# 打包
npm run build:dev


# npm install
# 打包
# npm run build:$env
