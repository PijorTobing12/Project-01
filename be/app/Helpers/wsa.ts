import soap from "strong-soap";
const soapWsa = soap.soap;


// export const getAutoemailGHP = async (url: any, args: any) => {
//   return new Promise((resolve, reject) => {
//     var options = {};
//     soapWsa.createClient(url, options, function (err, client) {
//       var method = client["getAutoemailGHP"];
//       method(args, function (err, result, envelope, soapHeader) {
//         resolve(result);
//       });
//     });
//   });

export const getWSA = async (url: any, name: any, args: any) => {
  return new Promise((resolve, reject) => {
    var options = {};
    soapWsa.createClient(url, options, function (err, client) {
      var method = client[name];
      method(args, function (err, result, envelope, soapHeader) {
        resolve(result);
      });
    });
  });
};