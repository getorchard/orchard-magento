var J2t_Dialog = {};

J2t_Dialog.Box = Class.create();
Object.extend(J2t_Dialog.Box.prototype, {
    initialize: function(id, mode) {
        switch(mode){
            case 'remote':			
                if(!id){
                    this.dialog_box = document.createElement('div');
                    this.dialog_box.setAttribute('id','__remote_dialog__');
                    document.body.appendChild(this.dialog_box);
                }else{
                    this.dialog_box = $(id);
                }
                var anchors = document.getElementsByTagName('a');
                for(anchor in anchors){
                    anchor = anchors[anchor];
                    if(typeof(anchor) != 'object') continue;
                    if(!anchor.hasAttribute('rel')) continue;
                    if(anchor.getAttribute('rel').indexOf('dialog') < 0) continue;
                    anchor.onclick = function(dialog,e){
                        new Ajax.Request(this.href,{
                                onComplete : function(o){
                                    this.dialog_box.innerHTML = o.responseText;
                                    var anchors = this.dialog_box.getElementsByTagName('a'); //Find a closing anchor
                                    for(anchor in anchors){
                                        anchor = anchors[anchor];
                                        if(typeof(anchor) != 'object') continue;
                                        if(!anchor.hasAttribute('rel')) continue;
                                        if(anchor.getAttribute('rel').indexOf('dialog-close') < 0) continue;
                                        anchor.onclick = function(dialog,e){
                                            dialog.hide();
                                            return false;
                                        }.bind(anchor,this.dialog_box);
                                    }
                                    this.dialog_box.show();
                                }.bind(dialog)
                            });

                        return false;
                    }.bind(anchor,this);
                }
                break;
            default:
                this.dialog_box = $(id);
                break;
        }
        this.effect_delay = 0.0;

        this.createOverlay();
        this.dialog_box.show = this.show.bind(this);
        this.dialog_box.persistent_show = this.persistent_show.bind(this);
        this.dialog_box.hide = this.hide.bind(this);
        this.dialog_box.close = this.hide.bind(this);
        this.dialog_box.exit = this.hide.bind(this);

        this.parent_element = this.dialog_box.parentNode;

        this.dialog_box.style.position = "absolute";

        var e_dims = Element.getDimensions(this.dialog_box);
        var b_dims = Element.getDimensions(this.overlay);

        this.dialog_box.style.left = ((b_dims.width/2) - (e_dims.width/2)) + 'px';
        this.dialog_box.style.top = Math.round(this.getScrollTop() + ((this.winHeight() - e_dims.height) /2)) + 'px';
        this.dialog_box.style.zIndex = this.overlay.style.zIndex + 1;
                
        var main_parent = this;
        Event.observe(window, 'scroll', function() {
            main_parent.reCenter();
        });
        Event.observe(window, "resize", function() {
            main_parent.reCenter();
        });
        Event.observe(this.dialog_box, "resize", function() {
            main_parent.reCenter();
        });
                
    },
    createOverlay: function() {
        if($('dialog_overlay')) {
            this.overlay = $('dialog_overlay');
        } else {
            this.overlay = document.createElement('div');
            this.overlay.id = 'dialog_overlay';
            Object.extend(this.overlay.style, {
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 90,
                width: '100%',
                backgroundColor: '#000',
                display: 'none'
            });
            document.body.insertBefore(this.overlay, document.body.childNodes[0]);
        }
    },
    moveDialogBox: function(where) {
        Element.remove(this.dialog_box);
        if(where == 'back')
            this.dialog_box = this.parent_element.appendChild(this.dialog_box);
        else
            this.dialog_box = this.overlay.parentNode.insertBefore(this.dialog_box, this.overlay);
    },
    show: function(options) {
        this.overlay.style.height = this.bodyHeight()+'px';
        this.moveDialogBox('out');
        this.overlay.onclick = this.hide.bind(this);
        this.selectBoxes('hide');
        //new Effect.Appear(this.overlay, {duration: 0.1, from: 0.0, to: 0.7});
          
        this.options = {
          bypass_overlay: false
        };
        
        Object.extend(this.options, options || {});
        
        if (!this.options.bypass_overlay){
            var main_parent = this;
            new Effect.Appear( 
                this.overlay, 
                { 
                    delay: 0.2,
                    //beforeStart: function() { main_parent.effect_delay = 0.2; },
                    duration: 0.1, 
                    from: 0.0, 
                    to: 0.5,
                    //afterFinish: function() { main_parent.effect_delay = 0; }
                } 
            );
        }
          
        this.dialog_box.style.display = '';
        /*this.dialog_box.style.left = '0px';
        var e_dims = Element.getDimensions(this.dialog_box);
        this.dialog_box.style.left = ((this.winWidth()/2) - (e_dims.width)/2) + 'px';
        this.dialog_box.style.top = Math.round(this.getScrollTop() + ((this.winHeight() - e_dims.height) /2)) + 'px';*/
        this.reCenter();
    },            
    reCenter: function () {
        this.dialog_box.style.left = '0px';
        var e_dims = Element.getDimensions(this.dialog_box);
        if (this.winWidth() > e_dims.width){
            this.dialog_box.style.left = ((this.winWidth()/2) - (e_dims.width)/2) + 'px';
        } else {
            this.dialog_box.style.left = '0px';
        }  
        if (this.winHeight() > e_dims.height){
            this.dialog_box.style.top = Math.round(this.getScrollTop() + ((this.winHeight() - e_dims.height) /2)) + 'px';
        } else {
            this.dialog_box.style.top = '0px';
        }
        //this.dialog_box.style.top = this.getScrollTop() + ((this.winHeight() - (e_dims.height/2))/2) + 'px';
        //alert(this.getScrollTop()+' + ('+ this.winHeight() + ' - ' + e_dims.height + ' / 2)');
        //this.dialog_box.style.top = Math.round(document.viewport.getScrollOffsets().top + ((window.innerHeight - $(e_dims).getHeight()))/2);
          
          
    },
    getScrollTop: function() {
        return (window.pageYOffset)?window.pageYOffset:(document.documentElement && document.documentElement.scrollTop)?document.documentElement.scrollTop:document.body.scrollTop;
    },
    persistent_show: function() {
        this.overlay.style.height = this.bodyHeight()+'px';
        this.moveDialogBox('out');

        this.selectBoxes('hide');
        //new Effect.Appear(this.overlay, {duration: 0.1, from: 0.0, to: 0.3});
          
        var main_parent = this;
        new Effect.Appear( 
            this.overlay, 
            { 
                delay: 0.2,
                //beforeStart: function() { main_parent.effect_delay = 0.2; },
                duration: 0.1, 
                from: 0.0, 
                to: 0.3,
                //afterFinish: function() { main_parent.effect_delay = 0; }
            } 
        );
          
        this.dialog_box.style.display = '';
        this.dialog_box.style.left = '0px';
        var e_dims = Element.getDimensions(this.dialog_box);
        this.dialog_box.style.left = ((this.winWidth()/2) - (e_dims.width)/2) + 'px';
    },
    hide: function(options) {
        this.selectBoxes('show');
        //new Effect.Fade(this.overlay, {duration: 0.1});  
        
        this.options = {
          bypass_overlay: false
        };
        
        Object.extend(this.options, options || {});
        
        
        if (!this.options.bypass_overlay){
            var main_parent = this;
            new Effect.Fade( 
                this.overlay, 
                { 
                    //delay: main_parent.effect_delay,
                    //beforeStart: function() { main_parent.effect_delay = 0.2; },
                    duration: 0.1, 
                    //afterFinish: function() { main_parent.effect_delay = 0; }
                } 
            );
        }
          
        this.dialog_box.style.display = 'none';
        this.moveDialogBox('back');
        $A(this.dialog_box.getElementsByTagName('input')).each(function(e){if(e.type!='submit')e.value=''});
    },
    selectBoxes: function(what) {
        $A(document.getElementsByTagName('select')).each(function(select) {
            Element[what](select);
        });
        if(what == 'hide')
            $A(this.dialog_box.getElementsByTagName('select')).each(function(select){Element.show(select)})
    },
    bodyWidth: function() { return document.body.offsetWidth || window.innerWidth || document.documentElement.clientWidth || 0; },
    bodyHeight: function() { return document.body.offsetHeight || window.innerHeight || document.documentElement.clientHeight || 0; },
    winWidth: function() {
        var viewportwidth;
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerWidth != 'undefined')
        {
            viewportwidth = window.innerWidth;
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0)
        {
            viewportwidth = document.documentElement.clientWidth;
        }
        // older versions of IE
        else
        {
            viewportwidth = document.getElementsByTagName('body')[0].clientWidth
        }
        return viewportwidth;
    },
    winHeight: function() {
        var viewportheight;
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerHeight != 'undefined')
        {
            viewportheight = window.innerHeight;
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientHeight != 'undefined' && document.documentElement.clientHeight != 0)
        {
            viewportheight = document.documentElement.clientHeight;
        }
        // older versions of IE
        else
        {
            viewportheight = document.getElementsByTagName('body')[0].clientHeight;
        }
        return viewportheight;
    }
});