const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

const resgistrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;
    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda');
        return
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.existe');

    if(!existeAlerta) { // Si la alerta no existe...
        const alerta = document.createElement('P');
        alerta.classList.add('existe', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3',
         'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);
    
        setTimeout( () => { // Quita la alerta despues de 3 segundos
            alerta.remove();
        }, 3000); 
    }

}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = '37140609-539fb6a34c2492f4ca8364287';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${resgistrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits)
            mostrarImagenes(resultado.hits);
        });
}

function *crearPaginador(total) {
    for (let i=1; i<=total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil( total / resgistrosPorPagina)); // (Math.ceil) redondea un numero hacia arriba
}

function mostrarImagenes(imagenes) {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iteramos sobre el arreglo de imagenes y construimos el HTML
    imagenes.forEach( imagen => {

        const { likes, views, previewURL, largeImageURL } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">

                    <img class="w-full" src="${previewURL}"/>
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light"> Me Gusta </span></p>
                        <p class="font-bold">${views} <span class="font-light"> Veces vista </span></p>
                        
                        <a 
                            class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white"
                            href=${largeImageURL} 
                            rel="noopener noreferrer"
                            target="_blank" 
                        >
                            Ver Imagen
                        </a>

                    </div>
                </div>
            </div>
            `;
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const { value, done } = iterador.next(); // vamos iterando
        if(done) return;

        // Caso contrario, genera un boton para cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded');

        boton.onclick = () => {
            paginaActual = value; // le asignamos el valor a la pagina actual
            
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}
