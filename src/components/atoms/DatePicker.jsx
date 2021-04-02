import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import { Controller } from 'react-hook-form'
import DateFnsUtils from '@date-io/date-fns'

const DatePicker = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        render={({ ref, ...rest }) => (
          <KeyboardDatePicker
            fullWidth
            margin="none"
            format="dd/MM/yyyy"
            {...props}
            {...rest}
          />
        )}
        {...props}
      />
    </MuiPickersUtilsProvider>
  )
}

export default DatePicker
