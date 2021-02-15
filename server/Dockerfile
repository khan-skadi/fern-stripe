FROM node:10
WORKDIR usr/src/app

# Install packages
COPY package*.json ./
RUN yarn

# Specify production environment
ENV NODE_ENV=production

# Copy files over
COPY . .

# Build it
RUN yarn run build

# Serve it
CMD ["yarn", "start"]
