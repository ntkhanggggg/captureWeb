FROM ubuntu
RUN apt update && apt install -y ssh wget unzip vim curl nano git sudo 
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN npm install && node index
