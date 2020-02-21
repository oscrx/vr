'use strict'

const fs = require('fs')
const moment = require('moment')
const nodemailer = require('nodemailer')
const PDFDocument = require('./handlers/pdfkit-tables')
const doc = new PDFDocument()
moment.locale('nl')

const buffers = []
doc.on('data', buffers.push.bind(buffers))
doc.on('end', () => {
  const pdfData = Buffer.concat(buffers)

  // ... now send pdfData as attachment ...
  const transporter = nodemailer.createTransport({
    host: 'mybit-smtp01.local.mybit.nl',
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  })

  const info = transporter.sendMail({
    from: '"Virtualisatie Rapport" <vr@local.mybit.nl>', // sender address
    to: 'djamon.staal@mybit.nl', // list of receivers
    subject: 'Virtualisatie Rapport - ' + moment().format('DD MMMM YYYY'), // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
    attachments: [{ // encoded string as an attachment
      filename: moment().format('YYYYMMDD') + '-photo-motion.pdf',
      content: pdfData
    }]
  })
})

doc.image('images/logos/photo-motion-logo.jpg', 22, 10, {
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
doc.text('Partner: Photo-Motion', 49, 140)
doc.text('Gemaakt op: ' + moment().format('DD MMMM YYYY'), 49, 155)

doc.fontSize(16)
doc.fillColor('red')
doc.moveDown().text('Service Level Agreement')

doc.fontSize(12)
doc.fillColor('black')

const table0 = {
  headers: ['Omgeving', 'vCPU \n(used / SLA)', 'RAM \n(used / SLA)', 'Disk (GB) \n(used / SLA)', 'Storage (TB) \n(used / SLA)'],
  rows: [
    ['Testomgeving*', '16 / 16', '19 / 19', '250 / 250', '2 / 1'],
    ['Acceptatieomgeving*', '19 / 16', '19 / 19', '230 / 250', '2 / 1'],
    ['Productieomgeving*', '20 / 20', '32 / 32', '140 / 250', '10 / 10'],
    ['Totaal', '55 / 52', '70 / 70', '620 / 750', '14 / 12']
  ]
}

doc.moveDown().table(table0, {
  prepareHeader: () => doc.font('Helvetica-Bold'),
  prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
})

doc.moveDown().text('* Dit is een optelsom van de toegekende resources van de online VM’s.', 49)

doc.addPage()

doc.image('images/logos/photo-motion-logo.jpg', 22, 10, {
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
doc.text('Testomgeving', 49, 145)

doc.fontSize(12)
doc.fillColor('black')

const table1 = {
  headers: ['VM', 'Status', 'vCPU', 'RAM', 'Disk', 'Storage'],
  rows: [
    ['Premotion-web01-test', 'Online', '2', '2', '50 GB', '1 TB'],
    ['Premotion-web02-test', 'Online', '1', '1', '30 GB', '0 TB'],
    ['Premotion-job01-test', 'Online', '4', '4', '30 GB', '0 TB'],
    ['Photomotion-web01-test', 'Online', '2', '4', '50 GB', '0 TB'],
    ['Photomotion-job01-test', 'Online', '4', '4', '30 GB', '0 TB'],
    ['Photomotion-db01-test', 'Online', '2', '2', '30 GB', '0 TB'],
    ['Photomotion-cdn01-test', 'Online', '1', '2', '30 GB', '1 TB']
  ]
}

doc.moveDown().table(table1, {
  prepareHeader: () => doc.font('Helvetica-Bold'),
  prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
})

doc.addPage()

doc.image('images/logos/photo-motion-logo.jpg', 22, 10, {
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
doc.text('Acceptatieomgeving', 49, 145)

doc.fontSize(12)
doc.fillColor('black')

const table2 = {
  headers: ['VM', 'Status', 'vCPU', 'RAM', 'Disk', 'Storage'],
  rows: [
    ['Premotion-web01-acc', 'Online', '4', '4', '30 GB', '1 TB'],
    ['Premotion-web01-acc-old', 'Offline', '1', '1', '50 GB', '0 TB'],
    ['Premotion-job01-acc', 'Online', '4', '4', '30 GB', '0 TB'],
    ['Photomotion-web01-acc', 'Online', '4', '4', '30 GB', '0 TB'],
    ['Photomotion-job01-acc', 'Online', '4', '4', '30 GB', '0 TB'],
    ['Photomotion-db01-acc', 'Online', '2', '2', '30 GB', '0 TB'],
    ['Photomotion-cdn01-acc', 'Online', '1', '1', '30 GB', '1 TB']
  ]
}

doc.moveDown().table(table2, {
  prepareHeader: () => doc.font('Helvetica-Bold'),
  prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
})

doc.addPage()

doc.image('images/logos/photo-motion-logo.jpg', 22, 10, {
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
doc.text('Productieomgeving', 49, 145)

doc.fontSize(12)
doc.fillColor('black')

const table3 = {
  headers: ['VM', 'Status', 'vCPU', 'RAM', 'Disk', 'Storage'],
  rows: [
    ['Premotion-web01', 'Online', '10', '16', '30 GB', '10 TB'],
    ['Premotion-web01-old', 'Offline', '2', '2', '50 GB', '0 TB'],
    ['Premotion-web01-shadow', 'Offline', '4', '4', '30 GB', '0 TB'],
    ['Premotion-job01', 'Online', '10', '16', '30 GB', ' 0 TB']
  ]
}

doc.moveDown().table(table3, {
  prepareHeader: () => doc.font('Helvetica-Bold'),
  prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
})

doc.end()
