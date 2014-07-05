<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2009 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */

class J2t_Ajaxcheckout_Model_Producturl extends Mage_Catalog_Model_Product_Url
{
    public function getUrl(Mage_Catalog_Model_Product $product, $params = array()){
        $url = $product->getData('url');
        if($params != array() && strpos("?", $url) === false && isset($params['_query'])){
            $product->unsetData('url');
        }
        $url = $product->getData('url');
        if (!empty($url)) {
            return $url;
        }
        return parent::getUrl($product, $params); 
    }
}
