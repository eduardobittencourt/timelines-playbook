import { GoogleSpreadsheet } from 'google-spreadsheet'

export default async function (req, res) {
  const doc = await new GoogleSpreadsheet(process.env.SPREADSHEET_ID)
  await doc.useServiceAccountAuth({
    client_email: process.env.SPREADSHEET_CLIENT_EMAIL,
    private_key: process.env.SPREADSHEET_PRIVATE_KEY
  })

  await doc.loadInfo()

  const { config, database } = doc.sheetsByTitle

  switch (req.method) {
    case 'GET':
      await config.loadHeaderRow()
      const headers = config.headerValues

      const rows = await config.getRows()

      const data = rows.map(data =>
        headers.reduce(
          (acc, header) => ({ ...acc, [header]: data[header] }),
          {}
        )
      )

      res.send(data)
      break
    case 'POST':
      const obj = {
        'Project Name': req.body.name,
        Deliverable: req.body.project,
        ...req.body.dates
      }

      await database.addRow(obj)
      res.send({ status: 200 })
  }
}
