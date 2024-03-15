// публичное сообщение
// socket.on("add message", function (data) {
//     zapisat('msgAreaRoom0', data.nameToCl, data.messageToCl);
//     clientLog("Новое публичное сообщение от: [" + data.nameToCl + ']');
// });

//принимаем приватное сообщение
socket.on("API-receiveMessage", function (data) {
 //   clientLog('API-receiveMessage with type: '+data.type+' title: '+data.name+' id: '+data.id);
    manageTab(data.type, data.name, data.id,'');
    let msgAreaType = 'msgArea'+data.type+data.id;

    zapisat(msgAreaType, data.name, data.text,data.senderId,data.attach,data.ava , data.time, 'new');
   // clientLog("Новое приватное сообщение от [" + data.name + '] во вкладке с id: [' + data.id + ']');
});

// системное сообщение в чат и лог ("вышел из чата")
socket.on("API-UserDisconnected", function (data) {
    zapisatSysMessage('"' + data.name + '" вышел из чата');
    clientLog('[' + data.name + '] id [' + data.id + '] вышел из чата');
});

// системное соообщение в чат и лог ("зашел в чат")
socket.on("API-UserConnected", function (data) {
    zapisatSysMessage('"' + data.name + '" зашел в чат');
    clientLog('[' + data.name + '] id [' + data.id + '] зашел в чат');
});

// системное сообщение в чат и лог ("изменил имя")
socket.on("API-NameChangedUser", function (data) {
    let oldName = data.nameBefore;
    let newName = data.nameAfter;
    clientLog('\"' + oldName + '\" изменил имя на \"' + newName + '\"');
    zapisatSysMessage('\"' + oldName + '\" изменил имя на \"' + newName + '\"');
});

// Присваивание клиенту имени и вывод в лог
socket.on("API-setClientName", function (data) {
  if (vashNick)  {
        vashNick.value = data.clientName;
        profileName.innerText = data.clientName;
        clientId = data.clientId;
        chatStorage.setItem('userNickCash', data.clientName);
        chatStorage.setItem('clientId', data.clientId);
    }
    clientLog('Вам присвоено имя: [' + data.clientName + "] id: [" + data.clientId + ']');
});

// Оповещение об регистрации нового пользователя на стороне клиентов
socket.on('API-WelcomeNewUser', function (data) {
    clientLog('Пользователь: [' + data.newUserName + '], id: [' + data.newUserId + '] зарегестрировался в чате');
    zapisatSysMessage('\"' + data.newUserName + '\" впервые в нашем чате');
});

//вывод системного сообщения в конкретный чат
socket.on('API-SysMessage', function (data) {
    addSysMessage(data.type,data.id, data.text);
});

// Проверка регистрации
socket.on("API-checkRegistration", function (data) {
    let myToken = chatStorage.getItem('token');
    if(myToken){
        if (myToken.length > 0) {
            socket.emit("API-checkRegistration",
            {token: myToken});}
        else {
            socket.emit("API-checkRegistration", {newUser: 'newUser'})}
    }
    else {socket.emit("API-checkRegistration", {newUser: 'newUser'});}
});

// получение списка пользователей
socket.on("API-SetUsersList", function (data) {
    setUserList(data)
});

// событие "коннект" + лог
socket.on("connect", function (data) {
   if (document.getElementById('serverStatus')) {
        ServerStatus = true;
        vasheMessage.placeholder = 'Введите сообщение...';
        // document.body.setAttribute('style', 'cursor: default');
        send.setAttribute('style', 'cursor: pointer');
        document.getElementById('users').setAttribute('style', 'cursor: default');
        document.getElementById("shapka").setAttribute('style', 'cursor: default');
        document.getElementById('serverStatus').setAttribute('style', 'cursor: default');
        divServerStatus.setAttribute('style', 'cursor: pointer');
        clientLog('Вы подключились к серверу');
        serverStatusUpdate();
    }
});

//результат регистрации
socket.on('API-RegResult',function (data){
    let color = 'red'
    let text = 'Ошибка!';

    if (data.regMsg==='DONE'){ color='green'; text='Регистрация успешна!'}
    if (data.regMsg==='TryMore') {text='Этот email уже занят!'}
    let resultDiv=document.createElement('div')
        //resultDiv.setAttribute('style','width: 50px;height: 50px; border-radius: 25px');
        resultDiv.innerText=text;
        resultDiv.setAttribute('style','color: '+color+';text-align: center;')
    let regResult = document.getElementById('regResult')
        if (regResult){
            regResult.innerHTML='';
            regResult.appendChild(resultDiv);
        }

});

socket.on ('API-Login', function (data){
    if (data.loginCheck) {
        clientLog(data.token)
        chatStorage.setItem('token', data.token)

        window.location.href = '/chat';
    }   else {
        console.log('токен не случился потомушо '+data.loginCheck)
        let loginCheck = document.getElementById('loginCheck')
        if (loginCheck){
            loginCheck.innerHTML='';
            loginCheck.innerText='не угадал';
        }
    }
    })



socket.on('API-GetChatHistory', function (data)
{
    clientLog(JSON.stringify(data))
    let hstORnew = 'history';
    let x = JSON.stringify(data.history);
    let messageHistoryArrayCUT = JSON.parse(x);
    for (let i = 0; i < messageHistoryArrayCUT.length; i++) {
        zapisat('msgArea'+data.type+data.id,
            messageHistoryArrayCUT[i].name,
            messageHistoryArrayCUT[i].text,
            messageHistoryArrayCUT[i].senderId,
            messageHistoryArrayCUT[i].attach,
            messageHistoryArrayCUT[i].ava,
            messageHistoryArrayCUT[i].time,
            hstORnew
            )
    }
})

socket.on ('API-GIVE', function (data){
    if (data.type === 'bd'){
        zapolnit(data.database);
    }
    if (data.type === 'error'){
        alert('у вас недостаочно прав!')
    }
})

socket.on ('API-systemMessage', function (data){
    zapisatSysMessage(String(data.text));
    console.log(data.text);
})

socket.on('API-infoAboutUser', function (data){
    openUserProfileInfo(data.myFriends, data.user)
})

// socket.on('API-GetBackgroundPresets', function (data)
//     {presetsSelector(data)}
// )