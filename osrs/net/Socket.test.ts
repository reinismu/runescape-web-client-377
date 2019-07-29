import { Socket } from "./Socket";
import { WebSocketClient } from "./WebSocketClient";

test("read works corectly", async () => {
    const socket = new Socket("meh", 123);
    const receive = jest.fn()
        .mockReturnValueOnce(Promise.resolve(new Int8Array([5, 4])))
        .mockReturnValueOnce(Promise.resolve(new Int8Array([3 ,2 ,1])));

    WebSocketClient.prototype.receive = receive;

    expect(await socket.read()).toBe(5);
    expect(await socket.read()).toBe(4);
    expect(await socket.read()).toBe(3);
    expect(await socket.read()).toBe(2);
    expect(await socket.read()).toBe(1);
});
