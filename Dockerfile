# 指定基础的镜像
FROM nginx

# 删除nginx镜像默认的配置文件
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# 把./dist下的所有文件复制到nginx镜像默认的资源目录下
COPY ./dist/ /usr/share/nginx/html/
COPY ./nginx/nginx.conf /etc/nginx/
COPY ./nginx/conf.d/app.conf /etc/nginx/conf.d/