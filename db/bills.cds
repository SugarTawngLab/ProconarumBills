namespace my.billing;

using { managed } from '@sap/cds/common';

entity Bills : managed {
  key id        : UUID;
      title     : String;
      sumCharge : Decimal(10,2);
      desc      : String;
      status    : String;
      items     : Association to many Items on items.bill = $self;
}

entity Items {
  key id       : UUID;
      title    : String;
      category : String;
      charge   : Decimal(10,2);
      amount   : Integer;
      desc     : String;
      bill     : Association to Bills;
}
