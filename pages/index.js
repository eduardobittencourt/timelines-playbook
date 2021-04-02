import { useEffect, useState } from 'react'
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  FormControl,
  FormLabel,
  Paper
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { format, addBusinessDays } from 'date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

export default function IndexPage() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState(null)
  const [dates, setDates] = useState(null)
  const [project, setProject] = useState(null)
  const { handleSubmit, control } = useForm()

  const onSubmit = handleSubmit(values => {
    const { date, project } = values

    const timmings = Object.entries(project).reduce((acc, [key, value]) => {
      if (key === 'Deliverable') {
        return acc
      }
      return { ...acc, [key]: value }
    }, {})

    const result = Object.entries(timmings).reduce((acc, [key, value]) => {
      const newDate = format(addBusinessDays(date, value), 'MM/dd/yyyy')
      return { ...acc, [key]: newDate }
    }, {})

    setName(values.name)
    setProject(project.Deliverable)
    setDates(result)
  })

  const submit = () => {
    axios.post('/api/sheet', { name, dates, project })
  }

  useEffect(() => {
    const call = async () => {
      const { data } = await axios.get('/api/sheet')
      setProjects(data)
    }

    call()
  }, [])

  const classes = useStyles()

  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Standard Timelines - Playbook</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <form onSubmit={onSubmit}>
          <Paper className={classes.paper}>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel>Name</FormLabel>
                  <Controller
                    as={TextField}
                    name="name"
                    control={control}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ ref, ...rest }) => (
                      <KeyboardDatePicker
                        fullWidth
                        margin="none"
                        id="date-picker-dialog"
                        label="Kickoff"
                        format="dd/MM/yyyy"
                        KeyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                        {...rest}
                      />
                    )}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel>Project Type</FormLabel>
                  <Controller
                    as={
                      <Select fullWidth>
                        {projects &&
                          projects.map(project => (
                            <MenuItem key={project.Deliverable} value={project}>
                              {project.Deliverable}
                            </MenuItem>
                          ))}
                      </Select>
                    }
                    name="project"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3">{name}</Typography>
            </Grid>
            {dates &&
              Object.entries(dates).map(([key, value]) => {
                return (
                  <Grid item xs={12} key={key}>
                    <Typography>
                      {key}: {value}
                    </Typography>
                  </Grid>
                )
              })}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={submit}
          >
            Save
          </Button>
        </Paper>
      </Container>
    </>
  )
}

const useStyles = makeStyles(() => ({
  appBar: {
    marginBottom: 40
  },
  paper: {
    marginTop: 40,
    padding: 20
  }
}))
