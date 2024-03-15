let loginButton = document.getElementById('loginButton')
let loginBlock = document.getElementById('mainLoginBlock')
let registerLink = document.getElementById('registerLink')
const BYTES_IN_MB = 1048576
let loginInput = document.getElementById('loginInput')
let passInput = document.getElementById('passInput')
let viewPassEye = document.getElementById('viewPassEye')
history.pushState(null, null, window.location.origin+'/login');
loginInput.addEventListener('keypress', function (event){
    let keyCode = event.hasOwnProperty('which') ? event.which : event.keyCode;
    if (keyCode===13)
    {event.preventDefault()
        passInput.focus();}})


passInput.addEventListener('keypress', enterLogin);

function enterLogin(event) {
    let keyCode = event.hasOwnProperty('which') ? event.which : event.keyCode;
    if (keyCode===13)
        {event.preventDefault();
        logIN()}
    // else {event.preventDefault()}
}

function logIN() {
    let logi = loginInput.value.toLowerCase();
    socket.emit('API-Login', {login:logi, pass:passInput.value})
    // window.location.href = '/index';
}// авторизация

function loadRegisterForm() {
    let passCheckValid = false;
  loginBlock.innerHTML='';

    let inputBlockLogin = document.createElement('div')
        inputBlockLogin.className="inputBlock";
        let loginLabel = document.createElement('div')
            loginLabel.className= "inputName"; loginLabel.innerText= 'Email';

        let loginRegistInput = document.createElement('input')
            loginRegistInput.id = 'loginRegistInput';
            loginRegistInput.type = 'email';
            loginRegistInput.placeholder = 'example@gmail.com';
            loginRegistInput.setAttribute('required', '');
             // // loginRegistInput.pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[A-Za-z]{2,}";
             //    loginRegistInput.pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}";
    inputBlockLogin.appendChild(loginLabel);
        inputBlockLogin.appendChild(loginRegistInput);
        loginBlock.appendChild(inputBlockLogin);


    let inputBlockPass = document.createElement('div')
    inputBlockPass.className="inputBlock";
        let loginLabelPass = document.createElement('div')
            loginLabelPass.className= "inputName";
        loginLabelPass.innerText= 'Придумайте пароль';
    let viewPassEyeREG = document.createElement('button');
    viewPassEyeREG.classList.add('viewPassEye');


    let p=document.createElement('p');
    p.innerText='показать';
    let ion = document.createElement('ion-icon');
    ion.name="eye-outline";
    ion.classList.add('eye');
    viewPassEyeREG.appendChild(p)
    viewPassEyeREG.appendChild(ion)
    viewPassEyeREG.onclick=function (){
            if (passRegistInput.type === "password"){
                passRegistInput.type = "text"
                passRegistInputCheck.type = "text"
                p.innerText='скрыть'
                ion.name="eye-off-outline"
                // viewPassEyeREG.innerHTML='<p>скрыть</p><ion-icon  class="eye" name="eye-off-outline"></ion-icon>'
            }
            else {passRegistInput.type = "password"
                passRegistInputCheck.type = "password"
                p.innerText='показать'
                ion.name="eye-outline"


                // viewPassEyeREG.innerHTML='<p>показать</p><ion-icon  class="eye" name="eye-outline"></ion-icon>'
                }
    };
    loginLabelPass.appendChild(viewPassEyeREG);
        let passRegistInput = document.createElement('input')
            passRegistInput.id = 'passRegistInput';
            passRegistInput.type = 'password';
            passRegistInput.setAttribute('required','')
            passRegistInput.minLength = 8;
            passRegistInput.placeholder = 'не менее 8 символов';
        inputBlockPass.appendChild(loginLabelPass)
        inputBlockPass.appendChild(passRegistInput)
        loginBlock.appendChild(inputBlockPass)

    let inputBlockPassCheck = document.createElement('div')
    inputBlockPassCheck.className="inputBlock";
        let loginLabelPassCheck = document.createElement('div')
            loginLabelPassCheck.className= "inputName"; loginLabelPassCheck.innerText= 'Повторите пароль';
        let passRegistInputCheck = document.createElement('input')
            passRegistInputCheck.id = 'passRegistInputCheck';
            passRegistInputCheck.type = 'password';
            passRegistInputCheck.setAttribute('required','');
            passRegistInputCheck.placeholder = ' ';
        inputBlockPassCheck.appendChild(loginLabelPassCheck)
        inputBlockPassCheck.appendChild(passRegistInputCheck)
        loginBlock.appendChild(inputBlockPassCheck)

    inputBlockPassCheck.addEventListener('input', runCheckPass)
            function runCheckPass(){
                passRegistInputCheck.addEventListener('input', checkPass)
                passRegistInput.addEventListener('input', checkPass)
                    function checkPass(){
                if (passRegistInputCheck.value!==passRegistInput.value)
                {
                    passRegistInputCheck.setAttribute('style','outline: red solid 2px; outline-offset: 2px;');
                    passRegistInput.setAttribute('style', 'outline: red solid 2px; outline-offset: 2px;');
                    loginLabelPassCheck.innerText ='Пароли не совпадают!';
                    passCheckValid=false;
                } else {passRegistInputCheck.setAttribute('style','outline: red solid 0px;');
                        passRegistInput.setAttribute('style','outline: red solid 0px;' );
                    loginLabelPassCheck.innerText ='Пароли совпадают!';
                    passCheckValid=true;};

                    if (passRegistInputCheck.value.length===0 && passRegistInput.value.length===0){loginLabelPassCheck.innerText='Повторите пароль'}
            };}


    let inputBlockNick = document.createElement('div')
    inputBlockNick.className="inputBlock";
    let nicKLabel = document.createElement('div')
        nicKLabel.className= "inputName"; nicKLabel.innerText= 'Придумайте никнейм';
    let nickInput = document.createElement('input')
        nickInput.id = 'nickInput';
        nickInput.type = 'text';
        nickInput.maxLength = 10;
        nickInput.minLength = 2;
        nickInput.pattern = '^\\S+(.*)+\\S$';
    // '^[^\\s]+(\\s.*)?$';
        nickInput.setAttribute('required', '');
        nickInput.placeholder = 'до 10 символов';



    inputBlockNick.appendChild(nicKLabel)
    inputBlockNick.appendChild(nickInput)
    loginBlock.appendChild(inputBlockNick)


    let avatarBlock = document.createElement('div')
        avatarBlock.className="inputBlock"; avatarBlock.setAttribute('style','text-align: center;')
        let avatarLabel = document.createElement('div')
            avatarLabel.className = 'inputName'; avatarLabel.innerText = 'Ваш аватар';
        let avatarImg = document.createElement('img')
            avatarImg.setAttribute('style','object-fit: cover;width: 100px; height: 100px; border-radius: 50px')
            let  avatarSrc= 'uploads/standartUser.jpeg';
            avatarImg.src=avatarSrc;
        avatarBlock.appendChild(avatarLabel)
        avatarBlock.appendChild(avatarImg)
    loginBlock.appendChild(avatarBlock)
    let buttonBlock = document.createElement('div')
        buttonBlock.className = 'inputBlock'
          let registButton = document.createElement('button')
              registButton.id = 'registButton';
              registButton.innerText= "Завершить";
              registButton.setAttribute('disabled','');
              registButton.classList.add('loginButton')
              registButton.addEventListener('click', function (){
                  sendRegisterData (
                      loginRegistInput.value,
                      passRegistInputCheck.value,
                      nickInput.value,
                      avatarSrc)})
          let regResult = document.createElement('div')
                 regResult.id = 'regResult';
        buttonBlock.appendChild(registButton)
        buttonBlock.appendChild(regResult)
    loginBlock.appendChild(buttonBlock)
    let registerImgInput = document.createElement('input')
        registerImgInput.type="file";
        registerImgInput.accept=".jpg,.jpeg,.png,.heic,.webp,.gif";
        registerImgInput.setAttribute('style','display: none')

    loginBlock.appendChild(registerImgInput)
    registerLink = document.createElement('div')
        registerLink.id = 'registerLink';
        registerLink.className = 'registerLink'
        registerLink.innerText = 'Войти'
        registerLink.setAttribute('style','font-size: 15px; color: rgba(35, 98, 93, 0.63);')
        registerLink.addEventListener('click', function () {
            window.location.href = '/login';
        })
    loginBlock.appendChild(registerLink)

    registerImgInput.addEventListener('change', function () {

        let file = this.files[0]

        if (file.size > 5 * BYTES_IN_MB) {
            clientLog('['+file.name+'] слишком большой ['+file.size+' Mb], поддерживается изображение до 5Mb!')
            this.value = null
        } else {
            // avatarImg.src=registerImgInput.value;
            // alert(registerImgInput.value)
        }
        console.log(file)
      if(file.type.indexOf('image')>-1)  {
            sendAvatarFile();
        }
        else {clientLog('['+file.type+'] не поддерживается, выберите картинку!')
            avatarSrc='uploads/standartUser.jpeg';
            avatarImg.src=avatarSrc;}
    });

        function fileChooseTrigger(){registerImgInput.click()}
        avatarImg.addEventListener('click',fileChooseTrigger)

        function       sendAvatarFile() {
            const fileToUpload = registerImgInput.files[0]
            const formSent = new FormData()
            const xhr = new XMLHttpRequest()

            if (registerImgInput.files.length > 0) {
                formSent.append('photo',fileToUpload)

                // собираем запрос и подписываемся на событие progress
                //xhr.setRequestHeader('Content-Type', 'multipart/form-data')
               // xhr.upload.addEventListener('progress', progressHandler, false)
                xhr.addEventListener('load', loadHandler, false)
                xhr.open('POST', '/upload')
                //clientLog(formSent);
                xhr.send(formSent);

                registerImgInput.value = null;
            } else {
                alert('Сначала выберите файл')
            }
            return false}

        function loadHandler(event) {
            avatarSrc= event.target.responseText;
            //statusText.textContent = event.target.responseText;
            //progressBar.value = 0;
            if (avatarSrc.length>1) {
                avatarImg.src=avatarSrc;}}

    setInterval(function (){
        let loginValid = loginRegistInput.validity.valid;
        let passValid = passRegistInput.validity.valid;
        // passCheckValid
        let nickValid = nickInput.validity.valid;
        if(checkValidRegistration(loginValid,passValid,passCheckValid,nickValid)) {
            registButton.removeAttribute('disabled');}
        else {registButton.setAttribute('disabled','');}},1000);

    //nickInput.addEventListener('input', function (){checkValidRegistration (loginValid, passValid, passCheckValid ,nickValid)})
} // форма регистрации

function checkValidRegistration (login, pass, passCheck, nick){
    if (login & pass & passCheck & nick){
        console.log('all inouts Valid! You can regist!');
        return true
    }

    else {console.log('u cant regist =(');
        return false
        }
};

// loginRegistInput
// passRegistInput
// passRegistInputCheck
// nickInput
function sendRegisterData(login, pass, nick, ava){
    let logi = login.toLowerCase();
    let user = {login:logi,
                pass:pass,
                nick:nick,
                ava:ava}
    socket.emit('API-NewUserRegist', user)
}

loginButton.addEventListener('click',logIN) // запуск авторизации
registerLink.addEventListener('click', loadRegisterForm) // запуск формы регистации


function viewPass(){
    if (passInput.type === "password"){
        passInput.type = "text"
        viewPassEye.innerHTML='<p>скрыть</p><ion-icon  class="eye" name="eye-off-outline"></ion-icon>'
    }
    else {passInput.type = "password"
        viewPassEye.innerHTML='<p>показать</p><ion-icon  class="eye" name="eye-outline"></ion-icon>'}
}

// function viewPassREG(){
//     // let viewPassEyeREG = document.getElementById('viewPassEyeREG')
//     if (passRegistInput.type === "password"){
//         passRegistInput.type = "text"
//         passRegistInputCheck.type = "text"
//         viewPassEyeREG.innerHTML='<p>скрыть</p><ion-icon  class="eye" name="eye-off-outline"></ion-icon>'
//     }
//     else {passRegistInput.type = "password"
//         passRegistInputCheck.type = "password"
//         viewPassEyeREG.innerHTML='<p>показать</p><ion-icon  class="eye" name="eye-outline"></ion-icon>'}
// }