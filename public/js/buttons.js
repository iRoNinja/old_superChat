let shapka_profile = document.getElementById('shapka_profile')
let shapka_chat = document.getElementById('shapka_chat')
let shapka_settings = document.getElementById('shapka_settings')
let adminka = document.getElementById('adminka');
shapkaButtons();

function shapkaButtons(){

	adminka.addEventListener('click', function (){window.location.href = '/adminka'});
	shapka_profile.addEventListener('click', function (){loadProfilePage()})
	shapka_chat.addEventListener('click', function (){window.location.href = '/chat'})
	shapka_settings.addEventListener('click', function (){
		if (!chatStorage.getItem('token')) {
			window.location.href = '/login'}
		else
		{window.location.href = '/settings';}
	})

}

let profileName = document.getElementById('profileName')
let ava = document.getElementById('ava')
function indexUserInfo (nick, avat){
	profileName.innerText=nick;
	ava.src = avat;
}

// window.onload = function(){
// 	let profileName3 = document.getElementById('profileName')
// 	let ava3 = document.getElementById('ava')
// 	profileName3.innerText = chatStorage.getItem('profileNick')
// 	ava3.src=chatStorage.getItem('profileAva')
// 	if (!chatStorage.getItem('token')) {
// 		window.location.href = '/login'}}

socket.on('API-UserInfo', function (data){
	chatStorage.setItem('profileLogin',data.login)
	chatStorage.setItem('profileNick',data.nick)
	chatStorage.setItem('profileAva',data.ava)
	chatStorage.setItem('clientId',data.clientId)
	let isAdmin = data.isAdmin;
	if (isAdmin===true) {adminka.setAttribute('style','display:flex')}
	else {adminka.setAttribute('style','display:none')}
	clientId=data.clientId;
	let currentURL = String(window.location)
	if (currentURL.indexOf('/chat')>1 || currentURL.indexOf('/settings')>1 || currentURL.indexOf('/adminka')>1)
	{
		indexUserInfo(data.nick, data.ava)}
	if (currentURL.indexOf('/profile')>1)
	{
		profileUserInfo(data.login, data.nick, data.ava, data.resultString)
	}
})