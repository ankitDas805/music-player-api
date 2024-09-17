const crypto=require("crypto")
let secretkey="Radha"

class EncryptDecryptHelper{
    constructor(){}

async encryption (payload){
// let encrypted = CryptoJS.AES.encrypt(payload, secretkey).toString();
// console.log("encrypted---",encrypted)
// return encrypted
let  mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
var mystr = mykey.update(payload, 'utf8', 'hex')
mystr += mykey.final('hex');
return mystr

}
async decryption (payload){
//     let decryptedData=CryptoJS.AES.decrypt(payload, secretkey)
//     let finalDecryptedData=decryptedData.toString(CryptoJS.enc.Utf8);
//     return finalDecryptedData
var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
var mystr = mykey.update(payload, 'hex', 'utf8')
mystr += mykey.final('utf8');
return mystr

 }
}

module.exports= new EncryptDecryptHelper()