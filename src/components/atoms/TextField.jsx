import { TextField as MuiTextField } from '@material-ui/core'
import { useFormContext } from 'react-hook-form'

const TextField = props => {
  const { register } = useFormContext()
  return <MuiTextField inputRef={register} fullWidth {...props} />
}

export default TextField
