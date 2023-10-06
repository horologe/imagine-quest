# 実行
起動方法
```sh
$ docker run --rm --gpus all -p 80:5000 imagine-quest
```
画像の生成方法
```sh
$ curl -X POST 'http://100.121.222.4/?prompt=a%20girl'
```
