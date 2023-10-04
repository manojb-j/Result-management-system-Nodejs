const express= require('express');
const router = express.Router();
const customerController = require('../controllers/customerController')



// router.get('/', customerController.mainpage);

router.get('/dashboard', customerController.homepage);

router.get('/', customerController.login);
router.post('/login', customerController.loginAuth);

router.get('/login', customerController.logout);

// app.get('/', (req, res) => {
//     res.render('login');
//   });

router.get('/add', customerController.addCustomer);
router.post('/add', customerController.postCustomer);

router.get('/view/:id', customerController.view);
router.get('/edit/:id', customerController.edit);
router.put('/edit/:id', customerController.editPost);
router.delete('/edit/:id', customerController.deleteCustomer);

router.get('/search', customerController.studentSearch);
router.post('/search', customerController.search);
router.get('/error', customerController.error);



module.exports = router;