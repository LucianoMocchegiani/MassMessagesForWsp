const { Router } = require('express');
const router = Router();
const {getqr, whatsappFunctions } = require('../whatsapp');



router.get("/logout", async (req, res, next) => {
    try{
      whatsappFunctions.cerrarSession()
      return res.send('session cerrada')
    }
    catch(err){
      next(err);
    }
});

router.post("/sendplus", async (req, res, next) => {
  const {numeros, mensaje} = req.body
  console.log(numeros, mensaje)
  try{
      if (numeros && mensaje){
        numeros.map((num)=>whatsappFunctions.sendMensaje(num, mensaje))
        return res.send('El mensaje: (',mensaje,'), fue enviado correctamente.')
      }
      else {
        return res.status(404).send("mensaje y/o numeros no enviados")
      }        
  }
  catch(err){
    next(err);
  }
});

router.get("/qr", async (req, res, next) => {
    try{
      getqr.log()
      if(getqr.get()){
        return res.send(getqr.get())   
      }else{
        return res.status(404).send("qr null")
      }   
    }    
    catch(err){
      next(err);
    }
});


module.exports = {router , getqr};