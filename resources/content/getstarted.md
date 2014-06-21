### 1. Install the module:

`$ npm install passwordless --save`

Usually you also want to install a TokenStore such as [MongoStore](https://github.com/florianheinemann/passwordless-mongostore) and something to deliver the tokens.

`$ npm install passwordless-mongostore --save`

`$ npm install emailjs --save`

### 2. Require the needed modules
You will need:
* Passwordless
* A TokenStore to store the tokens such as [MongoStore](https://github.com/florianheinemann/passwordless-mongostore)
* Something to deliver the tokens such as [emailjs](https://github.com/eleith/emailjs) for email or [twilio](https://www.twilio.com/docs/node/install) for text messages / SMS

```javascript
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");
```

### 3. Setup your delivery
Depending on how you want to deliver your tokens, this could look like this for emailjs:
```javascript
var smtpServer  = email.server.connect({
   user:    yourEmail, 
   password: yourPwd, 
   host:    yourSmtp, 
   ssl:     true
});
```

### 4. Initialize Passwordless
`passwordless.init()` will take your TokenStore, which will store the generated tokens.
```javascript
// Your MongoDB TokenStore
var pathToMongoDb = 'mongodb://localhost/passwordless-simple-mail';
passwordless.init(new MongoStore(pathToMongoDb));
```

### 5. Tell Passwordless how to deliver a token
`passwordless.addDelivery(deliver)` adds a new delivery mechanism. `deliver` is called whenever a token has to be sent. By default, you should provide the user with a link in the following format:

`http://www.example.com/token=TOKEN&uid=UID`

That's how you could do this with emailjs:
```javascript
// Set up a delivery service
passwordless.addDelivery(
	function(tokenToSend, uidToSend, recipient, callback) {
		var host = 'localhost:3000';
		smtpServer.send({
			text:    'Hello!\nAccess your account here: http://' 
			+ host + '?token=' + tokenToSend + '&uid=' 
			+ encodeURIComponent(uidToSend), 
			from:    yourEmail, 
			to:      recipient,
			subject: 'Token for ' + host
		}, function(err, message) { 
			if(err) {
			console.log(err);
			}
			callback(err);
		});
});
```

### 6. Setup the middleware for express
```javascript
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken());
```

`sessionSupport()` makes the user login persistent, so the user will stay logged in. It has to come after your session middleware. Have a look at [express-session](https://github.com/expressjs/session) how to setup sessions if you are unsure.

`acceptToken()` will accept any incoming requests for tokens (see the URL in step 5). If you like, you could also restrict that to certain URLs.

### 7. The router
The following takes for granted that you've already setup your router `var router = express.Router();` as explained in the [express docs](http://expressjs.com/4x/api.html#router)

You will need at least URLs to:
* Display a page asking for people's email (or other medium)
* Receive the details (via POST) and identify the user

For example like this:
```javascript
/* GET login screen. */
router.get('/login', function(req, res) {
   res.render('login');
});

/* POST login details. */
router.post('/sendtoken', 
	passwordless.requestToken(
		// Turn the email address into an user ID
		function(user, delivery, callback) {
			// usually you would want something like:
			User.find({email: user}, callback(ret) {
			   if(ret)
			      callback(null, ret.id)
			   else
			      callback(null, null)
	      })
	      // but you could also do the following 
	      // if you want to allow anyone:
	      // callback(null, user);
		}),
	function(req, res) {
	   // success!
  		res.render('sent');
});
```

What happens here? `passwordless.requestToken(getUserId)` has two tasks: Making sure the email address exists *and* transforming it into a proper user ID that will become the identifier from now on. For example user@example.com becomes 123 or 'u1002'. You call `callback(null, ID)` if all is good, `callback(null, null)` if you don't know this email address, and `callback('error', null)` if something went wrong.

Most likely, you want a user registration page where you take an email address and any other user details and generate an ID. However, you can also simply accept any email address by skipping the lookup and just calling `callback(null, user)`.

If you have just a fixed list of users do the following:
```javascript
// GET login as above

var users = [
	{ id: 1, email: 'marc@example.com' },
	{ id: 2, email: 'alice@example.com' }
];

/* POST login details. */
router.post('/sendtoken', 
	passwordless.requestToken(
		function(user, delivery, callback) {
			for (var i = users.length - 1; i >= 0; i--) {
				if(users[i].email === user.toLowerCase()) {
				return callback(null, users[i].id);
				}
			}
			callback(null, null);
		}),
		function(req, res) {
			// success!
		res.render('sent');
});
```

### 8. Login page
All you need is a form where users enter their email address, for example:
```html
<html>
	<body>
		<h1>Login</h1>
		<form action="/sendtoken" method="POST">
			Email:
			<br><input name="user" type="text">
			<br><input type="submit" value="Login">
		</form>
	</body>
</html>
```
By default, Passwordless will look for a field called `user` submitted via POST.

### 9. Protect your pages
You can protect all pages that should only be accessed by authenticated users by using the `passwordless.restricted()` middleware, for example:
```javascript
/* GET restricted site. */
router.get('/restricted', passwordless.restricted(),
 function(req, res) {
  // render the secret page
});
```
You can also protect a full path, by doing:
```javascript
router.use('/admin', passwordless.restricted());
```

### 10. Who is logged in?
Passwordless stores the user ID in req.user (at least by default). So, if you want to display the user's details or use them for further requests, you can do something such as:
```javascript
router.get('/admin', passwordless.restricted(),
	function(req, res) {
		res.render('admin', { user: req.user });
});
```