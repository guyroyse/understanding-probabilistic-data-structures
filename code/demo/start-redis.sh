docker image pull redislabs/redismod

docker run \
  -p 6379:6379 \
  -v `pwd`/data:/data \
  redislabs/redismod \
  --save 60 1 \
  --loadmodule /usr/lib/redis/modules/redisbloom.so \
  --dir /data