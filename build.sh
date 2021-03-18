# 脚本的第一个参数是项目名称
app_name=$1
# 脚本的第二个参数是环境
env=$2

# 判断环境变量是否存在
if [ -z "$app_name" ]; then
  echo "请指定项目名称"
  exit 1
fi

# 判断环境变量是否存在
if [ -z "$env" ]; then
  echo "请指定环境"
  exit 1
fi

echo "构建开始，项目：${app_name}，环境：${env}"

# 部署服务器地址
server_host=""
# 部署后，外部访问的端口
port="7000"

if [ ${env} == 'dev' ]; then
  # 开发
  echo 开发
  server_host="http://cbingc.com:5001"
  port="7000"
elif [ ${env} == 'test' ]; then
  # 测试
  echo 测试
  server_host="http://cbingc.com:5001"
  port="7000"
elif [ ${env} == 'stage' ]; then
  # 预发布
  echo 预发布
  server_host="http://cbingc.com:5001"
  port="7000"
elif [ ${env} == 'prod' ]; then
  # 生产
  echo 生产
  server_host="http://cbingc.com:5001"
  port="7000"
fi

# 根据环境使用不同的nginx配置
cp -f ./nginx/conf.d/${env}.conf ./nginx/conf.d/app.conf

echo node版本信息
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

# docker仓库地址，这里用的是阿里云的容器镜像服务
docker_repo_url=registry-vpc.cn-shenzhen.aliyuncs.com/chenbc
# docker镜像名称，格式：项目名称:环境
docker_image_name=$app_name:$env
# 镜像完整地址
docker_image_url=$docker_repo_url/$docker_image_name

# 删除旧的镜像
docker rmi -f $docker_image_url
# 构建docker镜像，注意后面有个"."
docker build -t $docker_image_url .
# 把镜像推到啊里云镜像仓库
docker push $docker_image_url

# 触发部署服务器的脚本
if [ "$TOKEN" ]; then
  curl "${server_host}/hook/trigger?token=${TOKEN}&appName=${app_name}&env=${env}&port=${port}"
fi