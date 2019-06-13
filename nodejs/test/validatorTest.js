let chai = require('chai');
let path = require('path');

chai.should();

let User = require(path.join(__dirname, '..', '/api/validators'));

describe('Validator', () => {
  describe('URL', () => {
    it('can accept http prefixed urls', () => {
      User.validateURL('http://google.com').should.equal(true);
    });
    it('can accept non-http prefixed urls', () => {
      User.validateURL('google.com').should.equal(true);
    });
    it('can accept www prefixed urls', () => {
      User.validateURL('www.google.com').should.equal(true);
    });
    it('can accept www and http prefixed urls', () => {
      User.validateURL('http://www.google.com').should.equal(true);
    });
    it('can accept https prefixed urls', () => {
      User.validateURL('https://google.com').should.equal(true);
    });
    it('can accept www and https prefixed urls', () => {
      User.validateURL('http://www.google.com').should.equal(true);
    });
  });

  describe('Email', () => {
    it('can accept .ca emails', () => {
      User.validateEmailAddress('test@email.ca').should.equal(true);
    });
    it('can accept .com emails', () => {
      User.validateEmailAddress('test@email.com').should.equal(true);
    });
    it('can accept .co emails', () => {
      User.validateEmailAddress('test@email.co').should.equal(true);
    });
    it('can accept .net emails', () => {
      User.validateEmailAddress('test@email.net').should.equal(true);
    });
    it('can accept emails with periods in local', () => {
      User.validateEmailAddress('test.test12@email.ca').should.equal(true);
    });
    it('can accept emails with +\'s in local', () => {
      User.validateEmailAddress('test+test12@email.ca').should.equal(true);
    });
  });
  describe('Phone Number', () => {
    it('can accept no formatting', () => {
      User.validatePhoneNumber('4169035372').should.equal(true);
    });
    it('can accept brackets', () => {
      User.validatePhoneNumber('(416)9035372').should.equal(true);
    });
    it('can accept dash', () => {
      User.validatePhoneNumber('416903-5372').should.equal(true);
    });
    it('can accept brackets and dash', () => {
      User.validatePhoneNumber('(416)903-5372').should.equal(true);
    });
  });
});
