import type { DefaultTheme } from 'vitepress'

export const getSideBar = (): DefaultTheme.Sidebar => {
  return {
    '/guide/': [
      {
        text: '指引',
        items: [
          {
            text: '介绍',
            link: '/guide/introduce'
          }
        ]
      }
    ],
    field: [
      {
        text: '介绍',
        link: '/field/'
      },
      {
        text: '组件类型',
        items: [
          {
            text: 'FieldText',
            link: '/field/text'
          },
          {
            text: 'FieldTextArea',
            link: '/field/text-area'
          },
          {
            text: 'FieldSwitch',
            link: '/field/switch'
          },
          {
            text: 'FieldSlider',
            link: '/field/slider'
          },
          {
            text: 'FieldSelect',
            link: '/field/select'
          },
          {
            text: 'FieldSegmented',
            link: '/field/segmented'
          },
          {
            text: 'FieldSecond',
            link: '/field/second'
          },
          {
            text: 'FieldRate',
            link: '/field/rate'
          },
          {
            text: 'FieldRangePicker',
            link: '/field/range-picker'
          },
          {
            text: 'FieldRadio',
            link: '/field/radio'
          },
          {
            text: 'FieldProgress',
            link: '/field/progress'
          },
          {
            text: 'FieldPercent',
            link: '/field/percent'
          },
          {
            text: 'FieldPassword',
            link: '/field/password'
          },
          {
            text: 'FieldMoney',
            link: '/field/money'
          },
          {
            text: 'IndexColumn',
            link: '/field/index-column'
          },
          {
            text: 'FieldImage',
            link: '/field/image'
          },
          {
            text: 'FieldFromNow',
            link: '/field/from-now'
          },
          {
            text: 'FieldDigit',
            link: '/field/digit'
          },
          {
            text: 'FieldDatePicker',
            link: '/field/date-picker'
          },
          {
            text: 'FieldCheckbox',
            link: '/field/checkbox'
          },
          {
            text: 'FieldCascader',
            link: '/field/cascader'
          },
          {
            text: 'FieldTimePicker',
            link: '/field/time-picker'
          },
          {
            text: 'FieldTreeSelect',
            link: '/field/tree-select'
          }
        ]
      }
    ],
    form: [
      {
        text: 'ProForm',
        items: [
          {
            text: '结合FormItem使用',
            link: '/form/pro-form/form-item'
          },
          {
            text: '结合ProFormField使用',
            link: '/form/pro-form/pro-form-field'
          },
          {
            text: '完整例子',
            link: '/form/pro-form/pro-form'
          },
          {
            text: '分组测试',
            link: '/form/pro-form/group'
          }
        ]
      },
      {
        text: 'QueryForm',
        items: [
          {
            text: '本地例子',
            link: '/form/query-form/'
          }
        ]
      },
      {
        text: 'SchemaForm',
        items: [
          {
            text: '测试例子',
            link: '/form/schema-form/'
          }
        ]
      }
    ],
    '/provider/': [
      {
        text: '介绍',
        link: '/provider/'
      },
      {
        text: '使用',
        items: [
          {
            text: '基本用法',
            link: '/provider/basic/'
          }
        ]
      }
    ],
    table: [
      {
        text: '介绍',
        link: '/table/'
      },
      {
        text: '使用',
        items: [
          {
            text: '基本用法',
            link: '/table/basic/'
          }
        ]
      }
    ]
  }
}
