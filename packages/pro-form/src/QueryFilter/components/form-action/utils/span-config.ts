import type { FormLayout } from 'ant-design-vue/es/form/Form';

export type BreakPointType = {
  [key: string]: number;
};

export type SpanConfig = number | BreakPointType;

const CONFIG_SPAN_BREAKPOINTS: BreakPointType = {
  xs: 513,
  sm: 513,
  md: 785,
  lg: 992,
  xl: 1057,
  xxl: Infinity,
};

type BreakPointValueType = [number, number, string][];

type BreakPointsType = {
  [key: string]: BreakPointValueType;
};

/** 配置表单列变化的容器宽度断点 */
const BREAKPOINTS: BreakPointsType = {
  vertical: [
    // [breakpoint, cols, layout]
    [513, 1, 'vertical'],
    [785, 2, 'vertical'],
    [1057, 3, 'vertical'],
    [Infinity, 4, 'vertical'],
  ],
  default: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    [Infinity, 4, 'horizontal'],
  ],
  horizontal: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    [Infinity, 4, 'horizontal'],
  ],
  inline: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    [Infinity, 4, 'horizontal'],
  ],
};

/**
 * 合并用户和默认的配置
 *
 * @param layout
 * @param width
 */
export const getSpanConfig = (
  layout: FormLayout,
  width: number,
  span?: SpanConfig
): { span: number; layout: FormLayout } => {
  if (span && typeof span === 'number') {
    return {
      span,
      layout,
    };
  }

  const spanConfig: BreakPointValueType =
    span && typeof span !== 'number'
      ? ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((key) => [CONFIG_SPAN_BREAKPOINTS[key], 24 / span[key], 'horizontal'])
      : BREAKPOINTS[layout || 'default'];

  const breakPoint = (spanConfig || BREAKPOINTS.default).find(
    (item) => width < item[0] + 16 // 16 = 2 * (ant-row -8px margin)
  );

  if (breakPoint === undefined) {
    return {
      span: 0,
      layout: 'horizontal',
    };
  }

  return {
    // 每个控件占用span
    span: 24 / (breakPoint[1] as number),
    layout: breakPoint[2] as FormLayout,
  };
};
