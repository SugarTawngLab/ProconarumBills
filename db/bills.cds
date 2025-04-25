using { cuid, managed } from '@sap/cds/common';

namespace my.bill;

entity Requests : cuid, managed {
  title       : String;
  desc        : String;
  status      : String enum {
      New;
      Rejected;
      Approved;
      Paid;
  };
  urgent      : Boolean;
  urgentDate  : Date;

  Bills       : Composition of many Bills on Bills.request = $self;
  Comments    : Composition of many Comments on Comments.request = $self;
}

entity Bills : cuid {
  title       : String;
  attachImage : LargeBinary;
  category    : String enum {
      Daily_Meal;
      Office_M;
      Others;
  };
  charge      : Decimal(10,2);
  
  request     : Association to Requests;
}

entity Comments : cuid, managed {
  content     : String;

  request     : Association to Requests;
}