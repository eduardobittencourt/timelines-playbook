import { useEffect, useRef, useState } from 'react'
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
  Link,
  Box
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { useForm, FormProvider } from 'react-hook-form'
import { format, addBusinessDays } from 'date-fns'
import ReactToPrint from 'react-to-print'

import { TextField, DatePicker, Select } from '../components/atoms'
import { Timeline } from '../components/molecules'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3)
  },
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3, 4)
  },
  secondButton: {
    marginLeft: theme.spacing(1)
  }
}))

const IndexPage = () => {
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [snackbar, setSnackbar] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const printable = useRef(null)
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
            <Typography variant="h6">Welcome!</Typography>
            <Typography>
              Hey, welcome to our Timeline Calculator, please fill in all the
              fields to receive your full timeline. You can check the previous
              data{' '}
              <Link
                href="https://docs.google.com/spreadsheets/d/1nbGV2WtWFmDqvMWSFB3AglE8j0LFQGTvBPNI39RpJsk"
                target="_blank"
                rel="noreferrer"
              >
                <b>here</b>
              </Link>
              .
            </Typography>
            <Typography>
              It is nice to remember that those dates are calculated based on
              our Playbook's Standard Timeline.
            </Typography>
          </Paper>
          <Paper className={classes.paper}>
            <Typography variant="h6">Job Informations</Typography>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <TextField
                      name="name"
                      placeholder="Job Title"
                      label="Job Title"
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
                    <Button
                      color="primary"
                      type="button"
                      onClick={() =>
                        methods.reset({ name: null, type: null, date: null })
                      }
                      className={classes.secondButton}
                    >
                      Clear values
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Paper>
          {result && (
            <Paper className={classes.paper} ref={printable}>
              <Typography variant="h6" align="center">
                {result.name}
              </Typography>
              <Typography align="center">{result.deliverable}</Typography>
              <Timeline dates={result.dates} />
              <Box displayPrint="none">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={saveResult}
                  disabled={loadingPost}
                >
                  {loadingPost ? 'Submitting' : 'Save Result'}
                </Button>
                <ReactToPrint
                  trigger={() => (
                    <Button
                      type="button"
                      color="primary"
                      className={classes.secondButton}
                    >
                      Save PDF
                    </Button>
                  )}
                  content={() => printable.current}
                />
              </Box>

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
