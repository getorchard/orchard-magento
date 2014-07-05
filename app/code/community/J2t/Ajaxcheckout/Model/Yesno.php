<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2009 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */

class J2t_Ajaxcheckout_Model_Yesno
{

    public function toOptionArray()
    {
        if (version_compare(Mage::getVersion(), '1.4.0', '>=')){
            return array(
                array('value' => 1, 'label'=>Mage::helper('j2tajaxcheckout')->__('Yes (only for Magento 1.4.x or greater)')),
                array('value' => 0, 'label'=>Mage::helper('j2tajaxcheckout')->__('No')),
            );
        } else {
            return array(
                array('value' => 0, 'label'=>Mage::helper('j2tajaxcheckout')->__('No')),
            );
        }
        
    }

    /*public function toArray()
    {
        return array(
            0 => Mage::helper('j2tajaxcheckout')->__('No'),
            1 => Mage::helper('j2tajaxcheckout')->__('Yes'),
        );
    }*/

}
