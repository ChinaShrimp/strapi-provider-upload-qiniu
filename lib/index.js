'use strict';
const qiniu = require("qiniu")

const ZoneMap = {
  "Zone_z0": qiniu.zone.Zone_z0,
  "Zone_z1": qiniu.zone.Zone_z1,
  "Zone_z2": qiniu.zone.Zone_z2,
  "Zone_na0": qiniu.zone.Zone_na0,
}

module.exports = {
  provider: 'qiniu-oss',
  name: 'Qiniu OSS',
  auth: {
    accessKey: {
      label: 'Your access key',
      type: 'text'
    },
    secretKey: {
      label: 'Your secret key',
      type: 'text'
    },
    prefix: {
      label: 'Prefix in your qiniu stroage key',
      type: 'text'
    },
    zone: {
      label: 'Region',
      type: 'enum',
      values: Object.keys(ZoneMap)
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    },
    publicBucketDomain: {
      label: 'Your domain link to qiniu',
      type: 'text'
    },
    appendFileExtInKey: {
      label: 'If append the file ext in key',
      type: 'enum',
      values: ['No', 'Yes']
    },
    callbackUrl: {
      label: 'Uploaded callback url',
      type: 'text',
    },
    callbackBody: {
      label: 'Uploaded callback body',
      type: 'text',
    },
    // If you open the original image protection, you can configure a default image processing style.
    deliverParams: {
      label: 'Set image size and resize params',
      type: 'text'
    }
  },
  init: (qiniuConfig) => {
    const prefix = qiniuConfig.prefix;
    const bucket = qiniuConfig.bucket;
    const publicBucketDomain = qiniuConfig.publicBucketDomain;
    const callbackUrl = qiniuConfig.callbackUrl;
    const callbackBody = qiniuConfig.callbackBody;

    const zoneConfig = new qiniu.conf.Config();
    zoneConfig.zone = ZoneMap[qiniuConfig.zone] || qiniu.zone.Zone_z2;
    const formUploader = new qiniu.form_up.FormUploader(zoneConfig);

    qiniu.conf.ACCESS_KEY = qiniuConfig.accessKey;
    qiniu.conf.SECRET_KEY = qiniuConfig.secretKey;
    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);

    return {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          let key = `${prefix}/${file.hash}`
          if (qiniuConfig.appendFileExtInKey && qiniuConfig.appendFileExtInKey === 'Yes') {
            key = `${key}${file.ext}`;
          }
          const putPolicy = new qiniu.rs.PutPolicy({ scope: `${bucket}:${key}` });
          const uploadToken = putPolicy.uploadToken(mac);
          const putExtra = new qiniu.form_up.PutExtra();
          formUploader.put(uploadToken, key, new Buffer(file.buffer, 'binary'), putExtra, (err, body, info) => {
            if (err) {
              return reject(Object.assign({}, err, { isBoom: true }));
            }

            if (info.statusCode === 200) {
              file.url = `${publicBucketDomain}/${key}`;
              if (file.mime && file.mime.startsWith('image/') &&  qiniuConfig.defaultImageStyle) {
                file.url = `${file.url}${qiniuConfig.defaultImageStyle}`;
              }
              return resolve();
            } else {
              return reject(err);
            }
          })
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          const bucketManager = new qiniu.rs.BucketManager(mac, zoneConfig);
          const key = `${file.hash}${file.ext}`;
          bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      }
    };
  }
};