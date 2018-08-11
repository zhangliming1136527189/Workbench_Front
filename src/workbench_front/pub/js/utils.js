/**
 * 获取url参数
 * @param {String} query 当前 url 中传递的参数
 */
export const GetQuery = query => {
  let theRequest = {};
  if (query.indexOf("?") != -1) {
    let str = query.split("?")[1];
    if (str.indexOf("&") != -1) {
      if(str[0] == '&'){
        str = str.substr(1);
      }
      let strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(decodeURIComponent(strs[i].split("=")[1]));
      }
    } else {
      theRequest[str.split("=")[0]] = decodeURIComponent(decodeURIComponent(str.split("=")[1]));
    }
  }
  return theRequest;
};
/**
 * 将对象转换成 url 参数字符串
 * @param {Object} object 参数对象
 */
export const CreateQuery = object => {
  let arg = "";
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const element = object[key];
      arg += `&${key}=${element}`;
    }
  }
  let defParam = arg;
  let hashParam = arg.split("");
  hashParam.splice(0, 1, "#");
  hashParam = hashParam.join("");
  let searchParam = arg.split("");
  searchParam.splice(0, 1, "?");
  searchParam = searchParam.join("");
  /**
   * defParam &开头的参数
   * hashParam #开头的参数
   * searchParam ？开头的参数
   */
  return {
    defParam,
    hashParam,
    searchParam
  };
};
/**
 * 数字补位
 * @param {Number} num 需要补位的数字
 * @param {Number} n 需要补的位数
 * Pad(1,2) => // 01
 */
export const Pad = (num, n) => {
  let len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
};
