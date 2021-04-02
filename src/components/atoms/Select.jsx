import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Controller } from 'react-hook-form'

const Select = ({ loading, ...props }) => {
  return (
    <Controller
      render={RHFProps => (
        <Autocomplete
          {...RHFProps}
          {...props}
          loading={loading}
          getOptionLabel={option => option.Deliverable}
          renderInput={params => <TextField {...props} {...params} />}
          onChange={(_, data) => RHFProps.onChange(data)}
        />
      )}
      {...props}
    />
  )
}

export default Select
