<?php

class J2t_Ajaxcheckout_Block_Adminhtml_Field extends Mage_Adminhtml_Block_System_Config_Form_Field
{
    public function render(Varien_Data_Form_Element_Abstract $element)
    {
        $script = '<script type="text/javascript">var frontend_skin_url = "'.Mage::getDesign()->getSkinUrl('images', array('_area'=>'frontend')).'";</script>';
        return parent::render($element).$script;
    }

}
