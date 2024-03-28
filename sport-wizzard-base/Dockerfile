FROM python:3.11.3

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y \
    && apt-get install -y \
        wget \
        gnupg \
        unzip \
        xz-utils \
        build-essential \
        zlib1g-dev \
        libncurses5-dev \
        libgdbm-dev \
        libssl-dev \
        libreadline-dev \
        libffi-dev \
        libsqlite3-dev \
        libbz2-dev \
        libnss3-dev \
        openssl \
    && pip3 install --upgrade pip

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
    google-chrome-stable

RUN rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/

RUN pip3 install -r /tmp/requirements.txt
