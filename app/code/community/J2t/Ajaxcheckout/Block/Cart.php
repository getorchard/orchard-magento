<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2009 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */
 
class J2t_Ajaxcheckout_Block_Cart extends Mage_Catalog_Block_Product_Abstract
{

    public function __construct()
    {
        parent::__construct();
        $this->setTemplate('j2tajaxcheckout/ajaxcart.phtml');
    }

    protected function _prepareLayout()
    {
        parent::_prepareLayout();
    }

    public function getPagerHtml()
    {
        return $this->getChildHtml('pager');
    }

    public function getInviteButtonHtml()
    {
        return $this->getChildHtml('invite_button');
    }

    public function getBackUrl()
    {
        return $this->getUrl('customer/account/');
    }

    public function canShowUpsells()
    {
        return Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_show_upsells', Mage::app()->getStore()->getId());
    }

    public function getImageSize(){
        return str_replace("x",",",Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_upsells_image_size', Mage::app()->getStore()->getId()));
    }
    
    public function getNumberUpsells(){
        return Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_upsells_nb', Mage::app()->getStore()->getId());
    }
    
    public function getNumberUpsellsPerLine(){
        return Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_upsells_nb_per_line', Mage::app()->getStore()->getId());
    }

    
    public function getUpsells()
    {
        if ($product_id = $this->getProductInserted()){
            
            $test_other = Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_other_products', Mage::app()->getStore()->getId());
            switch ($test_other){
                
                case 'cross-sells':
                    $product = Mage::getModel('catalog/product')->load($product_id);
                    $collection = $product->getCrossSellProductCollection();
                    if (version_compare(Mage::getVersion(), "1.7.0", ">=")){
                        $collection->setPositionOrder('asc');
                    } else {
                        $collection->addAttributeToSort('position', 'asc');
                    }
                        
                    $collection->addStoreFilter();
                    $this->_addProductAttributesAndPrices($collection);
                    $collection->load();
                    break;
                case 'related-products':
                    $product = Mage::getModel('catalog/product')->load($product_id);
                    $collection = $product->getRelatedProductCollection();
                    if (version_compare(Mage::getVersion(), "1.7.0", ">=")){
                        $collection->setPositionOrder('asc');
                    } else {
                        $collection->addAttributeToSort('position', 'asc');
                    }
                        
                    $collection->addStoreFilter();
                    $this->_addProductAttributesAndPrices($collection);
                    $collection->load();
                    break;
                case 'up-sells':
                default:
                    $product = Mage::getModel('catalog/product')->load($product_id);
                    $collection = $product->getUpSellProductCollection();
                    if (version_compare(Mage::getVersion(), "1.7.0", ">=")){
                        $collection->setPositionOrder('asc');
                    } else {
                        $collection->addAttributeToSort('position', 'asc');
                    }
                        
                    $collection->addStoreFilter();
                    $this->_addProductAttributesAndPrices($collection);
                    $collection->load();
            }

            return $collection;
        }
        return false;
    }

    public function getProductInserted()
    {
        if(Mage::getSingleton('checkout/session')->getCartWasUpdated()){
            if ($product_id = Mage::getSingleton('checkout/session')->getCartInsertedItem()){
                return $product_id;
            }
        }
        Mage::getSingleton('checkout/session')->setCartInsertedItem('');
        return false;
    }

    public function j2tAddCartLink()
    {
        //if ($parentBlock = $this->getParentBlock()) {
            $count = $this->helper('checkout/cart')->getSummaryCount();
            $price = $this->helper('checkout')->formatPrice(Mage::getSingleton('checkout/cart')->getQuote()->getGrandTotal());

            $empty_string = Mage::getStoreConfig('j2tajaxcheckout/topcartconfig/top_cart_empty', Mage::app()->getStore()->getId());
            $one_string = Mage::getStoreConfig('j2tajaxcheckout/topcartconfig/top_cart_one', Mage::app()->getStore()->getId());
            $multiple_string = Mage::getStoreConfig('j2tajaxcheckout/topcartconfig/top_cart_multiple', Mage::app()->getStore()->getId());
            
            $empty_string = ($empty_string) ? $empty_string : 'My Cart';
            $one_string = ($one_string) ? $one_string : 'My Cart (%s item)';
            $multiple_string = ($multiple_string) ? $multiple_string : 'My Cart (%s items)';

            if( $count == 1 ) {
                $text = $this->__($one_string, $count, $price);
            } elseif( $count > 0 ) {
                $text = $this->__($multiple_string, $count, $price);
            } else {
                $text = $this->__($empty_string, $count, $price);
            }

            //$parentBlock->addLink($text, 'checkout/cart', $text, true, array(), 50, null, 'class="cart_content" id="cart_content"');
        //}
        //return $this;
        return $text;
    }
}
