// check_mk script to check TCP connections to a remote host.
// written to report netbox resources monthly per tenant in pdf.
// Djamon Staal <djamon.staaal@mybit.nl> - 2020

// Import Modules
const axios = require('axios')
const moment = require('moment');

// Load config
try {
  var config = require('./config');
} catch (e) {
  return console.log("Fatal Error: Faild to load the config file.")
}

var fullVmList;

// Start the service
getNetboxData('/api/virtualization/virtual-machines/?limit=5', 'get')
  .then(res => fullVmList = res)



async function getNetboxData(uri, method) {
  try {
    let res = await axios({
      url: config.netbox_uri + uri,
      method: 'get',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Token ' + config.netbox_token
      }
    })
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res.status)
    }
    // Don't forget to return something
    return res.data
  } catch (err) {
    console.error(err);
  }
}
