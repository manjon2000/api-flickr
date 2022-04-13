$(document).ready(function () {

    // Variables
    let busqueda;
    let itemLimit;
    let mostrarItems =  ($('#limitador_items').val() - 2);
    let arrayImg = [];
    let container = document.getElementById('galeria_imagenes')
    let containerModal = document.getElementById('modal__item_overlay')
    let containerTemplateModal = document.getElementById('modal_content')
    let closeModal = document.getElementById('btn__close')
    const spiner = document.getElementById('loader')
    const cookieBtnDark = document.cookie;

    // Cambiar de clase al los botones
    $('.filter__item').click(function(e){
        $('.filter__item').removeClass('actived__btn')
        $(this).addClass('actived__btn')
    });

    // Limitador de entrada de las imagenes
    $('#limitador_items').change(function(r){
        mostrarItems = $(this).val()
    });
    
    // Recordar que estilo de caja ha selecionado
    if(cookieBtnDark.match('format=default')){
        console.log('Default')
        document.querySelector('.uno').classList.add('actived__btn')
    }else if(cookieBtnDark.match('format=mosaico')){
        console.log('Mosaico')
        document.querySelector('.dos').classList.add('actived__btn')

    }else if(cookieBtnDark.match('format=column')){
        console.log('Column')
        document.querySelector('.tres').classList.add('actived__btn')
    }
    // Añadir clase al conteneor padre de las imagenes
    const btnUno = document.querySelector('.uno').addEventListener('click',function(a){
        container.classList.add('default')
        container.classList.remove('column')
        container.classList.remove('mosaico')
        document.cookie = 'format=default';
    });
    const btnDos = document.querySelector('.dos').addEventListener('click',function(b){
        container.classList.add('column')
        container.classList.remove('default')
        container.classList.remove('mosaico')
        document.cookie = 'format=mosaico';
    });
    const btnTres = document.querySelector('.tres').addEventListener('click',function(c){
        container.classList.add('mosaico')
        container.classList.remove('default')
        container.classList.remove('column')
        document.cookie = 'format=column';
    });


    // Funcion para que devuelve una respuesta de la api
    $('#search').on('input',function (e) {
        let valorInput = $(this).val();
        arrayImg = [];
        itemLimit = 30;
        if (valorInput.length > 3) {
            busqueda = valorInput;
            $.ajax({
                GET: "flickr.photos.search",
                url: `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=bdad2da0b9511e57958ae77eb7a2e975&text=${busqueda}&extras=description&format=json&nojsoncallback=1` ,
                dataType: "json",
                success: function (data) {

                    // Push de todas las url con imagen, descripcion, titulo, etc...
                   /*arrayImg*/
                
                    for (var i in data.photos.photo) {
                        arrayImg.push([
                            `https://live.staticflickr.com/${data.photos.photo[i].server}/${data.photos.photo[i].id}_${data.photos.photo[i].secret}_c.jpg`,
                            `https://live.staticflickr.com/${data.photos.photo[i].server}/${data.photos.photo[i].id}_${data.photos.photo[i].secret}_b.jpg`,
                            data.photos.photo[i].title, data.photos.photo[i].id, `https://www.flickr.com/photos/${data.photos.photo[i].owner}`,data.photos.photo[i].description._content]);
                    }
                    spiner.classList.remove('display-none')
                    setTimeout(function(){
                        spiner.classList.add('display-none')
                    },2500)
                    mostrarImgSmall(0,mostrarItems);

                    
                    // Abrir ventanas
                    let itemsImg = document.querySelectorAll('.item__img');
                    itemsImg.forEach(element => {
                        element.addEventListener('click', function (e) {
                            containerModal.classList.add('visible_modal')
                            var itemBuscar = this.getAttribute('id')
                            let busquedaItem = arrayImg.filter(elements => elements[3] == itemBuscar);
                            openModal(busquedaItem[0])
                        });
                    });
                }
            });
        } else {
            busqueda = '';
            container.innerHTML = '';
            arrayImg = []
        }
        function mostrarImgSmall(item,limitItem) {
            for (let a = item; a <= limitItem; a++) {
                 let tempalte = `
                <div id="${arrayImg[a][3]}" class="item__img">
                      <div class="item_image">
                          <img src="${arrayImg[a][0]}" alt="">
                      </div>
         
                      <div class="item__image__title">
                         <p>${arrayImg[a][2]}</p>
                      </div>  
                </div>`;
                 container.innerHTML += tempalte;
            }
        }
        function openModal(data) {
            console.log(data)
            if(data[5] == "" || data[5] == ' '){
                data[5] = 'No hay Descripcion';
            }
            let templateModal =
            `<div class="content__modal">
                <div class="img__item">
                    <img src="${data[1]}" alt="${data[2]}">
                </div>
                <div class="titulo__btn--usuario">
                    <h2>${data[2]}</h2>
                    <p>${data[5]}</p>
                </div>
            </div>`;
            containerTemplateModal.innerHTML = templateModal;
            if (closeModal) {
                closeModal.addEventListener('click', function (e) {
                    containerModal.classList.remove('visible_modal')
                })
            } else {
                console.log('No existe el elemento')
            }
        }

        // Mostrar mas imagenes al hacer scroll
        let margen = .1;
        $(window).on('scroll',function(){
            if(margen > $(document).height() - $(window).scrollTop() - $(window).height()) {
                    let numberactual = mostrarItems;
                    itemLimit = (numberactual + mostrarItems);
                    mostrarImgSmall(numberactual,itemLimit);
               }
        });
    });
   
});