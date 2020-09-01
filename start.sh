env=$1

# 停止容器
docker stop bf-mall
# 删除旧容器
docker rm bf-mall
# 强制删除旧镜像
docker rmi -f registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:$env
# 拉取新镜像
docker pull registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:dev
# 运行新容器，指定端口，名称，后台运行
docker run -itd -p 6000:5000 --name bf-mall registry-vpc.cn-shenzhen.aliyuncs.com/chenbc/bf-mall:dev