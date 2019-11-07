# strapi-provider-upload-qiniu

本插件使用[七牛node.js SDK](https://developer.qiniu.com/kodo)。

## 安装
在strapi目录下执行命令：
```
yarn add strapi-provider-upload-qiniu
```

具体插件安装方法参见[这里](https://strapi.io/documentation/guides/upload.html#install-providers)。

## 参数配置
- Access/Secret Key

登录七牛开发者后台，点击[这里🔗](https://portal.qiniu.com/user/key)查看 Access Key 和 Secret Key

- Region

| 机房      |    Zone对象 |
| :-------- | --------:|
| 华东	| qiniu.zone.Zone_z0|
| 华北	| qiniu.zone.Zone_z1|
| 华南	| qiniu.zone.Zone_z2|
| 北美	| qiniu.zone.Zone_na0|

- Prefix in your qiniu stroage key

插件在上传文件到七牛时，使用七牛SDK覆盖上传的凭证来上传文件，七牛中的文件命名规则为`prefix/filehash`。本域用于配置`prefix`。

- Bucket

七牛中存储空间的名字。

- Your domain link to qiniu

在七牛云存储控制台中配置`融合 CDN 加速域名`，
七牛存储空间中对应的`空间域名`。登录控制台，在对应的存储空间->空间概览->S3域名中可以获得。

- If append the file ext in key

文件在七牛存储空间中的key值，是否包含源文件的扩展名。
如果不包含扩展名，文件上传到七牛后，key值为{prefix}/{file hash}
如果包含扩展名，文件上传到七牛后，key值为{prefix}/{file hash}.{file ext}

- Uploaded callback url (TODO)

随意填写，插件中未实现对应功能。

- Uploaded callback body (TODO)

随意填写，插件中未实现对应功能。

- Set image size and resize params (TODO)

随意填写，插件中未实现对应功能。