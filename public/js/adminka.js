let all=document.getElementById('fAll')
let admins=document.getElementById('fAdmins')
let banned=document.getElementById('fBanned')
let girls=document.getElementById('fGirls')
let boys=document.getElementById('fBoys')
let get = document.getElementById('get');
let primenit = document.getElementById('primenit');
let publicDiv = document.getElementById('publicDiv')

let table = document.getElementById('table')
let search = document.getElementById('search');
let searchType = '';
let tdid;


document.addEventListener('click', function(event){
	if (event.target.tagName==="TH" && (
		event.target.innerText==='id' ||
		event.target.innerText==='nick' ||
		event.target.innerText==='login')){
		tdid=Number(event.target.id.slice(2));
		console.log(tdid)
		search.value='';
		searchType=event.target.innerText;
		event.target.appendChild(search);
		search.setAttribute('style',"display:flex");
				if(event.target.innerText==='id'){
					search.setAttribute('style','width: 50px;')}
		search.placeholder = 'Search by '+event.target.innerText;
	}
	else{
		if(event.target.id!='search'){search.setAttribute('style',"display:none")}}

})

search.addEventListener("search", function (){
	searchInTable(search.value,tdid)
})

search.addEventListener("input",()=>{searchInTable(search.value,tdid)})

function searchInTable(searchValue, tdid){
	let searchValueClear = searchValue.toUpperCase();
	let tr = table.getElementsByTagName("tr");
	let td,i,txtValue;
	for (i = 0; i < tr.length; i++){
		td = tr[i].getElementsByTagName("td")[tdid];
		console.log(td+"+"+tdid)
		if (td) {txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(searchValueClear) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}


all.onchange = function (){admins.checked=false;banned.checked=false;get.innerText='Применить фильтры'}
admins.onchange = function (){all.checked=false;banned.checked=false;get.innerText='Применить фильтры'}
banned.onchange = function (){all.checked=false;admins.checked=false;get.innerText='Применить фильтры'}


history.pushState(null, null, window.location.origin+'/adminka');
get.addEventListener('click', function () {
	primenit.setAttribute('style','display: flex');
	publicDiv.setAttribute('style','display: flex');

	let fAll=all.checked;
	let fAdmins=admins.checked;
	let fBanned=banned.checked;
	let fGirls=girls.checked;
	let fBoys=boys.checked;
	get_database(fAll,fAdmins,fBanned,fGirls,fBoys);
});


function get_database (a=false,b=false,c=false,d=false,e=false){
	socket.emit('API-GET', {
		token: chatStorage.getItem('token'),
		type: 'bd',
		filters: {
			all:a,
			admins:b,
			banned:c,
			girls:d,
			boys:e
		}
	}
)}
table = document.getElementById('table')
let checkboxArray = [];
let DBArray = [];
let banArray = []
	function zapolnit (database){
	checkboxArray = [];
		banArray =[];
	let thead = document.createElement('thead');
	table.innerHTML = '';
	thead.innerHTML = "<th id=\"td0\">id</th>\n" +
		"          <th id=\"td1\">nick</th>\n" +
		"          <th id=\"td2\">login</th>\n" +
		"          <th style=\"display:none\">isAdmin</th>\n"+
		"          <th>Admin</th>"+
		"          <th style=\"display:none\">isBan</th>\n"+
		"          <th>Ban</th>"
	table.appendChild(thead);

	DBArray = JSON.parse(database);

	for (let i=0; i<DBArray.length;i++){
			let x='';
			let y = '';
			if (DBArray[i].ban === true){y='checked'}
			if (DBArray[i].isAdmin===true){x='checked'}
			table.innerHTML =table.innerHTML+ ' <tr>\n' +
				'        <td>'+DBArray[i].id+'</td>\n' +
				'        <td>'+DBArray[i].nick+'</td>\n' +
				'        <td>'+DBArray[i].login+'</td>\n' +
				'        <td style="display:none">'+DBArray[i].isAdmin+'</td>\n' +
				'        <td>'+
				'<input class ="adminCheckbox" type="checkbox" id="'+'setAdmin'+DBArray[i].id+'" '+x+'>'+
						'</td>\n' +
				'        <td style="display:none">'+DBArray[i].ban+'</td>\n' +
				'        <td>'+
				'<input class ="banCheckbox" type="checkbox" id="'+'ban'+DBArray[i].id+'" '+y+'>'+
				'</td>\n' +
				'      </tr>';
		checkboxArray.push(document.getElementById('setAdmin'+DBArray[i].id));
		banArray.push (document.getElementById('ban'+DBArray[i].id));

	}
		document.getElementById('setAdmin0').setAttribute('disabled','disabled');
		document.getElementById('ban0').setAttribute('disabled','disabled');
		document.getElementById('setAdmin1').setAttribute('disabled','disabled;');
		document.getElementById('ban1').setAttribute('disabled','disabled');
}

let chex = []
let banx = []
primenit.addEventListener('click', function (){
	let publicBox = document.getElementById('publicBox').checked;
	let checkBoxesArray = document.querySelectorAll(".adminCheckbox");
	let bansArray = document.querySelectorAll(".banCheckbox");

	for (let i = 1; i < checkBoxesArray.length; i++) {
		let element = {
			id: checkboxArray[i].id.slice(8),
			checked: checkBoxesArray[i].checked
		}

			if(checkBoxesArray[i].checked !== DBArray[i].isAdmin){chex.push(element)}
	}

	socket.emit('API-MakeAdmin',{token: chatStorage.getItem('token'),chex:chex, publicBox:publicBox})
	chex = []


	for (let i = 1; i < bansArray.length; i++) {
		let banlement = {
			id: banArray[i].id.slice(3),
			checked: bansArray[i].checked
		}

		if(bansArray[i].checked !== DBArray[i].ban){banx.push(banlement)
			}
	}

	socket.emit('API-Ban',{token: chatStorage.getItem('token'),banx:banx, publicBox:publicBox
	})
	banx = []

})
fon()