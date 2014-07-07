<?php
class Addressbook_Model_PostalAddress{
	private $co = null;
	private $street = null;
	private $postbox = null;
	//private $street2;
	private $number = null;
	private $postalCode = null;
	private $location = null;
	private $country = null;
	private $countryCode = null;
	private $lineBreak = null;
	private $aSuppressCountries = array();
	
	public function __construct(){
		$this->lineBreak = chr(13).chr(10);
	}
	
	public static function createFromArray(array $aAddress){
		$address = new self();
		$address->setFromArray($aAddress);
		return $address;
	}
	
	public function __toString(){
		return $this->toText();
	}
	
	public function setLineBreak($lineBreak){
		$this->lineBreak = $lineBreak;
	}
	
	public function toText($includeCountry = true, $suppressCountries = array( 'DE' )){
		$text = '';
		$text .= (strlen($this->getCo())>0?$this->getCo().$this->lineBreak:'');
		if(!$this->getUsePostBox()){
			$text .= (!is_null($this->getStreet())?$this->getStreet().(!is_null($this->getNumber())?' '.$this->getNumber():'').$this->lineBreak:'');
			$text .= (!is_null($this->getPostalCode())?$this->getPostalCode().(!is_null($this->getLocation())?' '.$this->getLocation():'').$this->lineBreak:'');
		}else{
			$text .= 'Postfach ' . $this->getPostBox().$this->lineBreak;
			$text .= (!is_null($this->getPostBoxPostalCode())?$this->getPostBoxPostalCode().(!is_null($this->getLocation())?' '.$this->getLocation():'').$this->lineBreak:'');
		}
		if(in_array($this->getCountryCode(), $suppressCountries)){
			return $text;
		}
		if($includeCountry && !in_array($this->getCountryCode(), $this->aSuppressCountries)){
			$text .= (!is_null($this->getCountry())?$this->getCountry().$this->lineBreak:'');
		}
		return $text;
	}
	
	public function setFromArray(array $aAddress){
		if(array_key_exists('co',$aAddress)){
			$this->setCo($aAddress['co']);
		}
		if(array_key_exists('street',$aAddress)){
			$this->setStreet($aAddress['street']);
		}
		if(array_key_exists('postbox',$aAddress)){
			$this->setPostBox($aAddress['postbox']);
		}
		if(array_key_exists('use_postbox',$aAddress)){
			$this->setUsePostBox($aAddress['use_postbox']);
		}
		if(array_key_exists('postbox_postalcode',$aAddress)){
			$this->setPostBoxPostalCode($aAddress['postbox_postalcode']);
		}
		if(array_key_exists('number',$aAddress)){
			$this->setNumber($aAddress['number']);
		}
		if(array_key_exists('street',$aAddress)){
			$this->setStreet($aAddress['street']);
		}
		if(array_key_exists('postalcode',$aAddress)){
			$this->setPostalCode($aAddress['postalcode']);
		}
		if(array_key_exists('location',$aAddress)){
			$this->setLocation($aAddress['location']);
		}		
		if(array_key_exists('country',$aAddress)){
			$this->setCountry($aAddress['country']);
		}
		if(array_key_exists('country_code',$aAddress)){
			$this->setCountryCode($aAddress['country_code']);
		}		
	}
	public function setCo($co){
		$this->co = $co;
	}
	public function getCo(){
		return $this->co;
	}
	public function setStreet($street){
		$this->street = $street;
	}
	public function getStreet(){
		return $this->street;
	}
	
	public function setNumber($number){
		$this->number = $number;
	}
	
	public function getNumber(){
		return $this->number;
	}
	
	public function setPostalCode($postalCode){
		$this->postalCode = $postalCode;
	}
	
	public function getPostalCode(){
		return $this->postalCode;
	}
	
	public function setPostBox($postBox){
		$this->postBox = $postBox;
	}
	
	public function getPostBox(){
		return $this->postBox;
	}
	
	public function setUsePostBox($postBox){
		$this->usePostBox = $postBox;
	}
	
	public function getUsePostBox(){
		return $this->usePostBox;
	}
	
	public function setPostBoxPostalCode($postBoxPostalCode){
		$this->postBoxPostalCode = $postBoxPostalCode;
	}
	
	public function getPostBoxPostalCode(){
		return $this->postBoxPostalCode;
	}
	
	public function setLocation($location){
		$this->location = $location;
	}
	
	public function getLocation(){
		return $this->location;
	}
	
	public function setCountry($country){
		$this->country = $country;
	}
	
	public function getCountry($defaultCountry = null){
		if((!$this->country || is_null($this->country) || $this->country=='') && !is_null($defaultCountry)){
			return $defaultCountry;
		}
		return $this->country;
	}
	
	public function setCountryCode($countryCode){
		$this->countryCode = $countryCode;
	}
	
	public function getCountryCode($default=null){
		if(!$this->countryCode && !is_null($default)){
			return $default;
		}
		return $this->countryCode;
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
	
}
?>