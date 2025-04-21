using { my.billing as bill } from '../db/bills';

service CustomerService {
  entity Bills as projection on bill.Bills;
  entity Items as projection on bill.Items;
}
