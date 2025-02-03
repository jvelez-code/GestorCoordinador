
const Cliente = require('../entitys/clientes');
const Pagos = require('../entitys/pagos');
const authToken = require('../controllers/authToken');
const dataPagos = require('../controllers/dataPagos')


const dataPost = async (req, res) =>{
    try {
        const token = await authToken.obtenerToken();
        const { fechaInicio, fechaFin } = req.body;
        const data = await dataPagos.obtenerDatosPagos(token, fechaInicio, fechaFin);
        //res.json(data.object);
        const pagosFecha = await Pagos.insertMany(data.object);
        res.json({
            ok: true,
            msq: 'Pagos guardados correctamente'
        });

    } catch (error) {
        res.status(500).send('Error al obtener los pagos');        
    }

}



const pagosGet =  async (req, res) => {
    
try {

  //  const pagos =  await Pagos.find();
  //  res.json(pagos);
    const clientes = await Cliente.find({ nombre: "dana" });

    if (clientes.length === 0) {
        return res.status(404).json({
            ok: false,
            msq: 'Cliente no encontrado'
        });
    }

    res.json({
        ok: true,
        msq: 'Clientes encontrados',
        data: clientes
    });
    
} catch (error) {
    console.error('Error al realizar la consulta:', error);
        res.status(500).json({
            ok: false,
            msq: 'Error en el servidor'
        });
    
}
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
    dataPost,
    pagosGet,
    pagosPost
  }