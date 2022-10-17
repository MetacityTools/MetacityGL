import * as Utils from "../../utils";

declare var self: any;

//eslint-disable-next-line no-restricted-globals
self.onmessage = async (message: MessageEvent) => {
    const { pointInstanceModel, baseURI } = message.data;
    const url = new URL(pointInstanceModel, baseURI).href;
    const data = await Utils.loadGLTF(url);

    //eslint-disable-next-line no-restricted-globals
    const transferable = [data.positions.buffer, data.dots.buffer];
    self.postMessage(data, transferable);
};