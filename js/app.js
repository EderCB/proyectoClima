const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //Consultariamos la API

    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje) {
    
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        //Crear una alerta

        const alerta = document.createElement('div');
    
        alerta.classList.add('bg-red-100', 'border-red-100', 'text-red-700', 'px-4', 'py-3', 'rounded'
        , 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);

        //Se elimine la alerta despues de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000)
    }
}


function consultarAPI(ciudad, pais) {

    const appID = 'caf1d6438e2884a2e6c83358713b9d07';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
    
    console.log(url);
    Spinner(); //Muestra el spinner de carga
    
    fetch(url)
        .then( respuesta => {
            
            console.log(respuesta);
            return respuesta.json();
        })
        .then( datos => {
            limpiarHTML(); //Limpiar el HTML previo
            
            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            } else {

                //Imprime la respuesta en el HTML
                mostrarClima(datos);
                console.log(datos)
            }
        })
        .catch(error => {
            console.log(error);
        })

}

function mostrarClima(datos) {

    const { name, weather: [ { icon }] , main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    let dia = moment().format('dddd');
    let diaNumero = (moment().format('D'));
    let mes = moment().format('MMMM');
    let year = moment().format('YYYY');

    let fecha = `${dia}, ${diaNumero} de ${mes} , ${year}`;

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `${name}`;
    nombreCiudad.classList.add( 'text-5xl', 'clr-dark-blue');

    const contenedorFecha = document.createElement('p');
    contenedorFecha.textContent = `${fecha}`;
    contenedorFecha.classList.add('text-xl', 'uppercase', 'clr-dark-blue');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl', 'clr-dark-blue');

    const icono = document.createElement('img');
    icono.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    icono.classList.add('w-20', 'h-20', 'm-auto');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl', 'clr-dark-blue');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl', 'clr-dark-blue');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');

    
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(contenedorFecha);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(icono);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.classList.add('m-auto', 'w-80', 'py-4', 'px-5', 'bg-slate-400', 'rounded-lg');
    
    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);

}