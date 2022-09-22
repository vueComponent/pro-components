import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/pro-components/",
  description: "中后台重型组件",
  themeConfig: {
    logo: "./favicon.svg",
    siteTitle: "ProComponents-Vue",
    nav: [
      {
        text: "文档",
        link: "/intro/",
      },
      {
        text: "组件",
        link: "/components/pro-layout",
      },
    ],
    sidebar: {
      "/intro/": [
        {
          text: "简介",
          items: [
            {
              text: "简介",
              link: "/intro/",
            },
          ],
        },
      ],
      "/components/": [
        {
          text: "布局",
          items: [
            {
              text: "ProLayout",
              link: "/components/pro-layout",
            },
          ],
        },
        {
          text: "表单",
          collapsible: true,
          items: [
            {
              text: "ProForm",
              link: "/components/pro-form",
            },
            {
              text: "ProFormFields 表单项",
              link: "/components/pro-form-fields",
            },
          ],
        },
        {
          text: "通用",
          items: [
            {
              text: "ProField",
              link: "/components/pro-field",
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/vueComponent/pro-components",
      },
    ],
  },
});
