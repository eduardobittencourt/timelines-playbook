import styled from "styled-components"
import { format, addBusinessDays } from 'date-fns'
import { useForm } from "react-hook-form"
import { useState } from "react"

const Dates = () => {
  const [name, setName] = useState(null)
  const [dates, setDates] = useState(null)

  console.log(dates)

  const types = {
    LMP: {
      name: 'Long Multi-Pager',
      IB: 1,
      R1: 6,
      C1: 9,
      R2: 11,
      C2: 14
    },
    MMP: {
      name: 'Medium Multi-Pager',
      IB: 1,
      R1: 4,
      C1: 6,
      R2: 8,
      C2: 11
    },
    OS: {
      name: 'One-Sheeters',
      IB: 1,
      R1: 3,
      C1: 4,
      R2: 5,
      C2: 6
    },
    LP: {
      name: 'Long Presentation',
      IB: 1,
      R1: 6,
      C1: 9,
      R2: 11,
      C2: 14
    },
    MP: {
      name: 'Medium Presentation',
      IB: 1,
      R1: 5,
      C1: 8,
      R2: 10,
      C2: 12
    },
    SP: {
      name: 'Small Presentation',
      IB: 1,
      R1: 4,
      C1: 6,
      R2: 8,
      C2: 10
    },
    ST: {
      name: 'Splash That',
      IB: 1,
      R1: 6,
      C1: 9,
      R2: 11,
      C2: 14
    },
    LER: {
      name: 'Low Effort Requests',
      IB: 1,
      R1: 3,
      C1: 4,
      R2: 5,
      C2: 6
    },
    EM: {
      name: 'E-mail Marketing',
      IB: 1,
      R1: 3,
      C1: 4,
      R2: 5,
      C2: 6
    },
    ADS: {
      name: 'Ads',
      IB: 1,
      R1: 3,
      C1: 4,
      R2: 5,
      C2: 6
    },
  }

  const { handleSubmit, register } = useForm()

  const onSubmit = handleSubmit(values => {
    const {date, project} = values
    const [year, month, day] = date.split('-')
    const baseDate = new Date(year, month - 1, day)
    const { name, ...baseProject } = types[project]
    
    const result = Object.entries(baseProject).reduce((acc, [key, value]) => {
      const newDate = format(addBusinessDays(baseDate, value), 'dd/MM/yyyy')
      return {...acc, [key]: newDate}
    }, {})

    setName(values.name)
    setDates(result)
  })

  return <>
    <form onSubmit={onSubmit}>
      <label>
        <span>Project Name</span>
        <input type="text" name="name" ref={register} />
      </label>
      <label>
        <span>Kickoff</span>
        <input type="date" name="date" ref={register} />
      </label>
      <label>
        <span>Project Type</span>
        <select name="project" ref={register}>
          {Object.entries(types).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
    <div>
      <p>{name}</p>
      {dates && Object.entries(dates).map(([key, value]) => {
        return <p>{key}: {value}</p>
      })}
    </div>
  </>
}

export default Dates