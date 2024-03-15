const BYTES_IN_MB = 1048576
var slider = document.getElementById("slider");
var sliderValue = document.getElementById("sliderValue");
var exampleText = document.getElementById('example_text');
var done = document.getElementById('done');

	sliderValue.innerHTML = slider.value;
slider.oninput = function() {
	sliderValue.innerHTML = this.value;
	exampleText.setAttribute('style', 'font-size: '+this.value+'px;');
}

var saveChanges = document.getElementById('saveChanges');
saveChanges.addEventListener('click', function (){
	customFon()
	async function customFon( ){
		if (fileFon!=null){let x = await sendFonFnc(fileFon)
			console.log(x.fonimgURL)
			imgFon.src=x.fonimgURL;
			chatStorage.setItem('fon',imgFon.src)
			console.log('загрузилися на сервачок')
			fileFon=null;
			fonName.innerText=''
		}
		else {
			fonName.innerText=''
		}
		if (fileFon===null){
			chatStorage.setItem('fon',imgFon.src)
		}
	}
	chatStorage.setItem('fontSize', slider.value)
	done.innerHTML = 'Успешно сохранено';;})


document.addEventListener('click', function (event){
	if (event.target.id !== 'saveChanges'){done.innerHTML = ''}})
//
// let shapka_profile3 = document.getElementById('shapka_profile')
// let shapka_chat3 = document.getElementById('shapka_chat')
// let shapka_settings3 = document.getElementById('shapka_settings')
// let adminka3 = document.getElementById('adminka');
//
// adminka3.addEventListener('click', function (){window.location.href = '/adminka'});
// shapka_profile3.addEventListener('click', function (){loadProfilePage()})
// shapka_chat3.addEventListener('click', function (){window.location.href = '/chat'})
// shapka_settings3.addEventListener('click', function (){
// 	if (!chatStorage.getItem('token')) {
// 		window.location.href = '/login'}
// 	else
// 	{window.location.href = '/settings';}})

let inputFon = document.getElementById('inputFon'),
	sendFon = document.getElementById('sendFon'),
	fileFon = null,
	imgFon = document.getElementById('imgFon'),

	inputFonChose = document.getElementById('inputFonChose'),
fonName = document.getElementById('fonName');


inputFonChose.addEventListener('click' ,function(){inputFon.click();})

inputFon.addEventListener('change', function (){
		fileFon = this.files[0];
	if (fileFon.size > 5*BYTES_IN_MB) {
		fonName.innerText = 'Размер до 5 МБ!'
		this.value=null;
		fileFon = null
	}
	if (fileFon.type.indexOf('image') <0){
		fonName.innerText = 'Только картинки!'
		fileFon = null;
		this.value=null;
		console.log('fileFon:'+fileFon)
	}
	if (fileFon != null){

		sendFon.removeAttribute('disabled')
		fonName.innerText = fileFon.name
		let fr = new FileReader();
		fr.onload = function(){
			imgFon.src=fr.result}
		fr.readAsDataURL(fileFon);
	}
	else {sendFon.setAttribute('disabled','')}

})

// sendFon.addEventListener('click', async function ( ){
// 	if (fileFon!=null){let x = await sendFonFnc(fileFon)
// 		console.log(x.fonimgURL)
// 		imgFon.src=x.fonimgURL;}
// 	else {
// 		alert('Сначала выберете фон')
// 	}
// })


async function sendFonFnc(fileFon){
	let headers = new Headers(),
		formData = new FormData()
	headers.append('imgtype','fon')
	formData.append('img',fileFon)
	let res = await fetch ('/fon',{
		method: 'POST',
		headers: headers,
		body: formData
	})
	return await res.json()
}

async function getFonPresets() {

	let res = await fetch ('/getfonpresets',)
	let x = await res.json()
	console.log(x.fonPresets[0])
	presetsSelector(x.fonPresets)
	//return await res.json()
}
getFonPresets()

// socket.emit("API-GetBackgroundPresets")

let selectFon = document.getElementById('selectFon');
let presets=[]


selectFon.onchange=function (){
		imgFon.src="backgrounds/presets/"+presets[Number(selectFon.value)]
}
function presetsSelector(data){
	presets=data;
	imgFon.src="backgrounds/presets/"+presets[0]
	for (let i=0; i<presets.length; i++){
		let option=document.createElement('option')
		selectFon.appendChild(option)
		option.setAttribute('value',i)
		option.innerText=presets[i]
	}
}
fon()