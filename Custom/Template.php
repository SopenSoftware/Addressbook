<?php

class Addressbook_Custom_Template{
		
	public static function getContactData(array $dataObjects, &$textBlocks){
		// Datenobject Spender-Kontakt
		$contact = $dataObjects['contact'];
		$userContact = $dataObjects['userContact'];
		$drawee = $contact->getLetterDrawee();

		$bday = '';
		if($contact->__get('bday')){
			$bday = \org\sopen\app\util\format\Date::format($contact->__get('bday'));
		}
		
		$bankAccount = Billing_Api_BankAccount::getFromContact($contact);
		
		return array(
			'ADR_NR' => $contact->getId(),
			'BRIEFANREDE' => $contact->__get('letter_salutation'),
			'NAME' => $contact->__get('n_family'),
			'VORNAME' => $contact->__get('n_given'),
			'EMAIL' => $contact->__get('email'),
			'ADRESSE1' => array(
				'STRASSE' => $contact->__get('adr_one_street'),
				'ORT' => $contact->__get('adr_one_locality')
			),
			'GEBDAT' => $bday,
			'BIRTH' => $bday,
			'ANSCHRIFT' => array(
				'BRIEF' => $contact->getLetterDrawee()->toText(),
				'RECHNUNG' => $contact->getInvoiceDrawee()->toText()		
			),
			'ANREDE' => array(
				'DIREKT' => $contact->getLetterDrawee()->getSalutationText(true),
				'ANSCHRIFT' => $contact->getLetterDrawee()->getSalutationText()
			),
			'DATUM' => strftime('%d.%m.%Y'),
			'USER' => array(
				'FORENAME' => $userContact->__get('n_given'),
				'LASTNAME' => $userContact->__get('n_family'),
				'PHONE' => $userContact->__get('tel_work'),
				'FAX' =>  $userContact->__get('tel_fax'),
				'MAIL' =>  $userContact->__get('email')
			),
			'account_nr' => $bankAccount->getNumber(),
			'bank_code' => $bankAccount->getBankCode(),
			'bank_name' => $bankAccount->getBank(),
			'account_name' => $bankAccount->getName()
		);
	}
}

?>