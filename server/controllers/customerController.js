const Customer = require('../models/Customer');
const mongoose = require('mongoose');


// get home page

exports.homepage = async (req, res) => {

    const locals = {
        title: 'Student result managment',
        description: 'Student result managment'
    }

    try {
        const customers = await Customer.find({}).limit(22);
        res.render('index', { locals, customers });
    } catch (error) {
        console.log(error);
    }

}


// get mainhome page

exports.mainpage = async (req, res) => {

    const locals = {
        title: 'Student result managment - main login page',
        description: 'Student result managment'
    }

    try {
        res.render('customer/mainPage', locals);
    } catch (error) {
        console.log(error);
    }

}


// render login page

exports.login = async (req, res) => {

    const locals = {
        title: 'Student result managment - login ',
        description: 'Student result managment'
    }

    try {
        res.render('customer/login', locals);
    } catch (error) {
        console.log(error);
    }

}

exports.loginAuth = (req, res) => {
    const users = [
        {
          username: 'teacher1',
          password: 'password',
          usertype: 'teacher',
        },
        {
          username: 'student1',
          password: 'password',
          usertype: 'student',
        },
      ];
      
      const { username, password, usertype } = req.body;

      // Find the user by username and usertype
      const user = users.find((u) => u.username === username && u.usertype === usertype);
    
      // Check if the user exists and the password is correct
      if (user && user.password === password) {
        req.session.authenticated = true;
        req.session.usertype = usertype; // Store user type in the session
    
        // Redirect based on usertype
        if (usertype === 'teacher') {
          res.redirect('/dashboard');
        } else if (usertype === 'student') {
          res.redirect('/search');
        }
      } else {
        const locals = {
            errorMessage: 'plase enter the valid username and password and userType',
            
        };
        res.render('customer/login', locals);
      }
};


// render loginout page

exports.logout = async (req, res) => {

    const locals = {
        title: 'Student result managment - logOut ',
        description: 'Student result managment'
    }

    try {
        req.session.destroy();
        res.redirect('customer/login', locals);
    } catch (error) {
        console.log(error);
    }

}

// get new customer form

exports.addCustomer = async (req, res) => {

    const locals = {
        title: 'Student result managment - add new customer',
        description: 'Student result managment'
    };

    res.render('customer/add', locals);
}




exports.postCustomer = async (req, res) => {
    console.log(req.body);

    const DOB = new Date(req.body.dob);

    // Input validation
    const locals = {
        errorMessage: '',
        message: '',
    };

    if (isNaN(req.body.rollNo) || typeof req.body.name !== 'string' || isNaN(DOB) || isNaN(req.body.score)) {
        const locals = {
            errorMessage: 'plase provide a valid input ',
        };
        console.log('plase provide a valid input ');
        res.render('customer/add', locals);
        return;
    } else {
        const newCustomer = new Customer({
            rollNo: req.body.rollNo,
            name: req.body.name,
            dob: DOB,
            score: req.body.score,
        });

        try {
            
            await Customer.create(newCustomer);
            res.redirect('/dashboard');
        } catch (error) {
            // console.log(error);
            console.log('error message');
            locals.errorMessage = 'Error creating customer. Please try again later.';
        }
    }


};




// get customer data for view

exports.view = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'Student result managment - view customer data',
            description: 'Student result managment'
        };

        res.render('customer/view', {
            locals,
            customer
        })

    } catch (error) { 
        const locals = {
            errorMessage: 'plase provide a valid information',
            
        };
        console.log("error from view page");
        res.redirect('customer/view',locals);
      }
      
}



// edit customer data

exports.edit = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'Student result managment - edit customer data',
            description: 'Student result managment'
        };

        res.render('customer/edit', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }
}


// update customer data

exports.editPost = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            rollNo: req.body.rollNo,
            name: req.body.name,
            dob: req.body.dob,
            score: req.body.score,
            updatedAt: Date.now()
        });
        await res.redirect(`/edit/${req.params.id}`);

        console.log('redirected');
    } catch (error) {
        console.log(error);
    }
}


/**
* Delete /
* Delete Customer Data 
*/
exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.deleteOne({ _id: req.params.id });
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error);
    }
}



//  student seach page

exports.studentSearch = async (req, res) => {

    const locals = {
        title: 'Student result managment - student seach ',
        description: 'Student result managment'
    }

    try {
        res.render('customer/studentSearch', locals);
    } catch (error) {
        console.log("error on the seach page rendering");
    }

}


// seaching the student
exports.search = async (req, res) => {
    const { rollno, dob } = req.body;

    try {
        const customer = await Customer.findOne({ 
            $and: [
                { rollNo: rollno },
                { dob: dob } // Additional criteria
            ]
        });

        const locals = {
            title: 'Student result managment - search student Data',
            description: 'Student result managment',
            customer
        };

        // Check if customer is found, if not, set an error message
        if (!customer) {
            const locals = {
                errorMessage: 'plase enter the valid information of the student',
                
            };
            res.render('customer/studentSearch.ejs', locals);
            
        } else{
            
            res.render('customer/view', locals);
            // res.send("error")
            console.log("eror in search page");
        }
    } catch (error) {
        const locals = {
            title: 'Student result managment',
            description: 'Student result managment',
            errorMessage: 'An error occurred. Please try again later.'
        };
        res.render('customer/search', locals);
        console.error("Error in search page:", error);
    }
};

// error page

exports.error = async (req, res) => {

    const locals = {
        title: 'Error',
        description: 'free nodejs user managemnt system'
    };

    res.render('customer/error', locals);
}