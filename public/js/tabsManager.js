//------
//-блок переменных
//------

let tabsArray = document.getElementsByClassName('tab');//создаем массив всех вкладок при старте
let msgAreaArray = document.getElementsByClassName('allMessages');//создаем массив всех вкладок при старте
let activeTab = document.getElementById('roomTab0');//активной делаем общий чат
let tabType = 'Room';
let tabId = 0;
let allTabs = document.getElementById("allTabs");
let chatArea = document.getElementById('chatArea');

showCurrentTab('Room','0','userClick');


//------
//-блок функций
//------

//управление вкладкой - создать, либо показать, с параметром вызова
function manageTab(type, title, id, action) {
	let isTab = false;
	let tabId = type + 'Tab' + id;

	for (let i = 0; i < tabsArray.length; i++) {
		if (tabsArray[i].id === tabId) {
			isTab = true;
			break
		}
	}

	if (isTab === false && id != clientId) {
		tabCreation(type, title, id);
		if (action === 'userClick') {
			showCurrentTab(type,id,'');
		}
	} else {
		if (action=== 'userClick'){
		showCurrentTab(type,id,'userClick');
		} else {
			let thisTab = document.getElementById(type+'Tab'+id);
				//thisTab.classList.add('tabNotification');
		}

	}


};

//создание вкладки
function tabCreation(type, title, id) {
	socket.emit('API-GetChatHistory', {token:token, type: type, id:id});
	let currentTab = document.createElement('div');
	currentTab.className = 'tab';
	currentTab.classList.add('blinkTab');
	currentTab.classList.add('tabNotification');
	currentTab.id = type + 'Tab' + id;
	let currentTabTitle = document.createElement('div');
	currentTabTitle.className = 'tabTittle';
	currentTabTitle.innerText = title;
	currentTabTitle.id=type + 'tabTittle' + id;
	currentTab.appendChild(currentTabTitle);
	let tabCloseButton = document.createElement('ion-icon')
	tabCloseButton.className = 'closeButton';
	tabCloseButton.setAttribute("id", "cb" + currentTab.id);
	tabCloseButton.name = "close-circle";
	currentTab.appendChild(tabCloseButton);
	allTabs.appendChild(currentTab);
	tabsArray = document.getElementsByClassName('tab');//создаем массив всех вкладок при старте

	let currentMsgArea = document.createElement('div');
		currentMsgArea.className = 'allMessages';
		currentMsgArea.id = 'msgArea' + type + id;
		currentMsgArea.setAttribute('style', 'display: none');
	chatArea.appendChild(currentMsgArea);
	msgAreaArray = document.getElementsByClassName('allMessages');//создаем массив всех вкладок при старте
}

/// активация Вкладки
function showCurrentTab(type,id,action) {
	let isTab = false;
	let tabName = type+'Tab'+id;
	let msgAreaName = 'msgArea'+type+id;



	for (let i = 0; i < tabsArray.length; i++) {
		if (tabsArray[i].id===tabName){
			isTab=true;
			break;
		}
	}

	if (isTab==true) {
		for (let i = 0; i < tabsArray.length; i++) {
			if (tabsArray[i].id===tabName){
				msgAreaArray[i].setAttribute('style','display: flex');
				if (action==='userClick') {
					tabsArray[i].classList.remove('tabNotification');
					tabsArray[i].classList.remove("blinkTab");
				}
				tabsArray[i].classList.add("activeTab");
				tabsArray[i].classList.remove("tabNotification");
				titleTOP.innerText = tabsArray[i].innerText;
				activeTab=tabsArray[i];
				tabType = type;
				tabId = id ;
				p = 0;
			} else {
				tabsArray[i].classList.remove('activeTab');
				msgAreaArray[i].setAttribute('style','display: none');
			}
		}
	}

};

//закрытие вкладки
function closeTab(tabId) {
	let type = tabId.slice(2,tabId.indexOf('Tab')); //UserTab0
	let id = tabId.slice( tabId.indexOf('Tab')+3,tabId.length );
	clientLog('вызвано закрытие вкладки '+type+' '+id)
	let isTab = false;
	let tabName = type+'Tab'+id;

	for (let i = 0; i < tabsArray.length; i++) {
		if (tabsArray[i].id===tabName){
			isTab=true;
			break;
		}
	}

	if (isTab==true) {
		for (let i = 0; i < tabsArray.length; i++) {
			if (tabsArray[i].id===tabName){
				tabsArray[i].classList.add('closeTab');
				msgAreaArray[i].classList.add('closeTab');
				setTimeout(function () {
					allTabs.removeChild(tabsArray[i]);
					tabsArray = document.getElementsByClassName('tab');
					chatArea.removeChild(msgAreaArray[i]);
					msgAreaArray = document.getElementsByClassName('allMessages');
					showCurrentTab('Room',0,'userClick');

				},495);
				break;

			}
		}
	}

}


// аализируем клики
document.addEventListener("click", (event) => {
	let currentEl = event.target;
			let currentTab = null;

			if (currentEl.className.indexOf("tab") > -1) {
				currentTab = currentEl;
			}
			if (currentEl.className.indexOf("tabTittle") > -1) {
				currentTab = currentEl.parentNode;
			}

			if (currentTab != null) {
				let currType = currentTab.id.slice(0,currentTab.id.indexOf('Tab')); //roomTab0
				let currId = currentTab.id.slice( currentTab.id.indexOf('Tab')+3,currentTab.id.length );
				showCurrentTab(currType,currId,'userClick')
			}
	if (currentEl.className.indexOf("closeButton") > -1) {
		closeTab(currentEl.id)
	}
	;


});
