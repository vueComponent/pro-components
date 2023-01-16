<template>
    <div>
        grid开关
        <Switch v-model:checked="grid" />
    </div>
    <br />
    <div>
        只读
        <Switch v-model:checked="readonly" />
    </div>
    <br />
    <div>
        标签布局
        <RadioGroup v-model:value="formLayoutType">
            <RadioButton v-for="layout in layouts" :key="layout" :value="layout">
                {{ layout }}
            </RadioButton>
        </RadioGroup>
    </div>
    <br />
    <pro-form
        v-model:model="formModel"
        :readonly="readonly"
        :layout="formLayoutType"
        :grid="grid"
        :col-props="{
            span: 8
        }"
        @finish="handleSubmit"
        @values-change="handleValuesChange"
        @reset="handleReset"
    >
        <pro-form-text
            name="name"
            label="应用名称"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-text
            name="name2"
            label="应用名称2"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-text
            name="name3"
            label="应用名称3"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-text
            name="name4"
            label="应用名称4"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-text
            name="name5"
            label="应用名称5"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-text
            name="name6"
            label="应用名称6"
            :col-props="{
                xl: 8,
                md: 12
            }"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-text
            name="name79"
            label="应用名称7"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-password
            name="password"
            label="密码"
            :field-props="{
                allowClear: true,
                placeholder: '请输入'
            }"
            required
        />
        <pro-form-select
            name="gender"
            label="性别"
            :options="sex"
            :field-props="{
                placeholder: '请选择'
            }"
            required
        >
            <template #option="{ value: val, label, icon }">
                <span role="img" :aria-label="val">{{ icon }}</span>
                &nbsp;&nbsp;{{ label }}
            </template>
        </pro-form-select>
        <pro-form-select
            name="girlName"
            label="Girl姓名"
            :field-props="{
                placeholder: '请选择',
                mode: 'multiple',
                options: girlNameoptions
            }"
            required
        >
            <template #dropdownRender="{ menuNode: menu }">
                <v-nodes :vnodes="menu" />
                <Divider style="margin: 4px 0" />
                <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="e => e.preventDefault()"
                    @click="addItem"
                >
                    <plus-outlined />
                    Add item
                </div>
            </template>
        </pro-form-select>
        <pro-form-select
            name="lang"
            label="语言"
            :field-props="{
                placeholder: '请选择语言'
            }"
        >
            <SelectOption v-for="lang in langs" :key="lang.value" :value="lang.value">
                <span role="img" :aria-label="lang.value">{{ lang.icon }}</span>
                &nbsp;&nbsp;{{ lang.label }}
            </SelectOption>
            <template #suffixIcon>
                <plus-outlined />
            </template>
        </pro-form-select>
        <pro-form-select
            name="country"
            label="国家"
            :field-props="{
                showSearch: true,
                mode: 'multiple',
                filterOption: false
            }"
            :request="fetchUser"
        >
            <template #placeholder>请选择国家</template>
        </pro-form-select>
        <pro-form-date-picker
            name="expirationTime"
            label="合同失效时间"
            :field-props="{
                placeholder: '请选择合同失效时间',
                format: customFormat
            }"
        >
            <template #superPrevIcon>
                <plus-outlined />
            </template>
            <template #renderExtraFooter>extra footer</template>
            <template #dateRender="{ current }">
                <div class="ant-picker-cell-inner" :style="getCurrentStyle(current)">
                    {{ current.date() }}
                </div>
            </template>
        </pro-form-date-picker>
        <pro-form-date-range-picker
            name="rangeTimes"
            label="开始结束时间"
            :field-props="{
                placeholder: ['请选择开始时间', '请选择结束时间'],
                format: 'YYYY/MM/DD HH:mm:ss'
            }"
        >
            <template #renderExtraFooter>extra footer</template>
            <template #dateRender="{ current }">
                <div class="ant-picker-cell-inner" :style="getCurrentStyle(current)">
                    {{ current.date() }}
                </div>
            </template>
        </pro-form-date-range-picker>
        <pro-form-date-picker-week
            name="weakTime"
            label="选择周"
            :field-props="{
                placeholder: '请选择周时间'
            }"
        />
        <ProFormDatePickerQuarter
            name="quarterTime"
            label="选择季度"
            :field-props="{
                placeholder: '请选择季度时间'
            }"
        />
        <ProFormDatePickerYear
            name="yearTime"
            label="选择年"
            :field-props="{
                placeholder: '请选择年时间'
            }"
        />
        <ProFormTimePicker
            name="timeDate"
            label="选择时间"
            :field-props="{
                placeholder: '选择时间'
            }"
        />
        <ProFormTimeRangePicker
            name="timeRangeDate"
            label="选择时间区域"
            :field-props="{
                placeholder: ['选择开始时间', '选择结束时间']
            }"
        />
        <ProFormDateTimeRangePicker
            name="dateTimeRange"
            label="选择时间范围-时分秒"
            :field-props="{
                placeholder: ['选择开始时间', '选择结束时间']
            }"
        >
            <template #renderExtraFooter>extra footer</template>
            <template #dateRender="{ current }">
                <div class="ant-picker-cell-inner" :style="getCurrentStyle(current)">
                    {{ current.date() }}
                </div>
            </template>
        </ProFormDateTimeRangePicker>
        <ProFormRadio             
            name="radio"
            label="Checkbox.Group"
        >
            <Radio value="a">Hangzhou</Radio>
            <Radio value="b">Shanghai</Radio>
            <Radio value="c">Beijing</Radio>
            <Radio value="d" disabled>Chengdu</Radio>
        </ProFormRadio>
        <ProFormRadio             
            name="radio1"
            label="Checkbox.Group"
            :field-props="{
                options: optionsWithDisabled
            }"
        />
            
    </pro-form>
</template>

<script lang="ts" setup>
import { ref, FunctionalComponent, CSSProperties } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
    RadioGroup,
    RadioButton,
    Radio,
    Switch,
    Divider,
    SelectOption,
    type SelectProps, RadioGroupProps
} from 'ant-design-vue';
import type { FormLayout } from 'ant-design-vue/es/form/Form';
import {
    ProForm,
    ProFormText,
    ProFormPassword,
    ProFormSelect,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDatePickerWeek,
    ProFormDatePickerYear,
    ProFormDatePickerQuarter,
    ProFormDateTimeRangePicker,
    ProFormTimePicker,
    ProFormTimeRangePicker,
    ProFormRadio
} from '@ant-design-vue/pro-form';
import dayjs, { type Dayjs } from 'dayjs';
import type { Recordable } from '@/typings';

let lastFetchId = 0;

const fetchUser = async (value: string) => {
    console.log('fetching user', value);
    lastFetchId += 1;
    const fetchId = lastFetchId;
    const response = await fetch('https://randomuser.me/api/?results=5');
    const body = await response.json();
    if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
    }
    return body.results.map((user: any) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username
    }));
};

const layouts = ['horizontal', 'vertical', 'inline'];

const dateFormat = 'YYYY/MM/DD';

type RangeValue = [Dayjs, Dayjs];

const formModel = ref({
    name: '456',
    name2: '567',
    name3: 'xxx',
    name4: '',
    name5: '',
    name6: '',
    name7: '',
    password: '111',
    gender: '女',
    // 如果是Select多选,这里初始值一定要设置成[], 详看：https://github.com/vueComponent/ant-design-vue/issues/5445
    // prop.o[prop.k] = [].concat(initialValue.value);
    girlName: [],
    lang: undefined,
    // 如果是Select多选,这里初始值一定要设置成[], 详看：https://github.com/vueComponent/ant-design-vue/issues/5445
    // prop.o[prop.k] = [].concat(initialValue.value);
    country: [],
    expirationTime: ref<Dayjs>(dayjs('2015/01/01', dateFormat)),
    rangeTimes: ref<RangeValue>(),
    weakTime: ref<Dayjs>(),
    quarterTime: ref<Dayjs>(),
    yearTime: ref<Dayjs>(),
    timeDate: ref<Dayjs>(),
    timeRangeDate: ref<Dayjs>(),
    dateTimeRange: ref<RangeValue>(),
    radio: 'a',
    radio1: ''
});

const sex = ref([
    {
        value: '男',
        label: '男',
        icon: '👨'
    },
    {
        value: '女',
        label: '女',
        icon: '👩‍🦰'
    }
]);

const girlNameoptions = ref<SelectProps['options']>([
    {
        label: 'Manager',
        options: [
            {
                value: 'jack',
                label: 'Jack'
            },
            {
                value: 'lucy',
                label: 'Lucy'
            }
        ]
    },
    {
        label: 'Engineer',
        options: [
            {
                value: 'yiminghe',
                label: 'Yiminghe'
            }
        ]
    }
]);

const langs = ref([
    {
        value: '中文',
        label: '中文',
        icon: '🇨🇳'
    },
    {
        value: 'English',
        label: 'English',
        icon: '🇺🇸'
    }
]);

const optionsWithDisabled: RadioGroupProps['options'] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: true },
];

const formLayoutType = ref<FormLayout>('horizontal');
const grid = ref(true);
const readonly = ref(false);

const handleSubmit = (value: Recordable) => {
    console.log(value);
};

const handleReset = (value: Recordable) => {
    console.log('重置', value);
};

const VNodes: FunctionalComponent = (_, { attrs }) => {
    return attrs.vnodes;
};

let index = 0;
const addItem = () => {
    girlNameoptions.value?.[1].options.push({
        value: index++,
        label: `Item${index++}`
    });
};

const customFormat = (value: Dayjs) => `custom format: ${value?.format('YYYY-MM-DD')}`;

const getCurrentStyle = (current: Dayjs) => {
    const style: CSSProperties = {};

    if (current.date() === 2) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
    }

    return style;
};

const handleValuesChange = (values: any) => {
    console.log('values', values);
};
</script>
