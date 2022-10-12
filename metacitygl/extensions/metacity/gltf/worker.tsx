import * as Utils from "../../../utils";

declare var self: any;

//eslint-disable-next-line no-restricted-globals
self.onmessage = async (message: MessageEvent) => {
    const { pointInstanceModel } = message.data;
    const data = await Utils.loadGLTF(pointInstanceModel);

    //eslint-disable-next-line no-restricted-globals
    const transferable = [data.positions.buffer, data.dots.buffer];
    self.postMessage(data, transferable);
};