<?php

class J2t_Ajaxcheckout_Model_Observer
{
    public function verifyGetprice($observer) {
        $block = $observer->getBlock();
        $active = Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_active', Mage::app()->getStore()->getId());
        if (!isset($block) || version_compare(Mage::getVersion(), "1.8.0", "<") || !$active) return;
        
        if ($block->getType() == 'catalog/product_list'){
            $observer->getTransport()->setHtml(Mage::app()->getLayout()->createBlock('j2tajaxcheckout/product_list')->setTemplate($block->getTemplate())->toHtml());
        } else if($block->getType() == 'bestsellers/bestsellers') {
            $observer->getTransport()->setHtml(Mage::app()->getLayout()->createBlock('j2tajaxcheckout/product_bestseller')->setTemplate($block->getTemplate())->toHtml());
        }
    }
    
    public function addCustomHandles($observer) {
        
        $action = $observer->getEvent()->getAction();
        $layout = $observer->getEvent()->getLayout();
 
        if($action->getRequest()->getControllerName() == 'product'
          && $action->getRequest()->getActionName() == 'view')
        {
            $j2tajaxcall = $action->getRequest()->j2tajaxcall;
            $j2tajaxcalloption = $action->getRequest()->options;
            
            $process_following = true;
            if ($j2tajaxcalloption == "cart" && !Mage::getStoreConfig('j2tajaxcheckout/default/j2t_ajax_cart_options', Mage::app()->getStore()->getId())){
                $process_following = false;
            }
            
            
            if (isset($j2tajaxcall) && $j2tajaxcall != '' && $process_following)
            {
                $update = $layout->getUpdate();
                /*$update->addUpdate('<reference name="root">
            <action method="setTemplate"><template>j2tajaxcheckout/1columnonly.phtml</template></action>
        </reference>');*/
                
                
                /*
                 * echo $this->getLayout()->createBlock('j2tajaxcheckout/productdetails')
                    ->setProduct($_product)
                    ->toHtml();
                 */
                $update->addUpdate('<reference name="root">
            <action method="setTemplate"><template>j2tajaxcheckout/1columnonly.phtml</template></action>
        </reference>
        <reference name="product.info">
            <action method="setTemplate">
                <template>j2tajaxcheckout/product/view.phtml</template>
            </action>
            <block type="catalog/product_view_media" name="product.info.media" as="media" template="j2tajaxcheckout/product/view/media.phtml"/>
        </reference>
        <reference name="product.info.bundle">
            <action method="setTemplate"><template>bundle/catalog/product/view/type/bundle.phtml</template></action>
        </reference>
        <reference name="product.info">
            <block type="j2tajaxcheckout/productdetails" name="product.j2t.details" as="j2t_product_details" template="j2tajaxcheckout/product_details.phtml"/>
        </reference>
        ');
                //$update->load($j2tajaxcall);
                $layout->generateXml();
                
                $layout->generateBlocks();
            }
        } 
        
        
        /*$update = Mage::getSingleton('core/layout')->getUpdate();
        $layout = $observer->getLayout();
        
        //echo '<pre>';
        //print_r($layout);
        //die;
        // If Magento finds that the current page is a product page
        if ($product = Mage::registry('current_product')) {
            //$update->addHandle('PRODUCT_TYPE_bundle');
        }
        else {
            return;
        }*/
    }
}