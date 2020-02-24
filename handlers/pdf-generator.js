// Import Modules
const moment = require('moment')
const PDFDocument = require('./pdfkit-tables')
const {SlaTable, UsageTable} = require('./table-formatting')
moment.locale('nl')

const PdfGenerator = (tenant) => {
  const finalPdf = new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const buffers = []
    const fileName = tenant.slug + moment().format('-YYYYMMDD') + '.pdf'

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      const pdfData = {
        filename: fileName,
        content: Buffer.concat(buffers)
      }
      resolve(pdfData)
    })
    // TODO: Fallback on tenant logo
    doc.image(tenant.logo, 22, 10, {
      fit: [175, 100],
      align: 'center',
      valign: 'center'
    })

    doc.image('images/logos/mybit-logo.png', 418, 10, {
      fit: [175, 100],
      align: 'center',
      valign: 'center'
    })

    doc.fontSize(16)
    doc.fillColor('red')
    doc.text('Virtualisatie Rapport', 49, 120)

    doc.fontSize(12)
    doc.fillColor('black')
    doc.text('Partner: ' + tenant.name, 49, 140)
    doc.text('Gemaakt op: ' + moment().format('DD MMMM YYYY'), 49, 155)

    doc.fontSize(16)
    doc.fillColor('red')
    doc.moveDown().text('Service Level Agreement')

    doc.fontSize(12)
    doc.fillColor('black')

    const table0 = {
      headers: ['Omgeving', 'vCPU \n(used / SLA)', 'RAM (GB) \n(used / SLA)', 'Disk (GB) \n(used / SLA)', 'Storage (TB) \n(used / SLA)'],
      rows: SlaTable(tenant)
    }

    doc.moveDown().table(table0, {
      prepareHeader: () => doc.font('Helvetica-Bold'),
      prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
    })

    doc.moveDown().text('* Dit is een optelsom van de toegekende resources van de online VM’s.', 49)

    const pages = UsageTable(tenant)

    for (const item in pages) {
      doc.addPage()

      doc.image(tenant.logo, 22, 10, {
        fit: [175, 100],
        align: 'center',
        valign: 'center'
      })

      doc.image('images/logos/mybit-logo.png', 418, 10, {
        fit: [175, 100],
        align: 'center',
        valign: 'center'
      })

      doc.fontSize(16)
      doc.fillColor('red')
      doc.text('Virtualisatie Rapport', 49, 120)

      doc.fontSize(13)
      doc.fillColor('#2F5496')
      doc.text(item, 49, 145)

      doc.fontSize(12)
      doc.fillColor('black')

      const table1 = {
        headers: ['VM', 'Status', 'vCPU', 'RAM', 'Disk', 'Storage'],
        rows: pages[item]
      }

      doc.moveDown().table(table1, {
        prepareHeader: () => doc.font('Helvetica-Bold'),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
      })
    }

    doc.end()
  })

  return finalPdf
}

module.exports = PdfGenerator
