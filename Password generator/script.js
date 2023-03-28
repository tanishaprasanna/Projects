
// fetching all the required attributes  
const inputSlider=document.querySelector("[slider-length]");
const sliderLength=document.querySelector("[pwd-length]");
const pwd=document.querySelector("[data-pwd-display]");
const copyBtn=document.querySelector("[copied-btn]");
const copyText=document.querySelector("[copied-text]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbers=document.querySelector("#numbers");
const symbols=document.querySelector("#symbols");
const indicator=document.querySelector(".circle");
const pwdGenerate=document.querySelector(".generate-btn");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbolsList='~`!@#$%^&*()_-+={[}].,>/?<';

let password="";
let passwordLength=10;
let checkCount=0;


setSlider(); 
setIndicator("#ccc");
//slider function to set password length
function setSlider()
{
    inputSlider.value=passwordLength;
    sliderLength.innerText=passwordLength;
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
}

function randomInteger(min,max)
{
    return Math.floor(Math.random() * (max-min)) + min;
}

function randomNumber()
{
    return randomInteger(0,9);
}

function randomLowercase()
{
    return String.fromCharCode(randomInteger(97,123));
}

function randomUppercase()
{
    return String.fromCharCode(randomInteger(65,91));
}

function randomSymbol()
{
    const randomNumber=randomInteger(0,symbolsList.length);
    return symbolsList.charAt(randomNumber);
}

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbers.checked) hasNum=true;
    if(symbols.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength>=8 ){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper) && (hasNum||hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent()
{
   try
   {
    await navigator.clipboard.writeText(pwd.value);
    copyText.innerText="copied";
   } 
   catch(e){
    copyText.innerText="Failed";
   }

   // to make "copied" visible and invisible
   copyText.classList.add("active");
   setTimeout( () => {
    copyText.classList.remove("active");
   },2000); 
}

function shufflePassword(array){
    //fisher yates method 
    for(let i = array.length-1; i>0;i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]= array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str +=el));
    return str;
} 

function handleCheckBoxChange()
{
    checkCount=0;
    allcheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        slider(); 
    }
}

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength=e.target.value;
    setSlider();
})    

copyBtn.addEventListener('click', () => {
    if(pwd.value)
        copyContent();
})

pwdGenerate.addEventListener('click', () => {
    if(checkCount == 0) 
        return;
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        setSlider();
    }

    password=""; //removing old password

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(randomUppercase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(randomLowercase);
    }

    if(numbers.checked){
        funcArr.push(randomNumber);
    }

    if(symbols.checked){
        funcArr.push(randomSymbol);
    }

    for(let i=0; i<funcArr.length; i++)
    {
        password+= funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
        let randomIndex= randomInteger(0,funcArr.length);
        password+= funcArr[randomIndex]();
    }

    password=shufflePassword(Array.from(password));
    pwd.value=password;
    calcStrength();
});