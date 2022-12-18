import { Boom } from '@hapi/boom';
import  {useSingleFileAuthState } from "@adiwajshing/baileys";
import {makeWASocket} from "@adiwajshing/baileys"

import path from 'path';
import { DisconnectReason } from '@adiwajshing/baileys';

export const connect = async ()=> {
    const { state, saveState} = useSingleFileAuthState(
        path.resolve(__dirname, "..", "cache","auth_info_multi.json")
    );

    const socket = makeWASocket({
        printQRInterminal: true,
        auth: state,
    });
    socket.ev.on('connections.update', async(update) =>{
        const { connection, lastDisconnect} = update;
        if(connection === 'close'){
            const showdReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut;
            if(showdReconnect){
                await connect();
            }
        }
    });

    socket.ev.on ("creads.update", saveState);

    return socket;
};

function useSingleFileAuthState(arg0: string): { state: any; saveState: any; } {
    throw new Error('Function not implemented.');
}
