((self) => {
    'use strict';

    const classes = {
        style: 'custom-style',
        wrapper: 'custom-wrapper',
        container: 'custom-product-container',
        image: 'custom-product-image',
        name: 'custom-product-name',
        list: 'visited-products-list',
        content: 'visited-products-content',
        title: 'visited-products-title',
        productUrl: 'custom-product-url',
        productPrice: 'custom-product-price',
        nextArrow: 'next-arrow-element',
        prevArrow: 'prev-arrow-element',
        contentWrapper: 'last-visited-products',
        sliderArrowInactive: 'slider-arrow-inactive',
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: 'body',
    });

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.setEvents();
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        $(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, container, image, name, list, content, title, productUrl,
             productPrice, nextArrow, prevArrow,contentWrapper, sliderArrowInactive } = selectors;

        const customStyle = `
        ${ wrapper } {
            display: flex;
            justify-content:center;
            box-shadow: 80px 80px 80px 80px rgba(198, 206, 215, .3);
            background-color: #fff;
            margin: 10px 0px;
            padding: 10px 10px 0px 10px;
        }
        ${ container } {
            display: flex;
            width: 120px;
            align-items: center;
            justify-content: center;
            text-align: left;
        }
        ${ image } {
            width: 100px;
            margin-top:10px;
        }
        ${ list } {
            display: flex;
            list-style: none;
            transition: transform 0.3s ease;
            padding:0;
        }
        ${ name } {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            text-overflow: ellipsis;
            width:100px;
            overflow: hidden;
            margin: 10px 0px;
        }
        ${ content } {
            margin-top: 10px;
            overflow-x: hidden;
        }
        ${ title } {
            font-size: 20px;
            font-weight: 700;
            line-height: .86;
            color: #193db0 !important;
        }
        ${ productUrl }{
            text-decoration:none !important;
        }
        ${ productPrice }{
            color: #193db0 !important;
            font-size:16px;
            font-weight:bold;
        }
        ${ prevArrow } {
            position:absolute;
            left:0px;
            top:100px;
            font-size:30px;
            text-decoration:none !important;
        }
        ${ nextArrow } {
            position:absolute;
            right:0px;
            top:100px;
            font-size:30px;
            text-decoration:none !important;
        }
        ${ contentWrapper }{
            position:relative;
            width:100%;
        }
        ${ sliderArrowInactive }{
            display:none;
        }
        @media screen and (min-width:1650px){
            ${ prevArrow } {
                left:-12px;
            }
            ${ nextArrow } {
                right:0px;
            }
            ${ title }{
                margin-left:20px;
            }
        }
        @media screen and (max-width:768px){
            ${ image }{
                width:90px;
            }
            ${ container }{
                max-width:100px;
            }
            ${ prevArrow } {
                left:-20px;
            }
            ${ nextArrow } {
                right:-10px;
            }
        }
        `;

        $(`<style>`).addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const visitedProducts =  JSON.parse(localStorage.getItem('visitedProducts')) ?? [];
        const productId = $('.product-detail').attr('modelid');
        const filteredProducts = visitedProducts.filter((product) => product.id !== productId)
            .sort((a, b) => b.timeStamp - a.timeStamp);

        if (filteredProducts.length > 0 && self.isOnProductPage()) {
            const productsHTML = filteredProducts.map((product) => `
                <li>
                    <div class="${ classes.container }">
                        <a class="${ classes.productUrl }" href=${ product.productUrl }>
                            <img class="${ classes.image }" src="${ product.imgUrl }">
                            <div class="${ classes.name }">${ product.name }</div>
                            <span class="custom-product-price">${ product.productPrice }</span>
                        </a>
                    </div>
                </li>
            `).join('');

            const outerHtml = `
                <div class="${ classes.wrapper }">
                    <div class="${ classes.contentWrapper }">
                        <h2 class="${ classes.title }">Son Gezilen Ürünler</h2>
                        <div class="${ classes.content }">
                            <ul class="${ classes.list }">
                                ${ productsHTML }
                            </ul>

                        </div>
                        <a href ="#" class="${ classes.prevArrow }">&#8249;</a>
                        <a href ="#" class="${ classes.nextArrow }">&#8250;</a>
                    </div>
                </div>`;

            $('.desktop-show-pr-area-buttons').after(outerHtml);
        }
    };

    self.setEvents = () => {
        if (self.isOnProductPage()) {
            const visitedProducts =  JSON.parse(localStorage.getItem('visitedProducts')) ?? [];
            const productId = $('.product-detail').attr('modelid');
            const isProductExists = visitedProducts.some(product => product.id == productId);
            if (!isProductExists) {
                const newProduct = {
                    id: $('.product-detail').attr('modelid'),
                    name: $('.breadcrumb-item:last').text(),
                    imgUrl: $('.product-large-image:first').attr('src'),
                    productUrl: window.location.href,
                    productPrice: $('.current-price').text().trim() || $('.price-in-cart').text().trim(),
                    timeStamp: Date.now(),
                };
                visitedProducts.push(newProduct);
                localStorage.setItem('visitedProducts', JSON.stringify(visitedProducts));
            }

            const prevArrow = $(selectors.prevArrow);
            const nextArrow = $(selectors.nextArrow);
            const carousel = $(selectors.list)
            let currentOffset = 0;
            const visibleWidth = $(selectors.content).width();
            const totalListWidth = $(selectors.list)[0].scrollWidth;
            const maxOffset = totalListWidth - visibleWidth;
            
            self.setArrowInactive(prevArrow, nextArrow, currentOffset, maxOffset);
            
            prevArrow.on('click', (event) => {
                event.preventDefault();
                const remaining = currentOffset;
                const scrollAmount = $(selectors.list + ' li').outerWidth(true);

                if (remaining < scrollAmount * 2) {
                    currentOffset -= remaining;
                } else {
                    currentOffset -= scrollAmount;
                }
                carousel.css('transform', `translateX(-${ currentOffset }px)`);             
                self.setArrowInactive(prevArrow, nextArrow, currentOffset, maxOffset);
            });
            nextArrow.on('click', (event) => {
                event.preventDefault();
                const remaining = totalListWidth - (currentOffset + visibleWidth);
                const scrollAmount = $(selectors.list + ' li').outerWidth(true);

                if (remaining < scrollAmount * 2) {
                    currentOffset += remaining;
                } else {
                    currentOffset += scrollAmount;
                }
                carousel.css('transform', `translateX(-${ currentOffset }px)`);
                self.setArrowInactive(prevArrow, nextArrow, currentOffset,maxOffset);
            });
        }
    };

    self.isOnProductPage = () => $('.product-detail').length > 0;
    
    self.setArrowInactive = (prevArrow,nextArrow,currentOffset,maxOffset) =>{
        if(maxOffset <= 0) {
            prevArrow.addClass(classes.sliderArrowInactive);
            nextArrow.addClass(classes.sliderArrowInactive);
        }else if(currentOffset == 0){
            prevArrow.addClass(classes.sliderArrowInactive);
            nextArrow.removeClass(classes.sliderArrowInactive);
        }else if(currentOffset >= maxOffset){
            nextArrow.addClass(classes.sliderArrowInactive);
            prevArrow.removeClass(classes.sliderArrowInactive);
        }else{
            prevArrow.removeClass(classes.sliderArrowInactive);
            nextArrow.removeClass(classes.sliderArrowInactive);
        }
    }

    self.init();
})({});
