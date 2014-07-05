<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2009 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */

class J2t_Ajaxcheckout_Model_Appear
{

    public function toOptionArray()
    {
        return array(
            array('value' => 'mouseover', 'label'=>Mage::helper('j2tajaxcheckout')->__('On Mouse Over')),
            array('value' => 'click', 'label'=>Mage::helper('j2tajaxcheckout')->__('On Click')),
        );
    }

    /*public function toArray()
    {
        return array(
            0 => Mage::helper('j2tajaxcheckout')->__('No'),
            1 => Mage::helper('j2tajaxcheckout')->__('Yes'),
        );
    }*/

}
