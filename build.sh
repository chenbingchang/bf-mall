# 脚本的第一个参数是环境
env=$1

# 判断环境变量是否存在
if [ -z "$env" ]; then
  echo "请指定环境"
  exit 1
fi

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

# 根据环境使用不同的nginx配置
cp -f ./nginx/conf.d/${env}.conf ./nginx/conf.d/app.conf

echo $PATH
# 查看node版本
node --version
npm --version
# 设置npm淘宝镜像，加速下载
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
npm run build:$env

# 构建docker镜像
docker build -t registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:$env .
# 把镜像推到啊里云镜像仓库
docker push registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:$env

# 触发部署服务器的脚本
if [ "$TOKEN" ]; then
  curl http://cbingc.com:5001/trigger/bf-mall?token=${TOKEN}&env=${env}
fi