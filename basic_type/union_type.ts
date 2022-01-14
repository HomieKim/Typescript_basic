function combine(in1 : number | string, in2 : number | string ){
    let result;
    //result = in1 + in2  -- 유니온 타입 경우 어떤 타입이 올지 모르기 때문에 에러
    if(typeof in1 === 'number' && typeof in2 === 'number'){
        result = in1 + in2;
    }else{
        result = in1.toString() + in2.toString();
    }
    return console.log(result);
}

combine(30,24);
combine("문자열", "더하기");