FROM nginx:alpine

# Replace nginx default config with SPA-aware config (history mode)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# CI must provide the built assets at ./dist in the build context
COPY ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
