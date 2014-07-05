<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2013 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */
 
class J2t_Ajaxcheckout_Block_Product_Bestseller extends CapacityWebSolutions_Bestseller_Block_Bestseller
{
    public function getAddToCartUrl($product, $additional = array())
    {
        $product->unsUrl();
        return parent::getAddToCartUrl($product, $additional);
    }
}

