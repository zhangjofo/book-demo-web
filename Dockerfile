FROM nginx:1.17.10-alpine
COPY dist/  /usr/share/nginx/html/
COPY nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]