import type { GenerateStyle, ProAliasToken } from '@ant-design-vue/pro-provider'
import { useStyle as useAntdStyle } from '@ant-design-vue/pro-provider'
import type { Ref } from 'vue'

export interface ProToken extends ProAliasToken {
  componentCls: string
}

const genProStyle: GenerateStyle<ProToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBlock: 8,
      paddingInlineStart: 8,
      paddingInlineEnd: 8,
      borderBlockStart: `1px solid ${token.colorSplit}`
    }
  }
}

export function useStyle(prefixCls: Ref<string>) {
  return useAntdStyle('DropdownFooter', (token) => {
    const proToken: ProToken = {
      ...token,
      componentCls: `.${prefixCls.value}`
    }

    return [genProStyle(proToken)]
  })
}
