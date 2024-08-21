const COOLING_LIMITS = {
  PASSIVE_COOLING: { lower: 0, upper: 35 },
  HI_ACTIVE_COOLING: { lower: 0, upper: 45 },
  MED_ACTIVE_COOLING: { lower: 0, upper: 40 }
};

function inferBreach(value, lowerLimit, upperLimit) {
  if (value < lowerLimit) {
    return 'TOO_LOW';
  }
  if (value > upperLimit) {
    return 'TOO_HIGH';
  }
  return 'NORMAL';
}

function getCoolingLimits(coolingType) {
  return COOLING_LIMITS[coolingType] || { lower: 0, upper: 0 }; // Default limits
}

function classifyTemperatureBreach(coolingType, temperatureInC) {
  const { lower, upper } = getCoolingLimits(coolingType);
  return inferBreach(temperatureInC, lower, upper);
}

function checkAndAlert(alertTarget, batteryChar, temperatureInC) {
  const breachType = classifyTemperatureBreach(batteryChar['coolingType'], temperatureInC);
  sendAlert(alertTarget, breachType);
}

function sendAlert(alertTarget, breachType) {
  switch (alertTarget) {
    case 'TO_CONTROLLER':
      sendToController(breachType);
      break;
    case 'TO_EMAIL':
      sendToEmail(breachType);
      break;
    default:
      console.error('Unknown alert target');
  }
}

function sendToController(breachType) {
  const header = 0xfeed;
  console.log(`${header}, ${breachType}`);
}

function sendToEmail(breachType) {
  const recipient = 'a.b@c.com';
  let message = '';
  if (breachType === 'TOO_LOW') {
    message = 'Hi, the temperature is too low';
  } else if (breachType === 'TOO_HIGH') {
    message = 'Hi, the temperature is too high';
  }
  
  if (message) {
    console.log(`To: ${recipient}`);
    console.log(message);
  }
}

module.exports = {
  inferBreach,
  classifyTemperatureBreach,
  checkAndAlert,
  sendToController,
  sendToEmail
};
