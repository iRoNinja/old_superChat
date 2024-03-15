const BYTES_IN_MB = 1048576

const form = document.getElementById('uploadForm2')
const fileInput = document.getElementById('uploadFormFile')
const sizeText = document.getElementById('uploadForm_Size')
const statusText = document.getElementById('uploadForm_Status')
const progressBar = document.getElementById('progressBar')
let attachArea = document.getElementById('uploadArea')
let msgAttachments = '';

fileInput.addEventListener('change', function () {
	const file = this.files[0]
	if (file.size > 5 * BYTES_IN_MB) {
		alert('Принимается файл до 5 МБ')
		this.value = null
	}
	uploadedFileName.innerText = file.name;
	sendFile();
});

form.addEventListener('submit', function (event) {
	event.preventDefault()
	const fileToUpload = fileInput.files[0]
	const formSent = new FormData()
	const xhr = new XMLHttpRequest()

	if (fileInput.files.length > 0) {
		formSent.append('photo',fileToUpload)

		// собираем запрос и подписываемся на событие progress
		//xhr.setRequestHeader('Content-Type', 'multipart/form-data')
		xhr.upload.addEventListener('progress', progressHandler, false)
		xhr.addEventListener('load', loadHandler, false)
		xhr.open('POST', '/upload')
		clientLog(formSent);
		xhr.send(formSent);


		fileInput.value = null;
		// sizeText.textContent = ``;
		// statusText.textContent = ``;
	} else {
		alert('Сначала выберите файл')
	}
	return false
});

function progressHandler(event) {
	// считаем размер загруженного и процент от полного размера
	const loadedMb = (event.loaded/BYTES_IN_MB).toFixed(1)
	const totalSizeMb = (event.total/BYTES_IN_MB).toFixed(1)
	const percentLoaded = Math.round((event.loaded / event.total) * 100)

	progressBar.value = percentLoaded
	sizeText.textContent = `${loadedMb} из ${totalSizeMb} МБ`
	statusText.textContent = `Загружено ${percentLoaded}% | `;
	if ( 0<percentLoaded<=1) {progressBar.setAttribute('style','display: flex')}
	if (percentLoaded === 100){
		progressBar.setAttribute('style','display: none')
		sizeText.textContent = ``;
		statusText.textContent = ``;

		uploadedFileName.innerText = '';

	}
}

function loadHandler(event) {
	msgAttachments= event.target.responseText;
	//statusText.textContent = event.target.responseText;
	progressBar.value = 0;
	let imgPrev=null;
	if (msgAttachments.length>1) {
		if (document.getElementById('prevIMG')  ) {
			imgPrev=document.getElementById('prevIMG');
		}
		else {
			imgPrev = document.createElement('img')


			imgPrev.id = 'prevIMG'
			// imgPrev.setAttribute('style','max-height: 30px')
			// imgPrev.setAttribute('style','max-width: 80px')
		}
		imgPrev.src = msgAttachments;
		attachArea.insertBefore(imgPrev,fileChooseShown)
	}

}


const fileChooseShown = document.getElementById('fileChooseBtn'); // наша кастомная кнопка выбора
function fileChooseTrigger(){
	fileInput.click();

};// тригермим клик
fileChooseShown.addEventListener('click', fileChooseTrigger)//клик по кастомной кнопке
const uploadedFileName = document.getElementById('uploadedFileName');

// отправка файла
const sendFileButton = document.getElementById('uploadForm_Submit');
function sendFile(){sendFileButton.click();};
//send.addEventListener('click', sendFile);

vasheMessage.addEventListener('paste', function (pasteEvent) {
	let item = pasteEvent.clipboardData.items[0];
	console.log(item);
	if (item.type.indexOf("image") === 0)

	{
		let blob = item.getAsFile();
		// let URLObj = window.URL || window.webkitURL;
		// let source = URLObj.createObjectURL(blob);
		// console.log(source)

		const fileToUpload = blob;
		const formSent = new FormData()
		const xhr = new XMLHttpRequest()


			formSent.append('photo',fileToUpload)

			// собираем запрос и подписываемся на событие progress
			//xhr.setRequestHeader('Content-Type', 'multipart/form-data')
			xhr.upload.addEventListener('progress', progressHandler, false)
			xhr.addEventListener('load', loadHandler, false)
			xhr.open('POST', '/upload')
			clientLog(formSent);
			xhr.send(formSent);


			//fileInput.value = null;
			// sizeText.textContent = ``;
			// statusText.textContent = ``;



		//fileInput.files=blob;
		// console.log(blob)
		// var reader = new FileReader();
		// reader.onload = function(event) {
		// 	document.getElementById("container").src = event.target.result;
		// };
		// reader.readAsDataURL(blob);
	}
})

