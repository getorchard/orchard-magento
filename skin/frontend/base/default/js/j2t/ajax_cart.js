/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2009 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */
/*
var loadingW = 260;
var loadingH = 50;
var confirmW = 260;
var confirmH = 134;
*/
var inCart = false;
var saved_wrapper_w=0;
var saved_wrapper_h=0;
var isLoading = false;
var j2t_error = "";
var countdown_val = 0;
var countdownInt = null;

window.j2t_mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check; 
};

var waitProductDetails = false;
var url_key_defined = '';

if (typeof jQuery != "undefined"){
    var jQuery = jQuery.noConflict(true);
}

if (window.location.toString().search('/product_compare/') != -1){
	var win = window.opener;
}
else{
	var win = window;
}

if (window.location.toString().search('/checkout/cart/') != -1){
    inCart = true;
}

function setLocationKeyJ2T(product_key, url) {
    url_key_defined = product_key;
    setLocation(url);
}



function setLocation(url){
    if (cookie_available == false && cookie_redirect == 1){
        document.location.href = enable_cookie_url;
    } else {
        if (typeof ajax_products_urls !== "undefined"){
        
            var l = ajax_products_urls.length;
            for(var i = 0; i < l; i++) {
                if(url.search(ajax_products_urls[i]) != -1) {
                    document.location.href = url;
                    return true;
                }
            }
        }

        url = J2tVefirySecuredUrl(url);
        /*if (url.search("J2T_URL_REDIRECT") != -1){
            url = url.replace("J2T_URL_REDIRECT", "");
            document.location.href = url;
        } else */


        if(!inCart && (/*(url.search('/add') != -1 ) || (url.search('/remove') != -1 ) ||*/ url.search('checkout/cart/add') != -1) ){
            showJ2tProductDetails(url);
            if (ajax_cart_qty == 1){
                showLoading();
                var j2tReg = /\/product\/([0-9]+)/;
                if (url.search(j2tReg) != -1) {
                    //check if product has options
                    //get product id
                    var j2tMatches = url.match(j2tReg);
                    if (j2tMatches[1] != undefined){
                        //alert(j2tMatches[1]);
                        var url_product_check =  j2tajaxcart_url_check.replace('product_id', j2tMatches[1]);
                        checkProductUrlJ2tQty(url_product_check, url);
                    }
                } else {
                    //j2tSendCartUrl(url, qty_to_insert);
                    sendQtyAsk(url, false);
                }
                //sendQtyAsk(url, false);
            } else {
                sendcart(url, 'url', 1, '', false);
            }
        } else if (!inCart && url.search('options=cart') != -1) {
            //showJ2tProductDetails(url);
            sendoptions(url);
        } else{
            document.location.href = url;
        }
    }
}



document.observe("dom:loaded", function() {
    if (optionsPrice == undefined){
        var optionsPrice;
    }
    if (productAddToCartForm == undefined){
        var productAddToCartForm;
    }
    if (optionsPrice == undefined){
        var optionsPrice;
    }
    if (spConfig == undefined){
        var spConfig;
    }
    if (opConfig == undefined){
        var opConfig;
    }
    if (DateOption == undefined){
        var DateOption;
    }
});


function getQtyValue(){
    var qty_val = $('j2t_ajax_confirm_wrapper').down('.qty');
    if (isNaN(qty_val.value)){
        return 1
    } else {
        return qty_val.value;
    }
}

function sendQtyAsk(url, no_check){
    showLoading();
    $('j2t_ajax_qty').down('.j2t-btn-cart').stopObserving();
    $('j2t_ajax_qty').down('.j2t-btn-cart').observe('click', function(){
                                                            sendcart(url, 'url', getQtyValue(), '', no_check);
                                                        });
    var productDetailsInterval = setInterval(function(){
        if (!waitProductDetails){
            var j2t_prod_details = '';
            if (j2t_ajax_cart_show_details == 1){
                j2t_prod_details = '<div class="j2t-product-details">'+$('j2t-product-details').innerHTML+'</div>';
            }
            var qty_content = j2t_prod_details+$('j2t_ajax_qty').innerHTML;

            $('j2t_ajax_confirm').update('<div id="j2t_ajax_confirm_wrapper">'+qty_content+ '</div>');
            showConfirm();

            $('j2t_ajax_confirm').down('.j2t-btn-cart').stopObserving();
            $('j2t_ajax_confirm').down('.j2t-btn-cart').observe('click', function(){
                                                                        sendcart(url, 'url', getQtyValue(), '', no_check);
                                                                    });
            $('j2t_ajax_confirm').down('.inner-ajax-content').insert({bottom: new Element('div', {id: 'j2t-bottom-qty'})});
            $('j2t-bottom-qty').innerHTML = "&nbsp;";
            clearInterval(productDetailsInterval);
        } 
    },500);
}


function sendoptions(url){
    url = J2tVefirySecuredUrl(url);
    
    //url = getJ2TUrlProductFastConfiguration(url);
    //url = J2tVefirySecuredUrl(url);
    
    url = url.replace(/\?.*/g,"");
    url = url + "?j2tajaxcall=j2tajaxcheckout_product_view&options=cart";
    
    if (j2t_show_options == 0){
        document.location.href = url;
    } else {
        showLoading();
        url = url.replace('checkout/cart', 'j2tajaxcheckout/index/cart/cart');
        
        var productDetailsIntervalOptions = setInterval(function(){
            if (!waitProductDetails){
                var myAjax = new Ajax.Request(
                url,
                {
                    asynchronous: true,
                    method: 'post',
                    postBody: '',
                    onException: function (xhr, e)
                    {
                        alert('Exception : ' + e);
                    },
                    onComplete: function (xhr)
                    {
                        var result = xhr.responseText;
                        $('j2t-temp-div').innerHTML = result.stripScripts();
                        
                        var j2t_prod_details = '';
                        //$('j2t-product-details').update(return_value);
                        /*if (j2t_ajax_cart_show_details == 1){
                            j2t_prod_details = '<div class="j2t-product-details">'+$('j2t-product-details').innerHTML+'</div>';
                        }*/
                        if (j2t_ajax_cart_show_details == 1 && $('j2t-temp-div').down('.j2t-product-details-inview')){
                            j2t_prod_details = '<div class="j2t-product-details">'+$('j2t-temp-div').down('.j2t-product-details-inview').innerHTML+'</div>';
                        }
                        
                        var product_html = '';
                        if (j2t_product_essentials != ''){
                            if ($('j2t-temp-div').down('.'+j2t_product_essentials)){
                                product_html = $('j2t-temp-div').down('.'+j2t_product_essentials).innerHTML;
                            } else {
                                j2t_error += " - Unable to find "+j2t_product_essentials+" class element.\r\n";
                            }
                        } else {
                            if ($('j2t-temp-div').down('.product-essential')){
                                product_html = $('j2t-temp-div').down('.product-essential').innerHTML;
                            } else {
                                j2t_error += " - Unable to find product-essential class element.\r\n";
                            }
                        }

                        var txt_script = '';
                        var scripts = [];
                        
                        var source_code = xhr.responseText.replace(/<script.*?><\/script>/gi, '');
                        //var source_code = xhr.responseText.replace(/><\/script>/gi, '> </script>');
                        var script_sources = source_code.split(/<script.*?>/);
                        
                        //var script_sources = xhr.responseText.split(/<script.*?>/);
                        
                        var cpt_functions = 0;
                        var end_txt_script = '';
                        
                        for (var i=1; i < script_sources.length; i++){
                            var str = script_sources[i].split(/<\/script>/)[0];
                            str = str.replace('//<![CDATA[', '');
                            str = str.replace('//]]>', '');
                            if (str.indexOf('optionsPrice') != -1 || str.indexOf('spConfig') != -1 || /*str.indexOf('decorateGeneric') != -1 ||*/
                                str.indexOf('j2t_points') != -1 || str.indexOf('productAddToCartForm') != -1 ||
                                str.indexOf('DateOption') != -1 || str.indexOf('opConfig') != -1 || str.indexOf('Product.Bundle') != -1 || 
                                str.indexOf('bundle.reloadPrice') != -1 || str.indexOf('bundle_select') != -1 || str.indexOf('checkJ2tPoints') != -1 || str.indexOf('Product.Downloadable') != -1){
                                if (str.indexOf('document.observe("dom:loaded"') != -1){
                                    str = str.replace('var opConfig', 'opConfig');
                                    str = str.replace('document.observe("dom:loaded", ', 'custom_function_'+cpt_functions+' = (');
                                    str += 'custom_function_'+cpt_functions+'();';
                                    end_txt_script += str + "\n";
                                } else {
                                    str = str.replace('var dConfig', 'dConfig');
                                    str = str.replace('var optionsPrice', 'optionsPrice');
                                    str = str.replace('var bundle_select', 'bundle_select');

                                    str = str.replace('var spConfig', 'spConfig');
                                    str = str.replace('var DateOption', 'DateOption');

                                    str = str.replace('var opConfig', 'opConfig');
                                    str = str.replace('var bundle', 'bundle');

                                    str = str.replace('var optionsPrice', 'optionsPrice');
                                    str = str.replace('var productAddToCartForm', 'productAddToCartForm');
                                    str = str.replace('this.form.submit()', 'sendcart(\'\', \'form\', 1, \'product_addtocart_form\', false)');
                                    
                                    str = str.replace('var j2t', 'j2t');
                                    str = str.replace('var json_credit_bundle', 'json_credit_bundle');
                                    str = str.replace('var pts', 'pts');
                                    str = str.replace('var qties', 'qties');

                                    scripts.push(str);
                                    txt_script += str + "\n";
                                }
                                
                                cpt_functions++;
                            }
                        }
                        
                        txt_script = txt_script + end_txt_script;
                        
                        //$$('.wrapper')[0].insert('<textarea>'+txt_script+'</textarea>');
                        
                        $('j2t-temp-div').innerHTML = '';
                        $('j2t_ajax_confirm').update('<div id="j2t_ajax_confirm_wrapper">'+j2t_prod_details+product_html+ '</div><script type="text/javascript">'+txt_script+'</script>');
                        
                        //$('j2t-div-template').down('.j2t-box-cm').innerHTML = "";

                        /*$$('.checkbox').each(function (el){
                            Event.observe(el, 'click', function(){ alert('ici'); });
                        });*/


                        if (j2t_product_image != ''){
                            if ($('j2t_ajax_confirm').down('.'+j2t_product_image)){
                                //$('j2t_ajax_confirm').down('.'+j2t_product_image).hide();
                                $('j2t_ajax_confirm').down('.'+j2t_product_image).remove();
                            } else {
                                j2t_error += " - Unable to find "+j2t_product_image+" class element.\r\n";
                            }
                        } else {
                            if ($('j2t_ajax_confirm').down('.product-img-box')){
                                //$('j2t_ajax_confirm').down('.product-img-box').hide();
                                $('j2t_ajax_confirm').down('.product-img-box').remove();
                            } else {
                                j2t_error += " - Unable to find product-img-box class element.\r\n";
                            }
                        }

                        var arr;
                        if (j2t_product_shop != ''){
                            if ($('j2t_ajax_confirm').down('.'+j2t_product_shop)){
                                arr = $('j2t_ajax_confirm').down('.'+j2t_product_shop).childElements();
                            } else {
                                j2t_error += " - Unable to find "+j2t_product_shop+" class element.\r\n";
                            }
                        } else {
                            if ($('j2t_ajax_confirm').down('.product-shop')){
                                arr = $('j2t_ajax_confirm').down('.product-shop').childElements();
                            } else {
                                j2t_error += " - Unable to find product-shop class element.\r\n";
                            }
                        }

                        if (typeof arr  != 'undefined'){
                            arr.each(function(node){
                            node.style.display = 'none';
                          });
                        }
                        
                        //J2T Bundle
                        //super-product-table
                        if ($('super-product-table')){
                            if ($('j2t_ajax_confirm').down('#super-product-table')){
                                $('j2t_ajax_confirm').down('#super-product-table').show();
                            } else {
                                j2t_error += " - Unable to find #super-product-table element.\r\n";
                            }
                            if ($('j2t_ajax_confirm').down('.add-to-box')){
                                $('j2t_ajax_confirm').down('.add-to-box').show();
                                if ($('j2t_ajax_confirm').down('.add-to-box').down('.add-to-links')){
                                    $('j2t_ajax_confirm').down('.add-to-box').down('.add-to-links').hide();
                                }

                                if ($('j2t_ajax_confirm').down('.add-to-box').down('.or')){
                                    $('j2t_ajax_confirm').down('.add-to-box').down('.or').hide();
                                }

                            } else {
                                j2t_error += " - Unable to find .add-to-box element.\r\n";
                            }
                        } //previous code is between else
                        else {
                            if (j2t_product_options != ''){
                                if ($('j2t_ajax_confirm').down('.'+j2t_product_options)){
                                    $('j2t_ajax_confirm').down('.'+j2t_product_options).show();
                                } else {
                                    j2t_error += " - Unable to find ."+j2t_product_options+".\r\n";
                                }
                            } else {
                                if ($('j2t_ajax_confirm').down('.product-options')){
                                    $('j2t_ajax_confirm').down('.product-options').show();
                                } else {
                                    j2t_error += " - Unable to find .product-options element.\r\n";
                                }
                            }

                            if (j2t_product_bottom != ''){
                                if ($('j2t_ajax_confirm').down('.'+j2t_product_bottom)){
                                    $('j2t_ajax_confirm').down('.'+j2t_product_bottom).show();
                                } else {
                                    j2t_error += " - Unable to find ."+j2t_product_bottom+" element.\r\n";
                                }
                            } else {
                                if ($('j2t_ajax_confirm').down('.product-options-bottom')){
                                    $('j2t_ajax_confirm').down('.product-options-bottom').show();
                                } else {
                                    j2t_error += " - Unable to find .product-options element.\r\n";
                                }

                            }

                        }
                        //End J2T Bundle


                        if (j2t_ajax_cart_debug == 1 && j2t_error != ""){
                             
			    alert(j2t_error);
                            j2t_error = "";
                        }


                        replaceDelUrls();

                        //if (ajax_cart_show_popup){
                            showConfirm();
                        /*} else {
                            isLoading = false;
                            hideJ2tOverlay(false);
                        }*/
                        
                        processOptionJsInject();
                    }

                });
                clearInterval(productDetailsIntervalOptions);
            } 
        },500);
        
        //////////////
    }
    
}


function J2tVefirySecuredUrl(url) {
    var current_url = document.location.href;
    if (url.indexOf('http:')  != -1 && current_url.indexOf('https:')  != -1) {
        url = url.replace('http:', 'https:')
    } else if (url.indexOf('https:')  != -1 && current_url.indexOf('http:')  != -1){
        url = url.replace('https:', 'http:')
    }
    return url;
}


function redrawBoxReturn(content){
    $('j2t-temp-div').innerHTML = content;
    var upsell_items = '';

    if ($('j2t-temp-div').down('.j2t-ajaxupsells')){
        upsell_items = $('j2t-temp-div').down('.j2t-ajaxupsells').innerHTML;
    } else {
        j2t_error += " - Unable to find .j2t-ajaxupsells element.\r\n";
    }


    var return_message = '';
    if ($('j2t-temp-div').down('.j2t_ajax_message')){
        return_message = $('j2t-temp-div').down('.j2t_ajax_message').innerHTML;
    } else {
        j2t_error += " - Unable to find .j2t_ajax_message element.\r\n";
    }

    var middle_text = '';                        
    if ($('j2t-temp-div').down('.back-ajax-add')){
        middle_text = '<div class="j2t-cart-bts">'+$('j2t-temp-div').down('.back-ajax-add').innerHTML+'</div>';
    } else {
        j2t_error += " - Unable to find .back-ajax-add element.\r\n";
    }

    $('j2t_ajax_confirm').innerHTML = '<div id="j2t_ajax_confirm_wrapper">'+return_message + middle_text + upsell_items + '</div>';
    
    var link_cart_txt = '';
    if ($('j2t-temp-div').down('.cart_content')){
        link_cart_txt = $('j2t-temp-div').down('.cart_content').innerHTML;
    }
    

    if (j2t_ajax_cart_debug == 1 && j2t_error != ""){
        alert(j2t_error);
        j2t_error = "";
    }

    if ($$('#j2t_ajax_confirm_wrapper .messages .error-msg').length > 0){
        if (ajax_cart_show_popup){
            showConfirm();
        } else {
            j2t_ajax_cart_countdown_redirection = 0;
            isLoading = false;
            hideJ2tOverlay(true);
        }
        $('j2t-temp-div').innerHTML = '';
        return false;
    }                       

    if ($$('.top-link-cart').length > 0){
        $$('.top-link-cart').each(function (el){
            el.innerHTML = link_cart_txt;
        });
    } else {
        j2t_error += " - Unable to find .top-link-cart element.\r\n";
    }

    if (j2t_custom_top_link != ''){
        if ($$('.'+j2t_custom_top_link).length > 0){
            $$('.'+j2t_custom_top_link).each(function (el){
                el.innerHTML = link_cart_txt;
            });
        } else {
            j2t_error += " - Unable to find ."+j2t_custom_top_link+" element.\r\n";
        }
    }

    reloadAjaxTopCart();

    var mini_cart_txt = ''; 

    if ($('j2t-temp-div').down('.cart_side_ajax')){
        mini_cart_txt = $('j2t-temp-div').down('.cart_side_ajax').innerHTML;
    } else {
        j2t_error += " - Unable to find .top-link-cart element.\r\n";
    }

    if ($$('.mini-cart').length > 0){
        $$('.mini-cart').each(function (el){
            el.replace(mini_cart_txt);
        });
    } else {
        j2t_error += " - Unable to find .mini-cart element.\r\n";
    }

    if ($$('.block-cart').length > 0){
        $$('.block-cart').each(function (el){
            el.replace(mini_cart_txt);
        });
    } else {
        j2t_error += " - Unable to find .block-cart element.\r\n";
    }

    if (j2t_custom_mini_cart != ''){
        if ($$('.'+j2t_custom_mini_cart).length > 0){
            $$('.'+j2t_custom_mini_cart).each(function (el){
                el.replace(mini_cart_txt);
            });
        } else {
            j2t_error += " - Unable to find ."+j2t_custom_mini_cart+" element.\r\n";
        }

    }


    if (j2t_ajax_cart_debug == 1 && j2t_error != ""){
        alert(j2t_error);
        j2t_error = "";
    }

    truncateOptions();
    replaceDelUrls();

    if (ajax_cart_show_popup){
        showConfirm();
    } else {
        j2t_ajax_cart_countdown_redirection = 0;
        isLoading = false;
        hideJ2tOverlay(true);
    }
    
    processConfirmJsInject();
    
    instanciateCoundDown();
    
}

function sendcart(url, type, qty_to_insert, form_name, no_check){
    
    url = J2tVefirySecuredUrl(url);
    
    var continue_scr = true;
    if ($('pp_checkout_url')){
        //http://www.j2t-design.net
        var pp = $('pp_checkout_url').value;
        if (pp != ''){
            continue_scr = false;
            var form = $(form_name); //$('product_addtocart_form');
            form.submit();
        }
    }
    if (continue_scr) {
        hideJ2tOverlay(false);
        showLoading();
        if (type == 'form'){
            
            var found_file = false;
            var form = $(form_name); //$('product_addtocart_form');
            if (form){
                inputs = form.getInputs('file');
                if (inputs.length > 0){
                    found_file = true;
                }
            }

            if (found_file){
                
                form.target = "j2t_upload_hidden";
                form.action = ($(form_name).action).replace('checkout/cart', 'j2tajaxcheckout/index/cart/cart');
                //url = ($(form_name).action).replace('checkout/cart', 'j2tajaxcheckout/index/cart/cart');
                if (!$("j2t_upload_hidden")) {
                    $$('body')[0].insert('<iframe id="j2t_upload_hidden" name="j2t_upload_hidden" src="" onload="j2tuploadDone(this);" style="width:0;height:0;border:0px solid #fff"></iframe>');
                }
                
                form.submit();
            } else {
                url = ($(form_name).action).replace('checkout/cart', 'j2tajaxcheckout/index/cart/cart');
                url = J2tVefirySecuredUrl(url);
                var myAjax = new Ajax.Request(
                url,
                {
                    asynchronous: true,
                    method: 'post',
                    postBody: $(form_name).serialize(),
                    parameters : Form.serialize(form_name),
                    onException: function (xhr, e)
                    {
                        alert('Exception : ' + e);
                    },
                    onComplete: function (xhr)
                    {
                        redrawBoxReturn(xhr.responseText);
                    }

                });
            }

        } else if (type == 'url'){
            //check if product has options
            //j2tajaxcart_url_check
            showLoading();
            //product/54
            
            if (no_check){
                j2tSendCartUrl(url, qty_to_insert);
            } else {
                var j2tReg = /\/product\/([0-9]+)/;
                //var j2tReg = new RegExp ( "\/product\/\d+", "gi" ) ;
                //if (url.search('/product/') != -1) {
                if (url.search(j2tReg) != -1) {
                    //check if product has options
                    //get product id
                    var j2tMatches = url.match(j2tReg);
                    //alert('ici');
                    //alert(j2tMatches.length);
                    if (j2tMatches[1] != undefined){
                        //alert(j2tMatches[1]);
                        var url_product_check =  j2tajaxcart_url_check.replace('product_id', j2tMatches[1]);
                        checkProductUrlJ2t(url_product_check, url, qty_to_insert);
                    }
                } else {
                    j2tSendCartUrl(url, qty_to_insert);
                }
            }
        }
    }
}

function instanciateCoundDown(){
    if ($('j2t_ajax_confirm_wrapper').down('.count-down-btn-inner')){
        var bt_countdown_text = $('j2t_ajax_confirm_wrapper').down('.count-down-btn-inner').innerHTML;
        var countdown_val = j2t_ajax_cart_countdown;
        countdownInt = setInterval(function(){
            if (countdown_val > 0){
                $('j2t_ajax_confirm_wrapper').down('.count-down-btn-inner').innerHTML = bt_countdown_text + ' ('+countdown_val+')';
                countdown_val--;
            } else {
                if (j2t_ajax_cart_countdown_redirection === 1){
                    setLocation(j2t_cart_url);
                } else {
                    hideJ2tOverlay(true);
                }
                clearInterval(countdownInt);
            }
        }, 1000);    
    }
}

function j2tSendCartUrl(url, qty_to_insert){
    url = J2tVefirySecuredUrl(url);
    url = url.replace('checkout/cart', 'j2tajaxcheckout/index/cart/cart');
    var myAjax = new Ajax.Request(
    url,
    {
        asynchronous: true,
        method: 'post',
        postBody: '',
        parameters: 'qty='+qty_to_insert,
        onException: function (xhr, e)
        {
            alert('Exception : ' + e);
        },
        onComplete: function (xhr)
        {
            $('j2t-temp-div').innerHTML = xhr.responseText;
            var upsell_items = '';
            if ($('j2t-temp-div').down('.j2t-ajaxupsells')){
                upsell_items = $('j2t-temp-div').down('.j2t-ajaxupsells').innerHTML;
            } else {
                j2t_error += " - Unable to find .j2t-ajaxupsells element.\r\n";
            }           
            
            
            var return_message = '';
            if ($('j2t-temp-div').down('.j2t_ajax_message')){
                return_message = $('j2t-temp-div').down('.j2t_ajax_message').innerHTML;
            } else {
                j2t_error += " - Unable to find .j2t_ajax_message element.\r\n";
            }
            
            var middle_text = ''; 
            if ($('j2t-temp-div').down('.back-ajax-add')){
                middle_text = '<div class="j2t-cart-bts">'+$('j2t-temp-div').down('.back-ajax-add').innerHTML+'</div>';
            } else {
                j2t_error += " - Unable to find .back-ajax-add element.\r\n";
            }

            var content_ajax = return_message + middle_text + upsell_items;

            $('j2t_ajax_confirm').innerHTML = '<div id="j2t_ajax_confirm_wrapper">'+content_ajax + '</div>';

            var link_cart_txt = '';
            if ($('j2t-temp-div').down('.cart_content')){
                link_cart_txt = $('j2t-temp-div').down('.cart_content').innerHTML;
            } else {
                j2t_error += " - Unable to find .cart_content element.\r\n";
            }
            
            
            if (j2t_ajax_cart_debug == 1 && j2t_error != ""){
                alert(j2t_error);
                j2t_error = "";
            }
            
            if ($$('#j2t_ajax_confirm_wrapper .messages .error-msg').length > 0){
                if (ajax_cart_show_popup){
                    showConfirm();
                } else {
                    j2t_ajax_cart_countdown_redirection = 0;
                    isLoading = false;
                    hideJ2tOverlay(true);
                }
                return false;
            }
            
            if ($$('.top-link-cart').length > 0){
                $$('.top-link-cart').each(function (el){
                    el.innerHTML = link_cart_txt;
                });
            } else {
                j2t_error += " Unable to find .top-link-cart element. \r\n";
            }
            

            if (j2t_custom_top_link != ''){
                if ($$('.'+j2t_custom_top_link).length > 0){
                    $$('.'+j2t_custom_top_link).each(function (el){
                        el.innerHTML = link_cart_txt;
                    });
                } else {
                    j2t_error += " Unable to find ."+j2t_custom_top_link+" element. \r\n";
                }
                
            }
            
            reloadAjaxTopCart();

            var mini_cart_txt = '';
            
            if ($('j2t-temp-div').down('.cart_side_ajax')){
                mini_cart_txt = $('j2t-temp-div').down('.cart_side_ajax').innerHTML;
            } else {
                j2t_error += " Unable to find .cart_side_ajax element. \r\n";
            }
            
            
            if ($$('.mini-cart').length > 0){
                $$('.mini-cart').each(function (el){
                    el.replace(mini_cart_txt);
                    //new Effect.Opacity(el, { from: 0, to: 1, duration: 1.5 });
                });
            } else {
                j2t_error += " Unable to find .mini-cart element. \r\n";
            }
            
            if ($$('.block-cart').length > 0){
                $$('.block-cart').each(function (el){
                    el.replace(mini_cart_txt);
                    //new Effect.Opacity(el, { from: 0, to: 1, duration: 1.5 });
                });
            } else {
                j2t_error += " Unable to find .block-cart element. \r\n";
            }

            

            if (j2t_custom_mini_cart != ''){
                if ($$('.'+j2t_custom_mini_cart).length > 0){
                    $$('.'+j2t_custom_mini_cart).each(function (el){
                        el.replace(mini_cart_txt);
                    });
                } else {
                    j2t_error += " Unable to find ."+j2t_custom_mini_cart+" element. \r\n";
                }                
            }
            
            if (j2t_ajax_cart_debug == 1 && j2t_error != ""){
                alert(j2t_error);
                j2t_error = "";
            }
            
            truncateOptions();
            replaceDelUrls();
            if (ajax_cart_show_popup){
                showConfirm();
            } else {
                j2t_ajax_cart_countdown_redirection = 0;
                isLoading = false;
                hideJ2tOverlay(true);
            }
            
            processConfirmJsInject();
            
            instanciateCoundDown();
        }

    });
}

function processConfirmJsInject() {
    if (j2t_ajax_cart_on_show_confirm != ''){
        eval(j2t_ajax_cart_on_show_confirm);
        
        /*var script_insertion = '<script type="text/javascript">'+j2t_ajax_cart_on_show_confirm+'</script>';
        if (!$("j2t_js_inject")){
            $$('body')[0].insert('<div id="j2t_js_inject" style="display:none;"></div>');
        }
        $("j2t_js_inject").update(script_insertion);*/
    }
}

function processDeleteJsInject() {
    if (j2t_ajax_cart_after_delete != ''){
        eval(j2t_ajax_cart_after_delete);
        /*var script_insertion = '<script type="text/javascript">'+j2t_ajax_cart_after_delete+'</script>';
        if (!$("j2t_js_inject")){
            $$('body')[0].insert('<div id="j2t_js_inject" style="display:none;"></div>');
        }
        $("j2t_js_inject").update(script_insertion);*/
    }
}


function processOptionJsInject() {
    if (j2t_ajax_cart_on_show_option != ''){
        eval(j2t_ajax_cart_on_show_option);
        /*var script_insertion = '<script type="text/javascript">'+j2t_ajax_cart_on_show_option+'</script>';
        if (!$("j2t_js_inject")){
            $$('body')[0].insert('<div id="j2t_js_inject" style="display:none;"></div>');
        }
        $("j2t_js_inject").update(script_insertion);*/
    }
}


function checkProductUrlJ2tQty(url_check, url){
    //alert(url_check);
    url_check = J2tVefirySecuredUrl(url_check);
    url = J2tVefirySecuredUrl(url);
    var myAjax = new Ajax.Request(
    url_check,
    {
        asynchronous: true,
        method: 'post',
        postBody: '',
        onException: function (xhr, e)
        {
            alert('Exception : ' + e);
        },
        onComplete: function (xhr)
        {
            var return_value = xhr.responseText;
            //if (return_value != 0){
            if (return_value.indexOf('options=cart') != -1){
                sendoptions(return_value);
            } else if(return_value != 0) {
                $('j2t-product-details').innerHTML = return_value;
                if ($('j2t-product-details').down(".j2t-cart-url")){
                    url = $('j2t-product-details').down(".j2t-cart-url").innerHTML;
                }
                sendQtyAsk(url, true);
            } else {
                sendQtyAsk(url, false);
            }  
        }
    });
}

function checkProductUrlJ2t(url_check, url, qty_to_insert){
    url = J2tVefirySecuredUrl(url);
    url_check = J2tVefirySecuredUrl(url_check);
    
    var myAjax = new Ajax.Request(
    url_check,
    {
        asynchronous: true,
        method: 'post',
        postBody: '',
        onException: function (xhr, e)
        {
            alert('Exception : ' + e);
        },
        onComplete: function (xhr)
        {
            var return_value = xhr.responseText;
            /*if (return_value != 0){
                //alert(return_value);
                sendoptions(return_value);
            } else {
                j2tSendCartUrl(url, qty_to_insert);
            }*/
            if (return_value.indexOf('options=cart') != -1){
                sendoptions(return_value);
            } else if(return_value != 0) {
                $('j2t-product-details').innerHTML = return_value;
                if ($('j2t-product-details').down(".j2t-cart-url")){
                    url = $('j2t-product-details').down(".j2t-cart-url").innerHTML;
                }
                j2tSendCartUrl(url, qty_to_insert);
                //sendQtyAsk(url, true);
            } else {
                sendQtyAsk(url, false);
            }
            
        }

    });
}


function replaceDelUrls(){
    //if (!inCart){
        $$('a').each(function(el){
            if(el.href.search('checkout/cart/delete') != -1 && el.href.search('javascript:cartdelete') == -1){
                el.href = 'javascript:cartdelete(\'' + el.href +'\')';
            }
        });
    //}
}

function replaceAddUrls(){
    //if (!inCart){
        $$('a').each(function(link){
            if(link.href.search('checkout/cart/add') != -1){
                link.href = 'javascript:setLocation(\''+link.href+'\'); void(0);';
            }
        });
    //}    
}



function cartdelete(url){
    url = J2tVefirySecuredUrl(url);
    showLoading();
    url = url.replace('checkout/cart/delete', 'j2tajaxcheckout/index/cartdelete/cart/delete');
    var myAjax = new Ajax.Request(
    url,
    {
        asynchronous: true,
        method: 'post',
        postBody: 'btn_lnk=1',
        onException: function (xhr, e)
        {
            alert('Exception : ' + e);
        },
        onComplete: function (xhr)
        {
            $('j2t-temp-div').innerHTML = xhr.responseText;
            //$('j2t-temp-div').innerHTML = xhr.responseText;
            
            ////////////// scripts //////////////////////////
            
            var txt_script = '';
            var scripts = [];
            var script_sources = xhr.responseText.split(/<script.*?>/);
            for (var i=1; i < script_sources.length; i++){
                var str = script_sources[i].split(/<\/script>/)[0];
                str = str.replace('//<![CDATA[', '');
                str = str.replace('//]]>', '');
                if (str.indexOf('discount-coupon-form') != -1 || str.indexOf('giftcard-form') != -1){
                    
                    str = str.replace('var discountForm', 'discountForm');
                    str = str.replace('var giftcardForm', 'giftcardForm');
                    
                    scripts.push(str);
                    txt_script += str + "\n";
                }
            }
            
            ////////////// scripts //////////////////////////
            
            var cart_content = '';
            if ($('j2t-temp-div').down('.cart_content')){
                cart_content = $('j2t-temp-div').down('.cart_content').innerHTML;
            }
            
            $$('.top-link-cart').each(function (el){
                el.innerHTML = cart_content;
            });

            if (j2t_custom_top_link != ''){
                $$('.'+j2t_custom_top_link).each(function (el){
                    el.innerHTML = cart_content;
                });
            }
            
            
            reloadAjaxTopCart();

            var process_reload_cart = false;
            
            var full_cart_content = '';
            if ($('j2t-temp-div').down('.j2t_full_cart_content')){
                full_cart_content = $('j2t-temp-div').down('.j2t_full_cart_content').innerHTML;
            }
            
            
            
            $$('.cart').each(function (el){
                el.replace(full_cart_content + '<script type="text/javascript">'+txt_script+'</script>');
                process_reload_cart = true;
            });

            if (!process_reload_cart){
                $$('.checkout-cart-index .col-main').each(function (el){
                    el.replace(full_cart_content + '<script type="text/javascript">'+txt_script+'</script>');
                    //new Effect.Opacity(el, { from: 0, to: 1, duration: 1.5 });
                });
            }


            if (j2t_custom_cart != ''){
                $$('.'+j2t_custom_cart).each(function (el){
                    el.replace(full_cart_content + '<script type="text/javascript">'+txt_script+'</script>');
                });
            }


            var cart_side = '';
            if ($('j2t-temp-div').down('.cart_side_ajax')){
                cart_side = $('j2t-temp-div').down('.cart_side_ajax').innerHTML;
            }

            
            $$('.mini-cart').each(function (el){
                el.replace(cart_side);
                //new Effect.Opacity(el, { from: 0, to: 1, duration: 1.5 });
            });
            $$('.block-cart').each(function (el){
                el.replace(cart_side);
                //new Effect.Opacity(el, { from: 0, to: 1, duration: 1.5 });
            });

            if (j2t_custom_mini_cart != ''){
                $$('.'+j2t_custom_mini_cart).each(function (el){
                    el.replace(cart_side);
                });
            }
            
            processDeleteJsInject();
            $('j2t-temp-div').innerHTML = '';
            truncateOptions();
            replaceDelUrls();
            
            isLoading = false;
            hideJ2tOverlay(true);
            $('j2t-temp-div').innerHTML = '';
        }

    });
}


function getJ2TProductUrlJSON(url){
    var return_value = "";
    //var data = ajax_products_keys.evalJSON(true)
    if (typeof ajax_products_keys  != 'undefined'){
        ajax_products_keys.each(function (val){
            if (url_key_defined != ''){
                if (val.url_key == url_key_defined){
                    return_value = J2tVefirySecuredUrl(val.product_url)+"?j2tajaxcall=j2tajaxcheckout_product_view";
                }
            } else if (J2tVefirySecuredUrl(val.product_url_cart) == J2tVefirySecuredUrl(url)){
                return_value = J2tVefirySecuredUrl(val.product_url)+"?j2tajaxcall=j2tajaxcheckout_product_view";
            }
        });
    }
    return return_value;
}

function getJ2TProductDetailsJSON(url){
    var return_value = "";
    //var data = ajax_products_keys.evalJSON(true)
    if (url_key_defined != ''){
        return_value = url_key_defined;
    } else if (typeof ajax_products_keys  != 'undefined'){
        ajax_products_keys.each(function (val){
            if (J2tVefirySecuredUrl(val.product_url_cart) == J2tVefirySecuredUrl(url)){
                return_value = J2tVefirySecuredUrl(val.url_key);
            }
        });
    }
    
    return return_value;
}

function getJ2TUrlProductFastConfiguration(url) {
    var key = getJ2TProductDetailsJSON(url);
    url = J2tVefirySecuredUrl(url);
    var j2tReg = /(\/product\/([0-9]+)|options=cart)/;
    //j2tajaxcart_url_product_fast_configuration
    
    if (j2t_ajax_cart_fast_configuration_mode == 1){
        var url_option = getJ2TProductUrlJSON(url);
        if (url_option != ""){
            url = url_option;
        } else if (url.search(j2tReg) != -1) {
            var j2tMatches = url.match(j2tReg);
            if (url.search(/options=cart/i) != -1 && key == ''){
                var arr_url = url.split('/');
                //alert(arr_url[(arr_url.length - 1)]);
                var url_key = arr_url[(arr_url.length - 1)];
                url_key = url_key.replace('?options=cart','');
                url_key = url_key.replace('options=cart','');
                url_key = url_key.replace('.html','');
                //j2tMatches[1] = 'j2t-url-product-'+url_key;
                key = url_key;
            }

            //if (j2tMatches[1] != undefined){
            if (key != ''){
                //var url_product_fast_configuration =  j2tajaxcart_url_product_fast_configuration.replace('product_id', j2tMatches[1]);
                var url_product_fast_configuration =  j2tajaxcart_url_product_fast_configuration.replace('product_id', 'j2t-url-product-'+key);
                url = url_product_fast_configuration;
            } 
        }
    }
    return url;
}

function showJ2tProductDetails(url){
    var key = getJ2TProductDetailsJSON(url);
    url = J2tVefirySecuredUrl(url);
    $('j2t-product-details').innerHTML = '';
    var j2tReg = /(\/product\/([0-9]+)|options=cart)/;
    if (url.search(j2tReg) != -1) {
        //check if product has options
        //get product id
        var j2tMatches = url.match(j2tReg);
        
        if (url.search(/options=cart/i) != -1 && key == ''){
            var arr_url = url.split('/');
            //alert(arr_url[(arr_url.length - 1)]);
            var url_key = arr_url[(arr_url.length - 1)];
            url_key = url_key.replace('options=cart','');
            url_key = url_key.replace('.html','');
            //j2tMatches[1] = 'j2t-url-product-'+url_key;
            key = url_key;
        }
            
        //if (j2tMatches[1] != undefined){
        if (key != '') {
            if (j2t_ajax_cart_show_details == 1){
                waitProductDetails = true;
                //var url_product_details =  j2tajaxcart_url_product_details.replace('product_id', j2tMatches[1]);
                var url_product_details =  j2tajaxcart_url_product_details.replace('product_id', 'j2t-url-product-'+key);
                
                var url_post_details = url.replace('?options=cart','');
                
                url_product_details = J2tVefirySecuredUrl(url_product_details);
                url_post_details = J2tVefirySecuredUrl(url_post_details);
                
                var myAjax = new Ajax.Request(
                url_product_details,
                {
                    asynchronous: true,
                    method: 'post',
                    postBody: 'full_url='+url_post_details+'&current_store_id='+j2t_current_store_id,
                    parameters : 'full_url='+url_post_details+'&current_store_id='+j2t_current_store_id,
                    onException: function (xhr, e)
                    {
                        alert('Exception : ' + e);
                    },
                    onComplete: function (xhr)
                    {
                        var return_value = xhr.responseText;
                        //return return_value;
                        //j2t_ajax_cart_show_details
                        $('j2t-product-details').update(return_value);
                        /*$$('j2t-product-details').each(function (el){
                            el.update(return_value);
                        });*/
                        waitProductDetails = false;
                    }
                });
            } 
        }
    }
}

function showJ2tOverlay(){
    //new Effect.Appear($('j2t-overlay'), { duration: 0.5,  to: 0.8 });
    new Effect.Appear($('j2t-overlay'), { duration: 0.5,  to: j2t_ajax_cart_transparency });
    //new Effect.Appear($('j2t-overlay'), { duration: 0.5,  from: 0.0, to: 0.8 });
    
}

function hideJ2tOverlay(effect_load){
    j2tVerifyLoadingConfirmBox();
    if (!isLoading){
        $('j2t-overlay').hide();
        $('j2t_ajax_progress').hide();
        $('j2t_ajax_confirm').hide();
        if (effect_load && j2t_blink != ''){
            $$(j2t_blink).each(function (el) {Effect.Pulsate(el, { pulses: 1, duration: 0.5 });});
        }
	if (countdownInt != null){
            clearInterval(countdownInt);
        }
        countdown_val = j2t_ajax_cart_countdown;
    }
}


function j2tCenterWindow(element) {
     if($(element) != null) {

          // retrieve required dimensions
            var el = $(element);
            var elDims = el.getDimensions();
            var browserName=navigator.appName;
            if(browserName==="Microsoft Internet Explorer") {

                if(document.documentElement.clientWidth==0) {
                    //IE8 Quirks
                    //alert('In Quirks Mode!');
                    var y=(document.viewport.getScrollOffsets().top + (document.body.clientHeight - elDims.height) / 2);
                    var x=(document.viewport.getScrollOffsets().left + (document.body.clientWidth - elDims.width) / 2);
                }
                else {
                    var y=(document.viewport.getScrollOffsets().top + (document.documentElement.clientHeight - elDims.height) / 2);
                    var x=(document.viewport.getScrollOffsets().left + (document.documentElement.clientWidth - elDims.width) / 2);
                }
            }
            else {
                // calculate the center of the page using the browser andelement dimensions
                var y = Math.round(document.viewport.getScrollOffsets().top + ((window.innerHeight - $(element).getHeight()))/2);
                var x = Math.round(document.viewport.getScrollOffsets().left + ((window.innerWidth - $(element).getWidth()))/2);
            }
            // set the style of the element so it is centered
            var styles = {
                position: 'absolute',
                top: y + 'px',
                left : x + 'px'
            };
            el.setStyle(styles);
     }
}


function generateTemplateBox(content, box_w, box_h){
    //var use_template = true;
    //var box_width_height = 20;
    if (use_template){
        var middle_w = box_w - (box_width_height * 2);
        var middle_h = box_h + (box_width_height * 2);

        //$('j2t-div-template').down('.j2t-box-cm').innerHTML = content;
        $('j2t-div-template').down('.j2t-box-cm').innerHTML = '<div class="inner-ajax-content" id="j2t_inner_ajax_content" style="position:relative;">'+content+"</div>";

        $('j2t-div-template').down('.j2t-box-tl').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});
        $('j2t-div-template').down('.j2t-box-tm').setStyle({ 'float': 'left', 'width': middle_w+'px', 'height': box_width_height+'px'});
        $('j2t-div-template').down('.j2t-box-tr').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});

        $('j2t-div-template').down('.j2t-box-cl').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': middle_h+'px'});
        $('j2t-div-template').down('.j2t-box-cm').setStyle({ 'float': 'left', 'width': middle_w+'px', 'height': middle_h+'px'});
        $('j2t-div-template').down('.j2t-box-cr').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': middle_h+'px'});

        $('j2t-div-template').down('.j2t-box-bl').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});
        $('j2t-div-template').down('.j2t-box-bm').setStyle({ 'float': 'left', 'width': middle_w+'px', 'height': box_width_height+'px'});
        $('j2t-div-template').down('.j2t-box-br').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});

        content = $('j2t-div-template').innerHTML;
    } else {
        content = '<div class="inner-ajax-content" id="j2t_inner_ajax_content" style="position:relative;">'+content+"</div>";
    }
    return content;
}


function showLoading(){
    j2tVerifyLoadingConfirmBox();
    isLoading = true;
    showJ2tOverlay();
    var progress_box = $('j2t_ajax_progress');
    progress_box.show();
    progress_box.style.width = loadingW + 'px';
    progress_box.style.height = loadingH + 'px';

    //width : 320 height : 140
    //312 x 102

    if (use_template){
        progress_box.style.width = loadingW + (box_width_height * 2) + 'px';
        progress_box.style.height = loadingH + (box_width_height * 2) + 'px';
    }
    //alert($('j2t_ajax_progress').getWidth() +' et '+ $('j2t_ajax_progress').getHeight());

    $('j2t_ajax_progress').innerHTML = generateTemplateBox($('j2t-loading-data').innerHTML, $('j2t_ajax_progress').getWidth()-box_width_height, $('j2t_ajax_progress').getHeight()-(box_width_height*2));
    progress_box.style.position = 'absolute';
    
    var padding_height = $('j2t_ajax_progress').getHeight() / 2;
    padding_height -= $('j2t_ajax_progress').down('.j2t-ajax-child').getHeight() / 2;
    var styles = {
        paddingTop: Math.round(padding_height)+'px'
    };
    
    $('j2t_ajax_progress').down('.j2t-ajax-child').setStyle(styles);

    j2tCenterWindow(progress_box);
}


function showConfirm(){
    j2tVerifyLoadingConfirmBox();
    isLoading = false;
    showJ2tOverlay();
    $('j2t_ajax_progress').hide();
    var confirm_box = $('j2t_ajax_confirm');
    confirm_box.show();
    confirm_box.style.width = confirmW + 'px';
    confirm_box.style.height = confirmH + 'px';
    //j2t_ajax_confirm_wrapper
    if ($('j2t_ajax_confirm_wrapper') && $('j2t-upsell-product-table')){
        //alert($('j2t_ajax_confirm_wrapper').getHeight());
        confirm_box.style.height = $('j2t_ajax_confirm_wrapper').getHeight() + 'px';
        decorateTable('j2t-upsell-product-table');
    }

    if (use_template){
        confirm_box.style.width = $('j2t_ajax_confirm_wrapper').getWidth() + (box_width_height * 2) + 'px';
        confirm_box.style.height = $('j2t_ajax_confirm_wrapper').getHeight() + (box_width_height * 4) + 'px';
    }

    $('j2t_ajax_confirm_wrapper').replace('<div id="j2t_ajax_confirm_wrapper">'+generateTemplateBox($('j2t_ajax_confirm_wrapper').innerHTML, $('j2t_ajax_confirm_wrapper').getWidth(), $('j2t_ajax_confirm_wrapper').getHeight())+'<div>');
    
    
    if (j2t_show_close){
        $('j2t_ajax_confirm_wrapper').insert('<div id="j2t-closing-button" class="j2t-closing-button"><span>x</span></div>');
        $('j2t-closing-button').stopObserving();
        Event.observe($('j2t-closing-button'), 'click', function(){hideJ2tOverlay(true)});
    }
    
    

    confirm_box.style.position = 'absolute';
    j2tCenterWindow(confirm_box);
    $('j2t-div-template').down('.j2t-box-cm').innerHTML = "";
}


function correctSizeConfirm() {
    //$('j2t_ajax_confirm_wrapper').getWidth(), $('j2t_ajax_confirm_wrapper').getHeight()
    if ($('j2t_ajax_confirm_wrapper')){
        //alert($('j2t_ajax_confirm').style.display);
        if ($('j2t_ajax_confirm').style.display != "none"){
            
            var current_box_w = $('j2t_ajax_confirm').down('.inner-ajax-content').getWidth();
            var current_box_h = $('j2t_ajax_confirm').down('.inner-ajax-content').getHeight();
            
            //alert(current_box_h);

            if (saved_wrapper_h != current_box_h){
                saved_wrapper_w = current_box_w;
                saved_wrapper_h = current_box_h;
                var confirm_box = $('j2t_ajax_confirm');
                var confirm_wrapper_box = $('j2t_ajax_confirm');
                if (use_template){
                    var middle_w = $('j2t_ajax_confirm').getWidth() - (box_width_height * 2);
                    var middle_h = current_box_h-(box_width_height*2) + (box_width_height * 2);
                    
                    
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-tl').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-tm').setStyle({ 'float': 'left', 'width': middle_w+'px', 'height': box_width_height+'px'});
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-tr').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});

                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-cl').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': middle_h+'px'});
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-cm').setStyle({ 'float': 'left', 'width': middle_w+'px', 'height': middle_h+'px'});
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-cr').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': middle_h+'px'});

                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-bl').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-bm').setStyle({ 'float': 'left', 'width': middle_w+'px', 'height': box_width_height+'px'});
                    $('j2t_ajax_confirm_wrapper').down('.j2t-box-br').setStyle({ 'float': 'left', 'width': box_width_height+'px', 'height': box_width_height+'px'});

                    confirm_box.style.height = (box_width_height * 2) + middle_h + 'px';
                    confirm_wrapper_box.style.height = (box_width_height * 2) + middle_h + 'px';
                } else {
                    var middle_h = current_box_h-(box_width_height*2) + (box_width_height * 2);
                    confirm_box.style.height = $('j2t_ajax_confirm_wrapper').getHeight() + 'px';
                    confirm_wrapper_box.style.height = (box_width_height * 2) + middle_h + 'px';
                }
            }
        }
    }
}


Event.observe(window, 'resize', function(){
    var confirm_box = $('j2t_ajax_confirm');
    j2tCenterWindow(confirm_box);

    var progress_box = $('j2t_ajax_progress');
    j2tCenterWindow(progress_box);
});

Event.observe(window, 'scroll', function(){
    var confirm_box = $('j2t_ajax_confirm');
    j2tCenterWindow(confirm_box);

    var progress_box = $('j2t_ajax_progress');
    j2tCenterWindow(progress_box);
});

function reloadAjaxTopCart(){
    if (j2t_ajax_cart_show_headercart){
        var myAjax = new Ajax.Request(
        J2tVefirySecuredUrl(j2tajaxcart_url_header_cart),
        {
            asynchronous: true,
            method: 'post',
            postBody: '',
            onException: function (xhr, e)
            {
                alert('Exception : ' + e);
            },
            onComplete: function (xhr)
            {
                var return_value = xhr.responseText;
                
                var div = document.createElement('div');
                div.id = "tmp-j2t-element";
                div.style.display = "none";
                $$("body")[0].appendChild(div);
                
                if ($("tmp-j2t-element") && return_value){
                    $("tmp-j2t-element").innerHTML = return_value;

                    $("j2t-top-cart").update($("tmp-j2t-element").down(".j2t-top-cart").innerHTML);
                    $("tmp-j2t-element").remove();
                    truncateOptions();
                    replaceDelUrls();
                }
                
                Event.observe($("close-j2t-ajax-top"), 'click', function(event){
                    event.stop();
                    //new Effect.toggle($("j2t-top-cart"),'slide');
                    canDisplayTopCartJ2T = false;
                    canHideTopCartJ2T = false;
                    new Effect.SlideUp($("j2t-top-cart"), {limit:1, duration:0.2, afterFinish: function () { canHideTopCartJ2T = true; canDisplayTopCartJ2T = true; } });
                });
                
            }
        });
        
    }
}

Element.addMethods({
    clonePositionJ2T: function(element, source) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || { });

    source = $(source);
    var p = Element.viewportOffset(source);
    
    

    element = $(element);
    var delta = [0, 0];
    var parent = null;
    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = Element.getOffsetParent(element);
      delta = Element.viewportOffset(parent);
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }
    /*if (navigator.appVersion.indexOf('MSIE')>0){ 
        delta[0]-=source.offsetLeft; 
        delta[1]-=source.offsetTop; 
    }*/
    
    if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
    if (options.setHeight) element.style.height = source.offsetHeight + 'px';
    return element;
  }
});

var canAutoHideTopCartJ2T = true;
var canHideTopCartJ2T = true;
var canDisplayTopCartJ2T = true;
var hideCartTimer = null;

function hideTopCartArea(el){
    //var parent_up = el.up();
    Event.observe($("j2t-top-cart"), 'mouseout', function(event){
        event.stop();
        if ($("j2t-top-cart").style.display != 'none' && canHideTopCartJ2T){
            canDisplayTopCartJ2T = false;
            Element.clonePosition($("j2t-top-cart"), el, {setWidth: false, setHeight: false, setTop: false});
            new Effect.SlideUp($("j2t-top-cart"), {limit:1, duration:0.2, afterFinish: function () { canDisplayTopCartJ2T = true; }});
        }
    });
    Event.observe($("j2t-top-cart"), 'mouseover', function(event){
        canAutoHideTopCartJ2T = false;
        clearTimeout(hideCartTimer);
    });
}


function slideDownTopCart(link_el, cart_el){
    if ($(cart_el) && $(link_el)){
        if (hideCartTimer != null){
            canAutoHideTopCartJ2T = false;
            canHideTopCartJ2T = false;
            clearTimeout(hideCartTimer);
        }
        if (!$(cart_el).visible() && canDisplayTopCartJ2T && hideCartTimer == null){
            canAutoHideTopCartJ2T = false;
            canHideTopCartJ2T = false;
            canDisplayTopCartJ2T = false;
            $(cart_el).show();
            $(cart_el).style.visibility = 'hidden';
            Element.clonePosition($(cart_el), link_el, {setWidth: false, setHeight: false, setTop: false});
            $(cart_el).style.left = (parseInt($(cart_el).style.left) + headercart_left_adjust) + 'px';
            $(cart_el).style.top = (parseInt($(cart_el).style.top) + headercart_top_adjust) + 'px';
            $(cart_el).hide();
            $(cart_el).style.visibility = 'visible';
            new Effect.SlideDown($(cart_el), {limit:1, duration:0.2, afterFinish: function () { canDisplayTopCartJ2T = true; canAutoHideTopCartJ2T = true; canHideTopCartJ2T = true; } });
        }
    }
}

function slideUpTopCart(link_el, cart_el){
    if ($(cart_el) && $(link_el)){
        if (($(cart_el).visible() && canAutoHideTopCartJ2T && canHideTopCartJ2T) /*|| (hideCartTimer == null && $(cart_el).visible())*/ ){
            
            hideCartTimer = setTimeout(function(){
                if (canAutoHideTopCartJ2T && canHideTopCartJ2T){
                    canHideTopCartJ2T = false;
                    canDisplayTopCartJ2T = false;
                    canAutoHideTopCartJ2T = false;
                    Element.clonePosition($(cart_el), link_el, {setWidth: false, setHeight: false, setTop: false});
                    $(cart_el).style.left = (parseInt($(cart_el).style.left) + headercart_left_adjust) + 'px';
                    $(cart_el).style.top = (parseInt($(cart_el).style.top) + headercart_top_adjust) + 'px';
                    new Effect.SlideUp($(cart_el), {limit:1, duration:0.2, afterFinish: function () { hideCartTimer = null; canHideTopCartJ2T = true; canDisplayTopCartJ2T = true; canAutoHideTopCartJ2T = true; }});
                }
            },1000);
        } 
    }
}

function showHideTopCart(el){
    if (j2t_ajax_cart_appear_headercart == 'mouseover'){
        //var parent_up = el.up();
        Event.observe(el, 'mouseover', function(event){
            //canHideTopCartJ2T = false;
            event.stop();
            slideDownTopCart(el, $("j2t-top-cart"));
            Event.observe($("j2t-top-cart"), 'mouseleave', function(event){
                slideUpTopCart(el, $("j2t-top-cart"));
            });
        });
        /*Event.observe(el, 'mouseleave', function(event){
            slideUpTopCart(el, $("j2t-top-cart"));
        });*/

    } else {
        Event.observe(el, 'click', function(event){
            event.stop();
            if ($("j2t-top-cart")){
                if (!$("j2t-top-cart").visible()){
                    Element.clonePosition($("j2t-top-cart"), el, {setWidth: false, setHeight: false, setTop: false});
                    new Effect.toggle($("j2t-top-cart"),'slide');
                } else {
                    //IE Needs to have blocks that are displayed in order to be able to clonePosition
                    $("j2t-top-cart").show();
                    $("j2t-top-cart").style.visibility = 'hidden';
                    Element.clonePosition($("j2t-top-cart"), el, {setWidth: false, setHeight: false, setTop: false});
                    $("j2t-top-cart").hide();
                    $("j2t-top-cart").style.visibility = 'visible';
                    new Effect.toggle($("j2t-top-cart"),'slide');
                }
            }
            
        });
    }
}

function modifyTopLinkCartAjax(){
    if ($("j2t-top-cart")){
        var top_cart = $("j2t-top-cart").cloneNode(true);
        $$('.top-link-cart').each(function (el){
            el.stopObserving();
            showHideTopCart(el);
            $("j2t-top-cart").remove();
            Element.insert( el, {'after': top_cart} );
            Element.clonePosition($("j2t-top-cart"), el, {setWidth: false, setHeight: false, setTop: false});
        });
        if (j2t_custom_top_link != ''){
            $$('.'+j2t_custom_top_link).each(function (el){
                el.stopObserving();
                showHideTopCart(el);
                $("j2t-top-cart").remove();
                Element.insert( el, {'after': top_cart} );
                Element.clonePosition($("j2t-top-cart"), el, {setWidth: false, setHeight: false, setTop: false});
            });
        }
    }
    
    if ($("close-j2t-ajax-top")) {
        Event.observe($("close-j2t-ajax-top"), 'click', function(event){
            event.stop();
            //Element.clonePosition($("j2t-top-cart"), el, {setWidth: false, setHeight: false, setTop: false});
            //new Effect.toggle($("j2t-top-cart"),'slide');
            canDisplayTopCartJ2T = false;
            canHideTopCartJ2T = false;
            new Effect.SlideUp($("j2t-top-cart"), {limit:1, duration:0.2, afterFinish: function () { canHideTopCartJ2T = true; canDisplayTopCartJ2T = true; } });
        });
    }
}

function j2tVerifyLoadingConfirmBox() {
    if (!$("j2t_ajax_progress")) {
        $$('body')[0].insert(j_ajax_progess_box+j_ajax_confirm_box);
    }
}


function j2tLoadScript(sourceScript, callbackFunction) 
{
    var current_area = $$('head')[0];
    if (current_area)
    {
        var script = new Element('script', { type: 'text/javascript', src: sourceScript });
        //IE script
        var loadFunction = function()
            {
                if (this.readyState == 'complete' || this.readyState == 'loaded')
                {
                    callbackFunction(); 
                }
            };
        script.onreadystatechange = loadFunction;
        script.onload = callbackFunction;
        current_area.appendChild(script);
    }
}



function j2tVerifyLoadingJs(js_files, var_check) {
    var arr_files = js_files.split(',');
    if (var_check  == 'undefined'){
        var current_area;
        current_area = $$('head')[0];
        
        if (arr_files.length > 0){
            var i = 0;
            if (current_area)
            {
                var js_file = arr_files[i];
                i++;
                j2tLoadScript(js_file, function (){
                    if (arr_files[i] != undefined){
                        
                        js_file = arr_files.splice(1, arr_files.length-1).join(',');
                        //js_file = arr_files[i];
                        j2tVerifyLoadingJs(js_file, 'undefined');
                    }
                });
                
            }
        }
    }
}

document.observe("dom:loaded", function() {
    j2tVerifyLoadingConfirmBox();
    replaceDelUrls();
    replaceAddUrls();
    Event.observe($('j2t-overlay'), 'click', function(){hideJ2tOverlay(true)});
    
    modifyTopLinkCartAjax();

    var form = $('product_addtocart_form');
    var dont_process = false;
    if (form){
        if (form.action.search('/wishlist/index/') != -1){
            dont_process = true;
        }
    }
    if (!dont_process){
        var cartInt = setInterval(function(){
            if (typeof productAddToCartForm  != 'undefined'){
                if ($('j2t-overlay')){
                    Event.observe($('j2t-overlay'), 'click', function(){hideJ2tOverlay(true)});
                }
                productAddToCartForm.submit = function(url){
                    if (cookie_available == false && cookie_redirect == 1){
                        document.location.href = enable_cookie_url;
                    } else {
                        if(this.validator && this.validator.validate()){
                            sendcart('', 'form', 1, 'product_addtocart_form', false);
                        }
                    }
                    clearInterval(cartInt);
                    return false;
                }
            } else {
                clearInterval(cartInt);
            }
        },500);
    }

    setInterval(function(){ correctSizeConfirm(); },100);
    
    if(form && !dont_process){
        inputs = form.getInputs('file');

        if (inputs.length == 0){
            Event.observe("product_addtocart_form", "submit", function(event){
                event.stop();
            });
        } else {
            form.target = "j2t_upload_hidden";
            if (!$("j2t_upload_hidden")) {
                form.action = ($(form_name).action).replace('checkout/cart', 'j2tajaxcheckout/index/cart/cart');
                $$('body')[0].insert('<iframe id="j2t_upload_hidden" name="j2t_upload_hidden" src="" onload="j2tuploadDone(this);" style="width:0;height:0;border:0px solid #fff"></iframe>');
            }
        }
    }
    
    j2tVerifyLoadingJs(js_varien_product_url+','+js_bundle_url, typeof Product);
    j2tVerifyLoadingJs(js_varien_calendar_url+','+js_varien_calendar_setup_url, typeof Calendar);
    
    
    if (scp_on){
        if (!on_product_page){
            $$(".price-box .regular-price").each(function (el){
                el.id = 'outside-'+el.id;
            });
        }
        j2tVerifyLoadingJs(js_scp_url, typeof spConfig);
    }
    
});

function j2tuploadDone(frame) {   
   if (frame) {
       var ret = frame.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
       if (ret != ''){
           redrawBoxReturn(ret);
       }
  }
}

