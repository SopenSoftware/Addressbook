<?php
class Addressbook_Model_Drawee{
	const SALUTATION_MR = 1;
	const SALUTATION_MRS = 2;
	const SALUTATION_COMPANY = 3;
	private $postalAddress = null;
	private $lineBreak = null;
	private $isCompany = false;
	private $hasPerson = false;
	
	private $formOfAddress = null;
	private $aSuppressCountries = array();
	
	private $contactPerson = null;
	
	private $partnerForeName = null;
	private $partnerLastName = null;
	private $partnerTitle = null;
	
	/**
	 * 
	 * Fix drawee text if desired
	 * In this case, this fix text will be returned
	 * by toText()
	 * @var string
	 */
	private $draweeText = null;
	
	private static $salutationMap = array(
		1 => 'Herrn',
		2 => 'Frau',
		3 => '',
		4 => 'Herrn/Frau'
	);
	
	private static $nominativeSalutationMap = array(
		1 => 'Herr',
		2 => 'Frau',
		3 => 'Firma',
		4 => 'Herr und Frau'
	);
	
	private static $sexMap = array(
		1 => array('short' => 'm', 'code'=> 'MALE', 'long' => 'männlich'),
		2 => array('short' => 'w', 'code'=> 'FEMALE', 'long' => 'weiblich'),
		3 => array('short' => 'n', 'code'=> 'NEUTRAL', 'long' => 'neutral'),
		4 => array('short' => 'n', 'code'=> 'NEUTRAL', 'long' => 'neutral')
	);
	
	public function __construct(){
		$this->lineBreak = chr(13).chr(10);
	}
	public function setLineBreak($lineBreak){
		$this->lineBreak = $lineBreak;
		return $this;
	}
	
	public static function createFromArray(array $aDrawee, Addressbook_Model_PostalAddress $postalAddress = null){
		$drawee = new self();
		$drawee->setFromArray($aDrawee);
		$drawee->setPostalAddress($postalAddress);
		$drawee->analyze();
		return $drawee;
	}
	
	public static function createFromArrays(array $aDrawee, array $aPostalAddress){
		$postalAddress = Addressbook_Model_PostalAddress::createFromArray($aPostalAddress);
		$drawee = self::createFromArray($aDrawee, $postalAddress);
		return $drawee;
	}
	
	public function setFromArray($aDrawee){
		/*if(array_key_exists('',$aDrawee)){
			$this->set($aDrawee['']);
		}*/
		if(array_key_exists('salutation',$aDrawee)){
			$this->setSalutation($aDrawee['salutation']);
		}
		if(array_key_exists('form_of_address',$aDrawee)){
			$this->setFormOfAddress($aDrawee['form_of_address']);
		}
		if(array_key_exists('company1',$aDrawee)){
			$this->setCompany1($aDrawee['company1']);
		}
		if(array_key_exists('company2',$aDrawee)){
			$this->setCompany2($aDrawee['company2']);
		}		
		if(array_key_exists('company3',$aDrawee)){
			$this->setCompany3($aDrawee['company3']);
		}	
		if(array_key_exists('title',$aDrawee)){
			$this->setTitle($aDrawee['title']);
		}
		if(array_key_exists('forename',$aDrawee)){
			$this->setForeName($aDrawee['forename']);
		}
		if(array_key_exists('lastname',$aDrawee)){
			$this->setLastName($aDrawee['lastname']);
		}
		
		if(array_key_exists('partner_salutation',$aDrawee)){
			$this->setPartnerSalutation($aDrawee['partner_salutation']);
		}
		if(array_key_exists('partner_title',$aDrawee)){
			$this->setPartnerTitle($aDrawee['partner_title']);
		}
		if(array_key_exists('partner_forename',$aDrawee)){
			$this->setPartnerForeName($aDrawee['partner_forename']);
		}
		if(array_key_exists('partner_lastname',$aDrawee)){
			$this->setPartnerLastName($aDrawee['partner_lastname']);
		}
	}
	
	public function setIsCompany(){
		$this->isCompany = true;
	}
	
	public function setIsPerson(){
		$this->isCompany = false;
	}
	
	public function setHasPerson($fPerson){
		$this->hasPerson = $fPerson;
	}
	
	public function isCompany(){
		return $this->isCompany;
	}
	
	public function isPerson(){
		return !$this->isCompany;
	}
	
	public function hasPerson(){
		return $this->hasPerson;
	}
	
	public function setPostalAddress(Addressbook_Model_PostalAddress $postalAddress){
		$this->postalAddress = $postalAddress;
	}
	
	public function getPostalAddress(){
		return $this->postalAddress->suppressCountries($this->aSuppressCountries);
	}
	
	public function setCompany1($company1){
		$this->company1 = $company1;
	}
	
	public function getCompany1(){
		return $this->company1;
	}
	
	public function setCompany2($company2){
		$this->company2 = $company2;
	}
	
	public function getCompany2(){
		return $this->company2;
	}
	
	public function setCompany3($company3){
		$this->company3 = $company3;
	}
	
	public function getCompany3(){
		return $this->company3;
	}
	
	public function getCompanyTotal(){
		return $this->getCompany1().' '.$this->getCompany2().' '.$this->getCompany3();
	}
	
	public function setSalutation($salutation){
		$this->salutation = $salutation;
	}
	
	public function getSalutation(){
		return $this->salutation;
	}
	
	public function setPartnerSalutation($salutation){
		$this->partnerSalutation = $salutation;
	}
	
	public function getPartnerSalutation(){
		return $this->partnerSalutation;
	}
	
	public function setContactPerson(Addressbook_Model_ContactPerson $contactPerson){
		$this->contactPerson = $contactPerson;
		return $this;
	}
	
	public function hasContactPerson(){
		return !is_null($this->contactPerson);
	}
	
	/**
	 * 
	 * Set black list of country codes (like DE, UK etc.) which are not going
	 * to be printed with toText()
	 * @param array $aCountries
	 */
	public function suppressCountries(array $aCountries){		
		$this->aSuppressCountries = $aCountries;
		return $this;
	}
	
	public function setFormOfAddress($formOfAddress){
		$this->formOfAddress = $formOfAddress;
	}
	
	public function getFormOfAddress(){
		return $this->formOfAddress;
	}
	
	public function getSexLong(){
		$salId = $this->getSalutation();
		if(array_key_exists($salId, self::$sexMap)){
			return self::$sexMap[$salId]['long'];
		}
		return 'neutral';
	}

	public function getSexCode(){
		$salId = $this->getSalutation();
		if(array_key_exists($salId, self::$sexMap)){
			return self::$sexMap[$salId]['code'];
		}
		return 'NEUTRAL';
	}
	
	public function getSexShort(){
		$salId = $this->getSalutation();
		if(array_key_exists($salId, self::$sexMap)){
			return self::$sexMap[$salId]['short'];
		}
		return 'n';
	}
	
	public function getSalutationText($nominative = false){
		$salId = $this->getSalutation();
		if(!$nominative){
			// manually typed form of address overrides every generated form
			if(strlen($this->getFormOfAddress())>0){
				return $this->getFormOfAddress();
			}
			if(array_key_exists($salId, self::$salutationMap)){
				return self::$salutationMap[$salId];
			}
		}else{
			if(array_key_exists($salId, self::$nominativeSalutationMap)){
				return self::$nominativeSalutationMap[$salId];
			}
		}
		return null;
	}
	
	
	
	public function getPartnerSexLong(){
		$salId = $this->getPartnerSalutation();
		if(array_key_exists($salId, self::$sexMap)){
			return self::$sexMap[$salId]['long'];
		}
		return 'neutral';
	}

	public function getPartnerSexCode(){
		$salId = $this->getPartnerSalutation();
		if(array_key_exists($salId, self::$sexMap)){
			return self::$sexMap[$salId]['code'];
		}
		return 'NEUTRAL';
	}
	
	public function getPartnerSexShort(){
		$salId = $this->getPartnerSalutation();
		if(array_key_exists($salId, self::$sexMap)){
			return self::$sexMap[$salId]['short'];
		}
		return 'n';
	}
	
	public function getPartnerSalutationText($nominative = false){
		$salId = $this->getPartnerSalutation();
		if(!$nominative){
			// manually typed form of address overrides every generated form
			if(strlen($this->getFormOfAddress())>0){
				return $this->getFormOfAddress();
			}
			if(array_key_exists($salId, self::$salutationMap)){
				return self::$salutationMap[$salId];
			}
		}else{
			if(array_key_exists($salId, self::$nominativeSalutationMap)){
				return self::$nominativeSalutationMap[$salId];
			}
		}
		return null;
	}
	
	public function setForeName($foreName){
		$this->foreName = $foreName;
	}
	
	public function getForeName(){
		return $this->foreName;
	}
	
	public function setLastName($lastName){
		$this->lastName = $lastName;
	}
	
	public function getLastName(){
		return $this->lastName;
	}
	
	public function setTitle($title){
		$this->title = $title;
	}
	
	public function getTitle(){
		return $this->title;
	}
	
	public function setPartnerForeName($foreName){
		$this->partnerForeName = $foreName;
	}
	
	public function getPartnerForeName(){
		return $this->partnerForeName;
	}
	
	public function setPartnerLastName($lastName){
		$this->partnerLastName = $lastName;
	}
	
	public function getPartnerLastName(){
		return $this->partnerLastName;
	}
	
	public function setPartnerTitle($title){
		$this->partnerTitle = $title;
	}
	
	public function getPartnerTitle(){
		return $this->partnerTitle;
	}
	
	public function hasPartner(){
		return ($this->partnerLastName != '')&&(!is_null($this->partnerLastName ));
	}
	
	
	public function setFixDraweeText($draweeText){
		$this->draweeText = $draweeText;
	}
	
	public function analyze(){
		if($this->getLastName() && !$this->getCompany1()){
			$this->setIsPerson();
		}
		if(!is_null($this->getCompany1())){
			$this->setIsCompany();
			if($this->getLastName()){
				$this->setHasPerson(true);
			}
		}
	}
	
	public function getQualifiedNames(){
		$name = '';
		//$name .= ($this->getSalutationText()?$this->getSalutationText().' ':'');
		$name .= $this->getQualifiedName();
		if($this->hasPartner()){
			$name .= 'und '.$this->getQualifiedPartnerName();
		}
		return $name;
	}
	
	public function getQualifiedName(){
		$this->analyze();
		$name = null;
		if($this->hasPerson() && $this->getSalutation() != self::SALUTATION_COMPANY){
	 		$name .= ($this->getSalutationText(true)?$this->getSalutationText(true).' ':'');
	 	}
	 	$name .= ($this->getTitle()?$this->getTitle().' ':'');
		$name .= ($this->getForeName()?$this->getForeName().' ':'');
		$name .= ($this->getLastName()?$this->getLastName().' ':'');
		return $name;
	}
	
	public function getQualifiedPartnerName(){
		$this->analyze();
		$name = null;
		if($this->getPartnerSalutation() != self::SALUTATION_COMPANY){
	 		$name .= ($this->getPartnerSalutationText(true)?$this->getPartnerSalutationText(true).' ':'');
	 	}
	 	$name .= ($this->getPartnerTitle()?$this->getPartnerTitle().' ':'');
		$name .= ($this->getPartnerForeName()?$this->getPartnerForeName().' ':'');
		$name .= ($this->getPartnerLastName()?$this->getPartnerLastName().' ':'');
		return $name;
	}
	
	public function getPersonName(){
		$name = '';
		$name .= ($this->getForeName()?$this->getForeName().' ':'');
		$name .= ($this->getLastName()?$this->getLastName().' ':'');
		return $name;
	}
	
	public function toText(){
		if(!is_null($this->draweeText)){
			return $this->draweeText;
		}
		
		$this->analyze();
		$text = '';
		if($this->isPerson()){
			$text .= ($this->getSalutationText()?$this->getSalutationText().$this->lineBreak:$this->lineBreak);
			$name = '';
			$name .= ($this->getTitle()?$this->getTitle().' ':'');
			$name .= ($this->getForeName()?$this->getForeName().' ':'');
			$name .= ($this->getLastName()?$this->getLastName().' ':'');
			
			if($this->hasPartner()){
				$name .=$this->lineBreak;
	 			$name .= ($this->getPartnerTitle()?$this->getPartnerTitle().' ':'');
				$name .= ($this->getPartnerForeName()?$this->getPartnerForeName().' ':'');
				$name .= ($this->getPartnerLastName()?$this->getPartnerLastName().' ':'');
			}
			
		 	$text .= (($name!='')?$name.$this->lineBreak:'');
		}elseif($this->isCompany()){
			if(!$this->hasPerson() || $this->getSalutation() == self::SALUTATION_COMPANY){
				$text .= ($this->getSalutationText()?$this->getSalutationText().$this->lineBreak:'');
			}
		 	$text .= ($this->getCompany1()?$this->getCompany1().$this->lineBreak:'');
		 	$text .= ($this->getCompany2()?$this->getCompany2().$this->lineBreak:'');
		 	$text .= ($this->getCompany3()?$this->getCompany3().$this->lineBreak:'');
		 	$name = '';
		 	
		 	if(!$this->hasContactPerson()){
			 	if($this->hasPerson() && $this->getSalutation() != self::SALUTATION_COMPANY){
			 		$name .= ($this->getSalutationText()?$this->getSalutationText().$this->lineBreak:'');
			 	}
			 	
			 	$name .= ($this->getTitle()?$this->getTitle().' ':'');
				$name .= ($this->getForeName()?$this->getForeName().' ':'');
				$name .= ($this->getLastName()?$this->getLastName().' ':'');
				
		 		if($this->hasPartner()){
		 			$name .=$this->lineBreak;
			 		$name .= ($this->getPartnerTitle()?$this->getPartnerTitle().' ':'');
					$name .= ($this->getPartnerForeName()?$this->getPartnerForeName().' ':'');
					$name .= ($this->getPartnerLastName()?$this->getPartnerLastName().' ':'');
			 	}
				
		 	}else{
		 		$cpName = $this->contactPerson->__get('name');
		 		$cpUnit = $this->contactPerson->__get('unit');
		 		
				$name .= ($cpUnit?$cpUnit.$this->lineBreak:'');
				$name .= ($cpName?$cpName:'');
			}
			
			$text .= (($name!='')?$name.$this->lineBreak:'');
		}
		$this->postalAddress->setLineBreak($this->lineBreak);
		$text .= $this->getPostalAddress()->toText();
		return $text;
	}
}
?>