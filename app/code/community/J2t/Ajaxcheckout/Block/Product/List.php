<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2013 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */
 
class J2t_Ajaxcheckout_Block_Product_List extends Mage_Catalog_Block_Product_List
{
    public function getAddToCartUrl($product, $additional = array())
    {
        $product->unsUrl();
        return parent::getAddToCartUrl($product, $additional);
    }
}
