let token = chatStorage.getItem('token')
history.pushState(null, null, window.location.origin+'/chat');
console.log(token);

socket.emit('API-UserEnterToChat',{token: token})
socket.emit('API-GetChatHistory', {token:token, type: "Room", id:'0'})