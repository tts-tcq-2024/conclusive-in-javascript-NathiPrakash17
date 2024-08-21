const alerts = require('../src/temperatureBreachChecker');
const { expect } = require('chai');
const sinon = require('sinon');

describe('checkAndAlert Function Tests', () => {
  let sendToControllerStub;
  let sendToEmailStub;

  beforeEach(() => {
    sendToControllerStub = sinon.stub(alerts, 'sendToController');
    sendToEmailStub = sinon.stub(alerts, 'sendToEmail');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should log the correct message to the controller for TOO_HIGH breach', () => {
    let consoleOutput = [];
    const mockedLog = output => consoleOutput.push(output);

    console.log = mockedLog;
    alerts.checkAndAlert('TO_CONTROLLER', { coolingType: 'MED_ACTIVE_COOLING' }, 44);

    expect(consoleOutput).to.include('65261, TOO_HIGH');
    console.log = console.log;
  });

  it('should log the correct email message for TOO_LOW breach', () => {
    let consoleOutput = [];
    const mockedLog = output => consoleOutput.push(output);

    console.log = mockedLog;
    alerts.checkAndAlert('TO_EMAIL', { coolingType: 'PASSIVE_COOLING' }, -10);

    expect(consoleOutput).to.include('To: a.b@c.com');
    expect(consoleOutput).to.include('Hi, the temperature is too low');
    console.log = console.log;
  });
  
  it('should call sendToEmail for NORMAL temperature without issues', () => {
    alerts.checkAndAlert('TO_EMAIL', { coolingType: 'HI_ACTIVE_COOLING' },50);
    expect(sendToEmailStub.notCalled).to.be.true; 
  });

  it('should handle unknown alert target without throwing an error', () => {
    const consoleLogSpy = sinon.spy(console, 'log');
    alerts.checkAndAlert('UNKNOWN_TARGET', { coolingType: 'HI_ACTIVE_COOLING' }, 510);
    expect(consoleLogSpy.calledOnce).to.be.true;
    expect(consoleLogSpy.calledWith('Unknown alert target')).to.be.true;
    consoleLogSpy.restore();
  });
});
