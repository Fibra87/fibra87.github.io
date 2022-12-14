let categoriaSeleccionada = localStorage.getItem("catID")
let prod_url = "https://japceibal.github.io/emercado-api/cats_products/" + categoriaSeleccionada + ".json";
let array_prod = [];
let resultados = [];
let valorMin = undefined;
let valorMax = undefined;
const ORDER_ASC_BY_COST = "12";
const ORDER_DESC_BY_COST = "21";
const ORDER_BY_PROD_SOLDCOUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;



function sortProductos(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( (a.cost) < (b.cost )) { return -1; }
            if ( (a.cost) > (b.cost )) { return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( (a.cost) > (b.cost )) { return -1; }
            if ( (a.cost) < (b.cost )) { return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_SOLDCOUNT){
        result = array.sort(function(a, b) {
            if ( (a.soldCount) > (b.soldCount )) { return -1; }
            if ( (a.soldCount) < (b.soldCount )) { return 1; }
            return 0;
        });
    }

    return result;
}

function sortAndShowProductos(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        array_prod = categoriesArray;
    }

    array_prod = sortProductos(currentSortCriteria, array_prod);

    //Muestro las categorías ordenadas
    muestraListadoProductos(array_prod);
}

function parrafo() {
    let etiqueta = ""
    if (categoriaSeleccionada === "101") {
        etiqueta = "Autos";
    }
    if (categoriaSeleccionada === "102") {
        etiqueta = "Juguetes";
    }
    if (categoriaSeleccionada === "103") {
        etiqueta = "Muebles";
    }
    document.getElementById("tipo").innerHTML = etiqueta
}

function infoProduct(id){
    localStorage.setItem("product",id);
    window.location = "product-info.html"
}

/*probando funciones
function mostrarproductos(array_prod){
    let htmlContentToAppend = "";

    for(let producto in array_prod.products);
            htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + producto.imgage + `" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4>`+ producto.name +`</h4> 
                        <p> `+ producto.description +`</p> 
                        </div>
                        <small class="text-muted">` + producto.productCount + ` artículos</small> 
                    </div>

                </div>
            </div>
        </div>
        `
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend; 
    }
}
*/

//probando otra funcion copiada de categories

function muestraListadoProductos(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let cadaProducto = array[i];

        if (((valorMin == undefined) || (valorMin != undefined && parseInt(cadaProducto.cost) >= valorMin)) &&
            ((valorMax == undefined) || (valorMax != undefined && parseInt(cadaProducto.cost) <= valorMax))) {

            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action cursor-active" onclick=infoProduct(${cadaProducto.id})>
                <div class="row">
                    <div class="col-3">
                        <img src="${cadaProducto.image}" alt="${cadaProducto.name}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${cadaProducto.name} - $${cadaProducto.cost}</h4>
                            <small class="text-muted">${cadaProducto.soldCount} artículos</small>
                        </div>
                        <p class="mb-1">${cadaProducto.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("productoscontainer").innerHTML = htmlContentToAppend;
    }
}

function buscarProductos() {
    let busqueda = document.getElementById("inputBuscador").value;
    resultados = [];

    if (busqueda!==""){
        for (let i = 0; i < array_prod.length; i++) {
            let titulo = array_prod[i].name.toLowerCase();
            let descripcion = array_prod[i].description.toLowerCase();
            if (titulo.includes(busqueda.toLowerCase()) || descripcion.includes(busqueda.toLowerCase())) {
                resultados.push(array_prod[i]);
            }
        }
        console.log(resultados);
        if (resultados.length===0){
            document.getElementById("productoscontainer").innerHTML = "";
        }
        muestraListadoProductos(resultados);
    }else{
        muestraListadoProductos(array_prod);
    }
}




/* 
EJECUCIÓN:

-Al cargar la página se llama a getJSONData() pasándole por parámetro la dirección para obtener el listado.
-Se verifica el estado del objeto que devuelve, y, si es correcto, se cargan los datos en array_prod.
-Por último, se llama a muestraListadoProductos() pasándole por parámetro array_prod.

*/

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(prod_url).then(function (resultObj) {
        if (resultObj.status === "ok") {
            array_prod = resultObj.data.products;
            muestraListadoProductos(array_prod)
            parrafo()
        }
    });
    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        valorMin = document.getElementById("rangeFilterCountMin").value;
        valorMax = document.getElementById("rangeFilterCountMax").value;

        if ((valorMin != undefined) && (valorMin != "") && (parseInt(valorMin)) >= 0) {
            valorMin = parseInt(valorMin);
        }
        else {
            valorMin = undefined;
        }

        if ((valorMax != undefined) && (valorMax != "") && (parseInt(valorMax)) >= 0) {
            valorMax = parseInt(valorMax);
        }
        else {
            valorMax = undefined;
        }
        muestraListadoProductos(array_prod);
    });
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        valorMin = undefined;
        valorMax = undefined;

        muestraListadoProductos(array_prod);
    });
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProductos(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProductos(ORDER_DESC_BY_COST);
    });
    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProductos(ORDER_BY_PROD_SOLDCOUNT);
    });

});
