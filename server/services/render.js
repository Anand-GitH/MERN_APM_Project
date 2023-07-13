const axios = require('axios');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
<<<<<<< Updated upstream
    console.log("Inside homeroutes");
    axios.get('http://localhost:3000/api/users')
=======
    axios.get('http://merninstance.oracle.com:3000/api/users')
>>>>>>> Stashed changes
        .then(function(response){
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.add_user = (req, res) =>{
    console.log("add user");
    res.render('add_user');
}

exports.update_user = (req, res) =>{
<<<<<<< Updated upstream
    console.log("update user");
    axios.get('http://localhost:3000/api/users', { params : { id : req.query.id }})
=======
    axios.get('http://merninstance.oracle.com:3000/api/users', { params : { id : req.query.id }})
>>>>>>> Stashed changes
        .then(function(userdata){
            res.render("update_user", { user : userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}
