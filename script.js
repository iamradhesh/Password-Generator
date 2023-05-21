const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const  passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^*-+={[]}|\():;<,>?/';

let passwordLength=10;
let password="";

let checkCount=1;
handleSlider();
//set strength circle colour to grey
setIndicator("#ccc");


//set password length
function handleSlider()
{
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

//set indicator

function setIndicator(color)
{
    indicator.style.backgroundColor=color;
    //shadow
}

//Get random integer

function getRandomInteger(min,max)
{
  return Math.floor( Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
   return getRandomInteger(0,9);
}

// get charcter
function generateLowerCase()
{
    var char =String.fromCharCode( getRandomInteger(97,123));
    return char;
}

function generateUpperCase()
{
    var char =String.fromCharCode( getRandomInteger(65,91));
    return char;
}

//get symbole
function generateSymbol()
{
    var len=symbols.length;
    const randNum=getRandomInteger(0,len);
    return symbols.charAt(randNum);
}
//strngth calculate

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked)
    {
        hasUpper=true;
    }
    if(lowercaseCheck.checked)
    {
        hasLower=true;
    }
    if(numberCheck.checked)
    {
        hasNum=true;
    }
    if(symbolCheck.checked)
    {
        hasSym=true;
    }

    if(hasUpper && hasLower &&(hasNum || hasSym)&& passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passwordLength>=6
    )
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// copy content

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }
    //To make copy msg visible
    copyMsg.classList.add('active'); 

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

//slider
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});
//copy Button event listener
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

//Shuffle password
function shufflePassword(array)

{
    //fisher yates method
    for(let i=array.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;


}

//Generate password

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0)
    {
        return;
    }
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("Starting the journey");
    //remove old pasword
    password="";

    //Let's put the stuff mention on checkbox

    

    let funArr=[];
    if(uppercaseCheck.checked)
    {
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked)
    {
        funArr.push(generateLowerCase);
    }
    if(numberCheck.checked)
    {
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked)
    {
        funArr.push(generateSymbol);
    }

    
    //compulsoery addition

    for(let i=0;i<funArr.length;i++)
    {
        password+=funArr[i]();
    }
    //remaining
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
       let rendIndex=getRandomInteger(0,funArr.length);
       password+=funArr[rendIndex](); 
    }
    //shuffle the pass
    password=shufflePassword(Array.from(password));

    //Show the password
    passwordDisplay.value=password;
    //calculate strength
    calcStrength();

});