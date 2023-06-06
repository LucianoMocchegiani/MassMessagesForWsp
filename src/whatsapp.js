const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');


var sendMedia = null;
var deleteStore = null;
var cerrarConeccion = null;

class ExportFunction{
}
const whatsappFunctions = new ExportFunction();
class Getqr {
    constructor (code) {
        this.code = code;
    }
    log() {
        console.log('qr code: ', this.code);
    }
    change(value){
        this.code = value
    }
    get(){
        return(this.code)
    }
}
// esta clase almacena en memoria el codigo qr obtenido de el evento client.on qr
var getqr = new Getqr(null);

const whatsapp =  mongoose.connect('mongodb+srv://lucianomocchegiani:yGJeX2t0tqA963dw@cluster0.g4yxxlx.mongodb.net/').then(() => {

    const store = new MongoStore({ mongoose: mongoose });
    // se inicializa el cliente y se conecta con la base de datos
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });
    // envia mensajes
    ExportFunction.prototype.sendMensaje=(to, mensaje)=>{
        client.sendMessage(to, mensaje)
    }
    ExportFunction.prototype.cerrarSession=()=>{
        client.logout()
    }
    

    // manda mensajes de mediafiles
    sendMedia = (to, fileUrl)=>{
        const mediafile= MessageMedia.fromUrl(fileUrl)
        client.sendMessage(to, mediafile)
    }
    // cierra la sesion del cliente
    cerrarSession = ()=>{
        client.logout()
    }
    // borra el store de la base de datos de mongo
    deleteStore = async () =>{
        await store.delete();
    }
    // cierra la coneccion de mongo
    cerrarConeccion = ()=>{
        connection.close()
    }
    // escucha mensajes
    const listenMessage = ()=>{
        client.on('message',(mensaje)=>{
            const { from, to, body } = mensaje;
            console.log(from, to, body )
        })
    }
    // escucha el qr recibido para autenticar al cliente
    
    client.on('qr', qr => {
        console.log('QR RECEIVED', qr);
        // qrcode.generate(qr, {small: true});
        getqr.change(qr);

    });
    // escucha errores en la autenticacion
    client.on('auth_failure', ()=>{
        console.log('Error de autentificacion, genera nuevamente el qr')
        getqr.change('Error');
    })
    // cliente listo
    client.on('ready', () => {
        console.log('Client is ready!');
        getqr.change('Ready');
        listenMessage();
        // client.sendMessage('5491130903110@c.us',mensaje)
        // client.sendMessage('5491125137614@c.us',mensaje)
    });
    client.initialize();

});
const connection = mongoose.connection;

connection.once("open",()=>{
    console.log('la base de datos esta conectada')
})  
module.exports = {whatsapp , getqr, sendMedia, whatsappFunctions}




