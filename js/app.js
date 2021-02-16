//Variables
const formulario   = document.querySelector('#agregar-gasto'),
      gastoListado = document.querySelector('#gastos ul');



//Eventos
listeners()
function listeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto)

}



//Clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = []
    }
    nuevoGasto( gasto ){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    }

    calcularRestante(){
        const totalGastado = this.gastos.reduce((total, gasto) =>  total + gasto.cantidad, 0);
        this.restante = this.presupuesto - totalGastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante()
    }
}
let presupuesto;


class UI{
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        //crear div
       const divMensaje = document.createElement('div');
       divMensaje.classList.add('text-center', 'alert')

       if(tipo == 'error'){
           divMensaje.classList.add('alert-danger');
       } else{
           divMensaje.classList.add('alert-success')
       }

       //Mensaje de error
       divMensaje.textContent = mensaje;
       //Insertar en el HTML
       document.querySelector('.primario').insertBefore( divMensaje, formulario)
       //Eliminarlo luego de 3seg
       setTimeout(()=>{
            divMensaje.remove()
       }, 3000)
    }

    mostrarGastos(gastos){
        this.limpiarHTML();
        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { nombre, cantidad, id} = gasto;
            //crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            //Agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad} </span>`

            //Btn para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () =>{
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar);
            //agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        

        })
    }
    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        //comprobar 25%
        if((presupuesto / 4) > restante){
          const restanteDiv = document.querySelector('.restante');
          restanteDiv.classList.remove('alert-success', 'alert-warning');
          restanteDiv.classList.add('alert-danger');
        }
        //comprobar 50%
        else if((presupuesto / 2) > restante){
            const restanteDiv = document.querySelector('.restante');
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
            }
        else{
                const restanteDiv = document.querySelector('.restante');
                restanteDiv.classList.remove('alert-danger', 'alert-warning');
                restanteDiv.classList.add('alert-success')
            }
        //si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
        }
    
    }
}


//Instanciar
const ui = new UI();

//Funciones



function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Ingrese el presupuesto')
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    }   else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Ingresar una cantidad valida', 'error');
        
        return;
    }
    //Generar un objeto con el gasto
    const gasto = { 
         nombre,
         cantidad,
         id: Date.now()
        };

   presupuesto.nuevoGasto(gasto)

   //Mensaje todo ok
   ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
   //Reinicia el formulario
   formulario.reset();
}


//Eliminar gasto
function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
