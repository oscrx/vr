const rp = require('request-promise')
const getNetboxData = async (path, method) => {
  const options = {
    uri: process.env.NETBOX_URI + path,
    method: method || 'get',
    headers: {
      accept: 'application/json',
      Authorization: 'Token ' + process.env.NETBOX_TOKEN
    },
    json: true // Automatically parses the JSON string in the response
  }
  const response = await rp(options)
  // console.log(response)
  return response
}

module.exports = getNetboxData
