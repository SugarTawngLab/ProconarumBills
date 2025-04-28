package customer.proconarumbill.handlers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import java.time.Instant;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.customerservice.Comments;

@Component
@ServiceName("CustomerService")
public class CommentServiceHandler implements EventHandler {

    @On(event = CqnService.EVENT_CREATE, entity = "CustomerService.Comments")
    public void onCreate(CdsCreateEventContext context, Comments comment) {
        comment.setCreatedAt(Instant.now());
        comment.setCreatedBy("ATrung");
    }

    @On(event = CqnService.EVENT_READ, entity = "AdminService.Comments")
    public void onRead(CdsReadEventContext context) {

    }
}
