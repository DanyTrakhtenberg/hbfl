// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-north-1' })

// Declare local variables
const autoScaling = new AWS.AutoScaling()
const asgName = 'hamsterASG'
const lcName = 'hamsterLC'
const policyName = 'hamsterPolicy'
const tgArn = 'arn:aws:elasticloadbalancing:eu-north-1:890936836623:targetgroup/hamsterTG/8340834a2bcc020e'

createAutoScalingGroup(asgName, lcName)
.then(() => createASGPolicy(asgName, policyName))
.then((data) => console.log(data))

function createAutoScalingGroup (asgName, lcName) {
  const params = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: [
      'eu-north-1a',
      'eu-north-1c'
    ],
    TargetGroupARNs: [
      tgArn
    ],
    LaunchConfigurationName: lcName,
    MaxSize: 2,
    MinSize: 1
  }

  return new Promise((resolve, reject) => {
    autoScaling.createAutoScalingGroup(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function createASGPolicy (asgName, policyName) {
  const params = {
    AdjustmentType: 'ChangeInCapacity',
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: 'TargetTrackingScaling',
    TargetTrackingConfiguration: {
      TargetValue: 5,
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'ASGAverageCPUUtilization'
      }
    }
  }

  return new Promise((resolve, reject) => {
    autoScaling.putScalingPolicy(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
