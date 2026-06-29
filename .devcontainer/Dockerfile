FROM ubuntu:26.04

SHELL [ "/usr/bin/bash", "-o", "pipefail", "-c" ]

ENV TZ="Asia/Tokyo"
ENV DEBIAN_FRONTEND="noninteractive"

RUN mkdir -p /workspaces/guildkit
WORKDIR /workspaces/guildkit

# Install tools

RUN apt-get update -qq \
  && apt-get dist-upgrade -y \
  && apt-get install -y --no-install-recommends curl git sudo ca-certificates \
  \
  && curl -fsSL https://downloads.claude.ai/keys/claude-code.asc -o /etc/apt/keyrings/claude-code.asc \
  && echo "deb [signed-by=/etc/apt/keyrings/claude-code.asc] https://downloads.claude.ai/claude-code/apt/stable stable main" | tee /etc/apt/sources.list.d/claude-code.list \
  \
  && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list \
	\
  && apt-get update -qq \
  && apt-get install -y --no-install-recommends claude-code gh \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"

RUN curl -fsSL https://mise.run | sh

COPY ./claude-settings.json /root/.claude/settings.json

# Project initialization

RUN mise trust & mise install
