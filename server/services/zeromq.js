import * as zmq from "zeromq"


export async function connectQueue() {
    try {

        const sock = new zmq.Subscriber

        sock.connect("tcp://127.0.0.1:3010")
        sock.subscribe("babu4ka")
        console.log("|---- ZeroMQ: connected")

        for await (const [topic, msg] of sock) {
            console.log("received a message related to:", topic, "containing message:", msg.toString())
        }
    } catch (err) {
        console.error("ZeroMQ connection failed.", err);
    }

}

