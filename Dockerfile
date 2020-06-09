FROM node:12.16.1

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update \
	&& apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \ 
	#
	# Verify git and needed tools are installed
	&& apt-get -y install git iproute2 procps \
	#
	# Install InviteManager dependencies
	&& apt-get -y install graphicsmagick build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
	#
	# Clean up
	&& apt-get autoremove -y \
	&& apt-get clean -y \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chown -R node:node /wait && chmod +x /wait

USER node

RUN npm install

COPY --chown=node:node . .

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog

CMD /wait && npm start
