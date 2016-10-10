var User = require('../models/user');
var config = require('../../config');
var Story = require ('../models/story');
var secretKey = config.secretKey;
var jsonwebtoken = require ('jsonwebtoken');

/************************************************************************
* PASSWORD VERIFICATION
************************************************************************/
// this function for decrype id, name, and pass using secket key 
function createToken(user){
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user._name,
		username: user.username
	}, secretKey, {
		expirtesInMinute: 1440
	

	});

	return token;
}

module.exports = function(app, express){

	var api = express.Router();

	api.get('/all_stories',function(req,res){
		Story.find({}, function (err,stories){
			if (err){
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});


// user sign up 
	api.post('/signup', function (req,res){

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password

		});

        var token = createToken(user);
		user.save(function(err){
			if (err){
				res.send(err);
				return;
			}

			res.json({
				success: true,
				message: 'User has been created!',
				token: token
			});

		});
	});


// print all user in the database
    api.get('/users', function(req,res){
    	User.find({}, function(err,users){
    	if (err){
    		res.send(err);
    		return;
    	}
    	res.json(users);
    });

});


//login api
api.post('/login', function(req, res) {
//look up the database and find username and pass is correct
		User.findOne({ 
			username: req.body.username // get whatever the name that user was typing
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						token: token
					});
				}
			}
		});
	});



/************************************************************************
	* PASSWORD MIDDLEWARE
************************************************************************/
// check the token (middleware). using the authenticate technique for security
// above is the destinaiton A, after middleware check the token, and then user
// can go to destination B below .
api.use(function(req, res, next) {


		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];//enter x-access-token and paste the token to verify

		// check if token exist
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});

				} else {

					//
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});


// Destination B // provide a legitimate token

api.route('/')

		.post(function(req, res) {
          // create object story
			var story = new Story({
				creator: req.decoded.id,  // get the current id of user
				content: req.body.content, // request the body content for uer enter

			});
          // save whatever user enter in body contest
			story.save(function(err, newStory) {
				//if error return error to console
				if(err) {
					res.send(err);
					return
				}
			
				res.json({message: "New Story Created!"});
			});
		})

      // get all the story that have been created by user
		.get(function(req, res) {
            // find sotry of the current id 
			Story.find({ creator: req.decoded.id }, function(err, stories) {

				if(err) {
					res.send(err);
					return;
				}
              // print all the stories
				res.send(stories);
			});
		});

// separece api, so later we can fetch pacific user  
// data in middleware, and use them

api.get('/me', function(req, res) {
		res.send(req.decoded);
	});


    return api;




}