var chatStorage = window.localStorage;
function check()
{if (window.location.href.indexOf('/login')===-1) {
	if (chatStorage.getItem('token')) {
	}
	else {window.location.href = '/login'}
}}
check();

// && window.location.indexOf('/login')===-1
var allMessages = document.getElementById("msgAreaRoom0"); //вкладка Общий чат
var tabAllMessages = document.getElementById("RoomTab0"); //вкладка Общий чат
var vashNick = document.getElementById("userNick"); // поле ввода ника
var vasheMessage = document.getElementById("messageInput"); // поле ввода сообещния
var send = document.getElementById("sendMessage"); // кнопка отправки
var divServerStatus = document.getElementById("serverStatusText"); //статус сервера текст
var ServerKrug = document.getElementById("krug"); //статус сервера кружок
 // кеш браузера
var clientId = chatStorage.getItem('clientId'); // id пользователя в кеше браузера
const titleTOP = document.getElementById("titleTOP");// вкладка браузера
var p = 0;// cчетчик новый сообщений во вкладке браузера
	const url = String(window.location.origin);
	//let clearURL = url.slice(0,url.indexOf('.app/')+4);
var socket = io.connect(url);//сюда вставлять ссылочку

let imgView = document.getElementById('imgView');//картинка для большого превью картнки
let imgViewArea = document.getElementById('imgViewArea')//блок для картинки

let soundToogle = true;// отключение звука уведомлений
var ServerStatus = false; // проверка статуса сервера, по умолчанию сервер статус "Не подключен"

window.setInterval(getServerStatus, 2000); // таймаут пинга
// if (vashNick){
// 	vashNick.value = chatStorage.getItem('userNickCash'); // имя пользователя в кеше браузера
// }
// if (profileName){
// 	profileName.innerText = vashNick.value;
// }
//-----------------------------------
//Стартовый блок
//-----------------------------------
zapisatSysMessage('Добро пожаловать в наш ламповый чатик 😊');
zapisatSysMessage('🐞🪳🐝🦋🪲🐞🪳🐝🦋🪲');

//-----------------------------------
//Блок функций
//-----------------------------------

//Записывает новое сообщение в блок с сообщениями
// function zapisat(id, nickFromServer, msgFromServer,senderId,attach) {
// 	const newMsg = document.createElement("div");
// 		newMsg.className = "message";
// 	if (senderId===clientId) {
// 	newMsg.classList.add('messageOwn') ;
// 	}
// 	   	if (senderId!=clientId) {
// 	   	newMsg.classList.add('messageAlien');
// 	   	}
// 	const userInfo = document.createElement("div");
// 	userInfo.className = "userInfo";
//
// 	const userNickname = document.createElement("div");
// 	userNickname.className = "userNickname";
// 	const nickValue = document.createTextNode(nickFromServer);
// 	userNickname.appendChild(nickValue);
// 	userInfo.appendChild(userNickname);
//
// 	const messageTime = document.createElement("div");
// 	messageTime.className = "messageTime";
// 	var currentTime = new Date();
// 	var textTime = ('0' + currentTime.getHours()).slice(-2) + ':' + ('0' + currentTime.getMinutes()).slice(-2) + ':' + ('0' + currentTime.getSeconds()).slice(-2);
// 	const timeValue = document.createTextNode(textTime);
// 	messageTime.appendChild(timeValue);
// 	userInfo.appendChild(messageTime);
// 	newMsg.appendChild(userInfo);
//
// 	const messageText = document.createElement("div");
// 	messageText.className = "messageText";
// 	const textarea = document.createElement("textarea");
// 	const msgValue = msgFromServer;
// 	textarea.value = msgValue;
// 	messageText.appendChild(textarea);
//
// 	if (attach.length>1 ) {
// 		let image = document.createElement('img');
// 		image.setAttribute('style', 'max-height: 70px');
// 		image.setAttribute('style', 'max-width: 100px');
// 		image.src=attach;
// 		messageText.appendChild(image);
// 	}
//
// 	if (getLineCount(msgValue) > 2) {
// 		var endHeihgt = getLineCount(msgValue) * 17;
// 		if (endHeihgt > 100) {
// 			endHeihgt = 100
// 		}
// 		textarea.setAttribute('style', 'height:' + endHeihgt);
// 	}
// 	;
// 	textarea.readOnly = true;
// 	newMsg.appendChild(messageText);
// 	newMsg.classList.add('blink');
//
// 	// console.log(id);
// 	let targetTab = document.getElementById(id);
// 	targetTab.appendChild(newMsg);
// 	targetTab.scrollTop = targetTab.scrollHeight;
//
// 	///Уведомление при входящем сообщении, если вкладка не активна
// 	let clearTabId = id.slice(11);//msgAreaRoom0
// 	//console.log('clearTabId: ' + clearTabId);
//
//
// 	var tabForNotification = document.getElementById("RoomTab0");
// 	if (id != tabAllMessages.id) {
// 		tabForNotification = document.getElementById('UserTab' + clearTabId);
// 		clientLog('tabForNotification id:' + tabForNotification.id);
// 		clientLog('tabForNotification class:' + tabForNotification.className);
//
// 		if ((tabForNotification.className.indexOf("activeTab") === -1)) {
// 			tabForNotification.classList.add("tabNotification");
// 			soundNonActiveChat();
// 			p++;
// 			let stringFotTop = String('+' + p + ' ✉ ' + tabForNotification.innerText);
// 			titleTOP.innerText = stringFotTop;
// 		}
// 		;
// 		  if ((tabForNotification.className.indexOf("activeTab") > -1))
// 		  {soundInChat()}
// 	}
// }
function zapisat(id, nickFromServer, msgFromServer,senderId,attach,ava ,time, hstORnew) {
	const newMsg = document.createElement("div");
	newMsg.className = "message";

	let senderIDdiv = document.createElement('div')
	senderIDdiv.className = "senderIDdiv";
	senderIDdiv.innerText=senderId;
	senderIDdiv.setAttribute('style','display: none')
	newMsg.appendChild(senderIDdiv)
	let avaDiv = document.createElement('div')
		avaDiv.className='avaDiv';
		//avaDiv.setAttribute('style','width:50px; height:50px;')
	let avatarImg = document.createElement('img')
	avatarImg.id='userAvataraID'+senderId;
		avaDiv.appendChild(avatarImg)
	newMsg.appendChild(avaDiv)

	if (senderId===clientId) {
		newMsg.classList.add('messageOwn') ;
	}
	if (senderId!=clientId) {
		newMsg.classList.add('messageAlien');
	}


	let targetTab = document.getElementById(id);
	let isSender = false;

	if (targetTab.lastChild) {
		let prevMsg = targetTab.lastChild;
		let prevMsgSenderId = prevMsg.firstChild;
		let style = 'margin-bottom: 0;';
		console.log('senderID: ' + senderId + 'prevSenderID: ' + prevMsgSenderId.innerText)

		if (prevMsgSenderId.innerText === String(senderId)) {
			console.log(prevMsgSenderId.innerText + '=' + senderId)
			newMsg.setAttribute('style', 'border-radius: 0 0 3px 3px;')
			let senderName = prevMsg.getElementsByClassName('userNickname');
			if (senderName[0].innerText.length === 0) {
				style = style + 'border-radius: 0;';
			} else {
				style = style + 'border-bottom-left-radius: 0;border-bottom-right-radius: 0;';
			}
			prevMsg.setAttribute('style', style);
			isSender = true;
		}
	}
	const userInfo = document.createElement("div");
	userInfo.className = "userInfo";

	const userNickname = document.createElement("div");
	userNickname.className = "userNickname";
	userNickname.id='userProfileID'+senderId;
	let nickValue = '';
	if (!isSender) {

		avatarImg.src=ava;
		avatarImg.setAttribute('style','display: block')
		nickValue = (nickFromServer);
	}
	userNickname.innerText=(nickValue);
	userInfo.appendChild(userNickname);

	const messageTime = document.createElement("div");
	messageTime.className = "messageTime";

	let textTime = '';
	if (!isSender) {
		textTime = time;
		// let currentTime = '';
		// currentTime = new Date();
		// textTime = ('0' + currentTime.getHours()).slice(-2) + ':' + ('0' + currentTime.getMinutes()).slice(-2) + ':' + ('0' + currentTime.getSeconds()).slice(-2);
	}
	const timeValue = document.createTextNode(textTime);
	messageTime.appendChild(timeValue);
	userInfo.appendChild(messageTime);
	newMsg.appendChild(userInfo);

	const messageText = document.createElement("div");
	messageText.className = "messageText";
	const textarea = document.createElement("textarea");
	const msgValue = msgFromServer;
	textarea.value = msgValue;
	let fontSize = 13;
	if (chatStorage.getItem('fontSize')) {fontSize = chatStorage.getItem('fontSize');}
	textarea.setAttribute('style', 'font-size: '+fontSize+'px;');
	if (textarea.value.length>0) {

		messageText.appendChild(textarea);
	}

	if (attach.length>1 ) {
		let image = document.createElement('img');
		// image.setAttribute('style', 'max-height: 70px');
		// image.setAttribute('style', 'max-width: 100px');
		if (token) {image.src=attach;}
		else {image.src='/uploads/nudes/blur.png'}
		messageText.appendChild(image);
		image.addEventListener('click',function (){
			if (token) {imgView.src=attach;}
			else {imgView.src='/uploads/nudes/blur.png'}
			imgViewArea.setAttribute('style','display: flex;align-items: center;justify-content: center;')
		})
	}

	// if (getLineCount(msgValue) > 2) {
	// 	var endHeihgt = getLineCount(msgValue) * 17;
	// 	if (endHeihgt > 100) {
	// 		endHeihgt = 100
	// 	}
	// 	textarea.setAttribute('style', 'height:' + endHeihgt);
	// }
	// ;
	textarea.readOnly = true;
	newMsg.appendChild(messageText);
	newMsg.classList.add('blink');

	// console.log(id);


	targetTab.appendChild(newMsg);
	targetTab.scrollTop = targetTab.scrollHeight;

	///Уведомление при входящем сообщении, если вкладка не активна
	let clearTabId = id.slice(11);//msgAreaRoom0
	//console.log('clearTabId: ' + clearTabId);


	var tabForNotification = document.getElementById("RoomTab0");

	if(hstORnew==='new'){
		if (id.indexOf('Room')===-1) {
			tabForNotification = document.getElementById('UserTab' + clearTabId);
			clientLog(id);
			clientLog('tabForNotification id:' + tabForNotification.id);
			clientLog('tabForNotification class:' + tabForNotification.className);
			if ((tabForNotification.className.indexOf("activeTab") === -1)) {
				tabForNotification.classList.add("tabNotification");
				soundNonActiveChat();
				p++;
				let stringFotTop = String('+' + p + ' ✉️ ' + tabForNotification.innerText);
				titleTOP.innerText = stringFotTop;
			}
			if ((tabForNotification.className.indexOf("activeTab") > -1))
			{soundInChat()}
	}}
}

function mute() {
	const x = document.getElementById("mute");
	if (x.className.indexOf("soundOn") === -1) {
		x.classList.add("soundOn");
		x.name = "volume-high";
		soundToogle = true;
		clientLog("Звук включен");
	} else {
		x.classList.remove("soundOn");
		x.name = "volume-mute";
		soundToogle = false;
		clientLog("Звук выключен");
	}
}

///звук в уже активной вкладке
function soundInChat() {
	if (soundToogle === true) {
		let audio = new Audio();
		audio.volume = 0.1;
		audio.src = "sound/inChat.mp3";
		audio.autoplay = true;
	}
};

/// звук , если вкладка НЕ активна
let playSound = true; 
function soundNonActiveChat() {
	if (soundToogle === true & playSound === true)
	{	let audio = new Audio();
		audio.volume = 0.4;
		audio.src = "sound/qip.mp3";
		audio.autoplay = true;
		playSound = false;
		setTimeout(function(){playSound=true},10000);
	}
}

// отправка сообщения из textarea
// function sendMsgToServer() {
//
//
// 		clientLog('запущена ф-ция sendMsgToServer for cativeTab id: '+activeTab.id );
// 		// if (activeTab.id.indexOf("RoomTab0")>-1 ) {
// 		// 	clientLog('Вызвана отправка паблик сообщения: '+tabId+' '+tabType);
// 		// 	socket.emit("public message", {message: vasheMessage.value, name: vashNick.value, id: clientId});
// 		// }
// 		;
// 		// if (activeTab.id.indexOf("UserTab") > -1) {
// 		// 	let reciverID = tabId;
// 		// 	clientLog('Вызвана отправка приват сообщения: '+tabId+' '+tabType);
// 		// 	socket.emit("API-PrivateMessage", {
// 		// 		reciverID: reciverID,
// 		// 		message: vasheMessage.value,
// 		// 		name: vashNick.value,
// 		// 		id: clientId
// 		// 	})
// 		// }
//
// 		vasheMessage.value = '';
// 		vasheMessage.placeholder = 'Введите сообщение...';
// 	}
// 	;
// };
//
// Системные сообщения в allmessage чате
function zapisatSysMessage(text) {
	if (allMessages){
		let sysMessage = document.createElement("div");
		sysMessage.className = "sysMessage";
		allMessages.appendChild(sysMessage);
		let sysMessageText = document.createElement("div");
		sysMessageText.className = "sysMessageText";
		sysMessage.appendChild(sysMessageText);
		sysMessageText.innerText = text;
		allMessages.scrollTop = allMessages.scrollHeight;
	}
};

// Системные сообщения в чате
function addSysMessage(type, tabID, text) {
	let currTab = document.getElementById('msgArea'+type+tabID);
	let sysMessage = document.createElement("div");
	sysMessage.className = "sysMessage";
	currTab.appendChild(sysMessage);
	let sysMessageText = document.createElement("div");
	sysMessageText.className = "sysMessageText";
	sysMessage.appendChild(sysMessageText);
	sysMessageText.innerText = text;
	currTab.scrollTop = currTab.scrollHeight;
};

function getServerStatus() {
	if (socket.connected === true) {
		ServerStatus = true;
		serverStatusUpdate();
	}
	;
	if (socket.connected === false) {
		ServerStatus = false;
		serverStatusUpdate();
		console.log('Идет подключение к серверу...');
	}
	;
}; // проверка

function serverStatusUpdate() {
	// fon();
	if (divServerStatus){
		if (ServerStatus === true) {
			divServerStatus.innerHTML = "Вы подключены к серверу";
			ServerKrug.setAttribute('style', 'background-color: green; cursor: default');
		} else {
			divServerStatus.innerHTML = "Сервер не отвечает!";
			divServerStatus.setAttribute('style', 'cursor: wait')
			ServerKrug.setAttribute('style', 'background-color: red');
			ServerKrug.setAttribute('style', 'cursor: wait');
			document.getElementById('serverStatus').setAttribute('style', 'cursor: wait');
			// document.body.setAttribute('style', 'cursor: progress');

			send.setAttribute('style', 'cursor: not-allowed');
			document.getElementById("shapka").setAttribute('style', 'cursor: progress');
			document.getElementById('users').setAttribute('style', 'cursor: progress');
			vasheMessage.placeholder = 'Нет соеденения с сервером, пожалуйста подождите...';
		}
		;
	}
}; // вывод дива клиенту

function getLineCount(text) {
	if (!text) {
		return 0;
	}
	return text.split(/\n/).length;
};// количество строк в тексте

function checkInput(event) {
	let keyCode = event.hasOwnProperty('which') ? event.which : event.keyCode;
	if (keyCode === 13 && event.shiftKey) {
		event.preventDefault();
		let buffText = vasheMessage.value;
		vasheMessage.value = buffText + '\n';

	} else {
		if (keyCode === 13) {
			event.preventDefault();
			sendMessage();
		}
		;
	}
	;
}

function getCurrentTime() {
	let time = new Date();
	let currentTime = '[' + ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2) + '] ';
	return currentTime;
};//настоящее время

// вывод лога клиенту в браузере
function clientLog(string) {
	console.log(getCurrentTime() + string);
};

function sendMessage() {
let	name =vashNick.value;
let	type =tabType;
let	id = tabId ;
let	text =vasheMessage.value;
	if (( vasheMessage.value.length ) || msgAttachments.length>1 ) {
		send.setAttribute('style', 'cursor: pointer');
		chatStorage.setItem('userNickCash', vashNick.value);
		socket.emit("API-sendMessage", {token: chatStorage.getItem('token'),  type: type, id: id, text: text, attach: msgAttachments})
		vasheMessage.value = '';
		if (token) {vasheMessage.placeholder = 'Введите сообщение...';}
		else {vasheMessage.placeholder = 'Только зарегестрированые пользователи могут отправлять сообщения';}
		msgAttachments = '';
		let prevIMG = document.getElementById('prevIMG')
		if (prevIMG) {attachArea.removeChild(prevIMG)}
	} else {
		if (vashNick.value.length < 1) {
			vashNick.value = chatStorage.getItem('userNickCash');
		}
		;
		if (vasheMessage.value.length < 1) {
			vasheMessage.placeholder = 'Нельзя отправить пустое сообщение!';
			send.setAttribute('style', 'cursor: not-allowed');
		}
		;
	}

}

function loadProfilePage(){
	if (chatStorage.getItem('token')) {window.location.href = '/profile'}
	else {window.location.href = '/login'};

}


//-----------------------------------
//Блок слушателей
//-----------------------------------
document.addEventListener("click", (event) => {
	let currentEl = event.target;
	if (currentEl.id.includes("userProfileID") ||
		currentEl.id.includes("userAvataraID")){

	socket.emit("API-infoAboutUser", {
		token: chatStorage.getItem('token'),
		userID: currentEl.id.slice(13)
	})
	}

	if(currentEl.id.includes("userMiniAvaID")){
		socket.emit("API-infoAboutUser", {
			token: chatStorage.getItem('token'),
			userID: currentEl.id.slice(13)
		})
		console.log("MINI AVATARA")}
	if (currentEl.className === "user") {
		manageTab('User', currentEl.lastChild.innerText, currentEl.id, 'userClick');
		//activeTab = document.getElementById('msgtab' + currentEl.id);
	}
	if (currentEl.className === "pName") {manageTab('User', currentEl.parentElement.innerText, currentEl.parentElement.id, 'userClick');}

	if (currentEl.className.indexOf("mute") > -1) {
		mute();
	}
	if (event.target.id==='prevIMG') {
		imgView.src=document.getElementById('prevIMG').src;
		imgViewArea.setAttribute('style','display: flex;align-items: center;justify-content: center;')
	}
});// аализируем клики

vasheMessage.addEventListener('keypress', checkInput);/// Нажатие Ентер для отправки сообщения

send.addEventListener("click", sendMessage);// обработка клика по кнопке "отправить"

// profileName.addEventListener('click', loadProfilePage);

imgView.addEventListener('click',function (){imgViewArea.setAttribute('style','display: none')}) // клик по открытой картинке сворачивает ее


// shapkaButtons();
//
// function shapkaButtons(){
// 	let shapka_profile = document.getElementById('shapka_profile')
// 	let shapka_chat = document.getElementById('shapka_chat')
// 	let shapka_settings = document.getElementById('shapka_settings')
// 	let adminka = document.getElementById('adminka');
//
// 	adminka.addEventListener('click', function (){window.location.href = '/adminka'});
// 	shapka_profile.addEventListener('click', function (){loadProfilePage()})
// 	shapka_chat.addEventListener('click', function (){window.location.href = '/chat'})
// 	shapka_settings.addEventListener('click', function (){
// 		if (!chatStorage.getItem('token')) {
// 			window.location.href = '/login'}
// 			else
// 		{window.location.href = '/settings';}
// 	})
//
// }

let freding = true;
let openUserInfo = document.getElementById('openUserInfo')
let closeUserInfo = document.getElementById('closeUserInfo')
closeUserInfo.onclick = ()=>{
	openUserInfo.setAttribute('style','display: none')}
function openUserProfileInfo(myFriends, user){
	console.log(myFriends)
	openUserInfo.setAttribute('style','display: flex')
	let userboxava = document.getElementById('userboxava');
	userboxava.src=user.ava;
	let userinfonick = document.getElementById('userinfonick');
	userinfonick.innerText="Имя: "+user.nick;
	friendName=user.nick;
	let userinfoid = document.getElementById('userinfoid');
	userinfoid.innerText = "ID: "+user.id;
	friendID=user.id;
	let adminoruser = document.getElementById('adminoruser');
	adminoruser.innerText="";
	adminoruser.setAttribute('style','display:none')
	if (user.isAdmin===true){
		adminoruser.innerText="Admin";
		adminoruser.setAttribute("style","display:flex; color: blue")
	}
	let banned=document.getElementById('banned?')
	banned.innerText="";
	banned.setAttribute('style','display:none')
	if (user.ban===true){
		banned.innerText="Забанен"
		banned.setAttribute("style","display:flex; color: red")
	}
	let lastOnline = document.getElementById('lastOnline');
	if (user.lastOnline==="online"){
		lastOnline.innerText = 'online';
		lastOnline.setAttribute('style','color: green;')
	}
	else {
		lastOnline.setAttribute('style','color: rgba(255, 255, 255, 0.76);')
		let D = new Date (user.lastOnline)
		lastOnline.innerText = "Был в сети: "+D.toLocaleString();
		}
	let addFriend = document.getElementById('addFriend');
	let ion=''
	if (myFriends.includes(user.id)){
		addFriend.innerHTML= "<ion-icon name=\"trash-outline\"></ion-icon>Удалить из друзей";
		freding=false;
	}
	else {
		addFriend.innerHTML= "<ion-icon name=\"add-circle-outline\"></ion-icon>Добавить в друзья";
		freding=true;
	}

}

let napisat = document.getElementById('napisat');
let friendName='';
napisat.onclick=()=>{
	manageTab('User', friendName, friendID, 'userClick');
	closeUserInfo.click()
}

let addFriend = document.getElementById('addFriend')
let friendID ='';
addFriend.onclick=()=>{
	if (freding === true) {addFriend.innerHTML= "<ion-icon name=\"trash-outline\"></ion-icon>Удалить из друзей";
		freding = false}
	else {addFriend.innerHTML= "<ion-icon name=\"add-circle-outline\"></ion-icon>Добавить в друзья";
		freding = true}
	socket.emit('API-Friend', {token: chatStorage.getItem('token'), friendID: friendID})
}



let select = document.getElementById('select');
let usersList = document.getElementById('usersList')
let customUsersList = document.getElementById('customUsersList')
select.onchange=function (){
	// console.log(select.value)
	if (Number(select.value)===Number('1'))//all
	{
		usersList.setAttribute('style','display: none');
		customUsersList.setAttribute('style','display: flex');
		socket.emit("API-GetCustomUserList", {filter: "all"})
	}

	if (Number(select.value)===Number('2'))//online
	{usersList.setAttribute('style','display: flex');
		customUsersList.setAttribute('style','display: none')}

	if (Number(select.value)===Number('3'))//friends
	{
		usersList.setAttribute('style','display: none');
		customUsersList.setAttribute('style','display: flex');
		socket.emit("API-GetCustomUserList", {token:chatStorage.getItem('token'), filter: "friends"})
	}
}

function setUserList (data){
	if (document.getElementById('usersList') || document.getElementById('customUsersList'))  {
		var users = document.getElementById('usersList');
			if (Number(select.value)!=Number('2'))
			{users = document.getElementById('customUsersList'); }
			users.innerHTML = '';

		var buffSrt = data.usersList;
		var usersArr = JSON.parse(buffSrt);
		// window.alert(buffSrt);
		let i = 0;
		let tabsMassiv = document.getElementsByClassName("tabTittle");
		while (i < usersArr.length) {
			var user = document.createElement("div");
			// user.innerHTML = usersArr[i].nick;
			user.className = "user";
			user.setAttribute("id", usersArr[i].id);
			users.classList.add('blinkUser');
			var miniAva = document.createElement('img')
			miniAva.src=usersArr[i].ava;
			miniAva.className  = 'miniAva';
			miniAva.setAttribute("id","userMiniAvaID"+usersArr[i].id);
			user.appendChild(miniAva);

			var pName = document.createElement('p');
			pName.className = "pName"
			pName.innerText = usersArr[i].nick;
			user.appendChild(pName);
			users.appendChild(user);
			if (i < tabsMassiv.length) {
				// clientLog('tabsMassiv['+i+'].id: '+tabsMassiv[i].id+' TabID: '+tabID+' usersArray['+i+'].id: '+usersArr[i].id);

				for (let j = 0; j < tabsMassiv.length; j++) {
					let tabID = tabsMassiv[j].id.slice(tabsMassiv[j].id.indexOf('tabTittle') + 9, tabsMassiv[j].id.length);

					if (tabID === usersArr[i].id) {//19 tabsMassiv[1].id usersArr[1].id 20
						if (tabsMassiv[j].innerText != usersArr[i].name) {
							tabsMassiv[j].innerText = usersArr[i].name;
						}
					}
				}

			}
			i++;
		}
		;
	}
}

function fon () {
	console.log('вызван функция фон')
	// let style = document.createElement('style')
	// 	let css = `#target {
	// 	background-image: url(${chatStorage.getItem('fon')});
	// 	background-repeat: no-repeat;
	// 	  background-size: cover;
	// 	}  `;



	// style.sheet.insertRule(`#target {
		// background-image: url(${chatStorage.getItem('fon')});
		// background-repeat: no-repeat;
		//   background-size: cover;
		// }  `);
		// document.body.appendChild(style)
	// if (chatStorage.getItem('fon')) {
	// 	document.body.setAttribute("style"," background-image: url(\""+chatStorage.getItem('fon')+"\");\n")
	// 	console.log(chatStorage.getItem('fon'))
	// }
	if (chatStorage.getItem('fon')) {

		document.body.insertAdjacentHTML("beforeend", `<style>body {
		background-image: url(${chatStorage.getItem('fon')});
		background-repeat: no-repeat;
		  background-size: cover;
		}</style>`)
		console.log(chatStorage.getItem('fon'))
	}
}

fon()