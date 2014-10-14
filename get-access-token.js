/**
 * Module dependencies
 */

var doJSONRequest = require('./lib/do-request');


module.exports = {
  id: 'get-access-token',
  moduleName: 'machinepack-facebook',
  description: 'Generate (or regenerate) a new access token to access a user\'s Facebook account.  Note that you must first have a valid `code` from the user proving that they\re OK with this!!\nYou can get a code by redirecting the user to the url generated by calling the `getLoginUrl(...)` machine.',
  notes: undefined,
  moreInfoUrl: '',
  inputs: {
    appId: {
      example: '215798311808508',
      description: 'Your Facebook app id',
      required: true
    },
    appSecret: {
      example: 'dsg4901g0123456',
      description: 'Your Facebook app secret',
      required: true
    },
    code: {
      example: 'g29hgasdg9a4u2h9en4Wejga$$2g00dhgj1olfndsga93103592t9hadignadva291',
      description: 'The OAuth `code` generated by Facebook and sent to the `callbackUrl` if the user chooses to grant your app the requested permissions.'
    },
    callbackUrl: {
      example: 'http://localhost:1337/user/facebook/login',
      description: 'The URL which will be hit after the user successfully logs in.  Usually contains some kind of identifying information about the user.'
    }
  },
  exits: {
    error: {},
    success: {
      description: 'The access token which allows you to do things and get information on behalf of a particular Facebook user.',
      example: {
        token: 'CA2Emk9XsJUIBAHB9sTF5rOdNmAXTDjiHxZaZC1GYtFZCcdYGVnLYZB7jZCvensIpGc22yEzN6CL6wtQ9LPVXTNkuP6eQoUQ0toEVPrmTTqDpj0POijBpsuZBnx7jrZCHaTw8leiZBn0R8u6gZAYZAuD77cA3tnDMYvHhrl42CnljROeC9maWoa5zbsT2TZBXdL9wEuGQDSxKqRPyajRw3P3HEK',
        expires: 39523862396
      }
    }
  },
  fn: function (inputs,exits) {


    // hit GET projects/ and send the api token as a header
    doJSONRequest({
      method: 'get',
      url: '/oauth/access_token',
      data: {
        'redirect_uri': inputs.callbackUrl,
        'client_id':inputs.appId,
        'client_secret':inputs.appSecret,
        'code':inputs.code,
      },
      headers: {},
    }, function (err, responseBody) {
      if (err) {
        return exits.error(err);
      }

      // Parse Facebook Access Token from request Body
      var token;
      try {
        return exits(null, {
          token: responseBody.match(/access_token=([a-z0-9]+)[^a-z0-9]{0,}/i)[1],
          expires: responseBody.match(/expires=([0-9]+)[^0-9]{0,}/i)[1]
        });
      } catch (parseError){
        return exits.error(parseError);
      }
    });
  }
};


