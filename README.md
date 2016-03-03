# passport-challenge

[Passport](http://passportjs.org/) strategy for authenticating with a username
and password.

This module lets you authenticate using a username, challenge and digital signature in your Node.js applications.  By plugging into Passport, challenge authentication can be easily and unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-challenge
```

## Usage

#### Configure Strategy

The challenge authentication strategy authenticates users using a username, challenge and signature.  The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user.

```js
passport.use(new ChallengeStrategy(
  function(username, challenge, singature, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // check validity of challenge and of signature
      if (!user.verifySignature(challenge, signature)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

##### Available Options

This strategy takes an optional options hash before the function, e.g. `new ChallengeStrategy({/* options */, callback})`.

The available options are:

* `usernameField` - Optional, defaults to 'username'
* `challengeField` - Optional, defaults to 'password'
* `signatureField` - Optional, defaults to 'signature'

Both fields define the name of the properties in the POST body that are sent to the server.

#### Parameters

By default, `ChallengeStrategy` expects to find credentials in parameters
named username, challenge and signature. If your site prefers to name these fields differently, options are available to change the defaults.

    passport.use(new ChallengeStrategy({
        usernameField: 'email',
        challengeField: 'challenge',
        signatuerField: 'signature',
        session: false
      },
      function(username, challenge, signature, done) {
        // ...
      }
    ));

When session support is not necessary, it can be safely disabled by
setting the `session` option to false.

The verify callback can be supplied with the `request` object by setting
the `passReqToCallback` option to true, and changing callback arguments
accordingly.

    passport.use(new ChallengeStrategy({
        usernameField: 'email',
        challengeField: 'challenge',
        signatureField: 'signature',
        passReqToCallback: true,
        session: false
      },
      function(req, username, challenge, signature, done) {
        // request object is now first argument
        // ...
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'challenge'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.post('/login', 
  passport.authenticate('challenge', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-local-example)
as a starting point for their own web applications.

## Tests

```bash
$ npm install
$ npm test
```

## Credits

- [Alin Dobra](http://github.com/alinVD)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Tera Insights<[http://www.terainsights.com/](http://terainsights.com/)>