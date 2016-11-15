

define([
	'coreJS/adapt'
], function(Adapt) {

	var ArticleBackgroundView = Backbone.View.extend({

		_articleModels: null,
		_articleModelsIndexed: null,
		$backgroundContainer: null,
		$backgrounds: null,
		$articleElements: null,
		_firstId: null,
		_activeId: null,

		initialize: function() {
			this._articleModels = this.model.findDescendants('articles').filter(function(model) {
				return model.get("_articleBackground");
			});
			if(this._articleModels.length == 0) {
			        return;
			}
			this._articleModelsIndexed = _.indexBy(this._articleModels, "_id");

			this.listenTo(Adapt, "pageView:ready", this.onPageReady);
            
            //Is this the best way to swap out graphics - maybe best to add both graphics on load and then toggle classes on device:changed, device:resize?
            this.listenTo(Adapt, 'device:changed', this.onPageReady);
            this.listenTo(Adapt, 'device:resize', this.onPageReady);
            
			
		
		},

		onPageReady: function() {

			this.$articleElements = {};
			this.callbacks = {};
			
			for (var i = 0, l = this._articleModels.length; i < l; i++) {
				var articleModel = this._articleModels[i];				
				if(!articleModel.get('_articleBackground')) continue;

				var id = articleModel.get("_id");

				if (!this._firstId) this._firstId = id;

				var $articleElement = this.$el.find("."+ id);

				$articleElement.attr("data-article-background", id);
				this.$articleElements[id] = $articleElement;
				this.$articleElements[id].on("onscreen", this.callbacks[id]);


				var options = articleModel.get('_articleBackground');
                
                //Initially set the background graphic and height - this will be called on window resize and device
                this.setBackgroundGraphic($articleElement, options);
				
			}

			this._activeId = this._firstId;
			
	

		},
        setBackgroundGraphic: function($articleElement, options) {
            if (Adapt.device.screenSize === 'large') {
                $articleElement.addClass('article-background-article').remove('article-background-article-mobile').css({'background-image': 'url('+options.src+')', 'background-color': options.backgroundColor + ' !important', 'background-repeat': options.backgroundRepeat, 'background-size': options.backgroundSize, 'background-position':options.backgroundPosition, 'min-height' : options.bannerHeight + 'px'});
            } else {
                $articleElement.addClass('article-background-article-mobile').remove('article-background-article').css({'background-image': 'url('+options.mobileSrc+')', 'background-color': options.backgroundColor + ' !important', 'background-repeat': options.backgroundRepeat, 'background-size': options.backgroundSize, 'background-position':options.backgroundPosition, 'min-height' : options.mobileBannerHeight + 'px'});
            }
        }

	});

	Adapt.on("pageView:postRender", function(view) {
		var model = view.model;
		if (model.get("_articleBackground")) {
				new ArticleBackgroundView({model: model, el: view.el });
		}
	});

});
