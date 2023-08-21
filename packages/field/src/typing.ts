import {
  anyType,
  booleanType,
  eventType,
  functionType,
  objectType,
  omit,
  someType,
  vNodeType
} from '@v-c/utils'
import type { ProSchemaValueEnumType } from '@ant-design-vue/pro-provider'
import {
  baseProFieldFC,
  proFieldFCRenderProps,
  proRenderFieldPropsType
} from '@ant-design-vue/pro-provider'
import type {
  ProFieldRequestData,
  ProFieldTextType,
  ProFieldValueType
} from '@ant-design-vue/pro-utils'
import type { ExtractPropTypes, Ref, VNodeChild } from 'vue'

export const renderProps = {
  ...omit(proFieldFCRenderProps, ['text', 'placeholder']),
  ...proRenderFieldPropsType,
  request: functionType<ProFieldRequestData>(),
  emptyText: vNodeType(),
  open: booleanType(),
  onOpenChange: eventType<(open: boolean) => void>()
}

export type RenderProps = Partial<ExtractPropTypes<typeof renderProps>> & {
  [key: string]: any
}

export const proFieldLightProps = {
  lightLabel: objectType<{
    labelRef: Ref<HTMLElement | undefined>
    clearRef: Ref<HTMLElement | undefined>
  }>(),
  labelTrigger: booleanType()
}

export const proFieldPropsType = {
  ...renderProps,
  text: anyType<ProFieldTextType>(),
  valueType: someType<ProFieldValueType>([String, Object]),
  'onUpdate:text': eventType<(...args: any[]) => void>()
}

export const proFieldFC = (props?: any) => {
  return {
    ...baseProFieldFC,
    ...proRenderFieldPropsType,
    ...(props ?? {})
  }
}

export type ProFieldPropsType = Partial<
  ExtractPropTypes<typeof proFieldPropsType>
>
/**
 * 支持 Map 和 Record<string,any>
 *
 * @name ValueEnum 的类型
 */
export type ProSchemaValueEnumMap = Map<
  string | number | boolean,
  ProSchemaValueEnumType | VNodeChild
>

export type ProSchemaValueEnumObj = Record<
  string,
  ProSchemaValueEnumType | VNodeChild
>
export type ProFieldValueEnumType =
  | ProSchemaValueEnumMap
  | ProSchemaValueEnumObj
