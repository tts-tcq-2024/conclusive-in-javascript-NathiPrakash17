const alerts = require('../src/temperatureBreachChecker');
const { expect } = require('chai');
const sinon = require('sinon');

describe('checkAndAlert Function Tests', () => {
  let sendToEmailStub;

  beforeEach(() => {
    sendToEmailStub = sinon.stub(alerts, 'sendToEmail');
  });

  afterEach(() => {
    sinon.restore();
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
