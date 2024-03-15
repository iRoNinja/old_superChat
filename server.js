const express = require('express'); // подключение библиотеки Express

var fileUpload = require('express-fileupload');
var app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
}); // подключение библиотеки Socket.IO

// Настройка сервера HTTP
const port = 3000;
const host = '0.0.0.0';
server.listen(port, host);

// Вывод HTML файла
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true, limit: '1mb'}))

app.get('/', function (request, respons) {
    respons.sendFile(__dirname + '/chat.html');
});
app.get('/login', function (request, respons) {
    respons.sendFile(__dirname + '/login.html');
});

app.get('/chat', function (request, respons) {
    respons.sendFile(__dirname + '/chat.html');
});

app.get('/profile', function (request, respons) {
    respons.sendFile(__dirname + '/profile.html');
});

app.get('/settings', function (request, respons) {
    respons.sendFile(__dirname + '/settings.html');
    // fs.readdir('./public/backgrounds/presets', (err, files) => {
    //     if (err)
    //         console.log(err);
    //     else {
    //         respons.end(JSON.stringify({fonPresets: files}));
    //
    //     }
    // })
});

app.get('/getfonpresets', function (request, respons) {

    fs.readdir('./public/backgrounds/presets', (err, files) => {
        if (err)
            console.log(err);
        else {
            respons.end(JSON.stringify({fonPresets: files}));

        }
    })
});

app.post('/saveProfileData', function (request, respons) {
    let userName = request;
    console.log('----- nicknameset ----')

    //
    // const buffers = [];   // буфер для получаемых данных
    //
    // // получаем данные из запроса в буфер
    //
    //     buffers.push(chunk);
    //
    // // получаем строковое представление ответа
    // let userName = Buffer.concat(buffers).toString();
    // userName = userName + " Smith";
    // respons.end(userName);
     console.log(userName)

    console.log('----- nicknameset ----')
    respons.end('test');
});

app.get('/adminka', function (request, respons) {
    respons.sendFile(__dirname + '/adminka.html');
});

app.use(fileUpload({}));

app.use(express.static('public'));

app.post('/upload', function (req, res) {
    console.log('========Файл загружен==========')
    let fileName =req.files.photo.name;
     fileName = Buffer.from(fileName, 'binary');
    //console.log(decodeW(body))
    console.log('binary: '+(fileName))

    let filetoken = genToken()+'_'+fileName;
    req.files.photo.mv('public/uploads/'+filetoken);
     res.end('uploads/'+filetoken);

});
app.post('/fon', function (req,res){
    let responseResult='error';
    let imgLoadDestination = req.headers.imgtype;

    serverLog('получен запрос на загрузку ФОНА');
    serverLog('тип загрузки: '+req.headers.imgtype)

        if (imgLoadDestination==='fon'){
            serverLog('тип загрузки: '+req.headers.imgtype)

            let fileName =req.files.img.name;
            fileName = Buffer.from(fileName, 'binary');
            //console.log(decodeW(body))
            console.log('binary: '+(fileName))

            let filetoken = genToken()+'_'+fileName;
            req.files.img.mv('public/backgrounds/'+filetoken);
            responseResult="backgrounds/"+filetoken;
        }


    res.end(JSON.stringify({fonimgURL: responseResult}));
})

// Приветствие в логе при старте сервера
console.log('------------------------------------');
console.log('---- ' + getCurrentTime() + 'SERVER STARTED -----');
console.log('------------------------------------');


// База даных пользователей
const fs = require('fs');
const {urlencoded} = require("express");
const {result} = require("loadsh/object");
const {slice, sortedUniq} = require("loadsh/array");
if (!fs.existsSync('usersDB.json')) {
    fs.writeFileSync('usersDB.json', '[]', 'utf8');
}

usersDB = fs.readFileSync('usersDB.json', 'utf8');
let fil ='';
// Массивы пользователей
registeredUsers = JSON.parse(usersDB);

// сравнивает образец стандартного пользователя и тех кто в базе даных, и добавляет недостающие поля старым пользователям, после изменения стандарта
function checkStandartUser() {
    let newUser = new User() // стандартный пользователь
    let testUser = Object.keys(newUser) // сборник свойств (полей) обьекта "стандартный пользователь"
    let stringTestUser = JSON.stringify(testUser) // все эти свойства (поля) в стороковом представлении

    for (let i = 0; i < registeredUsers.length; i++) { //пробегаем по всей базе даных пользователей
        let ourUser = Object.keys(registeredUsers[i]) // сборник свойств (полей) реального пользователя
        let stringOurUser = JSON.stringify(ourUser) // все свойства (поля) в стороковом представлении

        if (stringTestUser !== stringOurUser){ //сравнить сборники свойств можно только как строку
            // console.log('свойства пользователя '+i+' и standart юзера отличаются ')
            for (let j=0; j<testUser.length; j++) { // цикл по всем свойствам (полям) обьекта у "стандартного пользователь"
                if (testUser[j] !== ourUser[j]) {// если поле "стандартного пользователя" не совпадает полем реального человека в базе даных
                    let name = String(testUser[j]) // имя поля, взято у стандартного ползователя
                    registeredUsers[i][name]=newUser[name]; // записываем новое поле и присваиваем ему стандартное значение
                    // console.log("ему добавлено свойство #"+j+' '+name+'стандартное значение: '+value)
                }
            }
        }
    }
    fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));//записываем нашу базу даных реальных пользователей, с новыми полями в файлик
    serverLog('База даных стандартизирована!')
}

/// Стандартному пользователю можно добавлять поля ТОЛЬКО В КОНЕЦ !!!! Иначе функция поломает базу даных!
checkStandartUser()

serverLog("Users DataBase loaded", '', '', '');

connections = [];
onlineUsers = [];

// Событие "Поделючение"
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    serverLog('Somebody connected', '', '', socket.handshake.issued);

    //Проверка регистрации
    socket.emit('API-checkRegistration',);
    serverLog('CheckRegistration', '', '', socket.handshake.issued);
    socket.on('API-checkRegistration', function (data) {
        if (data.newUser == 'newUser') {
            serverLog('API-checkRegistration: Unknown user.', '', '', '')
           // registUser('', connections.indexOf(socket), String(socket.handshake.issued));
        }

        if (data.token){
            // let someUser = {
            //     name: data.myName,
            //     id: data.myId,
            //     unicConnection: socket.handshake.issued,
            //     lastConnection: getGlobalTime()
            // }
            let someUser = getUserByToken(data.token);
                if (someUser){
                    console.log(getCurrentTime()+'API-checkRegistration: User ['+someUser.nick+'] connected to chat')
                    someUser.unicConnection = socket.handshake.issued;
                    socket.emit('API-UserInfo', {nick:someUser.nick,
                                                ava:someUser.ava,
                                                login:someUser.login,
                                                clientId: someUser.id,
                                                isAdmin: someUser.isAdmin,
                                                ban: someUser.ban})

                    //push online
                    onlineUsersUpdate(someUser,'add')
                } else {

                    serverLog('API-checkRegistration: Unknown user.', '', '', '')
                }

            // serverLog('User [' + someUser.nick + '] say, that he is already registered, check it.', someUser.nick, someUser.id, someUser.unicConnection);
            // let i = 0;
            // let isUser = false;
            // while (i < registeredUsers.length) {
            //     if (registeredUsers[i].id == someUser.id) {
            //         isUser = true;
            //         //существует
            //         let oldLastConnection = registeredUsers[i].lastConnection;
            //         serverLog('Yes, he is registered.', someUser.nick, someUser.id, someUser.unicConnection)
            //         registeredUsers[i].lastConnection = getGlobalTime();
            //         registeredUsers[i].unicConnection = socket.handshake.issued;
            //         fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
            //         if (getUserIndexByID(onlineUsers, someUser.id) === -1) {
            //             onlineUsers.push(someUser);
            //             if ((Number(registeredUsers[i].lastConnection) - Number(oldLastConnection)) > 3000) {
            //                 io.sockets.emit("API-UserConnected", {
            //                     name: registeredUsers[i].name,
            //                     id: registeredUsers[i].id
            //                 });
            //                 serverLog('Tell to all users, that user connected', registeredUsers[i].name, registeredUsers[i].id, registeredUsers[i].unicConnection)
            //             }
            //             // добавили в список онлайновых someUser;
            //         }
            //         clientShowOnlineUsers();
            //         break;
            //     }
            //     ;
            //     i++
            // }
            // ;
            // if (isUser == false) {
            //     // console.log(getCurrentTime()+'No, he isnt registered, change his name to randomName');
            //     serverLog('No, he isnt registered, change his name to randomName', someUser.name, someUser.id, someUser.unicConnection)
            //    // registUser('', connections.indexOf(socket), String(socket.handshake.issued));
            // }
            // ;                                //проверить существует ли такой id вообще??
            // //если нет  - то сказать ты петух, и присвоить новые данные ему
            // //если есть - onlineUsers.push(user)
        }
        ;
    });

    socket.on('API-UserEnterToChat',function (data){
        console.log('API-UserEnterToChat: User with token ['+data.token+'] enter to chat')
        console.log('Check this token')
        //check token and get user if token exist
        let user = getUserByToken(data.token);
        if (user) {
            console.log('Token ['+data.token+'] OK')
            user.unicConnection = socket.handshake.issued;
            socket.emit('API-UserInfo', {nick:user.nick, ava:user.ava, login:user.login,clientId: user.id})

            //update onlineUsers and send user to clients
            //onlineUsers.push(user);
            onlineUsersUpdate(user,'add');
        } else {
            console.log('token invalid')
        }
        //return some info to user
        //profileDataUpdate()

    });

    socket.on('API-GetChatHistory', function (data){
        let messageHistoryArrayCUT = getMessageHistory(data.token, data.type, data.id, 100)
        socket.emit('API-GetChatHistory', {type:data.type,id:data.id, history: messageHistoryArrayCUT})
    })

    socket.on('API-UpdateProfileInfo',function (data){
        let result=null;
        console.log('API-UpdateProfileInfo запрос: '+data.login +' token: ['+data.token+']')
        console.log('Check this token')
        //check token and get user if token exist
        let user = getUserByToken(data.token);
        if (user ) {
                     console.log('API-UpdateProfileInfo: ['+user.login+'] valid. Update his data.')
                        let updatedUser = new User(
                            user.login,
                            data.passNew,
                            data.nick,
                            user.id,
                            socket.handshake.issued,
                            getGlobalTime(),
                            user.token,
                            data.ava
                        );

                        result=  profileDataUpdate(data.token,data.nick,data.ava,{passOld: data.passOld,passNew:data.passNew});
                    } else
                        {
                             console.log('This user invalid')
                        }
        if (result!=null){
            socket.emit('API-UserInfo', {nick:result.user.nick, ava:result.user.ava, login:result.user.login,resultString: result.resultString})
        }
            else {
                    socket.emit('API-UserInfo',{error: 'error'})
                  }


    });

    socket.on('API-NewUserRegist', function (data){
        console.log('__________\n'+data.login+'\n'+data.pass+'\n'+data.nick+'\n'+data.ava+'\n___________');
        let  sUser = new User(data.login,data.pass,data.nick,'',String(socket.handshake.issued),getGlobalTime(),'',data.ava)
        let result=newUserRegestration(sUser);
        if (result==='registeredDONE') {
            //done
            console.log('Registration successful')
            console.log('send message to client that Register done')
            socket.emit('API-RegResult',{regMsg: 'DONE'})
        } else
            {
                if (result==='user already registered') {
                 console.log('send message to client that try different login')
                  socket.emit('API-RegResult',{regMsg: 'TryMore'})
                }
            }
    })

    socket.on('API-Login', function (data){
        console.log('API-Login принят: '+data.login)
        let loginCheck = false;
        let token = '';
        for (let i = 0; i < registeredUsers.length; i++) {
            if ((data.login === registeredUsers[i].login) &&
                (data.pass === registeredUsers[i].pass))
            {
                token = genToken();
                console.log('для ['+data.login+'] сгенерирован токен: ['+token+']')
                updateToken(i,token);
                loginCheck = true;
                break;
            }
        }
        socket.emit('API-Login', {token: token, loginCheck:loginCheck})
        if (loginCheck) {console.log('токен улетел пользователю')}
        else {console.log('лоогин или пароль неверный')}
    })

    socket.on('API-Logout', function (data){
        profileDataUpdate(data.token,'','','', true)
    })
    // Событие "отключение
    socket.on('disconnect', function (data) {
        let myIndex = Number(getUserIndexByUnicConnection(registeredUsers, socket.handshake.issued));
        let user = null;
        if (myIndex > -1) {
            user=getUserByToken( registeredUsers[myIndex].token)
        }

        if (myIndex > -1) {
            registeredUsers[myIndex].lastConnection = getGlobalTime();
            fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
            var x = registeredUsers[myIndex].unicConnection
            setTimeout(function () {
                var y = registeredUsers[myIndex].unicConnection
                if (x === y) {
                    io.sockets.emit("API-UserDisconnected", {
                        name: registeredUsers[myIndex].nick,
                        id: registeredUsers[myIndex].id
                    })
                    console.log(getCurrentTime()+'API-Disconnect: User['+registeredUsers[myIndex].nick+'] disconnected.')
                } else {
                    serverLog('API-Disconnected: Пользователь переподключился', registeredUsers[myIndex].nick, registeredUsers[myIndex].id, registeredUsers[myIndex].unicConnection)
                }
            }, 3000);
        }

        let bufferUserIndex = connections.indexOf(socket);
        let onlineUserDiconnectionIdex = getUserIndexByUnicConnection(onlineUsers, socket.handshake.issued);

        connections.splice(bufferUserIndex, 1);
        if (onlineUserDiconnectionIdex > -1) {
            // console.log(getCurrentTime()+onlineUsers[onlineUserDiconnectionIdex].name+' disconnected from server'); //onlineUserDiconnectionIdex
            serverLog('API-Disconected: [' + onlineUsers[onlineUserDiconnectionIdex].nick + '] disconnected from server', onlineUsers[onlineUserDiconnectionIdex].name, onlineUsers[onlineUserDiconnectionIdex].id, socket.handshake.issued);
            onlineUsers.splice(onlineUserDiconnectionIdex, 1); //onlineUserDiconnectionIdex
        }
        clientShowOnlineUsers();
        //console.log(onlineUsers);
        //changeUserName(-1,-1);
    });

    // socket.emit("API-sendMessage", {type:type, id:id, text:text})
    socket.on("API-sendMessage", function (data){
            sendMessage(data.token,data.type,data.id,data.text, socket.handshake.issued,data.attach);
    })

    // Событие "публичное сообщение"
    // socket.on("public message", function (data) {
    //     //check name
    //
    //
    //     if (findUserNameByID(registeredUsers, senderUser.id) !== data.name) {
    //         changeUserName(senderUser.id, data.name, socket.handshake.issued);
    //     }
    //     ;
    //
    //     io.sockets.emit("add message", {nameToCl: data.name, messageToCl: data.message});
    //     // console.log(getCurrentTime()+data.name+" написал сообщение");
    //     serverLog('[' + data.name + '] написал сообщение ', data.name, data.id, socket.handshake.issued)
    // });
    // Событие Приватное сообщение
    // socket.on("API-PrivateMessage", function (data) {
    //     let senderUser = {name: data.name, id: data.id};
    //
    //     if (findUserNameByID(registeredUsers, senderUser.id) !== data.name) {
    //         changeUserName(senderUser.id, data.name, socket.handshake.issued);
    //     }
    //     ;
    //
    //     var reciverIndex = getUserIndexByID(onlineUsers, data.reciverID);//
    //     var senderIndex = getUserIndexByID(onlineUsers, data.id);//
    //
    //     if (reciverIndex >-1)
    //     {
    //         connections[reciverIndex].emit("API-PrivateMessage", {
    //             nameToCl: data.name,
    //             messageToCl: data.message,
    //             tab: data.id
    //         })
    //         connections[senderIndex].emit("API-PrivateMessage", {
    //             nameToCl: data.name,
    //             messageToCl: data.message,
    //             tab: data.reciverID
    //         })
    //         // console.log(getCurrentTime()+"Получено приватное сообщение от: "+senderUser.id+" для: "+data.reciverID);
    //         serverLog("Приватное сообщение от: ", senderUser.name, senderUser.id, socket.handshake.issued);
    //         let reciverName = onlineUsers[getUserIndexByID(onlineUsers, data.reciverID)].name;
    //         let reciverIssued = onlineUsers[getUserIndexByID(onlineUsers, data.reciverID)].unicConnection;
    //         serverLog("Получатель: ", reciverName, data.reciverID, reciverIssued);
    //     } else
    //      {
    //          connections[senderIndex].emit("API-SysMessage", {
    //          Params: '',
    //          text:'\"'+findUserNameByID(registeredUsers,data.reciverID)+'\" оффлайн, и не увидит ваше сообщение.',
    //          tab: data.reciverID
    //          });
    //          connections[senderIndex].emit("API-PrivateMessage", {
    //              nameToCl: data.name,
    //              messageToCl: data.message,
    //              tab: data.reciverID
    //          });
    //
    //      }
    // })
    // Назначить имя пользователю
    socket.on("API-SetMyNameTo", function (data) {
        changeUserName(connections.indexOf(socket), data.myName, String(socket.handshake.issued));
    });

    socket.on("API-GET", function (data){
        if(data.token){
            if (getUserByToken(data.token).isAdmin === true) {
                if (data.type === "bd") {
                    fil = data.filters
                    let db = getDBbyFilters(fil);
                    socket.emit('API-GIVE', {type: 'bd', database: db})
                }
            }
            else {socket.emit('API-GIVE', {type:'error'});
                console.log ('Хацкер с токеном хочет базочку')}
        }
    else {socket.emit('API-GIVE', {type:'error'});
        console.log ('Хацкер без токена хочет базочку')
    }
    });

    socket.on('API-MakeAdmin', function (data){
       if(data.chex.length>0){ let checkboxArray = JSON.stringify(data.chex)
        for (let i=0; i<data.chex.length; i++){
            let r=dbSetAdmin(data.token,data.chex[i].id,data.chex[i].checked)
            if (r.r1===true && data.publicBox===true){
                io.sockets.emit('API-systemMessage', {text: r.r2})
            }
        }
           socket.emit('API-GIVE', {type: 'bd', database: getDBbyFilters(fil)})

    }})

    socket.on('API-Ban', function (data) {
        if(data.banx.length>0){ let banboxArray = JSON.stringify(data.banx)
            for (let i=0; i<data.banx.length; i++){
            let r = dbSetBan(data.token,data.banx[i].id,data.banx[i].checked);
            if (r.r1===true && data.publicBox===true){
                io.sockets.emit('API-systemMessage', {text: r.r2})
            }}
        socket.emit('API-GIVE', {type: 'bd', database: getDBbyFilters(fil)})

    }})

    socket.on('API-infoAboutUser', function (data){
        if(getUserByToken(data.token)!=null){
           let user = {
               nick:registeredUsers[data.userID].nick,
               id:registeredUsers[data.userID].id,
               ava:registeredUsers[data.userID].ava,
               isAdmin: registeredUsers[data.userID].isAdmin,
               ban: registeredUsers[data.userID].ban,
               lastOnline: registeredUsers[data.userID].lastConnection
           }
           let myFriends = registeredUsers[getUserByToken(data.token).id].friends
            console.log(myFriends);
           socket.emit('API-infoAboutUser', {user,myFriends})
        }

    })

    socket.on('API-Friend', function (data){
        addFriend (data.token, data.friendID)
    })

    socket.on("API-GetCustomUserList", function (data){
        console.log('API-GetCustomUserList - data.filter='+data.filter)
            let finalList = JSON.stringify(filterUsers(registeredUsers, data.filter, data.token))
            socket.emit("API-SetUsersList", {usersList: finalList})
    })

    // socket.on("API-GetBackgroundPresets", function (data) {
    //     fs.readdir('./public/backgrounds/presets', (err, files) => {
    //         if (err)
    //             console.log(err);
    //         else {
    //            socket.emit('API-GetBackgroundPresets', files)
    //         }
    //     })
    // })
});
const path = require('path');

function addFriend (token, friendID){
    if (!registeredUsers[getUserByToken(token).id].friends.includes(friendID)){
        registeredUsers[getUserByToken(token).id].friends.push(friendID)
        console.log('добавили друга'+friendID)
    }
    else {
        registeredUsers[getUserByToken(token).id].friends=
            registeredUsers[getUserByToken(token).id].friends.filter((n)=>{return n!=friendID})
        console.log('удалили друга'+friendID)}
    fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers))
}

function onlineORlastConnection (){
    for (let i = 0; i < registeredUsers.length; i++) {
        let someIndex=-1;
        for (let j = 0; j < connections.length; j++) {
            if (connections[j].handshake.issued===registeredUsers[i].unicConnection){
                someIndex=j;
            }
        }

        if (someIndex > -1 && connections[someIndex].handshake.issued === registeredUsers[i].unicConnection) {
            registeredUsers[i].lastConnection = 'online';
        }
        fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers))
    }
}

setInterval(onlineORlastConnection, 5000);

function getDBbyFilters (filters){
    let DB = null;
    if (filters.all === true){
        DB = registeredUsers}

    if (filters.admins === true) {
        DB = registeredUsers.filter(function (e){return e.isAdmin===true})
    }

    if (filters.banned === true) {
        DB = registeredUsers.filter(function (e){return e.ban===true})
    }

    if (filters.banned === true && filters.admins === true) {
        DB = registeredUsers.filter(function (e){return e.ban===true && e.isAdmin===true})
    }

    let DBB = JSON.stringify(DB);
    return DBB;
}


function sendMessage (token,type,id,text, issued,attach){
   // let senderUser = {token: token, id:registeredUsers[getUserIndexByUnicConnection(onlineUsers,issued)].id};
  let senderUser = getUserByToken(token);

   if (senderUser) {// if (findUserNameByID(registeredUsers, senderUser.id) !== senderUser.nick) {
        //     changeUserName(senderUser.id, name, issued);
        // }
        if (type === "Room") {
            let avatar = senderUser.ava;
            if(senderUser.ban===true){
                text='я забаненый лох';
                attach='';
                // a='uploads/ban.jpg'
                }
            let message = {
                name: senderUser.nick,
                ava: avatar,
                type: type,
                id: id,
                text: text,
                senderId: senderUser.id,
                attach: attach,
                time: getCurrentTime('no skobki ![]')
            }
            io.sockets.emit("API-receiveMessage", message);
            messageHistoryWrite (message);
            serverLog('[' + senderUser.nick + '] написал сообщение в комнату: [' + id + ']', senderUser.nick, senderUser.id, issued)
        }
        if (type === "User") {
            let senderIndex = getUserIndexByUnicConnection(onlineUsers, issued);
            //console.log(onlineUsers[senderIndex])
            let receiverIndex = getUserIndexByID(onlineUsers, id); //sender id = 6 receiver = 36
            let messageToReceiver = {
                name: getUserByToken(token).nick,
                ava:senderUser.ava,
                type: type,
                id: onlineUsers[senderIndex].id, //6
                text: text,
                senderId: senderUser.id,//6
                receiverId: id,//36
                attach: attach,
                time: getCurrentTime('no skobki ![]')
            }
            let messageToSender = {
                name: senderUser.nick,
                ava:senderUser.ava,
                type: type,
                id: id,//36
                text: text,
                senderId: senderUser.id,//6
                receiverId: id, //36
                attach: attach,
                time: getCurrentTime('no skobki ![]')
            }
            if (receiverIndex > -1) {
                connections[receiverIndex].emit("API-receiveMessage", messageToReceiver);
                messageHistoryWrite (messageToReceiver,onlineUsers[senderIndex].id,id);
                connections[senderIndex].emit("API-receiveMessage", messageToSender);
                messageHistoryWrite (messageToSender,id,onlineUsers[senderIndex].id);
                serverLog('[' + senderUser.nick + '] написал приватное сообщение для: [' + findUserNameByID(registeredUsers, id) + ']' + ' id: [' + id + ']', senderUser.nick, onlineUsers[senderIndex].id, issued)
            } else {
                connections[senderIndex].emit("API-SysMessage", {
                    type: type, // Room/User
                    id: id, //of user or tab
                    params: 'userOffline',// newRegisteredUser, userOffline, userIncome,userComeIn, userChangeName
                    text: '\"' + findUserNameByID(registeredUsers, id) + '\" вышел из чата, и вернется кадата',
                    senderId: senderUser.id,
                    attach: attach
                });
                connections[senderIndex].emit("API-receiveMessage", {
                    name: senderUser.nick,
                    ava:senderUser.ava,
                    type: type,
                    id: id,
                    text: text,
                    senderId: senderUser.id,
                    attach: attach
                });
            }
        }
    }
    else {
       console.log(getCurrentTime()+'Unknown user try to chating. (issued: ['+issued+']')
   }
}

//запись сообщения в базу даных истории
function  messageHistoryWrite (msg,from='',to='') {
    let fileName = '';
    if (msg.type === "Room") {fileName = 'MessageHistory/' + msg.type + msg.id + '.json';}
    if (msg.type === "User") {fileName = 'MessageHistory/' + msg.type + '_from[' + from + ']_to[' + to + '].json'}

    if (!fs.existsSync(fileName)) {fs.writeFileSync(fileName, '[]', 'utf8');}
        let messageHistoryDB = fs.readFileSync(fileName, 'utf8');
        let messageHistoryArray = JSON.parse(messageHistoryDB);
        messageHistoryArray.push(msg);
        fs.writeFileSync(fileName, JSON.stringify(messageHistoryArray));
        serverLog('+1 message added to history', '', '', '')
}

//считываем базу даных и получаем сокращенную историю
function getMessageHistory(token,type,id,countLastMsg) {
   let fileName = '';
    if (type === 'Room') {fileName = 'MessageHistory/'+type+id}
    if (type === 'User' && getUserByToken(token)) {fileName = 'MessageHistory/' + type + '_from[' + getUserByToken(token).id + ']_to[' + id+']' }
     fileName = fileName+'.json';
    if (fs.existsSync(fileName)) {
             let messageHistoryDB = fs.readFileSync(fileName, 'utf8');
             let messageHistoryArray = JSON.parse(messageHistoryDB);
            let messageHistoryArrayCUT = messageHistoryArray.slice(-countLastMsg)
            return messageHistoryArrayCUT
        } else return null;
}

//новая функция регистрации
function newUserRegestration(user) {
    let status = 'error';
    console.log('Вызвана функция регистрации, логин: ['+user.login+']'+' nick: '+user.nick)

    if (isUserRegistered(user)){
        status='user already registered';
        console.log(status)
    } else {
                let newUser= new User(
                    user.login,
                    user.pass,
                    user.nick,
                    registeredUsers.length,
                    user.unicConnection,
                    getGlobalTime(),
                    '',
                    user.ava,
                    false,
                    false,
                    '[]');

                pushNewUser(newUser);
            status='registeredDONE';
            }
return status;
}

function onlineUsersUpdate(user,action){
    if (action==='add'){
        if(onlineUsers.indexOf(user)===-1) {
            onlineUsers.push(user)
        }
    }
    if (action==='remove'){
        if (onlineUsers.indexOf(user)>-1 ) {
            onlineUsers.splice(onlineUsers.indexOf(user), 1)
        }
    }
    clientShowOnlineUsers();
};

function pushNewUser(user) {
    console.log('Push new user to DB and send sysmessage WelcomeNewUser')
    registeredUsers.push(user);
    fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
    io.sockets.emit("API-WelcomeNewUser", {newUserName: user.nick, newUserId: user.id});
}

function updateToken (userIndex,token){
    registeredUsers[userIndex].token = token;
    fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
    console.log('токен обновлен')
};

function profileDataUpdate(token='',nick='',ava='',pass='',change = false){
    let user = null;
    let result = null;

    for (let i = 0; i < registeredUsers.length; i++) {
        if(token===registeredUsers[i].token){
                result='';
                if (nick!= '' && nick != registeredUsers[i].nick){
                    registeredUsers[i].nick=nick;
                    result=result+'Никнейм изменен. ';
                    console.log(getCurrentTime()+'profileUpdate: '+registeredUsers[i].login+' changed his nickname.')

                }
                if (ava!='' && ava!= registeredUsers[i].ava){
                    registeredUsers[i].ava=ava;
                    result=result+'Аватар изменен. ';
                                    console.log(getCurrentTime()+'profileUpdate: '+registeredUsers[i].login+' changed his avatar.')
                                }
                if (pass!='')  {
                    if (pass.passOld === registeredUsers[i].pass) {
                        if (pass.passNew != '' && pass.passNew != registeredUsers[i].pass && pass.passNew.length > 7) {
                            registeredUsers[i].pass = pass.passNew;
                            result = result + 'Пароль изменен. ';
                            console.log(getCurrentTime() + 'profileUpdate: ' + registeredUsers[i].login + ' changed his pass.')

                        } else {
                            result = result + 'Пароль не изменен. '
                        }
                    } else {
                        if (pass.passOld != '' && pass.passOld.length > 7) {
                            result = result + 'Вы ввели неверный пароль. ';
                            console.log(getCurrentTime() + 'profileUpdate: ' + registeredUsers[i].login + ' invalid pass.')

                        }
                    }
                }
                if (change) {
                    registeredUsers[i].token = '';
                    console.log('разлогинился');
                }

            user=registeredUsers[i];
            fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
            break;
        }
    }

    return {resultString: result,user: user};
}

if (!fs.existsSync('adminBanLog.json.json')) {fs.writeFileSync('adminBanLog.json', '[]', 'utf8');}
let adminBanLog = fs.readFileSync('adminBanLog.json','utf8');
let adminBanLogArray = JSON.parse(adminBanLog);

function dbSetBan (adminToken='',userIdToSet='',ban='notUsed'){
    let user = null;
    let result = false;
    let resultString ='';

    for (let i = 0; i < registeredUsers.length; i++) {
        if(adminToken!='' && getUserByToken(adminToken).isAdmin===true)  {

            if (ban !== 'notUsed' && Number(registeredUsers[i].id)===Number(userIdToSet)) {
                registeredUsers[i].ban = ban;
                if (ban === true){
                    resultString = "Админ ["+getUserByToken(adminToken).nick +'] забанил ['+registeredUsers[i].nick+"]"
                    if (registeredUsers[i].isAdmin===true) {
                        registeredUsers[i].isAdmin = false
                        let setLog = {
                            time: getCurrentTime(),
                            adminID: getUserByToken(adminToken).id,
                            adminLogin: getUserByToken(adminToken).login,
                            do: 'admin ' + registeredUsers[i].isAdmin,
                            setAdminID: registeredUsers[i].id,
                            setAdminLogin: registeredUsers[i].login
                        }
                        adminBanLogArray.push(setLog);
                        fs.writeFileSync('adminBanLog.json', JSON.stringify(adminBanLogArray))
                    }
                }
                else {resultString = "Админ ["+getUserByToken(adminToken).nick +'] разбанил ['+registeredUsers[i].nick+"]"}
                let banLog = {
                    time: getCurrentTime(),
                    adminID: getUserByToken(adminToken).id,
                    adminLogin: getUserByToken(adminToken).login,
                    do: 'ban '+registeredUsers[i].ban,
                    banID: registeredUsers[i].id,
                    banLogin: registeredUsers[i].login
                }

                adminBanLogArray.push(banLog)
                fs.writeFileSync('adminBanLog.json', JSON.stringify(adminBanLogArray))
                user = registeredUsers[i];
                fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
                result = true;

            }

        } else result=false
    }
    let r={r1:result, r2:resultString}
    return r;
}

function dbSetAdmin(adminToken='',userIdToSet='',isAdmin='notUsed'){
    let user = null;
    let result = false;
    let resultString ='';

    for (let i = 0; i < registeredUsers.length; i++) {
      if(adminToken!='' && getUserByToken(adminToken).isAdmin===true)  {
                if (isAdmin !== 'notUsed' && Number(registeredUsers[i].id)===Number(userIdToSet)) {
                    registeredUsers[i].isAdmin = isAdmin;
                    if (isAdmin===true){
                        resultString = "Админ ["+getUserByToken(adminToken).nick +'] назначил ['+registeredUsers[i].nick+"] админом"
                    }
                    else { resultString = "Админ ["+getUserByToken(adminToken).nick +'] забрал право админства у ['+registeredUsers[i].nick+"]"}
                    let setLog = {
                        time: getCurrentTime(),
                        adminID: getUserByToken(adminToken).id,
                        adminLogin: getUserByToken(adminToken).login,
                        do: 'admin '+registeredUsers[i].isAdmin,
                        setAdminID: registeredUsers[i].id,
                        setAdminLogin: registeredUsers[i].login
                    }

                    adminBanLogArray.push(setLog)
                    fs.writeFileSync('adminBanLog.json', JSON.stringify(adminBanLogArray))
                    user = registeredUsers[i];
                    fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
                    result=true;
                }

        } else result=false
    }
    let r={r1:result, r2:resultString}
    return r;
}

function genToken (){
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for(let i = 0; i < 12; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

function getUserByToken(token) {
    let user = null;
    for (let i = 0; i < registeredUsers.length; i++) {
        if (registeredUsers[i].token===token){
            user=registeredUsers[i];
            break
        }
    }
    return user;
}

// Изменяет имя ползователя
function changeUserName(id, newName, sockedIssued) {
    if (id > -1) {
        serverLog("[" + findUserNameByID(registeredUsers, id) + '] change name to: [' + newName + ']', findUserNameByID(registeredUsers, id), id, sockedIssued);
        io.sockets.emit("API-NameChangedUser", {nameBefore: findUserNameByID(registeredUsers, id), nameAfter: newName});
        registeredUsers[getUserIndexByID(registeredUsers, id)].name = newName;
        onlineUsers[getUserIndexByID(onlineUsers, id)].name = newName;
        connections[getUserIndexByUnicConnection(onlineUsers, sockedIssued)].emit('API-setClientName', {
            clientName: newName,
            clientId: onlineUsers[getUserIndexByUnicConnection(onlineUsers, sockedIssued)].id
        });
    }
    ;
    io.sockets.emit('API-SetUsersList', {usersList: JSON.stringify(filterUsers(onlineUsers,'online'))});
};

// находит индекс пользователя в массиве, зная его ID
function getUserIndexByID(usersArray, id) {
    let userIndex = -1;
    let i = 0;
    while (i < usersArray.length) {
        if (usersArray[i].id == id) {
            userIndex = i;
        }
        i++;
    }
    ;
    return userIndex;

};

// находит ID пользователя, зная его ISSUED
function getUserIndexByUnicConnection(usersArray, unicConnection) {
    let userIndex = -1;
    let i = 0;
    while (i < usersArray.length) {
        if (Number(usersArray[i].unicConnection) == Number(unicConnection)) {
            userIndex = i;

        }
        i++;
    }
    ;
    return userIndex;

};

//функция поиска в базе данных, возвращаеттру фолс
function isUserRegistered(user){
    let answer = false;

    const login = user.login;
    const usersArray = registeredUsers;

    for (let i = 0; i < registeredUsers.length; i++) {
        if (login===registeredUsers[i].login){
            answer=true;
            break
        }
    }
return answer;
}

// Функция регистрации
function registUser(user, socketIndex, socketIssued) {

    let buffStr = JSON.stringify(user);
    let jsonUsers = JSON.stringify(registeredUsers);

    let someUser =  new User('','',
        user,
        registeredUsers.length,
        socketIssued,
        getGlobalTime(),
        '',
        'uploads/standartUser.jpeg'
    );

    if (isUserRegistered(someUser)) {
        serverLog('User is already registeged!', user, '', '', socketIssued)
    } else {
        // let newUser = {
        //     name: 'User' + String(registeredUsers.length),
        //     id: registeredUsers.length,
        //     unicConnection: socketIssued,
        //     lastConnection: getGlobalTime()
        // }

       let  newUser = new User('','',
            'User' + String(registeredUsers.length),
            registeredUsers.length,
            socketIssued,
            getGlobalTime(),
            ''
            );

        serverLog('registration, set randomName: ', newUser.name, newUser.id, newUser.unicConnection);
        registeredUsers.push(newUser);
        fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
        onlineUsers.push(newUser);
        fs.writeFileSync('usersDB.json', JSON.stringify(registeredUsers));
        io.sockets.emit("API-WelcomeNewUser", {newUserName: newUser.name, newUserId: newUser.id});
        connections[socketIndex].emit('API-setClientName',
            {clientName: newUser.name, clientId: newUser.id});
        clientShowOnlineUsers();
    }
    ;

    let buff = JSON.stringify(registeredUsers);
};

// Отображения списка онлайн пользователей на клиенте
function clientShowOnlineUsers() {
    io.sockets.emit('API-SetUsersList', {usersList: JSON.stringify(filterUsers(onlineUsers,'online'))});
};

// Возвращает имя пользователя по его ID
function findUserNameByID(usersArray, id) {
    let i = 0;
    let name = null;

    while (i < usersArray.length) {
        if (usersArray[i].id == id) {
            name = usersArray[i].nick;
        }
        ;
        i++;
    }
    ;
    return name;
};

// Настоящее Время hh:mm:ss
function getCurrentTime(type = '[]') {
    let time = new Date();
    let currentTime = '';
    if (type === '[]')
        {currentTime = '[' + ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2) + '] ';
    return currentTime;}
    else
        {currentTime = ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2);}
    return currentTime;
}

//считает время в милисекундах от 1970 года до нынешнего
function getGlobalTime() {
    let time = new Date();
    let GlobalTim = time.getTime();
    return GlobalTim;
}

// Вывод лога на сервере
function serverLog(string, name='', id='', issued='') {
    let namef = "";
    let idf = "";
    let issuedf = "";
    let startSkob = '';
    let endSkob = '';

    if (String(name).length > 0) {
        namef = 'name: [' + name + '], '
    }
    if (String(id).length > 0) {
        idf = 'id: [' + id + '], '
    }
    if (String(issued).length > 0) {
        issuedf = 'issued: [' + issued + ']';
        startSkob = ' (';
        endSkob = ')';
    }
    // console.log(issued);
    console.log(getCurrentTime() + string + startSkob + namef + idf + issuedf + endSkob);
};

function decodeW  (input, options)  {
    let mode;
    if (options && options.mode) {
        mode = options.mode.toLowerCase();
    }
    // “An error mode […] is either `replacement` (default) or `fatal` for a
    // decoder.”
    if (mode !== 'replacement' && mode !== 'fatal') {
        mode = 'replacement';
    }

    const length = input.length;

    // Support byte strings as input.
    if (typeof input === 'string') {
        const bytes = new Uint16Array(length);
        for (let index = 0; index < length; index++) {
            bytes[index] = input.charCodeAt(index);
        }
        input = bytes;
    }

    const buffer = [];
    for (let index = 0; index < length; index++) {
        const byteValue = input[index];
        // “If `byte` is an ASCII byte, return a code point whose value is
        // `byte`.”
        if (0x00 <= byteValue && byteValue <= 0x7F) {
            buffer.push(stringFromCharCode(byteValue));
            continue;
        }
        // “Let `code point` be the index code point for `byte − 0x80` in index
        // single-byte.”
        const pointer = byteValue - 0x80;
        if (INDEX_BY_POINTER.has(pointer)) {
            // “Return a code point whose value is `code point`.”
            buffer.push(INDEX_BY_POINTER.get(pointer));
        } else {
            // “If `code point` is `null`, return `error`.”
            buffer.push(decodingError(mode));
        }
    }
    const result = buffer.join('');
    return result;
};

/// Добавлять поля this. ТОЛЬКО В КОНЕЦ!!!! Иначе функция поломает базу даных!
function User(login, pass, nick, id, unicConnection, lastConnection, token, ava, isAdmin=false, ban=false, friends=[], blockList=[], aboutMe='', test=true, fon=''){
    this.login= login;
    this.pass=pass;
    this.nick = nick;
    this.id= id;
    this.unicConnection= unicConnection;
    this.lastConnection= lastConnection;
    this.token = token;
    this.ava = ava;
    this.isAdmin = isAdmin;
    this.ban = ban;
    this.friends=friends;
    this.blockList = blockList;
    this.aboutMe = aboutMe;
    this.test = test;
    this.fon = fon;

    //Добавлять поля ТОЛЬКО В КОНЕЦ!!!
}


function filterUsers(usersArray=null,filter=null,token) {
    let finalUsers=[];
    if (usersArray && filter){
        if (filter==='online' || filter==='all') {
            finalUsers=usersArray.map(item=>{
                let user={};
                    user.nick=item.nick;
                    user.id=item.id;
                    user.ava=item.ava;
                return user;
            })
        }
        if (filter==='friends'){
           if (getUserByToken(token)) {
                    let friends = getUserByToken(token).friends;
                    for (let k = 0; k < friends.length; k++) {
                        for (let i = 0; i < registeredUsers.length; i++) {
                            if (friends[k] === registeredUsers[i].id) {
                                let user = {}
                                user.nick = registeredUsers[i].nick;
                                user.id = registeredUsers[i].id;
                                user.ava = registeredUsers[i].ava
                                finalUsers.push(user)
                            }
                        }
                    }
                }
              }
            }
    return finalUsers;
}

