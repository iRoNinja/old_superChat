history.pushState(null, null, window.location.origin+'/profile');
let nName = document.getElementById('nName')
// nName.value = chatStorage.getItem('userNickCash')
let profileAva = document.getElementById('profileAva');
let profileLogin =document.getElementById('profileLogin');
nName.value = chatStorage.getItem('profileNick');
profileAva.src = chatStorage.getItem('profileAva');
profileLogin.value = chatStorage.getItem('profileLogin');
let oldPass = document.getElementById('oldPass');
let newPass = document.getElementById('newPass');
let newPassCheck = document.getElementById('newPassCheck')
let doneDiv = document.getElementById('profileUpdateStatus')
let changePassSpoiler = document.getElementById('changePassSpoiler')
let newPassArea = document.getElementById('newPassArea')
let changePassSpoilerStatus = false;
let newPassCheckStatus = document.getElementById('newPassCheckStatus');
let passCheckValid2 = false;
let sBtt = document.getElementById('sBtt')
let hiddenProfileAva = document.getElementById('hiddenProfileAva')
changePassSpoiler.addEventListener('click', function (){
    let style = window.getComputedStyle(changePassSpoiler);

    if (changePassSpoilerStatus===false)
        {newPassArea.setAttribute('style','display: flex')
            changePassSpoiler.setAttribute('style','border-radius: 7px 7px 0px 0px;')
            changePassSpoilerStatus=true}
    else { if (newPass.value ===''
                & newPassCheck.value===''
                & oldPass.value==='')
    {newPassArea.setAttribute('style','display: none')
        changePassSpoiler.setAttribute('style','border-radius: 7px 7px 7px 7px;')
            changePassSpoilerStatus=false}}
})
const BYTES_IN_MB = 1048576


function logOut (){
    socket.emit("API-Logout", {token:chatStorage.getItem('token')})
    // chatStorage.removeItem('token');
    localStorage.clear()
    window.location.href = '/login'
}

sBtt.addEventListener('click', saveProfileData)
let logout = document.getElementById('logout');
logout.addEventListener('click', logOut)
profileAva.addEventListener('click', function (){hiddenProfileAva.click()})
hiddenProfileAva.addEventListener('change', function () {
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
        updateAvatarFile();
    }
    // else {clientLog('['+file.type+'] не поддерживается, выберите картинку!')
    //     avatarSrc='uploads/standartUser.jpeg';
    //     avatarImg.src=avatarSrc;}
});

function updateAvatarFile() {
    const fileToUpload = hiddenProfileAva.files[0]
    const formSent = new FormData()
    const xhr = new XMLHttpRequest()

    if (hiddenProfileAva.files.length > 0) {
        formSent.append('photo',fileToUpload)

        // собираем запрос и подписываемся на событие progress
        //xhr.setRequestHeader('Content-Type', 'multipart/form-data')
        // xhr.upload.addEventListener('progress', progressHandler, false)
        xhr.addEventListener('load', loadHandler, false)
        xhr.open('POST', '/upload')
        //clientLog(formSent);
        xhr.send(formSent);

        hiddenProfileAva.value = null;
    }
    return false}

function loadHandler(event) {
    let avatarSrcUpdated= event.target.responseText;
    //statusText.textContent = event.target.responseText;
    //progressBar.value = 0;
    if (avatarSrcUpdated.length>1) {
        // chatStorage.getItem('profileAva'),
        chatStorage.setItem('profileAva',avatarSrcUpdated)
        profileAva.src=avatarSrcUpdated;}}

function saveProfileData(){
    //
    // let userData = { nickname: nName.value}
    //     alert((userData))
    //
    //
    //
    // const xhr = new XMLHttpRequest()
    //       xhr.addEventListener('load', loadHandler, false)
    //       xhr.open('POST', '/saveProfileData')
    //       xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    //
    //         xhr.send(JSON.stringify(userData) );
    //
    let userUpdated = {
        login: profileLogin.value,
        nick:nName.value,
        passOld:oldPass.value,
        passNew:newPassCheck.value,
        ava: chatStorage.getItem('profileAva'),
        token: chatStorage.getItem('token')

    } //поменять путь аватарки

    socket.emit('API-UpdateProfileInfo',userUpdated)
}

// function loadHandler(event) {
//     let res= event.target.responseText;
//     alert(res)
//
// }

function profileUserInfo(login,nick, avat,resultString){
    if (login.length>1){
        nName.value = nick;
        profileAva.src = avat;
        profileLogin.value = login;
            doneDiv.innerHTML='';
            if(resultString) {
                doneDiv.innerText = resultString;
            }
            doneDiv.setAttribute('style','font-size: 15px;text-align:center;color: rgba(35, 98, 93, 0.63);')
            let userProfileBlock = document.getElementById('userProfileBlock')
        userProfileBlock.appendChild(doneDiv)
        indexUserInfo(nick,avat);
    }
}

window.addEventListener('click', function (){doneDiv.innerHTML='';})

newPassCheck.addEventListener('input', runCheckPass)

function runCheckPass(){
    newPassCheck.addEventListener('input', checkPass)
    newPass.addEventListener('input', checkPass)
    oldPass.addEventListener('input', checkPass)
    function checkPass(){
        if (newPassCheck.value!=newPass.value )
        {
            newPassCheck.setAttribute('style','outline: red solid 2px; outline-offset: 2px;');
            newPass.setAttribute('style', 'outline: red solid 2px; outline-offset: 2px;');
            newPassCheckStatus.innerText ='Пароли не совпадают!';
            passCheckValid2=false;
            sBtt.setAttribute('disabled','');
        } else {newPassCheck.setAttribute('style','outline: red solid 0px;');
            newPass.setAttribute('style','outline: red solid 0px;' );
            newPassCheckStatus.innerText ='Пароли совпадают!';
            passCheckValid2=true;
            if (passCheckValid2 && oldPass.validity.valid) {
                sBtt.removeAttribute('disabled');
            }
        };
        if (oldPass.validity.valid===false)
            {newPassCheckStatus.innerText='старый пароль не верный'
            oldPass.setAttribute('style', 'outline: red solid 2px; outline-offset: 2px;');
                sBtt.setAttribute('disabled','')
            }
        else {oldPass.setAttribute('style','outline: red solid 0px;' );
                    if (passCheckValid2=true) {
                        sBtt.removeAttribute('disabled');
                    }
              }

        // if (newPassCheck.value.length===0 && newPass.value.length===0){newPassCheckStatus.innerText='Повторите пароль'}
    };
}

// let shapka_profile2 = document.getElementById('shapka_profile')
// let shapka_chat2 = document.getElementById('shapka_chat')
// let shapka_settings2 = document.getElementById('shapka_settings')
// let adminka2 = document.getElementById('adminka');

// adminka2.addEventListener('click', function (){window.location.href = '/adminka'});
// shapka_profile2.addEventListener('click', function (){loadProfilePage()})
// shapka_chat2.addEventListener('click', function (){window.location.href = '/chat'})
// shapka_settings2.addEventListener('click', function (){
//     if (!chatStorage.getItem('token')) {
//         window.location.href = '/login'}
//     else
//     {window.location.href = '/settings';}})
fon()
function viewPass (){
    // let oldPass = document.getElementById('oldPass');
    // let newPass = document.getElementById('newPass');
    // let newPassCheck = document.getElementById('newPassCheck')
    if (oldPass.type === "password"){
        oldPass.type = "text"
        newPass.type = "text"
        newPassCheck.type = "text"
        viewPassEye.innerHTML='<p>скрыть</p><ion-icon  class="eye" name="eye-off-outline"></ion-icon>'
    }
    else {
        oldPass.type = "password"
        newPass.type = "password"
        newPassCheck.type = "password"
        viewPassEye.innerHTML='<p>показать</p><ion-icon  class="eye" name="eye-outline"></ion-icon>'}
}