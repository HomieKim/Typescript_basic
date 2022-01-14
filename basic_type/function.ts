// 함수의 리턴 타입도 지정 가능
function add(n1: number , n2 : number) : number{
    return n1 + n2;
}

function printResult(num:number) : void { // void는 return 없으면 자동으로 추론
    console.log('Result : '+ num);

}
// calback도 타입으로 지정 가능
function addAndHandle(n1 : number , n2 : number, cb : (num : number)=> void) {
     const result = n1 + n2;
     cb(result);
}

// 함수 타입도 명시 가능

let addFunc : (a : number , b : number)=> number;
addFunc = add;
// addFunc = 4; 함수 아닌걸 넣으면 에러
// addFunc = printResult; 타입 에 안맞으면 에러
console.log(addFunc(1,4));

addAndHandle(3, 5, (result) => {
    console.log(result);
});