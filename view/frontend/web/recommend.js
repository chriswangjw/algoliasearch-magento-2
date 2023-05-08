define([
    'jquery',
    'algoliaBundle',
    'recommend',
    'recommendJs',
    'recommendProductsHtml',
    'algoliaRecommendDynamic', // jwc
    'domReady!',
    'slick'
],function ($, algoliaBundle, recommend, recommendJs, recommendProductsHtml, algoliaRecommendDynamic) { // jwc
    'use strict';

    // - jwc
    const botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
    if (new RegExp(botPattern, 'i').test(navigator.userAgent)) {
        return;
    }
    const $relatedProducts = $('#relatedProducts');
    if ($relatedProducts.length) {
        const observer = new MutationObserver(function(mutations) {
            const observer2 = new MutationObserver(function(mutations) { algoliaRecommendDynamic.generateRecommendSlick(algoliaRecommendDynamic.constants.RELATED_PRODUCTS, $relatedProducts); });
            observer2.observe($('#relatedProducts .auc-Recommend')[0], { childList: true });
        });
        observer.observe($relatedProducts[0], { childList: true });
    }
    // + jwc

    return function (config, element) {
        algoliaBundle.$(function ($) {
            this.defaultIndexName = algoliaConfig.indexName + '_products';
            const appId = algoliaConfig.applicationId;
            const apiKey = algoliaConfig.apiKey;
            const recommendClient = recommend(appId, apiKey);
            const indexName = this.defaultIndexName;
            // - jwc
            let objectIds = config.algoliObjectId;
            if (!objectIds)
                objectIds = $("[data-element='algolia_recs_object_ids']").text().split(",");
            // + jwc                
            if ($('body').hasClass('catalog-product-view') || $('body').hasClass('checkout-cart-index') || $('body').hasClass('cms-index-index') || $('body').hasClass('cms-page-view')) { // jwc
                // --- Add the current product objectID here ---
                if ((algoliaConfig.recommend.enabledFBT && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.enabledFBTInCart && $('body').hasClass('checkout-cart-index'))) {
                    recommendJs.frequentlyBoughtTogether({
                        container: '#frequentlyBoughtTogether',
                        recommendClient,
                        indexName,
                        objectIDs: objectIds, // jwc
                        maxRecommendations: algoliaConfig.recommend.limitFBTProducts,
                        headerComponent({html}) {
                            return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.FBTTitle);
                        },
                        itemComponent({item, html}) {
                            item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                            return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInFBT);
                        },
                    });
                }
                if ((algoliaConfig.recommend.enabledRelated && $('body').hasClass('catalog-product-view'))
                    || (algoliaConfig.recommend.enabledRelatedInCart && $('body').hasClass('checkout-cart-index')) // jwc
                    || (algoliaConfig.recommend.enabledRelated && $('body').hasClass('cms-index-index')) // jwc
                    || (algoliaConfig.recommend.enabledRelated && $('body').hasClass('cms-page-view')) // jwc
                ) {
                    recommendJs.relatedProducts({
                        container: '#relatedProducts',
                        recommendClient,
                        indexName,
                        objectIDs: objectIds, // jwc
                        maxRecommendations: algoliaConfig.recommend.limitRelatedProducts,
                        headerComponent({html}) {
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
                recommendJs.trendingItems({
                    container: '#trendItems',
                    facetName: algoliaConfig.recommend.trendItemFacetName ? algoliaConfig.recommend.trendItemFacetName : '',
                    facetValue: algoliaConfig.recommend.trendItemFacetValue ? algoliaConfig.recommend.trendItemFacetValue : '',
                    recommendClient,
                    indexName,
                    maxRecommendations: algoliaConfig.recommend.limitTrendingItems,
                    headerComponent({html}) {
                        return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.trendingItemsTitle);
                    },
                    itemComponent({item, html}) {
                        item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                        return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInTrendsItem);
                    },
                });
            } else if (algoliaConfig.recommend.enabledTrendItems && typeof config.recommendTrendContainer !== "undefined") {
                let containerValue = "#" + config.recommendTrendContainer;
                recommendJs.trendingItems({
                    container: containerValue,
                    facetName: config.facetName ? config.facetName : '',
                    facetValue: config.facetValue ? config.facetValue : '',
                    recommendClient,
                    indexName,
                    maxRecommendations: config.numOfTrendsItem ? parseInt(config.numOfTrendsItem) : algoliaConfig.recommend.limitTrendingItems,
                    headerComponent({html}) {
                        return recommendProductsHtml.getHeaderHtml(html,algoliaConfig.recommend.trendingItemsTitle);
                    },
                    itemComponent({item, html}) {
                        item.algoliaRecommendCartSvg = config.algoliaRecommendCartSvg ?? '';
                        return recommendProductsHtml.getItemHtml(item, html, algoliaConfig.recommend.isAddToCartEnabledInTrendsItem);
                    },
                });
            }
        });
    }
});
