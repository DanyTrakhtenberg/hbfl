// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk')
AWS.config.update({region:'eu-north-1'})

// TODO: Configure region

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new AWS.EC2()

function listInstances () {
  return new Promise((resolve, reject) => {
    ec2.describeInstances({}, (err, data) => {
      if (err) reject(err)
      else {
        resolve(data.Reservations.reduce((i, r) => {
          return i.concat(r.Instances)
        }, []))
      }
    })
  })
}

function terminateInstance (instanceId) {
  const params = {
    InstanceIds: [
      instanceId
    ]
  }

  return new Promise((resolve, reject) => {
    ec2.terminateInstances(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}


listInstances()
.then(data => console.log(data))
// terminateInstance('i-03614f9ae9a461ded')
// .then(data => console.log(data))
