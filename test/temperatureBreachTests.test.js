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

    it('should call sendToController for TOO_HIGH breach', () => {
    alerts.checkAndAlert('TO_CONTROLLER', { coolingType: 'MED_ACTIVE_COOLING' }, 44);
    console.log(sendToControllerStub.calledOnce); 
    console.log(sendToControllerStub.args);      
    expect(sendToControllerStub.calledOnce).to.be.true;
    expect(sendToControllerStub.calledWith('TOO_HIGH')).to.be.true;
  });

  it('should call sendToEmail for TOO_LOW breach', () => {
    alerts.checkAndAlert('TO_EMAIL', { coolingType: 'PASSIVE_COOLING' }, -10);
    console.log(sendToEmailStub.calledOnce); 
    console.log(sendToEmailStub.args);      
    expect(sendToEmailStub.calledOnce).to.be.true;
    expect(sendToEmailStub.calledWith('TOO_LOW')).to.be.true;
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
