
const Pagos = require('../models/pagosDiarios');




const pagosGet =  async (req, res) => {
  try {
    // res.send('Pagos Get route is working');
    const pagos = await Pagos.find().limit(5);
    // res.json( pagos );
    res.json( pagos);
    
  } catch (error) {
    console.error('Error al consultar los pagos:', error);
        res.status(500).json({
            ok: false,
            msq: 'Error al obtener los pagos',
            error: error.message
        });
    
  }
  
}


const postComercial = async (req, res) => {

  const body = req.body;
  console.log(body)
  const { empresa } = req.body

  const results = await Pagos.find({ cantidadPagos: {$lte: empresa } }).sort({ totalPago: 1 }).limit(8);
  
  res.json( results );
}

  const pagosPost = (req, res) => {

    const body = req.body;
    const { fechaFin } = req.body
    
    res.json({
        ok: true,
        msq:'Post Api-controolador-3',
        body,
        fechaFin
    })
  }

  module.exports ={
    pagosGet,
    postComercial,
    pagosPost
  }