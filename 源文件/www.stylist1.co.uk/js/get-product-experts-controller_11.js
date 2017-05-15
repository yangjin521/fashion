var GetProductExpertsController = (function ($) {
    return {
        LOAD_MORE_CONTAINER_OPEN_ANIMATION_TIMEOUT: 300,

        expertsPerPage: backEndObject.expertsPerPage,
        ajaxUrl: backEndObject.ajaxUrl,
        isBlockLoadMoreButton: false,

        $loadMoreBtn: null,
        $loadedExpertsContainer: null,

        productId : null,
        page: 1,

        init: function (productId) {
            this.productId = productId;
            this.$loadMoreBtn = $('#load-more-btn');
            this.$loadedExpertsContainer = $('#loaded-experts');
            this.$loadMoreBtn.click( this._loadMoreBtnClickHandler.bind(this) );
        },

        _loadMoreBtnClickHandler: function () {
            if (!this.isBlockLoadMoreButton) {
                this.isBlockLoadMoreButton = true;
                $.ajax({
                    url: this.ajaxUrl,
                    type: 'POST',
                    dataType: "json",
                    data: {
                        action: 'getProductExperts',
                        productId: this.productId,
                        page: this.page + 1
                    },
                    success: this._loadMoreCallback.bind(this),
                    error: this._loadMoreErrorCallback.bind(this)
                });
            }
        },

        _loadMoreCallback: function (data) {
            var experts = data.experts,
                $pageContainer,
                html = '',
                expert,
                i;
            this.isBlockLoadMoreButton = false;
            if (Array.isArray(experts)) {
                for (i = 0; i < experts.length; i++) {
                    expert = experts[i];
                    html += '' +
                        '<div class="expert-card">' +
                            '<div class="image-container" style="background-image: url(\''+ expert.img +'\');"></div>' +
                            '<div class="info">' +
                                '<h5 class="name text-left">' + expert.name + '</h5>' +
                                '<p class="job-title text-left">' + expert.jobTitle +'</p>' +
                                '<p class="description text-left">' + expert.description + '</p>' +
                            '</div>' +
                        '</div>';
                }
                this.page++;
                $pageContainer = $('<div id="experts-page-' + this.page + '" class="experts-page">');
                $pageContainer.html(html);
                $pageContainer.height(0);
                this.$loadedExpertsContainer.append($pageContainer);
                $pageContainer
                    .stop()
                    .animate(
                        {height: $pageContainer.get(0).scrollHeight},
                        this.LOAD_MORE_CONTAINER_OPEN_ANIMATION_TIMEOUT,
                        this._loadMoreContainerOpenAnimationCallback.bind(this, $pageContainer)
                    );
            }
            if (!data.isCanLoadMore) {
                $('#load-more-btn').remove();
            }
        },

        _loadMoreContainerOpenAnimationCallback: function ($pageContainer) {
            $pageContainer.css({height: 'auto'});
        },

        _loadMoreErrorCallback: function () {
            this.isBlockLoadMoreButton = false;
        }
    };
})(jQuery);

ControllersManager.registerController('get-product-experts-controller', GetProductExpertsController);