FROM node:6.9.1

RUN echo "America/Montreal" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install all dependencies
COPY package.json /usr/src/app

# Needed as long as we have node module dependencies pointing to
# git repositories
RUN apt-get update && apt-get install -y git

# Typescript is needed for TS modules that need to transpile at the
# `postinstall` step eg: lib-logger-helper. (dev deps are not packaged for a module)
RUN npm install -g gulp-cli typescript
RUN npm install --no-cache --force

#Bundle app source
COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]
