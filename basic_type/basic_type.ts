function add(a : number, b: number , chk : boolean, phrase : string){
    const result = a + b;
    if(chk){
        console.log(phrase + result);
    }
}

let number1 : number = 18;
const number2 = 3;
const chk = true;
const phrase = "Result : ";


const result = add(number1, number2, chk, phrase);

