import { useState } from 'react'
import { AppBar, Container, Toolbar, Typography, Button, TextField, Select, MenuItem, Grid, FormControl, FormLabel, Paper } from '@material-ui/core'
import { useForm, Controller } from "react-hook-form"
import { format, addBusinessDays } from 'date-fns'
import { getColumns } from '../libs/sheets';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from '@material-ui/core/styles';

export default function IndexPage({ data }) {
  const [name, setName] = useState(null)
  const [dates, setDates] = useState(null)
  const { handleSubmit, control } = useForm()

  const onSubmit = handleSubmit(values => {
    const { date, project } = values
    const { name, ...baseProject } = data[project]

    const result = Object.entries(baseProject).reduce((acc, [key, value]) => {
      const newDate = format(addBusinessDays(date, value), 'dd/MM/yyyy')
      return { ...acc, [key]: newDate }
    }, {})

    setName(values.name)
    setDates(result)
  })

  const classes = useStyles()

  return <>
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6">
          Pravy
        </Typography>
      </Toolbar>
    </AppBar>
    <Container>
      <form onSubmit={onSubmit}>
        <Paper  className={classes.paper}>
            <Grid container spacing={3} alignItems='flex-end'>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel>Name</FormLabel>
                  <Controller as={TextField} name="name" control={control} fullWidth />
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
                          "aria-label": "change date"
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
                        {Object.keys(data).map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                      </Select>
                    }
                    name="project"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' color='primary' type="submit">Submit</Button>
              </Grid>
            </Grid>
        </Paper>
      </form>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h3'>{name}</Typography>
          </Grid>
          {dates && Object.entries(dates).map(([key, value]) => {
            return <Grid item xs={12} key={key}>
              <Typography>{key}: {value}</Typography>
            </Grid>
          })}
        </Grid>
      </Paper>
    </Container>
  </>
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: 40
  },
  paper: {
    marginTop: 40,
    padding: 20
  }
}));

export async function getStaticProps() {
  const rows = await getColumns();
  const [headers, ...content] = rows

  const result = content.reduce((acc, row) => {
    const [key, ...values] = row
    return { ...acc, [key]: values }
  }, {})

  const final = headers.reduce((acc, header, index) => {
    if (header) {
      return {
        ...acc,
        [header]: Object.entries(result).reduce((acc2, [key, value]) => ({ ...acc2, [key]: +value[index - 1] }), {})
      }
    }
  }, {})

  return {
    props: {
      data: final
    },
    revalidate: 1,
  };
}