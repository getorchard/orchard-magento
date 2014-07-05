<?php
/**
 * J2T-DESIGN.
 *
 * @category   J2t
 * @package    J2t_Ajaxcheckout
 * @copyright  Copyright (c) 2003-2009 J2T DESIGN. (http://www.j2t-design.com)
 * @license    OSL
 */

class J2t_Ajaxcheckout_Model_Ajaxloaderimg
{

    public function toOptionArray()
    {
        return array(
            array('value' => '', 'label'=>Mage::helper('j2tajaxcheckout')->__('Default')),
            array('value' => 'bar', 'label'=>Mage::helper('j2tajaxcheckout')->__('Bar')),
            
            array('value' => 'bar2', 'label'=>Mage::helper('j2tajaxcheckout')->__('Bar 2')),
            array('value' => 'bar3', 'label'=>Mage::helper('j2tajaxcheckout')->__('Bar 3')),
            array('value' => 'bert', 'label'=>Mage::helper('j2tajaxcheckout')->__('Bert')),
            array('value' => 'bert2', 'label'=>Mage::helper('j2tajaxcheckout')->__('Bert 2')),
            array('value' => 'big-roller', 'label'=>Mage::helper('j2tajaxcheckout')->__('Big Roller')),
            array('value' => 'bouncing-ball', 'label'=>Mage::helper('j2tajaxcheckout')->__('Bouncing Ball')),
            array('value' => 'circle', 'label'=>Mage::helper('j2tajaxcheckout')->__('Circle')),
            array('value' => 'flower', 'label'=>Mage::helper('j2tajaxcheckout')->__('Flower')),
            array('value' => 'indicator', 'label'=>Mage::helper('j2tajaxcheckout')->__('Indicator')),
            array('value' => 'indicator-big', 'label'=>Mage::helper('j2tajaxcheckout')->__('Indicator Big')),
            array('value' => 'kit', 'label'=>Mage::helper('j2tajaxcheckout')->__('Kit')),
            
            array('value' => 'snake', 'label'=>Mage::helper('j2tajaxcheckout')->__('Snake')),
            array('value' => 'squares', 'label'=>Mage::helper('j2tajaxcheckout')->__('Squares')),
            array('value' => 'squares-circle', 'label'=>Mage::helper('j2tajaxcheckout')->__('Squares Circle')),
            array('value' => 'wheel-throbber', 'label'=>Mage::helper('j2tajaxcheckout')->__('Wheel Throbber')),
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
