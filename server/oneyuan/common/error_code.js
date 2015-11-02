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
    DatabaseQueryError:1004,
    Error: 2001,
  };
}

module.exports = ErrorCode;