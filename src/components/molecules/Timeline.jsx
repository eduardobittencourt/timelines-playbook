import React from 'react'
import { format } from 'date-fns'
import { Typography } from '@material-ui/core'
import {
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@material-ui/lab'
import {
  AssistantPhoto,
  Assignment,
  Visibility,
  HowToReg
} from '@material-ui/icons'

const StepIcon = ({ step }) => {
  switch (step) {
    case 'Kickoff':
      return <AssistantPhoto />
    case 'Internal Briefing':
      return <Assignment />
    case 'Review 1':
    case 'Review 2':
      return <Visibility />
    case 'Client Feedback 1':
    case 'Client Feedback 2':
      return <HowToReg />
    default:
      return <Assignment />
  }
}

const Timeline = ({ dates }) => {
  return (
    <MuiTimeline align="alternate">
      {Object.entries(dates).map(([key, value], index) => {
        const [month, day, year] = value.split('/')
        return (
          <TimelineItem key={key}>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <StepIcon step={key} />
              </TimelineDot>
              {index < Object.keys(dates).length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography>{key}</Typography>
              <Typography variant="h6" component="h1">
                {format(new Date(year, month, day), 'PPP')}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </MuiTimeline>
  )
}

export default Timeline
