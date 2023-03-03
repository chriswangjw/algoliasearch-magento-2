define([], function () {
    return {
        getItemHtml: function (item, html, addTocart) {
            let correctFKey = getCookie('form_key');
            let action = algoliaConfig.recommend.addToCartParams.action + 'product/' + item.objectID + '/';
            if(correctFKey != "" && algoliaConfig.recommend.addToCartParams.formKey != correctFKey) {
                config.recommend.addToCartParams.formKey = correctFKey;
            }
            this.config = algoliaConfig;
            this.defaultIndexName = algoliaConfig.indexName + '_products';
            return  html`<div class="result-wrapper">
                <a class="result recommend-item product-url" href="${item.url}" data-objectid=${item.objectID}  data-index=${this.defaultIndexName}>
                    <div class="result-content">
                        <div class="result-thumbnail">
                            <img class="product-img" src="${item.image_url}" alt="${item.name}"/>
                        </div>
                        <div class="result-sub-content">
                            <p class="product-name">${item.name}</p>
                            ${addTocart && html`
                                <form class="addTocartForm" action="${action}" method="post" data-role="tocart-form">
                                    <input type="hidden" name="form_key" value="${algoliaConfig.recommend.addToCartParams.formKey}" />
                                    <input type="hidden" name="unec" value="${AlgoliaBase64.mageEncode(action)}"/>
                                    <input type="hidden" name="product" value="${item.objectID}" />
                                    <button type="submit" class="action tocart primary">
                                        <span>${algoliaConfig.translations.addToCart}</span>
                                    </button>
                                </form>`
                            }
                        </div>
                    </div>
                </a>
            </div>`;
        },
        getHeaderHtml: function (html,title) {
            return html`<h3 class="auc-Recommend-title">${title}</h3>`;
        }
    };
});
