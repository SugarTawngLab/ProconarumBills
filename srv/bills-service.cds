using { my.bill as bill } from '../db/bills';

service CustomerService {
  entity Requests as projection on bill.ExpenseRequest;
  entity ExpenseItems as projection on bill.ExpenseItems;
  entity Comments as projection on bill.Comments;
  entity Attachments as projection on bill.Attachments;
}