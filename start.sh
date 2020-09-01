# 输入的环境变量
env=$1

# 停止容器
docker stop bf-mall
# 删除旧容器
docker rm bf-mall
# 强制删除旧镜像
docker rmi -f registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:$env
# 拉取新镜像
docker pull registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:$env
# 运行新容器，指定端口（要和nginx中的端口对应），名称，后台运行
docker run -itd -p 6000:80 --name bf-mall registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:$env