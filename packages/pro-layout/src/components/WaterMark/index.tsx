/* eslint-disable */
import {
  defineComponent,
  computed,
  ref,
  watchEffect,
  type CSSProperties,
  type PropType,
  type ExtractPropTypes,
} from 'vue';
import { useRouteContext } from '../../RouteContext';

export type FontStyle = 'none' | 'normal' | 'italic' | 'oblique';
export type FontWeight = 'normal' | 'light' | 'weight' | number;

export const waterMarkProps = {
  /** ClassName 前缀 */
  prefixCls: String,
  /** 水印样式 */
  markStyle: [String, Object] as PropType<CSSProperties>,
  /** 水印类名 */
  markClassName: String,
  /** 水印之间的水平间距 */
  gapX: Number,
  /** 水印之间的垂直间距 */
  gapY: Number,
  /** 追加的水印元素的z-index */
  zIndex: Number,
  /** 水印的宽度 */
  width: Number,
  /** 水印的高度 */
  height: Number,
  /** 水印在canvas 画布上绘制的垂直偏移量，正常情况下，水印绘制在中间位置, 即 offsetTop = gapY / 2 */
  offsetTop: Number, // 水印图片距离绘制 canvas 单元的顶部距离
  /** 水印在canvas 画布上绘制的水平偏移量, 正常情况下，水印绘制在中间位置, 即 offsetTop = gapX / 2 */
  offsetLeft: Number,
  /** 水印绘制时，旋转的角度，单位 ° */
  rotate: Number,
  /** 高清印图片源, 为了高清屏幕显示，建议使用 2倍或3倍图，优先使用图片渲染水印。 */
  image: String,
  /** 水印文字内容 */
  content: String,
  /** 文字颜色 */
  fontColor: String,
  /** 文字样式 */
  fontStyle: String as PropType<FontStyle>,
  /** 文字族 */
  fontFamily: String,
  /** 文字粗细 */
  fontWeight: [String, Number] as PropType<FontWeight>,
  /** 文字大小 */
  fontSize: [String, Number] as PropType<string | number>,
};

export type WaterMarkProps = Partial<ExtractPropTypes<typeof waterMarkProps>>;

/**
 * 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
 *
 * @param context
 * @see api 有些废弃了，其实类型 CanvasRenderingContext2D
 */
// @typescript-eslint/no-explicit-any
const getPixelRatio = (context: any) => {
  if (!context) {
    return 1;
  }
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

const WaterMark = defineComponent({
  name: 'WaterMark',
  props: waterMarkProps,
  setup(props, { slots }) {
    const {
      markStyle,
      markClassName,
      // antd 内容层 zIndex 基本上在 10 以下 https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
      zIndex = 9,
      gapX = 212,
      width = 120,
      prefixCls: customizePrefixCls,
    } = props;

    const { getPrefixCls } = useRouteContext();
    const prefixCls = getPrefixCls('pro-layout-watermark', customizePrefixCls);
    const wrapperCls = computed(() => `${prefixCls}-wrapper`);
    const waterMakrCls = computed(() => {
      return {
        [`${prefixCls}`]: prefixCls,
        [`${markClassName}`]: markClassName,
      };
    });
    const base64Url = ref('');

    watchEffect(() => {
      const { 
        gapX = 212,
        gapY = 222,
        width = 120,
        height = 64, 
        rotate = -22, // 默认旋转 -22 度
        image,
        content, 
        offsetLeft,
        offsetTop,
        fontStyle = 'normal',
        fontWeight = 'normal',
        fontColor = 'rgba(0,0,0,.15)',
        fontSize = 16,
        fontFamily = 'sans-serif',
      } = props

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const ratio = getPixelRatio(ctx);

      const canvasWidth = `${(gapX + width) * ratio}px`;
      const canvasHeight = `${(gapY + height) * ratio}px`;
      const canvasOffsetLeft = offsetLeft || gapX / 2;
      const canvasOffsetTop = offsetTop || gapY / 2;

      canvas.setAttribute('width', canvasWidth);
      canvas.setAttribute('height', canvasHeight);

      if (ctx) {
        // 旋转字符 rotate
        ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio);
        ctx.rotate((Math.PI / 180) * Number(rotate));
        const markWidth = width * ratio;
        const markHeight = height * ratio;

        if (image) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.referrerPolicy = 'no-referrer';
          img.src = image;
          img.onload = () => {
            ctx.drawImage(img, 0, 0, markWidth, markHeight);
            base64Url.value = canvas.toDataURL();
          };
        } else if (content) {
          const markSize = Number(fontSize) * ratio;
          ctx.font = `${fontStyle} normal ${fontWeight} ${markSize}px/${markHeight}px ${fontFamily}`;
          ctx.fillStyle = fontColor;
          ctx.fillText(content, 0, 0);
          base64Url.value = canvas.toDataURL();
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('当前环境不支持Canvas');
      }
    });

    return () => {
      return (
        <div
          style={{
            position: 'relative',
          }}
          class={wrapperCls.value}
        >
          {slots.default?.()}
          <div
            class={waterMakrCls.value}
            style={{
              zIndex,
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              backgroundSize: `${gapX + width}px`,
              pointerEvents: 'none',
              backgroundRepeat: 'repeat',
              backgroundImage: `url('${base64Url.value}')`,
              ...markStyle,
            }}
          />
        </div>
      );
    };
  },
});

export default WaterMark;
