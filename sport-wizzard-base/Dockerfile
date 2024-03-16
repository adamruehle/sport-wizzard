# Set base image (host OS)
FROM debian:latest

# Install necessary dependencies
RUN apt-get update -y \
    && apt-get upgrade -y \
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
    && export DEBIAN_FRONTEND=noninteractive

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
    google-chrome-stable

# Install Chrome WebDriver - seems to get installed with Chrome
#RUN wget -q -O /usr/local/bin/chromedriver https://chromedriver.storage.googleapis.com/114.0.5735.90/chromedriver_linux64.zip \
#    && unzip /usr/local/bin/chromedriver -d /usr/local/bin \
#    && chmod +x /usr/local/bin/chromedriver

# Install Python 3.11.3
RUN wget -O /tmp/python.tar.xz https://www.python.org/ftp/python/3.11.3/Python-3.11.3.tar.xz \
    && mkdir -p /usr/src/python \
    && tar -xJC /usr/src/python --strip-components=1 -f /tmp/python.tar.xz \
    && rm /tmp/python.tar.xz \
    && cd /usr/src/python \
    && ./configure --enable-optimizations --with-ssl \
    && make -j$(nproc) \
    && make altinstall \
    && cd / \
    && rm -rf /usr/src/python \
    && python3 -c "import ssl; print(ssl.OPENSSL_VERSION)"

# Clean up
RUN rm -rf /var/lib/apt/lists/*

# Copy the dependencies file to the working directory
COPY requirements.txt /tmp/

# Install python dependencies
RUN pip3 install --upgrade pip \
    pip3 install -r /tmp/requirements.txt
