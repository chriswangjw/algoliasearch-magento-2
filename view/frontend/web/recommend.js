define([
    'jquery',
    'algoliaBundle',
    'recommend',
    'recommendJs',
    'recommendProductsHtml',
    'algoliaCommonDynamic', // jwc
    'domReady!',
    'slick'
],function ($, algoliaBundle, recommend, recommendJs, recommendProductsHtml) { // jwc
    'use strict';

    if (typeof algoliaConfig === 'undefined') {
        return;
    }

    // - jwc
    const botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
    if (new RegExp(botPattern, 'i').test(navigator.userAgent)) {
        return;
    }
    // + jwc

    return function (config, element) {
        $(function ($) {
            this.defaultIndexName = algoliaConfig.indexName + '_products';
            const appId = algoliaConfig.applicationId;
            const apiKey = algoliaConfig.apiKey;
            const recommendClient = recommend(appId, apiKey);
            const indexName = this.defaultIndexName;

            if ($('body').hasClass('catalog-product-view') || $('body').hasClass('checkout-cart-index')) {
                // --- Add the current product objectID here ---
                if ((algoliaConfig.recommend.enabledFBT && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.enabledFBTInCart && $('body').hasClass('checkout-cart-index'))) {
                    if ($('#frequentlyBoughtTogether').length) // jwc
                    recommendJs.frequentlyBoughtTogether({
                        container: '#frequentlyBoughtTogether',
                        recommendClient,
                        indexName,
                        objectIDs: config.algoliObjectId,
                        maxRecommendations: algoliaConfig.recommend.limitFBTProducts,
                        transformItems:function (items) {
                            return items.map((item, index) => ({
                                ...item,
                                position: index + 1,
                            }));
                        },
                        headerComponent({html, recommendations}) {
                            if (!recommendations.length) {
                                return '';
                            }
                            return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.FBTTitle);
                        },
                        itemComponent({item, html}) {
                            item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                            item = transformHitJW(item); // jwc
                            return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInFBT);
                        },
                    });
                }
                if ((algoliaConfig.recommend.enabledRelated && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.enabledRelatedInCart && $('body').hasClass('checkout-cart-index'))) {
                    if ($('#relatedProducts').length) // jwc
                    recommendJs.relatedProducts({
                        container: '#relatedProducts',
                        recommendClient,
                        indexName,
                        objectIDs: config.algoliObjectId,
                        maxRecommendations: algoliaConfig.recommend.limitRelatedProducts,
                        transformItems:function (items) {
                            return items.map((item, index) => ({
                                ...item,
                                position: index + 1,
                            }));
                        },
                        headerComponent({html, recommendations}) {
                            if (!recommendations.length) {
                                return '';
                            }
                            return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.relatedProductsTitle);
                        },
                        itemComponent({item, html}) {
                            item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                            item = transformHitJW(item); // jwc
                            return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInRelatedProduct);
                        },
                    });
                }
            }

            if ((algoliaConfig.recommend.isTrendItemsEnabledInPDP && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.isTrendItemsEnabledInCartPage && $('body').hasClass('checkout-cart-index'))) {
                if ($('#trendItems').length) // jwc
                recommendJs.trendingItems({
                    container: '#trendItems',
                    facetName: algoliaConfig.recommend.trendItemFacetName ? algoliaConfig.recommend.trendItemFacetName : '',
                    facetValue: algoliaConfig.recommend.trendItemFacetValue ? algoliaConfig.recommend.trendItemFacetValue : '',
                    recommendClient,
                    indexName,
                    maxRecommendations: algoliaConfig.recommend.limitTrendingItems,
                    transformItems:function (items) {
                        return items.map((item, index) => ({
                            ...item,
                            position: index + 1,
                        }));
                    },
                    headerComponent({html, recommendations}) {
                        if (!recommendations.length) {
                            return '';
                        }
                        return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.trendingItemsTitle);
                    },
                    itemComponent({item, html}) {
                        item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                        item = transformHitJW(item); // jwc
                        return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInTrendsItem);
                    },
                });
            } else if (algoliaConfig.recommend.enabledTrendItems && typeof config.recommendTrendContainer !== "undefined") {
                let containerValue = "#" + config.recommendTrendContainer;
                if ($(containerValue).length) // jwc
                recommendJs.trendingItems({
                    container: containerValue,
                    facetName: config.facetName ? config.facetName : '',
                    facetValue: config.facetValue ? config.facetValue : '',
                    recommendClient,
                    indexName,
                    maxRecommendations: config.numOfTrendsItem ? parseInt(config.numOfTrendsItem) : algoliaConfig.recommend.limitTrendingItems,
                    transformItems:function (items) {
                        return items.map((item, index) => ({
                            ...item,
                            position: index + 1,
                        }));
                    },
                    headerComponent({html}) {
                        return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.trendingItemsTitle);
                    },
                    itemComponent({item, html}) {
                        item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                        item = transformHitJW(item); // jwc
                        return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInTrendsItem);
                    },
                });
            }
        });
    }
});
