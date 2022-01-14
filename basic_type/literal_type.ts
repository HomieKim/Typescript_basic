
// 사용자 정의 타입
type Comibinable = number | string;
type CheckType = 'as-number' | 'as-text';

/*
사용자 정의 타입을 사용하면 복잡한 객체 타입을 직접 생성 할 수 있습니다.
*/

function combine(
    in1 : Comibinable,
    in2 : Comibinable,
    check : CheckType // 리터럴 타입으로 명시 가능
    ){
    let result;
    //result = in1 + in2  -- 유니온 타입 경우 어떤 타입이 올지 모르기 때문에 에러
    if(typeof in1 === 'number' && typeof in2 === 'number' || check == 'as-number'){
        result = +in1 + +in2;
    }else{
        result = in1.toString() + in2.toString();
    }
    return console.log(result);
}

combine(30,24, 'as-number');
combine("20","50",'as-number');
combine("20","50", 'as-text')
combine("문자열", "더하기", 'as-number'); // 문자열 +해서 더하면 NaN 결과로 나옴