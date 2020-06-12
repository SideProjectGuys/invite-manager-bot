FROM node:12

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update \
	&& apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \ 
	#
	# Verify git and needed tools are installed
	&& apt-get -y install git iproute2 procps \
	#
	# Install zsh
	&& apt-get install -y zsh \
	&& wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true \
	#
	## Install InviteManager dependencies
	# Install GraphicsMagick
	&& apt-get -y install graphicsmagick python-pip \
	#
	# Clean up
	&& apt-get autoremove -y \
	&& apt-get clean -y \
	&& rm -rf /var/lib/apt/lists/* \
	# Transifex
	&& pip install transifex-client

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog