FROM nginxinc/nginx-unprivileged
RUN rm /etc/nginx/conf.d/default.conf
COPY build /var/www
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
ENTRYPOINT ["nginx","-g","daemon off;"]
