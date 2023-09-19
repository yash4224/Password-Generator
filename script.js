const inputSlider=document.querySelector("#data-lengthSlider");
const lengthDisplay=document.querySelector("#data-lengthNumber");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copymsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allcheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*_-=+?/>.<,~|\/';

let password='';
let passwordLength=10;
let checkcount=0;
handleSlider();
setIndicator('#ccc');


// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    // shadow
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0, 9);
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97, 123));
}


function generateSymbol(){
    const randNumber=getRndInteger(0, symbols.length);
    return symbols.charAt(randNumber);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hassymbol = false;

    if(uppercaseCheck.checked){
        hasUpper=true;
    }
    if(lowercaseCheck.checked){
        hasLower=true;
    }
    if(numberCheck.checked){
        hasNumber=true;
    }
    if(symbolCheck.checked){
        hassymbol=true;
    }


    if(hasUpper && hasLower && (hasNumber || hassymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hassymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{    
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // for copytext visible

    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

function shuffle(array){
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i*1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp; 
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheck(){
    checkcount=0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });
        if(passwordLength<checkcount){
            passwordLength=checkcount;
            handleSlider();
        }
};

allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheck);
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();  
    }
})

generateBtn.addEventListener('click', ()=>{

    // first case- no checkbox is ticked
    if(checkcount<=0){
        return;
    }
    // second case
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
    }

    // remove old password
    password='';

    // creating array for random password

    let arr=[];
    if(uppercaseCheck.checked){
        arr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        arr.push(generateLowercase);
    }
    if(numberCheck.checked){
        arr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        arr.push(generateSymbol);
    }

    // jo tick hai unko password m daalna h

    for(let i=0; i<arr.length; i++){
        password+=arr[i]();
    }
    // baakio ko password m dalna h
    for(let i=0; i<passwordLength-arr.length; i++){
        let randIndex=getRndInteger(0, arr.length);
        password+=arr[randIndex]();
    }

    // shuffle password
    password=shuffle(Array.from(password));

    // show password
    passwordDisplay.value=password;

    //calculate strength
    calcStrength(); 

})
