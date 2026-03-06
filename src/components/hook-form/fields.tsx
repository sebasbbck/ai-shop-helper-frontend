import { RHFAutocomplete } from './rhf-autocomplete'
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox'
import { RHFCountrySelect } from './rhf-country-select'
import {
  RHFDatePicker,
  RHFDateTimePicker,
  RHFTimePicker,
} from './rhf-date-picker'
import { RHFPhoneInput } from './rhf-phone-input'
import { RHFRadioGroup } from './rhf-radio-group'
import { RHFRating } from './rhf-rating'
import { RHFMultiSelect, RHFSelect } from './rhf-select'
import { RHFSlider } from './rhf-slider'
import { RHFMultiSwitch, RHFSwitch } from './rhf-switch'
import { RHFTextField } from './rhf-text-field'
import { RHFUploadAvatar } from './rhf-upload'

// ----------------------------------------------------------------------

export const Field = {
  Select: RHFSelect,
  Switch: RHFSwitch,
  Slider: RHFSlider,
  Rating: RHFRating,
  Text: RHFTextField,
  Checkbox: RHFCheckbox,
  RadioGroup: RHFRadioGroup,
  MultiSelect: RHFMultiSelect,
  MultiSwitch: RHFMultiSwitch,
  Autocomplete: RHFAutocomplete,
  MultiCheckbox: RHFMultiCheckbox,
  UploadAvatar: RHFUploadAvatar,
  PhoneInput: RHFPhoneInput,
  // Pickers
  DatePicker: RHFDatePicker,
  TimePicker: RHFTimePicker,
  DateTimePicker: RHFDateTimePicker,
  CountrySelect: RHFCountrySelect,
}
