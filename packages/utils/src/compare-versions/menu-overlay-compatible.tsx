import type { MenuProps } from 'ant-design-vue'
import { Menu } from 'ant-design-vue'
import { omitUndefined } from '../omit-undefined'
import { getVersion } from './open-visible-compatible'
import { compareVersions } from './index'

const menuOverlayCompatible = (menu: MenuProps) => {
  const props =
    compareVersions(getVersion(), '3.0.0') > -1
      ? {
          menu
        }
      : {
          overlay: <Menu {...menu} />
        }

  return omitUndefined(props)
}

export { menuOverlayCompatible }
