'use strict';

var config = {};
config.mongodb = {};
config.http = {};
config.sparkpost = {};
config.email = {};
config.ga = {};

config.mongodb.host = process.env.MONGODB_HOST || '127.0.0.1';
config.mongodb.port = process.env.MONGODB_PORT || 27017;
config.mongodb.user = process.env.MONGODB_USERNAME || '';
config.mongodb.password = process.env.MONGODB_PASSWORD || '';
config.mongodb.database = process.env.MONGODB_DATABASE || 'wwwpasswordlessnet';

// Format:     mongodb://[username:password@]host1[:port1][/[database]
config.mongodb.uri = "mongodb://"
if(config.mongodb.user.length && config.mongodb.password.length)
	config.mongodb.uri += config.mongodb.user + ":" + config.mongodb.password + "@";
config.mongodb.uri += config.mongodb.host;
if(config.mongodb.port.toString().length)
	config.mongodb.uri += ":" + config.mongodb.port.toString();
if(config.mongodb.database.length)
	config.mongodb.uri += "/" + config.mongodb.database;

config.http.host_url = process.env.HTTP_HOST_URL || 'http://localhost';
config.http.port = process.env.PORT || 3000;
config.http.cookie_secret = process.env.HTTP_COOKIE_SECRET || 'YeukhPqijei86QWt3TBwhfjNe';
config.http.trust_proxy = process.env.HTTP_TRUST_PROXY;
config.http.enforce_ssl = process.env.HTTP_ENFORCE_SSL;

config.email.from = process.env.EMAIL_FROM || 'YOUR EMAIL';
config.email.subject = process.env.EMAIL_SUBJECT || 'SUBJECT';

config.sparkpost.api_key = process.env.SPARKPOST_API_KEY || 'API KEY';

config.ga.id = process.env.GA_ID || '';
config.ga.domain = process.env.GA_DOMAIN || '';

module.exports = config;