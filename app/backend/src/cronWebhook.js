const cron = require('node-cron');
const { processWebhookOrders } = require('./controllers/userCtrl');

if (global.__CRON_STARTED__) {
  module.exports = {};
  return;
}
global.__CRON_STARTED__ = true;



// Tạo fake req, res để gọi hàm
const fakeReq = { body: {}, query: {} };
const fakeRes = { 
  json: () => {}, 
  status: () => ({ json: () => {} }) 
};

// cron.schedule('*/15 * * * * *', async () => {
//   await processWebhookOrders(fakeReq, fakeRes);
//   console.log('Đã xử lý webhook lúc', new Date());
// });