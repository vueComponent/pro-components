import { version } from 'ant-design-vue'
import { omitUndefined } from '../omit-undefined'
import { compareVersions } from './index'

export const getVersion = () => {
  if (typeof process === 'undefined') return version
  return process?.env?.ANTD_VERSION || version
}

const openVisibleCompatible = (open?: boolean, onOpenChange?: any) => {
  const props =
    compareVersions(getVersion(), '3.0.0') > -1
      ? {
          open,
          onOpenChange
        }
      : {
          visible: open,
          onVisibleChange: onOpenChange
        }

  return omitUndefined(props)
}

export { openVisibleCompatible }
