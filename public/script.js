const textAreaArray = document.querySelectorAll('textarea');
console.log(textAreaArray);

// 변수 네이밍 컨벤션, 도메인과 관련된 용어 정의

// source : 번역할 텍스트와 관련된 명칭
// target : 번역된 결과와 관련된 명칭

const [sourceTextArea, targetTextArea] = textAreaArray;
// console.log(sourceTextArea); 확인용
// console.log(targetTextArea);

const [sourceSelect, targetSelect] = document.querySelectorAll('select');
// console.log(sourceSelect, targetSelect);

// 번역할 언어의 타입 (ko?, en?, ja?)
let targetLanguage = 'en';
// 'ko', 'ja'

// console.log(targetSelect);
// console.log(targetSelect.options);

// console.log(targetSelect.options[targetSelect.selectedIndex].value);

// 어떤 언어로 번역할지 선택하는 target selected의 선택지 값이 바뀔 때마다 이벤트 발생.
targetSelect.addEventListener('change', () =>{
    const selectedIndex = targetSelect.selectedIndex;
    // console.log(targetSelect);
    targetLanguage = targetSelect.options[selectedIndex].value;
});

let debouncer; // debouncer : setTimeout의 아이디값을 가짐

sourceTextArea.addEventListener('input', (event) => { // input 이벤트 계속 호출됨.
// 1. 어떤 타입인가?
// 2. textarea에 입력한 값은 어떻게 가져올 수 있을까?

    if(debouncer) { // 값이 있으면 true, 없으면 false
         clearTimeout(debouncer); // 매번 초기화 시킴
    }

    debouncer = setTimeout(()=> { // setTimeout : ?초가 지나면 입력 됨.
        // target : input 이벤트가 발생하고 입력되는 것 -> 그 target의 value 값을 출력
        const text = event.target.value; // textArea에 입력한 값
        // console.log(text);
        
        if(text) { // 예외처리

        // 이름이 XML일뿐이지, XML에 국한되지 않음.
        const xhr = new XMLHttpRequest(); // XMLHttpRequest() : 비동기 방식
    
        const url = '/detectLangs'; // node 서버의 특정 url 주소
    
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4 && xhr.status == 200) { // 4 : 응답 받음
                // 서버의 응답 결과 확인(responseText : 응답에 포함된 텍스트)
                // console.log(typeof xhr.responseText); // 응답 객체가 xhr.responseText에 들어있음.
                // console.log(xhr.responseText);
                // {
                    //     "userId": 1,
                    //     "id": 1,
                    //     "title": "delectus aut autem",
                    //     "completed": false
                    //   }                                  => JSON 형식, 타입 : stirng
                    
                    const responseData = xhr.responseText;
                    console.log(`responseData: ${responseData}, type: ${typeof responseData}`);
                    
                    const parseJsonToObject = JSON.parse(JSON.parse(responseData)); // 두 번 파싱
                    
                    console.log(typeof parseJsonToObject, parseJsonToObject);
                    
                    const result = parseJsonToObject['message']['result'];
                    const options = sourceSelect.options;
                    // 입력 했을 때 자동적으로 언어 감지
                    for (let i = 0; i < options.length; i++) {
                        if(options[i].value === result['srcLangType']) {
                            sourceSelect.selectedIndex = i;
                        }
                    }

                    // 번역된 텍스트를 결과화면에 입력
                    targetTextArea.value = result['translatedText'];
    
                    // 응답의 헤더(header) 확인
                    // console.log(`응답 헤더 : ${xhr.getAllResponseHeaders()}`);
                }
        };
        /*
        xhr.addEventListener('load', () => { // 로딩이 완료 되었을 때 실행
            if(xhr.status == 200) {
                내부 코드는 동일.
            }
        })

        -------------------------------------

        실행 예제 코드 script
     
        let select = document.querySelector('select');
        console.log(select, typeof select);
        console.log(select.options, typeof select.options);

        const options = select.options;
        // select.options[index].value
        const result = 'ko';
        
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == result) {
                select.selectedIndex = i;
            }
        }
        */
        xhr.open('POST', url);
    
        // 서버에 보내는 요청 데이터의 형식이 json 형식임을 명시.
        xhr.setRequestHeader("Content-type", "application/json");
    
        const requestData = { // typeof : object
            text,
            targetLanguage 
        };
    
        // JSON(Javascript Object Notation)의 타입은? string -> 직렬화
        // 내장 모듈 JSON 활용
        // 서버에 보낼 데이터를 문자열화 시킴
        jsonToString = JSON.stringify(requestData);
        console.log(typeof jsonToString); // type : string
    
        // xhr : XMLHttpRequest 요청 정보
        xhr.send(jsonToString);
    } else {
        console.log('번역할 텍스트를 입력하세요.');
        //alert('번역할 텍스트를 입력하세요. ');
        }    
    }, 3000); // 3000 : 3초, 텍스트 입력 후 3초가 지나지 않으면 함수 종료가 아니기 때문에 input으로 가고 3초가 지나면 함수 종료로 값 출력됨.
});
    