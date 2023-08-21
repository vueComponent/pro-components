import type { GenerateStyle, ProAliasToken } from '@ant-design-vue/pro-provider'
import { useStyle as useAntdStyle } from '@ant-design-vue/pro-provider'
import type { Ref } from 'vue'

export interface ProToken extends ProAliasToken {
  componentCls: string
}

const genProStyle: GenerateStyle<ProToken> = (token) => {
  return {
    [`${token.componentCls}-label`]: { cursor: 'pointer' },
    [`${token.componentCls}-overlay`]: {
      minWidth: '200px',
      marginBlockStart: '4px'
    },
    [`${token.componentCls}-content`]: { paddingBlock: 16, paddingInline: 16 }
  }
}

export function useStyle(prefixCls: Ref<string>) {
  return useAntdStyle('FilterDropdown', (token) => {
    const proToken: ProToken = {
      ...token,
      componentCls: `.${prefixCls.value}`
    }

    return [genProStyle(proToken)]
  })
}
