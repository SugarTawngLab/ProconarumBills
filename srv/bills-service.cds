using { my.bill as bill } from '../db/bills';

service CustomerService {
  entity Requests as projection on bill.Requests;
  entity Bills as projection on bill.Bills;
  entity Comments as projection on bill.Comments;
}
