import ProFormDatePicker from './date-picker'
import ProFormDatePickerMonth from './month-picker'
import ProFormDatePickerQuarter from './date-picker'
import ProFormDatePickerWeek from './week-picker'
import ProFormDatePickerYear from './year-picker'

const ExportComponent = ProFormDatePicker

ExportComponent.Week = ProFormDatePickerWeek
ExportComponent.Month = ProFormDatePickerMonth
ExportComponent.Quarter = ProFormDatePickerQuarter
ExportComponent.Year = ProFormDatePickerYear

export {
  ProFormDatePicker,
  ProFormDatePickerMonth,
  ProFormDatePickerQuarter,
  ProFormDatePickerWeek,
  ProFormDatePickerYear
}
export default ExportComponent
