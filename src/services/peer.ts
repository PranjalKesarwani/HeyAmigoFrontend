class PeerService {

    peer: RTCPeerConnection | null = null;

    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({  //creating new peer connection and configuring it with ICE servers which actually help to traverse throug firewall
                iceServers: [{
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ],

                }],
            })
        }
    }

    //For accepting incoming vdo call

    async getAnswer(offer:any){
        if(this.peer){
            await this.peer.setRemoteDescription(offer); //It accepts the incoming video call offer and set to remote description
            const ans =await this.peer.createAnswer(); //generating the answer and after it setting to local description
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }

    }


    //When you will do video call it will create an offer and user 2 will get the offer
    async getOffer() {
        
        if (this.peer) {
            const offer = await this.peer.createOffer();
            console.log('----',offer);
            await this.peer.setLocalDescription(new RTCSessionDescription(offer)); //creating offer
            return offer;
        }
    }

    async setLocalDescription(ans:any){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }
    closePeerConnection() {
       
        if (this.peer) {
            this.peer.close();
        }
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        });
    }

}

export default new PeerService()