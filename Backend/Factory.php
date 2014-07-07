<?php
/**
 * backend factory class for the addressbook
 *
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Factory.php 7539 2009-04-01 11:01:13Z p.schuele@metaways.de $
 */
/**
 * backend factory class for the addressbook
 *
 * An instance of the addressbook backendclass should be created using this class
 * $contacts = Addressbook_Backend_Factory::factory(Addressbook_Backend::$type);
 * currently implemented backend classes: Addressbook_Backend_Factory::Sql
 * currently planned backend classed: Addressbook_Backend_Factory::Ldap
 *
 * @package     Addressbook
 */
class Addressbook_Backend_Factory
{
    /**
     * object instance
     *
     * @var Addressbook_Backend_Factory
     */
    private static $_instance = NULL;
    
    /**
     * backend object instances
     */
    private static $_backends = array();
    
    /**
     * constant for Sql contacts backend class
     *
     */
    const SQL = 'sql';
    
    /**
     * constant for LDAP contacts backend class
     *
     */
    const LDAP = 'ldap';

    /**
     * constant for LDAP contacts backend class
     *
     */
    const SALUTATION = 'salutation';
    /**
     * constant for sopen membership backend class
     */
    const SO_MEMBER = 'so_member';
    /**
     * constant for sopen member fee categories
     */
    const SO_FEE_CATEGORY = 'so_fee_category';
    const SO_FEE_PAYMENT_INTERVAL = 'so_fee_payment_interval';
    const SO_FEE_PAYMENT_METHOD = 'so_fee_payment_method';
    const SO_ENTRY_REASON = 'so_entry_reason';
    const SO_TERMINATION_REASON = 'so_termination_reason';
    const SO_MEMBER_AFFILIATE = 'so_member_affiliate';
    const SO_COMMITTEE_FUNC = 'so_committee_func';
    const SO_CONTACT_TITLE = 'so_contact_title';
    
    /**
     * factory function to return a selected contacts backend class
     *
     * @param   string $_type
     * @return  Tinebase_Backend_Interface
     * @throws  Addressbook_Exception_InvalidArgument if unsupported type was given
     */
    static public function factory ($_type)
    {
        switch ($_type) {
            case self::SQL:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_Sql();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::LDAP:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_Ldap();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SALUTATION:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_Salutation();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_MEMBER:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoMember();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_FEE_CATEGORY:
            	if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoFeeCategory();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_FEE_PAYMENT_INTERVAL:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoFeePaymentInterval();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_FEE_PAYMENT_METHOD:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoFeePaymentMethod();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_ENTRY_REASON:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoEntryReason();
                }
                $instance = self::$_backends[$_type];
                break;
			case self::SO_TERMINATION_REASON:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoTerminationReason();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_MEMBER_AFFILIATE:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoMemberAffiliate();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_COMMITTEE_FUNC:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoCommitteeFunc();
                }
                $instance = self::$_backends[$_type];
                break;
            case self::SO_CONTACT_TITLE:
                if (!isset(self::$_backends[$_type])) {
                    self::$_backends[$_type] = new Addressbook_Backend_SoContactTitle();
                }
                $instance = self::$_backends[$_type];
                break;
            default:
                throw new Addressbook_Exception_InvalidArgument('Unknown backend type (' . $_type . ').');
                break;
        }
        return $instance;
    }
}
