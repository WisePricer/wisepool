global.sinon = require('sinon')

var chai = require('chai')
chai.use(require('sinon-chai'))

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var chaiMatchPattern = require('chai-match-pattern');
chai.use(chaiMatchPattern);
global._ = chaiMatchPattern.getLodashModule()

global.expect = chai.expect

global.faker = require('faker')
