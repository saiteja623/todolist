var csrfcookie = function () {
    var cookieValue = null,
        name = "csrftoken";
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
}
var room_name;
var person_name = '{{person_name}}';
var socket;
var xhr = new XMLHttpRequest();
xhr.open("GET", "checkForIdle", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
        var res = JSON.parse(xhr.responseText);
        room_name = res['roomname'];
        var status = res['status'];
        socket = new WebSocket(
            'ws://' + window.location.host + '/ws/chat/' + room_name + '/' + person_name + '/'
        );
        if (status == "idle") {
            var parentdiv = document.createElement("div");
            document.getElementById('messages').appendChild(parentdiv);
            parentdiv.setAttribute("class", "parent");
            var div = document.createElement("div");
            parentdiv.appendChild(div);
            div.setAttribute("class", "mine_middle");
            div.textContent = "waiting for stranger...";
            document.getElementById("message").contentEditable = false;

        }
        else {
            var username = res['username'];
            var parentdiv = document.createElement("div");
            document.getElementById('messages').appendChild(parentdiv);
            parentdiv.setAttribute("class", "parent");
            var div = document.createElement("div");
            parentdiv.appendChild(div);
            div.setAttribute("class", "mine_middle");
            div.textContent = "connected to " + username + ", Say hi!";
            document.getElementById("message").disabled = true;

        }
        socket.onerror = function (e) {
            console.log(e);
        }
        socket.onmessage = function (e) {
            console.log(e);
            var data = JSON.parse(e.data);
            message = data['message'];
            person = data['person'];
            action = data['action'];
            if (person == person_name) {

                if (action == "join" || action == "disconnected") {
                }
                else {
                    var parentdiv = document.createElement("div");
                    document.getElementById('messages').appendChild(parentdiv);
                    parentdiv.setAttribute("class", "parent");
                    var div = document.createElement("div");
                    parentdiv.appendChild(div);
                    div.setAttribute("class", "mine_sideways");
                    div.textContent = message;
                }

            }
            else {

                if (action == "join") {
                    document.querySelector('.mine_middle').textContent = "connected to " + person + ", say hi!";
                    document.getElementById("message").contentEditable = true;
                }
                else if (action == "disconnected") {
                    var parentdiv = document.createElement("div");
                    var div = document.createElement("div");
                    document.getElementById('messages').appendChild(parentdiv);
                    parentdiv.setAttribute("class", "parent");
                    parentdiv.appendChild(div);
                    div.setAttribute("class", "others_middle");
                    div.textContent = person + message;
                    document.getElementById("message").style.display = "none";
                    document.getElementById("submit").style.display = "none";
                    document.getElementById("newchat").style.display = "block";
                }
                else {
                    var parentdiv = document.createElement("div");
                    var div = document.createElement("div");
                    document.getElementById('messages').appendChild(parentdiv);
                    parentdiv.setAttribute("class", "parent");
                    parentdiv.appendChild(div);
                    div.setAttribute("class", "others_sideways");
                    div.innerHTML = '<h7 style="color:red;">' + person + '</h7>' + '<br>' + message;
                }
            }
            var items = document.querySelectorAll(".parent");
            console.log(items);
            var last = items[items.length - 1];
            last.scrollIntoView();
        }

        socket.onclose = function (e) {
            console.log(e);
        }
    }

};
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("X-CSRFToken", csrfcookie());
xhr.send();



document.getElementById("message").addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        document.getElementById("submit").click();
    }
})


document.getElementById('submit').onclick = function (e) {
    var message = document.getElementById('message').textContent;
    socket.send(JSON.stringify({ 'message': message }));
    document.getElementById('message').innerHTML = "";
}
document.getElementById("newchat").onclick = function (e) {
    location.reload();
}