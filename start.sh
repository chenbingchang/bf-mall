# 项目名称
app_name=$1
# 输入的环境变量
env=$2
# 外部访问端口
port=$3

# docker仓库地址，这里用的是阿里云的容器镜像服务
docker_repo_url=registry-vpc.cn-shenzhen.aliyuncs.com/chenbc
# docker镜像名称，格式：项目名称:环境
docker_image_name=$app_name:$env
# 镜像完整地址
docker_image_url=$docker_repo_url/$docker_image_name

# 停止容器
docker stop $app_name
# 删除旧容器
docker rm $app_name
# 强制删除旧镜像
docker rmi -f $docker_image_url
# 拉取新镜像
docker pull $docker_image_url
# 运行新容器，指定端口（要和nginx中的端口对应），名称，后台运行
# 掉进了一个坑：6000端口在谷歌浏览器无法使用，参考:https://blog.csdn.net/yenange/article/details/82178056  https://www.iteye.com/blog/mj914-1624394
docker run -itd -p $port:80 --name $app_name $docker_image_url
# 删除标记为'<none>'的镜像
docker rmi -f $(docker images | grep \<none\> | awk '{print $3}')