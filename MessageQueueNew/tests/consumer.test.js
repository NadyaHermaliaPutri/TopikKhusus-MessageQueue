const { sendEmail, sendSms, sendFcm } = require('../consumer/actions');

describe('consumer actions', () => {
  it('sendEmail should not throw', () => {
    expect(() => sendEmail({ content: 'hello' })).not.toThrow();
  });
  it('sendSms should not throw', () => {
    expect(() => sendSms({ content: 'hello' })).not.toThrow();
  });
  it('sendFcm should not throw', () => {
    expect(() => sendFcm({ content: 'hello' })).not.toThrow();
  });
});
