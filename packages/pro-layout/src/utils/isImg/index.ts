// source by https://github.com/ant-design/pro-components/blob/master/packages/utils/src/isImg/index.ts

/** 判断是否是图片链接 */
function isImg(path: string): boolean {
  return /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path);
}

export default isImg;
