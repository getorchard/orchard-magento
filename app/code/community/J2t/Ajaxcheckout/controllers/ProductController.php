<?php
require_once 'Mage/Catalog/controllers/ProductController.php';
class J2t_Ajaxcheckout_ProductController extends Mage_Catalog_ProductController
{
    public function viewAction()
    {
        parent::viewAction();
    }
    
    
    public function indexAction()
    {   
        
        $id = $this->getRequest()->getParam('id');
        //echo $id;
        //die;
        if (!is_numeric($id)){
            $base_url = Mage::getBaseUrl();
            //$full_url = $this->getRequest()->getParam('full_url');
            //$path = str_replace($base_url, '', $full_url);
            
            
            $store_id = $this->getRequest()->getParam('current_store_id');
            
            //http://127.0.0.1/magento_tests_1_7_0_0/french/j2tajaxcheckout/product/index/id/j2t-url-product-coalesce-functioning-on-impatience-t-shirt/current_store_id/3/
            
            $path = str_replace("j2t-url-product-","",$id);
            
            $url_rewrite = Mage::getModel('core/url_rewrite')->setStoreId($store_id)->loadByRequestPath($path);
            if ($product_id = $url_rewrite->getProductId()){
                $product = Mage::getModel('catalog/product')->load($product_id);
            } else {
                $id = str_replace('j2t-url-product-','', $id);
                $product = Mage::getModel('catalog/product')->loadByAttribute('url_key', $id);
            }
            
        } else {
            $product = Mage::getModel('catalog/product')->load($id);
        }
        if (is_object($product) && $product->getId()){
            /*echo $this->getLayout()->createBlock('j2tajaxcheckout/productdetails')
                    ->setProduct($_product)
                    ->toHtml();*/
            //$id = $this->getRequest()->getParam('id');
            //$product = Mage::getModel('catalog/product')->load($id);

            $categoryId = (int) $this->getRequest()->getParam('category', false);
            $productId  = (int) $product->getId();

            //if (version_compare(Mage::getVersion(), '1.5.0', '>=')){
                $params = new Varien_Object();
                $params->setCategoryId($categoryId);
                
                
                /*$layout = Mage::getSingleton('core/layout');
                $layout->getUpdate()->addUpdate('<reference name="product.info.bundle">
                    <action method="setTemplate"><template>bundle/catalog/product/view/type/bundle.phtml</template></action>
                </reference>');
                $layout->getUpdate()->addHandle('PRODUCT_TYPE_bundle');*/
                
                $viewHelper = Mage::helper('catalog/product_view');
                $viewHelper->prepareAndRender($productId, $this, $params);
                //product.info.bundle
                
                //$update = $layout->getUpdate();
                //$update->addHandle('PRODUCT_TYPE_bundle');
            /*} else {
                Mage::register('current_product', $product);
                Mage::register('product', $product);
            }*/
        } else {
            echo $this->__('Cannot find item');
            exit;
        }
    }
    
    public function topcartAction()
    { 
        
        $this->loadLayout();
        $this->renderLayout();
        
        /*$Block = Mage::getSingleton('core/layout');
        //$block_sidecart = $Block->createBlock('checkout/cart_sidebar')->setTemplate("j2tajaxcheckout/topcart.phtml")->toHtml();
        $block_sidecart = $Block->createBlock('checkout/cart_sidebar')->setTemplate("checkout/cart/sidebar.phtml")->toHtml();
        echo $block_sidecart;*/
        
        /*$block = Mage::getSingleton('core/layout')
            ->createBlock("checkout/cart_sidebar")
            ->setTemplate("j2tajaxcheckout/topcart.phtml");
        echo $block->toHtml();*/
        
        /*echo Mage::getSingleton('core/layout')->createBlock('checkout/cart_sidebar', "top_cart")
                    ->setTemplate('j2tajaxcheckout/topcart.phtml')
                    ->toHtml();*/
        //die;
    }
    
}
