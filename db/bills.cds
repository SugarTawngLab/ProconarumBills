using { cuid, managed } from '@sap/cds/common';

namespace my.bill;

entity ExpenseRequest: cuid, managed {
  description: String;
  longDescription: String;
  status: String enum {
    Draft;
    New;
    ReOpen;
    Rejected;
    Approved;
    Completed;
  };
  priority: String enum {
    Low;
    Enum;
    High;
  };
  dueDate: Date;
  currency: String;
  approvedBy: String;
  approvalDate: Date;

  expenseItems: Composition of many ExpenseItems on expenseItems.expenseRequest = $self;
  comments:  Composition of many Comments on comments.expenseRequest = $self;
}


entity ExpenseItems : cuid, managed {
  description: String;
  category: String enum {
    DailyMeal;
    OfficeManagement;
    Others;
  };
  billDate: Date;
  paymentMethod: String enum {
    BankTransfer;
    Cash;
  };
  vendor: String;
  currency: String;
  ammount: Decimal(10,2);
  remark: String;

  expenseRequest: Association to ExpenseRequest;
}

entity Attachments : cuid, managed {
  description: String;
  refUUID: UUID;
  fileId: String;
  fileName: String;
  fileSize: Integer;
  mimeType: String;
}

entity Comments : cuid, managed {
  content: String;

  expenseRequest: Association to ExpenseRequest;
}