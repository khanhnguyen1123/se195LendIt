let borrowController = require('./borrow/borrow-controller')

module.exports = function(app) {
   app.get('/api/borrow/get/:id', borrowController.readItem);
}