/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch;
    
    
    var Carousel = my.Class(oo.view.Element, {
        constructor : function constructor(selector, pager, opt) {
            this._startX = 0;
            this._startTranslate = 0;

            var conf = {
                target: selector
            };

            Carousel.Super.call(this, conf);
            
            this._transitionDuration = 200;

            if (opt.model){
               /* var keys = Object.keys(items);

                if( ! (items[0] instanceof oo.view.Panel) ){
                    throw new Error('Items must be instance of Panel Class');
                }

                this._items = items;
                this._prepareView();*/
            }



            return;






            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();
            this._nbPanel = document.querySelectorAll([selector, ' > *'].join('')).length;

            this._activePanel = 0;
            this._displayPager = (pager ? true : false);

            this._pager = null;
            this._buildPager();

            this._moved = false;

            this.render();
        },
        _prepareView : function _prepareView(){
          //render the first and second panel
          //var it = this._items
          this._showPanel(0);
        },
        _showPanel : function _showPanel(id){
            this._items[id].render();
            this.appendChild(this._items[id]);

            if(!this._current){
                //add the second pannel
                this._items[id+1].render();
                this.appendChild(this._items[id+1]);
            }

        },

        /*pager*/
        _buildPager : function _buildPager() {
            if (this._displayPager) {
                this._pager = Dom.createElement('div');
                this._pager.classList.addClass('carousel-pager');

                this._pager.setTemplate('{{#bullet}}<i class="dot"></i>{{/bullet}}');

                var data = [];
                for(var i=0; i<this._nbPanel; i++) {
                    data.push(i);
                }

                this._pager.render({bullet: data});
            }

            this._updatePager();
        },
        _updatePager : function _updatePager() {
            if (this._displayPager) {
                var current = this._pager.getDomObject().querySelector('.dot.active');
                if (current) {
                    current.className = current.className.replace(/ *active/, '');
                }
                this._pager.getDomObject().querySelector(['.dot:nth-child(', (this._activePanel + 1), ')'].join('')).className += ' active';
            }
        },
        hasMoved : function hasMoved() {
            return this._moved;
        },
        _initListeners : function _initListeners(){
            var listNode = this.getDomObject();
            var that = this;
            var touchMoveTempo;

            listNode.addEventListener(Touch.EVENT_START, function (e) {
                that._startX = Touch.getPositionX(e);
                that._startTranslate = that.getTranslateX();
                touchMoveTempo = 0;
            }, false);

            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
                var diff = Touch.getPositionX(e) - that._startX;

                that.translateTo({x:(that._startTranslate + diff)}, 0);
                that._moved = true;
            }, false);

            listNode.addEventListener(Touch.EVENT_END, function () {
                that._moved = false;

                var cVal = that.getTranslateX();
                var tVal;
                
                if (cVal < 0) {

                    cVal = Math.abs(cVal);

                    var min = (that._panelWidth / 2), 
                        max = (that._panelWidth * (that._nbPanel -1) - min);

                    for(var i = min; i <= max; i = i + that._panelWidth) {
                        if (cVal < i) {
                            break;
                        }
                    }

                    
                    if (cVal > max) {
                        tVal = max + min;
                    } else {
                        tVal = i - min;
                    }

                    tVal *= -1;

                } else {
                    tVal = 0;
                }

                that._activePanel = Math.abs(tVal / that._panelWidth);

                that.translateTo({x:tVal}, that._transitionDuration);

                that._updatePager();

                that._startTranslate = tVal;
            }, false);
        },
        render : function render(){
            
            // update css if needed
            if (this._pager) {
                (new Dom(this.getDomObject().parentNode)).appendChild(this._pager);
            }

            this._initListeners();
        }
    });
    
    var exports = oo.getNS('oo.view');
    exports.Carousel = Carousel;
    
    return oo;
    
})(oo || {});
