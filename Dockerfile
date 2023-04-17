FROM node:hydrogen-alpine3.17
RUN addgroup app && adduser -S -G app app
RUN mkdir /app && mkdir /app/data && mkdir /app/farval && chown -R app:app /app
RUN chown -R app:app /app
USER app
EXPOSE 3000
WORKDIR /app/farval
COPY package.json .
RUN npm install
COPY . .

# CMD ["node", "index.js"]
ENTRYPOINT ["node", "index.js"]
