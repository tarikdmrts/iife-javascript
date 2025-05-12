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
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: `body`,
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
        const { wrapper, container, image, name, list, content, title, productUrl, productPrice } = selectors;

        const customStyle = `
        ${ wrapper } {
            display: flex;
            box-shadow: 80px 80px 80px 80px rgba(198, 206, 215, .3);
            background-color: #fff;
            margin: 10px 0px;
            padding: 10px 10px 0px 10px;
        }
        ${ container } {
            width: 120px;
            text-align:left;
        }
        ${ image } {
            width: 100px;
            margin-top:10px;
        }
        ${ list } {
            display: flex;
            list-style: none;
            padding: 10px 10px 10px 0px;
            overflow-x: hidden;
            flex-wrap:wrap;
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
        `;

        $(`<style>`).addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const visitedProducts =  JSON.parse(localStorage.getItem('visitedProducts')) || [];
        const productId = $('.product-detail').attr('modelid');
        const filteredProducts = visitedProducts.filter((product) => product.id !== productId);

        if (filteredProducts.length > 0 && $('.product-detail').length > 0) {
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
                    <div class="last-visited-products">
                        <h2 class="${ classes.title }">Son Gezilen Ürünler</h2>
                        <div class="${ classes.content }">
                            <ul class="${ classes.list }">
                                ${ productsHTML }
                            </ul>
                        </div>
                    </div>
                </div>`;

            $('.desktop-show-pr-area-buttons').after(outerHtml);
        }
    };

    self.setEvents = () => {
        if (self.isOnProductPage()) {
            const visitedProducts =  JSON.parse(localStorage.getItem('visitedProducts')) || [];
            const productId = $('.product-detail').attr('modelid');
            const isProductExists = visitedProducts.some(product => product.id == productId);
            if (!isProductExists) {
                const newProduct = {
                    id: $('.product-detail').attr('modelid'),
                    name: $('.breadcrumb-item:last').text(),
                    imgUrl: $('.product-large-image:first').attr('src'),
                    productUrl: window.location.href,
                    productPrice: $('.current-price').text().trim() || $('.price-in-cart').text().trim(),
                };
                visitedProducts.push(newProduct);
                localStorage.setItem('visitedProducts', JSON.stringify(visitedProducts));
            }
        }
    };

    self.isOnProductPage = () => $('.product-detail').length > 0;

    self.init();
})({});
