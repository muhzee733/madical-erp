import React from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button, ListGroup, ListGroupItem, Badge, Card, CardBody } from "reactstrap";

const CartOffcanvas = ({ isOpen, toggle, cartItems, onRemoveItem, onCheckout }) => {
  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="end">
      <OffcanvasHeader toggle={toggle}>
        <h5 className="mb-0">Appointment Cart</h5>
      </OffcanvasHeader>
      <OffcanvasBody>
        {cartItems.length === 0 ? (
          <div className="text-center text-muted">
            No appointments in cart
          </div>
        ) : (
          <>
            <ListGroup flush>
              {cartItems.map((item) => (
                <ListGroupItem key={item.id} className="p-0 mb-3">
                  <Card className="border shadow-none">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">
                            <span className="text-muted">Doctor:</span> Dr. {item.doctor}
                          </h6>
                          <Badge color="info" className="mb-2">
                            <span className="text-muted me-1">Type:</span> {item.slot_type}
                          </Badge>
                        </div>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                      <div className="appointment-details">
                        <div className="mb-2">
                          <label className="text-muted d-block mb-1">Date:</label>
                          <p className="mb-0">
                            <i className="ri-calendar-line me-2"></i>
                            {new Date(item.start_time).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mb-2">
                          <label className="text-muted d-block mb-1">Time:</label>
                          <p className="mb-0">
                            <i className="ri-time-line me-2"></i>
                            {new Date(item.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - {new Date(item.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <label className="text-muted d-block mb-1">Timezone:</label>
                          <p className="mb-0">
                            <i className="ri-global-line me-2"></i>
                            {item.timezone}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </ListGroupItem>
              ))}
            </ListGroup>
            <div className="mt-4">
              <Button
                color="primary"
                className="w-100"
                onClick={onCheckout}
              >
                <i className="ri-checkbox-circle-line me-2"></i>
                Checkout ({cartItems.length})
              </Button>
            </div>
          </>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default CartOffcanvas; 