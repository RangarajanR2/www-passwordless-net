### TokenStores
TokenStores are used to store valid tokens for the time of their validity. A couple of implementations already exist, but it is also quick and easy to develop your own TokenStore with the help of the provided test framework.
* [MongoStore](https://github.com/florianheinemann/passwordless-mongostore): Implementation for MongoDB
* [RedisStore](https://github.com/florianheinemann/passwordless-redisstore): Implementation for Redis

Aware of any other implementations? [Let us know](https://twitter.com/thesumofall)

In case you need something different, simply fork one of the exiting TokenStores or start from scratch and implement against [passwordless-tokenstore-test](https://github.com/florianheinemann/passwordless-tokenstore-test), a test framework that makes sure you fulfill all the criteria of the API. It might also be worth having a look at the [comments](https://github.com/florianheinemann/passwordless-tokenstore/blob/master/lib/tokenstore.js) of the API.

### Delivery strategies
You are free to deliver the tokens in any way that suits your needs. The following modules might be a good starting point:
* [emailjs](http://emailjs.org): Straight-forward node.js email client (requires a SMTP server such as your Gmail account)
* [Mandrill](https://www.mandrill.com): Scalable SMTP infrastructure. They do have a node.js module. In fact, [this website](https://github.com/florianheinemann/www-passwordless-net/blob/master/controller/passwordless.js) uses their services. Free for up to 12k emails per month
* [Sendgrid](https://sendgrid.com/): Similar to Mandrill. Mature node.js module with good documentation
* [Twilio](http://www.twilio.com): Provides APIs for text messages and voice calls. Have a look at the [2-step authentication](/deepdive#2-step-authentication-e-g-for-sms-) to get an idea how to implement it

[Let us know](https://twitter.com/thesumofall) if you come across any other great ways to send out tokens!