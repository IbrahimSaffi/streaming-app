const videoEl = document.querySelector(".stream");
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play()
    });
    //Recieving call from peer
     peer.on("call",(call)=>{
        console.log("getting call")
        call.answer(stream)
    })
    //Upon recieving "user-add" event from server
    socket.on("user-add", (newPeerId) => {
        let conn = peer.connect(newPeerId)
        console.log("hi from " + peer.id)
        setTimeout(()=>{
            let call = peer.call(newPeerId,stream);
            console.log(call)
            call.on("stream",(remoteStream)=>{
                console.log("here")
                let newVideo = document.createElement("video");
                newVideo.srcObject = remoteStream;
                newVideo.addEventListener("loadedmetadata",()=>{
                    newVideo.play()
                })
                document.body.appendChild(newVideo)
            })
        },1000)
    })
})
.catch((err)=>console.log("Error retrieving webcam"));

//Initializing socket and peer js connections to server
//using index script tags for getting packages
const socket = io.connect("http://localhost:8000")
const peer = new Peer(undefined, {
    host: "localhost",
    port: 8000,
    path: "/peerjs",
})
console.log(peer);


//When peer connection is opened from server
peer.on("open", (id) => {
    //Sending "new-connection" event to server from Front end
    socket.emit("new-connection", peer.id);
    console.log("Peer ID", id)
})

peer.on("connection", function (conn) {
    conn.on("data", function (data) {
        console.log(data)
    })
})