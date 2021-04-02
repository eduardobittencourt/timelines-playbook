import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Snackbar,
  Link
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { useForm, FormProvider } from 'react-hook-form'
import { format, addBusinessDays } from 'date-fns'

import { TextField, DatePicker, Select } from '../components/atoms'
import { Timeline } from '../components/molecules'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3)
  },
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3, 4)
  }
}))

const IndexPage = () => {
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [snackbar, setSnackbar] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const classes = useStyles()

  const methods = useForm({
    defaultValues: {
      name: '',
      date: null,
      type: null
    }
  })

  const onSubmit = methods.handleSubmit(({ name, date, type }) => {
    const { Deliverable, ...timmings } = type

    const dates = Object.entries(timmings).reduce(
      (acc, [key, value]) => {
        const newDate = format(addBusinessDays(date, value), 'MM/dd/yyyy')
        return { ...acc, [key]: newDate }
      },
      { Kickoff: format(date, 'MM/dd/yyyy') }
    )

    setResult({
      name,
      dates,
      deliverable: Deliverable
    })
  })

  const saveResult = async () => {
    try {
      setLoadingPost(true)
      const { data } = await axios.post('/api/sheet', result)
      setSnackbar(data)
    } catch {
      setSnackbar({ message: 'Something went wrong', severity: 'error' })
    } finally {
      setLoadingPost(false)
    }
  }

  useEffect(() => {
    const call = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/sheet')
        setDeliverables(data)
      } catch {
      } finally {
        setLoading(false)
      }
    }

    call()
  }, [])

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6">Standard Timelines - Playbook</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.container}>
          <Paper className={classes.paper}>
            <Typography variant="h6">About</Typography>
            <Typography>
              This application aims to assist in the calculation of the key
              dates of a project delivery, and to store the results in a
              specific spreadsheet.
            </Typography>
            <Typography>
              Date and project settings and previously calculated results are
              saved{' '}
              <Link
                href="https://docs.google.com/spreadsheets/d/1nbGV2WtWFmDqvMWSFB3AglE8j0LFQGTvBPNI39RpJsk"
                target="_blank"
                rel="noreferrer"
              >
                here
              </Link>
              .
            </Typography>
          </Paper>
          <Paper className={classes.paper}>
            <Typography variant="h6">Data</Typography>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <TextField
                      name="name"
                      placeholder="Project Name"
                      label="Project Name"
                      required
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <DatePicker name="date" label="Kickoff Date" required />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Select
                      name="type"
                      label="Deliverable"
                      options={deliverables}
                      loading={loading}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                      Generate result
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Paper>
          {result && (
            <Paper className={classes.paper}>
              <Typography variant="h6" align="center">
                {result.name}
              </Typography>
              <Typography align="center">{result.deliverable}</Typography>
              <Timeline dates={result.dates} />
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={saveResult}
                disabled={loadingPost}
              >
                {loadingPost ? 'Submitting' : 'Save Result'}
              </Button>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                open={!!snackbar}
                autoHideDuration={6000}
              >
                <Alert
                  elevation={6}
                  variant="filled"
                  onClose={() => setSnackbar(false)}
                  severity={snackbar.severity}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Paper>
          )}
        </Container>
      </main>
    </>
  )
}

export default IndexPage
