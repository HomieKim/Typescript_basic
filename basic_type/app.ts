/*
unknown과 any는 동작방식이 다릅니다.
any는 타입 체킹이 필요 없습니다.
 */

let userInput : unknown;
let userName : string;

userInput = 'homie';
userName = "yes";
userInput = userName;
// userName = userInput; string 타입에 unknown타입을 넣을 수 없습니다.
// 단 if문으로 타입을 체크한다면 가능합니다.
if( typeof userInput === 'string'){
    userName = userInput;
}

// never는 어떤것도 반환하지 않을 의도일 때 사용 가능합니다.
function generatorError(message : string, code : number ) {
    throw {message : message , errorcode : code };
}

generatorError('An error occurred!', 500);


