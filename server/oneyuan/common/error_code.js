/**
 * Created by jlf on 15/10/30.
 */

if (typeof ErrorCode == 'undefined') {
  var ErrorCode = {
    Success: 0,
    SysError: 1000,
    ParamsError: 1001,
    UserInfoError: 1002,
    InvalidCookies: 1003,
    Error: 1004,
  };
}

module.exports = {
  ErrorCode : ErrorCode,
}