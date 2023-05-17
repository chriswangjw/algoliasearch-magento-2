define([], function () {
    return {
        getItemHtml: function (item, html, addTocart) {
            let correctFKey = getCookie('form_key');
            let action = algoliaConfig.recommend.addToCartParams.action + 'product/' + item.objectID + '/';
            if(correctFKey != "" && algoliaConfig.recommend.addToCartParams.formKey != correctFKey) {
                algoliaConfig.recommend.addToCartParams.formKey = correctFKey;
            }
            this.config = algoliaConfig;
            this.defaultIndexName = algoliaConfig.indexName + '_products';

            // - jwc
            const addToCartHtml = addTocart && html`
                <form class="addTocartForm" action="${action}" method="post" data-role="tocart-form">
                    <input type="hidden" name="form_key" value="${algoliaConfig.recommend.addToCartParams.formKey}" />
                    <input type="hidden" name="unec" value="${AlgoliaBase64.mageEncode(action)}"/>
                    <input type="hidden" name="product" value="${item.objectID}" />
                    <button type="submit" class="action tocart primary stock-status-button--${item.dispatchLabelClass}">
                        <svg class="icon">
                            <use href="${item.algoliaRecommendCartSvg}"></use>
                        </svg>
                    </button>
                </form>
            `;

            let badgesHtmlArr = [];
            item.badgesArray && item.badgesArray.forEach(b => badgesHtmlArr.push(html`<div class="badge product-view__badge"><span>${b}</span></div>`));

            let priceHtml = html `<div className="algoliasearch-autocomplete-price">
                <span className="after_special ${item['price'][algoliaConfig.currencyCode]['default_original_formated'] != null ? 'promotion' : ''}"> <!-- jwc -->
                    ${item['price'][algoliaConfig.currencyCode]['default_formated']}
                    <sup>.${item['price'][algoliaConfig.currencyCode]['default_formated_cents'] || ''}</sup>
                </span>
                ${item['price'][algoliaConfig.currencyCode]['default_original_formated'] ? html`<span class="before_special"> ${item['price'][algoliaConfig.currencyCode]['default_original_formated']} </span>`:''}
            </div>`;

            return  html`<div class="result-wrapper">
                <a class="result recommend-item product-url" href="${item.url}" data-objectid=${item.objectID}  data-index=${this.defaultIndexName}>
                    <div class="result-content">
                        <div class="badges">${item.badgesLength && html`<div>${badgesHtmlArr}</div>`}</div>
                        <div class="result-thumbnail">
                            <img class="product-img" src="${item.image_url}" alt="${item.name}"/>
                        </div>
                        <div class="result-sub-content">
                            <h3 class="result-title product-title-in-list">${item.name}</h3>
                            <div class="ratings">
                                <div class="result-sub-content">
                                    <div class="price">
                                        <div class="price-wrapper">${priceHtml}</div>
                                    </div>
                                </div>
                            </div>
                            ${addToCartHtml}
                        </div>
                        <div class="store-availability">
                            <div class="dispatch-label ${item.dispatchLabelClass}"><div class="circle"></div>${item.dispatch_eta_label ?? item.stock_status_label}</div>
                        </div>
                    </div>
                </a>
            </div>`;
            // + jwc
        },
        getHeaderHtml: function (html,title) {
            return html`<h3 class="auc-Recommend-title">${title}</h3>`;
        },
    };
});
