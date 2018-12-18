'use strict';

module.exports = (_chai, utils) => {
  let Assertion = _chai.Assertion;

  function assertInteger(options) {
    var obj = this._obj;

    this.assert(
        isInteger(obj)
      , 'expected #{this} to be an integer'
      , 'expected #{this} to not be an integer'
      , obj
    );
  }

  Assertion.addMethod('integer', assertInteger);
};

function isInteger(num) {
    return (num % 1 === 0)
}
